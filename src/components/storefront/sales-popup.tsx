"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import styles from "./sales-popup.module.css";

const MOCK_PRODUCTS = [
  { name: "Daisy Crochet Bag", emoji: "👜" },
  { name: "Chunky Knit Blanket", emoji: "🧶" },
  { name: "Sunflower Bucket Hat", emoji: "👒" },
  { name: "Amigurumi Bunny", emoji: "🐰" },
  { name: "Granny Square Cardigan", emoji: "🧥" },
  { name: "Pastel Coaster Set", emoji: "☕" },
];

const MOCK_CITIES = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Dubai", "London", "Toronto"
];

const MOCK_TIMES = [
  "2 minutes ago", "5 minutes ago", "12 minutes ago", 
  "Just now", "An hour ago", "15 minutes ago"
];

export function SalesPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({ city: "", product: "", emoji: "", time: "" });

  useEffect(() => {
    setMounted(true);

    const triggerPopup = () => {
      // Pick random data
      const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      const city = MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];
      const time = MOCK_TIMES[Math.floor(Math.random() * MOCK_TIMES.length)];
      
      setData({ city, product: product.name, emoji: product.emoji, time });
      setVisible(true);

      // Auto hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Initial popup after a few seconds
    const initialTimer = setTimeout(triggerPopup, 8000);

    // Then pop up randomly every 20-40 seconds
    const interval = setInterval(() => {
      if (!visible) {
        triggerPopup();
      }
    }, Math.random() * 20000 + 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={styles.container}
        >
          <button 
            onClick={() => setVisible(false)}
            className={styles.closeBtn}
            aria-label="Close notification"
          >
            <X className={styles.closeIcon} />
          </button>

          <div className={styles.imageWrapper}>
            {data.emoji}
          </div>
          
          <div className={styles.content}>
            <p className={styles.message}>
              Someone in <span className={styles.highlight}>{data.city}</span> just bought a{" "}
              <span className={styles.highlight}>{data.product}</span>
            </p>
            <div className={styles.meta}>
              <span className={styles.time}>{data.time}</span>
              <span className={styles.verified}>
                <CheckCircle2 className={styles.verifiedIcon} />
                Verified
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
