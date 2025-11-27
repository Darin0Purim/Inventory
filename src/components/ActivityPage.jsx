import "./ActivityPage.css";
import Sidebar from "./Sidebar";

export default function TopIssuedPage() {


 const activities = [
  {
    id: 1,
    type: "out",              // ประเภท (ออก)
    type_text: "เบิกออก",
    image: "/uploads/item1.png",
    name: "รองเท้าลายคาดแดง",
    code: "112233",
    change: -3,
    new_quantity: 17,
    admin: "Admin A",
    time: "2025-01-05 09:40"
  },
  {
    id: 2,
    type: "in",
    type_text: "เติมเข้า",
    image: "/uploads/item2.png",
    name: "รองเท้าลายคาดฟ้า",
    code: "112244",
    change: +20,
    new_quantity: 50,
    admin: "Admin B",
    time: "2025-01-05 10:20"
  },
  {
    id: 3,
    type: "damaged",
    type_text: "สินค้าเสียหาย",
    image: "/uploads/item3.png",
    name: "รองเท้าลายดำ",
    code: "114455",
    change: -1,
    new_quantity: 8,
    admin: "Admin A",
    time: "2025-01-06 08:10"
  }
];


  return (
    <div className="activity-page">
      <Sidebar />

      <div className="activity-content">
        <h1>กิจกรรมล่าสุด</h1>

        <table className="stock-table">
          <thead>
            <tr>
                <th>ประเภท</th>
              <th>รูปสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>รหัสสินค้า</th>
              <th>จำนวน</th>
              <th>คงเหมือใหม่</th>
              <th>แอดมิน</th>
              <th>เวลา</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((a) => (
                <tr className={`activity-row ${a.type}`} key={a.id}>
                <td className="type-cell">{a.type_text}</td>

                <td>
                    <img src={a.image} className="product-thumb" />
                </td>

                <td>{a.name}</td>
                <td>{a.code}</td>

                <td className="change-qty">{a.change > 0 ? `+${a.change}` : a.change}</td>

                <td>{a.new_quantity}</td>

                <td>{a.admin}</td>

                <td>{a.time}</td>
                </tr>
            ))}
        </tbody>

        </table>

      </div>
    </div>
  );
}
