"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";

export function CapacitorBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handler: Promise<PluginListenerHandle> | null = null;

    const setup = async () => {
      handler = App.addListener("backButton", () => {
        // Close any open overlay/dialog/menu first if present.
        const openOverlay = document.querySelector(
          '[data-state="open"], [role="dialog"][data-open="true"]'
        );
        if (openOverlay) {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
          );
          return;
        }

        // Navigate back within the app if we have history, otherwise exit.
        if (window.history.length > 1) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    };

    setup();

    return () => {
      handler?.then((handle) => handle.remove()).catch(() => {});
    };
  }, []);

  return null;
}
