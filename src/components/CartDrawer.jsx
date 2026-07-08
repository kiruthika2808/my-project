import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../data";

export default function CartDrawer() {
  const { products, shop } = useStore();
  const { cart, cartDrawerOpen, setCartDrawerOpen, updateQty } = shop;
  const navigate = useNavigate();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setCartDrawerOpen(false);
    };
    if (cartDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // disable background scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [cartDrawerOpen, setCartDrawerOpen]);

  if (!cartDrawerOpen) return null;

  // Resolve cart item details from global products catalog
  const cartItems = cart
    .map((item) => {
      const product = products.find((prod) => prod.id === item.id) || item.product;
      return product ? { ...product, id: item.id, qty: item.qty } : null;
    })
    .filter(Boolean);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Total savings from slashed prices
  const savings = cartItems.reduce((sum, item) => {
    if (item.oldPrice) {
      return sum + (item.oldPrice - item.price) * item.qty;
    }
    return sum;
  }, 0);

  const handleCheckoutClick = () => {
    setCartDrawerOpen(false);
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    setCartDrawerOpen(false);
    navigate("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Semi-transparent Overlay */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md transform bg-[#FDFBF7] shadow-2xl transition duration-500 flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b border-stone-200/60 px-6 py-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-normal text-stone-900">
              Your Cart ({cartCount})
            </h2>
            <button 
              onClick={() => setCartDrawerOpen(false)}
              className="text-stone-400 hover:text-stone-950 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-stone-400 font-semibold text-sm">Your shopping cart is empty.</p>
                <button 
                  onClick={() => { setCartDrawerOpen(false); navigate("/shop"); }}
                  className="px-6 py-2.5 bg-[#222222] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B88D4D] cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-stone-100 pb-5 items-start">
                  
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-semibold text-stone-950 truncate hover:text-[#B88D4D]">
                      <Link to={`/product/${item.id}`} onClick={() => setCartDrawerOpen(false)}>
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                      {item.room}
                    </p>
                    
                    {/* Quantity selectors */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="text-stone-500 font-bold hover:text-stone-900 cursor-pointer text-xs"
                        >
                          −
                        </button>
                        <span className="text-[11px] font-bold text-stone-900">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="text-stone-500 font-bold hover:text-stone-900 cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => updateQty(item.id, 0)}
                    className="text-stone-300 hover:text-red-600 transition cursor-pointer self-start p-1"
                    title="Remove item"
                  >
                    {/* Trash icon */}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-200/80 bg-[#FDFBF7] px-6 py-6 space-y-4">
              
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Have a coupon code?" 
                  className="w-full bg-[#F5F3EF] border border-stone-200 rounded-full px-4 text-xs text-stone-800 placeholder:text-stone-400/80 outline-none focus:border-[#B88D4D]" 
                />
                <button className="text-xs font-bold uppercase tracking-wider text-[#B88D4D] hover:text-stone-900 cursor-pointer px-2">
                  Apply
                </button>
              </div>

              {/* Subtotal & Savings details */}
              <div className="space-y-2 border-t border-stone-100 pt-4 text-xs font-semibold">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>You save</span>
                    <span>{formatCurrency(savings)}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid gap-2.5 pt-2">
                <button 
                  onClick={handleCheckoutClick}
                  className="h-12 w-full rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs transition cursor-pointer shadow-md"
                >
                  Checkout
                </button>
                <button 
                  onClick={handleViewCartClick}
                  className="h-12 w-full rounded-full border border-stone-300 text-stone-700 hover:border-stone-900 font-bold uppercase tracking-wider text-xs transition cursor-pointer bg-transparent"
                >
                  View Cart
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
