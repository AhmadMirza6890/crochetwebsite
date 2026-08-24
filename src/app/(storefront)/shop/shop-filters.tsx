"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";
import styles from "./shop-filters.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Reset page when filters change

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  };

  const hasActiveFilters =
    currentCategory || currentSort !== "newest" || currentInStock || currentMinPrice || currentMaxPrice;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitleWrapper}>
          <SlidersHorizontal className={styles.headerIcon} />
          <h3 className={styles.headerTitle}>Filter Pieces</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className={styles.resetBtn}
          >
            <RotateCcw className={styles.resetIcon} /> Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className={styles.selectInput}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Categories
        </label>
        <div className={styles.categoryList}>
          <button
            onClick={() => updateFilters({ category: null })}
            className={`${styles.categoryBtn} ${!currentCategory ? styles.categoryBtnActive : styles.categoryBtnInactive}`}
          >
            <span className={styles.categoryName}>All Categories</span>
            {!currentCategory && <Check className={styles.checkIcon} />}
          </button>

          {categories.map((cat) => {
            const active = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilters({ category: active ? null : cat.id })}
                className={`${styles.categoryBtn} ${active ? styles.categoryBtnActive : styles.categoryBtnInactive}`}
              >
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryCount}>
                  ({cat._count?.products || 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Only */}
      <div className={styles.dividerSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateFilters({ inStock: e.target.checked ? "true" : null })}
            className={styles.checkboxInput}
          />
          <span>In Stock &amp; Ready to Ship</span>
        </label>
      </div>

      {/* Price Range */}
      <div className={styles.dividerSection}>
        <label className={styles.sectionLabel}>
          Price Range ($)
        </label>
        <form onSubmit={handlePriceApply} className={styles.priceForm}>
          <div className={styles.priceInputs}>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={styles.priceInput}
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={styles.priceInput}
            />
          </div>
          <button
            type="submit"
            className={styles.priceSubmitBtn}
          >
            Apply Price Filter
          </button>
        </form>
      </div>
    </div>
  );
}
