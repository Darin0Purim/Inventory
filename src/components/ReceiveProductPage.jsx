import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ReceiveProductPage.css";
import axios from "axios";
const API = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:5000';

export default function ReceiveProductPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (sku.trim() === "") return setProduct(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/sku/${sku}`);
        setProduct(res.data || null);
      } catch (err) {
        console.error("ไม่พบสินค้า", err);
        setProduct(null);
      }
    }
    fetchProduct();
  }, [sku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      alert("ยังไม่มีข้อมูลสินค้านี้ในระบบ กรุณาเพิ่มสินค้าก่อน");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/receive", {
        date,
        sku,
        qty: parseInt(qty),
        note,
      });
      alert("รับสินค้าเรียบร้อย");
      navigate("/product");
    } catch (err) {
      console.error("บันทึกรับสินค้าล้มเหลว", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
  <div className="dashboard-page">
    <Sidebar />

    <div className="topbar">
      <h1 className="welcome-title">รับสินค้า!</h1>
      <div className="search-row">
        <div className="search-box">
          <input type="text" className="search-input" placeholder="Search" />
          <i className="fas fa-search"></i>
          <i
            className="fas fa-qrcode"
            onClick={() => window.location.href = "/scan"}
            style={{ marginLeft: "10px", cursor: "pointer" }}></i>
        </div>
      </div>
    </div>
    

    <div className="receive-container">
      <div className="receive-header">
      <h2>รับสินค้า</h2>
      <button className="add-btn">+ เพิ่มสินค้าใหม่</button>
      </div>
      <form className="receive-form" onSubmit={handleSubmit}>
        <label>วันที่รับ</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>รหัสสินค้า (SKU)</label>
        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} required />

        {product ? (
          <div className="product-details">
            <p>ชื่อสินค้า: {product.name}</p>
            <p>หมวดหมู่: {product.category}</p>
            <p>ไซซ์: {product.size}</p>
            <img src={product.image_url} alt="รูปสินค้า" />
          </div>
        ) : (
          <div>
            <p className="not-found">ไม่พบข้อมูลสินค้าในระบบ → <Link to="/add-product">เพิ่มสินค้าใหม่</Link></p>
          </div>
        )}

        <label>จำนวน</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required />

        <label>หมายเหตุ</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="เช่น สินค้าส่งตรงจากโรงงาน" />

        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>❌ ยกเลิก</button>
          <button type="submit" className="save-btn">📦 บันทึก</button>
        </div>
      </form>
    </div>
  </div>
);
}