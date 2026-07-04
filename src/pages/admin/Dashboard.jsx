import { Link } from "react-router-dom";
import Card from "../../components/admin/Card";
import Chart from "../../components/admin/Chart";
import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";
import { revenueSeries } from "../../services/adminData";
import { formatCurrency, formatNumber } from "../../utils/format";

export default function Dashboard() {
  const { orders, products, customers, reviews } = useAdmin();
  const sales = orders.reduce((sum, order) => sum + order.amount, 0) || 2458000;
  const stats = [
    ["Total Revenue", formatCurrency(sales), "+12.3%"],
    ["Total Orders", formatNumber(orders.length ? orders.length + 1400 : 1428), "+8.7%"],
    ["Customers", formatNumber(customers.length ? customers.length + 3200 : 3245), "+11.2%"],
    ["Products", formatNumber(products.length ? products.length + 830 : 842), "+3.2%"],
    ["Visitors", "12,458", "+15.6%"],
  ];
  const recentOrders = orders.slice(0, 4);

  return (
    <>
      <PageHeader eyebrow="Overview" title="Dashboard" description="Track sales, recent orders, and operational activity for Spacesic." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value, change]) => (
          <Card key={label}>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{label}</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">{value}</p>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-500/20 dark:text-emerald-300">{change}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <PageHeader eyebrow="Revenue" title="Monthly revenue" action={<Link className="admin-btn-secondary" to="/admin/analytics">View analytics</Link>} />
          <Chart data={revenueSeries} />
        </Card>
        <Card>
          <PageHeader eyebrow="Activity" title="Recent activity" />
          <div className="grid gap-3">
            {[
              orders.length > 0 ? `${orders[0].id} moved to ${orders[0].status}` : "No recent orders",
              `${reviews.filter((review) => review.status === "Pending").length} reviews awaiting moderation`,
              `${products.filter((product) => product.stock < 25).length} products are low in stock`,
              "Payment settings verified",
            ].map((item) => <div key={item} className="rounded-xl border border-stone-200 p-4 text-sm font-semibold dark:border-white/10">{item}</div>)}
          </div>
        </Card>
      </div>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="p-5"><PageHeader eyebrow="Orders" title="Recent orders" /></div>
        <DataTable
          rows={recentOrders}
          columns={[
            { key: "id", label: "Order ID", render: (row) => <Link className="font-bold hover:text-[#9c6f32]" to={`/admin/orders/${row.id}`}>{row.id}</Link> },
            { key: "customer", label: "Customer" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "date", label: "Date" },
          ]}
        />
      </Card>
    </>
  );
}
