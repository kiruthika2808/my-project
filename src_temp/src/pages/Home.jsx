import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { collections, products, reviews, rooms } from "../data";

export default function Home({ shop }) {
  return (
    <>
      <Hero />
      <section className="section bg-white">
        <SectionHeader eyebrow="Shop By Room" title="Designed for every mood at home." link="/rooms" linkText="View all rooms" />
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {rooms.map(([name, count, image]) => (
            <Link key={name} to={`/shop?room=${encodeURIComponent(name)}`} className="group relative min-h-80 overflow-hidden rounded-3xl bg-stone-100">
              <img src={image} alt={`${name} interior`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-serif text-3xl font-semibold">{name}</p>
                <p className="mt-1 text-sm text-white/75">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section bg-[#f4f0e8]">
        <SectionHeader eyebrow="Featured Products" title="Investment pieces, made livable." link="/shop" linkText="Shop all products" />
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} shop={shop} />)}
        </div>
      </section>

      <section className="section bg-white">
        <SectionHeader eyebrow="Collections" title="Complete edits with a designer point of view." link="/collections" linkText="Browse collections" />
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          {collections.map(([name, text, image]) => (
            <Link key={name} to="/collections" className="group overflow-hidden rounded-3xl bg-stone-950 text-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100" src={image} alt={name} />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-3xl font-semibold">{name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section bg-[#fbfaf7]">
        <SectionHeader eyebrow="Client Reviews" title="Loved by homes, studios, and boutique spaces." link="/reviews" linkText="Read reviews" />
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-3">
          {reviews.map(([name, role, text]) => (
            <figure key={name} className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex gap-1 text-[#c18a3c]" aria-label="5 stars">★★★★★</div>
              <blockquote className="text-base leading-8 text-stone-700">"{text}"</blockquote>
              <figcaption className="mt-7 border-t border-stone-200 pt-5">
                <p className="font-semibold text-stone-950">{name}</p>
                <p className="mt-1 text-sm text-stone-500">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
