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
import {
  buildConnectorStructurePlan,
  buildKeywordModePlan,
  buildLiveSentencePlan,
  buildPart2ElementPlan,
  buildPronunciationFocusPlan,
  buildVisualMissionPlan,
} from "@/lib/captainDelta/visual/plans";
import { keywordTargetId } from "@/lib/captainDelta/visual/types";

const PART2_ELEMENTS = ["altitude", "heading", "frequency", "runway", "emergency"];

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
          visual.applyPlan(buildVisualMissionPlan(lesson.keywords), speech);
          return;
        }

        if (
          lesson.keywords?.length &&
          (msg.primaryAction.id === "explain_it" ||
            msg.secondaryActions.some((a) => a.id === "show_keywords"))
        ) {
          visual.applyPlan(buildKeywordModePlan(lesson.keywords), speech);
          return;
        }

        if (
          msg.secondaryActions.some((a) => a.id === "show_model") ||
          /connector|structure|first of all|additionally/i.test(speech)
        ) {
          visual.applyPlan(buildConnectorStructurePlan(), speech);
          return;
        }

        if (lesson.keywords?.length) {
          visual.applyPlan(
            {
              steps: [],
              speechTerms: lesson.keywords.map((term) => ({
                term,
                targetId: keywordTargetId(term),
              })),
            },
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
        visual.applyPlan(buildKeywordModePlan(cd.lesson.keywords));
      }
      if (actionId === "show_model") {
        visual.applyPlan(buildConnectorStructurePlan());
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
