import { Link } from "react-router-dom";

export default function Footer() {
  const links = [["Shop", "/shop"], ["Reviews", "/reviews"], ["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"]];

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d8b26e] text-sm font-semibold text-stone-950">A</span>
              <span className="font-serif text-2xl font-semibold tracking-[0.16em] text-white">AURELIA</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7">Premium interior design commerce for homes that feel collected, composed, and deeply personal.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Explore</h3>
            <div className="mt-5 grid gap-3">
              {links.map(([label, href]) => <Link key={href} to={href} className="text-sm transition hover:text-white">{label}</Link>)}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Studio</h3>
            <p className="mt-5 text-sm leading-7">Trade sourcing, styling notes, room edits, and white-glove support for residential and hospitality projects.</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 text-sm sm:flex-row">
          <p>Copyright 2026 Aurelia Home. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com" className="hover:text-white">Instagram</a>
            <a href="https://www.pinterest.com" className="hover:text-white">Pinterest</a>
            <a href="https://www.linkedin.com" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
