"use client";

import IcaoLevelPanel from "@/components/IcaoLevelPanel";
import YouGlishLink from "@/components/YouGlishLink";
import { ICAO_CRITERION_LABELS, ICAO_LEVEL_LABELS } from "@/lib/evaluate/icaoLevel";
import type { AggregatedSimulationResult } from "@/lib/part2/aggregateSimulation";
import { EXAM_LABELS } from "@/lib/exams/types";
import EvaluationAudioPlayer from "@/components/EvaluationAudioPlayer";

type Props = {
  result: AggregatedSimulationResult;
  examVersion: string;
  onRestart: () => void;
};

export default function SimulationResultsPanel({ result, examVersion, onRestart }: Props) {
  const { rating, mispronunciations, improvements, missingKeywords, stepResults } = result;
  const examLabel = EXAM_LABELS[examVersion as keyof typeof EXAM_LABELS] ?? examVersion;

  return (
    <div className="part2-sim-results">
      <header className="part2-sim-results-head">
        <h2>Resultado da simulação — {examLabel}</h2>
        <p className="sub">
          {stepResults.length} respostas gravadas com Azure · nível estimado com base nos 6 critérios ICAO
        </p>
      </header>

      <IcaoLevelPanel rating={rating} />

      <section className="part2-sim-results-section">
        <h3>Notas por critério ICAO</h3>
        <ul className="icao-criteria-grid part2-sim-criteria-detail">
          {(
            Object.entries(rating.criteria) as Array<[keyof typeof ICAO_CRITERION_LABELS, number]>
          ).map(([key, level]) => (
            <li key={key}>
              <span className="part2-sim-criterion-num">{level}</span>
              <div>
                <strong>{ICAO_LEVEL_LABELS[level as keyof typeof ICAO_LEVEL_LABELS].title}</strong>
                <span>{ICAO_CRITERION_LABELS[key]}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {mispronunciations.length > 0 && (
        <section className="part2-sim-results-section">
          <h3>Erros de pronúncia (Azure)</h3>
          <ul className="mispronounced-list">
            {mispronunciations.map((w) => (
              <li
                key={w.word}
                className={`mispronounced-item ${w.accuracyScore < 60 ? "bad" : "warn"}`}
              >
                <span className="mispronounced-word">{w.word}</span>
                <span className="mispronounced-score">{w.accuracyScore}%</span>
                <span className="mispronounced-error">{w.errorLabel}</span>
                <YouGlishLink word={w.word} compact />
                <span className="part2-sim-error-context">{w.contexts.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {missingKeywords.length > 0 && (
        <section className="part2-sim-results-section">
          <h3>Elementos faltando</h3>
          <ul className="part2-sim-error-list">
            {missingKeywords.map((item, i) => (
              <li key={`${item.keyword}-${i}`}>
                <strong>{item.keyword}</strong>
                <span>{item.context}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {improvements.length > 0 && (
        <section className="part2-sim-results-section">
          <h3>Pontos a melhorar</h3>
          <ul className="part2-sim-error-list">
            {improvements.map((item, i) => (
              <li key={`${item.text}-${i}`}>
                <p>{item.text}</p>
                <span>{item.context}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="part2-sim-results-section">
        <h3>Resumo por situação</h3>
        <div className="part2-sim-step-grid">
          {stepResults.map((r) => (
            <article key={`${r.situationId}-${r.step}`} className="part2-sim-step-card">
              <header>
                <strong>
                  Sit. {r.situationNumber} — {r.stepLabel}
                </strong>
                {r.feedback.icaoLevel && (
                  <span className={`icao-mini-badge icao-l${r.feedback.icaoLevel.overall}`}>
                    ICAO {r.feedback.icaoLevel.overall}
                  </span>
                )}
              </header>
              <p className="part2-sim-step-transcript">{r.feedback.transcript || "—"}</p>
              {r.evaluationId && (
                <EvaluationAudioPlayer
                  evaluationId={r.evaluationId}
                  className="exam-audio part2-sim-step-audio"
                />
              )}
              <p className="part2-sim-step-summary">{r.feedback.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="study-toolbar">
        <button type="button" className="btn green btn-large" onClick={onRestart}>
          Nova simulação
        </button>
      </div>
    </div>
  );
}
