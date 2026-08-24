import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFilters } from "./shop-filters";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import styles from "./shop.module.css";

export const metadata = {
  title: "Shop All Handmade Crochet",
  description: "Browse our complete collection of handmade crochet bags, flower bouquets, amigurumi plushies, home decor, and customized accessories.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const inStock = params.inStock === "true";

  const [categories, { products, total, pages }] = await Promise.all([
    getCategories({ isActive: true, withCount: true }),
    getProducts({
      page,
      limit: 16,
      categoryId: params.category,
      search: params.search,
      sort: params.sort || "newest",
      minPrice,
      maxPrice,
      inStock,
      isPublished: true,
    }),
  ]);

  const activeCategory = categories.find((c: any) => c.id === params.category);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Page Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>
              <Sparkles className={styles.badgeIcon} /> Handmade Collection
            </span>
            <h1 className={styles.title}>
              {activeCategory ? activeCategory.name : params.search ? `Search: "${params.search}"` : "Shop All Creations"}
            </h1>
            <p className={styles.description}>
              {activeCategory?.description ||
                "Every stitch is crafted slowly by hand using premium cotton and plush yarns for lifelong durability and artisanal charm."}
            </p>
          </div>

          <div className={styles.count}>
            Showing <span className={styles.countHighlight}>{products.length}</span> of <span className={styles.countHighlight}>{total}</span> items
          </div>
        </div>

        {/* Content with Sidebar Filters */}
        <div className={styles.layoutGrid}>
          {/* Filter Sidebar */}
          <div className={styles.sidebar}>
            <ShopFilters categories={categories} />
          </div>

          {/* Product Grid */}
          <div className={styles.mainArea}>
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  🧶
                </div>
                <h3 className={styles.emptyTitle}>No pieces match your filters</h3>
                <p className={styles.emptyText}>
                  Try clearing your filters or search query to view all of our handmade crochet items.
                </p>
                <div className={styles.emptyActions}>
                  <Link
                    href="/shop"
                    className={styles.resetBtn}
                  >
                    Reset All Filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.productGrid}>
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product as never} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: pages }).map((_, i: number) => {
                  const pageNum = i + 1;
                  const isCurrent = pageNum === page;
                  return (
                    <Link
                      key={pageNum}
                      href={`/shop?page=${pageNum}${params.category ? `&category=${params.category}` : ""}${params.sort ? `&sort=${params.sort}` : ""}${params.search ? `&search=${params.search}` : ""}`}
                      className={isCurrent ? styles.pageLinkActive : styles.pageLink}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
