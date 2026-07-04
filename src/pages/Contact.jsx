import { useState } from "react";
import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";

export default function Contact() {
  const { submitContact } = useStore();
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", message: "Name, email, and message are required." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      await submitContact(form);
      setStatus({ type: "success", message: "Thank you! Your message has been sent to our concierge." });
      setForm({ name: "", email: "", projectType: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Bring us into the room." text="Ask about product details, trade sourcing, room edits, or delivery planning." image="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#F3EFE6]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg bg-stone-950 p-8 text-white">
            <h2 className="font-serif text-3xl font-semibold">Studio Concierge</h2>
            <p className="mt-4 leading-8 text-white/70">hello@spacesichome.com<br />+1 212 555 0188<br />Mon to Fri, 9 AM to 6 PM</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm">
            {status.message && (
              <div className={`p-4 rounded-md text-sm ${status.type === "success" ? "bg-stone-100 text-stone-850" : "bg-red-50 text-red-800"}`}>
                {status.message}
              </div>
            )}
            <input 
              className="form-input" 
              placeholder="Name" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input 
              className="form-input" 
              placeholder="Email" 
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input 
              className="form-input" 
              placeholder="Project type" 
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            />
            <textarea 
              className="form-input min-h-36 resize-none" 
              placeholder="Tell us what you are designing" 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button type="submit" className="btn-dark" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
