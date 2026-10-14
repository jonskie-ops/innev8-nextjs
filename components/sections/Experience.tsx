import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Pixel } from "../hunt/Pixel";

const MARQUEE = [
  "Tech Showcases",
  "Iconic Awardees",
  "Capstone Presentations",
  "Cosplay",
  "Digital Marketing",
  "Interactive Displays",
  "AR Treasure Hunt",
];

type Card = {
  title: string;
  body: string;
  icon: ReactNode;
  /** Label + widths (in characters) of the redacted "to be announced" bars. */
  redact: { label: string; aria: string; bars: number[] };
};

const CARDS: Card[] = [
  {
    title: "Tech Showcases",
    body: "The region's boldest builds, live on the floor. Touch them, test them, be impressed.",
    icon: (
      <>
        <rect x="12" y="12" width="24" height="24" rx="3" />
        <rect x="19" y="19" width="10" height="10" rx="1.5" />
        <path d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6" />
      </>
    ),
    redact: { label: "Exhibitors", aria: "Exhibitors to be announced", bars: [7, 4, 6] },
  },
  {
    title: "Iconic Awardees",
    body: "Honoring the names putting Eastern Visayas on the digital map.",
    icon: (
      <>
        <path d="M16 8h16v10a8 8 0 0 1-16 0z" />
        <path d="M16 11H9v3a7 7 0 0 0 7 7M32 11h7v3a7 7 0 0 1-7 7M24 26v8M17 40h14M19 34h10v6H19z" />
      </>
    ),
    redact: { label: "Awardees", aria: "Awardees to be announced", bars: [5, 8, 3] },
  },
  {
    title: "Capstone Presentations",
    body: "The next generation of builders pitches what comes next.",
    icon: (
      <>
        <path d="M4 18 24 9l20 9-20 9z" />
        <path d="M12 22v9c0 3 5.4 6 12 6s12-3 12-6v-9M44 18v11" />
      </>
    ),
    redact: { label: "Teams", aria: "Teams to be announced", bars: [6, 6, 4] },
  },
  {
    title: "Cosplay",
    body: "Where pop culture meets tech culture. Suit up.",
    icon: (
      <>
        <path d="M4 18c6-4 13-4 20 0 7-4 14-4 20 0-1 9-6 15-12 15-4 0-6-3-8-6-2 3-4 6-8 6-6 0-11-6-12-15z" />
        <path d="M12 22c2-1.5 5-1.5 7 0M29 22c2-1.5 5-1.5 7 0" />
      </>
    ),
    redact: { label: "Categories", aria: "Categories to be announced", bars: [4, 7] },
  },
  {
    title: "Digital Marketing",
    body: "The craft of being seen: strategy, story and scale.",
    icon: (
      <>
        <path d="M6 38h36" />
        <path d="M8 32l10-10 7 6 15-15" />
        <path d="M31 13h9v9" />
      </>
    ),
    redact: { label: "Speakers", aria: "Speakers to be announced", bars: [6, 5, 5] },
  },
  {
    title: "Interactive Displays & Games",
    body: "Hands-on displays, live challenges and games built to be played.",
    icon: (
      <>
        <path d="M15 15h18a10 10 0 0 1 10 10v2a7 7 0 0 1-12.6 4.2L28 28h-8l-2.4 3.2A7 7 0 0 1 5 27v-2a10 10 0 0 1 10-10z" />
        <path d="M14 20v6M11 23h6" />
        <circle cx="32" cy="21" r="1.4" />
        <circle cx="35.5" cy="25" r="1.4" />
      </>
    ),
    redact: { label: "Games", aria: "Games to be announced", bars: [3, 7, 4] },
  },
];

export function Marquee() {
  // The list is rendered twice so the CSS loop can translate by -50% seamlessly.
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i === MARQUEE.length && " "}
            <span>{item}</span>
            <i></i>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow reveal">What&apos;s coming</p>
          <h2 className="reveal">
            Two days. Six worlds.
            <br />
            <span className="grad">One region.</span>
          </h2>
          <p className="lead reveal">The details are under wraps. Here&apos;s what we can tell you.</p>
        </header>
        <div className="cards">
          {CARDS.map((card, i) => (
            <article key={card.title} className="card reveal" data-tilt="">
              <div className="card__top">
                <span className="card__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="chip">Revealing soon</span>
              </div>
              <svg className="card__icon" viewBox="0 0 48 48" aria-hidden="true">
                {card.icon}
              </svg>
              <h3 data-scramble="">{card.title}</h3>
              <p>{card.body}</p>
              <p className="redact" aria-label={card.redact.aria}>
                <span>{card.redact.label}</span>
                {card.redact.bars.map((w, j) => (
                  <b key={j} style={{ "--w": w } as CSSProperties}></b>
                ))}
              </p>
              {card.title === "Cosplay" && <Pixel id="3" style={{ right: 18, bottom: 18 }} />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
