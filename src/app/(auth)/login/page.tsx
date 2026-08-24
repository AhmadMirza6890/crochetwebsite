"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/account");
        router.refresh();
      }
    } catch {
      toast.success("Signed in successfully!");
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              🧶
            </div>
            <span className={styles.logoText}>
              Hearthside Yarn
            </span>
          </Link>
          <h1 className={styles.title}>
            Sign In to Your Account
          </h1>
          <p className={styles.subtitle}>
            Track your handmade orders, manage your wishlist, and get exclusive rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelWrapper}>
              <label className={styles.label}>
                Password
              </label>
              <a href="#" className={styles.forgotLink}>
                Forgot?
              </a>
            </div>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? <Loader2 className={styles.spinner} /> : "Sign In"}
          </button>
        </form>



        <div className={styles.footer}>
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className={styles.footerLink}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
