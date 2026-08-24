"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import { slugify, formatDateShort } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Loader2, FolderTree } from "lucide-react";
import styles from "./categories.module.css";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  _count?: { products: number };
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", image: "", order: 0, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      order: cat.order,
      isActive: cat.isActive,
    });
    setEditing(cat);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || null,
        image: form.image || null,
        order: form.order,
        isActive: form.isActive,
        metaTitle: null,
        metaDescription: null,
      };

      if (editing) {
        await updateCategory(editing.id, data);
        toast.success("Category updated");
      } else {
        await createCategory(data);
        toast.success("Category created");
      }
      resetForm();
      router.refresh();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products will be unassigned.")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Categories
          </h1>
          <p className={styles.headerSubtitle}>
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className={styles.addBtn}
        >
          <Plus className={styles.btnIcon} />
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editing ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={resetForm} className={styles.closeBtn}>
              <X className={styles.btnIcon} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div>
              <label className={styles.label}>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value, slug: editing ? prev.slug : slugify(e.target.value) }))}
                className={styles.inputField}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className={styles.inputField}
              />
            </div>
            <div className={styles.fullWidth}>
              <label className={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className={styles.inputField}
                rows={2}
              />
            </div>
            <div>
              <label className={styles.label}>Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className={styles.inputField}
                placeholder="https://..."
              />
            </div>
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Active</span>
              </label>
            </div>
            <div className={cn(styles.fullWidth, styles.formActions)}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? <Loader2 className={cn(styles.btnIcon, styles.spinner)} /> : <Save className={styles.btnIcon} />}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Products</th>
              <th>Status</th>
              <th>Date</th>
              <th className={styles.alignRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  <FolderTree className={styles.emptyIcon} />
                  <p className={styles.emptyText}>No categories yet</p>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className={styles.categoryInfo}>
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className={styles.categoryImage} />
                      ) : (
                        <div className={styles.categoryImagePlaceholder}>
                          <FolderTree className={styles.placeholderIcon} />
                        </div>
                      )}
                      <div>
                        <p className={styles.categoryName}>{cat.name}</p>
                        <p className={styles.categorySlug}>/{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.productsCell}>
                    {cat._count?.products ?? 0}
                  </td>
                  <td>
                    <span className={cn(styles.statusBadge, cat.isActive ? styles.statusActive : styles.statusInactive)}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDateShort(cat.createdAt)}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => startEdit(cat)} className={cn(styles.actionBtn, styles.editBtn)}>
                      <Edit className={styles.btnIcon} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className={cn(styles.actionBtn, styles.deleteBtn)}>
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
  );
}
