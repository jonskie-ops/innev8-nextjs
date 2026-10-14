"use client";
/* eslint-disable @next/next/no-img-element -- light/dark logo swap is done in CSS */

import { useEffect, useRef, useState } from "react";
import { clamp, prefersReducedMotion, READY_EVENT } from "@/lib/dom";
import { IntroEmblem } from "./graphics";

const MIN_MS = 2100; // intro runs at least this long
const MAX_MS = 3600; // give up waiting for the hero photo after this

/** Marks the page ready: starts hero animations and notifies listeners (e.g. the hero network canvas). */
function markReady() {
  const root = document.documentElement;
  root.classList.add("is-ready");
  document.querySelectorAll(".hero [data-split], .hero .reveal").forEach((el) => el.classList.add("is-in"));
  document.dispatchEvent(new Event(READY_EVENT));
}

export function Intro() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion() || root.classList.contains("no-intro")) {
      setGone(true); // eslint-disable-line react-hooks/set-state-in-effect -- depends on client-only state
      markReady();
      return;
    }

    const intro = rootRef.current!;
    const photo = document.querySelector<HTMLImageElement>(".hero__photo");
    const start = performance.now();
    const timers: number[] = [];
    let done = false;
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      intro.classList.add("is-out");
      root.classList.add("intro-played");
      try {
        sessionStorage.setItem("i8-intro", "1");
      } catch {}
      timers.push(window.setTimeout(markReady, 280), window.setTimeout(() => setGone(true), 1400));
    };

    const tick = (now: number) => {
      if (done) return;
      const p = clamp((now - start) / MIN_MS);
      const photoReady = !photo || (photo.complete && photo.naturalWidth > 0);
      if ((p >= 1 && photoReady) || now - start > MAX_MS) finish();
      else raf = requestAnimationFrame(tick);
    };

    intro.addEventListener("click", finish);
    addEventListener("keydown", finish, { once: true });
    raf = requestAnimationFrame(tick);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      intro.removeEventListener("click", finish);
      removeEventListener("keydown", finish);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="intro" aria-hidden="true" ref={rootRef}>
      <div className="intro__stage">
        <div className="intro__mark">
          <IntroEmblem />
        </div>
        <img
          className="intro__wordmark on-dark"
          src="/assets/img/logo/innev8-wordmark-reversed.svg"
          alt=""
          width={460}
          height={140}
        />
        <img
          className="intro__wordmark on-light"
          src="/assets/img/logo/innev8-wordmark.svg"
          alt=""
          width={460}
          height={140}
        />
      </div>
      <div className="intro__curtain"></div>
    </div>
  );
}
