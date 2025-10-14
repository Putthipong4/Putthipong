const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middlewares/auth');
const secret = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
  try {
    const { Firstname, Lastname, Telephone, Email, Password } = req.body;

    const [EmailCheck] = await db.promise().query(
      "SELECT Email FROM member where Email = ?",
      [Email]
    );

    const [EmailAdminCheck] = await db.promise().query(
      "SELECT Email FROM admin where Email = ?",
      [Email]
    );

    if (EmailAdminCheck.length || EmailCheck.length > 0) {
      return res.status(400).send({ error: "Email already exists" });
    }

    const [lastIdResult] = await db.promise().query(
      "SELECT Member_id FROM member ORDER BY Member_id DESC LIMIT 1"
    );

    let newId = "M01";

    if (lastIdResult.length > 0) {
      const lastId = lastIdResult[0].Member_id
      const numericPart = parseInt(lastId.substring(1));
      const nextNumber = numericPart + 1;
      newId = "M" + nextNumber.toString().padStart(2, "0");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = {
      Member_id: newId,
      Firstname,
      Lastname,
      Telephone,
      Email,
      Password: hashedPassword
    }
    const [result] = await db.promise().query('INSERT INTO member SET ?', user)

    return res.status(200).send({ message: "Member added successfully", Member_id: newId })

  } catch (err) {
    console.error("Server error", err);
    return res.status(500).send({ error: "Internal server error" });
  }

});

router.get('/checkAuth', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM member WHERE Member_id = ?', [req.user.Member_id])
    if (!results[0]) {
      return res.status(404).json({ message: 'User not found', password });
    }
    res.json({ user: results[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

router.put("/updateProfile", authenticateToken, async (req, res) => {
  try {
    const { Firstname, Lastname, Telephone, Email, currentPassword, newPassword } = req.body;
    const email = req.user.email;

    // ดึงข้อมูลแอดมินจาก DB
    const [memberRows] = await db
      .promise()
      .query("SELECT * FROM member WHERE email = ?", [email]);

    if (memberRows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
    }

    const member = memberRows[0];

    // ถ้าผู้ใช้ต้องการเปลี่ยนรหัสผ่าน
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, member.Password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db
        .promise()
        .query(
          "UPDATE member SET Firstname=?, Lastname=?, Telephone=?, Email=?, Password=? WHERE Member_id=?",
          [Firstname, Lastname, Telephone, Email, hashedPassword, member.Member_id]
        );
    } else {
      // อัปเดตเฉพาะข้อมูลทั่วไป
      await db
        .promise()
        .query(
          "UPDATE member SET Firstname=?, Lastname=?, Telephone=?, Email=? WHERE Member_id=?",
          [Firstname, Lastname, Telephone, Email, member.Member_id]
        );
    }

    res.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error });
  }
});

router.get('/showmembers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }
    const [rows] = await db.promise().query('SELECT * FROM member')
    res.send(rows)
  } catch (error) {
    console.log('error', error);
    res.status(403).send({
      message: 'fail',
      error
    })
  }
})





module.exports = router;