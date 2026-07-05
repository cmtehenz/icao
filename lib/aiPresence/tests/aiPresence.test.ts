import { describe, expect, it, vi } from "vitest";
import {
  buildConversationProgress,
  captainStandbyCopy,
  deriveConversationPhase,
  examinerRecoveryLine,
  examinerThinkingLine,
  presenceFromPhase,
  defaultRoutePresence,
} from "@/lib/aiPresence/conversationPresence";
import { processHexAnswerSafe } from "@/lib/aiPresence/processHexAnswer";
import { createConversation } from "@/lib/humanExaminer/buildConversation";
import * as buildConversationModule from "@/lib/humanExaminer/buildConversation";
import { buildQuestionContext } from "@/lib/humanExaminer/questionContext";
import type { Card } from "@/lib/types";
import {
  isCaptainDeltaProactiveEnabled,
  isCaptainDeltaVoiceEnabled,
} from "@/lib/captainDelta/voiceConfig";

const SAMPLE_CARD: Card = {
  num: "01",
  question: "How do you brief passengers?",
  answer: "I brief passengers on safety.",
  memory: "PEEL",
  memoryLabels: ["briefing"],
  keywords: ["briefing"],
  category: "helicopter",
  ideas: ["1 - Briefing: explain exits"],
  opener: "Before flight",
  example: "For example, life vest.",
  conclusion: "Prepared passengers.",
  verbs: ["brief"],
  vocab: [],
  difficulty: "Medium",
  tags: [],
  targetWords: 80,
};

describe("persistent AI presence", () => {
  it("defaults to Captain monitoring mission", () => {
    const p = defaultRoutePresence();
    expect(p.actor).toBe("captain");
    expect(p.statusLine).toMatch(/Monitoring/);
  });

  it("shows examiner during oral assessment", () => {
    const p = presenceFromPhase("listening");
    expect(p.actor).toBe("examiner");
    expect(p.subLine).toMatch(/listening/i);
  });

  it("shows Captain preparing debrief in standby", () => {
    const p = presenceFromPhase("captain_standby");
    expect(p.actor).toBe("captain");
    expect(p.statusLine).toMatch(/debrief/i);
  });
});

describe("conversation phases", () => {
  it("derives examiner thinking while loading", () => {
    expect(
      deriveConversationPhase({
        hexActive: true,
        hexComplete: false,
        loading: true,
        azureAssessing: false,
        examinerThinking: true,
        closingActive: false,
        instructorLoading: false,
        hasInstructorReport: false,
        hasExaminerFollowUp: false,
      }),
    ).toBe("examiner_thinking");
  });

  it("derives conversation closing", () => {
    expect(
      deriveConversationPhase({
        hexActive: true,
        hexComplete: false,
        loading: false,
        azureAssessing: false,
        examinerThinking: false,
        closingActive: true,
        instructorLoading: false,
        hasInstructorReport: false,
        hasExaminerFollowUp: true,
      }),
    ).toBe("conversation_closing");
  });

  it("derives captain debrief when report ready", () => {
    expect(
      deriveConversationPhase({
        hexActive: true,
        hexComplete: true,
        loading: false,
        azureAssessing: false,
        examinerThinking: false,
        closingActive: false,
        instructorLoading: false,
        hasInstructorReport: true,
        hasExaminerFollowUp: false,
      }),
    ).toBe("captain_debrief");
  });
});

describe("conversation progress", () => {
  it("shows discussion count and stages", () => {
    const ctx = buildQuestionContext(SAMPLE_CARD);
    let state = createConversation("01");
    state = {
      ...state,
      followUpCount: 1,
      turns: [
        { role: "student", text: "I brief them.", score: 70, at: "" },
        { role: "examiner", text: "Tell me more.", category: "expansion", at: "" },
      ],
    };
    const progress = buildConversationProgress(state, ctx);
    expect(progress.current).toBe(1);
    expect(progress.total).toBeGreaterThan(0);
    expect(progress.stages).toContain("Captain Debrief");
  });
});

describe("Captain standby", () => {
  it("provides standby copy during examination", () => {
    const copy = captainStandbyCopy("listening");
    expect(copy.title).toBe("Captain Delta");
    expect(copy.body).toMatch(/conversation first/i);
  });

  it("provides debrief standby when closing", () => {
    const copy = captainStandbyCopy("captain_standby");
    expect(copy.hint).toMatch(/debrief/i);
  });
});

describe("examiner thinking", () => {
  it("has thinking line text", () => {
    expect(examinerThinkingLine()).toMatch(/preparing/i);
  });
});

describe("voice independence", () => {
  it("defaults voice on and keeps proactive on", () => {
    expect(isCaptainDeltaVoiceEnabled()).toBe(true);
    expect(isCaptainDeltaProactiveEnabled()).toBe(true);
  });
});

describe("recovery path", () => {
  it("never returns empty examiner line on failure", () => {
    const ctx = buildQuestionContext(SAMPLE_CARD);
    const state = createConversation("01");
    const spy = vi
      .spyOn(buildConversationModule, "processStudentAnswer")
      .mockImplementation(() => {
        throw new Error("simulated failure");
      });
    const result = processHexAnswerSafe(state, ctx, "short answer here please", 40);
    expect(result.examinerLine).toBeTruthy();
    expect(result.examinerLine).toMatch(new RegExp(examinerRecoveryLine(), "i"));
    spy.mockRestore();
  });
});

describe("floating Captain default", () => {
  it("standby copy exists for idle phase", () => {
    const copy = captainStandbyCopy("idle");
    expect(copy.body.length).toBeGreaterThan(10);
  });
});

describe("conversation transitions", () => {
  it("moves from closing to captain standby presence", () => {
    const closing = presenceFromPhase("conversation_closing");
    const standby = presenceFromPhase("captain_standby");
    expect(closing.actor).toBe("examiner");
    expect(standby.actor).toBe("captain");
  });
});
