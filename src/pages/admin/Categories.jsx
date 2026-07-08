import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useAdmin } from "../../context/AdminContext";

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [form, setForm] = useState({ name: "", enabled: true });
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const saveCategory = async (event) => {
    event.preventDefault();
    try {
      if (form.id) {
        await updateCategory(form.id, form);
      } else {
        const id = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        await addCategory({ id, productCount: 0, ...form });
      }
      setForm({ name: "", enabled: true });
    } catch (e) {
      console.error(e);
    }
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteCategory(deletingId);
      setDeletingId(null);
    }
  };

  // Filter categories
  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Create, edit, delete, and enable or disable storefront categories."
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="self-start">
          <PageHeader eyebrow={form.id ? "Edit" : "Create"} title={form.id ? "Edit category" : "New category"} />
          <form className="grid gap-4" onSubmit={saveCategory}>
            <input
              className="admin-input"
              placeholder="Category name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <label className="flex items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
              />{" "}
              Enable category
            </label>
            <div className="flex gap-2">
              <button className="admin-btn-primary w-full">
                {form.id ? "Update category" : "Create category"}
              </button>
              {form.id && (
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setForm({ name: "", enabled: true })}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>
        
        <div className="grid gap-4">
          {/* Search and limit selection */}
          <Card>
            <div className="flex gap-3">
              <input
                className="admin-input"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className="admin-input max-w-36 py-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <DataTable
              rows={paginated}
              columns={[
                { key: "name", label: "Category", render: (row) => <span className="font-bold">{row.name}</span> },
                { key: "productCount", label: "Products" },
                {
                  key: "enabled",
                  label: "Enabled",
                  render: (row) => (
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={(event) => updateCategory(row.id, { ...row, enabled: event.target.checked })}
                      />
                      <span />
                    </label>
                  ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button className="table-action" onClick={() => setForm(row)}>
                        Edit
                      </button>
                      <button className="table-action-danger" onClick={() => triggerDelete(row.id)}>
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
            />

            {/* Pagination controls */}
            <div className="flex flex-col gap-3 border-t border-stone-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-stone-500 dark:text-stone-400">
                Showing page {currentPage} of {totalPages} ({filtered.length} categories total)
              </p>
              <div className="flex gap-2">
                <button
                  className="table-action"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="admin-btn-primary px-4 py-2 pointer-events-none rounded-xl">
                  {currentPage}
                </span>
                <button
                  className="table-action"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any associated products will remain, but they won't list under this category."
      />
    </>
  );
}
