import { useState } from "react";

const navLinks = ["Shop", "Rooms", "Designers", "Brands", "Journal"];

const categories = [
  {
    name: "Living Room",
    count: "128 pieces",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bedroom",
    count: "96 pieces",
    image:
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dining",
    count: "74 pieces",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lighting",
    count: "62 pieces",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  },
];

const products = [
  {
    id: 1,
    name: "Aster Boucle Lounge Chair",
    room: "Living Room",
    price: 1480,
    oldPrice: 1780,
    rating: 4.9,
    badge: "Best seller",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Solene Travertine Table",
    room: "Dining",
    price: 2360,
    oldPrice: null,
    rating: 4.8,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Lumi Arc Floor Lamp",
    room: "Lighting",
    price: 620,
    oldPrice: 790,
    rating: 4.7,
    badge: "20% off",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Marlow Linen Platform Bed",
    room: "Bedroom",
    price: 1890,
    oldPrice: null,
    rating: 5,
    badge: "Designer pick",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
];

const reviews = [
  {
    name: "Anaya Kapoor",
    role: "Homeowner",
    text: "The finishes feel custom, the delivery team was careful, and our living room finally looks layered instead of staged.",
  },
  {
    name: "Marcus Reed",
    role: "Interior Architect",
    text: "I use Aurelia pieces for clients who want calm luxury. The product photography is accurate and the materials are excellent.",
  },
  {
    name: "Nina Shah",
    role: "Boutique Hotel Owner",
    text: "Premium without being precious. We ordered seating, lights, and tables, and every item arrived beautifully packed.",
  },
];

const brands = ["Ferm Living", "Menu", "HAY", "Muuto", "Vitra", "Normann"];

function IconButton({ children, label, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-900 hover:text-stone-950 ${className}`}
    >
      {children}
    </button>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#fbfaf7]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="Aurelia Home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-stone-950 text-sm font-semibold text-[#d8b26e]">
            A
          </span>
          <span className="text-xl font-semibold tracking-[0.18em] text-stone-950">
            AURELIA
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-stone-600 transition hover:text-stone-950"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <IconButton label="Search">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
            </svg>
          </IconButton>
          <IconButton label="Wishlist">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" />
            </svg>
          </IconButton>
          <button className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            Cart 02
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full border border-stone-200 bg-white text-stone-900 lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-stone-200 bg-[#fbfaf7] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link} href="#" className="text-base font-medium text-stone-700">
                {link}
              </a>
            ))}
            <button className="mt-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">
              Cart 02
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="relative z-10">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#9c6f32]">
            Premium Interior Marketplace
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
            Curated rooms for a quieter kind of luxury.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Shop furniture, lighting, textiles, and decor selected by interior designers for refined everyday living.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#featured"
              className="rounded-full bg-stone-950 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Shop Collection
            </a>
            <a
              href="#categories"
              className="rounded-full border border-stone-300 bg-white px-7 py-4 text-center text-sm font-semibold text-stone-950 transition hover:border-stone-950"
            >
              Explore Rooms
            </a>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-stone-200 pt-7">
            {[
              ["16k+", "happy clients"],
              ["420", "artisan pieces"],
              ["4.9", "average rating"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-semibold text-stone-950">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[440px] lg:min-h-[620px]">
          <img
            className="absolute inset-0 h-full w-full rounded-[2rem] object-cover shadow-2xl shadow-stone-300/60"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
            alt="Elegant neutral living room with sculptural furniture"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/45 bg-white/80 p-5 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-80">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Designer edit
            </p>
            <div className="mt-3 flex items-end justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">Calm Modern</h2>
                <p className="mt-1 text-sm text-stone-600">24-piece living room bundle</p>
              </div>
              <p className="text-lg font-semibold text-[#9c6f32]">$8,240</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">
              Shop By Room
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
              Designed for every mood at home.
            </h2>
          </div>
          <a href="#" className="text-sm font-semibold text-stone-700 hover:text-stone-950">
            View all categories
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="group relative min-h-80 overflow-hidden rounded-3xl bg-stone-100"
            >
              <img
                src={category.image}
                alt={`${category.name} interior`}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-2xl font-semibold">{category.name}</p>
                <p className="mt-1 text-sm text-white/75">{category.count}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [liked, setLiked] = useState([]);
  const [cartItem, setCartItem] = useState(null);

  const toggleLike = (id) => {
    setLiked((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const addToCart = (id) => {
    setCartItem(id);
    window.setTimeout(() => setCartItem(null), 1400);
  };

  return (
    <section id="featured" className="bg-[#f4f0e8] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">
              Featured Products
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
              Investment pieces, made livable.
            </h2>
          </div>
          <a href="#" className="text-sm font-semibold text-stone-700 hover:text-stone-950">
            Shop all products
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/4.5] overflow-hidden bg-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800 backdrop-blur">
                  {product.badge}
                </span>
                <IconButton
                  label={`Save ${product.name}`}
                  onClick={() => toggleLike(product.id)}
                  className="absolute right-4 top-4"
                >
                  <svg
                    className="h-4 w-4"
                    fill={liked.includes(product.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" />
                  </svg>
                </IconButton>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {product.room}
                  </p>
                  <p className="text-sm font-semibold text-[#9c6f32]">{product.rating} stars</p>
                </div>
                <h3 className="min-h-14 text-lg font-semibold leading-tight text-stone-950">
                  {product.name}
                </h3>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-stone-950">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ${product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-800"
                  >
                    {cartItem === product.id ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">
            Client Reviews
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            Loved by homes, studios, and boutique spaces.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="rounded-3xl border border-stone-200 bg-[#fbfaf7] p-7">
              <div className="mb-5 flex gap-1 text-[#c18a3c]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <blockquote className="text-base leading-8 text-stone-700">"{review.text}"</blockquote>
              <figcaption className="mt-7 border-t border-stone-200 pt-5">
                <p className="font-semibold text-stone-950">{review.name}</p>
                <p className="mt-1 text-sm text-stone-500">{review.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="border-y border-stone-200 bg-[#fbfaf7] py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.28em] text-stone-500">
          Curated from design houses worldwide
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="grid h-24 place-items-center rounded-2xl border border-stone-200 bg-white px-4 text-center text-lg font-semibold text-stone-800"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferBanner() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-12 text-white sm:px-10 lg:px-14">
          <img
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1300&q=85"
            alt="Styled living room corner"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b26e]">
              Private Sale
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Save 30% on designer lighting and accent furniture.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
              Upgrade the finishing touches with warm metals, stone textures, and sculptural silhouettes.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-stone-950 transition hover:bg-[#d8b26e]"
            >
              Shop the offer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-[#f4f0e8] py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#9c6f32]">
          Design Notes
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
          Get first access to edits, sales, and styling ideas.
        </h2>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full bg-white p-2 shadow-sm sm:flex-row">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter your email"
            className="min-h-12 flex-1 rounded-full border-0 px-5 text-stone-900 outline-none placeholder:text-stone-400"
          />
          <button className="rounded-full bg-stone-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-stone-800">
            {submitted ? "Subscribed" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const groups = {
    Shop: ["Furniture", "Lighting", "Textiles", "Decor"],
    Support: ["Shipping", "Returns", "Care Guide", "Contact"],
    Company: ["About", "Trade Program", "Sustainability", "Careers"],
  };

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d8b26e] text-sm font-semibold text-stone-950">
                A
              </span>
              <span className="text-xl font-semibold tracking-[0.18em] text-white">
                AURELIA
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7">
              Premium interior design commerce for homes that feel collected, composed, and deeply personal.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(groups).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm transition hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 text-sm sm:flex-row">
          <p>© 2026 Aurelia Home. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Pinterest</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-stone-950">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Reviews />
      <Brands />
      <OfferBanner />
      <Newsletter />
      <Footer />
    </main>
  );
}
