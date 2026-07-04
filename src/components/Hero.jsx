import { Link } from "react-router-dom";

export function PageHero({ eyebrow, title, text }) {
  return (
    <section className="relative overflow-hidden bg-[#F3ECE6] py-14 border-b border-stone-200/30">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B88D4D]">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl font-normal leading-tight text-stone-900 sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-stone-500 text-sm leading-relaxed">{text}</p>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] py-12 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Column Text Content */}
        <div className="animate-rise flex flex-col justify-center pr-4">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#B88D4D]">
            Timeless design.
          </p>
          <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.05] text-stone-900 sm:text-6xl lg:text-[76px] xl:text-[84px]">
            Crafted for <br />
            Modern Living
          </h1>
          <p className="mt-6 max-w-md font-sans text-sm leading-6 text-stone-500">
            Timeless furniture designed for elegant homes.
          </p>
          <div className="mt-10">
            <Link 
              className="group inline-flex items-center gap-3 rounded-full bg-[#222222] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#B88D4D] hover:shadow-lg" 
              to="/shop"
            >
              Shop Collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          
          {/* Slider Pagination Indicator */}
          <div className="mt-16 flex items-center gap-4">
            <span className="font-serif text-sm font-semibold text-stone-900">01</span>
            <div className="h-[2px] w-20 bg-stone-200">
              <div className="h-full w-1/3 bg-stone-900" />
            </div>
            <span className="font-serif text-sm font-semibold text-stone-300">03</span>
          </div>
        </div>

        {/* Right Column Sofa Image */}
        <div className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[600px] xl:min-h-[640px] animate-fade">
          <img 
            className="absolute inset-0 h-full w-full rounded-2xl object-cover shadow-2xl shadow-stone-100" 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1500&q=85" 
            alt="Spacesic curated luxury curved sofa" 
          />
        </div>
      </div>
    </section>
  );
}
