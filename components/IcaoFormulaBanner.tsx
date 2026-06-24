import { ICAO_FORMULA, RESPONSE_TARGET_SECONDS } from "@/lib/icaoStructure";

export default function IcaoFormulaBanner() {
  return (
    <aside className="icao-formula-banner">
      <div className="icao-formula-head">
        <h2>{ICAO_FORMULA.title}</h2>
        <span className="icao-formula-time">Meta: {RESPONSE_TARGET_SECONDS}</span>
      </div>
      <div className="icao-formula-flow">
        {ICAO_FORMULA.steps.map((step, i) => (
          <div key={step} className="icao-formula-step-wrap">
            {i > 0 && <span className="icao-formula-arrow">↓</span>}
            <span className="icao-formula-step">{step}</span>
          </div>
        ))}
      </div>
      <div className="icao-formula-templates">
        {ICAO_FORMULA.templates.map((t) => (
          <span key={t.step} className="icao-template-chip">
            <strong>{t.phrase}</strong>
          </span>
        ))}
      </div>
      <p className="icao-formula-note">
        Monte sua resposta — use a estrutura e as keywords, sem decorar scripts inteiros.
      </p>
    </aside>
  );
}
