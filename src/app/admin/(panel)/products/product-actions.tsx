"use client";

import { deleteProduct, toggleProductPublish } from "@/lib/actions/products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./product-actions.module.css";
import { cn } from "@/lib/utils";

export function ProductActions({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleTogglePublish = async () => {
    try {
      await toggleProductPublish(productId);
      toast.success("Product updated");
      router.refresh();
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      <Link
        href={`/product/${productSlug}`}
        target="_blank"
        className={styles.actionIconBtn}
        title="View"
      >
        <Eye className={styles.actionIcon} />
      </Link>
      <Link
        href={`/admin/products/${productId}/edit`}
        className={styles.actionIconBtn}
        title="Edit"
      >
        <Edit className={styles.actionIcon} />
      </Link>
      <button
        onClick={() => setOpen(!open)}
        className={styles.actionIconBtn}
      >
        <MoreVertical className={styles.actionIcon} />
      </button>

      {open && (
        <>
          <div className={styles.dropdownOverlay} onClick={() => setOpen(false)} />
          <div className={styles.dropdownMenu}>
            <button
              onClick={() => { handleTogglePublish(); setOpen(false); }}
              className={styles.dropdownItem}
            >
              Toggle Publish
            </button>
            <button
              onClick={() => { handleDelete(); setOpen(false); }}
              className={cn(styles.dropdownItem, styles.dropdownItemDanger)}
            >
              <Trash2 className={styles.inlineIcon} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
