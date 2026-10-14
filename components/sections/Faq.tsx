import { FAQ } from "@/lib/site";

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow reveal">Good to know</p>
          <h2 className="reveal" id="faq-title">
            Questions, <span className="grad">answered.</span>
          </h2>
        </header>
        <div className="faq__list">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="faq__item reveal">
              <summary>
                {q}
                <span className="faq__icon" aria-hidden="true"></span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
