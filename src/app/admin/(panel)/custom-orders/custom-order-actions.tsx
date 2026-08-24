"use client";

import { useState } from "react";
import { updateCustomOrderStatus } from "@/lib/actions/settings";
import { CUSTOM_ORDER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DollarSign, Save } from "lucide-react";
import styles from "./custom-actions.module.css";
import { cn } from "@/lib/utils";

export function CustomOrderActions({
  orderId,
  currentStatus,
  initialQuote,
}: {
  orderId: string;
  currentStatus: string;
  initialQuote: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [quote, setQuote] = useState(initialQuote || "");
  const [showQuoteInput, setShowQuoteInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);
    try {
      await updateCustomOrderStatus(orderId, newStatus, undefined, quote ? parseFloat(quote as any) : undefined);
      toast.success(`Custom order marked as ${CUSTOM_ORDER_STATUSES[newStatus as keyof typeof CUSTOM_ORDER_STATUSES]?.label || newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCustomOrderStatus(orderId, "QUOTE_SENT", undefined, parseFloat(quote as any));
      toast.success("Quote saved and marked as Quote Sent!");
      setShowQuoteInput(false);
      router.refresh();
    } catch {
      toast.error("Failed to save quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      <div className={styles.primaryActions}>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className={styles.statusSelect}
        >
          {Object.entries(CUSTOM_ORDER_STATUSES).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowQuoteInput(!showQuoteInput)}
          className={styles.quoteBtn}
          title="Send Quote"
        >
          <DollarSign className={styles.btnIcon} />
        </button>
      </div>

      {showQuoteInput && (
        <form onSubmit={handleSaveQuote} className={styles.quoteForm}>
          <input
            type="number"
            step="0.01"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Price Quote ($)"
            required
            className={styles.quoteInput}
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.saveQuoteBtn}
          >
            <Save className={styles.smallIcon} />
          </button>
        </form>
      )}
    </div>
  );
}
