"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useHunt } from "./HuntProvider";

type Props = {
  /** "1"–"8"; also sets the glow stagger. Persisted in localStorage, so keep ids stable. */
  id: string;
  /** Sits in the text flow instead of being absolutely positioned. */
  inline?: boolean;
  /** Absolute position within the nearest positioned ancestor. */
  style?: CSSProperties;
};

/** One collectible hidden pixel. */
export function Pixel({ id, inline, style }: Props) {
  const { found, collect } = useHunt();
  const [collecting, setCollecting] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const isFound = found.has(id);

  // Collection finishes when the pixel lands in the HUD; clear the flag then (and on hunt reset).
  const [wasFound, setWasFound] = useState(isFound);
  if (wasFound !== isFound) {
    setWasFound(isFound);
    setCollecting(false);
  }

  const classes = ["px", inline && "px--inline", collecting && "is-found"].filter(Boolean).join(" ");

  return (
    <button
      ref={ref}
      className={classes}
      type="button"
      data-px={id}
      aria-label="Hidden pixel"
      hidden={isFound}
      style={{ ...style, "--k": Number(id) - 1 } as CSSProperties}
      onClick={() => {
        if (isFound || collecting) return;
        setCollecting(true);
        collect(id, ref.current!);
      }}
    ></button>
  );
}
