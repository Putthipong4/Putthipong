const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

router.post("/SelectSeats", async (req, res) => {
  const { Seat_Number, ShowDate_id, Member_id, Concert_id, Price } = req.body;

  try {
    const [existingSeats] = await db.promise().query(
      "SELECT COUNT(*) as count FROM `order` WHERE Member_id = ? AND ShowDate_id = ? AND Price is NOT NULL",
      [Member_id, ShowDate_id]
    );

    const alreadyBooked = existingSeats[0].count;
    const newBooking = Seat_Number.length;

    if (alreadyBooked + newBooking > 4) {
      return res.json({
        success: false,
        message: "ไม่สามารถจองเกิน 4 ที่นั่งต่อรอบการแสดงได้",
      });
    }

    const [lastOrderRow] = await db
      .promise()
      .query("SELECT Order_id FROM `order` ORDER BY Order_id DESC LIMIT 1");

    let newOrderId = "O01";
    if (lastOrderRow.length > 0) {
      const lastId = lastOrderRow[0].Order_id;
      const numericPart = parseInt(lastId.substring(1));
      newOrderId = "O" + (numericPart + 1).toString().padStart(2, "0");
    }

    for (let i = 0; i < Seat_Number.length; i++) {
      const seat = Seat_Number[i];

      await db.promise().query(
        "INSERT INTO `order` (Order_id, Seat_Number, Order_date, Order_time, Concert_id, ShowDate_id, Member_id ,Price ,Status_id ) VALUES (?, ?, CURRENT_DATE, CURRENT_TIME, ?, ?, ?, ?, ?)",
        [newOrderId, seat, Concert_id, ShowDate_id, Member_id, Price, "S001"]
      );

      await db.promise().query(
        "UPDATE `showdateandseat` SET Status = ? WHERE Seat_Number = ? AND ShowDate_id = ? ",
        ["จองแล้ว", seat, ShowDate_id]
      );
    }

    res.json({
      success: true,
      message: "บันทึกข้อมูลสำเร็จ",
      orderId: newOrderId,
    });
  } catch (err) {
    console.error("Error Accept IDCARD:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error: err });
  }
});

router.post("/AcceptIdcard", async (req, res) => {
  const { IDCARD, Seat_Number, ShowDate_id } = req.body;

  try {

    let orderId = null; // ✅ ประกาศตัวแปรไว้ก่อน

    for (let i = 0; i < Seat_Number.length; i++) {
      const seat = Seat_Number[i];
      const idcard = IDCARD[i];

      // อัปเดตเลขบัตรในแต่ละที่นั่ง
      await db.promise().query(
        "UPDATE `order` SET IDCARD = ? WHERE Seat_Number = ? AND ShowDate_id = ?",
        [idcard, seat, ShowDate_id]
      );

      // ✅ ดึง orderId จากแถวที่อัปเดตล่าสุด (อาจใช้ SELECT ก็ได้)
      const [rows] = await db
        .promise()
        .query(
          "SELECT Order_id FROM `order` ORDER BY Order_id DESC LIMIT 1",
          [seat, ShowDate_id]
        );

      if (rows.length > 0) {
        orderId = rows[0].Order_id; // เก็บค่า orderId ล่าสุด
      }
    }

    res.json({
      success: true,
      message: "บันทึกข้อมูลสำเร็จ",
      orderId, // ✅ ตอนนี้มีค่าแล้ว
      statusId: 1, // ✅ ใส่ค่า status (หรือดึงจาก DB ก็ได้)
    });
  } catch (err) {
    console.error("Error Accept IDCARD:", err);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: err,
    });
  }
});


