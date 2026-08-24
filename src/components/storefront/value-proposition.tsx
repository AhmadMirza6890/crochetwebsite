"use client";

import { Heart, Truck, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./value-proposition.module.css";

const values = [
  {
    icon: Heart,
    title: "100% Handcrafted",
    description: "Every single stitch is woven by artisan hands with genuine care and patience.",
  },
  {
    icon: Sparkles,
    title: "Organic Milk Cotton",
    description: "We use ultra-soft hypoallergenic milk cotton and sustainable natural fibers.",
  },
  {
    icon: Truck,
    title: "Free Express Shipping",
    description: "Free delicate boutique parcel shipping on all domestic orders over $50.",
  },
  {
    icon: ShieldCheck,
    title: "Heirloom Quality",
    description: "Built to last for generations without unravelling. Love it or we'll replace it.",
  },
];

export function ValueProposition() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {values.map((value) => (
            <div key={value.title} className={styles.card}>
              <div className={styles.iconWrapper}>
                <value.icon className={styles.icon} />
              </div>
              <h3 className={styles.title}>
                {value.title}
              </h3>
              <p className={styles.description}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
