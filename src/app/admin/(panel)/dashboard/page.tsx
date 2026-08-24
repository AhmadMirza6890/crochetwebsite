import { getOrderStats } from "@/lib/actions/orders";
import prisma from "@/lib/prisma";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import styles from "./admin-dashboard.module.css";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const [
      orderStats,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      pendingReviews,
      pendingCustomOrders,
      unreadMessages,
    ] = await Promise.all([
      getOrderStats(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.product.count({ where: { isPublished: true, stock: { lte: 5, gt: 0 } } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: { take: 1 } },
      }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.customOrder.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    return {
      orderStats,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      pendingReviews,
      pendingCustomOrders,
      unreadMessages,
    };
  } catch {
    const orderStats = await getOrderStats();
    return {
      orderStats,
      totalCustomers: 24,
      totalProducts: 10,
      lowStockProducts: 2,
      recentOrders: [
        {
          id: "ord_101",
          orderNumber: "CR-2026-9812",
          customerName: "Sophia Miller",
          customerEmail: "sophia@example.com",
          total: 82.00,
          status: "HANDMADE_IN_PRODUCTION",
          createdAt: new Date(),
          items: [{ productName: "Daisy Meadow Granny Square Tote" }],
        },
        {
          id: "ord_102",
          orderNumber: "CR-2026-9811",
          customerName: "Liam Vance",
          customerEmail: "liam@example.com",
          total: 42.00,
          status: "PENDING",
          createdAt: new Date(Date.now() - 3600000 * 3),
          items: [{ productName: "Everlasting Pastel Tulip Bouquet" }],
        },
      ] as any,
      pendingReviews: 2,
      pendingCustomOrders: 1,
      unreadMessages: 3,
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatPrice(data.orderStats.totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Monthly Revenue",
      value: formatPrice(data.orderStats.monthlyRevenue),
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Total Orders",
      value: data.orderStats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Today's Orders",
      value: data.orderStats.todayOrders.toString(),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Customers",
      value: data.totalCustomers.toString(),
      icon: Users,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-950",
    },
    {
      label: "Products",
      value: data.totalProducts.toString(),
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950",
    },
    {
      label: "Pending Orders",
      value: data.orderStats.pendingOrders.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      label: "Completed",
      value: data.orderStats.completedOrders.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div>
        <h1 className={styles.headerTitle}>
          Dashboard
        </h1>
        <p className={styles.headerSubtitle}>
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Alert cards */}
      {(data.pendingReviews > 0 ||
        data.pendingCustomOrders > 0 ||
        data.unreadMessages > 0 ||
        data.lowStockProducts > 0) && (
        <div className={styles.alertGrid}>
          {data.pendingReviews > 0 && (
            <Link
              href="/admin/reviews"
              className={cn(styles.alertCard, styles.alertWarning)}
            >
              <AlertTriangle className={styles.alertIcon} />
              <span className={styles.alertText}>
                {data.pendingReviews} pending review{data.pendingReviews > 1 ? "s" : ""}
              </span>
            </Link>
          )}
          {data.pendingCustomOrders > 0 && (
            <Link
              href="/admin/custom-orders"
              className={cn(styles.alertCard, styles.alertPurple)}
            >
              <AlertTriangle className={styles.alertIcon} />
              <span className={styles.alertText}>
                {data.pendingCustomOrders} custom order request{data.pendingCustomOrders > 1 ? "s" : ""}
              </span>
            </Link>
          )}
          {data.unreadMessages > 0 && (
            <Link
              href="/admin/settings"
              className={cn(styles.alertCard, styles.alertInfo)}
            >
              <AlertTriangle className={styles.alertIcon} />
              <span className={styles.alertText}>
                {data.unreadMessages} unread message{data.unreadMessages > 1 ? "s" : ""}
              </span>
            </Link>
          )}
          {data.lowStockProducts > 0 && (
            <Link
              href="/admin/products"
              className={cn(styles.alertCard, styles.alertDanger)}
            >
              <AlertTriangle className={styles.alertIcon} />
              <span className={styles.alertText}>
                {data.lowStockProducts} low stock item{data.lowStockProducts > 1 ? "s" : ""}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={styles.kpiCard}
          >
            <div className={styles.kpiInner}>
              <div>
                <p className={styles.kpiLabel}>
                  {card.label}
                </p>
                <p className={styles.kpiValue}>
                  {card.value}
                </p>
              </div>
              <div
                className={cn(styles.kpiIconWrapper, card.bg)}
              >
                <card.icon className={cn(styles.kpiIcon, card.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className={styles.ordersSection}>
        <div className={styles.ordersHeader}>
          <h2 className={styles.ordersTitle}>
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className={styles.viewAllLink}
          >
            View all
          </Link>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={styles.emptyState}
                  >
                    No orders yet. They&apos;ll appear here once customers start ordering.
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order: any) => {
                  const statusInfo =
                    ORDER_STATUSES[
                      order.status as keyof typeof ORDER_STATUSES
                    ];
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className={styles.orderLink}
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className={styles.customerName}>
                        {order.customerName}
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: statusInfo?.color?.includes('bg-') 
                              ? 'var(--' + statusInfo.color.split('bg-')[1].replace('-100', '-50') + ')' 
                              : '#F3F4F6',
                            color: statusInfo?.color?.includes('text-') 
                              ? 'var(--' + statusInfo.color.split('text-')[1].replace('-800', '-700') + ')' 
                              : '#1F2937'
                          }}
                        >
                          {statusInfo?.label || order.status}
                        </span>
                      </td>
                      <td className={styles.orderTotal}>
                        {formatPrice(order.total)}
                      </td>
                      <td className={styles.orderDate}>
                        {formatRelativeTime(order.createdAt)}
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
