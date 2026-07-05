"use client";

import { useState } from "react";
import type { FlightInstructorReport, SkillBand } from "@/lib/flightInstructor/types";
import {
  NATURALNESS_LABELS,
  SKILL_BAND_LABELS,
} from "@/lib/flightInstructor/types";
import type { EvaluateFeedback } from "@/lib/evaluate/types";

type AttemptCompare = {
  first: EvaluateFeedback;
  second: EvaluateFeedback;
  firstNaturalness?: string;
  secondNaturalness?: string;
};

type Props = {
  report: FlightInstructorReport;
  feedback: EvaluateFeedback;
  onTryAgain: () => void;
  onAnswerFollowUp?: (question: string) => void;
  attemptCompare?: AttemptCompare | null;
  followUpBanner?: string | null;
  /** Part 1 HEX: follow-ups handled by examiner conversation, not Captain. */
  suppressFollowUp?: boolean;
};

function naturalnessClass(level: FlightInstructorReport["naturalnessReview"]["level"]): string {
  if (level === "professional_pilot" || level === "natural") return "good";
  if (level === "understandable") return "warn";
  return "bad";
}

function bandClass(band: SkillBand): string {
  if (band === "operational") return "good";
  if (band === "developing") return "warn";
  return "bad";
}

function IcaoBandRow({
  label,
  band,
  detail,
}: {
  label: string;
  band: SkillBand;
  detail: string;
}) {
  return (
    <details className="fi-band-row">
      <summary className={`fi-band-summary ${bandClass(band)}`}>
        <span>{label}</span>
        <strong>{SKILL_BAND_LABELS[band]}</strong>
      </summary>
      <p className="fi-band-detail">{detail}</p>
    </details>
  );
}

