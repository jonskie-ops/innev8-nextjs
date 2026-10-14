"use client";

import { useEffect, useRef, useState } from "react";
import { isLightTheme, prefersReducedMotion, THEME_EVENT } from "@/lib/dom";
import { THEME_COLOR } from "@/lib/site";

function applyTheme(light: boolean) {
  const root = document.documentElement;
  if (light) root.dataset.theme = "light";
  else delete root.dataset.theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = light ? THEME_COLOR.light : THEME_COLOR.dark;
  try {
    localStorage.setItem("i8-theme", light ? "light" : "dark");
  } catch {}
  document.dispatchEvent(new Event(THEME_EVENT));
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Pixel-dissolve transition: a grid of cells floods out from (x, y) in the new background colour,
 * calls `swap` at full cover, then dissolves away to reveal the re-themed page.
 */
function pixelWipe(x: number, y: number, light: boolean, swap: () => void, done: () => void) {
  const w = innerWidth;
  const h = innerHeight;
  const canvas = document.createElement("canvas");
  canvas.className = "theme-fx";
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const cell = w < 700 ? 16 : 22;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const band = cell * 4.5;
  const reach = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + band + cell * 2;
  const dist = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dist[r * cols + c] =
        Math.hypot(c * cell + cell / 2 - x, r * cell + cell / 2 - y) + (Math.random() - 0.5) * cell * 3;

  const bg = light ? THEME_COLOR.light : THEME_COLOR.dark;
  const sparks = ["#12BFEA", "#087BE8", "#20C9BC", "#D6B56D", light ? "#0a3fb8" : "#8fe9ff"];
  const IN = 520;
  const HOLD = 90;
  const OUT = 620;
  let t0 = 0;
  let swapped = false;

  function frame(now: number) {
    if (!t0) t0 = now;
    const t = now - t0;
    ctx.clearRect(0, 0, w, h);
    const covering = t < IN + HOLD;
    if (t >= IN && !swapped) {
      swapped = true;
      swap();
    }
    const front = (covering ? ease(Math.min(1, t / IN)) : ease(Math.min(1, (t - IN - HOLD) / OUT))) * reach;

    for (let i = 0; i < dist.length; i++) {
      const d = dist[i];
      let fill: string | null;
      if (covering) fill = d < front - band ? bg : d < front ? sparks[(Math.random() * sparks.length) | 0] : null;
      else fill = d < front - band ? null : d < front ? sparks[(Math.random() * sparks.length) | 0] : bg;
      if (!fill) continue;
      const px = (i % cols) * cell;
      const py = ((i / cols) | 0) * cell;
      ctx.fillStyle = fill;
      if (fill === bg) ctx.fillRect(px, py, cell, cell);
      else {
        const s = Math.random() < 0.35 ? cell * 0.55 : cell - 2;
        ctx.fillRect(px + (cell - s) / 2, py + (cell - s) / 2, s, s);
      }
    }

    if (covering || t < IN + HOLD + OUT) requestAnimationFrame(frame);
    else {
      canvas.remove();
      done();
    }
  }
  requestAnimationFrame(frame);
}

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  const busy = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Sync with the theme the boot script applied before hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- theme lives on <html>, set pre-hydration
    setLight(isLightTheme());
    const onTheme = () => setLight(isLightTheme());
    document.addEventListener(THEME_EVENT, onTheme);
    return () => document.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  function toggle() {
    if (busy.current) return;
    const next = !isLightTheme();
    if (prefersReducedMotion()) {
      applyTheme(next);
      return;
    }
    busy.current = true;
    const r = btnRef.current!.getBoundingClientRect();
    pixelWipe(
      r.left + r.width / 2,
      r.top + r.height / 2,
      next,
      () => applyTheme(next),
      () => (busy.current = false),
    );
  }

  return (
    <button
      ref={btnRef}
      className="theme-toggle"
      type="button"
      data-theme-toggle=""
      aria-label="Light mode"
      aria-pressed={light}
      onClick={toggle}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <svg className="theme-toggle__moon" viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
        <svg className="theme-toggle__sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
        <span className="theme-toggle__knob"></span>
      </span>
    </button>
  );
}
