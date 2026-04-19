import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookingPage from "./pages/BookingPage";
import ReportPage from "./pages/ReportPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/reports"
          element={
            <ProtectedAdminRoute>
              <ReportPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}