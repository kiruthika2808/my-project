import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { formatCurrency } from "../data";
import { useStore } from "../context/StoreContext";

export default function ProductDetails({ shop }) {
  const { products } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const product = (products && products.length > 0) 
    ? (products.find((item) => item.id === id) || products[0]) 
    : null;

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("Beige");
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState("description");

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const related = products
    .filter((item) => item.room === product.room && item.id !== product.id)
    .slice(0, 4);

  // Generate 4 mock detail thumbnails using same image with zoom crops
  const thumbnails = [
    product.image,
    product.image + "&fit=crop&w=400&h=400&q=80",
    product.image + "&fit=crop&w=300&h=300&q=80",
    product.image + "&fit=crop&w=250&h=250&q=80"
  ];

  const handleAddToCart = () => {
    shop.addToCart(product, qty);
  };

  const handleBuyNow = () => {
    shop.addToCart(product, qty);
    shop.setCartDrawerOpen(false);
    navigate("/checkout");
  };

  const toggleAccordion = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <section className="bg-[#FDFBF7] py-10 min-h-screen text-stone-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          <Link to="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-stone-900">{product.room}</Link>
          <span>/</span>
          <span className="text-stone-600 truncate">{product.name}</span>
        </nav>

        {/* Product Info Grid */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] xl:gap-14">
          
          {/* LEFT: Image Gallery */}
          <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
            {/* Vertical Thumbnails */}
            <div className="flex gap-3 sm:flex-col overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border-2 transition cursor-pointer ${
                    activeImage === thumb ? "border-[#B88D4D]" : "border-transparent"
                  }`}
                >
                  <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Large Main Image */}
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl bg-stone-50 border border-stone-100 shadow-sm group">
              <img src={activeImage} alt={product.name} className="h-full w-full object-cover transition duration-700 hover:scale-103" />
              
              {/* Sale badge */}
              {product.oldPrice && (
                <span className="absolute left-4 top-4 bg-[#B88D4D] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Product Details Info */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-stone-400">
              {product.brand}
            </span>
            <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-stone-950 sm:text-4xl xl:text-5xl">
              {product.name}
            </h1>
            
            {/* Ratings & reviews */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-0.5 text-[#B88D4D]" aria-label={`${product.rating} stars`}>
                ★★★★★
              </div>
              <span className="text-xs font-semibold text-stone-500">({product.reviews} reviews)</span>
            </div>

            {/* Price section */}
            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-serif text-3xl font-semibold text-stone-950">
                {formatCurrency(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-stone-400 line-through">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-stone-500">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mt-8 border-t border-stone-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Color: <span className="text-stone-900 font-semibold">{selectedColor}</span>
              </p>
              <div className="mt-3 flex gap-3">
                {[
                  ["#F3ECE6", "Beige"],
                  ["#FDFBF7", "White"],
                  ["#222222", "Charcoal"]
                ].map(([code, name]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedColor(name)}
                    style={{ backgroundColor: code }}
                    className={`w-7 h-7 rounded-full border transition cursor-pointer relative shadow-sm ${
                      selectedColor === name ? "border-[#B88D4D] scale-110" : "border-stone-200"
                    }`}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {/* Qty Counter */}
              <div className="flex items-center justify-between border border-stone-200 rounded-full h-12 px-4 w-32 bg-stone-50 self-start sm:self-auto">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-stone-500 font-bold hover:text-stone-900 cursor-pointer"
                >
                  −
                </button>
                <span className="text-xs font-bold text-stone-900">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="text-stone-500 font-bold hover:text-stone-900 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                className="h-12 flex-1 rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs transition cursor-pointer"
              >
                Add To Cart
              </button>

              {/* Buy Now */}
              <button 
                onClick={handleBuyNow}
                className="h-12 flex-1 rounded-full bg-[#B88D4D] text-white hover:bg-[#222222] font-bold uppercase tracking-wider text-xs transition cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Accordion Specification Tabs */}
            <div className="mt-10 border-t border-stone-200/80">
              
              {/* Accordion Tab: Description */}
              <div className="border-b border-stone-200/50 py-3">
                <button 
                  onClick={() => toggleAccordion("description")}
                  className="flex w-full items-center justify-between font-sans text-xs font-bold uppercase tracking-wider text-stone-850 cursor-pointer py-1"
                >
                  <span>Description</span>
                  <span>{openSection === "description" ? "−" : "+"}</span>
                </button>
                {openSection === "description" && (
                  <div className="mt-3 text-xs leading-6 text-stone-500 animate-fade">
                    Designed for elegant living. Each element is crafted with absolute precision, focusing on sculptural outlines and warm natural textures. Fits beautifully into minimalist living rooms, workspaces, or studio environments.
                  </div>
                )}
              </div>

              {/* Accordion Tab: Specifications */}
              <div className="border-b border-stone-200/50 py-3">
                <button 
                  onClick={() => toggleAccordion("specifications")}
                  className="flex w-full items-center justify-between font-sans text-xs font-bold uppercase tracking-wider text-stone-850 cursor-pointer py-1"
                >
                  <span>Specifications</span>
                  <span>{openSection === "specifications" ? "−" : "+"}</span>
                </button>
                {openSection === "specifications" && (
                  <div className="mt-3 text-xs leading-6 text-stone-500 animate-fade space-y-1">
                    <p><strong className="text-stone-700">Frame:</strong> Kiln-dried hardwood construction</p>
                    <p><strong className="text-stone-700">Fill:</strong> High-resilience density foam & down layer</p>
                    <p><strong className="text-stone-700">Fabric:</strong> Tactile premium weave boucle upholstery</p>
                    <p><strong className="text-stone-700">Legs:</strong> Solid walnut or natural oak details</p>
                  </div>
                )}
              </div>

              {/* Accordion Tab: Dimensions */}
              <div className="border-b border-stone-200/50 py-3">
                <button 
                  onClick={() => toggleAccordion("dimensions")}
                  className="flex w-full items-center justify-between font-sans text-xs font-bold uppercase tracking-wider text-stone-850 cursor-pointer py-1"
                >
                  <span>Dimensions</span>
                  <span>{openSection === "dimensions" ? "−" : "+"}</span>
                </button>
                {openSection === "dimensions" && (
                  <div className="mt-3 text-xs leading-6 text-stone-500 animate-fade space-y-1">
                    <p><strong className="text-stone-700">Width:</strong> 85 cm</p>
                    <p><strong className="text-stone-700">Depth:</strong> 90 cm</p>
                    <p><strong className="text-stone-700">Height:</strong> 78 cm</p>
                    <p><strong className="text-stone-700">Seat Height:</strong> 42 cm</p>
                  </div>
                )}
              </div>

              {/* Accordion Tab: Shipping & Returns */}
              <div className="border-b border-stone-200/50 py-3">
                <button 
                  onClick={() => toggleAccordion("shipping")}
                  className="flex w-full items-center justify-between font-sans text-xs font-bold uppercase tracking-wider text-stone-850 cursor-pointer py-1"
                >
                  <span>Shipping & Returns</span>
                  <span>{openSection === "shipping" ? "−" : "+"}</span>
                </button>
                {openSection === "shipping" && (
                  <div className="mt-3 text-xs leading-6 text-stone-500 animate-fade">
                    Free white-glove residential delivery on orders above ₹25,000. In-stock products typically ship within 3-5 business days. Returns are accepted within 30 days of purchase in original packaging.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-100 pt-16">
            <h2 className="font-serif text-2xl uppercase tracking-[0.2em] text-stone-900 mb-8">
              Related Products
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} shop={shop} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
