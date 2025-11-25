// routes/signup.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {

  console.log("📌 req.body:", req.body); // <-- DEBUG สำคัญมาก

  const { firstName, lastName, name, email, password } = req.body;

  // รวมชื่อแบบรองรับทั้ง name เดียว หรือ first + last
  const fullName = name ? name : `${firstName || ""} ${lastName || ""}`.trim();

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'กรอกข้อมูลให้ครบ' });
  }

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ message: "อีเมลถูกใช้แล้ว" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [fullName, email, hashedPassword, "admin"],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error" });
          return res.json({ message: "สมัครสมาชิกสำเร็จ" });
        }
      );
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
