import { loadReadbackQueue } from "@/lib/part2ReadbackQueue";
import { loadInteractionQueue } from "@/lib/part2InteractionQueue";
import { loadVault, VAULT_PASS_SCORE } from "@/lib/pronunciationVault";
import {
  loadStudyDays,
  loadStudyPlanMode,
  studyActivityPoints,
  studyDaySuccess,
  studyDayPoints,
  studyWeekGoodDays,
  type StudyDayRecord,
  type StudyDaysMap,
} from "@/lib/studyTime";

export type WeeklyDayStat = {
  date: string;
  label: string;
  points: number;
  goalMet: boolean;
  shadow: number;
  shadowPart2: number;
};

export type StudyWeeklyReportData = {
  weekGood: { good: number; target: number };
  totalPoints: number;
  shadowPoints: number;
  avgPointsPerDay: number;
  days: WeeklyDayStat[];
  vaultCritical: number;
  vaultTotal: number;
  readbackQueueDone: number;
  readbackQueueTotal: number;
  interactionQueueDone: number;
  interactionQueueTotal: number;
};

function weekDayKeys(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cursor = new Date(weekStart);
    cursor.setDate(weekStart.getDate() + i);
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    keys.push(key);
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

function dayLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
}

export function buildStudyWeeklyReport(
  days: StudyDaysMap = loadStudyDays(),
  mode = loadStudyPlanMode(),
): StudyWeeklyReportData {
  const keys = weekDayKeys();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayStats: WeeklyDayStat[] = keys.map((date) => {
    const day = normalizeDay(days[date]);
    const cursor = new Date(`${date}T12:00:00`);
    const isFuture = cursor > today;
    return {
      date,
      label: dayLabel(date),
      points: isFuture ? 0 : studyDayPoints(day),
      goalMet: isFuture ? false : studyDaySuccess(date, day, mode),
      shadow: day.shadow,
      shadowPart2: day.shadowPart2,
    };
  });

  const elapsed = dayStats.filter((d) => {
    const cursor = new Date(`${d.date}T12:00:00`);
    return cursor <= today;
  });

  const totalPoints = elapsed.reduce((s, d) => s + d.points, 0);
  const shadowPoints = elapsed.reduce(
    (s, d) => s + studyActivityPoints("shadow", d.shadow) + studyActivityPoints("shadowPart2", d.shadowPart2),
    0,
  );

  const vault = loadVault();
  const readback = loadReadbackQueue();
  const interaction = loadInteractionQueue();

  return {
    weekGood: studyWeekGoodDays(days, mode),
    totalPoints,
    shadowPoints,
    avgPointsPerDay: elapsed.length ? Math.round(totalPoints / elapsed.length) : 0,
    days: dayStats,
    vaultCritical: vault.filter((w) => w.lastAccuracy < VAULT_PASS_SCORE).length,
    vaultTotal: vault.length,
    readbackQueueDone: readback?.completedIds.length ?? 0,
    readbackQueueTotal: readback?.scenarioIds.length ?? 0,
    interactionQueueDone: interaction?.completedIds.length ?? 0,
    interactionQueueTotal: interaction?.scenarioIds.length ?? 0,
  };
}
