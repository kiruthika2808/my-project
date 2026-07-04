import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import Pagination from "../../components/admin/Pagination";
import { useAdmin } from "../../context/AdminContext";
import { useFilteredList } from "../../hooks/useFilteredList";
import { formatCurrency } from "../../utils/format";

export default function Customers() {
  const { customers, orders } = useAdmin();
  const [query, setQuery] = useState("");
  const filtered = useFilteredList(customers, query, ["name", "email", "phone"], "All", "name");

  const totalSpent = (customerId) => orders.filter((order) => order.customerId === customerId).reduce((sum, order) => sum + order.amount, 0);

  return (
    <>
      <PageHeader eyebrow="Customers" title="Customer list" description="Browse contact information and jump into each customer's order history." />
      <Card className="mb-6"><input className="admin-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers by name, email, or phone" /></Card>
      <Card className="overflow-hidden p-0">
        <DataTable
          rows={filtered}
          columns={[
            { key: "name", label: "Customer", render: (row) => <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/customers/${row.id}`}>{row.name}</Link> },
            { key: "email", label: "Contact", render: (row) => <div>{row.email}<br /><span className="text-xs text-stone-500">{row.phone}</span></div> },
            { key: "location", label: "Location" },
            { key: "orders", label: "Orders", render: (row) => orders.filter((order) => order.customerId === row.id).length },
            { key: "spent", label: "Total spent", render: (row) => formatCurrency(totalSpent(row.id)) },
          ]}
        />
        <Pagination total={filtered.length} />
      </Card>
    </>
  );
}
