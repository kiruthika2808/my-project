import { Link } from "react-router-dom";
import { PageHero } from "../components/Hero";
import { rooms } from "../data";

export default function Rooms() {
  return (
    <>
      <PageHero eyebrow="Rooms" title="Shop by atmosphere, not just category." text="Every room edit balances proportion, texture, lighting, and the pieces that make daily rituals feel elevated." image="https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {rooms.map(([name, count, image]) => (
            <Link key={name} to={`/shop?room=${encodeURIComponent(name)}`} className="group relative min-h-96 overflow-hidden rounded-3xl bg-stone-100">
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
    </>
  );
}
