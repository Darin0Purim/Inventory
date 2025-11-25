// StockCheckPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./StockCheckPage.css";

export default function StockCheckPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // เป็นการจำลองดึงข้อมูลจาก database
    setProducts([
      { name: "คีบสีฟ้า", size: "37", sku: "SKU-RS35-41", stock: 9, image: "/shoes2.png", actual: "", status: "" },
      { name: "รัดส้นลายดอก", size: "38", sku: "SKU-RS35-41", stock: 10, image: "/shoes2.png", actual: "", status: "" },
      { name: "สวมสีครีม", size: "39", sku: "SKU-RS35-41", stock: 7, image: "/shoes3.png", actual: "", status: "" },
    ]);
  }, []);

  const handleInput = (e, index) => {
    const updated = [...products];
    updated[index].actual = e.target.value;
    setProducts(updated);
  };

  const handleCheck = () => {
    const updated = products.map((item) => {
      const actual = parseInt(item.actual);
      const expected = parseInt(item.stock);
      let status = "";
      if (actual === expected) status = "ตรง";
      else if (actual < expected) status = "ขาด";
      else status = "เกิน";
      return { ...item, status };
    });
    setProducts(updated);
  };

  const handleReset = () => {
    const reset = products.map((item) => ({ ...item, actual: "", status: "" }));
    setProducts(reset);
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="content">
        <div className="topbar">
        <h1 className="welcome-title">ตรวจนับสินค้า</h1>

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
        <table className="stock-table">
          <thead>
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อสินค้า</th>
              <th>ขนาด</th>
              <th>รหัส</th>
              <th>จำนวนในคลัง</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index}>
                <td><img src={item.image} alt={item.name} className="product-img" /></td>
                <td>{item.name}</td>
                <td>{item.size}</td>
                <td>{item.sku}</td>
                <td>
                  <input
                    type="number"
                    value={item.actual}
                    onChange={(e) => handleInput(e, index)}
                    className="stock-input"
                  />
                </td>
                <td>
                  {item.status === "ตรง" && <span className="status green">✔ ตรง</span>}
                  {item.status === "ขาด" && <span className="status red">✘ ขาด</span>}
                  {item.status === "เกิน" && <span className="status orange">⚠ เกิน</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-group">
          <button onClick={handleReset} className="btn-cancel">ยกเลิก</button>
          <button onClick={handleCheck} className="btn-check">ตรวจสอบทั้งหมด</button>
        </div>
      </div>
    </div>
  );
}
