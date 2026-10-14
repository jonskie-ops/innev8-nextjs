import { Sprite } from "@/components/graphics";
import { HtmlBoot } from "@/components/HtmlBoot";
import { HuntProvider } from "@/components/hunt/HuntProvider";
import { Intro } from "@/components/Intro";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { Experience, Marquee } from "@/components/sections/Experience";
import { Faq } from "@/components/sections/Faq";
import { Finale } from "@/components/sections/Finale";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HuntTeaser } from "@/components/sections/HuntTeaser";
import { Manifesto } from "@/components/sections/Manifesto";
import { Nav } from "@/components/sections/Nav";
import { Venue } from "@/components/sections/Venue";
import { SiteEffects } from "@/components/SiteEffects";
import { JSON_LD } from "@/lib/site";

export default function Home() {
  return (
    <HuntProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <HtmlBoot />
      <Sprite />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Intro />
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Marquee />
        <Experience />
        <HuntTeaser />
        <CountdownSection />
        <Venue />
        <Faq />
        <Finale />
      </main>
      <Footer />
      <SiteEffects />
    </HuntProvider>
  );
}
