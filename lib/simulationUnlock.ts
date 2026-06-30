import {
  loadStudyDays,
  studyActivityPoints,
  todayKey,
  type StudyDayRecord,
  type StudyDaysMap,
} from "@/lib/studyTime";

/** Pontos shadow na semana para desbloquear simulado. */
export const SIMULATION_UNLOCK_WEEKLY_SHADOW_POINTS = 30;

export const SIMULATION_UNLOCK_CHANGE_EVENT = "icao-simulation-unlock-change";

function weekKeys(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cursor = new Date(weekStart);
    cursor.setDate(weekStart.getDate() + i);
    if (cursor > today) break;
    keys.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`,
    );
  }
  return keys;
}

function normalizeDay(day: Partial<StudyDayRecord> | undefined): StudyDayRecord {
  return {
    shadow: day?.shadow ?? 0,
    shadowPart2: day?.shadowPart2 ?? 0,
    simulate: day?.simulate ?? 0,
    pronunciation: day?.pronunciation ?? 0,
    vocabulary: day?.vocabulary ?? 0,
  };
}

export function weekShadowPoints(days: StudyDaysMap = loadStudyDays()): number {
  return weekKeys().reduce((sum, key) => {
    const day = normalizeDay(days[key]);
    return sum + studyActivityPoints("shadow", day.shadow) + studyActivityPoints("shadowPart2", day.shadowPart2);
  }, 0);
}

export function simulationUnlockProgress(days: StudyDaysMap = loadStudyDays()): {
  points: number;
  target: number;
  unlocked: boolean;
  remaining: number;
} {
  const points = weekShadowPoints(days);
  const target = SIMULATION_UNLOCK_WEEKLY_SHADOW_POINTS;
  return {
    points,
    target,
    unlocked: points >= target,
    remaining: Math.max(0, target - points),
  };
}

export function isSimulationUnlocked(days: StudyDaysMap = loadStudyDays()): boolean {
  return simulationUnlockProgress(days).unlocked;
}

export function simulationUnlockHint(days: StudyDaysMap = loadStudyDays()): string {
  const { points, target, unlocked, remaining } = simulationUnlockProgress(days);
  if (unlocked) return "Simulado desbloqueado — use quando se sentir pronto.";
  return `Faltam ${remaining} pts shadow esta semana (${points}/${target}) para desbloquear o simulado.`;
}
