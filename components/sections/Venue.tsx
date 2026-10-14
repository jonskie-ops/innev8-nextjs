/* eslint-disable @next/next/no-img-element -- art-directed light/dark photos swapped in CSS */
import { MAPS_URL } from "@/lib/site";
import { Pixel } from "../hunt/Pixel";
import { PinIcon } from "../icons";

export function Venue() {
  return (
    <section className="venue" id="venue">
      <div className="venue__media" aria-hidden="true">
        <img
          className="on-dark"
          src="/assets/img/aerial-1200.webp"
          alt=""
          width={2400}
          height={1692}
          loading="lazy"
          decoding="async"
        />
        <img
          className="on-light"
          src="/assets/img/aerial-light-1200.webp"
          alt=""
          width={2400}
          height={1692}
          loading="lazy"
          decoding="async"
        />
        <div className="venue__veil"></div>
      </div>
      <div className="container venue__inner">
        <div className="venue__copy reveal">
          <p className="eyebrow">The venue</p>
          <h2>
            Leyte Academic <span className="grad">Center</span>
          </h2>
          <p className="lead">
            Barangay Pawing, Palo, Leyte
            <br />
            Eastern Visayas, Philippines
          </p>
          <a className="btn btn--ghost" data-magnetic="" target="_blank" rel="noopener" href={MAPS_URL}>
            <PinIcon />
            Open in Google Maps
          </a>
        </div>
        <div className="radar reveal" aria-hidden="true">
          <span className="radar__ring"></span>
          <span className="radar__ring"></span>
          <span className="radar__ring"></span> <span className="radar__sweep"></span>{" "}
          <span className="radar__pin"></span> <span className="radar__tag">Palo · Leyte · R8</span>
          <Pixel id="6" style={{ left: "76%", top: "24%" }} />
        </div>
      </div>
    </section>
  );
}
