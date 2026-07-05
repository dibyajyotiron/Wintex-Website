import { CheckCircle2 } from "lucide-react";
import { companyHighlights } from "../../data/siteContent";

export function AboutSection() {
  return (
    <section className="section-band about-company reveal" id="about">
      <div className="about-copy">
        <span>About company</span>
        <h2>Built for businesses that cannot afford inaccurate weight.</h2>
        <p>
          Pionear Scales Industries manufactures Wintex electronic weighing
          systems with high-quality components, micro-processor based
          electronics, strict production checks, and practical after-sales
          support.
        </p>
        <div className="about-highlight-grid">
          {companyHighlights.map((item) => (
            <article key={item.title}>
              <CheckCircle2 size={22} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

