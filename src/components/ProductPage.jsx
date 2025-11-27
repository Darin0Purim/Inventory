// ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./ProductPage.css";

const BASE_URL = "http://localhost:5000";
const API = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:5000';

export default function ProductPage() {
  const navigate = useNavigate();

  // อ่านค่า q จาก URL ?q=...
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get("q") || "";

  // state
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState(qFromUrl);

  // ดึงสินค้าจาก API (รองรับค้นหา)
  const fetchProducts = async (keyword) => {
    try {
      const url = keyword
        ? `${API}/api/products?search=${encodeURIComponent(keyword)}`
        : `${API}/api/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("โหลดสินค้าไม่สำเร็จ:", e);
      setProducts([]);
    }
  };

  // เมื่อค่า ?q ใน URL เปลี่ยน ให้โหลดใหม่
  useEffect(() => {
    fetchProducts(qFromUrl);
  }, [qFromUrl]);

  // กดค้นหา -> อัปเดต URL (จะไปกระตุ้น useEffect ข้างบนเอง)
  const runSearch = () => setSearchParams(q ? { q } : {}); // ถ้า q ว่าง ให้ลบ query ออก
  

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="topbar">
        <h1 className="welcome-title">คลังสินค้า!</h1>

        <div className="search-row">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
            <i className="fas fa-search" onClick={runSearch} />

            {/* ไอคอนสแกนให้ใช้ navigate อย่างเดียว */}
            <i
              className="fas fa-qrcode"
              onClick={() => navigate("/scan")}
              style={{ cursor: "pointer", marginLeft: 10 }}
              aria-label="สแกนบาร์โค้ด"
            />
          </div>
            <button className="add-btn" onClick={() => navigate("/add-product")}>
              รับสินค้าเข้า
            </button>

        </div>
      </div>

      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>รหัสสินค้า</th>
              <th>คลัง</th>
              <th>หมวดหมู่</th>
              <th>ไซส์</th>
              <th>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.product_id}
                onClick={() =>
                  navigate(`/products/${encodeURIComponent(p.sku)}`)
                }
                style={{ cursor: "pointer" }}
                title="คลิกเพื่อดูรายละเอียด"
              >
                <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={p.image}
                    alt={p.product_name}
                    style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                  />
                  <span>{p.product_name}</span>
                </td>
                <td>{p.sku}</td>
                <td>{p.quantity} ในคลัง</td>
                <td>{p.category_name}</td>
                <td>{p.size}</td>
                <td
                  onClick={(e) => {
                    e.stopPropagation(); // กันไม่ให้พาไปหน้า detail เมื่อกดปากกา
                    // TODO: เปิด modal แก้ไข หรือพาไปหน้าแก้ไข
                  }}
                >
                  <i className="fas fa-pencil-alt edit-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="stock-summary">
          คงคลัง{" "}
          {products.reduce((sum, p) => sum + Number(p.quantity || 0), 0)}
        </div>
      </div>
    </div>
  );
}
