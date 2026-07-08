export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Delete", message = "Are you sure you want to delete this record? This action cannot be undone." }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-stone-900 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="admin-btn-secondary py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="table-action-danger py-2 px-5 rounded-xl font-bold flex items-center justify-center min-h-[2.75rem]"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
