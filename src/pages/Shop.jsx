import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../data";

export default function Shop({ shop }) {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const collection = params.get("collection") || "";

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(params.get("room") || "All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState("Featured");
  const [selectedRating, setSelectedRating] = useState(null);

  // Sync Room selection from URL search params
  useEffect(() => {
    setSelectedRoom(params.get("room") || "All");
  }, [params]);

  // Accordion toggle states
  const [openFilters, setOpenFilters] = useState({
    category: true,
    price: true,
    material: true,
    color: true,
    room: true,
    rating: true,
  });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedRoom("All");
    setMaxPrice(50000);
    setSelectedRating(null);
    setParams({});
  };

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      // 1. Text search
      const text = `${product.name} ${product.brand} ${product.designer} ${product.category} ${product.room}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;

      // 2. Collection matching
      if (collection && product.collection !== collection) return false;

      // 3. Category matching
      if (selectedCategory !== "All") {
        const cat = selectedCategory.toLowerCase();
        const pCat = (product.category || "").toLowerCase();
        const pName = (product.name || "").toLowerCase();
        
        if (cat === "sofas" && !(pCat.includes("sofa") || (pCat.includes("seating") && pName.includes("sofa")))) {
          return false;
        } else if (cat === "chairs" && !(pCat.includes("chair") || pCat.includes("seating") || pName.includes("chair") || pName.includes("lounge"))) {
          return false;
        } else if (cat === "tables" && !(pCat.includes("table") || pCat.includes("console") || pName.includes("table"))) {
          return false;
        } else if (cat === "storage" && !(pCat.includes("storage") || pCat.includes("sideboard") || pName.includes("sideboard") || pName.includes("cabinet"))) {
          return false;
        } else if (cat === "lighting" && !(pCat.includes("lighting") || pCat.includes("lamp") || pName.includes("lamp"))) {
          return false;
        } else if (cat === "beds" && !(pCat.includes("bed") || pName.includes("bed"))) {
          return false;
        } else if (!["sofas", "chairs", "tables", "storage", "lighting", "beds"].includes(cat)) {
          if (!pCat.includes(cat)) return false;
        }
      }

      // 4. Room matching
      if (selectedRoom !== "All" && product.room !== selectedRoom) return false;

      // 5. Price matching
      if (product.price > maxPrice) return false;

      // 6. Rating matching
      if (selectedRating && product.rating < selectedRating) return false;

      return true;
    });

    if (sort === "Price Low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "Price High") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "Rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, query, collection, selectedCategory, selectedRoom, maxPrice, selectedRating, sort]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Editorial Header */}
      <section className="bg-[#FDFBF7] pt-12 pb-8 border-b border-stone-200/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B88D4D]">SPACESIC SHOP</p>
          <h1 className="mt-4 font-serif text-4xl font-normal leading-tight text-stone-900 sm:text-5xl">
            Shop Catalog
          </h1>
          <p className="mt-3 max-w-2xl text-stone-500 text-sm leading-relaxed">
            {collection
              ? `Showing the ${collection} collection, curated with materials sourced responsibly and craftsmanship that shows.`
              : "Every piece in our collection is made to last — with materials sourced responsibly and craftsmanship that shows."}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-stone-900">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-xs font-semibold text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Category Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("category")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Category</span>
                <span className="text-stone-400">{openFilters.category ? "−" : "+"}</span>
              </button>
              {openFilters.category && (
                <div className="mt-3.5 space-y-2.5 pl-1 animate-fade">
                  {["All", "Sofas", "Chairs", "Tables", "Storage", "Lighting", "Beds"].map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 text-xs text-stone-600 cursor-pointer hover:text-stone-950 font-medium">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#B88D4D]" 
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("price")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Price Range</span>
                <span className="text-stone-400">{openFilters.price ? "−" : "+"}</span>
              </button>
              {openFilters.price && (
                <div className="mt-4 pl-1 space-y-3.5 animate-fade">
                  <input 
                    type="range" 
                    min="1000" 
                    max="50000" 
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#B88D4D]" 
                  />
                  <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span>₹1,000</span>
                    <span className="text-[#B88D4D]">Up to {formatCurrency(maxPrice)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Material Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("material")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Material</span>
                <span className="text-stone-400">{openFilters.material ? "−" : "+"}</span>
              </button>
              {openFilters.material && (
                <div className="mt-3.5 pl-1 space-y-2.5 animate-fade">
                  {["Travertine", "Boucle", "Walnut", "Linen", "Solid Oak", "Brass"].map((mat) => (
                    <label key={mat} className="flex items-center gap-2.5 text-xs text-stone-600 cursor-pointer hover:text-stone-950 font-medium">
                      <input type="checkbox" className="accent-[#B88D4D] rounded" />
                      <span>{mat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Swatch Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("color")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Color</span>
                <span className="text-stone-400">{openFilters.color ? "−" : "+"}</span>
              </button>
              {openFilters.color && (
                <div className="mt-4 pl-1 flex flex-wrap gap-2.5 animate-fade">
                  {[
                    ["#F3ECE6", "Beige"],
                    ["#FDFBF7", "White"],
                    ["#222222", "Charcoal"],
                    ["#B88D4D", "Gold"],
                    ["#789E7E", "Olive"]
                  ].map(([code, name]) => (
                    <button 
                      key={name}
                      title={name}
                      style={{ backgroundColor: code }}
                      className="w-6 h-6 rounded-full border border-stone-200 hover:scale-110 transition cursor-pointer relative group shadow-sm"
                      type="button"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Room Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("room")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Room</span>
                <span className="text-stone-400">{openFilters.room ? "−" : "+"}</span>
              </button>
              {openFilters.room && (
                <div className="mt-3.5 pl-1 space-y-2.5 animate-fade">
                  {["All", "Living Room", "Bedroom", "Dining Room", "Workspace", "Outdoor"].map((rm) => (
                    <label key={rm} className="flex items-center gap-2.5 text-xs text-stone-600 cursor-pointer hover:text-stone-950 font-medium">
                      <input 
                        type="radio" 
                        name="room"
                        checked={selectedRoom === rm}
                        onChange={() => setSelectedRoom(rm)}
                        className="accent-[#B88D4D]" 
                      />
                      <span>{rm}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Filter */}
            <div className="border-b border-stone-200/50 pb-4">
              <button 
                onClick={() => toggleFilter("rating")}
                className="flex w-full items-center justify-between py-2 text-sm font-bold text-stone-800 cursor-pointer"
              >
                <span>Rating</span>
                <span className="text-stone-400">{openFilters.rating ? "−" : "+"}</span>
              </button>
              {openFilters.rating && (
                <div className="mt-3.5 pl-1 space-y-2.5 animate-fade">
                  {[5, 4, 3].map((stars) => (
                    <label key={stars} className="flex items-center gap-2.5 text-xs text-[#B88D4D] cursor-pointer hover:text-stone-950 font-medium">
                      <input 
                        type="radio" 
                        name="rating"
                        checked={selectedRating === stars}
                        onChange={() => setSelectedRating(stars)}
                        className="accent-[#B88D4D]" 
                      />
                      <span>{Array(stars).fill("★").join("")} & above</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT SIDE PRODUCT GRID */}
          <main>
            {/* Controls Bar */}
            <div className="mb-8 flex flex-col gap-4 border-b border-stone-105 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Showing {filtered.length} products{collection ? ` in ${collection}` : ""}
              </p>

              {/* Sorting & Views */}
              <div className="flex items-center gap-4">
                <div className="relative min-w-44">
                  <select 
                    className="w-full bg-[#FDFBF7] border border-stone-200 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] outline-none appearance-none cursor-pointer pr-10 rounded-full"
                    value={sort} 
                    onChange={(event) => setSort(event.target.value)}
                  >
                    {["Featured", "Price Low", "Price High", "Rating"].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} shop={shop} />
              ))}
            </div>

            {/* Empty view */}
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-stone-400 font-semibold text-sm">No items found matching your filters.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#222222] text-white rounded-full hover:bg-[#B88D4D] transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Bottom Info Badges matching mockup footer */}
      <section className="bg-[#F3ECE6] py-14 px-5 sm:px-8 border-t border-stone-200/50 mt-12">
        <div className="mx-auto max-w-7xl grid gap-8 grid-cols-2 md:grid-cols-4 text-center">
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#B88D4D]">
              {/* Leaf / Sustainable icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <h4 className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-900">Sustainable Materials</h4>
            <p className="mt-1 text-[10px] text-stone-500 font-semibold">Responsibly sourced timbers & fabrics.</p>
          </div>
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#B88D4D]">
              {/* Hands / Craft icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-900">Crafted by Artisans</h4>
            <p className="mt-1 text-[10px] text-stone-500 font-semibold">Hand-finished detailed construction.</p>
          </div>
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#B88D4D]">
              {/* Shield / Quality icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-900">Designed for Longevity</h4>
            <p className="mt-1 text-[10px] text-stone-500 font-semibold">Sturdy joints and durable builds.</p>
          </div>
          <div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#B88D4D]">
              {/* Hearth / Care icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-900">Made with Care</h4>
            <p className="mt-1 text-[10px] text-stone-500 font-semibold">Carefully packed white-glove transport.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
