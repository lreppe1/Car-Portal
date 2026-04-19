import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const rawUser = localStorage.getItem("admin_user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}