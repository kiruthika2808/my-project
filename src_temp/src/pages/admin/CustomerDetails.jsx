import { Link, useParams } from "react-router-dom";
import Card from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";
import { formatCurrency } from "../../utils/format";

export default function CustomerDetails() {
  const { customerId } = useParams();
  const { customers, orders } = useAdmin();
  const customer = customers.find((item) => item.id === customerId);
  const customerOrders = orders.filter((order) => order.customerId === customerId);

  if (!customer) return <Card>Customer not found.</Card>;

  return (
    <>
      <PageHeader eyebrow="Customer profile" title={customer.name} description="Contact details and order history for this customer." action={<Link className="admin-btn-secondary" to="/admin/customers">Back to customers</Link>} />
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <p><span className="font-bold">Email:</span><br />{customer.email}</p>
          <p><span className="font-bold">Phone:</span><br />{customer.phone}</p>
          <p><span className="font-bold">Location:</span><br />{customer.location}</p>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="p-5"><PageHeader eyebrow="Orders" title="Order history" /></div>
        <DataTable
          rows={customerOrders}
          columns={[
            { key: "id", label: "Order", render: (row) => <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/orders/${row.id}`}>{row.id}</Link> },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "date", label: "Date" },
          ]}
        />
      </Card>
    </>
  );
}
