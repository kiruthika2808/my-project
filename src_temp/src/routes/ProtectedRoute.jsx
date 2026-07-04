import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import Spinner from "../components/admin/Spinner";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAdmin();

  if (loading && !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-100 dark:bg-stone-950">
        <Spinner />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
