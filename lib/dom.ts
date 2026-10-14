export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const pad2 = (n: number) => String(n).padStart(2, "0");

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Fired on `document` once the intro finishes and the hero should animate in. */
export const READY_EVENT = "i8:ready";
/** Fired on `document` whenever the colour theme changes. */
export const THEME_EVENT = "i8:theme";

export const isLightTheme = () => document.documentElement.dataset.theme === "light";

/** Restart a CSS animation class by removing it, forcing reflow, and adding it back. */
export function restartClass(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
