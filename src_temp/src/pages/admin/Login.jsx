import { useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/admin/Spinner";
import Toast from "../../components/admin/Toast";
import { useAdmin } from "../../context/AdminContext";

export default function Login() {
  const { isAuthenticated, login } = useAdmin();
  const [form, setForm] = useState({ email: "admin@spacesichome.com", password: "spacesic123" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await login(form);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 text-stone-950 dark:bg-stone-950 dark:text-white">
      <Toast />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9c6f32]">Spacesic admin</p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl font-bold leading-tight">Control every room, order, and customer moment.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">A polished dashboard for managing products, categories, orders, customers, reviews, analytics, and store settings.</p>
        </section>
        <form className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-stone-900 sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-950 font-bold text-[#d8b26e]">S</span>
            <div>
              <p className="font-serif text-2xl font-bold tracking-[0.16em]">SPACESIC</p>
              <p className="text-sm text-stone-500">Admin login</p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold">Email
            <input className="admin-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-bold">Password
            <input className="admin-input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <button className="admin-btn-primary mt-6 w-full" disabled={loading}>{loading ? <Spinner /> : "Sign in"}</button>
          <p className="mt-4 text-center text-xs text-stone-500">Demo accepts any non-empty email and password.</p>
        </form>
      </div>
    </div>
  );
}
