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
