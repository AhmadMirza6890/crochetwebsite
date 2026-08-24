import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { formatPrice, formatDateShort } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { ProductActions } from "./product-actions";
import styles from "./products.module.css";
import { cn } from "@/lib/utils";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { products, total, pages } = await getProducts({
    page,
    limit: 20,
    search: params.search,
    categoryId: params.category,
  });
  const categories = await getCategories();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Products
          </h1>
          <p className={styles.headerSubtitle}>
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className={styles.addBtn}
        >
          <Plus className={styles.addBtnIcon} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <form className={styles.searchForm}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Search products..."
            className={styles.searchInput}
          />
        </form>
      </div>

      {/* Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Date</th>
                <th className={styles.alignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <Package className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No products yet</p>
                    <Link
                      href="/admin/products/new"
                      className={styles.emptyLink}
                    >
                      Create your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.imageWrapper}>
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className={styles.productImage}
                            />
                          ) : (
                            <Package className={styles.placeholderIcon} />
                          )}
                        </div>
                        <div className={styles.productInfo}>
                          <p className={styles.productName}>
                            {product.name}
                          </p>
                          <p className={styles.productSku}>
                            {product.sku || "No SKU"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>
                      {product.category?.name || "—"}
                    </td>
                    <td className={styles.priceCell}>
                      <div>
                        {product.salePrice ? (
                          <>
                            <span className={styles.salePrice}>
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className={styles.originalPrice}>
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className={styles.regularPrice}>
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={cn(
                          styles.stockCell,
                          product.stock <= 0
                            ? styles.stockOut
                            : product.stock <= 5
                            ? styles.stockLow
                            : styles.stockGood
                        )}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.isPublished ? (
                        <span className={cn(styles.statusBadge, styles.statusPublished)}>
                          <Eye className={styles.statusIcon} /> Published
                        </span>
                      ) : (
                        <span className={cn(styles.statusBadge, styles.statusDraft)}>
                          <EyeOff className={styles.statusIcon} /> Draft
                        </span>
                      )}
                    </td>
                    <td className={styles.dateCell}>
                      {formatDateShort(product.createdAt)}
                    </td>
                    <td>
                      <ProductActions productId={product.id} productSlug={product.slug} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className={styles.pagination}>
            <p className={styles.pageInfo}>
              Page {page} of {pages}
            </p>
            <div className={styles.pageControls}>
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${params.search ? `&search=${params.search}` : ""}`}
                  className={styles.pageBtn}
                >
                  Previous
                </Link>
              )}
              {page < pages && (
                <Link
                  href={`/admin/products?page=${page + 1}${params.search ? `&search=${params.search}` : ""}`}
                  className={styles.pageBtn}
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
