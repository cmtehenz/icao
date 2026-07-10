import {
  getOrCreatePart1DailyMission,
  part1CardAllPeelBlocksDoneToday,
  type Part1CardMission,
} from "@/lib/part1DailyMission";
import { getPart1CardStudyProgress } from "@/lib/part1Mastery/progress";

/** Six-step anti-memorization pipeline (Flight Manual §06). */
export type Part1PipelineStepId =
  | "brief"
  | "anchor"
  | "shadow"
  | "keywords"
  | "coach"
  | "complete";

export type Part1PipelineStep = {
  id: Part1PipelineStepId;
  label: string;
  technique: string;
  captainHint: string;
};

export const PART1_PIPELINE: Part1PipelineStep[] = [
  {
    id: "brief",
    label: "Exam question",
    technique: "Priming",
    captainHint: "Read the question. Picture a real briefing — no script yet.",
  },
  {
    id: "anchor",
    label: "Memory anchors",
    technique: "Story pegs",
    captainHint: "Say the four ideas aloud. Pegs first — not the paragraph.",
  },
  {
    id: "shadow",
    label: "PEEL shadow",
    technique: "Chunking",
    captainHint: "One block at a time. Shadow until each chunk is clear.",
  },
  {
    id: "keywords",
    label: "Keywords speak",
    technique: "Retrieval practice",
    captainHint: "Keywords only. Build the answer in your own words.",
  },
  {
    id: "coach",
    label: "Solo answer",
    technique: "Self-explanation",
    captainHint: "Full answer under light pressure. I debrief structure and ops language.",
  },
  {
    id: "complete",
    label: "Exam ready",
    technique: "Mastery gate",
    captainHint: "This question is in your operational speech — not memorized.",
  },
];

export type Part1PipelineContext = {
  cardNum: string;
  missionCard?: Part1CardMission;
  study?: ReturnType<typeof getPart1CardStudyProgress>;
  forceShadow?: boolean;
  forceCoach?: boolean;
};

export function resolvePart1PipelineStep(ctx: Part1PipelineContext): Part1PipelineStepId {
  if (ctx.forceCoach) return "coach";
  if (ctx.forceShadow) return "shadow";

  const missionCard =
    ctx.missionCard ??
    getOrCreatePart1DailyMission().cards.find((c) => c.cardNum === ctx.cardNum);
  const study = ctx.study ?? getPart1CardStudyProgress(ctx.cardNum);

  if (!study.briefSeen) return "brief";
  if (!study.anchorDone) return "anchor";
  if (!part1CardAllPeelBlocksDoneToday(ctx.cardNum) && !missionCard?.shadowDone) return "shadow";
  if (!study.keywordsDone) return "keywords";
  if (!missionCard?.coachDone) return "coach";
  return "complete";
}

export function part1PipelineStepMeta(id: Part1PipelineStepId): Part1PipelineStep {
  return PART1_PIPELINE.find((s) => s.id === id) ?? PART1_PIPELINE[0]!;
}

export function part1PipelineIndex(id: Part1PipelineStepId): number {
  const idx = PART1_PIPELINE.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}
