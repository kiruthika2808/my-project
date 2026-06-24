import { formatCurrency } from "../../utils/format";

export default function Chart({ data }) {
  const max = Math.max(...data.map((item) => item.revenue));

  return (
    <div className="flex h-72 items-end gap-3 rounded-xl bg-stone-50 p-4 dark:bg-stone-950/60">
      {data.map((item) => (
        <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
          <div className="group relative flex flex-1 items-end">
            <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-stone-950 px-2 py-1 text-xs font-bold text-white group-hover:block">
              {formatCurrency(item.revenue)}
            </span>
            <div className="w-full rounded-t-xl bg-gradient-to-t from-stone-950 to-[#d8b26e] dark:from-[#d8b26e] dark:to-white" style={{ height: `${(item.revenue / max) * 100}%` }} />
          </div>
          <span className="text-center text-xs font-semibold text-stone-500 dark:text-stone-400">{item.month}</span>
        </div>
      ))}
    </div>
  );
}
