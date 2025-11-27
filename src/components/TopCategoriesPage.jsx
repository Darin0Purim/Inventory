import "./ActivityPage.css";
import Sidebar from "./Sidebar";

export default function TopCategoriesPage() {

  const products = [
    {
      id: 1,
      image: "/uploads/item1.png",
      name: "รองเท้าลายคาด",
      code: "112233",
      quantity: 20,
      category: "แตะรัดส้น",
      issued: 17
    },
    {
      id: 2,
      image: "/uploads/item2.png",
      name: "รองเท้าลายดอก",
      code: "112244",
      quantity: 30,
      category: "แตะสวม",
      issued: 22
    }
  ];

  return (
    <div className="activity-page">
      <Sidebar />

      <div className="activity-content">
        <h1>หมวดหมูบ่สินค้าขายดี</h1>

        <table className="stock-table">
          <thead>
            <tr>
              <th>รูปสินค้า</th>
              <th>ชื่อสินค้า</th>
              <th>รหัสสินค้า</th>
              <th>หมวดหมู่</th>
              <th>จำนวนคงคลัง</th>
              <th>จำนวนขายดี</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} className="product-thumb" />
                </td>
                <td>{p.name}</td>
                <td>{p.code}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>{p.issued}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
