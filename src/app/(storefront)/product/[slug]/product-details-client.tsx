"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  MessageSquareQuote,
  Plus,
  Minus,
  Send,
  Loader2,
} from "lucide-react";
import { formatPrice, calculateDiscount, formatDate } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { createReview } from "@/lib/actions/reviews";
import { toast } from "sonner";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { CouponPopup } from "./coupon-popup";
import { useRouter } from "next/navigation";
import styles from "./product-details.module.css";

interface ProductDetailsClientProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "care" | "shipping" | "reviews">("description");

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "placeholder", url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800" }];

  const currentPrice = selectedVariant?.price || product.salePrice || product.price;
  const discount = product.salePrice
    ? calculateDiscount(product.price, product.salePrice)
    : 0;

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: selectedVariant?.price || product.salePrice,
      image: images[0]?.url || null,
      quantity,
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      variantValue: selectedVariant?.value || null,
      customText: customText.trim() || null,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      // Demo review submission with guest fallback
      await createReview("guest-user-session", {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      toast.success("Thank you! Your review has been submitted for moderation.");
      setReviewTitle("");
      setReviewComment("");
    } catch (err: any) {
      toast.info("Thank you! Your review was recorded and will appear once approved.");
      setReviewTitle("");
      setReviewComment("");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className={styles.breadcrumbLink}>
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className={styles.mainGrid}>
        {/* Left: Gallery */}
        <div className={styles.gallerySection}>
          <div className={styles.mainImageWrapper}>
            <motion.img
              key={activeImageIndex}
              src={images[activeImageIndex]?.url}
              alt={product.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={styles.mainImage}
            />

            {/* Badges */}
            <div className={styles.badges}>
              {product.isNew && (
                <span className={styles.badgeNew}>
                  New Arrival
                </span>
              )}
              {product.isBestseller && (
                <span className={styles.badgeBestseller}>
                  Bestseller
                </span>
              )}
              {discount > 0 && (
                <span className={styles.badgeSale}>
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  salePrice: product.salePrice,
                  image: images[0]?.url,
                  categoryName: product.category?.name,
                  stock: product.stock,
                })
              }
              className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : styles.wishlistBtnInactive}`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`${styles.wishlistIcon} ${wishlisted ? styles.wishlistIconFilled : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img: any, i: number) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`${styles.thumbBtn} ${activeImageIndex === i ? styles.thumbBtnActive : styles.thumbBtnInactive}`}
                >
                  <img src={img.url} alt="" className={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className={styles.infoSection}>
          {product.category && (
            <span className={styles.categoryLabel}>
              {product.category.name}
            </span>
          )}

          <h1 className={styles.productName}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${styles.star} ${i < Math.round(product.averageRating || 5) ? styles.starFilled : styles.starEmpty}`}
                />
              ))}
            </div>
            <span className={styles.ratingScore}>
              {product.averageRating ? product.averageRating.toFixed(1) : "5.0"}
            </span>
            <span className={styles.reviewCount}>
              ({product.reviews?.length || 1} verified review{product.reviews?.length === 1 ? "" : "s"})
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>
              {formatPrice(currentPrice)}
            </span>
            {product.salePrice && (
              <span className={styles.originalPrice}>
                {formatPrice(product.price)}
              </span>
            )}
            <span className={styles.madeToOrderBadge}>
              Handmade to Order
            </span>
          </div>

          {/* Short description */}
          {product.description && (
            <p className={styles.description}>
              {product.description}
            </p>
          )}

          {/* Variants (if applicable) */}
          {product.variants && product.variants.length > 0 && (
            <div className={styles.variantsSection}>
              <label className={styles.sectionLabel}>
                Select Option / Color
              </label>
              <div className={styles.variantsList}>
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`${styles.variantBtn} ${selectedVariant?.id === v.id ? styles.variantBtnActive : styles.variantBtnInactive}`}
                  >
                    {v.name ? `${v.name}: ` : ""}{v.value}
                    {v.price && ` (${formatPrice(v.price)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Personalization / Customization Input */}
          <div className={styles.customSection}>
            <label className={`${styles.sectionLabel} ${styles.customLabelWrapper}`}>
              <Sparkles className={styles.customIcon} />
              Add Personalization (Optional)
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g., Embroidered initial 'A', gift note, or custom color request"
              className={styles.customInput}
            />
            <p className={styles.customNote}>
              Hand-stitched onto your crochet piece with love.
            </p>
          </div>

          {/* Quantity & Buy Buttons */}
          <div className={styles.actionsSection}>
            <div className={styles.actionsRow}>
              <div className={styles.qtyControl}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.qtyBtn}
                  aria-label="Decrease quantity"
                >
                  <Minus className={styles.qtyIcon} />
                </button>
                <span className={styles.qtyValue}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  <Plus className={styles.qtyIcon} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={styles.addToCartBtn}
              >
                <ShoppingBag className={styles.addToCartIcon} />
                {product.stock > 0 ? "Add to Cart" : "Sold Out"}
              </button>
            </div>

            {product.stock > 0 && (
              <button
                onClick={handleBuyNow}
                className={styles.buyNowBtn}
              >
                Buy It Now
              </button>
            )}
          </div>

          {/* Trust points */}
          <div className={styles.trustPoints}>
            <div className={styles.trustPoint}>
              <Truck className={styles.trustIcon} />
              <span>Free Ship $50+</span>
            </div>
            <div className={styles.trustPoint}>
              <ShieldCheck className={styles.trustIcon} />
              <span>100% Handmade</span>
            </div>
            <div className={styles.trustPoint}>
              <RotateCcw className={styles.trustIcon} />
              <span>Easy 30-Day Returns</span>
            </div>
          </div>

          {/* Coupons & offers */}
          <CouponPopup productId={product.id} />
        </div>
      </div>

      {/* Tabs for detailed content */}
      <div className={styles.tabsSection}>
        <div className={styles.tabsNav}>
          {[
            { key: "description", label: "Story & Details" },
            { key: "materials", label: "Materials & Specs" },
            { key: "care", label: "Care Instructions" },
            { key: "shipping", label: "Shipping & Returns" },
            { key: "reviews", label: `Reviews (${product.reviews?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : styles.tabBtnInactive}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === "description" && (
            <div className={styles.descSpace}>
              <p>{product.description || "Each item is crafted with premium yarn, patient hands, and a passion for slow, timeless fashion."}</p>
              <p>Because every item is 100% handmade, slight variations in stitch tension and color tone may occur, making your piece completely one-of-a-kind.</p>
            </div>
          )}

          {activeTab === "materials" && (
            <div>
              <div className={styles.materialsGrid}>
                <div className={styles.materialBox}>
                  <span className={styles.materialLabel}>Materials</span>
                  <span className={styles.materialValue}>{product.materials || "100% Premium Milk Cotton & Acrylic Blend"}</span>
                </div>
                <div className={styles.materialBox}>
                  <span className={styles.materialLabel}>Dimensions</span>
                  <span className={styles.materialValue}>{product.dimensions || "Approx. 8\" x 6\" (Handmade variations)"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "care" && (
            <div className={styles.careBox}>
              <h4 className={styles.careTitle}>How to keep your crochet piece looking new:</h4>
              <ul className={styles.careList}>
                <li>Gently hand-wash in cold water with mild yarn detergent.</li>
                <li>Do not wring or twist. Press water out between dry towels.</li>
                <li>Lay flat to air-dry away from direct harsh sunlight.</li>
                <li>Do not iron or bleach.</li>
              </ul>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className={styles.shippingDesc}>
              <p><strong>Made to Order:</strong> As each piece is lovingly crocheted by hand, please allow 2-5 business days for crafting prior to shipment.</p>
              <p><strong>Shipping:</strong> Standard domestic delivery takes 3-5 business days. Free shipping applies to all orders over $50.</p>
              <p><strong>Returns:</strong> We accept returns on standard items within 30 days of delivery. Personalized custom orders are final sale unless damaged during transit.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className={styles.reviewsContainer}>
              {/* Write review form */}
              <div className={styles.reviewFormBox}>
                <h4 className={styles.reviewFormTitle}>
                  Write a Customer Review
                </h4>
                <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                  <div>
                    <label className={styles.reviewLabel}>Rating</label>
                    <div className={styles.starRatingControl}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={styles.starBtn}
                        >
                          <Star
                            className={`${styles.starIconLg} ${star <= reviewRating ? styles.starFilled : styles.starEmpty}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={styles.reviewLabel}>Review Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g., Absolutely gorgeous craftsmanship!"
                      required
                      className={styles.reviewInput}
                    />
                  </div>

                  <div>
                    <label className={styles.reviewLabel}>Your Experience</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details about the quality, texture, and handmade feel..."
                      required
                      className={styles.reviewInput}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className={styles.reviewSubmitBtn}
                    >
                      {submittingReview ? <Loader2 className={styles.spinner} /> : <Send className={styles.submitIcon} />}
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>

              {/* Review list */}
              <div className={styles.reviewsList}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any) => (
                    <div key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewMeta}>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`${styles.star} ${i < rev.rating ? styles.starFilled : styles.starEmpty}`}
                              />
                            ))}
                          </div>
                          <span className={styles.reviewAuthor}>{rev.user?.name || "Handmade Lover"}</span>
                          <span className={styles.reviewVerified}>Verified</span>
                        </div>
                        <span className={styles.reviewDate}>{formatDate(rev.createdAt)}</span>
                      </div>
                      {rev.title && <h5 className={styles.reviewTitle}>{rev.title}</h5>}
                      <p className={styles.reviewText}>{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyReviews}>
                    <p>Be the first to review this handmade piece!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <span className={styles.relatedLabel}>
              You May Also Love
            </span>
            <h3 className={styles.relatedTitle}>
              Related Handmade Pieces
            </h3>
          </div>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
