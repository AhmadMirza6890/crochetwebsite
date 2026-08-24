"use client";

import { updateReviewStatus, deleteReview } from "@/lib/actions/reviews";
import { Check, X, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import styles from "./reviews.module.css";
import { cn } from "@/lib/utils";

export function ReviewActions({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const handleStatus = async (status: string) => {
    try {
      await updateReviewStatus(reviewId, status);
      toast.success(`Review ${status.toLowerCase()}`);
      router.refresh();
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      {currentStatus !== "APPROVED" && (
        <button
          onClick={() => handleStatus("APPROVED")}
          title="Approve Review"
          className={cn(styles.actionBtn, styles.approveBtn)}
        >
          <Check className={styles.btnIcon} />
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button
          onClick={() => handleStatus("REJECTED")}
          title="Reject Review"
          className={cn(styles.actionBtn, styles.rejectBtn)}
        >
          <X className={styles.btnIcon} />
        </button>
      )}
      <button
        onClick={handleDelete}
        title="Delete Review"
        className={cn(styles.actionBtn, styles.deleteBtn)}
      >
        <Trash2 className={styles.btnIcon} />
      </button>
    </div>
  );
}
