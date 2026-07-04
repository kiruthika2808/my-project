import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

export default function Home({ shop }) {
  const { rooms, products, reviews } = useStore();
  const bestSellers = products.slice(0, 4);

  // Fallback room images just in case
  const roomItems = [
    ["Living Room", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=85", "/shop?room=Living%20Room"],
    ["Bedroom", "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=600&q=85", "/shop?room=Bedroom"],
    ["Dining Room", "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=85", "/shop?room=Dining%20Room"],
    ["Workspace", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=85", "/shop?room=Workspace"],
    ["Outdoor", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85", "/shop?room=Outdoor"]
  ];

  return (
    <div className="bg-[#FDFBF7]">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Shop By Collection */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl uppercase tracking-[0.2em] text-stone-900 sm:text-3xl">
            Shop By Collection
          </h2>
          <Link to="/rooms" className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88D4D] hover:underline">
            View all
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {roomItems.map(([name, image, link]) => (
            <Link 
              key={name} 
              to={link} 
              className="group relative min-h-64 overflow-hidden rounded-xl bg-stone-100 flex flex-col justify-end p-5 transition-transform duration-350 hover:-translate-y-1 hover:shadow-lg"
            >
              <img 
                src={image} 
                alt={`${name} interior`} 
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
              <div className="relative z-10 flex items-center justify-between text-white">
                <span className="font-serif text-lg font-medium tracking-wide">{name}</span>
                <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="bg-[#FDFBF7] mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 flex items-baseline justify-between border-b border-stone-100 pb-5">
          <h2 className="font-serif text-2xl uppercase tracking-[0.2em] text-stone-900 sm:text-3xl">
            Best Sellers
          </h2>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-[0.14em] text-[#B88D4D] hover:underline">
            View all
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} shop={shop} />
          ))}
        </div>
      </section>

      {/* 4. Client Testimonials & Interior Grid */}
      <section className="bg-[#F3ECE6] py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          
          {/* Testimonial Quote */}
          <div className="flex flex-col justify-center">
            {/* 5 stars */}
            <div className="mb-6 flex gap-1 text-[#B88D4D]" aria-label="5 stars">
              ★★★★★
            </div>
            <blockquote className="font-serif text-3xl italic leading-relaxed text-stone-900 sm:text-4xl">
              "The quality, finish and comfort is beyond expectations. Spacesic truly defines luxury living."
            </blockquote>
            <cite className="mt-8 not-italic">
              <span className="block font-sans text-base font-bold text-stone-900">Priya Mehta</span>
              <span className="mt-1 block font-sans text-xs font-semibold uppercase tracking-wider text-stone-400">Verified Purchaser</span>
            </cite>
          </div>

          {/* Side Interior Visual Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=85" 
                alt="Living room chair closeup" 
                className="h-full w-full object-cover transition duration-500 hover:scale-105" 
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-xl pt-6">
              <img 
                src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=85" 
                alt="Travertine table interior" 
                className="h-full w-full object-cover transition duration-500 hover:scale-105" 
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=85" 
                alt="Bedroom minimalist setup" 
                className="h-full w-full object-cover transition duration-500 hover:scale-105" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Stay Inspired Newsletter */}
      <section className="bg-[#FDFBF7] py-20 px-5 sm:px-8 border-t border-stone-100">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-normal text-stone-900 sm:text-4xl">
            Stay inspired with Spacesic
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-500">
            Sign up for new collections, design stories and exclusive offers.
          </p>
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="mx-auto mt-8 flex max-w-md items-center gap-2.5"
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="h-12 w-full rounded-full border border-stone-200 bg-[#F5F3EF] px-5 text-sm text-stone-850 outline-none placeholder:text-stone-400 focus:border-[#B88D4D]" 
            />
            <button 
              type="submit" 
              className="h-12 rounded-full bg-[#222222] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B88D4D] transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
