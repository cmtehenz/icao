import { buildExamReadiness } from "@/lib/captainDelta/memory/readiness";
import { getAcademyPhase } from "@/lib/academy/personality";
import { loadAcademyStore, saveAcademyStore } from "@/lib/academy/store";
import type { CareerGoal } from "@/lib/academy/types";

export function buildCareerGoals(): {
  current: CareerGoal;
  next: CareerGoal;
  future: CareerGoal;
} {
  const readiness = buildExamReadiness();
  const phase = getAcademyPhase();
  const store = loadAcademyStore();

  if (phase === "post_exam" && store.postExamLevel != null) {
    const level = store.postExamLevel;
    if (level >= 5) {
      return {
        current: {
          title: "Airline Interview English",
          progress: 15,
          description: "Operational fluency for interviews",
        },
        next: { title: "ATPL English", description: "Advanced phraseology" },
        future: { title: "International Operations", description: "Offshore & global jobs" },
      };
    }
    return {
      current: { title: "Maintain ICAO Level", progress: 60 },
      next: { title: "Reach ICAO Level 5", description: "Natural pilot language" },
      future: { title: "Airline Interview", description: "Career English" },
    };
  }

  const targetLevel = readiness.estimatedIcao >= 4 ? 5 : 4;
  const progressTo4 = Math.min(100, Math.round((readiness.estimatedIcao / 4) * 100));

  return {
    current: {
      title: targetLevel === 4 ? "Reach ICAO Level 4" : "Reach ICAO Level 5",
      progress:
        targetLevel === 4
          ? progressTo4
          : Math.min(100, Math.round(((readiness.estimatedIcao - 4) / 1) * 100)),
      description: `${readiness.coverage}% exam coverage`,
    },
    next: {
      title: "Natural Pilot Language",
      description: "Connectors, stories, and CRM vocabulary",
    },
    future: {
      title: "ICAO Level 5",
      description: "Professional operational English",
    },
  };
}

export function savePostExamResult(level: number, note: string): void {
  const store = loadAcademyStore();
  saveAcademyStore({
    ...store,
    postExamLevel: level,
    postExamNote: note,
  });
}
