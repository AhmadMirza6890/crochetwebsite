"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const offline = typeof navigator !== "undefined" && !navigator.onLine;

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
          background: "#fff",
          border: "1px solid #f3d9e1",
          borderRadius: 20,
          padding: "32px 24px",
          boxShadow: "0 10px 30px rgba(225,29,72,0.08)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
            color: "#E11D48",
            background: "#fde7ee",
            padding: "8px 14px",
            borderRadius: 999,
            marginBottom: 16,
          }}
        >
          {offline ? "You're offline" : "Something went wrong"}
        </div>
        <h1 style={{ fontSize: "1.4rem", margin: "0 0 8px", color: "#3B0718" }}>
          {offline
            ? "We couldn't load this page"
            : "This page couldn't be loaded"}
        </h1>
        <p style={{ lineHeight: 1.5, color: "#7a4a5c", margin: "0 0 20px" }}>
          {offline
            ? "You're offline. Some content may be unavailable until your connection returns."
            : "Please try again. If the problem continues, check your connection."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              fontWeight: 600,
              color: "#fff",
              background: "#E11D48",
              border: "none",
              padding: "12px 22px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              fontWeight: 600,
              color: "#E11D48",
              background: "#fff",
              border: "1px solid #f3d9e1",
              padding: "12px 22px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
