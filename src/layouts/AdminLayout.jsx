import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/admin/Toast";
import { useAdmin } from "../context/AdminContext";

const navItems = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Categories", "/admin/categories"],
  ["Reviews", "/admin/reviews"],
  ["Content", "/admin/content"],
  ["Analytics", "/admin/analytics"],
  ["Settings", "/admin/settings"],
];

export default function AdminLayout() {
  const { darkMode, toggleTheme, logout, settings, orders, reviews } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const pendingCount = orders.filter((order) => order.status === "Pending").length + reviews.filter((review) => review.status === "Pending").length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-white">
        <Toast />
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-stone-800 bg-[#1c1917] px-6 py-6 text-stone-300 lg:block">
          <NavLink to="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 font-bold text-[#d8b26e] text-lg font-serif">S</span>
            <div>
              <p className="font-serif text-xl font-bold tracking-[0.18em] text-white">SPACESIC</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Admin Panel</p>
            </div>
          </NavLink>
          <nav className="mt-10 grid gap-1.5">
            {navItems.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/admin"}
                className={({ isActive }) => `rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  isActive 
                    ? "bg-white/10 text-white border-l-2 border-[#d8b26e]" 
                    : "text-stone-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button 
            className="mt-10 w-full h-10 rounded-full border border-stone-700 bg-transparent text-xs font-bold uppercase tracking-wider text-stone-300 hover:bg-white/5 hover:text-white transition cursor-pointer" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-stone-900/90 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9c6f32] dark:text-[#d8b26e]">Spacesic admin</p>
                <h1 className="text-2xl font-bold sm:text-3xl">{navItems.find(([, href]) => href === location.pathname)?.[0] || "Workspace"}</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select className="admin-input lg:hidden" value={location.pathname} onChange={(event) => navigate(event.target.value)}>
                  {navItems.map(([label, href]) => <option key={href} value={href}>{label}</option>)}
                </select>
                <div className="relative">
                  <button className="admin-btn-secondary w-full sm:w-auto">Notifications</button>
                  {pendingCount > 0 && <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#d8b26e] text-xs font-bold text-stone-950">{pendingCount}</span>}
                </div>
                <button className="admin-btn-secondary" onClick={toggleTheme}>{darkMode ? "Light mode" : "Dark mode"}</button>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-stone-950">
                  <p className="text-sm font-bold">{settings.adminName}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Owner</p>
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
