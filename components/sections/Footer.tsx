/* eslint-disable @next/next/no-img-element */
import { Pixel } from "../hunt/Pixel";

const WAVE_GOLD = "M0 70 C240 30 480 110 720 70 S1200 30 1440 60";
const WAVE_BLUE = "M0 90 C260 60 520 120 760 86 S1220 50 1440 82";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__waves" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path className="fw fw--gold" d={WAVE_GOLD} />
          <path className="fw fw--blue" d={WAVE_BLUE} />
          <path className="fw fw--pulse" pathLength={1000} d={WAVE_BLUE} />
          <path className="fw fw--pulse fw--late" pathLength={1000} d={WAVE_GOLD} />
        </svg>
      </div>
      <div className="container footer__inner">
        <img
          className="footer__logo"
          src="/assets/img/logo/innev8-logo-horizontal-reversed.svg"
          alt="INNEV8 ICT Federation"
          width={260}
          height={87}
          loading="lazy"
        />
        <p className="footer__motto">
          <span>Connect</span>
          <i>/</i>
          <span>Innovate</span>
          <i>/</i>
          <span>
            Empower
            <Pixel id="8" inline />
          </span>
        </p>
        <p className="footer__small">Regional ICT Summit 2026 · November 20–21 · Leyte Academic Center, Palo, Leyte</p>
        <p className="footer__copy">© 2026 INNEV8 ICT Federation. All rights reserved.</p>
        <p className="footer__credit">
          Website design by{" "}
          <a href="https://advancedthinkers.ph/" target="_blank" rel="noopener">
            Advanced Thinkers, Co.
          </a>
        </p>
        <p className="footer__credits">
          Background photos of the San Juanico Bridge from Wikimedia Commons, shown monotone and blurred:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:San_Juanico_Bridge_blue_night_light_(Tacloban,_Leyte;_09-08-2022).jpg"
            target="_blank"
            rel="noopener"
          >
            blue night light
          </a>{" "}
          and{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:San_Juanico_Bridge_main_span_inside_blue_night_light_(Tacloban,_Leyte;_09-08-2022).jpg"
            target="_blank"
            rel="noopener"
          >
            main span inside
          </a>{" "}
          by Patrickroque01;{" "}
          <a href="https://commons.wikimedia.org/wiki/File:San_juanico_bridge.jpg" target="_blank" rel="noopener">
            aerial view
          </a>{" "}
          by Franz Trinidad (Manong Frank). All{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">
            CC BY-SA 4.0
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
