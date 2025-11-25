// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');


// ดึงสินค้าพร้อมชื่อหมวดหมู่ + ค้นหาได้
router.get("/", (req, res) => {
  const search = (req.query.search || "").trim();

  // base SQL
  let sql = `
    SELECT 
      p.product_id, p.sku, p.product_name, p.size, p.quantity, p.image,
      c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
  `;
  const params = [];

  if (search) {
    sql += `
      WHERE 
        p.product_name LIKE ? OR
        p.sku         LIKE ? OR
        c.category_name LIKE ?
    `;
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  sql += " ORDER BY p.product_id DESC";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/products  → สินค้าทั้งหมด (รวมชื่อหมวดหมู่)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      p.product_id,
      p.sku,
      p.product_name,
      p.size,
      p.quantity,
      p.image,
      c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    ORDER BY p.product_id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/products/by-sku/:sku  → ดึงสินค้า 1 ชิ้นด้วย SKU
router.get('/by-sku/:sku', (req, res) => {
  const { sku } = req.params;
  const sql = `
    SELECT 
      p.product_id,
      p.sku,
      p.product_name,
      p.size,
      p.quantity,
      p.image,
      c.category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE p.sku = ?
    LIMIT 1
  `;
  db.query(sql, [sku], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  });
});

// GET /api/products/:id/logs  → ประวัติสินค้า
router.get('/:id/logs', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT date, action, qty, \`by\`
    FROM product_logs
    WHERE product_id = ?
    ORDER BY date DESC, id DESC
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/products/:id/adjust  → ปรับสต็อก { "delta": 300 }
router.post('/:id/adjust', (req, res) => {
  const { id } = req.params;
  const { delta } = req.body; // บวก/ลบ
  if (typeof delta !== 'number') {
    return res.status(400).json({ error: 'delta must be a number' });
  }

  const sql = `UPDATE products SET quantity = quantity + ? WHERE product_id = ?`;
  db.query(sql, [delta, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, affectedRows: result.affectedRows });
  });
});

// DELETE /api/products/:id  → ลบสินค้า
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE product_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, affectedRows: result.affectedRows });
  });
});

module.exports = router;