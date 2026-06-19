import { Link } from "react-router-dom";
import { formatCurrency } from "../data";
import Icon from "./Icon";

export default function ProductCard({ product, shop }) {
  const loved = shop.wishlist.includes(product.id);

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/4.6] overflow-hidden bg-stone-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800 backdrop-blur">{product.badge}</span>
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{product.room}</p>
          <p className="text-sm font-semibold text-[#9c6f32]">{product.rating} stars</p>
        </div>
        <Link to={`/product/${product.id}`} className="block min-h-14 text-lg font-semibold leading-tight text-stone-950 hover:text-[#8a612b]">{product.name}</Link>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-stone-950">{formatCurrency(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-stone-400 line-through">{formatCurrency(product.oldPrice)}</span>}
          </div>
          <div className="flex gap-2">
            <button className={`icon-btn ${loved ? "bg-[#d8b26e] text-stone-950" : ""}`} type="button" aria-label={`Save ${product.name}`} onClick={() => shop.toggleWishlist(product.id)}>
              <Icon name="heart" className="h-4 w-4" />
            </button>
            <button className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-800" onClick={() => shop.addToCart(product.id)}>
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
