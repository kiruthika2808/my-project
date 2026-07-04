import { useNavigate, Link } from "react-router-dom";
import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";

export default function Profile({ shop }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const wishlistCount = shop.wishlist.length;
  const cartCount = shop.cart.reduce((sum, item) => sum + item.qty, 0);

  const stats = [
    ["Saved pieces", wishlistCount],
    ["Cart items", cartCount],
    ["Trade status", user ? "Approved" : "Pending"],
  ];

  return (
    <>
      <PageHero eyebrow="User Profile" title="Your design dashboard." text="Track orders, revisit saved pieces, and keep your preferred rooms and finishes close." image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#F3EFE6]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">{label}</p>
                <p className="mt-4 font-serif text-5xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg bg-white p-8 shadow-sm">
            {user ? (
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-serif text-3xl font-semibold">Account Details</h2>
                  <p className="mt-2 text-stone-600">Name: <span className="font-semibold text-stone-950">{user.user_metadata?.full_name || "Spacesic Customer"}</span></p>
                  <p className="mt-1 text-stone-600">Email: <span className="font-semibold text-stone-950">{user.email}</span></p>
                </div>
                <button onClick={handleSignOut} className="btn-dark sm:w-auto">Sign Out</button>
              </div>
            ) : (
              <div className="text-center py-6">
                <h2 className="font-serif text-3xl font-semibold">Guest Profile</h2>
                <p className="mt-2 text-stone-600">Sign in to save your wishlist and cart permanently across all devices.</p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link to="/login" className="btn-dark">Sign In</Link>
                  <Link to="/register" className="btn-light">Create Account</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
