"use client";

import { useState, useEffect } from "react";
import { getBlogPosts, createBlogPost, deleteBlogPost } from "@/lib/actions/settings";
import { slugify, formatDateShort } from "@/lib/utils";
import { FileText, Plus, Trash2, Edit, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./blog.module.css";
import { cn } from "@/lib/utils";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    authorName: "Jannah",
    status: "PUBLISHED",
  });

  const loadPosts = async () => {
    try {
      const res = await getBlogPosts({ limit: 50 });
      setPosts(res.posts || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogPost({
        ...form,
        slug: form.slug || slugify(form.title),
        publishedAt: form.status === "PUBLISHED" ? new Date() : null,
      });
      toast.success("Blog article published!");
      setShowModal(false);
      setForm({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", authorName: "Jannah", status: "PUBLISHED" });
      loadPosts();
    } catch {
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this blog article?")) return;
    try {
      await deleteBlogPost(id);
      toast.success("Post removed");
      loadPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Blog & Journal Articles
          </h1>
          <p className={styles.headerSubtitle}>
            Publish crafting stories, stitch tutorials, and yarn care guides
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={styles.addBtn}
        >
          <Plus className={styles.btnIcon} /> New Article
        </button>
      </div>

      {showModal && (
        <div className={styles.modalCard}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Write Blog Article</h2>
            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
              <X className={styles.closeIcon} />
            </button>
          </div>

          <form onSubmit={handleCreate} className={styles.formGrid}>
            <div>
              <label className={styles.label}>
                Article Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="The Gentle Art of Caring for Handmade Crochet"
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
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Featured Cover Image URL
              </label>
              <input
                type="text"
                value={form.featuredImage}
                onChange={(e) => setForm((p) => ({ ...p, featuredImage: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className={styles.inputField}
              />
            </div>

            <div>
              <label className={styles.label}>
                Author Name
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
                className={styles.inputField}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Short Excerpt
              </label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="A brief summary for previews..."
                className={styles.inputField}
              />
            </div>

            <div className={styles.colSpan2}>
              <label className={styles.label}>
                Article Body Content *
              </label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="Write your article content here..."
                required
                className={styles.textareaField}
              />
            </div>

            <div className={cn(styles.colSpan2, styles.formActions)}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? <Loader2 className={cn(styles.btnIcon, styles.spinner)} /> : <Save className={styles.btnIcon} />} Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Article</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th className={styles.alignRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    <FileText className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No blog posts found</p>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <p className={styles.articleTitle}>
                        {post.title}
                      </p>
                      <p className={styles.articleSlug}>/blog/{post.slug}</p>
                    </td>
                    <td className={styles.authorCell}>
                      {post.authorName || "Jannah"}
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
                        {post.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {formatDateShort(post.publishedAt || post.createdAt)}
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        onClick={() => handleDelete(post.id)}
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
