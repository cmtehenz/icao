import { buildMissionRecallItems } from "@/lib/missionRecall/buildMissionRecall";
import {
  computeRecallConfidence,
} from "@/lib/missionRecall/missionRecallScoring";
import type {
  MissionRecallItem,
  MissionRecallProgress,
  MissionRecallState,
} from "@/lib/missionRecall/missionRecallTypes";
import { emitMissionRecallComplete, emitMissionRecallProgress } from "@/lib/missionRecall/events";
import { todayKey } from "@/lib/studyTime";

const STORAGE_KEY = "icao_mission_recall_v1";
export const MISSION_RECALL_EVENT = "icao-mission-recall-change";

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MISSION_RECALL_EVENT));
}

function isValidState(parsed: unknown, date: string): parsed is MissionRecallState {
  if (!parsed || typeof parsed !== "object") return false;
  const s = parsed as MissionRecallState;
  return (
    s.date === date &&
    Array.isArray(s.itemIds) &&
    Array.isArray(s.answeredIds) &&
    typeof s.complete === "boolean"
  );
}

export function loadMissionRecallState(): MissionRecallState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidState(parsed, todayKey())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveMissionRecallState(state: MissionRecallState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
  emitMissionRecallProgress();
}

export function getOrCreateMissionRecallState(dateKey = todayKey()): MissionRecallState {
  const existing = loadMissionRecallState();
  if (existing) return existing;

  const items = buildMissionRecallItems(dateKey);
  const state: MissionRecallState = {
    date: dateKey,
    itemIds: items.map((i) => i.id),
    answeredIds: [],
    complete: false,
    confidenceStars: 0,
  };
  saveMissionRecallState(state);
  return state;
}

export function getMissionRecallItems(dateKey = todayKey()): MissionRecallItem[] {
  const state = getOrCreateMissionRecallState(dateKey);
  const built = buildMissionRecallItems(dateKey);
  const byId = new Map(built.map((i) => [i.id, i]));
  return state.itemIds.map((id) => byId.get(id)).filter((i): i is MissionRecallItem => !!i);
}

export function getCurrentRecallItem(): MissionRecallItem | null {
  const state = getOrCreateMissionRecallState();
  const items = getMissionRecallItems(state.date);
  return items.find((i) => !state.answeredIds.includes(i.id)) ?? null;
}

export function markRecallItemAnswered(
  itemId: string,
  options?: { transcript?: string; method?: "speech" | "manual" },
): MissionRecallState {
  const state = getOrCreateMissionRecallState();
  if (state.answeredIds.includes(itemId)) return state;

  const answeredIds = [...state.answeredIds, itemId];
  const total = state.itemIds.length;
  const done = answeredIds.length;
  const complete = total > 0 && done >= total;
  const confidenceStars = complete ? computeRecallConfidence(done, total) : state.confidenceStars;

  const answers = { ...(state.answers ?? {}) };
  answers[itemId] = {
    itemId,
    transcript: options?.transcript?.trim() || undefined,
    answeredAt: new Date().toISOString(),
    method: options?.method ?? "manual",
    answered: true,
  };

  const next: MissionRecallState = {
    ...state,
    answeredIds,
    answers,
    complete,
    confidenceStars,
    completedAt: complete ? new Date().toISOString() : undefined,
  };
  saveMissionRecallState(next);
  if (complete) emitMissionRecallComplete(confidenceStars);
  return next;
}

export function getRecallAnswer(itemId: string): string | undefined {
  const state = loadMissionRecallState();
  return state?.answers?.[itemId]?.transcript;
}

export function isMissionRecallComplete(): boolean {
  const state = loadMissionRecallState();
  if (!state) return false;
  return state.complete;
}

export function missionRecallProgress(
  state = getOrCreateMissionRecallState(),
): MissionRecallProgress {
  const total = state.itemIds.length;
  const done = state.answeredIds.length;
  return {
    done,
    total,
    complete: state.complete || (total > 0 && done >= total),
    confidenceStars: state.confidenceStars,
  };
}

export function missionRecallLink(): string {
  return "/mission-recall";
}
