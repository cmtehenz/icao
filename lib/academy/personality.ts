import { daysUntilExam } from "@/lib/captainDelta/examDate";
import type { AcademyPhase, CaptainPersonality } from "@/lib/academy/types";
import { loadAcademyStore } from "@/lib/academy/store";

export function getAcademyPhase(daysRemaining = daysUntilExam()): AcademyPhase {
  const store = loadAcademyStore();
  if (store.postExamLevel != null) return "post_exam";
  if (daysRemaining <= 1) return "confidence";
  if (daysRemaining <= 7) return "exam";
  if (daysRemaining <= 15) return "simulation";
  if (daysRemaining <= 30) return "performance";
  return "learning";
}

export function weeksSinceAcademyStart(): number {
  const start = loadAcademyStore().academyStartDate;
  const a = new Date(`${start}T12:00:00`);
  const b = new Date();
  return Math.max(1, Math.floor((b.getTime() - a.getTime()) / (7 * 86400000)) + 1);
}

export function getCaptainPersonality(): CaptainPersonality {
  const phase = getAcademyPhase();
  const weeks = weeksSinceAcademyStart();

  const byPhase: Record<AcademyPhase, CaptainPersonality> = {
    learning: {
      phase: "learning",
      tone: "Supportive — building foundations one flight at a time.",
      focus: "Confidence and structure",
    },
    performance: {
      phase: "performance",
      tone: weeks >= 2 ? "More demanding — less memorized English, more pilot language." : "Supportive with higher expectations.",
      focus: "Natural pilot language",
    },
    simulation: {
      phase: "simulation",
      tone: "Exam-focused — simulation blocks every week.",
      focus: "Full exam readiness",
    },
    exam: {
      phase: "exam",
      tone: "Almost like a real examiner — precision and calm under pressure.",
      focus: "SDEA-style performance",
    },
    confidence: {
      phase: "confidence",
      tone: "Calm and reassuring — you are ready. Trust your preparation.",
      focus: "Reduce anxiety, trust your training",
    },
    post_exam: {
      phase: "post_exam",
      tone: "Your mentor continues — next goals beyond ICAO.",
      focus: "Career and operational English",
    },
  };

  return byPhase[phase];
}

export function phaseLabel(phase: AcademyPhase): string {
  const labels: Record<AcademyPhase, string> = {
    learning: "Learning mode",
    performance: "Performance mode",
    simulation: "Simulation mode",
    exam: "Exam mode",
    confidence: "Confidence mode",
    post_exam: "Post-exam mentoring",
  };
  return labels[phase];
}
