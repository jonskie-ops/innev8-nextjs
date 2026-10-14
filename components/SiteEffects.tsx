"use client";

import { useEffect } from "react";
import { clamp, hasFinePointer, prefersReducedMotion } from "@/lib/dom";

type Cleanup = () => void;
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

/**
 * Page-wide motion that decorates server-rendered markup: scroll reveals, the scroll-driven
 * manifesto and parallax, nav behaviour, card tilt and magnetic buttons. Renders nothing.
 */
export function SiteEffects() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fine = hasFinePointer() && !reduced;
    const cleanups: Cleanup[] = [
      setupReveals(reduced),
      setupScroll(reduced),
      setupActiveNav(),
      setupFinale(reduced),
    ];
    if (fine) cleanups.push(setupTilt(), setupMagnetic());
    return () => cleanups.forEach((fn) => fn());
  }, []);
  return null;
}

/** Fade/slide elements in as they enter the viewport. Hero items are revealed by the intro instead. */
function setupReveals(reduced: boolean): Cleanup {
  const timers: number[] = [];
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("is-in");
        io.unobserve(el);
        if (el.matches(".card")) {
          timers.push(window.setTimeout(() => el.classList.add("is-settled"), 1300));
          const title = el.querySelector<HTMLElement>("[data-scramble]");
          if (title) timers.push(window.setTimeout(() => timers.push(scramble(title, reduced)), 250));
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
  );
  for (const el of $$(".reveal, .finale [data-split]")) if (!el.closest(".hero")) io.observe(el);
  if (reduced) for (const el of $$(".reveal, [data-split]")) el.classList.add("is-in");
  return () => {
    io.disconnect();
    timers.forEach((t) => (clearTimeout(t), clearInterval(t)));
  };
}

/** Decodes a heading from random glyphs into its real text. Returns the interval id. */
function scramble(el: HTMLElement, reduced: boolean): number {
  const text = el.dataset.final || el.textContent || "";
  el.dataset.final = text;
  el.setAttribute("aria-label", text);
  if (reduced) return 0;
  const glyphs = "01<>/#*+=_▮▯";
  const frames = 28;
  let frame = 0;
  const id = window.setInterval(() => {
    frame++;
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const settleAt = 5 + Math.floor((i / text.length) * frames * 0.75);
      out += text[i] === " " || frame >= settleAt ? text[i] : glyphs[(Math.random() * glyphs.length) | 0];
    }
    el.textContent = out;
    if (frame >= frames) {
      clearInterval(id);
      el.textContent = text;
    }
  }, 38);
  return id;
}

/** How far an element has travelled through the viewport: 0 entering at the bottom, 1 leaving at the top. */
function viewportProgress(el: Element) {
  const r = el.getBoundingClientRect();
  return clamp((innerHeight - r.top) / (innerHeight + r.height));
}

function setupScroll(reduced: boolean): Cleanup {
  const nav = $("[data-nav]");
  const manifesto = $("[data-manifesto]");
  const words = $$(".manifesto .w");
  const pano = $$<SVGElement>(".pano");
  const spark = $<SVGCircleElement>(".pano__spark");
  const countdownMedia = $(".countdown__media");
  const venueMedia = $(".venue__media");
  const marquee = $(".marquee");
  const track = $(".marquee__track");

  let lastY = scrollY;
  let velocity = 0; // scroll velocity, drives the marquee skew
  let queued = false;

  function update() {
    queued = false;
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;

    nav?.classList.toggle("is-hidden", dy > 0 && y > 320);

    if (manifesto) {
      const r = manifesto.getBoundingClientRect();
      const p = reduced ? 1 : clamp(-r.top / (manifesto.offsetHeight - innerHeight));
      const lit = Math.floor(clamp(p / 0.7) * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      for (const path of pano) {
        const from = Number(path.dataset.from);
        const to = Number(path.dataset.to);
        const k = clamp((p - from) / (to - from));
        if (path.classList.contains("pano--piers")) path.style.opacity = String(k);
        else path.style.strokeDashoffset = String(1 - k);
      }
      if (spark) {
        spark.setAttribute("cx", (clamp(p / 0.35) * 1600).toFixed(1));
        spark.style.opacity = p > 0.01 && p < 0.36 ? "1" : "0";
      }
    }

    if (!reduced) {
      countdownMedia?.style.setProperty("--z", (1.04 + viewportProgress(countdownMedia) * 0.28).toFixed(4));
      venueMedia?.style.setProperty("--py", ((viewportProgress(venueMedia) - 0.5) * -120).toFixed(1) + "px");
      velocity = clamp(velocity + dy * -0.06, -10, 10);
    }
  }

  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", update);
  update();

  // Marquee skews and speeds up with scroll velocity, easing back when scrolling stops.
  let raf = 0;
  let io: IntersectionObserver | undefined;
  if (marquee && track && !reduced) {
    const anim = track.getAnimations?.()[0];
    let inView = false;
    let applied: number | null = null;
    io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(marquee);
    const loop = () => {
      velocity *= 0.9;
      if (Math.abs(velocity) < 0.01) velocity = 0;
      if (inView && velocity !== applied) {
        applied = velocity;
        marquee.style.setProperty("--skew", velocity.toFixed(2) + "deg");
        if (anim) anim.playbackRate = 1 + Math.abs(velocity) * 0.35;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
  }

  return () => {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", update);
    cancelAnimationFrame(raf);
    io?.disconnect();
  };
}

/** Highlight the nav link for the section in the middle of the viewport. */
function setupActiveNav(): Cleanup {
  const links = $$<HTMLAnchorElement>(".nav__links a");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links) a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  for (const a of links) {
    const target = $(a.getAttribute("href")!);
    if (target) io.observe(target);
  }
  return () => io.disconnect();
}

/** The finale backdrop animates only while on screen. */
function setupFinale(reduced: boolean): Cleanup {
  const finale = $("[data-finale]");
  if (!finale) return () => {};
  if (reduced) finale.classList.add("is-live");
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.2) finale.classList.add("is-live");
      finale.classList.toggle("is-playing", e.isIntersecting && !reduced);
    },
    { threshold: [0, 0.2] },
  );
  io.observe(finale);
  return () => io.disconnect();
}

/** Bind pointermove/pointerleave on every element matching `sel`. */
function onPointer(sel: string, move: (el: HTMLElement, e: PointerEvent) => void, leave: (el: HTMLElement) => void) {
  const offs = $$(sel).map((el) => {
    const m = (e: PointerEvent) => move(el, e);
    const l = () => leave(el);
    el.addEventListener("pointermove", m);
    el.addEventListener("pointerleave", l);
    return () => {
      el.removeEventListener("pointermove", m);
      el.removeEventListener("pointerleave", l);
    };
  });
  return () => offs.forEach((off) => off());
}

function setupTilt(): Cleanup {
  return onPointer(
    "[data-tilt]",
    (el, e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--px", x * 100 + "%");
      el.style.setProperty("--py", y * 100 + "%");
      el.style.setProperty("--ry", ((x - 0.5) * 9).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - y) * 9).toFixed(2) + "deg");
    },
    (el) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    },
  );
}

function setupMagnetic(): Cleanup {
  return onPointer(
    "[data-magnetic]",
    (el, e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
      el.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
    },
    (el) => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    },
  );
}
