import { Link, useParams } from "react-router-dom";
import Card from "../../components/admin/Card";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";
import { orderStatuses } from "../../services/adminData";
import { formatCurrency } from "../../utils/format";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useAdmin();
  const order = orders.find((item) => item.id === orderId);

  if (!order) return <Card>Order not found.</Card>;

  return (
    <>
      <PageHeader eyebrow="Order details" title={order.id} description="Review customer contact, ordered items, amount, and fulfillment status." action={<Link className="admin-btn-secondary" to="/admin/orders">Back to orders</Link>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm text-stone-500">Customer</p><h2 className="text-2xl font-bold">{order.customer}</h2></div>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <p><span className="font-bold">Email:</span> {order.email}</p>
            <p><span className="font-bold">Phone:</span> {order.phone}</p>
            <p><span className="font-bold">Date:</span> {order.date}</p>
            <p><span className="font-bold">Amount:</span> {formatCurrency(order.amount)}</p>
          </div>
        </Card>
        <Card>
          <PageHeader eyebrow="Fulfillment" title="Update status" />
          <select className="admin-input" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
            {orderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </Card>
        <Card className="lg:col-span-2">
          <PageHeader eyebrow="Items" title="Order history" />
          <div className="grid gap-3">
            {order.items.map((item) => <div key={item} className="rounded-xl border border-stone-200 p-4 font-bold dark:border-white/10">{item}</div>)}
          </div>
        </Card>
      </div>
    </>
  );
}
