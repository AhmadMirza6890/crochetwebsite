"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Capacitor } from "@capacitor/core";

type OfflineContextValue = {
  isOffline: boolean;
};

const OfflineContext = createContext<OfflineContextValue>({ isOffline: false });

export function useOffline() {
  return useContext(OfflineContext);
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Register the service worker (native app only, production build only).
  useEffect(() => {
    setMounted(true);
    const update = () => setIsOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (
      !Capacitor.isNativePlatform() ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    if (!("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      {children}
      {mounted && isOffline && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "999px",
            background: "rgba(59,7,24,0.92)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            pointerEvents: "none",
            maxWidth: "90vw",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#fb7185",
              display: "inline-block",
            }}
          />
          You're offline. Some features need internet.
        </div>
      )}
    </OfflineContext.Provider>
  );
}
