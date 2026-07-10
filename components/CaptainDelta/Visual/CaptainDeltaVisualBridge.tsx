"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCaptainDelta } from "@/components/CaptainDelta/CaptainDeltaProvider";
import { useCaptainDeltaVisual } from "@/components/CaptainDelta/Visual/CaptainDeltaVisualProvider";
import {
  CAPTAIN_DELTA_AFTER_ANSWER,
  CAPTAIN_DELTA_DEBRIEF,
} from "@/lib/captainDelta/events";
import type { CaptainDeltaAfterAnswerPayload } from "@/lib/captainDelta/types";
import {
  CAPTAIN_DELTA_LESSON_CONTEXT,
  CAPTAIN_DELTA_SECONDARY_ACTION,
} from "@/lib/captainDelta/lessonContext";
import type { VisualCoachPlan } from "@/lib/captainDelta/visual/types";
import { keywordTargetId } from "@/lib/captainDelta/visual/types";
import {
  buildConnectorStructurePlan,
  buildKeywordModePlan,
  buildLiveSentencePlan,
  buildPart2ElementPlan,
  buildPronunciationFocusPlan,
  buildVisualMissionPlan,
} from "@/lib/captainDelta/visual/plans";

const PART2_ELEMENTS = ["altitude", "heading", "frequency", "runway", "emergency"];

/** Part 1 daily coach — keep answer examples visible until the student records. */
function planForPart1CoachPrep(
  plan: VisualCoachPlan,
  context: string | undefined,
  lesson: { mode?: string; hasFeedback?: boolean },
): VisualCoachPlan {
  if (context === "part1" && lesson.mode === "coach" && !lesson.hasFeedback) {
    return { ...plan, focusMode: false, collapseTargets: undefined };
  }
  return plan;
}

function applyVisualPlan(
  visual: NonNullable<ReturnType<typeof useCaptainDeltaVisual>>,
  plan: VisualCoachPlan,
  context: string | undefined,
  lesson: { mode?: string; hasFeedback?: boolean },
  speech?: string,
): void {
  visual.applyPlan(planForPart1CoachPrep(plan, context, lesson), speech);
}

/** Phase 2 bridge — listens to Phase 1 state/events without modifying Phase 1 files. */
export default function CaptainDeltaVisualBridge() {
  const cd = useCaptainDelta();
  const visual = useCaptainDeltaVisual();
  const pathname = usePathname();
  const lastMessageIdRef = useRef<string | null>(null);
  const voicePlayingRef = useRef(false);

  const clearPlan = visual?.clearPlan;

  useEffect(() => {
    clearPlan?.();
  }, [pathname, clearPlan]);

  useEffect(() => {
    if (!visual || !cd.currentMessage) return;

    const msg = cd.currentMessage;
    const speech = msg.speechText ?? msg.text;
    const { lesson, context } = cd;

    if (cd.voice.state === "playing" && lastMessageIdRef.current !== msg.id) {
      lastMessageIdRef.current = msg.id;
      voicePlayingRef.current = true;

      if (context === "pronunciation") {
        if (lesson.pronunciationWord) {
          visual.applyPlan(buildPronunciationFocusPlan(lesson.pronunciationWord), speech);
        }
        return;
      }

      if (context === "part1" || context === "dashboard") {
        if (msg.kind === "mission" && lesson.keywords?.length) {
          applyVisualPlan(visual, buildVisualMissionPlan(lesson.keywords), context, lesson, speech);
          return;
        }

        if (
          lesson.keywords?.length &&
          (msg.primaryAction.id === "explain_it" ||
            msg.secondaryActions.some((a) => a.id === "show_keywords"))
        ) {
          applyVisualPlan(visual, buildKeywordModePlan(lesson.keywords), context, lesson, speech);
          return;
        }

        if (
          msg.secondaryActions.some((a) => a.id === "show_model") ||
          /connector|structure|first of all|additionally/i.test(speech)
        ) {
          applyVisualPlan(visual, buildConnectorStructurePlan(), context, lesson, speech);
          return;
        }

        if (lesson.keywords?.length) {
          applyVisualPlan(
            visual,
            {
              steps: [],
              speechTerms: lesson.keywords.map((term) => ({
                term,
                targetId: keywordTargetId(term),
              })),
            },
            context,
            lesson,
            speech,
          );
        }
        return;
      }

      if (context === "part2" || context === "simulation") {
        if (lesson.simulationStep) {
          const match = PART2_ELEMENTS.find((el) =>
            speech.toLowerCase().includes(el),
          );
          if (match) {
            visual.applyPlan(buildPart2ElementPlan(match), speech);
          }
        }
      }
    }

    if (cd.voice.state === "idle" && voicePlayingRef.current) {
      voicePlayingRef.current = false;
    }
  }, [visual, cd.voice.state, cd.currentMessage, cd.lesson, cd.context]);

  useEffect(() => {
    const onAfterAnswer = (e: Event) => {
      const detail = (e as CustomEvent<CaptainDeltaAfterAnswerPayload>).detail;
      if (!detail || !visual) return;
      if (cd.context !== "part1" && cd.context !== "part2" && cd.context !== "dashboard") {
        return;
      }
      const suggestion = detail.report.naturalnessReview.suggestions[0];
      if (!suggestion) return;

      visual.applyPlan(
        buildLiveSentencePlan(suggestion.studentPhrase, suggestion.pilotPhrase),
        `I understand your idea. But experienced pilots usually say ${suggestion.pilotPhrase}`,
      );

      if (detail.report.mission.expressions.length) {
        window.setTimeout(() => {
          visual.applyPlan(buildVisualMissionPlan(detail.report.mission.expressions));
        }, 8000);
      }
    };

    const onDebrief = () => {
      /* mission highlights handled via message playback */
    };

    const onSecondary = (e: Event) => {
      const actionId = (e as CustomEvent<{ actionId: string }>).detail?.actionId;
      if (!visual || !cd.lesson.keywords?.length) return;
      if (cd.context !== "part1" && cd.context !== "dashboard") return;
      if (actionId === "show_keywords") {
        applyVisualPlan(visual, buildKeywordModePlan(cd.lesson.keywords), cd.context, cd.lesson);
      }
      if (actionId === "show_model") {
        applyVisualPlan(visual, buildConnectorStructurePlan(), cd.context, cd.lesson);
      }
    };

    window.addEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
    window.addEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
    window.addEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
    window.addEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onDebrief);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_AFTER_ANSWER, onAfterAnswer);
      window.removeEventListener(CAPTAIN_DELTA_DEBRIEF, onDebrief);
      window.removeEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, onSecondary);
      window.removeEventListener(CAPTAIN_DELTA_LESSON_CONTEXT, onDebrief);
    };
  }, [visual, cd.lesson.keywords, cd.context]);

  return null;
}
