/* eslint-disable @next/next/no-img-element -- art-directed light/dark photos swapped in CSS */
import { DaysLeft } from "../Countdown";
import { HeroEmblem, HeroPulses } from "../graphics";
import { HeroNet } from "../HeroNet";
import { Pixel } from "../hunt/Pixel";
import { SplitText } from "../SplitText";
import { ArrowIcon, CalendarIcon, PinIcon } from "../icons";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <div className="hero__kb">
          <img
            className="hero__photo on-dark"
            src="/assets/img/hero-2400.webp"
            alt=""
            width={2400}
            height={1620}
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="hero__photo on-light"
            src="/assets/img/hero-light-2400.webp"
            alt=""
            width={2400}
            height={1620}
            loading="lazy"
            decoding="async"
          />
          <HeroPulses />
        </div>
        <HeroNet />
        <div className="hero__veil"></div>
      </div>
      <div className="hero__spot" aria-hidden="true"></div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--pill reveal">
            <span className="dot"></span>INNEV8 ICT Federation presents
          </p>
          <h1 className="hero__title">
            <SplitText className="hero__l1" text="Regional" base="0.15s" />{" "}
            <SplitText className="hero__l2" text="ICT Summit" base="0.35s" />{" "}
            <SplitText className="hero__l3" text="2026" base="0.7s" grad />
          </h1>
          <span className="hero__rule" aria-hidden="true"></span>
          <p className="hero__tag reveal">
            Bridging Industries. Building Partnerships.
            <br />
            <em>Creating a Digital Future.</em>
          </p>
          <ul className="hero__meta reveal" role="list">
            <li>
              <CalendarIcon />
              <span>
                <strong>
                  <time dateTime="2026-11-20">November 20</time>–<time dateTime="2026-11-21">21, 2026</time>
                </strong>
                <small>Friday &amp; Saturday</small>
              </span>
            </li>
            <li>
              <PinIcon />
              <span>
                <strong>Leyte Academic Center</strong>
                <small>Brgy. Pawing, Palo, Leyte</small>
              </span>
            </li>
          </ul>
          <div className="hero__cta reveal">
            <a className="btn btn--primary" href="#save" data-magnetic="">
              Save the date <ArrowIcon />
            </a>
            <a className="btn btn--ghost" href="#experience" data-magnetic="">
              See what&apos;s coming
            </a>
          </div>
        </div>

        <div className="hero__emblem">
          <div className="hero__mark">
            <HeroEmblem /> <span className="hero__pedestal" aria-hidden="true"></span>
          </div>
          <img
            className="wordmark on-dark"
            src="/assets/img/logo/innev8-wordmark-reversed.svg"
            alt="INNEV8 ICT Federation"
            width={460}
            height={140}
          />
          <img
            className="wordmark on-light"
            src="/assets/img/logo/innev8-wordmark.svg"
            alt="INNEV8 ICT Federation"
            width={460}
            height={140}
            loading="lazy"
          />
          <Pixel id="1" style={{ left: "6%", top: "58%" }} />
        </div>
      </div>

      <div className="container hero__stats">
        <div className="stat reveal">
          <DaysLeft /> <span>days to go</span> <em>T-minus · Day 1</em>
        </div>
        <div className="stat reveal">
          <strong>02</strong> <span>days of summit</span> <em>Nov 20–21 · 2026</em>
        </div>
        <div className="stat reveal">
          <strong>R8</strong> <span>one region, connected</span> <em>Eastern Visayas</em>
        </div>
        <div className="stat reveal">
          <strong>AR</strong> <span>treasure hunt, live on site</span> <em>Warm-up below ↓</em>
        </div>
      </div>
    </section>
  );
}
