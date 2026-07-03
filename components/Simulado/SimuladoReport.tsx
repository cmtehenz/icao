"use client";

import { ICAO_CRITERION_LABELS } from "@/lib/evaluate/icaoLevel";
import { ICAO_LEVEL_LABELS } from "@/lib/evaluate/icaoLevel";
import { modeLabel } from "@/lib/simulado/buildSteps";
import type { SimulationReport } from "@/lib/simulado/types";

type Props = {
  report: SimulationReport;
  onPracticeWeak: () => void;
  onRepeat: () => void;
  onReviewVocab: () => void;
  onHome: () => void;
};

function overallScore(report: SimulationReport): number {
  const s = report.scores;
  return Math.round(
    (s.pronunciation + s.structure + s.vocabulary + s.fluency + s.comprehension + s.interactions) / 6,
  );
}

export default function SimuladoReport({
  report,
  onPracticeWeak,
  onRepeat,
  onReviewVocab,
  onHome,
}: Props) {
  const score = overallScore(report);
  const levelInfo = ICAO_LEVEL_LABELS[report.estimatedLevel];

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="sim-report">
      <header className="sim-report-hero">
        <p className="sim-report-kicker">Relatório do Simulado ICAO</p>
        <h2>{modeLabel(report.mode, report.partsIncluded)} · {report.examVersion}</h2>
        <p className="sim-report-date">{new Date(report.date).toLocaleString("pt-BR")}</p>

        <div className="sim-level-card">
          <span className="sim-level-num">Nível {report.estimatedLevel}</span>
          <strong>{levelInfo.title}</strong>
          <p>
            Estimativa de treino apenas — não substitui a avaliação oficial SDEA/ANAC. Na prova real,
            o nível final é o <em>menor</em> dos 6 critérios ICAO.
          </p>
        </div>

        <div className="sim-score-ring" aria-label={`Score geral ${score}`}>
          <strong>{score}</strong>
          <span>score geral</span>
        </div>
      </header>

      <section className="sim-report-section">
        <h3>Critérios ICAO</h3>
        <div className="sim-criteria-grid">
          {(Object.keys(report.criterionLevels) as Array<keyof typeof report.criterionLevels>).map((key) => (
            <div key={key} className="sim-criterion-card">
              <span>{ICAO_CRITERION_LABELS[key]}</span>
              <strong>Nível {report.criterionLevels[key]}</strong>
              <div className="sim-bar">
                <div className="sim-bar-fill" style={{ width: `${report.scores[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sim-report-section">
        <h3>Desempenho por parte</h3>
        <div className="sim-part-scores">
          {([1, 2, 3, 4] as const).map((p) => {
            const val = report.partScores[`part${p}` as keyof typeof report.partScores];
            if (val == null) return null;
            return (
              <div key={p} className="sim-part-score-card">
                <span>Part {p}</span>
                <strong>{val}/100</strong>
              </div>
            );
          })}
        </div>
      </section>

      <div className="sim-report-columns">
        <section className="sim-report-section">
          <h3>O que você fez bem</h3>
          <ul className="sim-list good">
            {report.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="sim-report-section">
          <h3>O que melhorar</h3>
          <ul className="sim-list warn">
            {report.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="sim-report-section">
        <h3>Recomendações de estudo</h3>
        <ul className="sim-list">
          {report.studyRecommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {report.difficultItems.length > 0 && (
        <section className="sim-report-section">
          <h3>Marcados para revisão</h3>
          <ul className="sim-list difficult">
            {report.difficultItems.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="sim-report-section">
        <h3>Transcrições</h3>
        <div className="sim-transcript-list">
          {report.transcript.map((t) => (
            <details key={t.stepId} className="sim-transcript-item">
              <summary>{t.label} · Part {t.part}</summary>
              <p><strong>Você:</strong> {t.transcript || "—"}</p>
              {t.modelAnswer && <p><strong>Modelo:</strong> {t.modelAnswer}</p>}
            </details>
          ))}
        </div>
      </section>

      <footer className="sim-report-actions">
        <button type="button" className="btn green" onClick={onPracticeWeak}>
          Praticar áreas fracas
        </button>
        <button type="button" className="btn secondary" onClick={onRepeat}>
          Repetir simulado
        </button>
        <button type="button" className="btn secondary" onClick={onReviewVocab}>
          Revisar vocabulário Part 2
        </button>
        <button type="button" className="btn secondary" onClick={exportPdf}>
          Exportar relatório (PDF)
        </button>
        <button type="button" className="btn" onClick={onHome}>
          Voltar ao início
        </button>
      </footer>
    </div>
  );
}
