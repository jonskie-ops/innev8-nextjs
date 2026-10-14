"use client";

import { useEffect, useRef } from "react";
import { clamp, hasFinePointer, isLightTheme, prefersReducedMotion, READY_EVENT, THEME_EVENT } from "@/lib/dom";

const PALETTES = {
  dark: { line: "18,191,234", lineA: 0.32, hot: "143,233,255", node: "rgba(143,233,255,.85)", sq: "rgba(32,201,188,.85)" },
  light: { line: "8,123,232", lineA: 0.3, hot: "10,79,214", node: "rgba(16,42,114,.55)", sq: "rgba(12,150,142,.75)" },
};

type Node = { x: number; y: number; vx: number; vy: number; r: number; sq: boolean };

/** Drifting node network behind the hero; nodes are drawn toward and linked to the pointer. */
export function HeroNet() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const hero = canvas.closest<HTMLElement>(".hero")!;
    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let started = false;
    let palette = PALETTES[isLightTheme() ? "light" : "dark"];
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(clamp((w * h) / 20000, 22, 78));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
        sq: Math.random() < 0.14,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const maxD = Math.min(160, w / 6);
      const maxD2 = maxD * maxD;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        if (dx * dx + dy * dy < 40000) {
          n.x += dx * 0.006;
          n.y += dy * 0.006;
        }
      }
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            ctx.strokeStyle = `rgba(${palette.line},${(1 - Math.sqrt(d2) / maxD) * palette.lineA})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mx = pointer.x - a.x;
        const my = pointer.y - a.y;
        const md2 = mx * mx + my * my;
        if (md2 < 48400) {
          ctx.strokeStyle = `rgba(${palette.hot},${(1 - Math.sqrt(md2) / 220) * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        if (n.sq) {
          ctx.fillStyle = palette.sq;
          ctx.fillRect(n.x - 2.5, n.y - 2.5, 5, 5);
        } else {
          ctx.fillStyle = palette.node;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, 6.283);
          ctx.fill();
        }
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (started && !running && visible && !document.hidden && !reduced) {
        running = true;
        loop();
      }
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function start() {
      if (started) return;
      started = true;
      resize();
      if (reduced) draw();
      else play();
    }
    if (document.documentElement.classList.contains("is-ready")) start();
    document.addEventListener(READY_EVENT, start);

    const onTheme = () => {
      palette = PALETTES[isLightTheme() ? "light" : "dark"];
      if (reduced && started) draw();
    };
    document.addEventListener(THEME_EVENT, onTheme);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!started) return;
        resize();
        if (reduced) draw();
      }, 150);
    };
    addEventListener("resize", onResize);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    // Spotlight + pointer attraction, desktop only.
    let pending = false;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const hr = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", cx - hr.left + "px");
        hero.style.setProperty("--my", cy - hr.top + "px");
        const cr = canvas.getBoundingClientRect();
        pointer.x = cx - cr.left;
        pointer.y = cy - cr.top;
      });
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const fine = hasFinePointer();
    if (fine) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }

    return () => {
      pause();
      clearTimeout(resizeTimer);
      io.disconnect();
      document.removeEventListener(READY_EVENT, start);
      document.removeEventListener(THEME_EVENT, onTheme);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("resize", onResize);
      if (fine) {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return <canvas className="hero__net" data-net="" ref={ref}></canvas>;
}
