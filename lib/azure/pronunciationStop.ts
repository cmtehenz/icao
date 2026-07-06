import type { RecognizerLifecycle } from "@/lib/azure/recognizerLifecycle";

export type PronunciationStopSource =
  | "user_click"
  | "effect_cleanup"
  | "route_change"
  | "captain_action"
  | "auto_effect"
  | "word_clear"
  | "unknown";

/** Stop is only accepted from an explicit Captain stop click while listening. */
export function shouldAllowPronunciationStop(
  lifecycle: RecognizerLifecycle,
  source: PronunciationStopSource,
): boolean {
  if (source === "user_click") {
    return lifecycle === "listening";
  }
  if (lifecycle === "starting" || lifecycle === "listening" || lifecycle === "stopping") {
    return false;
  }
  return true;
}
