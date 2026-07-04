import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function AuthPage({ mode, title, button, alternate, alternateLink, alternateText }) {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || (mode === "Register" && !fullName)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(false);
    setError(null);
    setLoading(true);

    try {
      if (mode === "Register") {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate("/profile");
    } catch (err) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-5rem)] bg-[#F3EFE6] lg:grid-cols-2">
      <div className="hidden lg:block">
        <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85" alt="Luxury living room" />
      </div>
      <div className="grid place-items-center px-5 py-16 sm:px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8C6B3C]">{mode}</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold">{title}</h1>
          
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {mode === "Register" && (
              <input
                className="form-input"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            className="btn-dark mt-6 w-full flex items-center justify-center gap-2" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : button}
          </button>
          
          <p className="mt-5 text-center text-sm text-stone-500">
            {alternate}{" "}
            <Link className="font-semibold text-stone-950" to={alternateLink}>
              {alternateText}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default function Login() {
  return <AuthPage mode="Login" title="Welcome back to your design edit." button="Sign In" alternate="Need an account?" alternateLink="/register" alternateText="Create one" />;
}

export { AuthPage };
