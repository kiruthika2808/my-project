import { Link } from "react-router-dom";
import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";

export default function Collections() {
  const { collections } = useStore();
  const getCollection = (collection) => {
    if (Array.isArray(collection)) {
      const [name, text, image] = collection;
      return { name, text, image };
    }
    return collection;
  };

  return (
    <>
      <PageHero eyebrow="Collections" title="Designer edits for complete spaces." text="Curated suites make it simple to build a room around a mood, material story, or architectural detail." image="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          {collections.map((collection) => {
            const { name, text, image } = getCollection(collection);
            return (
            <Link
              key={name}
              to={`/shop?collection=${encodeURIComponent(name)}`}
              className="group overflow-hidden rounded-lg bg-stone-950 text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img className="aspect-[4/3] w-full object-cover opacity-90" src={image} alt={name} />
              <div className="p-7">
                <h2 className="font-serif text-3xl font-semibold transition group-hover:text-[#B88D4D]">{name}</h2>
                <p className="mt-4 leading-7 text-white/70">{text}</p>
              </div>
            </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
