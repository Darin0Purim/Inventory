// DashboardPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import "./DashboardPage.css";
import Sidebar from "./Sidebar";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

 // นำเข้าไลยราลีดาวน์โหลดไฟล์เอกสารรายงานหน้าแดชบอร์ด
const API = import.meta.env?.VITE_API_URL || 'http://10.113.170.168:5000';
const BASE_URL = API;

// helper แบบปลอดภัย – ถ้ามี token ค่อยใส่ header
function safeAuthHeaders() {
  try {
    const token = window.localStorage?.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export default function DashboardPage() {

  const navigate = useNavigate();                // ⬅️ ใช้สำหรับเปลี่ยนหน้า
  const [search, setSearch] = useState("");      // ⬅️ state เก็บคำค้น

  const [products, setProducts] = useState([]);
  const [topIssued, setTopIssued] = useState([]);        // สินค้าขายดีรายเดือน
  const [topCategories, setTopCategories] = useState([]); // ประเภทสินค้าขายดี

  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.quantity) <= 30);
  const categories = [...new Set(products.map((p) => p.category_id))];
  const damagedCount = 0; // ไว้ต่อยอดทีหลัง

  // ฟังก์ชันดาวน์โหลดหน้า Dashboard
const downloadDashboard = async () => {
    try {
      const dashboard = document.querySelector(".dashboard-page");

      const canvas = await html2canvas(dashboard, {
        scale: 2,
        useCORS: true,
      });
const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard-report.pdf");

    } catch (err) {
      console.error("ดาวน์โหลด PDF ล้มเหลว:", err);
    }
  };


  // ดึง products
 const fetchProducts = useCallback(async () => {
  try {
    const res = await fetch(`${API}/api/products`, { headers: { ...safeAuthHeaders() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("โหลด products ล้มเหลว:", err);
    setProducts([]);
  }
}, [API]);

  // ดึงสินค้าขายดีรายเดือน (backend: /api/reports/bestseller2)
  const fetchTopMonthly = useCallback(async () => {
  try {
    // ถ้า backend ทำ alias ตามข้อ 5 เรียกแบบนี้ได้
    const res = await fetch(`${API}/api/analytics/top-issued?limit=6`, { headers: { ...safeAuthHeaders() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setTopIssued(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("โหลด top-issued ล้มเหลว:", err);
    setTopIssued([]);
  }
}, [API]);

  // ดึงประเภทสินค้าขายดี
const fetchTopCategories = useCallback(async () => {
  try {
    // ถ้า backend ทำ alias ตามข้อ 5 เรียกแบบนี้ได้
    const res = await fetch(`${API}/api/analytics/top-categories`, { headers: { ...safeAuthHeaders() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setTopIssued(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("โหลด top-categories ล้มเหลว:", err);
    setTopCategories([]);
  }
}, [API]);

  useEffect(() => {
    fetchProducts();
    fetchTopMonthly();
    fetchTopCategories();
  }, [fetchProducts, fetchTopMonthly, fetchTopCategories]);

    const goSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigate(`/products?q=${encodeURIComponent(q)}`); // ⬅️ ส่งต่อไปหน้า “สินค้า”
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="topbar">
        <h1 className="welcome-title">ยินดีต้อนรับ!</h1>
        <div className="search-row">
          <div className="search-box">
            

           <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}   // ⬅️ กด Enter เพื่อค้นหา
            />
            <i className="fas fa-search" onClick={goSearch}></i>     {/* ⬅️ คลิกไอคอนเพื่อค้นหา */}
            <i
              className="fas fa-qrcode"
              onClick={() => navigate("/scan")}
              style={{ marginLeft: 10, cursor: "pointer" }}
            />
            
          </div>
          
        </div>
        
      </div>
      <div className="download-row">
        <Link to="/report" className="download-link">
          ดาวน์โหลดรายงาน (PDF)
        </Link>
      </div>


      {/* ==== สรุปยอดรวม ==== */}
      <div className="summary-boxes">
        <div className="summary-card">
          <p className="summary-title">{totalProducts}</p>
          <p>สินค้าเบิกแล้ว</p>
        </div>
        <div className="summary-card red">
          <p className="summary-title">{lowStock.length}</p>
          <p>สินค้าเหลือ</p>
        </div>
        <div className="summary-card">
          <p className="summary-title">{categories.length}</p>
          <p>หมวดหมู่สินค้า</p>
        </div>
        <div className="summary-card">
          <p className="summary-title">{damagedCount}</p>
          <p>สินค้าเสียหาย</p>
        </div>
      </div>

      <div className="product-card">
        {/* ==== สินค้าขายดีรายเดือน ==== */}
        <div className="section">
          <h2
            className="section-link"
            onClick={() => navigate("/top-issued")}
          >
            สินค้าขายดีรายเดือน
          </h2>

          <div className="product-grid">
            {topIssued.length === 0 && <p>ยังไม่มีข้อมูลเดือนนี้</p>}
            {topIssued.map((it) => (
              <figure key={it.product_id} className="product-item">
                <img
                  src={
                    it.image?.startsWith("http")
                      ? it.image
                      : `${BASE_URL}/uploads/${it.image}`
                  }
                  alt={it.product_name}
                />
                <figcaption>
                  {it.product_name} <small>({it.issued_qty})</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* ==== ประเภทสินค้าขายดี ==== */}
        <div className="section">
         <h2
            className="section-link"
            onClick={() => navigate("/top-categories")}
          >
            ประเภทสินค้าขายดี
          </h2>

          <div className="category-grid">
            {topCategories.length === 0 && <p>ยังไม่มีข้อมูลเดือนนี้</p>}
            {topCategories.map((cat) => (
              <figure className="product-types" key={cat.category_id}>
                {/* ปรับเส้นทางรูปตามที่มีจริง */}
                <img
                  src={`/images/${cat.category_name}.png`}
                  alt={cat.category_name}
                />
                <figcaption>
                  {cat.category_name} <small>({cat.issued_qty})</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div> {/* <-- ปิด product-card ให้เรียบร้อย */}

      {/* ==== สินค้าใกล้หมด ==== */}
      <div className="low-stock">
        <h2
          className="section-link"
          onClick={() => navigate("/low-stock")}
        >
          สินค้าใกล้หมด
        </h2>

        {lowStock.map((item) => (
          <div key={item.product_id}>
            <img
              src={
                item.image?.startsWith("http")
                  ? item.image
                  : `${BASE_URL}/uploads/${item.image}`
              }
              alt={item.product_name}
            />
            <p>
              {item.product_name} ({item.quantity} คู่)
            </p>
          </div>
        ))}
      </div>

      {/* ==== กิจกรรมล่าสุด ==== */}
      <div className="activity-box">
        <div className="activity-header">
          <h2
            className="section-link"
            onClick={() => navigate("/activity")}
          >
            กิจกรรมล่าสุด
          </h2>

          <p className="activity-date">อัปเดตล่าสุด 20/07/2568</p>
        </div>
        <p>รับสินค้าเข้าเพิ่ม 200</p>
        <p>สินค้าออก : รองเท้าสีขาวลายคาดแดง</p>
      </div>
    </div>
  );
  }
