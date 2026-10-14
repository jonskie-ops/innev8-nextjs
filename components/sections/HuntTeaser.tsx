import { HuntStartButton } from "../hunt/HuntStartButton";
import { Pixel } from "../hunt/Pixel";

export function HuntTeaser() {
  return (
    <section className="hunt-teaser" id="hunt">
      <div className="container hunt-teaser__inner reveal">
        <div className="scanner" aria-hidden="true">
          <span className="scanner__corner"></span>
          <span className="scanner__corner"></span>
          <span className="scanner__corner"></span>
          <span className="scanner__corner"></span> <span className="scanner__beam"></span>{" "}
          <span className="scanner__target"></span>{" "}
          <span className="scanner__read">
            SCANNING<span>…</span>
          </span>
          <Pixel id="4" style={{ left: "22%", top: "70%" }} />
        </div>
        <div className="hunt-teaser__copy">
          <p className="eyebrow">Interactive event</p>
          <h2>
            AR Treasure <span className="grad">Hunt</span>
          </h2>
          <p className="lead">
            Clues will hide all over the venue, visible only through your phone. Consider this your warm-up:{" "}
            <strong>8 pixels are hidden on this page.</strong>
          </p>
          <HuntStartButton />
        </div>
      </div>
    </section>
  );
}
