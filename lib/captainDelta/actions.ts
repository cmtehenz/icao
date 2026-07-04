import type {
  CaptainDeltaAction,
  CaptainDeltaActionId,
  CaptainDeltaContext,
  CaptainDeltaLessonContext,
  CaptainDeltaMessageKind,
} from "@/lib/captainDelta/types";

function mic(label: string, id: CaptainDeltaActionId): CaptainDeltaAction {
  return { id, label: `🎤 ${label}`, primary: true };
}

function secondary(id: CaptainDeltaActionId, label: string): CaptainDeltaAction {
  return { id, label, primary: false };
}

/** Phase 1 — one contextual primary action per screen. Never generic Answer / Reply / Continue. */
export function resolvePrimaryAction(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
  kind: CaptainDeltaMessageKind,
): CaptainDeltaAction {
  if (kind === "followup") return mic("Explain It", "explain_it");
  if (kind === "debrief") return mic("Explain It", "explain_it");
  if (kind === "briefing") return mic("Start Training", "ready");
  if (kind === "context") return primaryForRoute(route, lesson);

  if (kind === "coaching" || lesson.hasFeedback) {
    if (lesson.mode === "pronunciation" || route === "pronunciation") {
      return mic("Repeat", "repeat_after_me");
    }
    if (lesson.part2Kind === "readback") return mic("Read Back", "read_back");
    if (lesson.part2Kind === "reported") return mic("Read Back", "read_back");
    if (lesson.part2Kind === "picture") return mic("Describe", "describe_picture");
    if (lesson.mode === "memory" || route === "memory") {
      return mic("Explain It", "explain_your_way");
    }
    return mic("Try Again", "try_again");
  }

  if (lesson.recording) return mic("Try Again", "try_again");

  return primaryForRoute(route, lesson);
}

function primaryForRoute(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
): CaptainDeltaAction {
  switch (route) {
    case "dashboard":
      return mic("Start Training", "ready");
    case "part1":
      return mic("Explain It", "explain_your_way");
    case "part2":
      if (lesson.part2Kind === "picture") return mic("Describe", "describe_picture");
      if (lesson.part2Kind === "reported") return mic("Read Back", "read_back");
      return mic("Read Back", "read_back");
    case "pronunciation":
      return mic("Repeat", "repeat_after_me");
    case "vocabulary":
      return mic("Repeat", "repeat_after_me");
    case "memory":
      return mic("Explain It", "explain_your_way");
    case "simulation":
      return mic("Start Training", "start_exam");
    case "listen":
      return mic("Start Training", "ready");
    default:
      return mic("Explain It", "explain_it");
  }
}

/** Phase 1 — maximum two secondary actions. */
export function resolveSecondaryActions(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
  kind: CaptainDeltaMessageKind,
): CaptainDeltaAction[] {
  const actions: CaptainDeltaAction[] = [];

  if (route === "part1" || lesson.mode === "coach") {
    if (lesson.keywords?.length) {
      actions.push(secondary("show_keywords", "📖 Show Keywords"));
    }
    if (lesson.hasModelAnswer) {
      actions.push(secondary("show_model", "📝 Show Model Answer"));
    }
  }

  if (route === "part2" || route === "listen" || lesson.mode === "simulation") {
    actions.push(secondary("listen_again", "▶ Listen Again"));
  }

  if (route === "pronunciation") {
    actions.push(secondary("slow_audio", "🎧 Slow Audio"));
  }

  if (kind === "coaching" && actions.length < 2) {
    actions.push(secondary("give_example", "🎤 Give Me an Example"));
  }

  if (actions.length < 2) {
    actions.push(secondary("show_hint", "💡 I'm Stuck"));
  }

  return actions
    .filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i)
    .slice(0, 2);
}
