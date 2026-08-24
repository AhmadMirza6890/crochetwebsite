"use client";

import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./wishlist.module.css";

export const dynamic = "force-dynamic";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, totalWishlistItems } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.id);
  };

  if (totalWishlistItems === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconWrapper}>
          <Heart className={styles.emptyIcon} />
        </div>
        <h1 className={styles.emptyTitle}>
          Your Wishlist is Empty
        </h1>
        <p className={styles.emptyText}>
          Save your favorite handmade crochet bags, flowers, and plushies to purchase later or share with loved ones.
        </p>
        <Link
          href="/shop"
          className={styles.exploreBtn}
        >
          Explore Creations <ArrowRight className={styles.exploreIcon} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              My Saved Wishlist
            </h1>
            <p className={styles.subtitle}>
              {totalWishlistItems} handmade treasure{totalWishlistItems === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className={styles.clearBtn}
          >
            <Trash2 className={styles.clearIcon} /> Clear All
          </button>
        </div>

        <div className={styles.grid}>
          {wishlist.map((item) => (
            <motion.div
              layout
              key={item.id}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.image} />
                ) : (
                  <div className={styles.placeholder}>🧶</div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className={styles.removeBtn}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className={styles.removeIcon} />
                </button>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardInfo}>
                  {item.categoryName && (
                    <p className={styles.category}>
                      {item.categoryName}
                    </p>
                  )}
                  <Link
                    href={`/product/${item.slug}`}
                    className={styles.productName}
                  >
                    {item.name}
                  </Link>
                  <p className={styles.price}>
                    {formatPrice(item.salePrice || item.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className={styles.moveBtn}
                >
                  <ShoppingBag className={styles.moveIcon} /> Move to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
