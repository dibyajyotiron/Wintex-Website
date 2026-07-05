import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";

export function QualitySection() {
  return (
    <section className="section-band quality reveal" id="quality">
      <div className="quality-media">
        <img src="/assets/circuit-board.jpg" alt="IC board close up" />
      </div>
      <div className="quality-copy">
        <span>Quality & legacy</span>
        <h2>Manufactured with strict controls, calibrated for trust.</h2>
        <p>
          Wintex systems use microprocessor and IC-based electronics, controlled
          production processes, and disciplined testing aligned with Department
          of Weights & Measures standards.
        </p>
        <div className="quality-list">
          <div>
            <ShieldCheck size={22} />
            <span>Legal metrology approved</span>
          </div>
          <div>
            <CheckCircle2 size={22} />
            <span>Quality-tested components</span>
          </div>
          <div>
            <Building2 size={22} />
            <span>R&D-led product development</span>
          </div>
        </div>
      </div>
    </section>
  );
}

