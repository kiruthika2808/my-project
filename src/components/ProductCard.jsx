import { Link } from "react-router-dom";
import { formatCurrency } from "../data";

export default function ProductCard({ product, shop }) {
  const loved = shop.wishlist.includes(product.id);

  const getBadgeStyle = (badge) => {
    if (!badge) return null;
    const b = badge.toLowerCase();
    if (b.includes("seller")) {
      return "bg-[#B88D4D] text-white"; // Gold/Bronze
    }
    return "bg-[#222222] text-white";
  };

  const badgeStyle = getBadgeStyle(product.badge);

  return (
    <article className="group relative bg-[#FDFBF7] transition duration-350 flex flex-col justify-between">
      {/* Product Image Container */}
      <div className="relative aspect-[4/4.8] overflow-hidden rounded-xl bg-stone-100">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105" 
          />
        </Link>

        {/* Badges (Top-Left) */}
        {product.badge && (
          <span className={`absolute left-3.5 top-3.5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] rounded ${badgeStyle}`}>
            {product.badge}
          </span>
        )}

        {/* Heart Icon (Top-Right) */}
        <button 
          className={`absolute right-3.5 top-3.5 w-8 h-8 flex items-center justify-center rounded-full shadow-sm border border-stone-205/30 backdrop-blur-md transition ${loved ? "bg-[#B88D4D] text-white" : "bg-white/80 text-stone-900 hover:bg-stone-100"}`} 
          type="button" 
          aria-label={`Save ${product.name}`} 
          onClick={() => shop.toggleWishlist(product.id)}
        >
          <svg 
            className="h-4 w-4" 
            fill={loved ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" 
            />
          </svg>
        </button>
      </div>

      {/* Info details */}
      <div className="pt-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
            {product.category || product.room}
          </p>
          <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#B88D4D]">
            <span>★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        <Link 
          to={`/product/${product.id}`} 
          className="mt-1.5 block font-serif text-[18px] font-medium leading-tight text-stone-900 hover:text-[#B88D4D] transition"
        >
          {product.name}
        </Link>

        {/* Price and Add button */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Circle Plus Button for quick add */}
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] transition shadow-md cursor-pointer" 
            type="button" 
            aria-label={`Add ${product.name} to cart`} 
            onClick={() => shop.addToCart(product)}
          >
            <span className="text-sm font-bold">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}
