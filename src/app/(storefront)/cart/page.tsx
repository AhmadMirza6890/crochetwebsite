"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { validateCoupon } from "@/lib/actions/settings";
import { toast } from "sonner";
import styles from "./cart.module.css";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    freeShippingApplied,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const freeShippingThreshold = 50;
  const standardFree = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingCost =
    subtotal === 0 ? 0 : freeShippingApplied || standardFree ? 0 : 5.99;
  const finalTotal = Math.max(0, Math.round((subtotal - discount + shippingCost) * 100) / 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCheckingCoupon(true);
    try {
      const res = await validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
        items.map((i) => ({ productId: i.productId }))
      );
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon);
        if (res.freeShipping) {
          toast.success(`Coupon ${res.coupon.code} applied! You get free shipping 🚚`);
        } else {
          toast.success(`Coupon applied! Saved ${formatPrice(res.discount || 0)}`);
        }
        setCouponCode("");
      } else {
        removeCoupon();
        toast.error(res.message || "Invalid coupon code");
      }
    } catch {
      toast.error("Could not validate the coupon. Please try again.");
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info("Coupon removed");
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconWrapper}>
          🧶
        </div>
        <h1 className={styles.emptyTitle}>
          Your Shopping Cart is Empty
        </h1>
        <p className={styles.emptyText}>
          You haven&apos;t added any handmade crochet creations to your bag yet. Explore our handcrafted pieces!
        </p>
        <Link
          href="/shop"
          className={styles.exploreBtn}
        >
          Explore Collection <ArrowRight className={styles.exploreIcon} />
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
              Shopping Bag
            </h1>
            <p className={styles.subtitle}>
              {totalItems} handmade item{totalItems === 1 ? "" : "s"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className={styles.clearBtn}
          >
            <Trash2 className={styles.clearIcon} /> Clear Cart
          </button>
        </div>

        <div className={styles.mainGrid}>
          {/* Cart items list */}
          <div className={styles.itemsList}>
            {items.map((item) => {
              const currentPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <motion.div
                  layout
                  key={item.id}
                  className={styles.itemCard}
                >
                  <div className={styles.itemImageWrapper}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                    ) : (
                      <div className={styles.itemImagePlaceholder}>🧶</div>
                    )}
                  </div>

                  <div className={styles.itemContent}>
                    <div>
                      <div className={styles.itemHeader}>
                        <Link
                          href={`/product/${item.slug}`}
                          className={styles.itemName}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className={styles.itemRemoveBtn}
                          aria-label="Remove item"
                        >
                          <Trash2 className={styles.itemRemoveIcon} />
                        </button>
                      </div>

                      {item.variantValue && (
                        <p className={styles.itemVariant}>
                          {item.variantName || "Variant"}: <span className={styles.itemVariantValue}>{item.variantValue}</span>
                        </p>
                      )}
                      {item.customText && (
                        <p className={styles.itemCustom}>
                          Personalization: &quot;{item.customText}&quot;
                        </p>
                      )}
                    </div>

                    <div className={styles.itemFooter}>
                      <div className={styles.qtyControl}>
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

                      <div className={styles.itemPriceBox}>
                        <span className={styles.itemPrice}>
                          {formatPrice(currentPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <p className={styles.itemPriceEach}>
                            {formatPrice(currentPrice)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary & Coupon Box */}
          <div className={styles.summarySection}>
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>
                Order Summary
              </h2>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                <label className={styles.couponLabel}>
                  Discount Code
                </label>
                <div className={styles.couponInputWrapper}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. HANDMADE10)"
                    className={styles.couponInput}
                  />
                  <button
                    type="submit"
                    disabled={checkingCoupon}
                    className={styles.couponBtn}
                  >
                    Apply
                  </button>
                </div>
                {coupon && (
                  <p className={styles.couponSuccess}>
                    ✓ Code &quot;{coupon.code}&quot; applied!
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className={styles.couponRemove}
                      aria-label="Remove coupon"
                    >
                      Remove
                    </button>
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span>Subtotal</span>
                  <span className={styles.breakdownVal}>{formatPrice(subtotal)}</span>
                </div>
                {(discount > 0 || freeShippingApplied) && (
                  <div className={styles.breakdownRowDiscount}>
                    <span>
                      Coupon {coupon?.code}
                      {freeShippingApplied && discount === 0 ? " (Free shipping)" : ""}
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className={styles.breakdownRow}>
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className={styles.freeShipping}>FREE</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className={styles.totalRow}>
                  <span>Estimated Total</span>
                  <span className={styles.totalVal}>
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className={styles.checkoutBtn}
              >
                Proceed to Checkout <ArrowRight className={styles.checkoutIcon} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <Truck className={styles.trustIcon} />
                <span>Free shipping on all domestic orders over $50</span>
              </div>
              <div className={styles.trustBadge}>
                <ShieldCheck className={styles.trustIcon} />
                <span>Secure SSL checkout with 100% handmade guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
