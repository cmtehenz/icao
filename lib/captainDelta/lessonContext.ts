import { warnCaptain } from "@/lib/captainDelta/devLog";
import type {
  CaptainDeltaContext,
  CaptainDeltaLessonContext,
  CaptainDeltaLessonContextPatch,
} from "@/lib/captainDelta/types";
import { DEFAULT_LESSON_CONTEXT } from "@/lib/captainDelta/types";

export const CAPTAIN_DELTA_LESSON_CONTEXT = "icao-captain-delta-lesson-context";
export const CAPTAIN_DELTA_START_RECORD = "icao-captain-delta-start-record";
export const CAPTAIN_DELTA_STOP_RECORD = "icao-captain-delta-stop-record";
export const CAPTAIN_DELTA_SECONDARY_ACTION = "icao-captain-delta-secondary-action";

export type CaptainDeltaRecordBridge = {
  canRecord: () => boolean;
  startRecord: () => void;
  stopRecord: () => void;
  isRecording: () => boolean;
};

type BridgeEntry = {
  id: string;
  bridge: CaptainDeltaRecordBridge;
  onSecondaryAction?: (actionId: string) => void;
};

let bridgeEntry: BridgeEntry | null = null;
let bridgeListenersInstalled = false;

/** Authoritative pronunciation word — owned by PronunciationWordsMode.activeWord. */
let authoritativePronunciationWord: string | null = null;
let pronunciationPublishSeq = 0;

function ensureBridgeListeners(): void {
  if (bridgeListenersInstalled || typeof window === "undefined") return;
  bridgeListenersInstalled = true;

  window.addEventListener(CAPTAIN_DELTA_START_RECORD, () => {
    const entry = bridgeEntry;
    if (entry?.bridge.canRecord()) {
      entry.bridge.startRecord();
    }
  });

  window.addEventListener(CAPTAIN_DELTA_STOP_RECORD, () => {
    const entry = bridgeEntry;
    if (entry?.bridge.isRecording()) {
      entry.bridge.stopRecord();
    }
  });

  window.addEventListener(CAPTAIN_DELTA_SECONDARY_ACTION, (e) => {
    const actionId = (e as CustomEvent<{ actionId: string }>).detail?.actionId;
    if (!actionId) return;
    bridgeEntry?.onSecondaryAction?.(actionId);
  });
}

export function registerCaptainDeltaRecordBridge(
  ownerId: string,
  bridge: CaptainDeltaRecordBridge | null,
  options?: { onSecondaryAction?: (actionId: string) => void },
): void {
  if (bridge === null) {
    if (bridgeEntry?.id === ownerId) {
      bridgeEntry = null;
      warnCaptain("bridge", `unregistered (${ownerId})`);
    }
    return;
  }

  if (bridgeEntry && bridgeEntry.id !== ownerId) {
    warnCaptain("bridge", `replacing ${bridgeEntry.id} with ${ownerId}`);
  }

  bridgeEntry = { id: ownerId, bridge, onSecondaryAction: options?.onSecondaryAction };
  warnCaptain("bridge", `registered (${ownerId})`);
  ensureBridgeListeners();
}

export function getCaptainDeltaRecordBridge(): CaptainDeltaRecordBridge | null {
  return bridgeEntry?.bridge ?? null;
}

export function emitLessonContext(context: CaptainDeltaLessonContextPatch): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_LESSON_CONTEXT, {
      detail: context,
    }),
  );
}

/** Publish the visible pronunciation card word — single source for Captain on /pronunciation. */
export function publishActivePronunciationWord(word: string | null | undefined): string | null {
  const trimmed = word?.trim() || null;
  if (trimmed === authoritativePronunciationWord) return null;
  authoritativePronunciationWord = trimmed;
  if (!trimmed) return null;

  pronunciationPublishSeq += 1;
  const eventId = `pronunciation-word:${trimmed.toLowerCase()}:${pronunciationPublishSeq}`;
  emitLessonContext({
    mode: "pronunciation",
    pronunciationWord: trimmed,
    question: trimmed,
    eventId,
  });
  return eventId;
}

export function clearActivePronunciationWord(): void {
  authoritativePronunciationWord = null;
}

export function getAuthoritativePronunciationWord(): string | null {
  return authoritativePronunciationWord;
}

export function emitStartRecord(): boolean {
  if (bridgeEntry?.bridge.canRecord()) {
    bridgeEntry.bridge.startRecord();
    return true;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CAPTAIN_DELTA_START_RECORD));
  }
  return false;
}

export function emitStopRecord(): boolean {
  if (bridgeEntry?.bridge.isRecording()) {
    bridgeEntry.bridge.stopRecord();
    return true;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CAPTAIN_DELTA_STOP_RECORD));
  }
  return false;
}

export function emitSecondaryAction(actionId: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_SECONDARY_ACTION, { detail: { actionId } }),
  );
}

export function lessonContextForRoute(context: CaptainDeltaContext): CaptainDeltaLessonContext {
  const mode = context === "pronunciation" ? "pronunciation" : "idle";
  return { ...DEFAULT_LESSON_CONTEXT, mode };
}

export function mergeLessonContext(
  current: CaptainDeltaLessonContext,
  patch: CaptainDeltaLessonContextPatch,
): CaptainDeltaLessonContext {
  if (patch.mode === "pronunciation") {
    const word = patch.pronunciationWord?.trim();
    if (!word) {
      return {
        ...DEFAULT_LESSON_CONTEXT,
        mode: "pronunciation",
      };
    }
    return {
      ...DEFAULT_LESSON_CONTEXT,
      mode: "pronunciation",
      pronunciationWord: word,
      question: patch.question?.trim() || word,
    };
  }
  return { ...DEFAULT_LESSON_CONTEXT, ...current, ...patch };
}

/** Active mission term from lesson context. */
export function getActiveMissionTerm(lesson: CaptainDeltaLessonContext): string | undefined {
  const word = lesson.pronunciationWord?.trim();
  return word || undefined;
}

/** Captain-facing term — on /pronunciation prefers the visible card word. */
export function resolveCaptainActiveTerm(
  route: CaptainDeltaContext,
  lesson: CaptainDeltaLessonContext,
): string | undefined {
  if (route === "pronunciation") {
    const authoritative = getAuthoritativePronunciationWord();
    if (authoritative) return authoritative;
  }
  return getActiveMissionTerm(lesson);
}

/** True when lesson.pronunciationWord matches the authoritative card word. */
export function isPronunciationTermSynced(lesson: CaptainDeltaLessonContext): boolean {
  const authoritative = getAuthoritativePronunciationWord();
  if (!authoritative) return !getActiveMissionTerm(lesson);
  const lessonTerm = getActiveMissionTerm(lesson);
  return !!lessonTerm && lessonTerm.toLowerCase() === authoritative.toLowerCase();
}

export function pronunciationWordChanged(
  previous: string | null | undefined,
  next: string | null | undefined,
): boolean {
  const a = previous?.trim().toLowerCase();
  const b = next?.trim().toLowerCase();
  if (!a || !b) return false;
  return a !== b;
}

/** Test-only reset for bridge singleton state. */
export function resetCaptainDeltaRecordBridgeForTests(): void {
  bridgeEntry = null;
}

export function resetActivePronunciationWordForTests(): void {
  authoritativePronunciationWord = null;
  pronunciationPublishSeq = 0;
}
