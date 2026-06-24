export default function Pagination({ total = 0, page = 1 }) {
  return (
    <div className="flex flex-col gap-3 border-t border-stone-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-stone-500 dark:text-stone-400">Showing page {page} of {Math.max(1, Math.ceil(total / 8))}</p>
      <div className="flex gap-2">
        <button className="table-action">Previous</button>
        <button className="admin-btn-primary px-4 py-2">{page}</button>
        <button className="table-action">Next</button>
      </div>
    </div>
  );
}
