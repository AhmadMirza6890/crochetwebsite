"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch, Loader2, Truck, CheckCircle2, Package, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { trackOrder } from "@/lib/actions/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import styles from "./track-order.module.css";

const TIMELINE = ["PENDING", "CONFIRMED", "PROCESSING", "HANDMADE_IN_PRODUCTION", "SHIPPED", "DELIVERED"];

const STEP_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Preparing",
  HANDMADE_IN_PRODUCTION: "Handmade in Production",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

interface TrackedOrder {
  orderNumber: string;
  status: string;
  customerName: string;
  createdAt: string | Date;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingCost: number;
  total: number;
  items: Array<{
    productName: string;
    productImage?: string | null;
    variantValue?: string | null;
    quantity: number;
    total: number;
  }>;
}

export function TrackOrderClient({ initialOrderNumber }: { initialOrderNumber?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await trackOrder(orderNumber, email);
      if (res.ok) {
        setOrder(res.order as TrackedOrder);
      } else {
        setError(res.error);
        setOrder(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = order ? TIMELINE.indexOf(order.status) : -1;
  const isSpecialStatus = order && (order.status === "CANCELLED" || order.status === "REFUNDED");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <PackageSearch className={styles.headerIcon} />
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.subtitle}>
            Enter the order number from your confirmation email along with the email address you used.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="orderNumber">Order Number</label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="HSY-XXXXXX-XXXX"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <Loader2 className={styles.spinner} /> Searching...
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </form>

        {error && (
          <p className={styles.errorBox}>{error}</p>
        )}

        <AnimatePresence>
          {order && (
            <motion.div
              key={order.orderNumber}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.resultCard}
            >
              {/* Header */}
              <div className={styles.resultHeader}>
                <div>
                  <p className={styles.orderLabel}>Order</p>
                  <p className={styles.orderNumber}>{order.orderNumber}</p>
                </div>
                <div className={styles.statusBadge} data-status={order.status}>
                  {order.status.replace(/_/g, " ")}
                </div>
              </div>
              <p className={styles.placedDate}>Placed on {formatDate(order.createdAt)}</p>

              {/* Timeline */}
              {!isSpecialStatus ? (
                <div className={styles.timeline}>
                  {TIMELINE.map((step, i) => {
                    const done = i <= currentIndex;
                    return (
                      <div key={step} className={styles.timelineStep}>
                        <div className={`${styles.stepDot} ${done ? styles.stepDotDone : ""}`}>
                          {done ? <CheckCircle2 className={styles.stepDotIcon} /> : <span className={styles.stepDotHollow} />}
                        </div>
                        <p className={`${styles.stepLabel} ${done ? styles.stepLabelDone : ""}`}>
                          {STEP_LABELS[step]}
                        </p>
                        {i < TIMELINE.length - 1 && (
                          <div className={`${styles.stepLine} ${i < currentIndex ? styles.stepLineDone : ""}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.specialNote}>
                  This order was {order.status.toLowerCase()}. Contact us if you have any questions.
                </p>
              )}

              {/* Tracking */}
              {(order.trackingNumber || order.trackingUrl) && (
                <div className={styles.trackingBox}>
                  <Truck className={styles.trackingIcon} />
                  <div className={styles.trackingInfo}>
                    <p className={styles.trackingLabel}>Tracking Number</p>
                    <p className={styles.trackingValue}>{order.trackingNumber || "Available at carrier link"}</p>
                  </div>
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className={styles.trackLink}>
                      Track at carrier <ExternalLink className={styles.externalIcon} />
                    </a>
                  )}
                </div>
              )}

              {/* Items */}
              <div className={styles.itemsSection}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.itemRow}>
                    <div className={styles.itemImageWrapper}>
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className={styles.itemImage} />
                      ) : (
                        <div className={styles.itemPlaceholder}><Package className={styles.itemPlaceholderIcon} /></div>
                      )}
                      <span className={styles.itemQty}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.productName}</p>
                      {item.variantValue && <p className={styles.itemVariant}>{item.variantValue}</p>}
                      <p className={styles.itemAddress}>
                        <MapPin className={styles.pinIcon} /> Handmade to order
                      </p>
                    </div>
                    <p className={styles.itemTotal}>{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className={styles.totalRowDiscount}>
                    <span>Coupon {order.couponCode}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Shipping{order.shippingMethod ? ` (${order.shippingMethod})` : ""}</span>
                  <span>{order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="/shop" className={styles.continueBtn}>Continue Shopping</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
