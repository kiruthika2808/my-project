import { PageHero } from "../components/Hero";

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Bring us into the room." text="Ask about product details, trade sourcing, room edits, or delivery planning." image="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-[#fbfaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl bg-stone-950 p-8 text-white">
            <h2 className="font-serif text-3xl font-semibold">Studio Concierge</h2>
            <p className="mt-4 leading-8 text-white/70">hello@aureliahome.com<br />+1 212 555 0188<br />Mon to Fri, 9 AM to 6 PM</p>
          </div>
          <form className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm">
            {["Name", "Email", "Project type"].map((label) => <input key={label} className="form-input" placeholder={label} />)}
            <textarea className="form-input min-h-36 resize-none" placeholder="Tell us what you are designing" />
            <button type="button" className="btn-dark">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}
