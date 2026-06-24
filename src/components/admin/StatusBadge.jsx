const styles = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  Processing: "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200",
  Shipped: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  Approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
};

export default function StatusBadge({ status }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] || styles.Pending}`}>{status}</span>;
}
