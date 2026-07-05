import { Gauge, SlidersHorizontal, Wrench } from "lucide-react";
import { services } from "../../data/siteContent";

const serviceIcons = {
  Gauge,
  SlidersHorizontal,
  Wrench,
};

export function ServicesSection() {
  return (
    <section className="section-band services reveal" id="services">
      <div className="section-heading">
        <span>Services</span>
        <h2>From system selection to long-term field support.</h2>
        <p>
          One partner for choosing the right weighing system, deploying it
          correctly, and keeping it calibrated.
        </p>
      </div>
      <div className="service-grid">
        {services.map((service) => {
          const Icon = serviceIcons[service.icon];

          return (
            <article className="service-card" key={service.title}>
              <div className="service-icon">
                <Icon size={26} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

