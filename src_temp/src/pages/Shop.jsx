import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "../components/Hero";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import { products } from "../data";

export default function Shop({ shop }) {
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState(params.get("room") || "All");
  const [sort, setSort] = useState("Featured");
  const roomOptions = ["All", ...new Set(products.map((product) => product.room))];

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      const matchesRoom = room === "All" || product.room === room;
      const text = `${product.name} ${product.brand} ${product.designer} ${product.category}`.toLowerCase();
      return matchesRoom && text.includes(query.toLowerCase());
    });
    if (sort === "Price Low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "Price High") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "Rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [query, room, sort]);

  return (
    <>
      <PageHero eyebrow="Shop" title="Find the piece that makes the room." text="Search curated furniture, lighting, textiles, and decor with designer-grade filters." image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 grid gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
            <label className="flex min-h-14 items-center gap-3 rounded-full border border-stone-200 px-5">
              <Icon name="search" className="h-4 w-4 text-stone-500" />
              <input className="w-full bg-transparent outline-none placeholder:text-stone-400" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chairs, lamps, designers..." />
            </label>
            <select className="filter-select" value={room} onChange={(event) => setRoom(event.target.value)}>
              {roomOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select className="filter-select" value={sort} onChange={(event) => setSort(event.target.value)}>
              {["Featured", "Price Low", "Price High", "Rating"].map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => <ProductCard key={product.id} product={product} shop={shop} />)}
          </div>
        </div>
      </section>
    </>
  );
}
