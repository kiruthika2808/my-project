import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";

const reviewStatuses = ["Pending", "Approved", "Rejected"];

const blankReview = {
  customer: "",
  product: "",
  rating: 5,
  status: "Pending",
  text: "",
  role: "Homeowner",
};

export default function Reviews() {
  const { reviews, products, addReview, updateReview, deleteReview } = useAdmin();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Form states
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination states
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const form = editing || blankReview;

  const saveReview = async (event) => {
    event.preventDefault();
    try {
      if (form.id) {
        await updateReview(form.id, form);
      } else {
        const id = "rev-" + Math.floor(1000 + Math.random() * 9000) + "-" + Date.now();
        await addReview({ ...form, id });
      }
      setIsFormOpen(false);
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (review) => {
    setEditing(review);
    setIsFormOpen(true);
  };

  const startCreate = () => {
    setEditing(blankReview);
    setIsFormOpen(true);
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteReview(deletingId);
      setDeletingId(null);
    }
  };

  // Filtering
  const filtered = reviews.filter((review) => {
    const matchesQuery =
      review.product.toLowerCase().includes(query.toLowerCase()) ||
      review.customer.toLowerCase().includes(query.toLowerCase()) ||
      review.text.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === "All" || review.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="Reviews"
        description="View customer testimonials, manually record new feedback, and approve/reject submissions."
        action={
          <button className="admin-btn-primary" onClick={startCreate}>
            Add Review
          </button>
        }
      />

      {isFormOpen && (
        <Card className="mb-6 animate-in slide-in-from-top-4 duration-200">
          <PageHeader
            eyebrow={editing?.id ? "Edit Review" : "Record Feedback"}
            title={editing?.id ? `Edit Review from ${editing.customer}` : "Record Customer Review"}
          />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveReview}>
            <input
              className="admin-input"
              placeholder="Customer Name"
              value={form.customer}
              onChange={(e) => setEditing({ ...form, customer: e.target.value })}
              required
            />
            <input
              className="admin-input"
              placeholder="Customer Role (e.g. Homeowner, Designer)"
              value={form.role}
              onChange={(e) => setEditing({ ...form, role: e.target.value })}
            />
            <select
              className="admin-input"
              value={form.product}
              onChange={(e) => setEditing({ ...form, product: e.target.value })}
              required
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="admin-input"
                value={form.rating}
                onChange={(e) => setEditing({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
              <select
                className="admin-input"
                value={form.status}
                onChange={(e) => setEditing({ ...form, status: e.target.value })}
              >
                {reviewStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="admin-input min-h-24 sm:col-span-2"
              placeholder="Review feedback content..."
              value={form.text}
              onChange={(e) => setEditing({ ...form, text: e.target.value })}
              required
            />
            <div className="flex gap-3 sm:col-span-2 mt-2">
              <button className="admin-btn-primary">Save Review</button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Header */}
      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search reviews by customer, product, text..."
          />
          <select
            className="admin-input"
            value={filterStatus}
            onChange={(event) => {
              setFilterStatus(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            {reviewStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
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
            {
              key: "customer",
              label: "Reviewer",
              render: (row) => (
                <div>
                  <p className="font-bold">{row.customer}</p>
                  <p className="text-xs text-stone-500">{row.role || "Homeowner"}</p>
                </div>
              ),
            },
            { key: "product", label: "Product" },
            {
              key: "rating",
              label: "Rating",
              render: (row) => (
                <div className="text-amber-500 font-bold">{"★".repeat(row.rating)}</div>
              ),
            },
            {
              key: "text",
              label: "Feedback",
              render: (row) => <p className="max-w-md text-stone-600 dark:text-stone-300 leading-relaxed italic">"{row.text}"</p>,
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.status} />
                  <select
                    className="admin-input min-w-36 py-2"
                    value={row.status}
                    onChange={(event) => updateReview(row.id, { ...row, status: event.target.value })}
                  >
                    {reviewStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <button className="table-action" onClick={() => startEdit(row)}>
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

        {/* Functional Pagination */}
        <div className="flex flex-col gap-3 border-t border-stone-200 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-500 dark:text-stone-400">
            Showing page {currentPage} of {totalPages} ({filtered.length} reviews total)
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this testimonial? This action will permanently remove it from Supabase."
      />
    </>
  );
}
