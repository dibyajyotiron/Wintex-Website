import { proofPoints } from "../../data/siteContent";

export function MetricsStrip() {
  return (
    <section className="metric-strip reveal" aria-label="Wintex scale and reach">
      {proofPoints.map((point) => (
        <div key={point.label} className="metric">
          <strong>{point.value}</strong>
          <span>{point.label}</span>
        </div>
      ))}
    </section>
  );
}

