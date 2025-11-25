const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/checkAuth');

router.get('/self', checkAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password }); // log ข้อมูลที่รับมา

  if (!email || !password)
    return res.status(400).json({ message: 'กรุณากรอก Email และ Password' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    console.log('db.query called');
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log('db.query results:', results);

    if (results.length === 0)
      return res.status(400).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });

    const user = results[0];
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('bcrypt.compare:', isMatch);

      if (!isMatch)
        return res.status(400).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET ไม่ถูกตั้งค่า');
        return res.status(500).json({ message: 'JWT_SECRET ไม่ถูกตั้งค่า' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '7d' }
      );

      res.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

module.exports = router;