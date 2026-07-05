import { warnCaptain } from "@/lib/captainDelta/devLog";
import type { CaptainDeltaContext, CaptainDeltaLessonContext } from "@/lib/captainDelta/types";
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

export function emitLessonContext(context: Partial<CaptainDeltaLessonContext>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CAPTAIN_DELTA_LESSON_CONTEXT, {
      detail: context,
    }),
  );
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
  patch: Partial<CaptainDeltaLessonContext>,
): CaptainDeltaLessonContext {
  if (patch.mode === "pronunciation") {
    return {
      ...DEFAULT_LESSON_CONTEXT,
      mode: "pronunciation",
      pronunciationWord: patch.pronunciationWord ?? current.pronunciationWord,
    };
  }
  return { ...DEFAULT_LESSON_CONTEXT, ...current, ...patch };
}

/** Active mission term from bridges — pronunciation word or vocabulary term. */
export function getActiveMissionTerm(lesson: CaptainDeltaLessonContext): string | undefined {
  const word = lesson.pronunciationWord?.trim();
  return word || undefined;
}

/** Test-only reset for bridge singleton state. */
export function resetCaptainDeltaRecordBridgeForTests(): void {
  bridgeEntry = null;
}
