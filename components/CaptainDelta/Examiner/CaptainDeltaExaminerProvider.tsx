"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CaptainDeltaRole } from "@/lib/captainDelta/examiner/types";
import type { ExamRecordingMeta } from "@/lib/captainDelta/examiner/types";
import { emitCaptainDeltaRole, CAPTAIN_DELTA_ROLE } from "@/lib/captainDelta/examiner/events";
import { emitVisualClear } from "@/lib/captainDelta/visual/events";

type ExaminerContextValue = {
  role: CaptainDeltaRole;
  examinerActive: boolean;
  recordings: ExamRecordingMeta[];
  setRole: (role: CaptainDeltaRole) => void;
  enterExaminerMode: () => void;
  exitExaminerMode: () => void;
  addRecording: (meta: ExamRecordingMeta) => void;
  clearRecordings: () => void;
};

const ExaminerCtx = createContext<ExaminerContextValue | null>(null);

export function CaptainDeltaExaminerProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<CaptainDeltaRole>("instructor");
  const [recordings, setRecordings] = useState<ExamRecordingMeta[]>([]);

  const setRole = useCallback((next: CaptainDeltaRole) => {
    setRoleState(next);
    emitCaptainDeltaRole(next);
    document.body.classList.toggle("cde-examiner-mode", next === "examiner");
    if (next === "examiner") emitVisualClear();
  }, []);

  const enterExaminerMode = useCallback(() => {
    setRecordings([]);
    setRole("examiner");
  }, [setRole]);

  const exitExaminerMode = useCallback(() => {
    setRole("instructor");
  }, [setRole]);

  const addRecording = useCallback((meta: ExamRecordingMeta) => {
    setRecordings((prev) => [...prev.filter((r) => r.stepId !== meta.stepId), meta]);
  }, []);

  const clearRecordings = useCallback(() => setRecordings([]), []);

  useEffect(() => {
    const onRole = (e: Event) => {
      const next = (e as CustomEvent<{ role: CaptainDeltaRole }>).detail?.role;
      if (next) setRoleState(next);
    };
    window.addEventListener(CAPTAIN_DELTA_ROLE, onRole);
    return () => {
      window.removeEventListener(CAPTAIN_DELTA_ROLE, onRole);
      document.body.classList.remove("cde-examiner-mode");
    };
  }, []);

  const value = useMemo(
    () => ({
      role,
      examinerActive: role === "examiner",
      recordings,
      setRole,
      enterExaminerMode,
      exitExaminerMode,
      addRecording,
      clearRecordings,
    }),
    [role, recordings, setRole, enterExaminerMode, exitExaminerMode, addRecording, clearRecordings],
  );

  return <ExaminerCtx.Provider value={value}>{children}</ExaminerCtx.Provider>;
}

export function useCaptainDeltaExaminer(): ExaminerContextValue | null {
  return useContext(ExaminerCtx);
}
