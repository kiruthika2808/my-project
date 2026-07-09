import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Signup() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register(email, password, fullName);
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-5rem)] bg-[#F3EFE6] lg:grid-cols-2">
      <div className="hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85"
          alt="Luxury living room"
        />
      </div>
      <div className="grid place-items-center px-5 py-16 sm:px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8C6B3C]">Join Us</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold">Create a private design profile.</h1>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800 animate-pulse">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-4">
            <input
              className="form-input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="form-input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn-dark mt-6 w-full flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-5 text-center text-sm text-stone-500">
            Already registered?{" "}
            <Link className="font-semibold text-stone-950 underline hover:text-[#8C6B3C]" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
