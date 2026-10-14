import { FinaleBackdrop } from "../graphics";
import { Pixel } from "../hunt/Pixel";
import { ArrowIcon } from "../icons";
import { SplitText } from "../SplitText";

export function Finale() {
  return (
    <section className="finale" id="connect" data-finale="">
      <FinaleBackdrop />
      <div className="container fin-copy">
        <p className="eyebrow reveal">Six provinces · One region · Nov 20–21</p>
        <p className="finale__big">
          <SplitText text="Eastern Visayas" base="0s" />{" "}
          <SplitText text="is about to connect." base="0.25s" grad />
        </p>
        <a className="btn btn--primary btn--lg reveal" href="#save" data-magnetic="">
          Save the date <ArrowIcon />
        </a>
      </div>
      <Pixel id="7" style={{ right: "7%", top: "16%" }} />
    </section>
  );
}
