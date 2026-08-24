"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Loader2, Heart } from "lucide-react";
import { subscribeNewsletter } from "@/lib/actions/settings";
import { toast } from "sonner";
import styles from "./newsletter.module.css";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setSubscribed(true);
        toast.success("Thank you for joining our crochet family!");
      } else {
        toast.info(res.message || "You are already subscribed!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badge}>
            <Sparkles className={styles.badgeIcon} />
            <span>Join the Pink Yarn Circle</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className={styles.heading}>
          Enjoy 10% Off Your First Order
        </h2>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Subscribe for early access to limited seasonal drops, bespoke commission queue openings, and exclusive secret gift vouchers.
        </p>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {subscribed ? (
            <div className={styles.successBox}>
              <CheckCircle2 className={styles.successIcon} />
              <span className={styles.successText}>
                Welcome! Use code <strong className={styles.successCode}>HANDMADE10</strong> at checkout.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className={styles.input}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? (
                  <Loader2 className={`${styles.btnIcon} ${styles.spin}`} />
                ) : (
                  <Heart className={`${styles.btnIcon} fill-current`} />
                )}
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
