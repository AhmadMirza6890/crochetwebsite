"use client";

import { useState } from "react";
import { updateOrderStatus, updateOrderTracking } from "@/lib/actions/orders";
import { ORDER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Truck, Save } from "lucide-react";
import styles from "./order-updater.module.css";
import { cn } from "@/lib/utils";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  initialTrackingNumber: string;
  initialTrackingUrl: string;
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  initialTrackingNumber,
  initialTrackingUrl,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);
  const [loading, setLoading] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Status updated to ${ORDER_STATUSES[newStatus as keyof typeof ORDER_STATUSES]?.label || newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrderTracking(orderId, trackingNumber, trackingUrl);
      toast.success("Tracking information saved!");
      setShowTracking(false);
      router.refresh();
    } catch {
      toast.error("Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusContainer}>
        <label className={styles.statusLabel}>
          Status:
        </label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className={styles.statusSelect}
        >
          {Object.entries(ORDER_STATUSES).map(([key, config]) => (
            <option key={key} value={key} className={styles.optionItem}>
              {config.label}
            </option>
          ))}
        </select>
        {loading && <Loader2 className={cn(styles.spinner)} />}
      </div>

      <button
        onClick={() => setShowTracking(!showTracking)}
        className={styles.trackingBtn}
      >
        <Truck className={styles.btnIcon} />
        {trackingNumber ? "Edit Tracking" : "+ Add Tracking"}
      </button>

      {showTracking && (
        <div className={styles.trackingFormWrapper}>
          <h4 className={styles.trackingFormTitle}>
            Set Courier Tracking
          </h4>
          <form onSubmit={handleSaveTracking} className={styles.trackingForm}>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Tracking Number (e.g. 9400100000000000000000)"
              required
              className={styles.inputField}
            />
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="Tracking Link (USPS/DHL/FedEx)"
              className={styles.inputField}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.saveBtn}
            >
              <Save className={styles.btnIcon} /> Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
