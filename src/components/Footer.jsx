import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    ["Shop", "/shop"],
    ["Collections", "/collections"],
    ["Rooms", "/rooms"],
    ["Reviews", "/reviews"],
    ["Contact", "/contact"],
    ["FAQ", "/faq"]
  ];

  return (
    <footer className="bg-[#222222] text-stone-400 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center">
              <span className="font-serif text-3xl font-extrabold tracking-[0.24em] text-white">SPACESIC</span>
            </div>
            <p className="mt-5 max-w-sm text-xs leading-6 text-stone-400">
              Spacesic makes premium interior design commerce easier to compose. Curated furniture, lighting, textiles, and objects selected for refined everyday living.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">Explore</h3>
            <div className="mt-5 grid gap-3">
              {links.map(([label, href]) => (
                <Link key={href} to={href} className="text-xs transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">About Us</h3>
            <p className="mt-5 text-xs leading-6 text-stone-400">
              Spacesic is a curated interior commerce studio for refined everyday living, pairing premium furniture, lighting, textiles, and objects with thoughtful styling support.
            </p>
          </div>
        </div>
        
        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-stone-800 pt-8 text-[11px] text-stone-500 sm:flex-row">
          <p>© 2026 Spacesic Home. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href="https://www.pinterest.com" target="_blank" rel="noreferrer" className="hover:text-white">Pinterest</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
