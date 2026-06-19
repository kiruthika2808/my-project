import { Link } from "react-router-dom";

export function PageHero({ eyebrow, title, text, image }) {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      {image && <img className="absolute inset-0 h-full w-full object-cover opacity-45" src={image} alt="" />}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/25" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b26e]">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{text}</p>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="animate-rise">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#9c6f32]">Premium Interior Marketplace</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
            Curated rooms for a quieter kind of luxury.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Shop furniture, lighting, textiles, and decor selected by interior designers for refined everyday living.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-dark" to="/shop">Shop Collection</Link>
            <Link className="btn-light" to="/rooms">Explore Rooms</Link>
          </div>
        </div>
        <div className="relative min-h-[470px] animate-fade lg:min-h-[650px]">
          <img className="absolute inset-0 h-full w-full rounded-[2rem] object-cover shadow-2xl shadow-stone-300/60" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=85" alt="Elegant neutral living room" />
          <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/45 bg-white/85 p-5 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-80">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Designer edit</p>
            <div className="mt-3 flex items-end justify-between gap-5">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-stone-950">Calm Modern</h2>
                <p className="mt-1 text-sm text-stone-600">24-piece living room bundle</p>
              </div>
              <p className="text-lg font-semibold text-[#9c6f32]">$8,240</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
