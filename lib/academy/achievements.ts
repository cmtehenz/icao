import type { AviationAchievement } from "@/lib/academy/types";
import { loadAcademyStore, saveAcademyStore } from "@/lib/academy/store";
import { readAcademyStatistics } from "@/lib/academy/stats";
import { loadSimuladoHistory } from "@/lib/simulado/progress";
import { loadInstructorMemory } from "@/lib/flightInstructor/memory";
import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import { loadPart2Progress } from "@/lib/part2/progress";

const ACHIEVEMENT_DEFS: Omit<AviationAchievement, "unlockedAt">[] = [
  {
    id: "first_solo",
    title: "First Solo",
    description: "Completed first simulation.",
    icon: "🛫",
  },
  {
    id: "radio_expert",
    title: "Radio Expert",
    description: "50 successful readbacks.",
    icon: "📡",
  },
  {
    id: "weather_specialist",
    title: "Weather Specialist",
    description: "20 weather-related answers.",
    icon: "🌤",
  },
  {
    id: "crm_professional",
    title: "CRM Professional",
    description: "100 CRM-style answers.",
    icon: "👥",
  },
  {
    id: "emergency_pilot",
    title: "Emergency Pilot",
    description: "30 emergency scenarios.",
    icon: "🚨",
  },
  {
    id: "consistent_pilot",
    title: "Consistent Pilot",
    description: "30-day training streak.",
    icon: "🔥",
  },
  {
    id: "operational_pilot",
    title: "Operational Pilot",
    description: "Estimated ICAO Level 4.",
    icon: "✈",
  },
];

function countReadbacks(): number {
  const progress = loadPart2Progress();
  return Object.values(progress.items).filter((i) => i.lastScore != null && i.lastScore >= 70).length;
}

function countByKeyword(keyword: string): number {
  return loadInstructorMemory().sessions.filter(
    (s) =>
      s.question.toLowerCase().includes(keyword) ||
      s.transcript.toLowerCase().includes(keyword),
  ).length;
}

export function listAchievements(): AviationAchievement[] {
  const achievements = loadAcademyStore().achievements;
  return ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlockedAt: achievements[def.id] ?? null,
  }));
}

export function evaluateAchievements(): AviationAchievement[] {
  const store = loadAcademyStore();
  const stats = readAcademyStatistics();
  const readiness = buildExamReadiness();
  const sims = loadSimuladoHistory().length;
  const readbacks = countReadbacks();
  const weather = countByKeyword("weather");
  const crm = countByKeyword("crew") + countByKeyword("crm");
  const emergency = countByKeyword("emergency") + countByKeyword("mayday");

  const checks: Record<string, boolean> = {
    first_solo: sims >= 1,
    radio_expert: readbacks >= 50,
    weather_specialist: weather >= 20,
    crm_professional: crm >= 100,
    emergency_pilot: emergency >= 30,
    consistent_pilot: stats.bestStreak >= 30,
    operational_pilot: readiness.estimatedIcao >= 4,
  };

  let updated = false;
  const achievements = store.achievements;
  const now = new Date().toISOString();

  for (const [id, unlocked] of Object.entries(checks)) {
    if (unlocked && !achievements[id]) {
      achievements[id] = now;
      updated = true;
    }
  }

  if (updated) saveAcademyStore({ ...store, achievements: { ...achievements } });

  return ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlockedAt: achievements[def.id] ?? null,
  }));
}

export function unlockedAchievementCount(): number {
  return evaluateAchievements().filter((a) => a.unlockedAt).length;
}
