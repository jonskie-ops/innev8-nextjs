import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { DESCRIPTION, OG_IMAGE_ALT, SHARE_DESCRIPTION, SHARE_TITLE, SITE_URL, THEME_COLOR, TITLE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "INNEV8 ICT Federation" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { canonical: "/" },
  other: { "geo.region": "PH-LEY", "geo.placename": "Palo, Leyte, Philippines" },
  icons: {
    icon: [
      { url: "/assets/img/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/img/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/img/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "INNEV8 ICT Federation",
    locale: "en_PH",
    url: "/",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [{ url: "/assets/img/og-image.jpg", width: 1200, height: 630, type: "image/jpeg", alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [{ url: "/assets/img/og-image.jpg", alt: OG_IMAGE_ALT }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR.dark,
};

// Runs during HTML parsing, before first paint: enables JS-only styles, skips the intro on
// repeat visits this session, and applies a saved light theme (or ?theme=light).
const BOOT_SCRIPT = `document.documentElement.classList.add("js");try{sessionStorage.getItem("i8-intro")&&document.documentElement.classList.add("no-intro");var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("i8-theme");if(t==="light"){document.documentElement.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${THEME_COLOR.light}"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  preload("/assets/fonts/montserrat-var.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  preload("/assets/fonts/poppins-400.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  preload("/assets/img/hero-2400.webp", { as: "image", fetchPriority: "high" });

  return (
    <html lang="en-PH" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
