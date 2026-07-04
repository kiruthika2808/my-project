import { PageHero } from "../components/Hero";
import { useStore } from "../context/StoreContext";

export default function FAQ() {
  const { faqs } = useStore();
  return (
    <>
      <PageHero eyebrow="FAQ" title="Everything before the final yes." text="Answers about design help, shipping, returns, trade programs, and product care." image="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1500&q=85" />
      <section className="section bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group border-b border-stone-200 py-6">
              <summary className="cursor-pointer list-none text-xl font-semibold">{question}</summary>
              <p className="mt-4 leading-8 text-stone-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
