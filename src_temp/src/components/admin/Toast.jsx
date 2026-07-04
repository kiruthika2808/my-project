import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function Toast() {
  const { toast, clearToast } = useAdmin();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(clearToast, 2800);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-2xl px-4 py-3 text-sm font-bold shadow-xl ${toast.type === "error" ? "bg-red-600 text-white" : "bg-stone-950 text-white dark:bg-white dark:text-stone-950"}`}>
      {toast.message}
    </div>
  );
}
