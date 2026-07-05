import { ArrowRight, BadgeCheck, Download, Phone } from "lucide-react";
import { cataloguePath, phoneNumbers } from "../../config/site";

export function HeroSection() {
  return (
    <section className="hero section-band reveal" id="hero">
      <div className="hero-content">
        <div className="eyebrow">
          <BadgeCheck size={16} />
          Pionear Scales Industries | Wintex
        </div>
        <h1>Precision you can trust.</h1>
        <p>
          A quality-conscious Indian manufacturer of electronic weighing systems,
          built with micro-processor and IC-based electronics, strict testing, and
          decades of after-sales support.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#about">
            About the company
            <ArrowRight size={18} />
          </a>
          <a className="secondary-action" href={cataloguePath} download>
            <Download size={18} />
            Download catalogue
          </a>
          <a className="secondary-action" href={phoneNumbers.primaryHref}>
            <Phone size={18} />
            {phoneNumbers.primary}
          </a>
        </div>
      </div>
    </section>
  );
}

