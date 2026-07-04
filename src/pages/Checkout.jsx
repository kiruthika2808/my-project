import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../data";

export default function Checkout({ shop }) {
  const { products, placeOrder, user } = useStore();
  const navigate = useNavigate();

  // Multi-step state: 1: Address, 2: Delivery, 3: Payment, 4: Review
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    deliveryOption: "Standard", // Standard (Free above 25k) or Express (1,500)
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  // Prefill user profile info if logged in
  useEffect(() => {
    if (user && user.email) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
        cardName: user.user_metadata?.full_name || "",
      }));
    }
  }, [user]);

  const subtotal = shop.cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.id);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);

  const deliveryCost = form.deliveryOption === "Express" ? 1500 : (subtotal >= 25000 ? 0 : 490);
  const total = subtotal + deliveryCost;

  const handleNextStep = (e) => {
    e.preventDefault();
    setError(null);
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city) {
        setError("Please fill in all address details.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!form.cardNumber || !form.cardName || !form.cardExpiry || !form.cardCvc) {
        setError("Please fill in all card details.");
        return;
      }
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (shop.cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const customerDetails = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
      };

      const result = await placeOrder(customerDetails);
      if (result.success) {
        setSuccessOrder(result.orderId);
      }
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <section className="bg-[#FDFBF7] py-20 min-h-screen text-stone-900 flex items-center">
        <div className="mx-auto max-w-xl rounded-2xl bg-[#F3ECE6] p-10 text-center shadow-sm border border-stone-200/50">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#B88D4D] text-white text-xl">
            ✓
          </div>
          <h2 className="font-serif text-3xl font-normal text-stone-900">Order Confirmed</h2>
          <p className="mt-3 text-stone-500 font-semibold text-sm">Order ID: #{successOrder}</p>
          <p className="mt-5 text-xs leading-6 text-stone-600">
            A confirmation email has been sent to {form.email}. Our team will contact you shortly to coordinate the delivery schedule and verify product specifications.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/shop" className="h-11 rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs px-6 flex items-center justify-center transition">
              Continue Shopping
            </Link>
            <Link to="/profile" className="h-11 rounded-full border border-stone-300 text-stone-800 hover:border-stone-900 font-bold uppercase tracking-wider text-xs px-6 flex items-center justify-center transition">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 text-stone-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Page title */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B88D4D]">Secure checkout</p>
          <h1 className="mt-3 font-serif text-3xl font-normal text-stone-900 sm:text-4xl">Complete Your Purchase</h1>
        </div>

        {/* STEPPER PROGRESS INDICATOR */}
        <div className="mx-auto max-w-2xl mb-12 flex items-center justify-between border-b border-stone-200 pb-5 font-sans">
          {[
            { num: 1, label: "Address" },
            { num: 2, label: "Delivery" },
            { num: 3, label: "Payment" },
            { num: 4, label: "Review" }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold transition ${
                step >= s.num ? "bg-[#222222] text-white" : "bg-stone-200 text-stone-500"
              }`}>
                {s.num}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition ${
                step === s.num ? "text-stone-900" : "text-stone-400"
              }`}>
                {s.label}
              </span>
              {s.num < 4 && <span className="text-stone-200 ml-4 hidden sm:inline">—</span>}
            </div>
          ))}
        </div>

        {/* main layout grid */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* LEFT: Step Forms */}
          <div className="bg-[#F3ECE6] rounded-2xl p-6 sm:p-8 border border-stone-200/50">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-800">
                {error}
              </div>
            )}

            {/* STEP 1: ADDRESS DETAILS */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <h3 className="font-serif text-xl font-normal text-stone-900">Delivery Address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Priya"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mehta"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="priya@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +91 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Delivery Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Apartment, building, street address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="h-12 rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs px-8 cursor-pointer transition">
                    Continue to Delivery
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DELIVERY METHODS */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-normal text-stone-900">Choose Shipping Method</h3>
                <div className="space-y-3.5">
                  <label className={`flex items-center justify-between border rounded-2xl p-5 cursor-pointer bg-[#FDFBF7] transition ${
                    form.deliveryOption === "Standard" ? "border-[#B88D4D] ring-1 ring-[#B88D4D]" : "border-stone-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={form.deliveryOption === "Standard"}
                        onChange={() => setForm({ ...form, deliveryOption: "Standard" })}
                        className="accent-[#B88D4D]"
                      />
                      <div>
                        <span className="block text-sm font-bold text-stone-900">Standard Delivery</span>
                        <span className="block text-[11px] text-stone-400 mt-1 font-semibold">Careful dispatch in 3-5 days.</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-800">
                      {subtotal >= 25000 ? "FREE" : "₹490"}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between border rounded-2xl p-5 cursor-pointer bg-[#FDFBF7] transition ${
                    form.deliveryOption === "Express" ? "border-[#B88D4D] ring-1 ring-[#B88D4D]" : "border-stone-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={form.deliveryOption === "Express"}
                        onChange={() => setForm({ ...form, deliveryOption: "Express" })}
                        className="accent-[#B88D4D]"
                      />
                      <div>
                        <span className="block text-sm font-bold text-stone-900">Express Premium Carrier</span>
                        <span className="block text-[11px] text-stone-400 mt-1 font-semibold">Priority packaging with white-glove setup.</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-800">₹1,500</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handlePrevStep} className="h-12 rounded-full border border-stone-300 hover:border-stone-900 font-bold uppercase tracking-wider text-xs px-6 cursor-pointer bg-transparent transition">
                    Back
                  </button>
                  <button type="button" onClick={handleNextStep} className="h-12 rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs px-8 cursor-pointer transition">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT DETAILS */}
            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <h3 className="font-serif text-xl font-normal text-stone-900">Credit Card Information</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Priya Mehta"
                    value={form.cardName}
                    onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                    className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Card Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="4000 1234 5678 9010"
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">Expiration Date</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY"
                      value={form.cardExpiry}
                      onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 pl-2">CVC / Security Code</label>
                    <input 
                      type="text" 
                      required
                      maxLength="4"
                      placeholder="123"
                      value={form.cardCvc}
                      onChange={(e) => setForm({ ...form, cardCvc: e.target.value })}
                      className="h-12 rounded-full border border-stone-200 bg-[#FDFBF7] px-5 text-sm text-stone-850 outline-none focus:border-[#B88D4D]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handlePrevStep} className="h-12 rounded-full border border-stone-300 hover:border-stone-900 font-bold uppercase tracking-wider text-xs px-6 cursor-pointer bg-transparent transition">
                    Back
                  </button>
                  <button type="submit" className="h-12 rounded-full bg-[#222222] text-white hover:bg-[#B88D4D] font-bold uppercase tracking-wider text-xs px-8 cursor-pointer transition">
                    Continue to Review
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: FINAL REVIEW */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-normal text-stone-900">Review & Confirm</h3>
                
                <div className="grid gap-6 border-b border-stone-200/50 pb-6 text-xs text-stone-600 font-medium">
                  <div>
                    <h4 className="font-bold text-stone-800 uppercase tracking-wider mb-2">Delivery Address</h4>
                    <p>{form.firstName} {form.lastName}</p>
                    <p>{form.address}, {form.city}</p>
                    <p>Phone: {form.phone}</p>
                    <p>Email: {form.email}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 uppercase tracking-wider mb-2">Shipping Method</h4>
                    <p>{form.deliveryOption} Delivery ({formatCurrency(deliveryCost)})</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 uppercase tracking-wider mb-2">Payment Details</h4>
                    <p>Cardholder: {form.cardName}</p>
                    <p>Card number ending in: **** **** **** {form.cardNumber.slice(-4) || "9010"}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handlePrevStep} className="h-12 rounded-full border border-stone-300 hover:border-stone-900 font-bold uppercase tracking-wider text-xs px-6 cursor-pointer bg-transparent transition">
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="h-12 rounded-full bg-[#B88D4D] text-white hover:bg-[#222222] font-bold uppercase tracking-wider text-xs px-8 cursor-pointer transition shadow-md"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="bg-[#F3ECE6] rounded-2xl p-6 sm:p-8 border border-stone-200/50 self-start">
            <h3 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-4">Order Summary</h3>
            
            {/* Scrollable list of items */}
            <div className="mt-4 max-h-60 overflow-y-auto space-y-4 pr-1">
              {shop.cart.map((line) => {
                const product = products.find((p) => p.id === line.id);
                if (!product) return null;
                return (
                  <div key={line.id} className="flex gap-3 justify-between items-center text-xs font-semibold text-stone-600">
                    <div className="flex gap-2.5 items-center">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-stone-200/50" />
                      <span className="truncate max-w-[150px]">{product.name}</span>
                      <span className="text-stone-400">x{line.qty}</span>
                    </div>
                    <span className="text-stone-900 font-bold">{formatCurrency(product.price * line.qty)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="mt-6 border-t border-stone-200 pt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="text-stone-900 font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery</span>
                <span className="text-stone-900 font-bold">{deliveryCost === 0 ? "FREE" : formatCurrency(deliveryCost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-3.5">
                <span>Total Amount</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