export default function FlightInstructorReportPanel({
  report,
  feedback,
  onTryAgain,
  onAnswerFollowUp,
  attemptCompare,
  followUpBanner,
  suppressFollowUp = false,
}: Props) {
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="fi-report fi-captain-delta">
      <header className="fi-report-hero">
        <span className="fi-badge">👨‍✈️ Captain Delta</span>
        {report.memoryNote && (
          <p className="fi-memory-inline">{report.memoryNote}</p>
        )}
      </header>

      <section className="fi-section fi-positive">
        <h3>1 · Positive opening</h3>
        <ul>
          {report.positiveOpening.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="fi-section">
        <h3>2 · Naturalness review</h3>
        <p className={`fi-naturalness-score ${naturalnessClass(report.naturalnessReview.level)}`}>
          {NATURALNESS_LABELS[report.naturalnessReview.level]}
        </p>
        <p className="fi-level-why">{report.naturalnessReview.levelWhy}</p>
        <p>{report.naturalnessReview.summary}</p>
        {report.naturalnessReview.suggestions.length > 0 && (
          <ul className="fi-suggestions">
            {report.naturalnessReview.suggestions.map((s, i) => (
              <li key={`${s.studentPhrase}-${s.pilotPhrase}`}>
                {i === 0 ? (
                  <>
                    <span className="fi-student-line" data-captain-target="student-answer">
                      You: {s.studentPhrase}
                    </span>
                    <span className="fi-pilot-line" data-captain-target="pilot-suggestion">
                      I would naturally say: {s.pilotPhrase}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="fi-student-line">You: {s.studentPhrase}</span>
                    <span className="fi-pilot-line">I would naturally say: {s.pilotPhrase}</span>
                  </>
                )}
                <span className="fi-why">{s.why}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {report.pilotLanguageReview.length > 0 && (
        <section className="fi-section">
          <h3>3 · Pilot language</h3>
          <ul className="fi-pilot-terms">
            {report.pilotLanguageReview.map((p) => (
              <li key={p.term}>
                <strong>{p.term}</strong> — {p.usage}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="fi-section fi-priority">
        <h3>4 · Today&apos;s focus</h3>
        <p className="fi-priority-focus">{report.priorityImprovement.focus}</p>
        <p>{report.priorityImprovement.detail}</p>
      </section>

      <section className="fi-section fi-mission">
        <h3>5 · Mission</h3>
        <p className="fi-mission-title">{report.mission.title}</p>
        <p className="fi-mission-label">Use in your next answer:</p>
        <ul>
          {report.mission.expressions.map((expr) => (
            <li key={expr} data-captain-target={`keyword-${expr.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              • {expr}
            </li>
          ))}
        </ul>
        <p className="fi-mission-time">Estimated: {report.mission.estimatedMinutes} minutes</p>
      </section>

      <section className="fi-section fi-vocab">
        <h3>Pilot vocabulary</h3>
        {report.pilotVocabulary.alreadyUsed.length > 0 && (
          <>
            <p className="fi-vocab-label">You already used</p>
            <ul className="fi-vocab-used">
              {report.pilotVocabulary.alreadyUsed.map((w) => (
                <li key={w}>✔ {w}</li>
              ))}
            </ul>
          </>
        )}
        {report.pilotVocabulary.nextToLearn.length > 0 && (
          <>
            <p className="fi-vocab-label">Next expressions to learn</p>
            <ul>
              {report.pilotVocabulary.nextToLearn.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="fi-section fi-icao-bands">
        <h3>ICAO training estimate</h3>
        <p className="fi-disclaimer">{report.icaoBands.disclaimer}</p>
        <div className="fi-bands">
          <IcaoBandRow
            label="Pronunciation"
            band={report.icaoBands.pronunciation.band}
            detail={report.icaoBands.pronunciation.detail}
          />
          <IcaoBandRow
            label="Fluency"
            band={report.icaoBands.fluency.band}
            detail={report.icaoBands.fluency.detail}
          />
          <IcaoBandRow
            label="Vocabulary"
            band={report.icaoBands.vocabulary.band}
            detail={report.icaoBands.vocabulary.detail}
          />
          <IcaoBandRow
            label="Structure"
            band={report.icaoBands.structure.band}
            detail={report.icaoBands.structure.detail}
          />
          <IcaoBandRow
            label="Interaction"
            band={report.icaoBands.interaction.band}
            detail={report.icaoBands.interaction.detail}
          />
        </div>
        <p className="fi-level-estimate">
          Training level estimate: <strong>ICAO {report.icaoBands.estimatedLevel}</strong>
        </p>
      </section>

      <section className="fi-section fi-compare">
        <button
          type="button"
          className="fi-compare-toggle"
          onClick={() => setCompareOpen((o) => !o)}
        >
          {compareOpen ? "Hide" : "Show"} answer comparison
        </button>
        {compareOpen && (
          <>
            <div className="fi-version-block">
              <strong>Your answer</strong>
              <p>{report.improvedAnswer.studentVersion}</p>
            </div>
            <div className="fi-version-block coach">
              <strong>Coach answer</strong>
              <p>{report.improvedAnswer.coachVersion}</p>
            </div>
            {report.improvedAnswer.whatChanged.length > 0 && (
              <>
                <h4>What changed</h4>
                <ul className="fi-what-changed">
                  {report.improvedAnswer.whatChanged.map((c) => (
                    <li key={c.change}>
                      <strong>{c.change}</strong>
                      <span>{c.why}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </section>

      {report.followUpQuestion && onAnswerFollowUp && !suppressFollowUp && (
        <section className="fi-section fi-followup">
          <h3>Examiner follow-up</h3>
          <p className="fi-followup-q">{report.followUpQuestion}</p>
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => onAnswerFollowUp(report.followUpQuestion!)}
          >
            Answer this follow-up
          </button>
        </section>
      )}

      {followUpBanner && (
        <p className="fi-followup-active">Follow-up mode: {followUpBanner}</p>
      )}

      {attemptCompare && (
        <section className="fi-section fi-replay-compare">
          <h3>Attempt 1 vs Attempt 2</h3>
          <div className="fi-attempt-grid">
            <div>
              <strong>Attempt 1</strong>
              <p>{attemptCompare.first.scores.overall}% overall</p>
            </div>
            <div>
              <strong>Attempt 2</strong>
              <p>{attemptCompare.second.scores.overall}% overall</p>
            </div>
          </div>
          <p className="fi-replay-delta">
            {attemptCompare.second.scores.overall - attemptCompare.first.scores.overall >= 0
              ? `↑ +${attemptCompare.second.scores.overall - attemptCompare.first.scores.overall} points — you're improving.`
              : "Keep the mission expressions in mind — one more try."}
          </p>
        </section>
      )}

      <p className="fi-closing">{report.closingLine}</p>

      <details className="fi-technical-scores">
        <summary>Technical scores</summary>
        <div className="voice-coach-scores">
          <div className="voice-score overall">
            <strong>{feedback.scores.overall}</strong>
            <span>geral</span>
          </div>
          <div className="voice-score">
            <strong>{feedback.scores.content}</strong>
            <span>conteúdo</span>
          </div>
          <div className="voice-score">
            <strong>{feedback.scores.structure}</strong>
            <span>estrutura</span>
          </div>
          <div className="voice-score">
            <strong>{feedback.scores.phraseology}</strong>
            <span>fraseologia</span>
          </div>
          <div className="voice-score">
            <strong>{feedback.scores.pronunciation}</strong>
            <span>pronúncia</span>
          </div>
        </div>
      </details>

      <button type="button" className="btn green btn-large fi-try-again" onClick={onTryAgain}>
        🎤 Record Again
      </button>
    </div>
  );
}
