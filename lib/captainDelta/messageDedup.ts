import { warnCaptain } from "@/lib/captainDelta/devLog";
import type { CaptainDeltaContext, CaptainDeltaMessageKind } from "@/lib/captainDelta/types";

export type CaptainMessageDedupInput = {
  route: CaptainDeltaContext;
  kind: CaptainDeltaMessageKind;
  activeTerm?: string;
  text: string;
  speechText?: string;
  source?: string;
  eventId?: string;
};

export type CaptainMessageDedupState = {
  lastMessageKey: string | null;
  lastMessageAt: number;
  lastDeliveredActiveTerm: string | null;
  processedEventIds: string[];
};

export const CAPTAIN_MESSAGE_DEDUP_WINDOW_MS = 3000;

export function createCaptainMessageDedupState(): CaptainMessageDedupState {
  return {
    lastMessageKey: null,
    lastMessageAt: 0,
    lastDeliveredActiveTerm: null,
    processedEventIds: [],
  };
}

export function buildCaptainMessageKey(input: CaptainMessageDedupInput): string {
  const term = input.activeTerm?.trim().toLowerCase() ?? "";
  const speech = (input.speechText ?? input.text).trim();
  const source = input.source ?? "unknown";
  return `${input.route}|${input.kind}|${term}|${speech}|${source}`;
}

function rememberEventId(state: CaptainMessageDedupState, eventId: string): CaptainMessageDedupState {
  const nextIds = [...state.processedEventIds.filter((id) => id !== eventId), eventId].slice(-64);
  return { ...state, processedEventIds: nextIds };
}

export type CaptainMessageDedupDecision = {
  deliver: boolean;
  next: CaptainMessageDedupState;
  messageKey: string;
  reason?: string;
};

export function evaluateCaptainMessageDelivery(
  state: CaptainMessageDedupState,
  input: CaptainMessageDedupInput,
  windowMs = CAPTAIN_MESSAGE_DEDUP_WINDOW_MS,
): CaptainMessageDedupDecision {
  const messageKey = buildCaptainMessageKey(input);
  const now = Date.now();
  let next = state;

  if (input.eventId) {
    if (state.processedEventIds.includes(input.eventId)) {
      logCaptainMessageDecision(messageKey, input, "dropped", "duplicate eventId");
      return {
        deliver: false,
        next: state,
        messageKey,
        reason: "duplicate eventId",
      };
    }
    next = rememberEventId(next, input.eventId);
  }

  if (
    state.lastMessageKey === messageKey &&
    now - state.lastMessageAt < windowMs
  ) {
    logCaptainMessageDecision(messageKey, input, "dropped", "duplicate message key");
    return {
      deliver: false,
      next,
      messageKey,
      reason: "duplicate message key",
    };
  }

  logCaptainMessageDecision(messageKey, input, "delivered");
  return {
    deliver: true,
    next: {
      ...next,
      lastMessageKey: messageKey,
      lastMessageAt: now,
      lastDeliveredActiveTerm: input.activeTerm?.trim().toLowerCase() ?? next.lastDeliveredActiveTerm,
    },
    messageKey,
  };
}

/** Sync effect guard — only speak when active term actually changes on term routes. */
export function shouldDeliverActiveTermSync(
  state: CaptainMessageDedupState,
  route: CaptainDeltaContext,
  term: string,
): boolean {
  if (route !== "pronunciation" && route !== "vocabulary") return true;
  const key = term.trim().toLowerCase();
  if (!key) return false;
  return state.lastDeliveredActiveTerm !== key;
}

export function markActiveTermDelivered(
  state: CaptainMessageDedupState,
  term: string,
): CaptainMessageDedupState {
  return {
    ...state,
    lastDeliveredActiveTerm: term.trim().toLowerCase(),
  };
}

function logCaptainMessageDecision(
  messageKey: string,
  input: CaptainMessageDedupInput,
  outcome: "delivered" | "dropped",
  reason?: string,
): void {
  if (process.env.NODE_ENV === "production") return;
  warnCaptain(
    "messageDedup",
    outcome === "delivered" ? "delivered" : `dropped (${reason ?? "unknown"})`,
    {
      messageKey,
      eventId: input.eventId ?? "—",
      route: input.route,
      activeTerm: input.activeTerm ?? "—",
      source: input.source ?? "—",
      kind: input.kind,
    },
  );
}

export function resetProcessedEventIdsForTests(): void {
  /* state is per-provider; tests use evaluateCaptainMessageDelivery directly */
}
