import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
