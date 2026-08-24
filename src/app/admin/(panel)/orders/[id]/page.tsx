import { getOrder } from "@/lib/actions/orders";
import { notFound } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Truck, CreditCard, Sparkles } from "lucide-react";
import { OrderStatusUpdater } from "./order-status-updater";
import styles from "./order-detail.module.css";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const shippingAddr = (order.shippingAddress as any) || {};

  return (
    <div className={styles.container}>
      <Link
        href="/admin/orders"
        className={styles.backLink}
      >
        <ArrowLeft className={styles.backIcon} /> Back to Orders
      </Link>

      <div className={styles.header}>
        <div>
          <span className={styles.headerLabel}>
            Order Details
          </span>
          <h1 className={styles.orderNumber}>
            {order.orderNumber}
          </h1>
          <p className={styles.dateText}>
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Live Status Updater Client Component */}
        <OrderStatusUpdater
          orderId={order.id}
          currentStatus={order.status}
          initialTrackingNumber={order.trackingNumber || ""}
          initialTrackingUrl={order.trackingUrl || ""}
        />
      </div>

      <div className={styles.layoutGrid}>
        {/* Line Items */}
        <div className={styles.mainColumn}>
          <div className={styles.card}>
            <h2 className={cn(styles.cardTitle, styles.cardTitleLg)}>
              Ordered Items ({order.items.length})
            </h2>

            <div className={styles.itemsList}>
              {order.items.map((item: any) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrapper}>
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className={styles.itemImage} />
                    ) : (
                      "🧶"
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>
                      {item.productName}
                    </p>
                    {item.variantValue && (
                      <p className={styles.itemVariant}>{item.variantName || "Variant"}: {item.variantValue}</p>
                    )}
                    <p className={styles.itemQty}>
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className={styles.itemTotal}>
                    {formatPrice(item.total)}
                  </p>
                </div>
              ))}
            </div>

            {/* Financial totals */}
            <div className={styles.financials}>
              <div className={styles.finRow}>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className={styles.finRowDiscount}>
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className={styles.finRow}>
                <span>Shipping ({order.shippingMethod || "Standard"})</span>
                <span>{order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className={styles.finRowTotal}>
                <span>Total</span>
                <span className={styles.finTotalAmount}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className={styles.sideColumn}>
          <div className={styles.card}>
            <h3 className={cn(styles.cardTitle, styles.cardTitleMd)}>
              <User className={styles.cardTitleIcon} /> Customer Details
            </h3>
            <div className={styles.detailsContent}>
              <p className={styles.detailsName}>{order.customerName}</p>
              <p>{order.customerEmail}</p>
              {order.customerPhone && <p>{order.customerPhone}</p>}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={cn(styles.cardTitle, styles.cardTitleMd)}>
              <MapPin className={styles.cardTitleIcon} /> Shipping Destination
            </h3>
            <div className={styles.detailsContent}>
              <p className={styles.detailsName}>{shippingAddr.name || order.customerName}</p>
              <p>{shippingAddr.street}</p>
              <p>{shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}</p>
              <p>{shippingAddr.country}</p>
            </div>
          </div>

          {order.customerNote && (
            <div className={styles.card}>
              <h3 className={cn(styles.cardTitle, styles.cardTitleMd)}>
                Customer Note
              </h3>
              <p className={styles.customerNote}>
                &quot;{order.customerNote}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
