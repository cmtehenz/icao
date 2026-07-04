import type { VisualCoachPlan } from "@/lib/captainDelta/visual/types";
import { connectorTargetId, keywordTargetId } from "@/lib/captainDelta/visual/types";

const CONNECTORS = [
  "first of all",
  "additionally",
  "for example",
  "finally",
  "however",
  "therefore",
];

export function buildKeywordModePlan(keywords: string[]): VisualCoachPlan {
  const terms = keywords.slice(0, 6).map((term) => ({
    term,
    targetId: keywordTargetId(term),
  }));

  return {
    id: "keyword-mode",
    focusMode: true,
    speechTerms: terms,
    steps: terms.map((t, i) => ({
      targetId: t.targetId,
      style: "pulse" as const,
      delayMs: i * 900,
      durationMs: 1200,
    })),
    collapseTargets: ["coach-answer-basic", "coach-answer-elaborate", "coach-answer-example"],
    missionTerms: keywords.slice(0, 4),
  };
}

export function buildLiveSentencePlan(
  studentPhrase: string,
  pilotPhrase: string,
): VisualCoachPlan {
  return {
    id: "live-sentence",
    focusMode: true,
    steps: [
      {
        targetId: "student-answer",
        style: "underline",
        delayMs: 400,
        durationMs: 3200,
      },
      {
        targetId: "pilot-suggestion",
        style: "glow",
        delayMs: 3600,
        durationMs: 4000,
      },
    ],
    speechTerms: [
      { term: studentPhrase.split(/\s+/).slice(0, 3).join(" "), targetId: "student-answer" },
      { term: pilotPhrase.split(/\s+/).slice(0, 3).join(" "), targetId: "pilot-suggestion" },
    ],
  };
}

export function buildPronunciationFocusPlan(word: string, weakSyllable?: string): VisualCoachPlan {
  const syllableId = weakSyllable
    ? `syllable-${weakSyllable.toLowerCase()}`
    : "pronunciation-word";

  return {
    id: "pronunciation-focus",
    focusMode: true,
    steps: [
      {
        targetId: "pronunciation-word",
        style: "spotlight",
        delayMs: 200,
        durationMs: 5000,
      },
      ...(weakSyllable
        ? [
            {
              targetId: syllableId,
              style: "circle" as const,
              delayMs: 800,
              durationMs: 4500,
            },
          ]
        : []),
    ],
    speechTerms: [{ term: word, targetId: "pronunciation-word" }],
  };
}

export function buildConnectorStructurePlan(): VisualCoachPlan {
  const terms = CONNECTORS.map((c) => ({
    term: c,
    targetId: connectorTargetId(c),
  }));

  return {
    id: "connectors",
    steps: terms.map((t, i) => ({
      targetId: t.targetId,
      style: "pulse" as const,
      delayMs: i * 700,
      durationMs: 900,
    })),
    speechTerms: terms,
  };
}

export function buildReadingInterruptPlan(): VisualCoachPlan {
  return {
    id: "reading-interrupt",
    focusMode: true,
    collapseTargets: ["coach-answer-basic", "coach-answer-elaborate", "coach-answer-example"],
    steps: [
      {
        targetId: "coach-keywords",
        style: "spotlight",
        delayMs: 300,
        durationMs: 5000,
      },
    ],
  };
}

export function buildVisualMissionPlan(terms: string[]): VisualCoachPlan {
  return {
    id: "visual-mission",
    steps: terms.slice(0, 4).map((term, i) => ({
      targetId: keywordTargetId(term),
      style: "glow" as const,
      delayMs: i * 600,
      durationMs: 1800,
    })),
    missionTerms: terms.slice(0, 4),
    speechTerms: terms.slice(0, 4).map((term) => ({
      term,
      targetId: keywordTargetId(term),
    })),
  };
}

export function buildPart2ElementPlan(element: string): VisualCoachPlan {
  const id = keywordTargetId(element);
  return {
    id: "part2-element",
    focusMode: true,
    steps: [{ targetId: id, style: "glow", delayMs: 200, durationMs: 2500 }],
    speechTerms: [{ term: element, targetId: id }],
  };
}
