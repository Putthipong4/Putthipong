const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     if (file.fieldname === "Poster") {
      cb(null, "uploads/poster"); 
    } else {
      cb(null, "uploads/payment"); 
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});
const upload = multer({ storage: storage });


app.use('/uploads', express.static('uploads'));

const secret = process.env.JWT_SECRET
 
app.use(cors({
  credentials: true,
  origin: ["http://localhost:5173"],
}));
app.use(express.json());
app.use(cookieParser());

const initMySQL = async () => {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "concertticketfinal",
  });
};

const adminRoutes = require('./routes/admin');
const memberRoutes = require('./routes/member');
const concertRoutes = require('./routes/concert');
const OrderRoutes = require('./routes/Order');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/admin', adminRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/concert', concertRoutes);
app.use('/api/Order', OrderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen('3001', async () => {
  await initMySQL();
  console.log('Server is running on port 3001');
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. ตรวจสอบในตาราง Admin
    const [adminResults] = await db.promise().query('SELECT * FROM admin WHERE email = ?', [email]);
    if (adminResults.length > 0) {
      const adminData = adminResults[0];
      const match = await bcrypt.compare(password, adminData.Password);
      if (!match) {
        return res.status(400).send({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }
      // สร้าง JWT token สำหรับ admin
      const token = jwt.sign({ email, Admin_id: adminData.Admin_id  , role: 'admin' }, secret, { expiresIn: '24h' });
      res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      });

      return res.status(200).send({
        message: 'login success',
        role: 'admin',
        userData: adminData,
      });
    }

    // 2. ตรวจสอบในตาราง Member
    const [memberResults] = await db.promise().query('SELECT * FROM member WHERE email = ?', [email]);
    if (memberResults.length > 0) {
      const memberData = memberResults[0];
      const match = await bcrypt.compare(password, memberData.Password);
      if (!match) {
        return res.status(400).send({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }

      // สร้าง JWT token สำหรับ member
      const token = jwt.sign({ email,Member_id: memberData.Member_id, role: 'member' }, secret, { expiresIn: '24h' });
      res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      });

      return res.status(200).send({
        message: 'login success',
        role: 'member',
        userData: memberData,
      });
    }

    // 3. ถ้าไม่พบในทั้งสองตาราง
    res.status(400).send({
      message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({
      message: 'เกิดข้อผิดพลาดในการล็อกอิน',
      error: error.message,
    });
  }
})



app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.send({ message: 'Logged out' });
});



