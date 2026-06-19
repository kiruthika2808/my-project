import { PageHero } from "../components/Hero";
import { products } from "../data";
import { OrderSummary } from "./Cart";

export default function Checkout({ shop }) {
  const subtotal = shop.cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.id);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);

  return (
    <>
      <PageHero eyebrow="Checkout" title="Complete your purchase." text="A refined checkout flow for delivery, payment, and final review." image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_360px]">
          <form className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-3xl font-semibold">Delivery Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {["First name", "Last name", "Email", "Phone", "Address", "City"].map((label) => <input key={label} className="form-input" placeholder={label} />)}
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold">Payment</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {["Card number", "Name on card", "Expiry", "CVC"].map((label) => <input key={label} className="form-input" placeholder={label} />)}
            </div>
            <button className="btn-dark mt-2" type="button">Place Order</button>
          </form>
          <OrderSummary subtotal={subtotal} actionText="Return to Cart" action="/cart" />
        </div>
      </section>
    </>
  );
}
