const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

router.get("/concert", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`SELECT COUNT(*) as totalconcert, Concert_id, ConcertName FROM concert`);
    res.json({
      success: true,
      totalconcert: rows[0].totalconcert,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
})

router.get("/member", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`SELECT COUNT(*) as totalmember FROM member`);
    res.json({
      success: true,
      totalmember: rows[0].totalmember,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
})

router.get("/order", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`SELECT SUM(Price) AS totalprice
FROM \`order\`
WHERE Admin_id IS NOT NULL`);
    res.json({
      success: true,
      totalprice: rows[0].totalprice,
    })
  } catch (error) {
    console.log("error", error);
    res.status(403).send({
      message: "fail",
      error,
    })
  }
})

router.get("/order/chart/monthly", async (req, res) => {
  try {
    const { start, end } = req.query; // ดึง query string จาก URL

    // ถ้าไม่ได้กำหนด start/end → ใช้ค่า default (ทั้งปี)
    const startDate = start || "2025-01-01";
    const endDate = end || "2025-12-31";

    const [rows] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(Order_date, '%Y-%m') AS month,
        SUM(Price) AS totalprice
      FROM \`order\`
      WHERE Admin_id IS NOT NULL
      AND Order_date BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(Order_date, '%Y-%m')
      ORDER BY DATE_FORMAT(Order_date, '%Y-%m') ASC;
    `, [startDate, endDate]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("error", error);
    res.status(403).send({
      message: "fail",
      error,
    });
  }
});

router.get("/order/concert", async (req, res) => {
  try {
    const { Concert_id } = req.query;

    let query = `
      SELECT 
        c.Concert_id,
        c.ConcertName,
        SUM(o.Price) AS totalprice,
        COUNT(o.Order_id) AS totalorders
      FROM \`order\` o
      JOIN concert c ON o.Concert_id = c.Concert_id
      WHERE o.Admin_id IS NOT NULL
    `;

    const params = [];

    if (Concert_id) {
      query += " AND o.Concert_id = ?";
      params.push(Concert_id);
    }

    query += " GROUP BY c.Concert_id, c.ConcertName ORDER BY totalprice DESC;";

    const [rows] = await db.promise().query(query, params);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("error", error);
    res.status(500).send({ message: "fail", error });
  }
});





module.exports = router;