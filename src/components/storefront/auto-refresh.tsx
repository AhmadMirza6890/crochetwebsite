"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function StorefrontAutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let inFlight = false;

    const refresh = async () => {
      if (document.hidden || inFlight) return;
      inFlight = true;
      try {
        await router.refresh();
      } finally {
        inFlight = false;
      }
    };

    const onVisibility = () => {
      if (!document.hidden) refresh();
    };

    window.addEventListener("focus", onVisibility);
    document.addEventListener("visibilitychange", onVisibility);
    const id = setInterval(refresh, intervalMs);

    return () => {
      window.removeEventListener("focus", onVisibility);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(id);
    };
  }, [router, intervalMs]);

  return null;
}
