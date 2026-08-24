import Link from "next/link";
import { CheckCircle2, Sparkles, Package, ArrowRight, Home } from "lucide-react";
import styles from "./confirmation.module.css";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.orderNumber || "HSY-ORDER-PENDING";

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.iconWrapper}>
          <CheckCircle2 className={styles.icon} />
        </div>

        <div>
          <span className={styles.statusLabel}>
            <Sparkles className={styles.sparklesIcon} /> Order Received
          </span>
          <h1 className={styles.title}>
            Thank You For Your Order!
          </h1>
          <p className={styles.desc}>
            Our artisan has received your request and will slow-craft your crochet pieces with love.
          </p>
        </div>

        <div className={styles.refBox}>
          <p className={styles.refLabel}>
            Order Reference
          </p>
          <p className={styles.refValue}>
            {orderNumber}
          </p>
        </div>

        <div className={styles.notesBox}>
          <p>📧 A confirmation email with your order summary has been dispatched.</p>
          <p>📦 You will receive tracking notifications once your handmade item is carefully packed and shipped.</p>
        </div>

        <div className={styles.actions}>
          <Link
            href="/"
            className={styles.homeBtn}
          >
            <Home className={styles.btnIcon} /> Home
          </Link>
          <Link
            href="/shop"
            className={styles.shopBtn}
          >
            Continue Shopping <ArrowRight className={styles.btnIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
}
