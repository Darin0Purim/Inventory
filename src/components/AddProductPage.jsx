import { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImage = (e) => {
    setForm((f) => ({ ...f, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("size", form.size);
    formData.append("image", form.image);

    try {
      await axios.post("http://localhost:5000/api/products", formData);
      alert("เพิ่มสินค้าสำเร็จ!");
      setForm({ name: "", category: "", size: "", image: null });
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <>
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
                style={{ marginLeft: "10px", cursor: "pointer" }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="ชื่อสินค้า" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="หมวดหมู่" />
        <input name="size" value={form.size} onChange={handleChange} placeholder="ไซส์" />
        <input type="file" accept="image/*" onChange={handleImage} />
        <button type="submit">บันทึก</button>
      </form>
    </>
  );
}
