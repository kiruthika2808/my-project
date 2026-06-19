import { PageHero } from "../components/Hero";
import { reviews } from "../data";

export default function Reviews() {
  return (
    <>
      <PageHero eyebrow="Reviews" title="Real rooms, real reactions." text="See what homeowners, designers, and boutique hospitality teams say after living with Aurelia pieces." image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
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
