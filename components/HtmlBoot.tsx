"use client";

import { useLayoutEffect } from "react";
import { THEME_COLOR } from "@/lib/site";

/**
 * Mirrors the inline boot script in app/layout.tsx. In production this is a no-op; in development,
 * Strict Mode's remount resets <html> attributes, so they are re-applied here before paint.
 * It also syncs <meta name="theme-color">, which may stream in after the boot script ran.
 */
export function HtmlBoot() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    try {
      if (sessionStorage.getItem("i8-intro")) root.classList.add("no-intro");
      const t = new URLSearchParams(location.search).get("theme") || localStorage.getItem("i8-theme");
      if (t === "light") root.dataset.theme = "light";
    } catch {}
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = root.dataset.theme === "light" ? THEME_COLOR.light : THEME_COLOR.dark;
  }, []);
  return null;
}
