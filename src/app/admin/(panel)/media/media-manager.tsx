"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMedia } from "@/lib/actions/media";
import styles from "./media.module.css";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: number | null;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error();
      }
      toast.success("Images uploaded to Media Library!");
      router.refresh();
    } catch {
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Permanently delete "${item.filename}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    try {
      await deleteMedia(item.id);
      toast.success("Image deleted from library");
      router.refresh();
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>
            Media Library
          </h1>
          <p className={styles.headerSubtitle}>
            Store, search, and reuse high-resolution product and blog images
          </p>
        </div>

        <label className={styles.uploadLabel}>
          {uploading ? <Loader2 className={cn(styles.btnIcon, styles.spinner)} /> : <Upload className={styles.btnIcon} />}
          Upload Images
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} className={styles.hiddenInput} disabled={uploading} />
        </label>
      </div>

      <div className={styles.grid}>
        {initialItems.length === 0 ? (
          <p className={cn(styles.metadata, "col-span-full py-8 text-center")}>
            No images yet — upload your first product photos above.
          </p>
        ) : (
          initialItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={item.url} alt={item.filename} className={styles.image} />
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className={styles.deleteBtn}
                  title="Delete image"
                >
                  {deletingId === item.id ? (
                    <Loader2 className={cn(styles.deleteIcon, styles.spinner)} />
                  ) : (
                    <Trash2 className={styles.deleteIcon} />
                  )}
                </button>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.filename}>{item.filename}</p>
                <p className={styles.metadata}>{formatSize(item.size)}</p>

                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className={styles.copyBtn}
                >
                  {copiedId === item.id ? <Check className={styles.successIcon} /> : <Copy className={styles.copyIcon} />}
                  {copiedId === item.id ? "Copied!" : "Copy URL"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
