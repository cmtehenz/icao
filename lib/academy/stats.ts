import { loadInstructorMemory } from "@/lib/flightInstructor/memory";
import { loadSimuladoHistory } from "@/lib/simulado/progress";
import { loadExaminerHistory } from "@/lib/captainDelta/examiner/store";
import {
  loadStudyDays,
  studyDayMinutes,
  studyStreak,
  loadStudyPlanMode,
} from "@/lib/studyTime";
import { loadAcademyStore, saveAcademyStore } from "@/lib/academy/store";
import type { AcademyStatistics } from "@/lib/academy/types";

export function readAcademyStatistics(): AcademyStatistics {
  const days = loadStudyDays();
  const mode = loadStudyPlanMode();
  let totalMinutes = 0;
  let speakingMinutes = 0;

  for (const day of Object.values(days)) {
    if (!day) continue;
    const mins = studyDayMinutes(day);
    totalMinutes += mins;
    speakingMinutes += (day.shadow ?? 0) * 2 + (day.shadowPart2 ?? 0) * 5;
    speakingMinutes += (day.simulate ?? 0) * 10;
  }

  const instructorSessions = loadInstructorMemory().sessions.length;
  const mockExams = Math.max(loadSimuladoHistory().length, loadExaminerHistory().length);
  const currentStreak = studyStreak(days, mode);
  const store = loadAcademyStore();
  const bestStreak = Math.max(store.bestStreak, currentStreak);

  return {
    hoursStudied: Math.round((totalMinutes / 60) * 10) / 10,
    hoursSpeaking: Math.round((speakingMinutes / 60) * 10) / 10,
    questionsAnswered: instructorSessions,
    mockExamsCompleted: mockExams,
    bestStreak,
    currentStreak,
  };
}

export function computeAcademyStatistics(): AcademyStatistics {
  const stats = readAcademyStatistics();
  const store = loadAcademyStore();

  if (stats.bestStreak > store.bestStreak) {
    saveAcademyStore({ ...store, bestStreak: stats.bestStreak });
  }

  return stats;
}
