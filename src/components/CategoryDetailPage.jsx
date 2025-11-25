// CategoryDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./CategoryDetailPage.css";

export default function CategoryDetailPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // สมมุติว่าดึงมาจากฐานข้อมูลจริงในอนาคต
  const allProducts = [
    { image: "/shoes1.png", name: "สายฟ้า", code: "112233344", stock: 20, size: 43, gender: "ผู้ชาย", category: "แตะรัดส้น" },
    { image: "/shoes2.png", name: "ลายดอก", code: "112233347", stock: 30, size: 36, gender: "ผู้หญิง", category: "แตะรัดส้น" },
    { image: "/shoes3.png", name: "ลายขาว", code: "112233345", stock: 50, size: 43, gender: "ผู้หญิง", category: "แตะหูหนีบ" },
    // ... เพิ่มได้เรื่อยๆ
  ];

  const filtered = allProducts.filter(p => p.category === categoryName);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="topbar">
        <h1 className="welcome-title">{categoryName}</h1>
        {/* ค้นหา/ฟิลเตอร์เพิ่มเติมก็เพิ่มตรงนี้ได้ */}
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th></th>
            <th>ชื่อสินค้า</th>
            <th>รหัสสินค้า</th>
            <th>คลัง</th>
            <th>หมวดหมู่</th>
            <th>ไซส์</th>
            <th>แก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, i) => (
            <tr key={i}>
              <td><input type="checkbox" /></td>
              <td><img src={item.image} alt={item.name} /> {item.name}</td>
              <td>{item.code}</td>
              <td>{item.stock} ในคลัง</td>
              <td>{item.gender}</td>
              <td>{item.size}</td>
              <td><i className="fas fa-pencil-alt edit-icon"></i></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <button onClick={() => navigate(-1)} className="back-btn">⬅ กลับ</button>
        <div className="stock-summary">คงคลัง {filtered.reduce((sum, p) => sum + p.stock, 0)}</div>
      </div>
    </div>
  );
}
