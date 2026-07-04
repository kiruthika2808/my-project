import ProductCard from "../components/ProductCard";
import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";
import { EmptyState } from "./Cart";

export default function Wishlist({ shop }) {
  const { products } = useStore();
  const wished = products.filter((product) => shop.wishlist.includes(product.id));

  return (
    <>
      <PageHero eyebrow="Wishlist" title="Your saved design notes." text="Keep favorite pieces together while you compare scale, finish, and room placement." image="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#F3EFE6]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {wished.map((product) => <ProductCard key={product.id} product={product} shop={shop} />)}
          {wished.length === 0 && <EmptyState title="No saved pieces yet" text="Browse the shop and tap the heart to build your edit." action="/shop" actionText="Start shopping" />}
        </div>
      </section>
    </>
  );
}
