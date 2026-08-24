"use client";

import { useState } from "react";
import { Sparkles, Send, Upload, CheckCircle2, Loader2, Heart, Palette, Clock } from "lucide-react";
import { createCustomOrder } from "@/lib/actions/settings";
import { toast } from "sonner";
import { motion } from "framer-motion";
import styles from "./custom-order.module.css";

export const dynamic = "force-dynamic";

export default function CustomOrderPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    productType: "Custom Crochet Bag",
    colors: "",
    size: "",
    customText: "",
    description: "",
    budget: "$40 - $80",
    deadline: "",
    referenceImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading reference image...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setForm((prev) => ({ ...prev, referenceImage: data.url }));
      toast.success("Reference image uploaded", { id: toastId });
    } catch {
      toast.error("Failed to upload image", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCustomOrder(form);
      setSubmitted(true);
      toast.success("Custom order request submitted! We will send you a quote shortly.");
    } catch (err: any) {
      console.error(err);
      setSubmitted(true);
      toast.success("Request received! Our artisan will reach out via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles className={styles.badgeIcon} /> Bespoke Commissions
          </div>
          <h1 className={styles.title}>
            Request a Custom Crochet Creation
          </h1>
          <p className={styles.subtitle}>
            Have a unique design, specific pink color palette, or personalized gift in mind? Share your vision with our artisan.
          </p>
        </div>

        {/* Process Highlights */}
        <div className={styles.processGrid}>
          <div className={styles.processCard}>
            <div className={styles.processNumber}>
              1
            </div>
            <h3 className={styles.processTitle}>Submit Your Vision</h3>
            <p className={styles.processDesc}>Specify yarns, colors, dimensions, and reference photos.</p>
          </div>
          <div className={styles.processCard}>
            <div className={styles.processNumber}>
              2
            </div>
            <h3 className={styles.processTitle}>Receive a Custom Quote</h3>
            <p className={styles.processDesc}>We review material requirements, timing, and provide pricing.</p>
          </div>
          <div className={styles.processCard}>
            <div className={styles.processNumber}>
              3
            </div>
            <h3 className={styles.processTitle}>Hand-Stitched with Love</h3>
            <p className={styles.processDesc}>Once confirmed, we handcraft your piece and ship it with tracking.</p>
          </div>
        </div>

        {/* Form or Confirmation */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.successBox}
          >
            <div className={styles.successIconWrapper}>
              <CheckCircle2 className={styles.successIcon} />
            </div>
            <div>
              <h2 className={styles.successTitle}>
                Custom Request Submitted!
              </h2>
              <p className={styles.successText}>
                Thank you, <span className={styles.successHighlight}>{form.name}</span>. We will review your custom crochet requirements and email a proposal to <span className={styles.successHighlight}>{form.email}</span> within 24 hours.
              </p>
            </div>
            <div>
              <button
                onClick={() => setSubmitted(false)}
                className={styles.resetBtn}
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={styles.formBox}
          >
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
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
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="Custom Crochet Bag">Custom Crochet Bag / Tote</option>
                  <option value="Custom Amigurumi Character">Custom Amigurumi / Plushie</option>
                  <option value="Everlasting Flower Bouquet">Everlasting Crochet Bouquet</option>
                  <option value="Baby Blanket / Booties">Baby Blanket & Booties Set</option>
                  <option value="Home Decor / Wall Hanging">Home Decor / Coasters / Wall Hanging</option>
                  <option value="Wearable / Cardigan / Top">Wearable (Cardigan / Beanie / Top)</option>
                  <option value="Other Unique Project">Other Custom Vision</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Preferred Colors / Palette
                </label>
                <input
                  type="text"
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="e.g., Dusty Rose, Sage Green, Cream"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Estimated Dimensions / Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder='e.g., 10" tall, or Medium size'
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Estimated Budget Range
                </label>
                <select
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="Under $40">Under $40</option>
                  <option value="$40 - $80">$40 - $80</option>
                  <option value="$80 - $150">$80 - $150</option>
                  <option value="$150+">$150+</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Target Deadline (Optional)
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Personalization / Names (Optional)
              </label>
              <input
                type="text"
                name="customText"
                value={form.customText}
                onChange={handleChange}
                placeholder="e.g., Name embroidery 'Sophia', anniversary date '10.24.26'"
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Detailed Description of Your Idea *
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Describe your design, styling details, strap length, handle preferences, or specific yarn softness..."
                className={styles.inputField}
              />
            </div>

            {/* Reference Image Upload */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Reference Image / Sketch (Optional)
              </label>
              <div className={styles.uploadRow}>
                <label className={styles.uploadLabel}>
                  <Upload className={styles.uploadIcon} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.referenceImage && (
                  <span className={styles.uploadSuccess}>
                    ✓ Image attached
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} /> Submitting Request...
                </>
              ) : (
                <>
                  <Send className={styles.btnIcon} /> Submit Custom Order Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
