"use client";

import Link from "next/link";
import { ProductCard } from "./product-card";
import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./featured-products.module.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  images: { id: string; url: string; alt?: string | null }[];
  category?: { name: string } | null;
  averageRating: number;
  reviewCount: number;
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.badge}>
              <Sparkles className={styles.badgeIcon} />
              <span>Handpicked Creations</span>
            </div>
            <h2 className={styles.title}>
              Featured Masterpieces
            </h2>
            <p className={styles.subtitle}>
              Every loop is individually hand-stitched with love, patience, and 100% natural cotton.
            </p>
          </div>

          <div className={styles.headerAction}>
            <Link href="/shop" className={styles.viewAllBtn}>
              <span>View All Pieces</span>
              <ArrowRight className={styles.btnIcon} />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
