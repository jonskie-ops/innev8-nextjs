"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { clamp, hasFinePointer, prefersReducedMotion, restartClass, storage } from "@/lib/dom";
import { flyTo, rainConfetti, sparkBurst } from "./effects";

const STORAGE_KEY = "i8-pixels-found";
export const TOTAL_PIXELS = 8;

const MILESTONES: Record<number, ReactNode> = {
  1: (
    <>
      First pixel! <b>7</b> more are hiding.
    </>
  ),
  2: "Two down. You have the eye.",
  4: (
    <>
      Halfway there. <b>4</b> to go.
    </>
  ),
  6: (
    <>
      Only <b>2</b> left. Look everywhere.
    </>
  ),
  7: "One more. It is somewhere on this page.",
};

type Hunt = {
  /** Pixels collected and done animating (hidden on the page, lit in the HUD). */
  found: ReadonlySet<string>;
  collect: (id: string, el: HTMLElement) => void;
  start: () => void;
};

const HuntContext = createContext<Hunt | null>(null);

export function useHunt() {
  const ctx = useContext(HuntContext);
  if (!ctx) throw new Error("useHunt must be used inside <HuntProvider>");
  return ctx;
}

/** Holds the hidden-pixel game state and renders its HUD, toast and win dialog. */
export function HuntProvider({ children }: { children: ReactNode }) {
  // `claimed` updates on click (and is persisted); `found` updates once the fly-in animation lands.
  const claimed = useRef(new Set<string>());
  const [found, setFound] = useState<ReadonlySet<string>>(new Set());
  const [hudShown, setHudShown] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: ReactNode; on: boolean }>({ msg: null, on: false });
  const toastTimer = useRef(0);
  const hudBtn = useRef<HTMLButtonElement>(null);
  const gridCells = useRef<(HTMLElement | null)[]>([]);
  const winRef = useRef<HTMLDialogElement>(null);

  const showToast = useCallback((msg: ReactNode, ms = 3200) => {
    setToast({ msg, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), ms);
  }, []);

  const win = useCallback(() => {
    const reduced = prefersReducedMotion();
    if (!reduced) rainConfetti();
    const dialog = winRef.current;
    if (dialog && typeof dialog.showModal === "function") setTimeout(() => dialog.showModal(), reduced ? 0 : 500);
    else showToast("All 8 found. You've got the hunter's instinct!", 6000);
  }, [showToast]);

  const collect = useCallback(
    (id: string, el: HTMLElement) => {
      if (claimed.current.has(id)) return;
      claimed.current.add(id);
      storage.set(STORAGE_KEY, [...claimed.current]);
      setHudShown(true);

      const reduced = prefersReducedMotion();
      const r = el.getBoundingClientRect();
      if (!reduced) sparkBurst(r.left + r.width / 2, r.top + r.height / 2);

      const target = gridCells.current[Math.min(claimed.current.size, TOTAL_PIXELS) - 1] ?? hudBtn.current;
      const land = () => {
        setFound(new Set(claimed.current));
        if (hudBtn.current) restartClass(hudBtn.current, "bump");
        const n = claimed.current.size;
        if (n >= TOTAL_PIXELS) win();
        else
          showToast(
            MILESTONES[n] ?? (
              <>
                Pixel{" "}
                <b>
                  {n}/{TOTAL_PIXELS}
                </b>{" "}
                collected.
              </>
            ),
          );
      };
      if (reduced || !target) land();
      else flyTo(el, target, land);
    },
    [showToast, win],
  );

  const start = useCallback(() => {
    setHudShown(true);
    restartClass(document.documentElement, "hunt-on");
    setTimeout(() => document.documentElement.classList.remove("hunt-on"), 4000);
    const left = TOTAL_PIXELS - claimed.current.size;
    showToast(
      left ? (
        <>
          <b>{left}</b> pixel{left > 1 ? "s" : ""} hidden on this page. They glow when you get close.
        </>
      ) : (
        "You already found all 8. Reset the hunt from the counter."
      ),
      4500,
    );
  }, [showToast]);

  const reset = () => {
    claimed.current = new Set();
    storage.set(STORAGE_KEY, []);
    setFound(new Set());
    setPanelOpen(false);
    showToast("Hunt reset. 8 pixels are back in hiding.");
  };

  // Restore progress; reveal the HUD once the hunt section is in view.
  useEffect(() => {
    const saved = storage.get<string[]>(STORAGE_KEY, []);
    claimed.current = new Set(saved);
    if (saved.length) {
      setFound(new Set(saved)); // eslint-disable-line react-hooks/set-state-in-effect -- localStorage is client-only
      setHudShown(true);
    }
    const section = document.getElementById("hunt");
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setHudShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Pixels glow as the pointer gets close (desktop only).
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    let pending = false;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        for (const px of document.querySelectorAll<HTMLElement>(".px")) {
          if (px.hidden) continue;
          const r = px.getBoundingClientRect();
          if (r.bottom < -200 || r.top > innerHeight + 200) continue;
          const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
          px.style.setProperty("--near", clamp(1 - d / 170).toFixed(2));
        }
      });
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <HuntContext.Provider value={{ found, collect, start }}>
      {children}

      <div className="hud" data-hud="" hidden={!hudShown}>
        <button
          ref={hudBtn}
          className="hud__btn"
          type="button"
          data-hud-toggle=""
          aria-expanded={panelOpen}
          aria-controls="hud-panel"
          onClick={() => setPanelOpen((o) => !o)}
        >
          <span className="hud__grid" aria-hidden="true">
            {Array.from({ length: TOTAL_PIXELS }, (_, i) => (
              <i
                key={i}
                ref={(el) => {
                  gridCells.current[i] = el;
                }}
                className={i < found.size ? "on" : undefined}
              ></i>
            ))}
          </span>
          <span className="hud__count">
            <b data-hud-count="">{found.size}</b>/{TOTAL_PIXELS}
          </span>{" "}
          <span className="hud__label">pixels</span>
        </button>
        <div className="hud__panel" id="hud-panel" hidden={!panelOpen}>
          <p>
            <strong>Pixel hunt.</strong> 8 pixels are hidden across this page. They glow when you get close. Tap one to
            collect it.
          </p>
          <button className="hud__reset" type="button" data-hunt-reset="" onClick={reset}>
            Reset hunt
          </button>
        </div>
      </div>

      <div className={toast.on ? "toast is-on" : "toast"} data-toast="" role="status" aria-live="polite">
        {toast.msg}
      </div>

      <dialog
        className="win"
        data-win=""
        aria-labelledby="win-title"
        ref={winRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="win__body">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            className="win__emblem on-dark"
            src="/assets/img/logo/innev8-emblem-reversed.svg"
            alt=""
            width={64}
            height={99}
          />
          <img
            className="win__emblem on-light"
            src="/assets/img/logo/innev8-emblem.svg"
            alt=""
            width={64}
            height={99}
            loading="lazy"
          />
          {/* eslint-enable @next/next/no-img-element */}
          <div className="win__grid" aria-hidden="true">
            {Array.from({ length: TOTAL_PIXELS }, (_, i) => (
              <i key={i}></i>
            ))}
          </div>
          <p className="eyebrow">Hunt complete · 8/8</p>
          <h2 id="win-title">
            You&apos;ve got the <span className="grad">hunter&apos;s instinct.</span>
          </h2>
          <p>That was the warm-up. The real AR Treasure Hunt goes live at the summit, November 20–21. Bring your phone.</p>
          <div className="win__btns">
            <a className="btn btn--primary" href="#save" data-win-close="" onClick={() => winRef.current?.close()}>
              Save the date
            </a>
            <button className="btn btn--ghost" type="button" data-win-close="" onClick={() => winRef.current?.close()}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </HuntContext.Provider>
  );
}
