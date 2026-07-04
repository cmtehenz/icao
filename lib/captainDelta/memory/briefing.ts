import { daysUntilExam } from "@/lib/captainDelta/examDate";
import { greetingForHour } from "@/lib/captainDelta/voiceText";
import { getDailyMissionSummary, getNextMissionAction } from "@/lib/dailyMission";
import { sessionsForDate } from "@/lib/flightInstructor/memory";
import { loadStudyPlanMode, STUDY_DAILY_GOAL_MINUTES, STUDY_INTENSE_DAY_MINUTES, todayKey } from "@/lib/studyTime";
import { buildLearnerSnapshot } from "@/lib/captainDelta/memory/aggregate";
import { loadCaptainDeltaMemory } from "@/lib/captainDelta/memory/store";
import type { PersonalBriefing, PersonalMission } from "@/lib/captainDelta/memory/types";
import { loadProfile } from "@/lib/profile";
import { detectSpeechPatterns } from "@/lib/captainDelta/memory/patterns";
import { buildImprovementLines } from "@/lib/captainDelta/memory/improvements";
import { buildSmartReminders } from "@/lib/captainDelta/memory/reminders";

function yesterdayKey(): string {
  const d = new Date(`${todayKey()}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function buildMission(firstName: string): PersonalMission {
  const patterns = detectSpeechPatterns();
  const store = loadCaptainDeltaMemory();
  const vocab = Object.entries(store.vocabularyRepeats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([w]) => w);

  const expressions =
    vocab.length >= 2
      ? vocab
      : ["situational awareness", "conservative decision", "crew coordination"];

  const challenge =
    patterns[0]?.missionHint ?? "Tell one real story from your operation.";

  return {
    title: "Today's Mission",
    expressions,
    challenge,
    estimatedMinutes: 8,
  };
}

export function buildPersonalBriefing(firstName: string): PersonalBriefing {
  const snapshot = buildLearnerSnapshot(firstName);
  const profile = loadProfile();
  const mission = getDailyMissionSummary();
  const next = getNextMissionAction();
  const mode = loadStudyPlanMode();
  const minutes = mode === "intense" ? STUDY_INTENSE_DAY_MINUTES : STUDY_DAILY_GOAL_MINUTES;
  const yKey = yesterdayKey();
  const ySessions = sessionsForDate(yKey);
  const improvements = buildImprovementLines();
  const reminders = buildSmartReminders();

  let yesterdayLine: string | null = null;
  if (ySessions.length) {
    const avg = Math.round(
      ySessions.reduce((s, x) => s + x.overallScore, 0) / ySessions.length,
    );
    yesterdayLine =
      avg >= 70
        ? `Yesterday you completed ${ySessions.length} coach session${ySessions.length > 1 ? "s" : ""}. Excellent improvement.`
        : `Yesterday you logged ${ySessions.length} session${ySessions.length > 1 ? "s" : ""} — steady progress.`;
  }

  const focusItems: string[] = [];
  if (snapshot.readiness.weakestTopic) focusItems.push(snapshot.readiness.weakestTopic);
  for (const p of snapshot.patterns.slice(0, 1)) focusItems.push(p.label.replace(/^You /, ""));
  if (next) focusItems.push(next.title);
  focusItems.push(...snapshot.readiness.weakestTopic === "Pronunciation" ? ["Pronunciation"] : []);

  const uniqueFocus = [...new Set(focusItems.map((f) => f.trim()).filter(Boolean))].slice(0, 3);

  const store = loadCaptainDeltaMemory();
  const lastStory = store.aviationStories[store.aviationStories.length - 1];
  let aviationPersonal: string | null = null;
  if (lastStory?.aircraft) {
    aviationPersonal = `${firstName}, you mentioned flying the ${lastStory.aircraft} recently — we'll use that experience today.`;
  } else if (profile.aircraft) {
    aviationPersonal = `We'll anchor answers in your ${profile.aircraft} experience when it fits.`;
  }

  return {
    greeting: `${greetingForHour(new Date().getHours())}, ${firstName}.`,
    examDays: daysUntilExam(),
    yesterdayLine,
    improvementNote: improvements[0] ?? null,
    focusItems: uniqueFocus.length ? uniqueFocus : [mission.examLabel, "Confidence", "Natural speech"],
    estimatedMinutes: minutes,
    mission: buildMission(firstName),
    reminder: reminders[0] ?? null,
    aviationPersonal,
  };
}

export function briefingToSpeech(b: PersonalBriefing): string {
  const parts = [
    b.greeting,
    `Your ICAO exam is in ${b.examDays} days.`,
    b.yesterdayLine,
    b.improvementNote,
    b.aviationPersonal,
    `Today we'll focus on ${b.focusItems.slice(0, 3).join(", ")}.`,
    `Today's mission: use ${b.mission.expressions.slice(0, 3).join(", ")}.`,
    b.mission.challenge,
    b.reminder,
    `Estimated training: ${b.estimatedMinutes} minutes.`,
  ].filter(Boolean) as string[];
  return parts.join(" ");
}
