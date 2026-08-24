import { RotateCcw, ShieldCheck, PackageOpen, MessageCircle, CheckCircle2, HeartHandshake } from "lucide-react";
import Link from "next/link";
import styles from "./returns.module.css";

export const metadata = {
  title: "Returns & Exchanges | Hearthside Yarn",
  description: "Our fair and simple returns policy for handmade crochet pieces — 30-day exchanges, damaged item replacements and custom order care.",
};

const STEPS = [
  {
    title: "Reach Out Within 30 Days",
    text: "Message us within 30 days of delivery with your order number and a photo of the piece. We reply within 24 hours.",
  },
  {
    title: "We Review & Approve",
    text: "For defects or damage we cover everything — return shipping included. For change-of-mind exchanges, the piece just needs to be unused.",
  },
  {
    title: "Ship It Back Safely",
    text: "Pack the piece in its original packaging if you can. Once it reaches our studio, we inspect and process your exchange or refund.",
  },
];

const COVERED = [
  {
    icon: ShieldCheck,
    title: "Damaged in Transit",
    text: "If your parcel arrives damaged, send us photos within 48 hours and we'll remake or refund your piece — completely free.",
  },
  {
    icon: PackageOpen,
    title: "Wrong or Missing Item",
    text: "Mistakes are rare, but if we slipped up we'll correct it immediately with priority remaking and shipping on us.",
  },
  {
    icon: HeartHandshake,
    title: "Change of Heart",
    text: "Unused pieces in original condition can be exchanged within 30 days. Custom and personalized orders are final sale.",
  },
];

export default function ReturnsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.heroBadge}>
            <RotateCcw className={styles.heroBadgeIcon} /> Fair &amp; Simple
          </span>
          <h1 className={styles.heroTitle}>Returns &amp; Exchanges</h1>
          <p className={styles.heroText}>
            Handmade pieces carry hours of love — but if something isn&apos;t right, we&apos;ll make it right.
          </p>
        </div>

        {/* Process steps */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={step.title} className={styles.stepCard}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's covered */}
        <h2 className={styles.sectionTitle}>What&apos;s Covered</h2>
        <div className={styles.coveredGrid}>
          {COVERED.map((item) => (
            <div key={item.title} className={styles.coveredCard}>
              <span className={styles.coveredIconWrapper}>
                <item.icon className={styles.coveredIcon} />
              </span>
              <h3 className={styles.coveredTitle}>{item.title}</h3>
              <p className={styles.coveredText}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <div className={styles.policyBox}>
          <h2 className={styles.policyTitle}>The Fine Print</h2>
          <ul className={styles.policyList}>
            <li><CheckCircle2 className={styles.checkIcon} /> Refunds are issued to your original payment method within 5–7 business days of inspection.</li>
            <li><CheckCircle2 className={styles.checkIcon} /> Pieces must be unused, unwashed and in their original packaging for change-of-mind exchanges.</li>
            <li><CheckCircle2 className={styles.checkIcon} /> Custom orders, personalized pieces and sale items are final sale.</li>
            <li><CheckCircle2 className={styles.checkIcon} /> Return shipping is free for defects; customers cover shipping for preference-based exchanges.</li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className={styles.helpBox}>
          <MessageCircle className={styles.helpIcon} />
          <div>
            <h3 className={styles.helpTitle}>Start a return or exchange</h3>
            <p className={styles.helpText}>
              Include your order number (HSY-XXXXXX-XXXX) and a photo — we&apos;ll take it from there.
            </p>
          </div>
          <Link href="/contact" className={styles.helpButton}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
