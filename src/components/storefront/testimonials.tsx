"use client";

import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import styles from "./testimonials.module.css";

const testimonials = [
  {
    name: "Amelia R.",
    location: "London, UK",
    rating: 5,
    text: "The pink daisy granny square tote exceeded every expectation! The cotton is so sturdy yet soft, and every stitch is immaculate. I get compliments everywhere I carry it!",
    product: "Pink Daisy Meadow Tote",
  },
  {
    name: "Sarah K.",
    location: "Austin, TX",
    rating: 5,
    text: "Ordered a custom pink amigurumi bunny for my niece's birthday. The packaging, personalized note, and heirloom quality blew us away!",
    product: "Custom Strawberry Bunny",
  },
  {
    name: "Priya M.",
    location: "Chicago, IL",
    rating: 5,
    text: "The forever pink tulip bouquet brought happy tears. It looks stunning on my vanity and will never wilt. Truly crafted with pure soul.",
    product: "Pastel Pink Tulip Bouquet",
  },
  {
    name: "Emily T.",
    location: "Portland, OR",
    rating: 5,
    text: "The baby crochet set is the softest yarn I have ever felt. You can tell real passion went into every loop. 100% recommending to all my friends!",
    product: "Heirloom Blush Baby Set",
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Heart className={styles.badgeIcon} />
            <span>Customer Love &amp; Reviews</span>
          </div>
          <h2 className={styles.title}>
            Cherished by Crochet Lovers
          </h2>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <div className={styles.stars}>
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className={styles.starIcon} />
            ))}
          </div>

          <p className={styles.quote}>
            &ldquo;{current.text}&rdquo;
          </p>

          <div className={styles.authorInfo}>
            <p className={styles.authorName}>
              {current.name}
            </p>
            <p className={styles.authorDetails}>
              {current.location} • Verified Buyer ({current.product})
            </p>
          </div>

          {/* Navigation Controls */}
          <div className={styles.navigation}>
            <button
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className={styles.navBtn}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className={styles.navIcon} />
            </button>

            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`${styles.dot} ${i === index ? styles.dotActive : styles.dotInactive}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className={styles.navBtn}
              aria-label="Next testimonial"
            >
              <ChevronRight className={styles.navIcon} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
