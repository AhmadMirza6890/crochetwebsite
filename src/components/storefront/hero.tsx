"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Star, ShieldCheck } from "lucide-react";
import styles from "./hero.module.css";

export function HeroSection({
  heroImage,
}: {
  heroImage?: string | null;
}) {
  const displayImage =
    heroImage ||
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000";

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Left Text Column */}
          <div className={styles.leftColumn}>
            
            {/* Top Badge */}
            <div className={styles.badge}>
              <Sparkles className={styles.badgeIcon} />
              <span>100% Handcrafted Crochet with Love</span>
            </div>

            {/* Heading */}
            <h1 className={styles.heading}>
              Artisanal Crochet,{" "}
              <span className={styles.headingHighlight}>
                Woven from the Heart
              </span>
            </h1>

            {/* Subheading */}
            <p className={styles.subheading}>
              Explore our boutique of handmade crochet bags, everlasting rose bouquets, lovable amigurumi toys, and custom bespoke commissions made from 100% organic cotton.
            </p>

            {/* Buttons Row - Guaranteed Alignment */}
            <div className={styles.buttonGroup}>
              <Link href="/shop" className={styles.primaryBtn}>
                <span>Shop Pink Collection</span>
                <ArrowRight className={styles.btnIcon} />
              </Link>
              <Link href="/custom-order" className={styles.secondaryBtn}>
                <Sparkles className={`${styles.btnIcon} text-rose-500`} />
                <span>Custom Commission</span>
              </Link>
            </div>

            {/* Trust Badges - Guaranteed Alignment */}
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Heart className={`${styles.trustIcon} fill-current`} />
                </div>
                <span>100% Handcrafted</span>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <ShieldCheck className={styles.trustIcon} />
                </div>
                <span>Hypoallergenic Cotton</span>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Star className={`${styles.trustIcon} fill-current`} />
                </div>
                <span>5.0 Star Reviews</span>
              </div>
            </div>

          </div>

          {/* Right Visual Column */}
          <div className={styles.rightColumn}>
            <div className={styles.imageCardWrapper}>
              <div className={styles.imageFrame}>
                <img
                  src={displayImage}
                  alt="Handmade crochet collection"
                  className={styles.heroImg}
                />
                <div className={styles.imageOverlay} />
                <div className={styles.imageTextContainer}>
                  <p className={styles.imageTitle}>
                    Every Stitch Tells a Story
                  </p>
                  <p className={styles.imageSubtitle}>
                    Crafted Slowly • Heirloom Quality
                  </p>
                </div>
              </div>

              {/* Floating review card */}
              <div className={styles.floatingReview}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.reviewText}>500+ Happy Buyers</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
