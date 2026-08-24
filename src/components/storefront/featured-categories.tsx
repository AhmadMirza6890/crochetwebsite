"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FolderTree } from "lucide-react";
import styles from "./featured-categories.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
}

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles className={styles.badgeIcon} />
            <span>Curated Collections</span>
          </div>
          <h2 className={styles.title}>
            Shop by Category
          </h2>
          <p className={styles.subtitle}>
            Explore our curated collections of handmade crochet treasures.
          </p>
        </div>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={styles.card}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <FolderTree className={styles.placeholderIcon} />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className={styles.overlay} />

              {/* Text info */}
              <div className={styles.content}>
                <h3 className={styles.categoryName}>
                  {category.name}
                </h3>
                {category._count && (
                  <p className={styles.count}>
                    {category._count.products} item{category._count.products !== 1 ? "s" : ""}
                  </p>
                )}
                <div className={styles.explore}>
                  <span>Explore</span>
                  <ArrowRight className={styles.exploreIcon} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
