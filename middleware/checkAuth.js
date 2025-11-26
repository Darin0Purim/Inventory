//ตรวจสอบความถูกต้องของ JWT (jwt.verify), อ่าน payload ข้างใน token
const jwt = require('jsonwebtoken'); 

module.exports = function checkAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    // ต้องเป็นรูปแบบ "Bearer <token>"
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET); 
    // เก็บข้อมูลผู้ใช้ไว้ใน req
    req.user = { user_id: payload.user_id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุ' });
  }
};
