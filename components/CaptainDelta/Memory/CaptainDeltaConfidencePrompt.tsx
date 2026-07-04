"use client";

import type { ConfidenceLevel } from "@/lib/captainDelta/memory/types";
import { recordConfidence } from "@/lib/captainDelta/memory/record";

type Props = {
  questionId: string;
  onSelect: (level: ConfidenceLevel) => void;
};

const OPTIONS: { level: ConfidenceLevel; label: string; icon: string }[] = [
  { level: "very_confident", label: "Very confident", icon: "💪" },
  { level: "confident", label: "Confident", icon: "✓" },
  { level: "unsure", label: "Unsure", icon: "?" },
];

export default function CaptainDeltaConfidencePrompt({ questionId, onSelect }: Props) {
  return (
    <div className="cdm-confidence" aria-label="How confident did you feel?">
      <p className="cdm-confidence-label">Captain Delta — how did that feel?</p>
      <div className="cdm-confidence-options">
        {OPTIONS.map((opt) => (
          <button
            key={opt.level}
            type="button"
            className="cdm-confidence-btn"
            onClick={() => {
              recordConfidence(questionId, opt.level);
              onSelect(opt.level);
            }}
          >
            <span aria-hidden>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
