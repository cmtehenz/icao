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
    label: "Build anchors",
    technique: "One idea at a time",
    captainHint: "Four short points — paraphrase each anchor. No full script.",
  },
  {
    id: "keywords",
    label: "Connect story",
    technique: "Guided retrieval",
    captainHint: "One section at a time, then the full answer from keywords.",
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

function pipelineContext(ctx: Part1PipelineContext) {
  const missionCard =
    ctx.missionCard ??
    getOrCreatePart1DailyMission().cards.find((c) => c.cardNum === ctx.cardNum);
  const study = ctx.study ?? getPart1CardStudyProgress(ctx.cardNum);
  const shadowComplete =
    part1CardAllPeelBlocksDoneToday(ctx.cardNum) || !!missionCard?.shadowDone;
  return { missionCard, study, shadowComplete };
}

/** Deep links (?shadow=1 / ?coach=1) never skip brief or anchors — Flight Manual §06. */
export function resolvePart1PipelineStep(ctx: Part1PipelineContext): Part1PipelineStepId {
  const { missionCard, study, shadowComplete } = pipelineContext(ctx);

  if (!study.briefSeen) return "brief";
  if (!study.anchorDone) return "anchor";
  if (!shadowComplete) return "shadow";
  if (!study.keywordsDone) return "keywords";
  if (!missionCard?.coachDone) return "coach";
  return "complete";
}

export function isPart1PipelineStepComplete(
  stepId: Part1PipelineStepId,
  ctx: Part1PipelineContext,
): boolean {
  const { missionCard, study, shadowComplete } = pipelineContext(ctx);
  switch (stepId) {
    case "brief":
      return study.briefSeen;
    case "anchor":
      return study.anchorDone;
    case "shadow":
      return shadowComplete;
    case "keywords":
      return study.keywordsDone;
    case "coach":
      return !!missionCard?.coachDone;
    case "complete":
      return resolvePart1PipelineStep(ctx) === "complete";
    default:
      return false;
  }
}

export function part1PipelineStepMeta(id: Part1PipelineStepId): Part1PipelineStep {
  return PART1_PIPELINE.find((s) => s.id === id) ?? PART1_PIPELINE[0]!;
}

export function part1PipelineIndex(id: Part1PipelineStepId): number {
  const idx = PART1_PIPELINE.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}
