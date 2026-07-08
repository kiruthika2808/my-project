import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useAdmin } from "../../context/AdminContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { formatCurrency } from "../../utils/format";

const blankCustomer = {
  name: "",
  email: "",
  phone: "",
  location: "",
};

export default function Customers() {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useAdmin();
  const [query, setQuery] = useState("");
  
  // Form and Modal states
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pagination states
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const form = editing || blankCustomer;

  const totalSpent = (customerId) =>
    orders
      .filter((order) => order.customerId === customerId)
      .reduce((sum, order) => sum + order.amount, 0);

  const orderCount = (customerId) =>
    orders.filter((order) => order.customerId === customerId).length;

  const saveCustomer = async (event) => {
    event.preventDefault();
    try {
      if (form.id) {
        await updateCustomer(form.id, form);
      } else {
        const id = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        await addCustomer({ ...form, id });
      }
      setIsFormOpen(false);
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (customer) => {
    setEditing(customer);
    setIsFormOpen(true);
  };

  const startCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteCustomer(deletingId);
      setDeletingId(null);
    }
  };

  // Avatar helper
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filtering
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.phone || "").includes(query)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="Customers"
        title="Customer list"
        description="Browse contact information, register new accounts, and jump into each customer's order history."
        action={
          <button className="admin-btn-primary" onClick={startCreate}>
            Add Customer
          </button>
        }
      />

      {isFormOpen && (
        <Card className="mb-6 animate-in slide-in-from-top-4 duration-200">
          <PageHeader
            eyebrow={editing ? "Edit Profile" : "Register"}
            title={editing ? `Edit ${editing.name}` : "New Customer"}
          />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveCustomer}>
            <input
              className="admin-input"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setEditing({ ...form, name: e.target.value })}
              required
            />
            <input
              className="admin-input"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setEditing({ ...form, email: e.target.value })}
              required
            />
            <input
              className="admin-input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setEditing({ ...form, phone: e.target.value })}
            />
            <input
              className="admin-input"
              placeholder="Location (e.g. New York, NY)"
              value={form.location}
              onChange={(e) => setEditing({ ...form, location: e.target.value })}
            />
            <div className="flex gap-3 sm:col-span-2 mt-2">
              <button className="admin-btn-primary">Save customer</button>
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

      <Card className="mb-6">
        <div className="flex gap-3">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search customers by name, email, or phone"
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
            {
              key: "name",
              label: "Customer",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-stone-200 dark:bg-stone-850 font-bold text-stone-700 dark:text-stone-300 text-xs">
                    {getInitials(row.name)}
                  </div>
                  <div>
                    <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/customers/${row.id}`}>
                      {row.name}
                    </Link>
                    <p className="text-xs text-stone-500">Reg: {row.created_at ? new Date(row.created_at).toLocaleDateString() : "Static"}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "email",
              label: "Contact",
              render: (row) => (
                <div>
                  <p>{row.email}</p>
                  <span className="text-xs text-stone-500">{row.phone}</span>
                </div>
              ),
            },
            { key: "location", label: "Location" },
            {
              key: "orders",
              label: "Orders",
              render: (row) => (
                <span className="font-bold">{orderCount(row.id)}</span>
              ),
            },
            { key: "spent", label: "Total spent", render: (row) => formatCurrency(totalSpent(row.id)) },
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
            Showing page {currentPage} of {totalPages} ({filtered.length} customers total)
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
        title="Delete Customer Profile"
        message="Are you sure you want to delete this customer? This action will permanently remove their details from Supabase database."
      />
    </>
  );
}
