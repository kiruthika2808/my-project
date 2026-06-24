import { PageHero } from "../components/Hero";

export default function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Spacesic makes premium interiors easier to compose." text="We pair editorial curation with e-commerce convenience, helping clients discover furniture, lighting, textiles, and objects that feel collected over time." image="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-3">
          {["Curated with restraint", "Built for real homes", "Supported by designers"].map((heading) => (
            <div key={heading} className="rounded-3xl border border-stone-200 bg-[#fbfaf7] p-7">
              <h2 className="font-serif text-3xl font-semibold">{heading}</h2>
              <p className="mt-4 leading-8 text-stone-600">Every edit considers scale, texture, durability, delivery, and the small rituals that make a room feel finished.</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
