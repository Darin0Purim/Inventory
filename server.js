require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require('path');

const app = express();

// DB ต้องมาก่อนใช้งาน!
const db = require('./db');

// Health check
app.get('/health', (_, res) => res.send('ok'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============== API ที่ Dashboard ต้องใช้ ===============
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/analytics/top-issued', (req, res) => {
  res.json([]);
});

app.get('/api/analytics/top-categories', (req, res) => {
  res.json([]);
});
// ========================================================

// Routers
app.use('/api', require('./routes/auth'));           // login
app.use('/api/signup', require('./routes/signup'));  // signup
app.use('/api/reports', require('./routes/reports')); // reports

// ถ้าจะใช้ routes/products.js ก็ต้องลบ GET /api/products อันบน
// แต่ถ้าจะใช้ GET ในไฟล์นี้ ก็ลบ app.use('/api/products') ตัวนี้
// แนะนำ: ตอนนี้อย่าใช้ routes/products.js ก่อน
// app.use('/api/products', require('./routes/products'));  

// Upload product
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/products", upload.single("image"), (req, res) => {
  const { product_name, category_id, size, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    `INSERT INTO products (product_name, category_id, size, quantity, image)
     VALUES (?, ?, ?, ?, ?)`,
    [product_name, category_id, size, quantity ?? 0, image],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "เพิ่มสินค้าแล้วจ้า!" });
    }
  );
});

app.listen(5000, '0.0.0.0', () => {
  console.log('API running at http://127.0.0.1:5000');
});
