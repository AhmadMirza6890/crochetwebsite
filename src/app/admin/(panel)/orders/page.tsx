import { getOrders } from "@/lib/actions/orders";
import { formatPrice, formatDateShort, formatRelativeTime } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import Link from "next/link";
import { Search, ShoppingCart, Eye } from "lucide-react";
import styles from "./orders.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Orders Management | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { orders, total, pages } = await getOrders({
    page,
    limit: 20,
    status: params.status,
    search: params.search,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Orders Management
          </h1>
          <p className={styles.headerSubtitle}>
            {total} total customer order{total === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <Link
          href="/admin/orders"
          className={cn(styles.tabBtn, !params.status ? styles.tabActive : styles.tabInactive)}
        >
          All Orders
        </Link>
        {Object.entries(ORDER_STATUSES).map(([key, config]) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className={cn(styles.tabBtn, params.status === key ? styles.tabActive : styles.tabInactive)}
          >
            {config.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <ShoppingCart className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No orders found for this filter</p>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const statusConfig =
                    ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || {
                      label: order.status,
                      color: "bg-gray-100 text-gray-800",
                    };

                  return (
                    <tr key={order.id}>
                      <td className={styles.refCell}>
                        {order.orderNumber}
                      </td>
                      <td>
                        <p className={styles.customerName}>
                          {order.customerName}
                        </p>
                        <p className={styles.customerEmail}>{order.customerEmail}</p>
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
                      <td className={styles.itemsCell}>
                        {order.items?.length || 0} piece(s)
                      </td>
                      <td className={styles.totalCell}>
                        {formatPrice(order.total)}
                      </td>
                      <td className={styles.dateCell}>
                        {formatRelativeTime(order.createdAt)}
                      </td>
                      <td className={styles.actionsCell}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className={styles.detailsBtn}
                        >
                          <Eye className={styles.btnIcon} /> Details
                        </Link>
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
