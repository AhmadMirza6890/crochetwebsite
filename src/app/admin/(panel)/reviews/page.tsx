import { getReviews } from "@/lib/actions/reviews";
import { formatDateShort } from "@/lib/utils";
import { Star, CheckCircle, XCircle, Trash2, EyeOff, MessageSquareQuote } from "lucide-react";
import { ReviewActions } from "./review-actions";
import styles from "./reviews.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Review Moderation | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { reviews, total } = await getReviews({ page, limit: 20, status: params.status });

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Customer Reviews Moderation
        </h1>
        <p className={styles.headerSubtitle}>
          Approve, reject, or hide customer ratings and reviews across your crochet products
        </p>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review Content</th>
                <th>Status</th>
                <th className={styles.alignRight}>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <MessageSquareQuote className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No reviews found</p>
                  </td>
                </tr>
              ) : (
                reviews.map((rev: any) => (
                  <tr key={rev.id}>
                    <td className={styles.productName}>
                      {rev.product?.name || "Product"}
                    </td>
                    <td className={styles.customerName}>
                      {rev.user?.name || "Customer"}
                    </td>
                    <td>
                      <div className={styles.ratingContainer}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className={styles.starIcon} />
                        ))}
                      </div>
                    </td>
                    <td className={styles.contentCell}>
                      {rev.title && <p className={styles.reviewTitle}>{rev.title}</p>}
                      <p className={styles.reviewComment}>{rev.comment || "No written comment"}</p>
                    </td>
                    <td>
                      <span className={cn(
                        styles.statusBadge, 
                        rev.status === "APPROVED"
                          ? styles.statusApproved
                          : rev.status === "REJECTED"
                          ? styles.statusRejected
                          : styles.statusPending
                      )}>
                        {rev.status}
                      </span>
                    </td>
                    <td className={styles.alignRight}>
                      <ReviewActions reviewId={rev.id} currentStatus={rev.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
