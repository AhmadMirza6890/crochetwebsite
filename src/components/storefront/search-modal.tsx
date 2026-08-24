"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { searchProducts } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./search-modal.module.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query.trim());
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const popularSearches = [
    "Crochet Bag",
    "Tulip Bouquet",
    "Amigurumi Cat",
    "Coasters",
    "Baby Blanket",
    "Custom Keychain",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={styles.overlay}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={styles.modalContainer}
          >
            <div className={styles.modalBox}>
              <form onSubmit={handleSearchSubmit} className={styles.form}>
                <Search className={styles.searchIcon} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search handmade crochet bags, flowers, amigurumi..."
                  className={styles.input}
                />
                {loading && <Loader2 className={styles.spinner} />}
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.closeBtn}
                >
                  <X className={styles.closeIcon} />
                </button>
              </form>

              {/* Suggestions / Results */}
              <div className={styles.contentArea}>
                {query.trim().length >= 2 ? (
                  results.length > 0 ? (
                    <div>
                      <p className={styles.sectionTitle}>
                        Products ({results.length})
                      </p>
                      <div className={styles.resultsGrid}>
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className={styles.resultCard}
                          >
                            <div className={styles.resultImageWrapper}>
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className={styles.resultImage}
                                />
                              ) : (
                                <div className={styles.resultPlaceholder}>🌸</div>
                              )}
                            </div>
                            <div className={styles.resultInfo}>
                              <p className={styles.resultName}>
                                {product.name}
                              </p>
                              {product.category && (
                                <p className={styles.resultCategory}>{product.category.name}</p>
                              )}
                              <p className={styles.resultPrice}>
                                {formatPrice(product.salePrice || product.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : !loading ? (
                    <div className={styles.emptyState}>
                      <p className={styles.emptyTitle}>No handmade items found for &quot;{query}&quot;</p>
                      <p className={styles.emptySubtitle}>Try searching for keywords like bag, flower, or gift.</p>
                    </div>
                  ) : null
                ) : (
                  <div className={styles.popularContainer}>
                    <p className={styles.sectionTitle}>
                      Popular Searches
                    </p>
                    <div className={styles.popularTags}>
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            router.push(`/shop?search=${encodeURIComponent(term)}`);
                            onClose();
                          }}
                          className={styles.tagBtn}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {query.trim().length >= 2 && results.length > 0 && (
                <div className={styles.viewAllFooter}>
                  <button
                    onClick={handleSearchSubmit}
                    className={styles.viewAllBtn}
                  >
                    View all results for &quot;{query}&quot; <ArrowRight className={styles.viewAllIcon} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
