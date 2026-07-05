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
            <img src={client.image} alt={`${client.name} logo`} />
          </div>
        ))}
      </div>
    </section>
  );
}

