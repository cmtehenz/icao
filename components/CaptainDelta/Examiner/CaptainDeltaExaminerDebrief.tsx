"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ICAO_LEVEL_LABELS } from "@/lib/evaluate/icaoLevel";
import { buildExaminerDebrief } from "@/lib/captainDelta/examiner/debrief";
import { emitCaptainDeltaSuggestion } from "@/lib/captainDelta/events";
import { examFinishedScript } from "@/lib/captainDelta/examiner/prompts";
import { toSpeechText } from "@/lib/captainDelta/voiceText";
import { useCaptainDeltaExaminer } from "@/components/CaptainDelta/Examiner/CaptainDeltaExaminerProvider";
import type { SimuladoStepResult, SimulationReport } from "@/lib/simulado/types";
import { getExaminerRecord } from "@/lib/captainDelta/examiner/store";

type Props = {
  report: SimulationReport;
  results: SimuladoStepResult[];
  onRepeat: () => void;
  onHome: () => void;
};

export default function CaptainDeltaExaminerDebrief({
  report,
  results,
  onRepeat,
  onHome,
}: Props) {
  const examiner = useCaptainDeltaExaminer();
  const [reviewId, setReviewId] = useState<string | null>(null);
  const debrief = useMemo(() => buildExaminerDebrief(report, results), [report, results]);
  const examRecord = getExaminerRecord(report.id);

  const speakDebrief = () => {
    examiner?.exitExaminerMode();
    const intro = examFinishedScript();
    emitCaptainDeltaSuggestion({
      text: `${intro}\n\n${debrief.spokenSummary}`,
      speechText: toSpeechText(`${intro} ${debrief.spokenSummary}`),
      kind: "debrief",
      primaryAction: { id: "ready", label: "👍 Got it", primary: true },
      secondaryActions: [],
    });
  };

  const reviewItem = examRecord?.recordings.find((r) => r.stepId === reviewId);

  return (
    <div className="cde-debrief">
      <header className="cde-debrief-hero">
        <span className="cde-debrief-badge">👨‍✈️ Instructor Mode · Debrief</span>
        <h2>Exam debrief</h2>
        <p className="cde-debrief-disclaimer">{debrief.disclaimer}</p>
        <div className="cde-debrief-level">
          <strong>Estimated ICAO {debrief.estimatedLevel}</strong>
          <span>{ICAO_LEVEL_LABELS[debrief.estimatedLevel as keyof typeof ICAO_LEVEL_LABELS]?.title}</span>
        </div>
        <button type="button" className="btn secondary btn-sm" onClick={speakDebrief}>
          🔊 Hear debrief
        </button>
      </header>

      <section className="cde-debrief-section">
        <h3>ICAO criteria</h3>
        <div className="cde-criteria-grid">
          {debrief.criteria.map((c) => (
            <div key={c.key} className="cde-criterion">
              <span>{c.label}</span>
              <strong>Level {c.level}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="cde-debrief-section">
        <h3>Part scores</h3>
        <div className="cde-part-scores">
          {debrief.partScores.map((p) => (
            <div key={p.part}>
              <span>Part {p.part}</span>
              <strong>{p.score}/100</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="cde-debrief-columns">
        <section>
          <h3>Strong points</h3>
          <ul>{debrief.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
        <section>
          <h3>Weak points</h3>
          <ul>{debrief.weaknesses.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      </div>

      {debrief.bestAnswer && (
        <section className="cde-debrief-section">
          <h3>Best answer</h3>
          <p>
            <strong>{debrief.bestAnswer.label}</strong> ({debrief.bestAnswer.score}/100)
          </p>
          <p className="cde-transcript">{debrief.bestAnswer.transcript}</p>
        </section>
      )}

      {debrief.worstAnswer && (
        <section className="cde-debrief-section">
          <h3>Weakest answer</h3>
          <p>
            <strong>{debrief.worstAnswer.label}</strong> ({debrief.worstAnswer.score}/100)
          </p>
          <p className="cde-transcript">{debrief.worstAnswer.transcript}</p>
        </section>
      )}

      {debrief.hardestMoment && (
        <section className="cde-debrief-section">
          <h3>Most difficult moment</h3>
          <p>{debrief.hardestMoment}</p>
        </section>
      )}

      {debrief.wordsToPractice.length > 0 && (
        <section className="cde-debrief-section">
          <h3>Words to practice</h3>
          <p>{debrief.wordsToPractice.join(", ")}</p>
          <Link href="/pronunciation" className="btn secondary btn-sm">
            Open pronunciation bank →
          </Link>
        </section>
      )}

      <section className="cde-debrief-section cde-mission">
        <h3>Study mission for tomorrow</h3>
        <ul>{debrief.tomorrowMission.map((m) => <li key={m}>• {m}</li>)}</ul>
      </section>

      {examRecord && examRecord.recordings.length > 0 && (
        <section className="cde-debrief-section">
          <h3>Review mode</h3>
          <ul className="cde-review-list">
            {examRecord.recordings.map((r) => (
              <li key={r.stepId}>
                <button type="button" className="cde-review-btn" onClick={() => setReviewId(r.stepId)}>
                  {r.label} · {r.durationSec}s · {r.score}/100
                </button>
              </li>
            ))}
          </ul>
          {reviewItem && (
            <div className="cde-review-detail">
              <p className="cde-transcript">{reviewItem.transcript}</p>
              {reviewItem.modelAnswer && (
                <p className="cde-model">
                  <strong>Model:</strong> {reviewItem.modelAnswer}
                </p>
              )}
              <Link href="/pronunciation" className="btn secondary btn-sm">
                Send to pronunciation bank
              </Link>
            </div>
          )}
        </section>
      )}

      <footer className="cde-debrief-foot">
        <button type="button" className="btn purple" onClick={onRepeat}>
          Try again
        </button>
        <button type="button" className="btn secondary" onClick={onHome}>
          Dashboard
        </button>
      </footer>
    </div>
  );
}
