/* eslint-disable @next/next/no-img-element -- art-directed light/dark photos swapped in CSS */
import { GOOGLE_CALENDAR_URL, ICS_URL } from "@/lib/site";
import { CountdownClock } from "../Countdown";
import { CalendarAddIcon, DownloadIcon } from "../icons";

export function CountdownSection() {
  return (
    <section className="countdown" id="countdown">
      <div className="countdown__media" aria-hidden="true">
        <img
          className="on-dark"
          src="/assets/img/tunnel-1200.webp"
          alt=""
          width={2400}
          height={1800}
          loading="lazy"
          decoding="async"
        />
        <img
          className="on-light"
          src="/assets/img/tunnel-light-1200.webp"
          alt=""
          width={2400}
          height={1800}
          loading="lazy"
          decoding="async"
        />
        <div className="countdown__veil"></div>
      </div>
      <div className="container countdown__inner">
        <p className="eyebrow reveal">The road to November 20</p>
        <h2 className="reveal">
          The countdown <span className="grad">is on.</span>
        </h2>
        <CountdownClock />
        <div className="save reveal" id="save">
          <p className="save__date">
            <strong>
              <time dateTime="2026-11-20">Fri, Nov 20</time> – <time dateTime="2026-11-21">Sat, Nov 21, 2026</time>
            </strong>
            <span>Leyte Academic Center · Palo, Leyte</span>
          </p>
          <div className="save__btns">
            <a className="btn btn--primary" data-magnetic="" target="_blank" rel="noopener" href={GOOGLE_CALENDAR_URL}>
              <CalendarAddIcon />
              Google Calendar
            </a>{" "}
            <a className="btn btn--ghost" data-magnetic="" href={ICS_URL} download>
              <DownloadIcon />
              Apple / Outlook (.ics)
            </a>
          </div>
          <p className="save__note">Registration opens soon.</p>
        </div>
      </div>
    </section>
  );
}
