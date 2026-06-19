import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Brands from "./pages/Brands";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import Designers from "./pages/Designers";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Reviews from "./pages/Reviews";
import Rooms from "./pages/Rooms";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";

export default function App() {
  const [wishlist, setWishlist] = useState(["aster-boucle-lounge-chair", "lumi-arc-floor-lamp"]);
  const [cart, setCart] = useState([
    { id: "aster-boucle-lounge-chair", qty: 1 },
    { id: "ciel-ceramic-vase-set", qty: 2 },
  ]);

  const addToCart = (id) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === id);
      if (existing) {
        return items.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...items, { id, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((items) =>
      qty < 1
        ? items.filter((item) => item.id !== id)
        : items.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  };

  const toggleWishlist = (id) => {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const shop = { wishlist, cart, addToCart, updateQty, toggleWishlist };
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-stone-950">
      <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />
      <Routes>
        <Route path="/" element={<Home shop={shop} />} />
        <Route path="/shop" element={<Shop shop={shop} />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/designers" element={<Designers />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/product/:id" element={<ProductDetails shop={shop} />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/wishlist" element={<Wishlist shop={shop} />} />
        <Route path="/cart" element={<Cart shop={shop} />} />
        <Route path="/checkout" element={<Checkout shop={shop} />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile shop={shop} />} />
      </Routes>
      <Footer />
    </main>
  );
}
