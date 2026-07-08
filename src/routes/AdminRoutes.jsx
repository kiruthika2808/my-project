import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Analytics from "../pages/admin/Analytics";
import Categories from "../pages/admin/Categories";
import CustomerDetails from "../pages/admin/CustomerDetails";
import Customers from "../pages/admin/Customers";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import OrderDetails from "../pages/admin/OrderDetails";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Reviews from "../pages/admin/Reviews";
import Settings from "../pages/admin/Settings";
import Content from "../pages/admin/Content";
import ProtectedRoute from "./ProtectedRoute";
import { ErrorBoundary } from "../components/admin/ErrorBoundary";

export default function AdminRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:customerId" element={<CustomerDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="content" element={<Content />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
