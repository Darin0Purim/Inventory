import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "รองเท้าผู้หญิง", เข้า: 40, ออก: 30 },
  { name: "รองเท้าผู้ชาย", เข้า: 25, ออก: 15 },
  { name: "รองเท้าเด็ก", เข้า: 10, ออก: 8 }
];

const stockHistory = [
  { date: "2025-07-01", sku: "SKU-RS35-41", action: "เติมสต็อก", amount: 20 },
  { date: "2025-07-03", sku: "SKU-RS35-41", action: "เอาออก", amount: 10 },
  { date: "2025-07-07", sku: "SKU-BL22-38", action: "เติมสต็อก", amount: 5 },
];

export default function MonthlyReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-07");

  return (
    <div style={{ padding: "20px", marginLeft: "240px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        รายงานประจำเดือน
      </h1>

      {/* เลือกเดือน */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>เลือกเดือน:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="2025-07">กรกฎาคม 2025</option>
          <option value="2025-06">มิถุนายน 2025</option>
        </select>

        <button style={{ marginLeft: "10px" }}>Export PDF</button>
        <button style={{ marginLeft: "10px" }}>Export Excel</button>
      </div>

      {/* กราฟ */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginBottom: "30px", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "10px" }}>สรุปยอดสินค้าเข้า-ออก</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="เข้า" fill="#4ade80" />
            <Bar dataKey="ออก" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ตารางอัปเดตสต็อก */}
      <div style={{ marginBottom: "30px" }}>
        <h2>ประวัติการอัปเดตสต็อก</h2>
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e0e0e0" }}>
              <th>วันที่</th>
              <th>รหัสสินค้า</th>
              <th>การกระทำ</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.sku}</td>
                <td>{entry.action}</td>
                <td>{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* รายการสินค้าใกล้หมด */}
      <div>
        <h2>สินค้าใกล้หมด</h2>
        <ul style={{ marginTop: "10px" }}>
          <li>SKU-BL22-38 (เหลือ 2 คู่)</li>
          <li>SKU-MN10-40 (เหลือ 5 คู่)</li>
        </ul>
      </div>
    </div>
  );
}
