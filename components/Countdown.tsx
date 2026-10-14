"use client";

import { Fragment, useEffect, useState } from "react";
import { pad2, prefersReducedMotion } from "@/lib/dom";
import { EVENT_END, EVENT_START } from "@/lib/site";
import { Pixel } from "./hunt/Pixel";

const DAY = 86_400_000;

type Clock = { d: string; h: string; m: string; s: string; daysLeft: string; phase: "before" | "live" | "after" };

function readClock(now: number): Clock {
  const left = EVENT_START.getTime() - now;
  if (left <= 0) {
    return { d: "00", h: "00", m: "00", s: "00", daysLeft: "00", phase: now > EVENT_END.getTime() ? "after" : "live" };
  }
  return {
    d: pad2(Math.floor(left / DAY)),
    h: pad2(Math.floor(left / 3_600_000) % 24),
    m: pad2(Math.floor(left / 60_000) % 60),
    s: pad2(Math.floor(left / 1000) % 60),
    daysLeft: pad2(Math.ceil(left / DAY)),
    phase: "before",
  };
}

/** Ticks once per second, aligned to the wall-clock second. Null until mounted (avoids hydration mismatch). */
function useClock() {
  const [clock, setClock] = useState<Clock | null>(null);
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = Date.now();
      const c = readClock(now);
      setClock(c);
      if (c.phase === "before") timer = window.setTimeout(tick, 1000 - (now % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);
  return clock;
}

/** The big "40 days to go" stat in the hero. */
export function DaysLeft() {
  const clock = useClock();
  return <strong data-days-left="">{clock ? clock.daysLeft : "40"}</strong>;
}

const UNITS = [
  { key: "d", label: "Days" },
  { key: "h", label: "Hours" },
  { key: "m", label: "Minutes" },
  { key: "s", label: "Seconds" },
] as const;

export function CountdownClock() {
  const clock = useClock();
  const [animate, setAnimate] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- media query is client-only
  useEffect(() => setAnimate(!prefersReducedMotion()), []);

  return (
    <>
      <div className="clock reveal" role="timer" aria-label="Time until the summit begins" data-clock="">
        {UNITS.map(({ key, label }, i) => {
          const value = clock ? clock[key] : "00";
          return (
            <Fragment key={key}>
              {i > 0 && (
                <span className="clock__sep" aria-hidden="true">
                  :
                </span>
              )}
              <div className="clock__cell">
                {/* Re-keying on each new value remounts the span, replaying the CSS tick animation. */}
                <span
                  key={value}
                  className={animate && clock ? "clock__num tick" : "clock__num"}
                  data-unit={key}
                >
                  {value}
                </span>
                <span className="clock__lbl">
                  {label}
                  {key === "s" && <Pixel id="5" inline />}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
      <p className="countdown__live" data-clock-live="" hidden={!clock || clock.phase === "before"}>
        {clock?.phase === "after"
          ? "That's a wrap. Thank you, Eastern Visayas."
          : "It's happening. Welcome to the Regional ICT Summit 2026."}
      </p>
    </>
  );
}
