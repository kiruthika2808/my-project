import Card from "../../components/admin/Card";
import PageHeader from "../../components/admin/PageHeader";
import StatusBadge from "../../components/admin/StatusBadge";
import { useAdmin } from "../../context/AdminContext";

export default function Reviews() {
  const { reviews, approveReview, deleteReview } = useAdmin();

  return (
    <>
      <PageHeader eyebrow="Trust" title="Reviews" description="View customer reviews and approve or delete submissions before they appear publicly." />
      <Card>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-stone-200 p-4 dark:border-white/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold">{review.product}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{review.customer} - {review.rating} stars</p>
                </div>
                <StatusBadge status={review.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">"{review.text}"</p>
              <div className="mt-4 flex gap-2">
                <button className="table-action" onClick={() => approveReview(review.id)}>Approve</button>
                <button className="table-action-danger" onClick={() => deleteReview(review.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </>
  );
}
