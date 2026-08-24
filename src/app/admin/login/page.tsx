"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Lock, Mail, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import styles from "./admin-login.module.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@crochetstore.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid administrator credentials");
        setLoading(false);
        return;
      }

      toast.success("Welcome to the Admin Dashboard!");
      window.location.assign("/admin/dashboard");
    } catch {
      toast.error("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.logo}>
            HBJ
          </div>
          <h1 className={styles.title}>
            Atelier CMS Portal
          </h1>
          <p className={styles.subtitle}>
            Secure administrator login to manage products, orders, theme & CMS
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Admin Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Admin Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? <Loader2 className={styles.spinner} /> : "Access Dashboard"}
          </button>
        </form>

        <div className={styles.alertBox}>
          <ShieldAlert className={styles.alertIcon} />
          <span>Default credentials pre-filled for immediate testing. Change in settings anytime.</span>
        </div>

        <div className={styles.footer}>
          <Link href="/" className={styles.footerLink}>
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
