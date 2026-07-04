import { Link } from "react-router-dom";
import { formatCurrency, products } from "../data";
import { PageHero } from "../components/Hero";

export function OrderSummary({ subtotal, actionText, action }) {
  const delivery = subtotal > 0 ? 180 : 0;
  const total = subtotal + delivery;

  return (
    <aside className="h-fit rounded-3xl bg-stone-950 p-6 text-white">
      <h2 className="font-serif text-3xl font-semibold">Order Summary</h2>
      <div className="mt-6 space-y-3 text-sm text-white/75">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span>White-glove delivery</span><span>{formatCurrency(delivery)}</span></div>
        <div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white"><span>Total</span><span>{formatCurrency(total)}</span></div>
      </div>
      <Link className="mt-6 flex w-full justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-stone-950 transition hover:bg-[#d8b26e]" to={action}>{actionText}</Link>
    </aside>
  );
}

export default function Cart({ shop }) {
  const cartLines = shop.cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.id) })).filter((line) => line.product);
  const subtotal = cartLines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  return (
    <>
      <PageHero eyebrow="Cart" title="Review your room edit." text="Adjust quantities, confirm delivery options, and move into checkout when everything feels right." image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cartLines.map(({ product, qty }) => (
              <div key={product.id} className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <img className="h-32 w-full rounded-2xl object-cover sm:h-28" src={product.image} alt={product.name} />
                <div>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="mt-1 text-sm text-stone-500">{product.brand} / {product.room}</p>
                  <p className="mt-3 font-semibold">{formatCurrency(product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="qty-btn" onClick={() => shop.updateQty(product.id, qty - 1)}>-</button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button className="qty-btn" onClick={() => shop.updateQty(product.id, qty + 1)}>+</button>
                </div>
              </div>
            ))}
            {cartLines.length === 0 && <EmptyState title="Your cart is empty" text="Add a statement piece, textile, or lamp to begin." action="/shop" actionText="Shop now" />}
          </div>
          <OrderSummary subtotal={subtotal} actionText="Checkout" action="/checkout" />
        </div>
      </section>
    </>
  );
}

export function EmptyState({ title, text, action, actionText }) {
  return (
    <div className="col-span-full rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <h2 className="font-serif text-4xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-stone-600">{text}</p>
      <Link className="btn-dark mt-6 inline-flex" to={action}>{actionText}</Link>
    </div>
  );
}
