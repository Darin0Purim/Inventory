// routes/reports.js
const express = require("express");
const router = express.Router();
const db = require("../db");

/** helper: รับ yearMonth ("YYYY-MM") -> [start, end) */
function monthRange(yearMonth) {
  if (!yearMonth) return [null, null];
  const [y, m] = yearMonth.split("-").map(Number);
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const next  = new Date(y, m, 1);
  const end   = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`;
  return [start, end];
}

/* ---------- 1) สินค้าขายดีรายเดือน ---------- */
router.get("/analytics/top-issued", (req, res) => {
  const { yearMonth, limit = 6 } = req.query;
  const [start, end] = monthRange(yearMonth);
  const sql = `
    SELECT 
      p.product_id, p.product_name, p.image, p.sku,
      COALESCE(SUM(CASE WHEN h.action='issue' THEN ABS(h.qty) ELSE 0 END),0) AS issued_qty
    FROM stock_history h
    JOIN products p ON p.product_id = h.product_id
    WHERE h.created_at >= COALESCE(?, DATE_FORMAT(CURDATE(), '%Y-%m-01'))
      AND h.created_at <  COALESCE(?, DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'))
    GROUP BY p.product_id, p.product_name, p.image, p.sku
    ORDER BY issued_qty DESC
    LIMIT ?`;
  db.query(sql, [start, end, Number(limit)], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


/* ---------- 2) ประเภทสินค้าขายดีรายเดือน ---------- */
// routes/reports.js
router.get('/top-categories', (req, res) => {
  const { yearMonth } = req.query;
  const [start, end] = monthRange(yearMonth);

  const sql = `
    SELECT 
      c.category_id,
      c.category_name,
      COALESCE(SUM(CASE WHEN h.qty < 0 THEN -h.qty ELSE 0 END), 0) AS issued_qty
    FROM stock_history h
    JOIN products p   ON p.product_id  = h.product_id
    JOIN categories c ON c.category_id = p.category_id
    WHERE h.created_at >= COALESCE(?, DATE_FORMAT(CURDATE(), '%Y-%m-01'))
      AND h.created_at <  COALESCE(?, DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'))
    GROUP BY c.category_id, c.category_name
    ORDER BY issued_qty DESC
    LIMIT 5
  `;
  db.query(sql, [start, end], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


module.exports = router;