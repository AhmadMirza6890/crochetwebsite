"use client";

import { useState, useEffect } from "react";
import { getCoupons, createCoupon, deleteCoupon } from "@/lib/actions/settings";
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { formatPrice } from "@/lib/utils";
import { Ticket, Plus, Trash2, Save, X, Loader2, Package, FolderTree } from "lucide-react";
import { toast } from "sonner";
import styles from "./coupons.module.css";
import { cn } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE",
    value: 10,
    maxUses: 100,
    isActive: true,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const loadCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCoupons();
    getProducts({ limit: 200 })
      .then((res: any) => setProducts(res?.products || []))
      .catch(() => setProducts([]));
    getCategories()
      .then((cats) => setCategories(cats || []))
      .catch(() => setCategories([]));
  }, []);

  const toggleSelection = (list: string[], id: string, setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCoupon({
        ...form,
        code: form.code.toUpperCase().trim(),
        value: parseFloat(form.value as any),
        minOrder: null,
        maxUses: form.maxUses ? parseInt(form.maxUses as any) : null,
        productIds: selectedProducts,
        categoryIds: selectedCategories,
      });
      toast.success("Coupon created successfully!");
      setShowModal(false);
      setForm({ code: "", type: "PERCENTAGE", value: 10, maxUses: 100, isActive: true });
      setSelectedProducts([]);
      setSelectedCategories([]);
      loadCoupons();
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon code?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon removed");
      loadCoupons();
    } catch {
      toast.error("Failed to remove coupon");
    }
  };

  const scopeLabel = (c: any) => {
    const p = c.productIds?.length ?? 0;
    const cat = c.categoryIds?.length ?? 0;
    if (p === 0 && cat === 0) return "All products";
    if (p > 0 && cat === 0) return `${p} product${p === 1 ? "" : "s"}`;
    if (p === 0 && cat > 0) return `${cat} categor${cat === 1 ? "y" : "ies"}`;
    return `${p} products + ${cat} categories`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Coupons & Discounts
          </h1>
          <p className={styles.headerSubtitle}>
            Create promotional codes, fixed discounts, and free shipping triggers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={styles.addBtn}
        >
          <Plus className={styles.btnIcon} /> Create Coupon
        </button>
      </div>

      {showModal && (
        <div className={styles.modalCard}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>New Discount Code</h2>
            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
              <X className={styles.closeIcon} />
            </button>
          </div>

          <form onSubmit={handleCreate} className={styles.formGrid}>
            <div>
              <label className={styles.label}>
                Coupon Code *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                placeholder="HANDMADE10"
                required
                className={cn(styles.inputField, styles.inputFieldUppercase)}
              />
            </div>

            <div>
              <label className={styles.label}>
                Discount Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className={styles.inputField}
              >
                <option value="PERCENTAGE">Percentage Off (%)</option>
                <option value="FIXED">Fixed Amount Off ($)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>

            <div>
              <label className={styles.label}>
                Discount Value *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: parseFloat(e.target.value) || 0 }))}
                required
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Max Uses Limit
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm((p) => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))}
                className={styles.inputField}
              />
            </div>

            {/* Product scope */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>
                <Package className={cn(styles.btnIcon, styles.scopeIcon)} /> Apply to Specific Products
                <span className={styles.scopeHint}> — leave empty for all products</span>
              </label>
              <div className={styles.scopeList}>
                {products.length === 0 ? (
                  <p className={styles.scopeEmpty}>No products found</p>
                ) : (
                  products.map((p) => (
                    <label key={p.id} className={cn(styles.scopeItem, selectedProducts.includes(p.id) && styles.scopeItemSelected)}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p.id)}
                        onChange={() => toggleSelection(selectedProducts, p.id, setSelectedProducts)}
                        className={styles.scopeCheckbox}
                      />
                      <span className={styles.scopeItemName}>{p.name}</span>
                      {p.price != null && <span className={styles.scopeItemPrice}>{formatPrice(p.price)}</span>}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Category scope */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>
                <FolderTree className={cn(styles.btnIcon, styles.scopeIcon)} /> Apply to Specific Categories
                <span className={styles.scopeHint}> — leave empty for all categories</span>
              </label>
              <div className={styles.scopeList}>
                {categories.length === 0 ? (
                  <p className={styles.scopeEmpty}>No categories found</p>
                ) : (
                  categories.map((c) => (
                    <label key={c.id} className={cn(styles.scopeItem, selectedCategories.includes(c.id) && styles.scopeItemSelected)}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.id)}
                        onChange={() => toggleSelection(selectedCategories, c.id, setSelectedCategories)}
                        className={styles.scopeCheckbox}
                      />
                      <span className={styles.scopeItemName}>{c.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? <Loader2 className={cn(styles.btnIcon, styles.spinner)} /> : <Save className={styles.btnIcon} />} Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Applies To</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th className={styles.alignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <Ticket className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No coupons created yet</p>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.codeCell}>
                      {c.code}
                    </td>
                    <td className={styles.discountCell}>
                      {c.type === "PERCENTAGE" ? `${c.value}% Off` : c.type === "FIXED" ? `$${c.value} Off` : "Free Shipping"}
                    </td>
                    <td>{scopeLabel(c)}</td>
                    <td className={styles.minOrderCell}>
                      {c.usedCount} / {c.maxUses || "∞"} used
                    </td>
                    <td>
                      <span className={cn(styles.statusBadge, c.isActive ? styles.statusActive : styles.statusDisabled)}>
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className={styles.deleteBtn}
                      >
                        <Trash2 className={styles.btnIcon} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
