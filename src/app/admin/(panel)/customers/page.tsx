import { getCustomers } from "@/lib/actions/settings";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { Users, Mail, Phone, ShoppingBag } from "lucide-react";
import styles from "./customers.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Customer Directory | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { customers, total } = await getCustomers({
    page,
    limit: 20,
    search: params.search,
  });

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.headerTitle}>
          Customer Management
        </h1>
        <p className={styles.headerSubtitle}>
          {total} registered customer{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    <Users className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No registered customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.avatar}>
                          {c.name ? c.name.slice(0, 2).toUpperCase() : "CU"}
                        </div>
                        <div>
                          <p className={styles.customerName}>
                            {c.name || "Customer"}
                          </p>
                          <p className={styles.customerEmail}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.contactCell}>
                      {c.phone || "—"}
                    </td>
                    <td>
                      <span className={styles.ordersCount}>
                        {c._count?.orders || 0}
                      </span>{" "}
                      <span className={styles.ordersLabel}>orders</span>
                    </td>
                    <td className={styles.dateCell}>
                      {formatDateShort(c.createdAt)}
                    </td>
                    <td>
                      <span className={cn(styles.statusBadge, c.isActive ? styles.statusActive : styles.statusDisabled)}>
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
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
