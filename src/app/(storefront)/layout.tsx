import { getSiteSettings, getThemeSettings } from "@/lib/actions/settings";
import { StorefrontNavbar } from "@/components/storefront/navbar";
import { StorefrontFooter } from "@/components/storefront/footer";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ThemeProvider } from "@/components/storefront/theme-toggle";
import { ScrollToTop } from "@/components/storefront/scroll-to-top";
import { LiveVisitorCount } from "@/components/storefront/live-visitor-count";
import { SalesPopup } from "@/components/storefront/sales-popup";
import { StorefrontAutoRefresh } from "@/components/storefront/auto-refresh";
import { SessionProvider } from "next-auth/react";
import styles from "./layout.module.css";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, theme] = await Promise.all([
    getSiteSettings(),
    getThemeSettings(),
  ]);

  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
          {/* Inject theme CSS variables from database */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  --color-primary: ${theme?.primaryColor || "#E11D48"};
                  --color-secondary: ${theme?.secondaryColor || "#F472B6"};
                  --color-accent: ${theme?.accentColor || "#FB7185"};
                  --color-background: ${theme?.backgroundColor || "#FFF5F7"};
                  --color-foreground: ${theme?.textColor || "#3B0718"};
                  --color-muted-foreground: ${theme?.mutedColor || "#9D4A66"};
                  --font-heading: '${theme?.headingFont || "Playfair Display"}', serif;
                  --font-body: '${theme?.bodyFont || "Inter"}', sans-serif;
                  --radius: ${theme?.borderRadius || "1.25rem"};
                }
              `,
            }}
          />
          <AnnouncementBar settings={settings} />
          <StorefrontNavbar settings={settings} />
          <main className={styles.mainContent}>{children}</main>
          <StorefrontFooter settings={settings} />
          <ScrollToTop />
          <LiveVisitorCount />
          <SalesPopup />
          <StorefrontAutoRefresh />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
