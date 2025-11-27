// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import MonthlyReportPage from "./components/MonthlyReportPage";
import ScanPage from "./components/ScanPage";
import ProductPage from "./components/ProductPage";
import CategoryPage from "./components/CategoryPage";
import CategoryDetailPage from "./components/CategoryDetailPage";
import ReceiveProductPage from "./components/ReceiveProductPage";
import AddProductPage from "./components/AddProductPage";
import StockCheckPage from "./components/StockCheckPage";
import SettingsPage from "./components/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./components/ProductDetail";
import ReportPage from "./components/ReportPage";
import ActivityPage from "./components/ActivityPage";
import TopIssuedPage from "./components/TopIssuedPage";
import TopCategoriesPage from "./components/TopCategoriesPage";
import LowStockPage from "./components/LowStockPage";


export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/monthly-report" element={<ProtectedRoute><MonthlyReportPage /></ProtectedRoute>} />
      <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
      <Route path="/products/:sku" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/category/:categoryName" element={<ProtectedRoute><CategoryDetailPage /></ProtectedRoute>} />
      <Route path="/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
      <Route path="/receive" element={<ProtectedRoute><ReceiveProductPage /></ProtectedRoute>} />
      <Route path="/stock-check" element={<ProtectedRoute><StockCheckPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/top-issued" element={<TopIssuedPage />} />
      <Route path="/top-categories" element={<TopCategoriesPage />} />
      <Route path="/low-stock" element={<LowStockPage />} />
      {/* เส้นทางไม่ตรง -> กลับหน้า login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
