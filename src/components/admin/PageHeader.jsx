export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9c6f32] dark:text-[#d8b26e]">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold text-stone-950 dark:text-white">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
