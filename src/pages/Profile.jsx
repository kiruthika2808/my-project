import { PageHero } from "../components/Hero";

export default function Profile({ shop }) {
  return (
    <>
      <PageHero eyebrow="User Profile" title="Your design dashboard." text="Track orders, revisit saved pieces, and keep your preferred rooms and finishes close." image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-3">
          {[["Saved pieces", shop.wishlist.length], ["Cart items", shop.cart.reduce((sum, item) => sum + item.qty, 0)], ["Trade status", "Pending"]].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">{label}</p>
              <p className="mt-4 font-serif text-5xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
