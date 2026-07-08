import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmModal from "../../components/admin/ConfirmModal";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";
import { formatCurrency } from "../../utils/format";

const statuses = ["Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"];

const blankOrder = {
  id: "",
  customerId: "",
  customer: "",
  email: "",
  phone: "",
  amount: 0,
  status: "Pending",
  itemsText: "",
};

export default function Orders() {
  const { orders, customers, products, addOrder, updateOrder, deleteOrder } = useAdmin();
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

  const form = editing || blankOrder;

  const saveOrder = async (event) => {
    event.preventDefault();
    try {
      const itemsArray = form.itemsText
        ? form.itemsText.split(",").map((i) => i.trim()).filter(Boolean)
        : [];

      // Determine customer name and details
      let customerName = form.customer;
      let customerEmail = form.email;
      let customerPhone = form.phone;

      if (form.customerId) {
        const found = customers.find((c) => c.id === form.customerId);
        if (found) {
          customerName = found.name;
          customerEmail = found.email;
          customerPhone = found.phone || customerPhone;
        }
      }

      const orderData = {
        id: form.id || "SPC-" + Math.floor(1000 + Math.random() * 9000),
        customerId: form.customerId || null,
        customer: customerName,
        email: customerEmail,
        phone: customerPhone,
        amount: Number(form.amount),
        status: form.status,
        date: form.date || new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        items: itemsArray,
      };

      if (editing && editing.id) {
        await updateOrder(editing.id, orderData);
      } else {
        await addOrder(orderData);
      }
      setIsFormOpen(false);
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (order) => {
    setEditing({
      ...order,
      itemsText: order.items ? order.items.join(", ") : "",
    });
    setIsFormOpen(true);
  };

  const startCreate = () => {
    setEditing({
      ...blankOrder,
      id: "SPC-" + Math.floor(1000 + Math.random() * 9000),
    });
    setIsFormOpen(true);
  };

  const triggerDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteOrder(deletingId);
      setDeletingId(null);
    }
  };

  // Filtering
  const filtered = orders.filter((order) => {
    const matchesQuery =
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.customer.toLowerCase().includes(query.toLowerCase()) ||
      order.email.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders management"
        description="Add manual orders, search invoice history, change delivery status, and edit details."
        action={
          <button className="admin-btn-primary" onClick={startCreate}>
            Add Order
          </button>
        }
      />

      {isFormOpen && (
        <Card className="mb-6 animate-in slide-in-from-top-4 duration-200">
          <PageHeader
            eyebrow={editing?.itemsText !== undefined ? "Edit Order" : "Fulfillment"}
            title={editing?.itemsText !== undefined ? `Edit invoice ${editing.id}` : "Record Manual Order"}
          />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveOrder}>
            <input
              className="admin-input"
              placeholder="Order Number (e.g. SPC-1049)"
              value={form.id}
              onChange={(e) => setEditing({ ...form, id: e.target.value })}
              required
              disabled={editing && editing.date} // disable editing ID once order is saved
            />
            <select
              className="admin-input"
              value={form.customerId}
              onChange={(e) => {
                const customerId = e.target.value;
                const found = customers.find((c) => c.id === customerId);
                setEditing({
                  ...form,
                  customerId,
                  customer: found ? found.name : "",
                  email: found ? found.email : "",
                  phone: found ? found.phone || "" : "",
                });
              }}
            >
              <option value="">-- Associate Customer (Optional) --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="Customer Name"
              value={form.customer}
              onChange={(e) => setEditing({ ...form, customer: e.target.value })}
              required
              disabled={!!form.customerId}
            />
            <input
              className="admin-input"
              type="email"
              placeholder="Customer Email"
              value={form.email}
              onChange={(e) => setEditing({ ...form, email: e.target.value })}
              required
              disabled={!!form.customerId}
            />
            <input
              className="admin-input"
              placeholder="Customer Phone"
              value={form.phone}
              onChange={(e) => setEditing({ ...form, phone: e.target.value })}
              disabled={!!form.customerId}
            />
            <input
              className="admin-input"
              type="number"
              placeholder="Amount (Total Cost)"
              value={form.amount}
              onChange={(e) => setEditing({ ...form, amount: Number(e.target.value) })}
              required
            />
            <select
              className="admin-input"
              value={form.status}
              onChange={(e) => setEditing({ ...form, status: e.target.value })}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="Items (comma separated, e.g. Chair, Lamp)"
              value={form.itemsText}
              onChange={(e) => setEditing({ ...form, itemsText: e.target.value })}
            />
            <div className="flex gap-3 sm:col-span-2 mt-2">
              <button className="admin-btn-primary">Save order</button>
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

      {/* Filter Options */}
      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search order ID, customer, email"
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
            {statuses.map((s) => (
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
              key: "id",
              label: "Order ID",
              render: (row) => (
                <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/orders/${row.id}`}>
                  {row.id}
                </Link>
              ),
            },
            {
              key: "customer",
              label: "Customer",
              render: (row) => (
                <div>
                  <p className="font-bold">{row.customer}</p>
                  <p className="text-xs text-stone-500">{row.email}</p>
                </div>
              ),
            },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.status} />
                  <select
                    className="admin-input min-w-36 py-2"
                    value={row.status}
                    onChange={(event) => updateOrder(row.id, { ...row, status: event.target.value })}
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            },
            { key: "date", label: "Date" },
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
            Showing page {currentPage} of {totalPages} ({filtered.length} orders total)
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
        title="Delete Order Record"
        message="Are you sure you want to delete this order? This action will permanently remove it from Supabase storefront records."
      />
    </>
  );
}
