import { Sparkles, Heart, Flower2, ShieldCheck, Sun, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import styles from "./about.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Story & Artisan Philosophy | Hearthside Yarn",
  description: "Learn about our slow-craft philosophy, ethical yarn sourcing, and the passionate artisan hands behind our premium crochet pieces.",
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Hero Banner */}
        <div className={styles.hero}>
          <span className={styles.heroBadge}>
            <Sparkles className={styles.heroBadgeIcon} /> The Artisan Behind the Stitches
          </span>
          <h1 className={styles.heroTitle}>
            Crafted Slowly, Beautifully, and with Intention.
          </h1>
          <p className={styles.heroText}>
            In a fast-paced world of mass production, we celebrate the timeless beauty of slow, handmade crochet. Every single knot is made by hand with warmth, patience, and purpose.
          </p>
        </div>

        {/* Brand Story Section with Image Showcase */}
        <div className={styles.storyGrid}>
          <div className={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1000"
              alt="Artisan hands crocheting with soft yarn"
              className={styles.image}
            />
            <div className={styles.imageOverlay} />
            <div className={styles.imageCaption}>
              <p className={styles.imageCaptionTitle}>“Each piece carries warmth from our hands to your home.”</p>
              <p className={styles.imageCaptionAuthor}>— Jannah, Founder & Lead Artisan</p>
            </div>
          </div>

          <div className={styles.storyContent}>
            <h2 className={styles.storyTitle}>
              How It All Began
            </h2>
            <p className={styles.storyText}>
              What started as a quiet evening ritual with a single wooden crochet hook and soft milk cotton yarn blossomed into a boutique atelier dedicated to luxury handmade pieces.
            </p>
            <p className={styles.storyText}>
              We noticed that genuine handmade quality was becoming rare. Our mission is to revive timeless craftsmanship — from everlasting crochet floral arrangements that never wilt, to intricate granny-square totes and heirloom-quality baby blankets.
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>100%</span>
                <p className={styles.statLabel}>Handmade by Artisans</p>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>500+</span>
                <p className={styles.statLabel}>Custom Creations Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <h2 className={styles.valuesTitle}>
              Our Core Philosophy
            </h2>
            <p className={styles.valuesSubtitle}>
              Guiding principles behind every yarn selection, stitch pattern, and packaged order.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <Heart className={styles.valueIcon} />
              <h3 className={styles.valueCardTitle}>Artisanal Integrity</h3>
              <p className={styles.valueCardText}>
                We never use machine-made approximations. Every row is counted and crocheted by hand with precision.
              </p>
            </div>

            <div className={styles.valueCard}>
              <Flower2 className={styles.valueIcon} />
              <h3 className={styles.valueCardTitle}>Ethical & Gentle Yarns</h3>
              <p className={styles.valueCardText}>
                We carefully curate hypoallergenic cottons, baby-soft plush chenille, and durable wool blends.
              </p>
            </div>

            <div className={styles.valueCard}>
              <Sun className={styles.valueIcon} />
              <h3 className={styles.valueCardTitle}>Personalized Connection</h3>
              <p className={styles.valueCardText}>
                When you order from us, you directly support independent craftsmanship and slow artistic living.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>
            Ready to find your favorite piece?
          </h3>
          <div className={styles.ctaActions}>
            <Link
              href="/shop"
              className={styles.ctaBtnPrimary}
            >
              Shop Collection
            </Link>
            <Link
              href="/custom-order"
              className={styles.ctaBtnSecondary}
            >
              Custom Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
