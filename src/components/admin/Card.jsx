export default function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-900 ${className}`}>
      {children}
    </section>
  );
}
