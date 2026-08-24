import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hearthside Yarn | Premium Crochet Creations",
    template: "%s | Hearthside Yarn",
  },
  description:
    "Discover unique handmade crochet pieces crafted with love. Premium crochet bags, amigurumi, home decor, baby items, and custom creations.",
  keywords: [
    "crochet",
    "handmade",
    "amigurumi",
    "crochet bags",
    "handmade gifts",
    "custom crochet",
    "crochet home decor",
  ],
  authors: [{ name: "Hearthside Yarn" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hearthside Yarn",
    title: "Hearthside Yarn | Premium Crochet Creations",
    description:
      "Discover unique handmade crochet pieces crafted with love.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-body antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-card)",
              color: "var(--color-card-foreground)",
              border: "1px solid var(--color-border)",
            },
          }}
        />
      </body>
    </html>
  );
}
