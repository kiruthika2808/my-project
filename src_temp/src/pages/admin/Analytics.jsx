import Card from "../../components/admin/Card";
import Chart from "../../components/admin/Chart";
import PageHeader from "../../components/admin/PageHeader";
import { useAdmin } from "../../context/AdminContext";
import { revenueSeries } from "../../services/adminData";
import { formatCurrency } from "../../utils/format";

export default function Analytics() {
  const { products } = useAdmin();
  const bestSellers = products.slice(0, 5);
  const monthlyRevenue = revenueSeries.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <>
      <PageHeader eyebrow="Insights" title="Analytics" description="Review sales trends, monthly revenue, and best-selling Spacesic products." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <PageHeader eyebrow="Sales chart" title="Revenue by month" action={<span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-bold dark:bg-white/10">{formatCurrency(monthlyRevenue)}</span>} />
          <Chart data={revenueSeries} />
        </Card>
        <Card>
          <PageHeader eyebrow="Top products" title="Best sellers" />
          <div className="grid gap-4">
            {bestSellers.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3 dark:border-white/10">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{128 - index * 18} sold</p>
                </div>
                <span className="font-bold">{formatCurrency(product.price)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
