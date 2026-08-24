import { PackageSearch, Truck, Scissors, TicketPercent, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import styles from "./faq.module.css";

export const metadata = {
  title: "FAQs & Shipping | Hearthside Yarn",
  description: "Answers about ordering, shipping to Pakistan and worldwide, handmade timelines, coupons and caring for your crochet pieces.",
};

const FAQ_SECTIONS = [
  {
    icon: PackageSearch,
    title: "Orders & Tracking",
    faqs: [
      {
        q: "How do I track my order?",
        a: "Once your order is confirmed you'll receive an email confirmation with your order number. You can follow every step — from our studio to your doorstep — on our Track Your Order page using your order number and email address.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Because each piece is handmade to order, we can only modify or cancel within 12 hours of purchase. Contact us as soon as possible and we'll do our best.",
      },
      {
        q: "Do you offer gift wrapping or notes?",
        a: "Every order arrives beautifully wrapped in tissue with a branded card. Add a personal gift note at checkout and we'll hand-write it for you — free of charge.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    faqs: [
      {
        q: "Do you deliver across Pakistan?",
        a: "Yes! We ship nationwide — Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan and everywhere in between via trusted courier partners.",
      },
      {
        q: "How long does delivery take?",
        a: "Each piece is made to order. Production usually takes 3–7 business days depending on the piece's complexity, plus 2–5 days for domestic delivery. International orders typically arrive within 10–15 business days.",
      },
      {
        q: "What are the shipping charges?",
        a: "Standard shipping is $5.99 — completely free on orders over $50. Express shipping is available at checkout for $12.99 when you need it faster.",
      },
      {
        q: "Do you ship internationally?",
        a: "We ship worldwide including the US, UK, Canada, Australia, Germany, Saudi Arabia and the UAE. International duties or customs fees (if any) are the responsibility of the recipient.",
      },
    ],
  },
  {
    icon: Scissors,
    title: "Our Handmade Process",
    faqs: [
      {
        q: "Are the pieces really handmade?",
        a: "Absolutely — every single stitch is made by hand in our studio. No machines, no mass production. That's why slight variations make each piece one of a kind.",
      },
      {
        q: "What yarn do you use?",
        a: "We work primarily with premium milk cotton and acrylic-blend yarns chosen for softness, durability and colorfastness. Yarn details are listed on each product page.",
      },
      {
        q: "Can I request a custom design or color?",
        a: "Yes! We love custom projects. Head to our Custom Order page and tell us what you're dreaming of — we'll reply within 24 hours.",
      },
    ],
  },
  {
    icon: TicketPercent,
    title: "Coupons & Discounts",
    faqs: [
      {
        q: "How do I use a coupon code?",
        a: "When you open a product page, any active offers will pop up automatically — copy the code or apply it directly. You can also enter codes manually in your cart or at checkout.",
      },
      {
        q: "My coupon isn't working. Why?",
        a: "Coupons apply instantly — just enter the code in your cart or at checkout. If a code doesn't work it may apply only to selected products or have expired, and the cart will show a clear message explaining why.",
      },
      {
        q: "Can I use two coupons together?",
        a: "One coupon per order keeps things fair — but free-shipping and percentage offers rotate regularly, so there's always something coming up.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.heroBadge}>
            <Sparkles className={styles.heroBadgeIcon} /> Help Center
          </span>
          <h1 className={styles.heroTitle}>Questions, Answered.</h1>
          <p className={styles.heroText}>
            Everything you need to know about ordering, shipping, our handmade process and caring for your pieces.
          </p>
        </div>

        {/* FAQ sections */}
        {FAQ_SECTIONS.map((section) => (
          <section key={section.title} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIconWrapper}>
                <section.icon className={styles.sectionIcon} />
              </span>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </div>

            <div className={styles.faqList}>
              {section.faqs.map((faq) => (
                <details key={faq.q} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{faq.q}</summary>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Still need help */}
        <div className={styles.helpBox}>
          <MessageCircle className={styles.helpIcon} />
          <div>
            <h3 className={styles.helpTitle}>Still need help?</h3>
            <p className={styles.helpText}>
              We reply within 24 hours — we&apos;d love to hear from you.
            </p>
          </div>
          <Link href="/contact" className={styles.helpButton}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
