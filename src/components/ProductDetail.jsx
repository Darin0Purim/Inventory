// src/components/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [logs, setLogs] = useState([]);
  const [adjust, setAdjust] = useState(300);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // โหลดข้อมูลสินค้า + ประวัติ
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/products/by-sku/${encodeURIComponent(sku)}`);
        if (!res.ok) throw new Error("ไม่พบบาร์โค้ด/รหัสสินค้า");
        const p = await res.json();
        if (!mounted) return;

        setProduct(p);

        // โหลด logs ด้วย product_id
        const resLog = await fetch(`http://localhost:5000/api/products/${p.product_id}/logs`);
        const lg = resLog.ok ? await resLog.json() : [];
        if (!mounted) return;
        setLogs(lg);
      } catch (e) {
        setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [sku]);

  const handleBack = () => navigate(-1);

  const handleAdjust = async () => {
    if (!product) return;
    const delta = Number(adjust || 0);
    if (!delta) return;

    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/products/${product.product_id}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error("ปรับสต็อกไม่สำเร็จ");

      // อัปเดตหน้าแบบทันที (optimistic)
      setProduct((prev) => ({ ...prev, quantity: Number(prev.quantity) + delta }));
      setLogs((prev) => [
        { date: new Intl.DateTimeFormat("th-TH").format(new Date()), action: delta > 0 ? "รับสินค้าเข้า" : "เบิกสินค้า", qty: delta, by: "ระบบ" },
        ...prev,
      ]);
      setAdjust(300);
    } catch (e) {
      alert(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const ok = window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?");
    if (!ok) return;

    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/products/${product.product_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      alert("ลบสินค้าแล้ว");
      navigate("/products");
    } catch (e) {
      alert(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Sidebar />
        <div className="pd-content"><p>กำลังโหลด...</p></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Sidebar />
        <div className="pd-content">
          <p style={{ color: "crimson" }}>{error || "ไม่พบสินค้า"}</p>
          <button className="btn ghost" onClick={handleBack}>← กลับ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Sidebar />

      <div className="pd-content">
        <h1 className="pd-title">ข้อมูลสินค้า</h1>

        <div className="pd-card">
          <div className="pd-top">
            <img className="pd-image" src={product.image} alt={product.product_name} />
            <div className="pd-right">
              {/* กล่องบาร์โค้ด/แสดง SKU */}
              <div className="sku-box">
                <div className="sku-label">รหัสสินค้า</div>
                <div className="sku-value">{product.sku}</div>
              </div>

              <div className="pd-name">{product.product_name}</div>

              <div className="pd-grid">
                <div>
                  <div className="muted">จำนวนในคลัง</div>
                  <div className="value">{product.quantity} คู่</div>
                </div>
                <div>
                  <div className="muted">หมวดหมู่</div>
                  <div className="value">{product.category_name}</div>
                </div>
                <div>
                  <div className="muted">ไซส์</div>
                  <div className="value">{product.size}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่ม/แอ็กชัน */}
          <div className="pd-actions">
            <button className="btn ghost" onClick={handleBack}>← กลับ</button>

            <div className="adjust-group">
              <input
                type="number"
                className="adjust-input"
                value={adjust}
                onChange={(e) => setAdjust(e.target.value)}
              />
              <button className="btn primary" disabled={submitting} onClick={handleAdjust}>
                + เติมสต็อก
              </button>
            </div>

            <button className="btn danger" disabled={submitting} onClick={handleDelete}>
              ลบสินค้า
            </button>
          </div>
        </div>

        {/* ประวัติ */}
        <div className="pd-card">
          <h3 className="pd-subtitle">ประวัติ</h3>
          <table className="pd-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>กิจกรรม</th>
                <th className="num">จำนวน</th>
                <th>โดย</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={4} className="muted">— ยังไม่มีประวัติ —</td></tr>
              )}
              {logs.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.action}</td>
                  <td className={`num ${r.qty > 0 ? "green" : r.qty < 0 ? "red" : ""}`}>
                    {r.qty > 0 ? `+${r.qty}` : r.qty}
                  </td>
                  <td>{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
