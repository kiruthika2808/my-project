import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "./Icon";
import { useStore } from "../context/StoreContext";

export default function Navbar({ cartCount, wishlistCount }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [searchVal, setSearchVal] = useState(params.get("q") || "");
  const { shop } = useStore();

  // Sync search input with URL params
  useEffect(() => {
    setSearchVal(params.get("q") || "");
  }, [params]);

  const links = [
    ["Shop", "/shop"],
    ["Collections", "/collections"],
    ["Rooms", "/rooms"],
    ["Inspiration", "/blog"],
    ["Blog", "/blog"],
  ];

  const navClass = ({ isActive }) =>
    `text-xs font-bold tracking-[0.14em] uppercase transition pb-1 border-b-2 ${
      isActive 
        ? "text-stone-950 border-stone-950" 
        : "text-stone-500 border-transparent hover:text-stone-950 hover:border-stone-300"
    }`;

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-[#FDFBF7]/90 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#222222] py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white">
        Free Delivery on Orders Above ₹25,000
      </div>

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center" aria-label="Spacesic Home">
          <span className="font-serif text-2xl font-extrabold tracking-[0.24em] text-stone-950">SPACESIC</span>
        </Link>
        
        {/* Middle: Nav Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <NavLink key={href} to={href} className={navClass}>
              {label}
            </NavLink>
          ))}
        </div>
        
        {/* Right: Search bar & Icons */}
        <div className="hidden items-center gap-5 lg:flex">
          {/* Integrated Search Input matching Mockup */}
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-[#F5F3EF] px-3.5 py-1.5 w-60">
            <Icon name="search" className="h-4 w-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search for products, rooms..." 
              className="bg-transparent text-xs text-stone-800 outline-none placeholder:text-stone-400/80 font-medium w-full"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>

          <Link className="p-2 text-stone-600 hover:text-stone-950 transition relative" to="/wishlist" aria-label="Wishlist">
            <Icon name="heart" className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-stone-950 text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link className="p-2 text-stone-600 hover:text-stone-950 transition" to="/profile" aria-label="Profile">
            <Icon name="user" className="h-5 w-5" />
          </Link>
          
          {/* Cart Icon Trigger for Drawer */}
          <button 
            onClick={() => shop.setCartDrawerOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-950 transition relative cursor-pointer" 
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-stone-950 text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            className="p-2 text-stone-600 hover:text-stone-950 transition" 
            onClick={() => shop.setCartDrawerOpen(true)}
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          <button 
            className="p-2 text-stone-600 hover:text-stone-950 transition menu-toggle" 
            type="button" 
            aria-label="Toggle menu" 
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {/* Mobile search bar */}
      <div className="w-full bg-[#EFECE6] px-5 py-2.5 border-t border-stone-200/50 lg:hidden">
        <div className="mx-auto flex items-center gap-3">
          <Icon name="search" className="h-4.5 w-4.5 text-stone-500" />
          <input 
            type="text" 
            placeholder="Search furniture, materials, rooms..." 
            className="w-full bg-transparent text-xs text-stone-850 outline-none placeholder:text-stone-500/80 font-medium"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-[#FDFBF7] px-5 py-5 lg:hidden">
          <div className="mx-auto grid gap-4">
            {links.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setOpen(false)} className={navClass}>
                {label}
              </NavLink>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100">
              <Link className="text-center py-2 text-xs font-semibold uppercase bg-stone-100 text-stone-700 hover:bg-stone-200" to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
              <Link className="text-center py-2 text-xs font-semibold uppercase bg-stone-100 text-stone-700 hover:bg-stone-200" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              <button 
                className="text-center py-2 text-xs font-semibold uppercase bg-stone-950 text-white" 
                onClick={() => { setOpen(false); navigate("/shop"); }}
              >
                Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
