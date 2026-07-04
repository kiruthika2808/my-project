import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";

export default function Brands() {
  const { brands } = useStore();
  return (
    <>
      <PageHero eyebrow="Brands" title="Design houses with material integrity." text="Spacesic sources from independent studios and established makers known for detail, finish, and responsible production." image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand} className="rounded-lg border border-stone-200 bg-[#F3EFE6] p-8">
              <p className="font-serif text-3xl font-semibold">{brand}</p>
              <p className="mt-4 text-sm leading-7 text-stone-600">Signature finishes, thoughtful sourcing, and heirloom-minded silhouettes selected for layered interiors.</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
