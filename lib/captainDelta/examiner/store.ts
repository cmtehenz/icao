import type { ExaminerExamRecord } from "@/lib/captainDelta/examiner/types";

export const EXAMINER_HISTORY_KEY = "icao_captain_delta_examiner_v1";
export const EXAMINER_HISTORY_EVENT = "icao-captain-delta-examiner-change";

export function notifyExaminerChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EXAMINER_HISTORY_EVENT));
}

export function loadExaminerHistory(): ExaminerExamRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXAMINER_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExaminerExamRecord[];
  } catch {
    return [];
  }
}

export function saveExaminerExamRecord(record: ExaminerExamRecord): void {
  if (typeof window === "undefined") return;
  const history = loadExaminerHistory().filter((r) => r.reportId !== record.reportId);
  history.unshift(record);
  localStorage.setItem(EXAMINER_HISTORY_KEY, JSON.stringify(history.slice(0, 40)));
  notifyExaminerChange();
}

export function getExaminerRecord(reportId: string): ExaminerExamRecord | null {
  return loadExaminerHistory().find((r) => r.reportId === reportId) ?? null;
}
