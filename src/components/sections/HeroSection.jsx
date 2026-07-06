import { ArrowRight, BadgeCheck, Download, Phone } from "lucide-react";
import { OptimizedImage } from "../common/OptimizedImage";
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
      <div className="hero-visual" aria-hidden="true">
        <OptimizedImage
          className="hero-image"
          src="/assets/hero-weighbridge-shared.jpeg"
          alt=""
          width={968}
          height={811}
          widths={[640, 960, 1280]}
          sizes="(max-width: 980px) calc(100vw - 36px), 620px"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
