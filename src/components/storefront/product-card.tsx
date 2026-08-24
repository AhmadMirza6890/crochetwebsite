"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import styles from "./product-card.module.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  images?: { id: string; url: string; alt?: string | null }[];
  category?: { name: string } | null;
  averageRating?: number;
  reviewCount?: number;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.salePrice
    ? calculateDiscount(product.price, product.salePrice)
    : 0;

  const mainImage = product.images?.[0]?.url;
  const hoverImage = product.images?.[1]?.url;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: mainImage || null,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: mainImage || null,
      categoryName: product.category?.name || null,
      stock: product.stock,
    });
  };

  return (
    <div className={styles.card}>
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className={styles.imageContainer}>
        {mainImage ? (
          <>
            <img
              src={mainImage}
              alt={product.name}
              className={styles.image}
              style={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={() => setImageLoaded(true)}
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.name}
                className={styles.hoverImage}
              />
            )}
            {!imageLoaded && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(251, 207, 232, 0.4)",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
            )}
          </>
        ) : (
          <div className={styles.placeholder}>🌸</div>
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && (
            <span className={styles.badge}>New</span>
          )}
          {discount > 0 && (
            <span className={styles.badge}>-{discount}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : ""}`}
        >
          <Heart className={`${styles.wishlistIcon} ${wishlisted ? styles.wishlistIconActive : ""}`} />
        </button>

        {/* Out of Stock */}
        {product.stock <= 0 && (
          <div className={styles.outOfStock}>
            <span className={styles.outOfStockBadge}>Sold Out</span>
          </div>
        )}
      </Link>

      {/* Info Body */}
      <div className={styles.info}>
        <div>
          {product.category && (
            <span className={styles.category}>
              {product.category.name}
            </span>
          )}
          <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3 className={styles.title}>
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${styles.star} ${
                    i < Math.round(product.averageRating || 5)
                      ? styles.starFilled
                      : styles.starEmpty
                  }`}
                />
              ))}
            </div>
            <span className={styles.reviewCount}>
              ({product.reviewCount || 1})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            {product.salePrice && product.salePrice > 0 ? (
              <>
                <span className={`${styles.price} ${styles.salePrice}`}>
                  {formatPrice(product.salePrice)}
                </span>
                <span className={styles.originalPrice}>
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className={styles.price}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={styles.addBtn}
          >
            <ShoppingBag className={styles.addIcon} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
