"use client";

import { useHunt } from "./HuntProvider";

export function HuntStartButton() {
  const { start } = useHunt();
  return (
    <button className="btn btn--primary" type="button" data-hunt-start="" data-magnetic="" onClick={start}>
      Start the hunt
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}
