import { getCategory } from "@/lib/actions/categories";
import { getProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/storefront/product-card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import styles from "./category.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Handmade Crochet Collection`,
    description: category.description || `Browse handmade ${category.name} crochet items crafted with love.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({
    categoryId: category.id,
    isPublished: true,
    limit: 24,
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Navigation & Title */}
        <div className={styles.headerSection}>
          <Link
            href="/shop"
            className={styles.backLink}
          >
            <ArrowLeft className={styles.backIcon} /> Back to Shop
          </Link>
          <div className={styles.headerContent}>
            <div className={styles.titleWrapper}>
              <span className={styles.badge}>
                <Sparkles className={styles.badgeIcon} /> Category Showcase
              </span>
              <h1 className={styles.title}>
                {category.name}
              </h1>
              {category.description && (
                <p className={styles.description}>
                  {category.description}
                </p>
              )}
            </div>
            <p className={styles.count}>
              {total} unique piece{total === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              🧶
            </div>
            <h3 className={styles.emptyTitle}>No pieces in this category yet</h3>
            <p className={styles.emptyText}>
              Our artisans are currently crocheting new designs for {category.name}. Check back soon or request a custom order!
            </p>
            <div className={styles.emptyActions}>
              <Link
                href="/shop"
                className={styles.primaryBtn}
              >
                Browse All
              </Link>
              <Link
                href="/custom-order"
                className={styles.secondaryBtn}
              >
                Custom Request
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
