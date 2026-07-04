"use client";

import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import {
  NATURALNESS_LABELS,
  PILOT_VOCAB_LABELS,
} from "@/lib/flightInstructor/types";
import IcaoLevelPanel from "@/components/IcaoLevelPanel";
import type { EvaluateFeedback } from "@/lib/evaluate/types";

type AttemptCompare = {
  first: EvaluateFeedback;
  second: EvaluateFeedback;
};

type Props = {
  report: FlightInstructorReport;
  feedback: EvaluateFeedback;
  onTryAgain: () => void;
  attemptCompare?: AttemptCompare | null;
};

function naturalnessClass(level: FlightInstructorReport["naturalnessReview"]["level"]): string {
  if (level === "professional_pilot" || level === "natural") return "good";
  if (level === "acceptable") return "warn";
  return "bad";
}

export default function FlightInstructorReportPanel({
  report,
  feedback,
  onTryAgain,
  attemptCompare,
}: Props) {
  return (
    <div className="fi-report">
      <header className="fi-report-hero">
        <span className="fi-badge">✈️ AI Flight Instructor</span>
        <p className="fi-confidence">{report.confidenceMessage}</p>
      </header>

      <section className="fi-section fi-positive">
        <h3>What you did well</h3>
        <ul>
          {report.positiveFeedback.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="fi-section">
        <h3>Naturalness</h3>
        <p className={`fi-naturalness-score ${naturalnessClass(report.naturalnessReview.level)}`}>
          {NATURALNESS_LABELS[report.naturalnessReview.level]}
        </p>
        <p>{report.naturalnessReview.summary}</p>
        {report.naturalnessReview.suggestions.length > 0 && (
          <ul className="fi-suggestions">
            {report.naturalnessReview.suggestions.map((s) => (
              <li key={`${s.studentPhrase}-${s.pilotPhrase}`}>
                <span className="fi-student-line">You: {s.studentPhrase}</span>
                <span className="fi-pilot-line">Pilot: {s.pilotPhrase}</span>
                <span className="fi-why">{s.why}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fi-section">
        <h3>ICAO training estimate</h3>
        <p className="fi-disclaimer">{report.icaoEvaluation.disclaimer}</p>
        {feedback.icaoLevel && <IcaoLevelPanel rating={feedback.icaoLevel} />}
        <ul className="fi-criteria-notes">
          <li><strong>Pronunciation:</strong> {report.icaoEvaluation.pronunciation}</li>
          <li><strong>Fluency:</strong> {report.icaoEvaluation.fluency}</li>
          <li><strong>Vocabulary:</strong> {report.icaoEvaluation.vocabulary}</li>
          <li><strong>Structure:</strong> {report.icaoEvaluation.structure}</li>
          <li><strong>Interaction:</strong> {report.icaoEvaluation.interaction}</li>
        </ul>
        <p className="fi-level-estimate">
          Estimated level: <strong>ICAO {report.icaoEvaluation.estimatedLevel}</strong>
        </p>
      </section>

      <section className="fi-section fi-compare">
        <h3>Improve my answer</h3>
        <div className="fi-version-block">
          <strong>Your version</strong>
          <p>{report.improvedAnswer.studentVersion}</p>
        </div>
        <div className="fi-version-block coach">
          <strong>Coach version</strong>
          <p>{report.improvedAnswer.coachVersion}</p>
        </div>
        {report.improvedAnswer.whatChanged.length > 0 && (
          <>
            <h4>What changed</h4>
            <ul>
              {report.improvedAnswer.whatChanged.map((c) => (
                <li key={c.change}>
                  <strong>{c.change}</strong> — {c.why}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {report.pilotLanguage.length > 0 && (
        <section className="fi-section">
          <h3>Pilot language</h3>
          <ul className="fi-pilot-terms">
            {report.pilotLanguage.map((p) => (
              <li key={p.term}>
                <strong>{p.term}</strong> — {p.usage}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="fi-section fi-memory">
        <h3>Memory coaching</h3>
        <p className="fi-memory-note">{report.memoryCoaching.note}</p>
        <div className="fi-memory-chain">
          {report.memoryCoaching.keyIdeas.map((idea, i) => (
            <span key={idea}>
              {i > 0 && <span className="fi-memory-arrow">↓</span>}
              <span className="fi-memory-step">{idea}</span>
            </span>
          ))}
        </div>
      </section>

      {report.personalCoaching && (
        <section className="fi-section fi-personal">
          <h3>Personal coaching</h3>
          <p>{report.personalCoaching}</p>
        </section>
      )}

      <section className="fi-section">
        <h3>Pilot vocabulary</h3>
        <p className="fi-vocab-rating">{PILOT_VOCAB_LABELS[report.pilotVocabulary.rating]}</p>
        {report.pilotVocabulary.missingExpressions.length > 0 && (
          <p>Missing aviation expressions: {report.pilotVocabulary.missingExpressions.join(", ")}</p>
        )}
      </section>

      <section className="fi-section fi-mission">
        <h3>Next mission</h3>
        <ul>
          {report.nextMission.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="fi-mission-time">Estimated: {report.nextMission.estimatedMinutes} minutes</p>
      </section>

      {attemptCompare && (
        <section className="fi-section fi-replay-compare">
          <h3>First vs second attempt</h3>
          <div className="fi-attempt-grid">
            <div>
              <strong>First attempt</strong>
              <p>{attemptCompare.first.scores.overall}% overall</p>
            </div>
            <div>
              <strong>Second attempt</strong>
              <p>{attemptCompare.second.scores.overall}% overall</p>
            </div>
          </div>
          <p className="fi-replay-delta">
            {attemptCompare.second.scores.overall - attemptCompare.first.scores.overall >= 0
              ? `↑ +${attemptCompare.second.scores.overall - attemptCompare.first.scores.overall} points — nice improvement!`
              : `Keep practicing — focus on the coach version above.`}
          </p>
        </section>
      )}

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
        🎤 Try Again
      </button>
    </div>
  );
}
