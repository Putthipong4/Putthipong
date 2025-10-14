const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();


const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ message: 'No Token Provided' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).send({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/poster");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));

router.get("/showconcert", (req, res) => {
  db.query("SELECT * FROM concert", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


router.get("/detailsconcert/:id", async (req, res) => {
  const Concert_id = req.params.id;
  try {
    const [results] = await db
      .promise()
      .query(
        `SELECT 
           c.Concert_id,
           c.ConcertName, 
           c.Price, 
           c.Details, 
           c.Poster, 
           c.OpenSaleDate, 
           c.OpenSaleTimes,
           sd.ShowDate_id, 
           sd.ShowDate, 
           sd.ShowStart, 
           sd.TotalSeat, 
           sd.ShowTime,
           CONCAT(sd.ShowDate, ' ', sd.ShowStart) AS ShowDateTime,
           CONCAT(c.OpenSaleDate, ' ', c.OpenSaleTimes) AS SaleDateTime,
           COUNT(CASE WHEN s.Status = 'ว่าง' THEN 1 END) AS AvailableSeats
         FROM concert c
         JOIN showdate sd 
           ON c.Concert_id = sd.Concert_id
         LEFT JOIN showdateandseat s 
           ON s.ShowDate_id = sd.ShowDate_id
         WHERE c.Concert_id = ?
         GROUP BY sd.ShowDate_id`,
        [Concert_id]
      );

    const concert = {
      Concert_id: results[0].Concert_id,
      ConcertName: results[0].ConcertName,
      Price: results[0].Price,
      Details: results[0].Details,
      Poster: results[0].Poster,
      OpenSaleDate: results[0].OpenSaleDate,
      OpenSaleTimes: results[0].OpenSaleTimes,
      ShowDate: results[0].ShowDate,
      SaleDateTime: results[0].SaleDateTime,
      ShowRounds: results.map((row) => ({
        ShowDate_id: row.ShowDate_id,
        ShowDate: row.ShowDate,
        ShowStart: row.ShowStart,
        TotalSeat: row.TotalSeat,
        ShowTime: row.ShowTime,
        ShowDateTime: row.ShowDateTime,
        AvailableSeats: row.AvailableSeats,
      })),
    };

    res.send(concert);
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
});


router.post("/addconcert",
  upload.single("Poster"),
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .send({ message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
      }
      const {
        ConcertName,
        Price,
        OpenSaleDate,
        OpenSaleTimes,
        Details,
        Admin_id,
        ShowDate,
        ShowStart,
        TotalSeat,
        ShowTime,
      } = req.body;

      const posterFilename = req.file?.originalname;

      const [lastIdConcert] = await db
        .promise()
        .query(
          "SELECT Concert_id FROM concert ORDER BY Concert_id DESC LIMIT 1"
        );

      let newConcertId = "C01";

      if (lastIdConcert.length > 0) {
        const lastId = lastIdConcert[0].Concert_id;
        const numericPart = parseInt(lastId.substring(1));
        const nextNumber = numericPart + 1;
        newConcertId = "C" + nextNumber.toString().padStart(2, 0);
      }
      await db
        .promise()
        .query(
          "INSERT INTO concert (Concert_id, Poster, ConcertName, Price, OpenSaleDate, OpenSaleTimes, Details, Admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newConcertId,
            posterFilename,
            ConcertName,
            Price,
            OpenSaleDate,
            OpenSaleTimes,
            Details,
            Admin_id,
          ]
        );

      const [lastShow] = await db
        .promise()
        .query(
          "SELECT ShowDate_id FROM showdate ORDER BY ShowDate_id DESC LIMIT 1"
        );
      let newShowId = "S01";
      if (lastShow.length > 0) {
        const lastId = lastShow[0].ShowDate_id;
        const numericPart = parseInt(lastId.substring(1));
        newShowId = "S" + (numericPart + 1).toString().padStart(2, "0");
      }

      await db
        .promise()
        .query(
          "INSERT INTO showdate (ShowDate_id, ShowDate, ShowStart, TotalSeat, ShowTime, Concert_id) VALUES (?, ?, ?, ?, ?, ?)",
          [newShowId, ShowDate, ShowStart, TotalSeat, ShowTime, newConcertId]
        );


      const limit = parseInt(TotalSeat, 10);
      const [seats] = await db.promise().query(`SELECT Seat_Number FROM seat LIMIT ${limit}`);


      const showSeatInserts = seats.map((s) => ["ว่าง", newShowId, s.Seat_Number, newConcertId]);

      await db
        .promise()
        .query(
          "INSERT INTO showdateandseat (Status, ShowDate_id, Seat_Number, Concert_id ) VALUES ?",
          [showSeatInserts]
        );

      res.status(200).send({
        message: "Concert, showdate, and seats added successfully",
        Concert_id: newConcertId,
        Showdate_id: newShowId,
        posterUrl: `/uploads/poster/${posterFilename}`,
      });
    } catch (err) {
      console.error("Server error", err);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

//AI ลบคอนเสิร์ตและไฟล์รูปใน โฟลเดอร์ uploads

router.delete("/delete/:Concert_id", async (req, res) => {
  const { Concert_id } = req.params;

  try {
    // 1. ดึงชื่อไฟล์โปสเตอร์จากฐานข้อมูล
    const [rows] = await db
      .promise()
      .query("SELECT Poster FROM concert WHERE Concert_id = ?", [Concert_id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "Concert not found" });
    }

    const posterFilename = rows[0].Poster;

    // 2. ลบไฟล์โปสเตอร์จากโฟลเดอร์ uploads (ถ้ามี)
    if (posterFilename) {
      const filePath = path.join(__dirname, "..", "uploads", "poster", posterFilename);

      // เช็คว่าไฟล์มีจริงก่อนลบ
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await db.promise().query(
      "DELETE FROM showdateandseat WHERE Concert_id = ?",
      [Concert_id]
    );

    await db.promise().query("DELETE FROM showdate WHERE Concert_id = ?", [Concert_id]);

    await db
      .promise()
      .query("DELETE FROM concert WHERE Concert_id = ?", [Concert_id]);

    return res.send({ message: "Concert deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).send({ error: "Internal server error" });
  }
});

router.put("/UpdateConcert",
  upload.single("Poster"),
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .send({ message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
      }
      const {
        Concert_id,
        ConcertName,
        Price,
        OpenSaleDate,
        OpenSaleTimes,
        Details,
      } = req.body;

      let result;

      if (req.file) {
        const [OldPoster] = await db
          .promise()
          .query("SELECT Poster FROM concert WHERE Concert_id = ?", [
            Concert_id,
          ]);

        if (OldPoster.length > 0 && OldPoster[0].Poster) {
          const OldPath = path.join(
            __dirname,
            "..",
            "uploads",
            OldPoster[0].Poster
          );
          if (fs.existsSync(OldPath)) {
            fs.unlinkSync(OldPath);
          }
        }

        const posterFilename = req.file.originalname;
        [result] = await db
          .promise()
          .query(
            "UPDATE concert SET ConcertName = ?, Price = ?, OpenSaleDate = ?, OpenSaleTimes = ?, Details = ?, Poster = ? WHERE Concert_id = ?",
            [
              ConcertName,
              Price,
              OpenSaleDate,
              OpenSaleTimes,
              Details,
              posterFilename,
              Concert_id,
            ]
          );
      } else {
        [result] = await db
          .promise()
          .query(
            "UPDATE concert SET ConcertName = ?, Price = ?, OpenSaleDate = ?, OpenSaleTimes = ?, Details = ? WHERE Concert_id = ?",
            [
              ConcertName,
              Price,
              OpenSaleDate,
              OpenSaleTimes,
              Details,
              Concert_id,
            ]
          );
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Concert not found or no changes made.",
          });
      }

      res.json({ success: true, message: "Concert updated successfully." });
    } catch (error) {
      console.error("Error updating Cocnert:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

router.get("/showdate", (req, res) => {
  db.query("SELECT sd.ShowDate_id, sd.ShowTime, sd.ShowStart, sd.ShowDate, sd.TotalSeat, sd.Concert_id, c.ConcertName FROM showdate sd JOIN concert c ON sd.Concert_id = c.Concert_id ORDER BY sd.Concert_id", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/seat", (req, res) => {
  db.query("SELECT * FROM seat", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/Showdateandseat", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM showdateandseat");
    res.json(rows);
  } catch (err) {
    console.error(" Error fetching :", err);
    res.status(500).json({
      message: "Database error",
      error: err.message || err,
    });
  }
})

router.get("/ShowdateandConcert", async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.Concert_id,
        c.ConcertName,
        c.Price,
        c.Details,
        c.Poster,
        c.OpenSaleDate,
        c.OpenSaleTimes,
        c.Admin_id,
        sd.ShowDate,
        sd.ShowStart,
        MAX(sd.ShowDate) AS LastShowDate,
        MAX(sd.ShowStart) AS LastShowStart,
        COUNT(CASE WHEN s.Status = 'ว่าง' THEN 1 END) AS AvailableSeats,
        CONCAT(MAX(sd.ShowDate), ' ', MAX(sd.ShowStart)) AS ShowDateTime,
        CONCAT(c.OpenSaleDate, ' ', c.OpenSaleTimes) AS SaleDateTime
      FROM concert c
      JOIN showdate sd ON c.Concert_id = sd.Concert_id
      JOIN showdateandseat s ON sd.ShowDate_id = s.ShowDate_id
      GROUP BY c.Concert_id
      ORDER BY c.Concert_id;
    `;

    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching showdate:", err);
    res.status(500).json({
      message: "Database error",
      error: err.message || err,
    });
  }
});


router.post("/AddShowdate", authenticateToken, async (req, res) => {
  try {
    const { Concert_id, ShowDate, ShowStart, TotalSeat, ShowTime } = req.body;

    const [lastShow] = await db
      .promise()
      .query(
        "SELECT ShowDate_id FROM showdate ORDER BY ShowDate_id DESC LIMIT 1"
      );

    let newShowId = "S01";
    if (lastShow.length > 0) {
      const lastId = lastShow[0].ShowDate_id;
      const numericPart = parseInt(lastId.substring(1));
      newShowId = "S" + (numericPart + 1).toString().padStart(2, "0");
    }
    await db
      .promise()
      .query(
        "INSERT INTO showdate (ShowDate_id, ShowDate, ShowStart, TotalSeat, ShowTime, Concert_id) VALUES (?, ?, ?, ?, ?, ?)",
        [newShowId, ShowDate, ShowStart, TotalSeat, ShowTime, Concert_id]
      );

    const limit = parseInt(TotalSeat, 10);
    const [seats] = await db.promise().query(`SELECT Seat_Number FROM seat LIMIT ${limit}`);

    const showSeatInserts = seats.map((s) => ["ว่าง", newShowId, s.Seat_Number, Concert_id]);

    await db
      .promise()
      .query(
        "INSERT INTO showdateandseat (Status, ShowDate_id, Seat_Number, Concert_id ) VALUES ?",
        [showSeatInserts]
      );


    res.json({ success: true, message: "Add ShowDate successfully." });
  } catch (err) {
    console.error("Server error", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/showdate/:ShowDate_id", (req, res) => {
  const { ShowDate_id } = req.params;

  db.query(
    "SELECT * FROM showdate WHERE ShowDate_id = ?",
    [ShowDate_id],
    (err, result) => {
      if (err) {
        console.error("Error fetching showdate:", err);
        return res.status(500).send({ message: "Database error", error: err });
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/ShowDateandConcert/:ShowDate_id", authenticateToken, async (req, res) => {
  try {
    const { ShowDate_id } = req.params;

    const [rows] = await db.promise().query(`
      SELECT
        c.Concert_id, 
        c.ConcertName, 
        c.Price,
        c.Poster, 
        sd.ShowDate, 
        sd.ShowStart, 
        ss.Seat_Number, 
        s.Seat_Status, 
        ss.Status
      FROM concert c 
      JOIN showdate sd ON c.Concert_id = sd.Concert_id
      JOIN showdateandseat ss ON sd.ShowDate_id = ss.ShowDate_id
      JOIN seat s ON ss.Seat_Number = s.Seat_Number
      WHERE sd.ShowDate_id = ? 
    `, [ShowDate_id]);

    res.json(rows);
  } catch (err) {
    console.error("Server error", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/AddSeat", async (req, res) => {
  try {
    const { TotalSeat } = req.body;
    const rows = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
    ];
    const totalRows = rows.length;
    const totalSeats = parseInt(TotalSeat, 10);

    // คำนวณจำนวนที่นั่งต่อแถว
    const seatsPerRowBase = Math.floor(totalSeats / totalRows);
    let remainder = totalSeats % totalRows; // ส่วนที่เหลือจากการหาร

    for (let i = 0; i < totalRows; i++) {
      // ถ้ายังมีเศษอยู่ ให้แถวนี้ได้ที่นั่งเพิ่ม 1
      let seatsInThisRow = seatsPerRowBase + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      for (let num = 1; num <= seatsInThisRow; num++) {
        const seatNumber = `${rows[i]}${String(num).padStart(2, "0")}`;
        await db
          .promise()
          .query("INSERT INTO seat (Seat_Number, Seat_Status) VALUES (?, ?)", [
            seatNumber,
            "ปกติ",
          ]);
      }
    }

    res.json({ success: true, message: "Add ShowDate successfully." });
  } catch (err) {
    console.error("Server error", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.put("/close/:Concert_id", async (req, res) => {
  const { Concert_id } = req.params;
  try {
    const [showdates] = await db
      .promise()
      .query("SELECT ShowDate_id FROM showdate WHERE Concert_id = ?", [Concert_id]);

    if (showdates.length === 0) {
      return res.status(404).json({ error: "ไม่พบรอบการแสดงของคอนเสิร์ตนี้" });
    }

    // loop update ทุก ShowDate_id
    for (const sd of showdates) {
      await db
        .promise()
        .query("UPDATE showdateandseat SET Status = 'จองแล้ว' WHERE ShowDate_id = ?", [sd.ShowDate_id]);
    }

    res.json({ success: true, message: "ปิดคอนเสิร์ตสำเร็จ (ที่นั่งทั้งหมดถูกจองแล้ว)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


router.put("/UpdateShowDate", async (req, res) => {
  try {
    const { ShowDate_id, Concert_id, ShowDate, ShowStart, ShowTime, TotalSeat } = req.body;

    // ✅ ตรวจสอบข้อมูล
    if (!ShowDate_id || !Concert_id || !ShowDate || !ShowStart || !TotalSeat) {
      return res.status(400).json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    const TotalSeatNew = parseInt(TotalSeat, 10);
    if (isNaN(TotalSeatNew) || TotalSeatNew <= 0) {
      return res.status(400).json({ success: false, message: "จำนวนที่นั่งไม่ถูกต้อง" });
    }

    // ✅ ดึงที่นั่งปัจจุบันของรอบนี้
    const [seats] = await db
      .promise()
      .query(
        "SELECT Seat_Number FROM showdateandseat WHERE ShowDate_id = ? ORDER BY LENGTH(Seat_Number), Seat_Number",
        [ShowDate_id]
      );

    const currentCount = seats.length;

    // ✅ ถ้าต้องลดจำนวนที่นั่ง
    if (TotalSeatNew < currentCount) {
      const toDelete = currentCount - TotalSeatNew;

      // ลบจากท้าย (ใช้ ORDER BY DESC)
      await db
        .promise()
        .query(
          "DELETE FROM showdateandseat WHERE ShowDate_id = ? ORDER BY LENGTH(Seat_Number) DESC, Seat_Number DESC LIMIT ?",
          [ShowDate_id, toDelete]
        );
    }

    // ✅ ถ้าต้องเพิ่มที่นั่ง
    if (TotalSeatNew > currentCount) {
      const addCount = TotalSeatNew - currentCount;

      // ✅ ดึงชื่อที่นั่งทั้งหมดจากตาราง seat
      const [seatList] = await db
        .promise()
        .query("SELECT Seat_Number FROM seat ORDER BY LENGTH(Seat_Number), Seat_Number");

      if (seatList.length === 0) {
        return res.status(400).json({ success: false, message: "ไม่พบข้อมูลที่นั่งในตาราง seat" });
      }

      // ✅ หาที่นั่งล่าสุดในรอบนี้ เพื่อเริ่มต่อ
      const [lastSeat] = await db
        .promise()
        .query(
          "SELECT Seat_Number FROM showdateandseat WHERE ShowDate_id = ? ORDER BY LENGTH(Seat_Number) DESC, Seat_Number DESC LIMIT 1",
          [ShowDate_id]
        );

      let startIndex = 0;
      if (lastSeat.length > 0) {
        const lastSeatNum = lastSeat[0].Seat_Number;
        const index = seatList.findIndex((s) => s.Seat_Number === lastSeatNum);
        startIndex = index + 1; // เริ่มต่อจากตัวล่าสุด
      }

      // ✅ เตรียมข้อมูลที่จะเพิ่ม
      const values = [];
      for (let i = startIndex; i < startIndex + addCount && i < seatList.length; i++) {
        values.push([ShowDate_id, Concert_id, seatList[i].Seat_Number, "ว่าง"]);
      }

      if (values.length > 0) {
        await db
          .promise()
          .query(
            "INSERT INTO showdateandseat (ShowDate_id, Concert_id, Seat_Number, Status) VALUES ?",
            [values]
          );
      } else {
        return res.status(400).json({
          success: false,
          message: "ไม่สามารถเพิ่มที่นั่งได้ — ไม่มีชื่อที่นั่งในตาราง seat เพียงพอ",
        });
      }
    }

    //  อัปเดต showdate
    await db
      .promise()
      .query(
        "UPDATE showdate SET ShowDate = ?, ShowStart = ?, ShowTime = ?, TotalSeat = ? WHERE ShowDate_id = ?",
        [ShowDate, ShowStart, ShowTime || null, TotalSeatNew, ShowDate_id]
      );

    res.json({
      success: true,
      message: "อัปเดตรอบการแสดงสำเร็จ",
    });
  } catch (err) {
    console.error("UpdateShowDate Error:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในระบบ" });
  }
});


router.get("/ShowdateandConcertCard", async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.Concert_id,
        c.ConcertName,
        c.Price,
        c.Details,
        c.Poster,
        c.OpenSaleDate,
        c.OpenSaleTimes,
        c.Admin_id,
        sd.ShowDate,
        sd.ShowStart,
        MAX(sd.ShowDate) AS LastShowDate,
        MAX(sd.ShowStart) AS LastShowStart,
        COUNT(CASE WHEN s.Status = 'ว่าง' THEN 1 END) AS AvailableSeats,
        CONCAT(MAX(sd.ShowDate), ' ', MAX(sd.ShowStart)) AS ShowDateTime,
        CONCAT(c.OpenSaleDate, ' ', c.OpenSaleTimes) AS SaleDateTime
      FROM concert c
      JOIN showdate sd ON c.Concert_id = sd.Concert_id
      JOIN showdateandseat s ON sd.ShowDate_id = s.ShowDate_id
      GROUP BY c.Concert_id
      ORDER BY c.OpenSaleDate ASC, c.OpenSaleTimes ASC;
    `;

    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching showdate:", err);
    res.status(500).json({
      message: "Database error",
      error: err.message || err,
    });
  }
});



module.exports = router;
