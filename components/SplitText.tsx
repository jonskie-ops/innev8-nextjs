import type { CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  /** Gradient text animates as one block instead of per character. */
  grad?: boolean;
  /** Animation delay offset, e.g. "0.35s". */
  base?: string;
};

/**
 * Pre-renders the per-character markup the original script built at runtime. Animation is triggered
 * by adding `is-in` (hero: when the intro ends; elsewhere: on scroll via SiteEffects).
 */
export function SplitText({ text, className, grad, base }: Props) {
  const style = base ? ({ "--base": base } as CSSProperties) : undefined;

  if (grad) {
    return (
      <span className={className} data-split="" style={style}>
        <span className="split-block">
          <span className="grad">{text}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={[className, "split-line"].filter(Boolean).join(" ")} data-split="" style={style}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} className="char" aria-hidden="true" style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}
