import { Link } from "react-router-dom";

function AuthPage({ mode, title, button, alternate, alternateLink, alternateText }) {
  return (
    <section className="grid min-h-[calc(100vh-5rem)] bg-[#fbfaf7] lg:grid-cols-2">
      <div className="hidden lg:block">
        <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85" alt="Luxury living room" />
      </div>
      <div className="grid place-items-center px-5 py-16 sm:px-8">
        <form className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">{mode}</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold">{title}</h1>
          <div className="mt-8 grid gap-4">
            {mode === "Register" && <input className="form-input" placeholder="Full name" />}
            <input className="form-input" placeholder="Email" />
            <input className="form-input" placeholder="Password" type="password" />
          </div>
          <button className="btn-dark mt-6 w-full" type="button">{button}</button>
          <p className="mt-5 text-center text-sm text-stone-500">{alternate} <Link className="font-semibold text-stone-950" to={alternateLink}>{alternateText}</Link></p>
        </form>
      </div>
    </section>
  );
}

export default function Login() {
  return <AuthPage mode="Login" title="Welcome back to your design edit." button="Sign In" alternate="Need an account?" alternateLink="/register" alternateText="Create one" />;
}

export { AuthPage };
