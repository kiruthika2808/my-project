import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import Pagination from "../../components/admin/Pagination";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { orderStatuses } from "../../services/adminData";
import { formatCurrency } from "../../utils/format";

export default function Orders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useFilteredList(orders, query, ["id", "customer", "email"], status, "status");

  return (
    <>
      <PageHeader eyebrow="Fulfillment" title="Orders management" description="Search orders, view customer details, and update fulfillment status." />
      <Card className="mb-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input className="admin-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID, customer, email" />
          <select className="admin-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            {["All", ...orderStatuses].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <DataTable
          rows={filtered}
          columns={[
            { key: "id", label: "Order ID", render: (row) => <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/orders/${row.id}`}>{row.id}</Link> },
            { key: "customer", label: "Customer", render: (row) => <div><p className="font-bold">{row.customer}</p><p className="text-xs text-stone-500">{row.email}</p></div> },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status", render: (row) => <div className="flex items-center gap-2"><StatusBadge status={row.status} /><select className="admin-input min-w-36 py-2" value={row.status} onChange={(event) => updateOrderStatus(row.id, event.target.value)}>{orderStatuses.map((item) => <option key={item}>{item}</option>)}</select></div> },
            { key: "date", label: "Date" },
          ]}
        />
        <Pagination total={filtered.length} />
      </Card>
    </>
  );
}
