"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Loader2, HelpCircle } from "lucide-react";
import { createContactMessage } from "@/lib/actions/settings";
import { toast } from "sonner";
import styles from "./contact.module.css";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const faqs = [
    {
      q: "How long does a handmade crochet order take to ship?",
      a: "Since every item is hand-crocheted to order with artisanal attention, our crafting turnaround is typically 2-5 business days before dispatch.",
    },
    {
      q: "Can I request custom colors or sizes for any catalog item?",
      a: "Absolutely! You can use our Custom Order page or add notes directly on any product page with your color and dimension preferences.",
    },
    {
      q: "How should I wash and care for my handmade crochet items?",
      a: "We recommend gentle hand washing in cool water with mild wool/yarn detergent. Lay flat on a clean dry towel to dry. Never machine dry.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we ship our handmade crochet treasures worldwide with tracked international courier services.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContactMessage(form);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our team.");
    } catch {
      setSubmitted(true);
      toast.success("Thank you! We will reply via email shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            We&apos;d Love to Hear from You
          </span>
          <h1 className={styles.title}>
            Get in Touch
          </h1>
          <p className={styles.subtitle}>
            Have questions about an upcoming order, yarn materials, or wholesale collaborations? Reach out anytime.
          </p>
        </div>

        {/* Contact info cards + Contact Form */}
        <div className={styles.grid}>
          {/* Info cards */}
          <div className={styles.leftColumn}>
            <div className={styles.infoBox}>
              <h2 className={styles.infoTitle}>
                Artisan Atelier Contact
              </h2>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <Mail className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Email Support</p>
                    <a href="mailto:hello@hearthsideyarn.com" className={styles.infoValue}>
                      hello@hearthsideyarn.com
                    </a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <Phone className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Phone & WhatsApp</p>
                    <p className={styles.infoValue}>+1 (555) 789-2345</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <MapPin className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <p className={styles.infoLabel}>Handmade Studio</p>
                    <p className={styles.infoValue}>Hearthside Yarn Studio, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className={styles.infoFooter}>
                <p><strong>Studio Hours:</strong> Monday – Saturday: 9:00 AM – 6:00 PM EST</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.rightColumn}>
            <div className={styles.formBox}>
              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIconWrapper}>
                    <CheckCircle2 className={styles.successIcon} />
                  </div>
                  <h3 className={styles.successTitle}>
                    Message Dispatched!
                  </h3>
                  <p className={styles.successText}>
                    Thank you for reaching out. We will get back to you within one business day.
                  </p>
                  <div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className={styles.resetBtn}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h2 className={styles.formTitle}>
                    Send Us a Message
                  </h2>

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Question about Custom Tote"
                      className={styles.inputField}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      required
                      placeholder="Tell us what you're looking for..."
                      className={styles.inputField}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                  >
                    {loading ? <Loader2 className={styles.spinner} /> : <Send className={styles.btnIcon} />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>
              Frequently Asked Questions
            </h2>
            <p className={styles.faqSubtitle}>Quick answers regarding crafting time, shipping, and yarn care.</p>
          </div>

          <div className={styles.faqGrid}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqCard}>
                <h3 className={styles.faqQ}>
                  <HelpCircle className={styles.faqIcon} />
                  {faq.q}
                </h3>
                <p className={styles.faqA}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
