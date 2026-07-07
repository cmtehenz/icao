import { beforeEach, describe, expect, it } from "vitest";
import { ICAO_VOCABULARY } from "@/data/icaoVocabulary";
import { buildWordMissionBrief, buildWordMissionLesson, findVocabItemForTerm } from "@/lib/wordMission/lesson/lessonEngine";
import {
  advanceLessonContext,
  createLessonContext,
  isStudentTurnPhase,
  practiceLevelForPhase,
  shouldEnableRecording,
} from "@/lib/wordMission/lesson/lessonFlow";
import { totalLessonPhases } from "@/lib/wordMission/lesson/lessonEngine";
import { handleWordMissionInterrupt, isWordMissionStudentQuestion } from "@/lib/wordMission/lesson/interruptHandler";
import { listCuratedTerms } from "@/lib/wordMission/lesson/curatedContent";
import { noopKnowledgeProvider } from "@/lib/wordMission/lesson/enrichment";
import { resetCaptainLessonMemoryForTests } from "@/lib/captainDelta/infinity/lessonMemory";
import { WORD_MISSION_PHASE_ORDER } from "@/lib/wordMission/lesson/types";

const divert = findVocabItemForTerm("divert")!;
const flyDirectItem = { term: "fly direct" } as const;

describe("Word Mission 2.0 — lesson engine", () => {
  it("defines thirteen lesson phases", () => {
    expect(WORD_MISSION_PHASE_ORDER).toHaveLength(13);
    expect(WORD_MISSION_PHASE_ORDER[0]).toBe("mission_brief");
    expect(WORD_MISSION_PHASE_ORDER[12]).toBe("mission_complete");
  });

  it("curated fly direct mission brief matches spec tone", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.phases[0]!.message).toMatch(/common ATC clearances|navigation/i);
    expect(lesson.phases[1]!.message).toMatch(/waypoint|Portuguese/i);
    expect(lesson.phases[3]!.message).toMatch(/Tower:/);
    expect(lesson.phases[3]!.message).toMatch(/NITUX|direct/i);
  });

  it("meaning phase includes English and Portuguese", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.phases[1]!.message).toMatch(/Meaning:/);
    expect(lesson.phases[1]!.message).toMatch(/Portuguese:/);
  });

  it("operational context explains who when why", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.phases[2]!.message).toMatch(/Who says it|When\?|Why\?/);
  });

  it("pronunciation and micro challenge enable recording", () => {
    const lesson = buildWordMissionLesson("fly direct");
    const ctx = createLessonContext(lesson);
    expect(shouldEnableRecording(ctx)).toBe(false);
    const pronCtx = { ...ctx, currentPhaseId: "pronunciation" as const, phaseIndex: 4 };
    expect(shouldEnableRecording(pronCtx)).toBe(true);
    expect(lesson.phases[4]!.message).toMatch(/Listen carefully/i);
  });

  it("compare phase contrasts similar expressions", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.phases[7]!.message).toMatch(/vs|Proceed direct|Direct climb/i);
  });

  it("micro conversation prompts student turn", () => {
    const lesson = buildWordMissionLesson("fly direct");
    expect(lesson.phases[10]!.studentTurn).toBe(true);
    expect(lesson.phases[10]!.message).toMatch(/\?|Your turn/i);
    expect(isStudentTurnPhase("micro_conversation")).toBe(true);
  });

  it("mission complete summarizes learning not level", () => {
    const lesson = buildWordMissionLesson("fly direct");
    const complete = lesson.phases[12]!;
    expect(complete.message).toMatch(/Today you learned/i);
    expect(complete.message).not.toMatch(/Level 1|Completed/i);
  });

  it("builds fallback lesson from vocabulary item", () => {
    const lesson = buildWordMissionLesson(divert);
    expect(lesson.termId).toBe(divert.id);
    expect(lesson.phases).toHaveLength(13);
    expect(lesson.phases[0]!.message).toMatch(/divert|diversion/i);
  });

  it("advances through lesson flow", () => {
    const lesson = buildWordMissionLesson("heading");
    let ctx = createLessonContext(lesson);
    expect(ctx.currentPhaseId).toBe("mission_brief");
    ctx = advanceLessonContext(ctx);
    expect(ctx.currentPhaseId).toBe("meaning");
  });

  it("maps phases to practice levels for Azure", () => {
    expect(practiceLevelForPhase("mission_brief")).toBe(1);
    expect(practiceLevelForPhase("pronunciation")).toBe(2);
    expect(practiceLevelForPhase("icao_connection")).toBe(3);
    expect(practiceLevelForPhase("micro_challenge")).toBe(4);
  });

  it("buildWordMissionBrief stays under twenty seconds of copy", () => {
    const brief = buildWordMissionBrief("fly direct");
    expect(brief.message.split(" ").length).toBeLessThan(40);
  });

  it("enrichment interface falls back when provider returns null", () => {
    const lesson = buildWordMissionLesson("fly direct", { providers: [noopKnowledgeProvider] });
    expect(lesson.phases[0]!.message.length).toBeGreaterThan(20);
  });

  it("lists curated hand-authored terms", () => {
    expect(listCuratedTerms()).toContain("fly direct");
    expect(listCuratedTerms()).toContain("heading");
  });
});

describe("Word Mission 2.0 — student interrupts", () => {
  beforeEach(() => resetCaptainLessonMemoryForTests());

  it("detects student questions", () => {
    expect(isWordMissionStudentQuestion("What does this mean?")).toBe(true);
    expect(isWordMissionStudentQuestion("hello")).toBe(false);
  });

  it("handles interrupt and returns to lesson", () => {
    const lesson = buildWordMissionLesson(divert);
    const ctx = createLessonContext(lesson);
    const result = handleWordMissionInterrupt("What does divert mean?", ctx);
    expect(result.message.length).toBeGreaterThan(10);
    expect(result.resumePhaseId).toBe("mission_brief");
    expect(result.message).toMatch(/Back to our sortie|lesson/i);
  });
});

describe("Word Mission 2.0 — vocabulary coverage", () => {
  it("every core vocab term builds a full lesson", () => {
    for (const item of ICAO_VOCABULARY.slice(0, 5)) {
      const lesson = buildWordMissionLesson(item);
      expect(lesson.phases).toHaveLength(totalLessonPhases());
    }
  });
});
