"use client";

import type { ConversationProgressView } from "@/lib/aiPresence/types";
import type { ConversationSessionPhase } from "@/lib/aiPresence/types";
import { examinerThinkingLine } from "@/lib/aiPresence/conversationPresence";

type Props = {
  progress: ConversationProgressView;
  phase: ConversationSessionPhase;
  examinerLine?: string | null;
  showThinking: boolean;
};

export default function ExaminerPresencePanel({
  progress,
  phase,
  examinerLine,
  showThinking,
}: Props) {
  const closing = phase === "conversation_closing";

  return (
    <section className="hex-presence-panel" aria-label="Oral assessment status">
      <div className="hex-presence-banner">
        <p className="hex-presence-title">
          <span aria-hidden>🎙</span> ICAO Examiner conducting oral assessment.
        </p>
        <p className="hex-presence-sub">
          Captain Delta is listening. You&apos;ll receive coaching after this discussion.
        </p>
      </div>

      <ConversationProgressRail progress={progress} phase={phase} />

      {showThinking && (
        <p className="hex-examiner-thinking" aria-live="polite">
          <span className="hex-thinking-dot" aria-hidden />
          {examinerThinkingLine()}
        </p>
      )}

      {examinerLine && !showThinking && (
        <div className={`hex-examiner-line ${closing ? "hex-examiner-closing" : ""}`}>
          <strong>{closing ? "Examiner" : "Examiner follow-up"}</strong>
          <p>{examinerLine}</p>
        </div>
      )}

      <div className="hex-captain-standby" aria-label="Captain Delta standby">
        <span className="hex-standby-pulse" aria-hidden />
        <span>
          <strong>Captain Delta</strong> —{" "}
          {phase === "conversation_closing" || phase === "captain_standby"
            ? "Preparing your debrief…"
            : "Listening…"}
        </span>
      </div>
    </section>
  );
}

function ConversationProgressRail({
  progress,
  phase,
}: {
  progress: ConversationProgressView;
  phase: ConversationSessionPhase;
}) {
  return (
    <div className="hex-conversation-progress">
      <div className="hex-progress-count">
        <span>{progress.discussionLabel}</span>
        <strong>
          {progress.current} / {progress.total}
        </strong>
      </div>
      <ol className="hex-progress-stages">
        {progress.stages.map((label, i) => {
          const active = i === progress.stageIndex;
          const done = i < progress.stageIndex || phase === "captain_debrief";
          return (
            <li
              key={label}
              className={`hex-stage ${active ? "active" : ""} ${done ? "done" : ""}`}
            >
              {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
