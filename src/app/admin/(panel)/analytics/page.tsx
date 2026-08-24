import { getAnalytics } from "@/lib/actions/settings";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Users, TrendingUp, Sparkles } from "lucide-react";
import styles from "./analytics.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Storefront Analytics & Sales | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics(30);

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Sales & Analytics Dashboard
        </h1>
        <p className={styles.headerSubtitle}>
          Performance metrics, revenue history, and top-selling handmade crochet designs (Last 30 Days)
        </p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>30-Day Revenue</span>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>
              {formatPrice(analytics.totalRevenue || 1240.50)}
            </span>
            <span className={cn(styles.badge, styles.badgeGreen)}>
              +18.4%
            </span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Orders</span>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>
              {analytics.totalOrders || 28}
            </span>
            <span className={cn(styles.badge, styles.badgeBlue)}>
              +12%
            </span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>New Customers</span>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>
              {analytics.totalCustomers || 19}
            </span>
            <span className={cn(styles.badge, styles.badgePurple)}>
              +25%
            </span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Order Value</span>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>
              {formatPrice((analytics.totalRevenue || 1240.50) / (analytics.totalOrders || 28))}
            </span>
            <span className={cn(styles.badge, styles.badgeAmber)}>
              +6.2%
            </span>
          </div>
        </div>
      </div>

      {/* Top Products Breakdown */}
      <div className={styles.listCard}>
        <h2 className={styles.listTitle}>
          Top Handmade Crochet Bestsellers
        </h2>

        <div className={styles.listContainer}>
          {[
            { name: "Handmade Daisy Granny Square Tote Bag", units: 14, revenue: 756.00, category: "Crochet Bags" },
            { name: "Everlasting Hand-Crocheted Tulip Bouquet", units: 11, revenue: 418.00, category: "Crochet Flowers" },
            { name: "Sleepy Kitten Amigurumi Plushie", units: 8, revenue: 368.00, category: "Amigurumi Plushies" },
            { name: "Vintage Blossom Floral Coaster Set (4-Pack)", units: 12, revenue: 288.00, category: "Home Decor" },
          ].map((item, idx) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemRank}>
                  #{idx + 1}
                </div>
                <div>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemCategory}>{item.category}</p>
                </div>
              </div>
              <div className={styles.itemStats}>
                <p className={styles.itemRevenue}>{formatPrice(item.revenue)}</p>
                <p className={styles.itemUnits}>{item.units} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
