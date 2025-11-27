// ReportPage.jsx
import "./ReportPage.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function ReportPage() {
  const navigate = useNavigate();
const exportPDF = async () => {
  const report = document.querySelector(".report-content");

  const canvas = await html2canvas(report, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("monthly-report.pdf");
};
const exportExcel = () => {
  const table = document.querySelector(".report-table");
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, "monthly-report.xlsx");
};
  return (
    <div className="report-page">
      <Sidebar />

      <div className="report-content">

        <div className="report-header">
          <h1>รายงานประจำเดือน</h1>

          <div className="report-actions">
            
            <select className="month-select">
              <option value="">เลือกเดือน</option>
              <option value="2025-01">มกราคม 2568</option>
              <option value="2025-02">กุมภาพันธ์ 2568</option>
              <option value="2025-03">มีนาคม 2568</option>
            </select>
            <select className="category-select">
                <option>เลือกหมวดหมู่</option>
            </select>
            
           
            <button className="btn-export" onClick={exportPDF}>Export PDF</button>

            <button className="btn-export" onClick={exportExcel}>Export Excel</button>

          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <p className="summary-title">120</p>
            <p>ยอดเบิกออกทั้งหมด</p>
          </div>

          <div className="summary-card">
            <p className="summary-title">80</p>
            <p>ยอดสินค้าเข้า</p>
          </div>

          <div className="summary-card">
            <p className="summary-title">15</p>
            <p>สินค้าคงเหลือต่ำกว่าเกณฑ์</p>
          </div>
        </div>

        <div className="report-section">
          <h2>ตารางข้อมูลสินค้า</h2>

          <table className="report-table">
            <thead>
              <tr>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ยอดเข้า</th>
                <th>ยอดออก</th>
                <th>คงเหลือ</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>112233</td>
                <td>รองเท้าลายคาดขาว</td>
                <td>แตะรัดส้น</td>
                <td className="in">16</td>
                <td className="out">155</td>
                <td className={10 <= 30 ? "low" : ""}>10</td>
              </tr>

              <tr>
                <td>221144</td>
                <td>รองเท้าดำพื้นนิ่ม</td>
                <td>แตะสวม</td>
                <td className="in">22</td>
                <td className="out">22</td>
                <td className={10 <= 30 ? "low" : ""}>33</td>
              </tr>
              

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
