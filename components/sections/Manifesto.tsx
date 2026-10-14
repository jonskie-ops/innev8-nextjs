import { Fragment } from "react";
import { Panorama } from "../graphics";
import { Pixel } from "../hunt/Pixel";

const TEXT =
  "In 1973, a 2.16-kilometer bridge joined Samar and Leyte. This November, Samar, Leyte and Biliran build the next one: between industries, partners and a digital future";
/** Words that light up in the accent colour as the bridge draws itself on scroll. */
const KEY_WORD = /^(1973|2\.16-kilometer|Samar|Leyte|Biliran|November|digital|future)/;

export function Manifesto() {
  return (
    <section className="manifesto" id="manifesto" data-manifesto="">
      <div className="manifesto__sticky">
        <div className="container">
          <p className="eyebrow">The bridge</p>
          <p className="manifesto__text" data-words="">
            {TEXT.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className={KEY_WORD.test(word) ? "w is-key" : "w"}>{word}</span>
              </Fragment>
            ))}
            <Pixel id="2" inline />
          </p>
        </div>
        <Panorama />
      </div>
    </section>
  );
}
