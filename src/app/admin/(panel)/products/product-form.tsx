"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, addProductImages } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Save, Upload, X, Loader2 } from "lucide-react";
import styles from "./product-form.module.css";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    salePrice?: number | null;
    sku?: string | null;
    stock: number;
    materials?: string | null;
    dimensions?: string | null;
    careInstructions?: string | null;
    shippingInfo?: string | null;
    weight?: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    isBestseller: boolean;
    isNew: boolean;
    categoryId?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    images?: ProductImage[];
    tags?: { name: string }[];
  };
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEditing = !!product;

  const [form, setForm] = useState<{
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice: number | null;
    sku: string;
    stock: number;
    materials: string;
    dimensions: string;
    careInstructions: string;
    shippingInfo: string;
    weight: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    isBestseller: boolean;
    isNew: boolean;
    categoryId: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    tags: string[];
  }>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    salePrice: product?.salePrice || null,
    sku: product?.sku || "",
    stock: product?.stock || 0,
    materials: product?.materials || "",
    dimensions: product?.dimensions || "",
    careInstructions: product?.careInstructions || "",
    shippingInfo: product?.shippingInfo || "",
    weight: product?.weight || null,
    isPublished: Boolean(product?.isPublished),
    isFeatured: Boolean(product?.isFeatured),
    isBestseller: Boolean(product?.isBestseller),
    isNew: product?.isNew !== undefined ? Boolean(product.isNew) : true,
    categoryId: product?.categoryId || "",
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    metaKeywords: product?.metaKeywords || "",
    tags: product?.tags?.map((t) => t.name) || [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slugify(name),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !product?.id) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        urls.push(data.url);
      }
      await addProductImages(product.id, urls);
      toast.success("Images uploaded");
      router.refresh();
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...form,
        salePrice: form.salePrice || undefined,
        sku: form.sku || undefined,
        weight: form.weight || undefined,
        categoryId: form.categoryId || undefined,
      };

      if (isEditing && product) {
        await updateProduct(product.id, data);
        toast.success("Product updated");
      } else {
        await createProduct(data);
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update product" : "Failed to create product"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          {isEditing ? "Edit Product" : "New Product"}
        </h1>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? <Loader2 className={styles.spinner} /> : <Save className={styles.icon} />}
          {isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>

      <div className={styles.gridLayout}>
        {/* Main content */}
        <div className={styles.mainColumn}>
          {/* Basic info */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Basic Information
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={5}
                className={styles.input}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Pricing & Inventory
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                  }
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.salePrice || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      salePrice: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))
                  }
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Product Details
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Materials</label>
              <textarea
                value={form.materials}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, materials: e.target.value }))
                }
                rows={2}
                className={styles.input}
                placeholder="100% cotton yarn, polyester filling..."
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dimensions</label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, dimensions: e.target.value }))
                  }
                  className={styles.input}
                  placeholder='e.g., 10" x 8" x 4"'
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.weight || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      weight: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Care Instructions</label>
              <textarea
                value={form.careInstructions}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    careInstructions: e.target.value,
                  }))
                }
                rows={2}
                className={styles.input}
                placeholder="Hand wash gently, air dry..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Shipping Information</label>
              <textarea
                value={form.shippingInfo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, shippingInfo: e.target.value }))
                }
                rows={2}
                className={styles.input}
              />
            </div>
          </div>

          {/* Images (edit mode only) */}
          {isEditing && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                Images
              </h2>
              <div className={styles.imagesGrid}>
                {product?.images?.map((img) => (
                  <div
                    key={img.id}
                    className={styles.imagePreview}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || ""}
                      className={styles.productImg}
                    />
                  </div>
                ))}
                <label className={styles.uploadLabel}>
                  {uploading ? (
                    <Loader2 className={cn(styles.icon, styles.spinner)} />
                  ) : (
                    <>
                      <Upload className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className={styles.hiddenInput}
                  />
                </label>
              </div>
            </div>
          )}

          {/* SEO */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              SEO
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Meta Title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                rows={2}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Meta Keywords</label>
              <input
                type="text"
                value={form.metaKeywords}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaKeywords: e.target.value,
                  }))
                }
                className={styles.input}
                placeholder="crochet, handmade, gift..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideColumn}>
          {/* Status */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Status
            </h2>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }))
                }
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>Published</span>
            </label>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>Featured</span>
            </label>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isBestseller: e.target.checked,
                  }))
                }
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>Bestseller</span>
            </label>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isNew: e.target.checked }))
                }
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>New Arrival</span>
            </label>
          </div>

          {/* Category */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Category
            </h2>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className={styles.input}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Tags
            </h2>
            <div className={styles.tagInputWrapper}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className={styles.input}
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className={styles.addTagBtn}
              >
                Add
              </button>
            </div>
            <div className={styles.tagsContainer}>
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className={styles.tagBadge}
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className={styles.removeTagBtn}>
                    <X className={styles.removeIcon} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
