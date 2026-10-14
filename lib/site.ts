export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://innev8.advancedthinkers.ph";

/** Summit opens 8:00 AM and wraps 6:00 PM, Philippine time. */
export const EVENT_START = new Date("2026-11-20T08:00:00+08:00");
export const EVENT_END = new Date("2026-11-21T18:00:00+08:00");

export const THEME_COLOR = { dark: "#030817", light: "#F5FBFF" } as const;

export const TITLE = "Regional ICT Summit 2026 · Nov 20–21 · Palo, Leyte | INNEV8";
export const DESCRIPTION =
  "Eastern Visayas' Regional ICT Summit 2026 by INNEV8 ICT Federation: Nov 20–21 at Leyte Academic Center, Palo, Leyte. Showcases, awards and an AR hunt.";
export const SHARE_TITLE = "Regional ICT Summit 2026 · Eastern Visayas";
export const SHARE_DESCRIPTION =
  "Nov 20–21, 2026 · Leyte Academic Center, Palo, Leyte. Tech showcases, iconic awardees, capstones, cosplay and an AR treasure hunt.";
export const OG_IMAGE_ALT =
  "Regional ICT Summit 2026 by INNEV8 ICT Federation, November 20–21, 2026 at Leyte Academic Center, Palo, Leyte, over a night view of the San Juanico Bridge";

export const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Regional%20ICT%20Summit%202026&dates=20261120/20261122&location=Leyte%20Academic%20Center%2C%20Barangay%20Pawing%2C%20Palo%2C%20Leyte&details=INNEV8%20ICT%20Federation%20presents%20the%20Regional%20ICT%20Summit%202026.%20Bridging%20Industries.%20Building%20Partnerships.%20Creating%20a%20Digital%20Future.";
export const ICS_URL = "/assets/regional-ict-summit-2026.ics";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Leyte%20Academic%20Center%2C%20Pawing%2C%20Palo%2C%20Leyte";

export const FAQ = [
  {
    q: "What is the Regional ICT Summit 2026?",
    a: "A two-day ICT summit for Eastern Visayas (Region VIII), presented by the INNEV8 ICT Federation under the theme “Bridging Industries. Building Partnerships. Creating a Digital Future.”",
  },
  {
    q: "When and where is the Regional ICT Summit 2026?",
    a: "November 20–21, 2026 (Friday and Saturday) at the Leyte Academic Center, Barangay Pawing, Palo, Leyte, Philippines.",
  },
  {
    q: "What happens at the summit?",
    a: "Tech showcases, iconic awardees, capstone presentations, cosplay, digital marketing, and interactive displays and games, including an AR treasure hunt across the venue.",
  },
  {
    q: "Which provinces is the summit for?",
    a: "All of Eastern Visayas: Biliran, Eastern Samar, Leyte, Northern Samar, Samar and Southern Leyte.",
  },
  {
    q: "Who organizes the Regional ICT Summit 2026?",
    a: "The INNEV8 ICT Federation. Its motto: Connect, Innovate, Empower.",
  },
  {
    q: "How do I register?",
    a: "Registration opens soon. Save the date now with the Google Calendar or .ics buttons on this page, and check back for registration details.",
  },
] as const;

export const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "INNEV8 ICT Federation",
      alternateName: "INNEV8",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/img/icon-512.png`, width: 512, height: 512 },
      slogan: "Connect. Innovate. Empower.",
      areaServed: { "@type": "AdministrativeArea", name: "Eastern Visayas (Region VIII), Philippines" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Regional ICT Summit 2026",
      inLanguage: "en-PH",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en-PH",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#event` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/img/og-image.jpg`,
        width: 1200,
        height: 630,
        caption: OG_IMAGE_ALT,
      },
    },
    {
      "@type": "Event",
      "@id": `${SITE_URL}/#event`,
      name: "Regional ICT Summit 2026",
      alternateName: "Eastern Visayas Regional ICT Summit 2026",
      description:
        "The Regional ICT Summit 2026 brings Eastern Visayas together for two days of tech showcases, iconic awardees, capstone presentations, cosplay, digital marketing, interactive displays and games, including an AR treasure hunt. Presented by the INNEV8 ICT Federation. Bridging Industries. Building Partnerships. Creating a Digital Future.",
      startDate: "2026-11-20",
      endDate: "2026-11-21",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Leyte Academic Center",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Barangay Pawing",
          addressLocality: "Palo",
          addressRegion: "Leyte",
          postalCode: "6501",
          addressCountry: "PH",
        },
      },
      image: [`${SITE_URL}/assets/img/og-image.jpg`],
      url: `${SITE_URL}/`,
      inLanguage: "en",
      organizer: { "@id": `${SITE_URL}/#organization` },
      keywords:
        "ICT summit, Eastern Visayas, Region VIII, tech showcase, capstone presentations, cosplay, digital marketing, AR treasure hunt, Leyte, Samar, Biliran",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};
