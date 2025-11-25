import { useState } from "react";
import Sidebar from "./Sidebar";
import "./CategoryPage.css";

import { useNavigate } from "react-router-dom";


export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { name: "แตะรัดส้น", image: "/type1.png" },
    { name: "แตะแบบสวม", image: "/type2.png" },
    { name: "แตะแบบคีบ", image: "/type3.png" },
  ]);

  const [showInput, setShowInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [menuIndex, setMenuIndex] = useState(null); // เปิดเมนูเฉพาะ index

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    setCategories([...categories, { name: newCategoryName, image: "/placeholder.png" }]);
    setNewCategoryName("");
    setShowInput(false);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("แน่ใจนะคะว่าต้องการลบหมวดหมู่นี้");
    if (!confirmDelete) return;
    
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
    setMenuIndex(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingName(categories[index].name);
    setMenuIndex(null);
  };

  const handleSaveEdit = () => {
    const updated = [...categories];
    updated[editingIndex].name = editingName;
    setCategories(updated);
    setEditingIndex(null);
    setEditingName("");
  };

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="topbar">
        <h1 className="welcome-title">หมวดหมู่</h1>
        <div className="search-group">
          <input type="text" placeholder="Search" className="search-input" />
          <i className="fas fa-search"></i>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <div
  className="category-card"
  key={index}
  onClick={() => navigate(`/category/${cat.name}`)}
>
  <div
    className="menu-dots"
    onClick={(e) => {
      e.stopPropagation(); // ⛔️ ไม่ให้ propagate ไปที่กล่องหมวด
      setMenuIndex(menuIndex === index ? null : index);
    }}
  >
    ⋯
  </div>
  {menuIndex === index && (
    <div
      className="menu-popup"
      onClick={(e) => e.stopPropagation()} // ⛔️ ป้องกันหลุดออกตอนกดปุ่มในเมนู
    >
      <button onClick={() => handleEdit(index)}>แก้ไข</button>
      <button onClick={() => handleDelete(index)}>ลบ</button>
    </div>
  )}
  <img src={cat.image} alt={cat.name} />
  {editingIndex === index ? (
    <>
      <input
        value={editingName}
        onChange={(e) => setEditingName(e.target.value)}
      />
      <button onClick={handleSaveEdit}>บันทึก</button>
    </>
  ) : (
    <p>{cat.name}</p>
  )}
</div>

        ))}

        <div className="category-card add-new">
          {showInput ? (
            <div className="add-category-form">
              <input
                type="text"
                placeholder="ชื่อหมวดหมู่"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button onClick={handleAddCategory}>บันทึก</button>
            </div>
          ) : (
            <i
              className="fas fa-plus"
              onClick={() => setShowInput(true)}
              style={{ cursor: "pointer" }}
            ></i>
          )}
        </div>
      </div>
    </div>
  );
}
