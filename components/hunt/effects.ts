// Fire-and-forget particle effects for the pixel hunt, built on the Web Animations API.

const SPARK_COLORS = ["#12BFEA", "#087BE8", "#20C9BC", "#D6B56D", "#8fe9ff"];
const CONFETTI_COLORS = ["#12BFEA", "#087BE8", "#20C9BC", "#D6B56D", "#F5FBFF"];

function particle(className: string) {
  const el = document.createElement("i");
  el.className = className;
  document.body.appendChild(el);
  return el;
}

/** Small radial burst where a pixel was clicked. */
export function sparkBurst(x: number, y: number) {
  const count = 14;
  for (let i = 0; i < count; i++) {
    const el = particle("px-spark");
    el.style.left = x - 3 + "px";
    el.style.top = y - 3 + "px";
    el.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    el.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(.2) rotate(${180 * Math.random()}deg)`,
          opacity: 0,
        },
      ],
      { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.16,1,.3,1)" },
    ).onfinish = () => el.remove();
  }
}

/** Arcs a glowing square from `from` into `to` (a HUD grid cell), then calls `done`. */
export function flyTo(from: Element, to: Element, done: () => void) {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const el = particle("px-fly");
  el.style.left = a.left + a.width / 2 - 6 + "px";
  el.style.top = a.top + a.height / 2 - 6 + "px";
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  el.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0)" },
      { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 120}px) scale(1.8) rotate(180deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.6) rotate(360deg)` },
    ],
    { duration: 900, easing: "cubic-bezier(.65,0,.35,1)" },
  ).onfinish = () => {
    el.remove();
    done();
  };
}

/** Confetti falling from the top of the viewport. */
export function rainConfetti() {
  for (let i = 0; i < 60; i++) {
    const el = particle("px-spark");
    const size = 5 + Math.random() * 9;
    Object.assign(el.style, {
      left: Math.random() * innerWidth + "px",
      top: "-20px",
      width: size + "px",
      height: size + "px",
      background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    });
    el.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, ${innerHeight + 60}px) rotate(${720 * Math.random()}deg)`,
          opacity: 0.9,
        },
      ],
      { duration: 1800 + Math.random() * 1600, delay: Math.random() * 500, easing: "cubic-bezier(.3,.6,.4,1)" },
    ).onfinish = () => el.remove();
  }
}
