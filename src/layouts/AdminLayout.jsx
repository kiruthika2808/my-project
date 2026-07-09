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

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
              <div className="flex items-center gap-3">
                <select className="admin-input lg:hidden" value={location.pathname} onChange={(event) => navigate(event.target.value)}>
                  {navItems.map(([label, href]) => <option key={href} value={href}>{label}</option>)}
                </select>
                <div className="relative">
                  <button 
                    className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-stone-700 dark:border-white/10 dark:bg-stone-900 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 transition cursor-pointer"
                    title="Notifications"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </button>
                  {pendingCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#d8b26e] text-[10px] font-bold text-stone-950">{pendingCount}</span>}
                </div>
                <button 
                  className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-stone-700 dark:border-white/10 dark:bg-stone-900 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 transition cursor-pointer"
                  onClick={toggleTheme}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.93 4.93l1.59 1.59m10.96 10.96l1.59 1.59M3 12h2.25m13.5 0H21M6.52 17.48l-1.59 1.59m10.96-10.96l-1.59 1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>
                <div className="flex items-center gap-2 rounded-xl p-1 pr-3 border border-stone-200 bg-white dark:border-white/10 dark:bg-stone-900 shadow-xs">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#d8b26e] text-stone-950 font-bold text-xs">
                    {getInitials(settings.adminName)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold leading-tight">{settings.adminName}</p>
                    <p className="text-[9px] font-semibold text-stone-500 leading-none">Owner</p>
                  </div>
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
