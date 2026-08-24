"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import styles from "./cart-drawer.module.css";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, subtotal, totalItems } =
    useCart();

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className={styles.overlay}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={styles.drawer}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerTitleWrapper}>
                <ShoppingBag className={styles.headerIcon} />
                <h2 className={styles.headerTitle}>
                  Your Crochet Bag ({totalItems})
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className={styles.closeBtn}
                aria-label="Close cart"
              >
                <X className={styles.closeIcon} />
              </button>
            </div>

            {/* Free shipping progress bar */}
            <div className={styles.shippingPromo}>
              <p className={styles.shippingText}>
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add <span className={styles.shippingHighlight}>{formatPrice(remainingForFreeShipping)}</span> more for <span className={styles.shippingHighlight}>FREE Shipping!</span> 🚚
                  </>
                ) : (
                  <span className={styles.shippingHighlight}>
                    🎉 You&apos;ve unlocked FREE Shipping!
                  </span>
                )}
              </p>
              <div className={styles.progressBarContainer}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  className={styles.progressBar}
                />
              </div>
            </div>

            {/* Items list */}
            <div className={styles.itemsList}>
              {items.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrapper}>
                    🌸
                  </div>
                  <h3 className={styles.emptyTitle}>
                    Your bag is empty
                  </h3>
                  <p className={styles.emptyText}>
                    Explore our handmade crochet collection and pick something cozy!
                  </p>
                  <button
                    onClick={closeDrawer}
                    className={styles.exploreBtn}
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const currentPrice =
                    item.salePrice && item.salePrice > 0
                      ? item.salePrice
                      : item.price;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className={styles.itemCard}
                    >
                      <div className={styles.itemImageWrapper}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.itemImage}
                          />
                        ) : (
                          <div className={styles.itemImagePlaceholder}>
                            🧶
                          </div>
                        )}
                      </div>

                      <div className={styles.itemInfo}>
                        <div>
                          <div className={styles.itemHeader}>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeDrawer}
                              className={styles.itemName}
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className={styles.removeBtn}
                              aria-label="Remove item"
                            >
                              <Trash2 className={styles.removeIcon} />
                            </button>
                          </div>

                          {item.variantValue && (
                            <p className={styles.itemVariant}>
                              {item.variantName || "Variant"}: {item.variantValue}
                            </p>
                          )}
                          {item.customText && (
                            <p className={styles.itemCustom}>
                              Custom: &quot;{item.customText}&quot;
                            </p>
                          )}
                        </div>

                        <div className={styles.itemFooter}>
                          <div className={styles.quantityControl}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={styles.qtyBtn}
                            >
                              <Minus className={styles.qtyIcon} />
                            </button>
                            <span className={styles.qtyValue}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={styles.qtyBtn}
                            >
                              <Plus className={styles.qtyIcon} />
                            </button>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span className={styles.itemPrice}>
                              {formatPrice(currentPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>
                      {subtotal >= freeShippingThreshold ? (
                        <span className={styles.freeShippingText}>FREE</span>
                      ) : (
                        formatPrice(5.99)
                      )}
                    </span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total Estimate</span>
                    <span className={styles.totalPrice}>
                      {formatPrice(
                        subtotal + (subtotal >= freeShippingThreshold ? 0 : 5.99)
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.actionGrid}>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className={styles.viewCartBtn}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className={styles.checkoutBtn}
                  >
                    Checkout <ArrowRight className={styles.checkoutIcon} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
