# Regional ICT Summit 2026 — Next.js

Next.js (App Router, TypeScript) port of the INNEV8 Regional ICT Summit 2026 one-page site. The page is fully static (prerendered at build time); interactivity runs in small client components.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the build
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` to change the absolute URL used in metadata and JSON-LD (defaults to `https://innev8.advancedthinkers.ph`).

## Layout

| Path | What it is |
| --- | --- |
| `app/layout.tsx` | `<html>`, metadata/OG tags, font + hero preloads, inline boot script (theme, `js` class, intro skip) |
| `app/page.tsx` | Composes the sections inside `HuntProvider` |
| `app/globals.css` | The original stylesheet, unchanged apart from font paths |
| `lib/site.ts` | Event dates, links, FAQ copy, JSON-LD |
| `components/sections/*` | One server component per page section |
| `components/graphics.tsx` | Large inline SVGs (logo emblem, bridge panorama, finale backdrop) |
| `components/Intro.tsx` | Loading counter; marks the page `is-ready` when done |
| `components/HeroNet.tsx` | Canvas node network in the hero |
| `components/Countdown.tsx` | Live countdown clock and "days to go" stat |
| `components/ThemeToggle.tsx` | Light/dark toggle with the pixel-dissolve transition |
| `components/hunt/*` | Hidden-pixel game: state, HUD, toast, win dialog, pixel buttons |
| `components/SiteEffects.tsx` | Scroll reveals, manifesto/parallax, nav behaviour, card tilt, magnetic buttons |

Styling is driven by class names from the original CSS (`is-in`, `is-ready`, `is-lit`, …), so keep them when editing markup.

## Missing assets

The site mirror this was built from didn't include these files. The markup was adjusted to use only what exists, so nothing 404s:

- `hero-1200.webp`, `hero-light-1200.webp` (smaller hero sizes)
- `tunnel-2400.webp`, `tunnel-light-2400.webp`, `aerial-2400.webp`, `aerial-light-2400.webp` (large sizes)
- `icon-512.png` (referenced as the logo in JSON-LD)
- `site.webmanifest`

Add them to `public/assets/img/` and restore `srcSet` on the `<img>` tags if you have them.