router.put("/CancelOrder", async (req, res) => {
  const { Seat_Number, Order_id, ShowDate_id } = req.body;

  try {


    //  อัปเดต order เป็นยกเลิก
    await db.promise().query(
      "UPDATE `order` SET Price = ?, People_cancel = ?, Status_id = ? WHERE Order_id = ? ",
      [null, "System", "S004", Order_id]
    );

    for (let i = 0; i < Seat_Number.length; i++) {
      const seat = Seat_Number[i];
      await db.promise().query(
        "UPDATE `showdateandseat` SET Status = ? WHERE Seat_Number = ? AND ShowDate_id = ? ",
        ["ว่าง", seat, ShowDate_id]
      );
    }
    res.json({
      success: true,
      message: "ยกเลิกคำสั่งซื้อสำเร็จ",
    });
  } catch (err) {
    console.error("Error Cancel:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error: err });
  }
});



router.get("/MyTicket/:memberId", authenticateToken, async (req, res) => {
  const { memberId } = req.params;
  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        o.Order_id,
        o.Price,
        s.Status_Name,
        sd.ShowDate,
        sd.ShowStart,
        c.ConcertName,
        c.Concert_id, 
        o.ShowDate_id,
        o.Rating, 
        sd.ShowStart,
        s.Status_id,
        sd.ShowTime,
        CONCAT(o.Order_date, ' ', o.Order_time) AS order_datetime,
        GROUP_CONCAT(o.Seat_Number ORDER BY o.Seat_Number SEPARATOR ', ') AS Seat_Number,
        CONCAT(sd.ShowDate, ' ',sd.ShowStart) as ShowDateTime
      FROM \`order\` o
      JOIN status s ON o.Status_id = s.Status_id
      JOIN showdate sd ON o.ShowDate_id = sd.ShowDate_id
      JOIN concert c ON sd.Concert_id = c.Concert_id
      WHERE o.Member_id = ? 
      GROUP BY o.Order_id, o.Price, s.Status_Name, sd.ShowDate, sd.ShowStart, c.ConcertName
      ORDER BY s.Status_id ASC;
      `,
      [memberId]
    );

    const tickets = rows.map(ticket => {
      const orderTime = new Date(ticket.order_datetime);
      const expireTime = new Date(orderTime.getTime() + 2 * 60 * 1000);
      return {
        ...ticket,
        expireTime: expireTime.toISOString()
      };
    });

    res.json({ success: true, data: tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});



const generatePayload = require("promptpay-qr");
const QRCode = require("qrcode");

router.get("/GenerateQR/:totalPrice", async (req, res) => {
  try {
    const amount = parseFloat(req.params.totalPrice);
    console.log("Amount:", amount);

    //  ใช้ promptpay-qr
    const payload = generatePayload("0623543667", { amount });
    console.log("Payload:", payload);

    //  สร้าง QR image (base64)
    const qrImage = await QRCode.toDataURL(payload);
    res.json({ qrImage });
  } catch (err) {
    console.error("QR Error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get("/Order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.promise().query("SELECT CONCAT(Order_date, ' ', Order_time) AS order_datetime FROM `order` WHERE Order_id = ?", [id]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "Order not found" });
    }

    const order = rows[0];

    // ✅ คำนวณ expireTime ฝั่ง backend
    const isoDateTime = order.order_datetime.replace(" ", "T");
    const orderTime = new Date(isoDateTime);
    const expireTime = new Date(orderTime.getTime() + 2 * 60 * 1000);

    res.json({
      success: true,
      data: {
        ...order,
        expireTime: expireTime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/payment");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));

router.post("/Payment", upload.single("Slip"), async (req, res) => {
  try {
    const { Order_id, Slip_date, Slip_time } = req.body;
    const Slip_file = req.file?.originalname;

    const now = new Date();
    const receiptDate = now.toISOString().split("T")[0];

    const [result] = await db.promise().query(
      "INSERT INTO `receipt` (Slip_file, Slip_date, Slip_time, Receipt_date) VALUES (?,?,?,?)",
      [Slip_file, Slip_date, Slip_time, receiptDate]
    );

    // ดึงค่า Receipt_id ที่เพิ่ง insert มา
    const newReceiptId = result.insertId;

    // อัปเดต order ให้ผูกกับ receipt นี้
    await db.promise().query(
      "UPDATE `order` SET Receipt_id = ?, Status_id = ? WHERE Order_id = ?",
      [newReceiptId, "S002", Order_id]
    );

    res.status(200).send({
      success: true,
      message: "added successfully",
      slipUrl: `/uploads/payment/${Slip_file}`,
      receiptId: newReceiptId,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

router.get("/MemberSeats/:Member_id/:ShowDate_id", authenticateToken, async (req, res) => {
  const { Member_id, ShowDate_id } = req.params;
  try {
    const [rows] = await db.promise().query(
      "SELECT COUNT(*) as count FROM `order` WHERE Member_id = ? AND ShowDate_id = ? AND Price IS NOT NULL",
      [Member_id, ShowDate_id]
    );
    res.json({ success: true, count: rows[0].count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error", error: err });
  }
});

router.get("/AllOrder", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        o.Order_id,
        GROUP_CONCAT(o.Seat_Number) AS Seat_Number,   
        COUNT(o.Seat_Number) AS totalseat,           
        SUM(o.Price) AS totalprice,                   
        m.Email,
        m.Firstname,
        m.Telephone,
        c.ConcertName,
        c.Poster,
        sd.ShowDate,
        sd.ShowStart,
        s.Status_Name,
        s.Status_id,
        r.Slip_file
      FROM \`order\` o
      JOIN concert c ON o.Concert_id = c.Concert_id
      JOIN showdate sd ON o.ShowDate_id = sd.ShowDate_id
      JOIN status s ON o.Status_id = s.Status_id
      JOIN member m ON o.Member_id = m.Member_id
      LEFT JOIN receipt r ON o.Receipt_id = r.Receipt_id
      GROUP BY o.Order_id, m.Email, c.ConcertName, c.Poster, sd.ShowDate, sd.ShowStart, s.Status_Name, s.Status_id, r.Slip_file
      ORDER BY o.Order_id ASC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error", error: err });
  }
});


router.get("/DetailOrder/:id", async (req, res) => {
  const Order_id = req.params.id;
  try {
    const [results] = await db
      .promise()
      .query(`SELECT o.Order_id, SUM(o.Price) as totalprice, o.Seat_Number, o.IDCARD, COUNT(Seat_Number) as totalseat ,
      m.Email, c.ConcertName, c.Poster, sd.ShowDate, sd.ShowStart, s.Status_id ,s.Status_Name, r.Slip_file  
      FROM \`order\` o
      JOIN concert c ON o.Concert_id = c.Concert_id
      JOIN showdate sd ON o.ShowDate_id = sd.ShowDate_id
      JOIN status s ON o.Status_id = s.Status_id
      JOIN member m ON o.Member_id = m.Member_id
      JOIN receipt r ON o.Receipt_id = r.Receipt_id
      WHERE o.Order_id = ?
      `, [Order_id]);
    const order = {
      Order_id: results[0].Order_id,
      ConcertName: results[0].ConcertName,
      totalprice: results[0].totalprice,
      Slip_file: results[0].Slip_file,
      Status_id: results[0].Status_id,
      Status_Name: results[0].Status_Name,
      IDCARD: results[0].IDCARD
    };

    res.send(order);
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
});

router.put("/ChangeOrder", authenticateToken, async (req, res) => {
  try {
    const { Order_id, Admin_id, Status_id } = req.body;

    if (!Order_id || !Status_id) {
      return res
        .status(400)
        .json({ success: false, message: "Order_id และ Status_id จำเป็น" });
    }

    if (Status_id === "S005") {
      await db.promise().query(
        "UPDATE `order` SET Status_id = ?, Admin_id = ?, Admin_confirm_time = NOW(), Price = NULL, People_cancel = ? WHERE Order_id = ?",
        [Status_id, Admin_id, "Admin", Order_id]
      );
    } else {
      await db.promise().query(
        "UPDATE `order` SET Status_id = ?, Admin_confirm_time = NOW(), Admin_id = ? WHERE Order_id = ?",
        [Status_id, Admin_id, Order_id]
      );
    }

    res.json({ success: true, message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    console.error("DB error:", err);
    res
      .status(500)
      .json({ success: false, message: "Database error", error: err });
  }
});


router.get("/OrderQrcode/:id", authenticateToken, async (req, res) => {
  const Order_id = req.params.id;
  try {
    const [results] = await db
      .promise()
      .query(`SELECT 
        o.Seat_Number,           
        o.Price,
        c.Poster,               
        c.ConcertName,
        sd.ShowDate,
        sd.ShowStart,
        s.Status_Name,
        s.Status_id,
        r.Slip_file
      FROM \`order\` o
      JOIN concert c ON o.Concert_id = c.Concert_id
      JOIN showdate sd ON o.ShowDate_id = sd.ShowDate_id
      JOIN status s ON o.Status_id = s.Status_id
      JOIN member m ON o.Member_id = m.Member_id
      LEFT JOIN receipt r ON o.Receipt_id = r.Receipt_id
      WHERE Order_id = ?
      `, [Order_id]);

    res.json(results);
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
});

router.put("/AddRating", async (req, res) => {
  try {
    const { Member_id, Concert_id, Rating } = req.body;

    if (!Member_id || !Concert_id || !Rating) {
      return res.status(400).json({ success: false, message: "กรุณาส่งข้อมูลให้ครบ" });
    }

    // ตรวจสอบว่าผู้ใช้มีออร์เดอร์สำหรับคอนเสิร์ตนี้หรือไม่
    const [orders] = await db
      .promise()
      .query(
        "SELECT * FROM `order` WHERE Member_id = ? AND Concert_id = ? AND Price IS NOT NULL",
        [Member_id, Concert_id]
      );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อนี้" });
    }

    // อัปเดตค่า Rating ในตาราง order
    await db
      .promise()
      .query(
        "UPDATE `order` SET Rating = ? WHERE Member_id = ? AND Concert_id = ? AND Price IS NOT NULL",
        [Rating, Member_id, Concert_id]
      );

    return res.json({ success: true, message: "บันทึกคะแนนสำเร็จ" });
  } catch (error) {
    console.error("Error saving rating:", error);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในระบบ" });
  }
});

router.get("/Rating", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`SELECT 
    AVG(o.Rating) AS Rating,
    c.ConcertName,
    c.Poster,
    c.Concert_id,
    sd.ShowDate
FROM \`order\` o
JOIN concert c ON c.Concert_id = o.Concert_id
JOIN showdate sd ON sd.ShowDate_id = o.ShowDate_id
WHERE o.Rating IS NOT NULL
GROUP BY c.Concert_id
ORDER BY c.Concert_id ASC`)
    res.json(rows);
  } catch (err) {
    console.error("Server error", err);
    res.status(500).send({ error: "Internal server error" });
  }
})

router.get("/Receipt/:Order_id", async (req, res) => {
  const { Order_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        o.Order_id,
        c.ConcertName,
        m.Firstname AS MemberName,
        m.Email,
        m.Telephone,
        s.ShowDate,
        s.ShowStart,
        GROUP_CONCAT(o.Seat_Number ORDER BY o.Seat_Number SEPARATOR ', ') AS Seat_Number,
        o.Price,
        SUM(o.Price) as TotalPrice,
        r.Receipt_Date,
        r.Slip_time
      FROM \`order\` o
      JOIN \`member\` m ON o.Member_id = m.Member_id
      JOIN  \`concert\` c ON o.Concert_id = c.Concert_id
      JOIN \`showdate\` s ON o.ShowDate_id = s.ShowDate_id
      JOIN \`receipt\` r ON o.Receipt_id = r.Receipt_id
      WHERE o.Order_id = ?
      `,
      [Order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลใบเสร็จของคำสั่งซื้อนี้",
      });
    }

    const data = rows[0];

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Error fetching receipt:", err);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลใบเสร็จ",
    });
  }
});

module.exports = router;