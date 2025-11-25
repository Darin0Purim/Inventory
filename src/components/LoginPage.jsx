import './LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// 🔧 ลบ: ลบ 'Navigate' ที่ไม่ได้ใช้
// import { Navigate } from "react-router-dom"; 

// ✅ ใช้ตัวแปร API ที่กำหนดจาก .env หรือ fallback เป็น 'http://127.0.0.1:5000'
const API = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:5000';


console.log("API URL ที่กำลังใช้งาน:", API); // ⬅️ เพิ่มบรรทัดนี้เพื่อตรวจสอบ

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // จดจำบัญชีผู้ใช้

  // ถ้ามี token อยู่แล้ว (จากครั้งก่อน) ให้เด้งเข้า dashboard เลย
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🛑 แก้ไข: ใช้ตัวแปร API เพื่อสร้าง URL ที่ถูกต้อง
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // เก็บ token + user
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        storage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert(data.message || "เข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="register-link">
          {/* ✅ แก้ไข: เปลี่ยนเป็น "/signup" ตัวพิมพ์เล็กเพื่อให้ตรงกับ Route ใน App.jsx */}
          <Link to="/signup">ลงทะเบียน</Link> 
        </div>

        <h1>
          <span className="brand">Personal.Day</span><br />
          คลังสินค้า
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ยืนยัน</button>
        </form>

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{" "}
            จดจำบัญชีผู้ใช้
          </label>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
//9i;0lv[]
// ดึง token จาก localStorage หรือ sessionStorage
export function getToken() {
  return (
    window.localStorage.getItem('token') ||
    window.sessionStorage.getItem('token') ||
    ''
  );
}

// สร้าง headers ให้ fetch/axios เวลาเรียก API ที่ต้องใช้ JWT
export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ลบ token + user ออกจาก storage (ใช้ตอน logout)
export function logout() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  window.sessionStorage.removeItem('token');
  window.sessionStorage.removeItem('user');
}