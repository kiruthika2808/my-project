import { PageHero } from "../components/Hero";
import { designers } from "../data";

export default function Designers() {
  return (
    <>
      <PageHero eyebrow="Designers" title="Meet the eyes behind the edit." text="Our designer network curates pieces, room bundles, and material palettes for homes, studios, and hospitality spaces." image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          {designers.map(([name, specialty, city, image]) => (
            <article key={name} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img className="aspect-[4/3] w-full object-cover" src={image} alt={name} />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9c6f32]">{city}</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold">{name}</h2>
                <p className="mt-3 text-stone-600">{specialty}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
