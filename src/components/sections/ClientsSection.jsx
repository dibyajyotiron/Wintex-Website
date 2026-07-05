import { OptimizedImage } from "../common/OptimizedImage";
import { clientLogos } from "../../data/siteContent";

export function ClientsSection() {
  return (
    <section className="section-band clients reveal" id="clients">
      <div className="section-heading">
        <span>Clients</span>
        <h2>Trusted by demanding industrial teams.</h2>
      </div>
      <div className="logo-grid">
        {clientLogos.map((client) => (
          <div className="logo-tile" key={client.name}>
            <OptimizedImage
              src={client.image}
              alt={`${client.name} logo`}
              width={client.width}
              height={client.height}
              widths={[180, 360, 720]}
              sizes="(max-width: 680px) calc(100vw - 84px), (max-width: 980px) 33vw, 210px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
