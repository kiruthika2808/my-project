import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { formatCurrency, products } from "../data";

export default function ProductDetails({ shop }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id) || products[0];
  const related = products.filter((item) => item.room === product.room && item.id !== product.id).slice(0, 3);

  return (
    <section className="section bg-[#fbfaf7]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] bg-stone-100">
          <img className="h-full min-h-[520px] w-full object-cover" src={product.image} alt={product.name} />
        </div>
        <div className="self-center">
          <button className="mb-6 text-sm font-semibold text-stone-500 hover:text-stone-950" onClick={() => navigate(-1)}>Back to browsing</button>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">{product.brand}</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-stone-950">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="font-serif text-4xl font-semibold">{formatCurrency(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-stone-400 line-through">{formatCurrency(product.oldPrice)}</span>}
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#9c6f32]">{product.rating} from {product.reviews} reviews</span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button className="btn-dark" onClick={() => shop.addToCart(product.id)}>Add to Cart</button>
            <button className="btn-light" onClick={() => shop.toggleWishlist(product.id)}>{shop.wishlist.includes(product.id) ? "Saved" : "Add to Wishlist"}</button>
          </div>
          <div className="mt-9 grid gap-4 border-t border-stone-200 pt-7 sm:grid-cols-3">
            {[["Room", product.room], ["Designer", product.designer], ["Collection", product.collection]].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{label}</p>
                <p className="mt-2 font-semibold text-stone-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl font-semibold">More for {product.room}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} shop={shop} />)}
          </div>
        </div>
      )}
    </section>
  );
}
