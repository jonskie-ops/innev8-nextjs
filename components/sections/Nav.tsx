/* eslint-disable @next/next/no-img-element -- light/dark logo swap is done in CSS */
import { ThemeToggle } from "../ThemeToggle";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#hunt", label: "AR Hunt" },
  { href: "#countdown", label: "Countdown" },
  { href: "#venue", label: "Venue" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="nav" data-nav="">
      <a className="nav__brand" href="#top" aria-label="INNEV8 ICT Federation, back to top">
        <img
          className="nav__logo on-dark"
          src="/assets/img/logo/innev8-logo-horizontal-reversed.svg"
          alt="INNEV8 ICT Federation"
          width={150}
          height={50}
        />
        <img
          className="nav__logo on-light"
          src="/assets/img/logo/innev8-logo-horizontal.svg"
          alt="INNEV8 ICT Federation"
          width={150}
          height={50}
          loading="lazy"
        />
      </a>
      <nav className="nav__links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="nav__actions">
        <ThemeToggle />
        <a className="btn btn--primary btn--sm" href="#save" data-magnetic="">
          Save the date
        </a>
      </div>
    </header>
  );
}
