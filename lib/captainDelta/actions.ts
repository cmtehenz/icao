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

export function resolvePrimaryAction(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
  kind: CaptainDeltaMessageKind,
): CaptainDeltaAction {
  if (kind === "followup") return mic("Answer", "answer_followup");
  if (kind === "debrief") return mic("Ask Captain Delta", "ask_captain");

  if (kind === "coaching" || lesson.hasFeedback) {
    if (lesson.mode === "pronunciation" || route === "pronunciation") {
      return mic("Repeat", "repeat_after_me");
    }
    if (lesson.part2Kind === "readback") return mic("Read Back Again", "read_back");
    if (lesson.part2Kind === "reported") return mic("Report to ATC", "report_atc");
    if (lesson.mode === "memory" || route === "memory") {
      return mic("Explain It Again", "explain_your_way");
    }
    return mic("Try Again", "try_again");
  }

  if (lesson.recording) return mic("Stop", "try_again");

  switch (route) {
    case "dashboard":
      return mic("I'm Ready", "ready");
    case "part1":
      return mic("Answer Question", "answer_question");
    case "part2":
      if (lesson.part2Kind === "readback") return mic("Read Back", "read_back");
      if (lesson.part2Kind === "reported") return mic("Report to ATC", "report_atc");
      if (lesson.part2Kind === "picture") return mic("Describe the Picture", "describe_picture");
      return mic("Read Back", "read_back");
    case "pronunciation":
      return mic("Repeat After Me", "repeat_after_me");
    case "memory":
      return mic("Explain It Your Way", "explain_your_way");
    case "simulation":
      return mic("Start Exam", "start_exam");
    case "listen":
      return mic("Listen Again", "listen_again");
    default:
      return mic("Answer", "answer_question");
  }
}

export function resolveSecondaryActions(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
  kind: CaptainDeltaMessageKind,
): CaptainDeltaAction[] {
  const actions: CaptainDeltaAction[] = [];

  if (kind === "coaching" || kind === "followup") {
    actions.push(secondary("explain_why", "🎯 Explain Why"));
    if (lesson.canCompareAttempts) {
      actions.push(secondary("compare_attempts", "📈 Compare Attempts"));
    }
  }

  if (route === "part1" || lesson.mode === "coach") {
    if (lesson.keywords?.length) {
      actions.push(secondary("show_keywords", "📖 Show Keywords"));
    }
    actions.push(secondary("show_hint", "💡 Give Me a Hint"));
    if (lesson.hasModelAnswer) {
      actions.push(secondary("show_model", "📝 Show Model Answer"));
    }
  }

  if (route === "part2" || lesson.mode === "simulation") {
    if (lesson.hasNotes) actions.push(secondary("open_notes", "📋 Open Quick Notes"));
    actions.push(secondary("listen_again", "🎧 Listen Again"));
  }

  if (route === "listen") {
    actions.push(secondary("listen_again", "🎧 Listen Again"));
  }

  return actions.filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i).slice(0, 3);
}
