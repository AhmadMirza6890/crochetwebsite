import { getCustomOrders } from "@/lib/actions/settings";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { CUSTOM_ORDER_STATUSES } from "@/lib/constants";
import { Sparkles, Paintbrush, ExternalLink } from "lucide-react";
import { CustomOrderActions } from "./custom-order-actions";
import styles from "./custom-orders.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Custom Order Requests | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { customOrders, total } = await getCustomOrders({ page, limit: 20, status: params.status });

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Custom Crochet Requests
        </h1>
        <p className={styles.headerSubtitle}>
          Review bespoke customer commissions, provide price quotes, and update crafting progress
        </p>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Type</th>
                <th>Details & Notes</th>
                <th>Budget / Quote</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <Paintbrush className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No custom orders found</p>
                  </td>
                </tr>
              ) : (
                customOrders.map((order: any) => {
                  const statusConfig =
                    CUSTOM_ORDER_STATUSES[order.status as keyof typeof CUSTOM_ORDER_STATUSES] || {
                      label: order.status,
                      color: "bg-gray-100 text-gray-800",
                    };

                  return (
                    <tr key={order.id}>
                      <td>
                        <p className={styles.customerName}>{order.name}</p>
                        <p className={styles.customerDetails}>{order.email}</p>
                        {order.phone && <p className={styles.customerDetails}>{order.phone}</p>}
                      </td>
                      <td className={styles.productType}>
                        {order.productType}
                        {order.colors && (
                          <p className={styles.colorsText}>Colors: {order.colors}</p>
                        )}
                      </td>
                      <td className={styles.detailsCell}>
                        {order.customText && (
                          <p className={styles.customText}>
                            Personalization: &quot;{order.customText}&quot;
                          </p>
                        )}
                        <p className={styles.descriptionText}>{order.description}</p>
                        {order.referenceImage && (
                          <a
                            href={order.referenceImage}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.referenceLink}
                          >
                            View Reference Photo <ExternalLink className={styles.externalIcon} />
                          </a>
                        )}
                      </td>
                      <td className={styles.budgetCell}>
                        <p className={styles.budgetText}>Budget: {order.budget || "Flexible"}</p>
                        {order.quotedPrice && (
                          <p className={styles.quoteText}>
                            Quoted: {formatPrice(order.quotedPrice)}
                          </p>
                        )}
                      </td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: statusConfig?.color?.includes('bg-') 
                              ? 'var(--' + statusConfig.color.split('bg-')[1].replace('-100', '-50') + ')' 
                              : '#F3F4F6',
                            color: statusConfig?.color?.includes('text-') 
                              ? 'var(--' + statusConfig.color.split('text-')[1].replace('-800', '-700') + ')' 
                              : '#1F2937'
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <CustomOrderActions
                          orderId={order.id}
                          currentStatus={order.status}
                          initialQuote={order.quotedPrice || 0}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
