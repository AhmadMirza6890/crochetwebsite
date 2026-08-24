"use client";

import { useState, useEffect } from "react";
import { getCollections, createCollection, deleteCollection } from "@/lib/actions/settings";
import { Layers, Plus, Trash2, Save, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import styles from "./collections.module.css";
import { cn } from "@/lib/utils";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  });

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCollection({
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
        image: form.image || undefined,
        isActive: form.isActive,
      });
      toast.success("Collection created successfully!");
      setShowModal(false);
      setForm({ name: "", slug: "", description: "", image: "", isActive: true });
      loadCollections();
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      toast.success("Collection deleted");
      loadCollections();
    } catch {
      toast.error("Failed to delete collection");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Curated Collections
          </h1>
          <p className={styles.headerSubtitle}>
            Group handmade products into seasonal capsules (e.g., Summer Pastel, Holiday Gifts, Nursery Heirlooms)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={styles.addBtn}
        >
          <Plus className={styles.btnIcon} /> Add Collection
        </button>
      </div>

      {showModal && (
        <div className={styles.modalCard}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>New Collection</h2>
            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
              <X className={styles.closeIcon} />
            </button>
          </div>

          <form onSubmit={handleCreate} className={styles.formGrid}>
            <div>
              <label className={styles.label}>
                Collection Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="Summer Crochet Capsule"
                required
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="summer-crochet-capsule"
                className={styles.inputField}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Cover Image URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className={styles.inputField}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description of this collection..."
                className={styles.inputField}
              />
            </div>

            <div className={cn(styles.colSpan2, styles.formActions)}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? <Loader2 className={cn(styles.btnIcon, styles.spinner)} /> : <Save className={styles.btnIcon} />} Save Collection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {collections.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers className={styles.emptyIcon} />
            <p className={styles.emptyText}>No collections created yet</p>
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                {col.image ? (
                  <img src={col.image} alt={col.name} className={styles.image} />
                ) : (
                  <div className={styles.placeholderImage}>🧶</div>
                )}
                <button
                  onClick={() => handleDelete(col.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 className={styles.btnIcon} />
                </button>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{col.name}</h3>
                {col.description && <p className={styles.cardDescription}>{col.description}</p>}
                <p className={styles.productCount}>
                  {col._count?.products || 0} products tagged
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
