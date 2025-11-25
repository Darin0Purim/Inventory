import { NavLink, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import { logout } from '../utils/auth';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("คุณต้องการออกจากระบบหรือไม่?");
    if (!confirmed) return;

    // เลือกใช้ util ถ้ามี ไม่งั้นลบ token ตรงๆ
    if (typeof logout === 'function') {
      logout();
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }

    navigate('/login'); // หรือ '/' ตาม flow ที่ต้องการ
  };
  
   return (
    <aside className="sidebar">
      <div className="profile">
        <img src="/profile.jpg" alt="Profile" className="profile-img" />
        <p className="profile-name">ปุริมปริชญ์</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          🏠 หน้าหลัก
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          📦 สินค้า
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          📁 หมวดหมู่
        </NavLink>
        <NavLink to="/receive" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          📥 รับสินค้า
        </NavLink>
        <NavLink to="/stock-check" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          📋 ตรวจนับสินค้า
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
          ⚙️ การตั้งค่า
        </NavLink>
      </nav>

      <button onClick={handleLogout} className="sidebar-link logout">
        ⏻ ออกจากระบบ
      </button>
    </aside>
  );
}

