"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, X, Copy, Check, Loader2, Truck, Percent, BadgeDollarSign } from "lucide-react";
import { toast } from "sonner";
import { getProductOffers, validateCoupon } from "@/lib/actions/settings";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import styles from "./coupon-popup.module.css";

interface Offer {
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minOrder: number | null;
}

export function offerLabel(offer: Offer): string {
  if (offer.type === "PERCENTAGE") return `${offer.value}% OFF`;
  if (offer.type === "FIXED") return `${formatPrice(offer.value)} OFF`;
  return "FREE SHIPPING";
}

export function CouponPopup({ productId }: { productId: string }) {
  const { applyCoupon, coupon, subtotal, items } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProductOffers(productId)
      .then((res) => {
        if (!cancelled) setOffers(res || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoadingOffers(false));

    // Auto-open once per session when the customer lands on a product
    timerRef.current = setTimeout(() => {
      const key = `hsy_offer_seen_${productId}`;
      try {
        if (!sessionStorage.getItem(key) && !cancelled) {
          sessionStorage.setItem(key, "1");
          setAutoShown(true);
          setOpen(true);
        }
      } catch {
        // storage unavailable — just don't auto-open
      }
    }, 1200);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [productId]);

  const handleApplyOffer = async (code: string) => {
    setChecking(true);
    try {
      const res = await validateCoupon(
        code.trim().toUpperCase(),
        subtotal,
        items.map((i) => ({ productId: i.productId }))
      );
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon);
        if (res.freeShipping) {
          toast.success(`Free shipping unlocked with ${res.coupon.code}! 🚚`);
        } else {
          toast.success(`${res.coupon.code} applied — you save ${formatPrice(res.discount)}! 🎉`);
        }
        setOpen(false);
        setManualCode("");
      } else {
        toast.error(res.message || "Invalid coupon code");
      }
    } catch {
      toast.error("Could not validate the code. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleCopy = async (offer: Offer) => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopiedCode(offer.code);
      toast.success(`Code ${offer.code} copied!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      handleApplyOffer(offer.code);
    }
  };

  const hasOffers = offers.length > 0;

  return (
    <>
      {/* Floating offers trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles.offersBtn}
        aria-label="View available offers"
      >
        <Ticket className={styles.offersIcon} />
        <span className={styles.offersText}>
          {hasOffers ? `${offers.length} offer${offers.length === 1 ? "" : "s"} available` : "Have a coupon?"}
        </span>
        <span className={styles.offersPulse} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button onClick={() => setOpen(false)} className={styles.closeBtn} aria-label="Close">
                <X className={styles.closeIcon} />
              </button>

              <div className={styles.header}>
                <span className={styles.headerEmoji}>🎁</span>
                <h3 className={styles.title}>
                  {autoShown && hasOffers ? "A little treat for you!" : "Coupons & Offers"}
                </h3>
                <p className={styles.subtitle}>
                  {autoShown && hasOffers
                    ? "Special discounts on this piece — tap one to use it"
                    : "Enter your discount code below"}
                </p>
              </div>

              {loadingOffers ? (
                <div className={styles.loadingRow}>
                  <Loader2 className={styles.spinner} /> Loading offers...
                </div>
              ) : (
                hasOffers && (
                  <div className={styles.offersList}>
                    {offers.map((offer) => (
                      <div key={offer.code} className={styles.offerCard}>
                        <div className={styles.offerIconBox}>
                          {offer.type === "PERCENTAGE" ? (
                            <Percent className={styles.offerIcon} />
                          ) : offer.type === "FIXED" ? (
                            <BadgeDollarSign className={styles.offerIcon} />
                          ) : (
                            <Truck className={styles.offerIcon} />
                          )}
                        </div>
                        <div className={styles.offerInfo}>
                          <p className={styles.offerValue}>{offerLabel(offer)}</p>
                          <p className={styles.offerMeta}>
                            Code: <strong>{offer.code}</strong>
                            {coupon?.code === offer.code ? " · Applied ✓" : ""}
                          </p>
                        </div>
                        {coupon?.code === offer.code ? (
                          <span className={styles.appliedBadge}>
                            <Check className={styles.checkIcon} /> Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCopy(offer)}
                            className={styles.copyBtn}
                          >
                            {copiedCode === offer.code ? (
                              <>
                                <Check className={styles.copyIcon} /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className={styles.copyIcon} /> Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualCode.trim()) handleApplyOffer(manualCode);
                }}
                className={styles.applyForm}
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="ENTER COUPON CODE"
                  className={styles.codeInput}
                />
                <button type="submit" disabled={checking || !manualCode.trim()} className={styles.applyBtn}>
                  {checking ? <Loader2 className={styles.spinner} /> : "Apply"}
                </button>
              </form>

              <p className={styles.note}>
                Your discount is applied automatically in the cart & checkout.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
