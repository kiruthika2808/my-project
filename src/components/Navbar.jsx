import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "./Icon";

export default function Navbar({ cartCount, wishlistCount }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Shop", "/shop"],
    ["Rooms", "/rooms"],
    ["Collections", "/collections"],
    ["Designers", "/designers"],
    ["Brands", "/brands"],
    ["Blog", "/blog"],
  ];
  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? "text-stone-950" : "text-stone-600 hover:text-stone-950"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#fbfaf7]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Aurelia Home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-stone-950 text-sm font-semibold text-[#d8b26e]">A</span>
          <span className="font-serif text-2xl font-semibold tracking-[0.16em] text-stone-950">AURELIA</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => <NavLink key={href} to={href} className={navClass}>{label}</NavLink>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Link className="icon-btn" to="/shop" aria-label="Search"><Icon name="search" className="h-4 w-4" /></Link>
          <Link className="icon-btn relative" to="/wishlist" aria-label="Wishlist">
            <Icon name="heart" className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#d8b26e] text-[10px] font-bold text-stone-950">{wishlistCount}</span>
          </Link>
          <Link className="icon-btn" to="/profile" aria-label="Profile"><Icon name="user" className="h-4 w-4" /></Link>
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            <Icon name="cart" className="h-4 w-4" /> Cart {cartCount}
          </Link>
        </div>
        <button className="icon-btn lg:hidden" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </nav>
      {open && (
        <div className="border-t border-stone-200 bg-[#fbfaf7] px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-4">
            {links.map(([label, href]) => <NavLink key={href} to={href} onClick={() => setOpen(false)} className={navClass}>{label}</NavLink>)}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Link className="pill-link" to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
              <Link className="pill-link" to="/cart" onClick={() => setOpen(false)}>Cart</Link>
              <Link className="pill-link" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
