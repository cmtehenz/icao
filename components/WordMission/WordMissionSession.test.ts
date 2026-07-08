import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sessionSource = readFileSync(
  path.join(__dirname, "WordMissionSession.tsx"),
  "utf-8",
);
const appSource = readFileSync(path.join(__dirname, "WordMissionApp.tsx"), "utf-8");
const cssSource = readFileSync(
  path.join(__dirname, "../../app/vocabulario/vocab-studio.css"),
  "utf-8",
);

describe("WordMissionSession UI certification", () => {
  it("renders premium flight deck panel structure", () => {
    expect(sessionSource).toMatch(/vocab-studio-training vocab-mission-panel word-mission-panel/);
    expect(sessionSource).toMatch(/vocab-studio-hero word-mission-hero/);
    expect(sessionSource).toMatch(/word-mission-record-task/);
    expect(sessionSource).toMatch(/pron-captain-recorder-panel/);
  });

  it("uses four clean step tabs only", () => {
    expect(sessionSource).toMatch(/word-mission-step-tabs/);
    expect(sessionSource).toMatch(/WM_LEVEL_NAMES\[l\]/);
    expect(sessionSource).not.toMatch(/word-mission-lesson-groups/);
    expect(sessionSource).not.toMatch(/Continue sortie/);
    expect(sessionSource).not.toMatch(/WORD_MISSION_PHASE_ORDER/);
  });

  it("shows Listen + Record controls with numbered what-to-do steps", () => {
    expect(sessionSource).not.toMatch(/PronunciationRecorder/);
    expect(sessionSource).toMatch(/word-mission-record-instructions-list/);
    expect(sessionSource).toMatch(/>Record</);
    expect(sessionSource).toMatch(/Stop &amp; assess/);
  });

  it("shows term header with phonetic hint and lesson card", () => {
    expect(sessionSource).toMatch(/WordPhoneticHint/);
    expect(sessionSource).toMatch(/word-mission-lesson-message/);
    expect(sessionSource).toMatch(/buildWordMissionLesson/);
  });

  it("records only on Say It and ICAO Practice", () => {
    expect(sessionSource).toMatch(/shouldEnableRecording/);
    expect(sessionSource).toMatch(/markWordMissionStepViewed/);
    expect(sessionSource).toMatch(/Continue/);
  });

  it("shows SKYbrary attribution when lesson uses curated source", () => {
    expect(sessionSource).toMatch(/word-mission-source-label/);
    expect(sessionSource).toMatch(/SKYBRARY_UI_LABEL/);
  });

  it("hides raw Azure debug behind technical details on recording steps only", () => {
    expect(sessionSource).toMatch(/pron-captain-technical word-mission-technical/);
    expect(sessionSource).toMatch(/recordingEnabled &&/);
  });

  it("shows per-step action hint on card and rich knowledge panels", () => {
    expect(sessionSource).toMatch(/wordMissionStepActionHint/);
    expect(sessionSource).toMatch(/word-mission-step-action/);
    expect(sessionSource).toMatch(/word-mission-record-task/);
    expect(sessionSource).toMatch(/WordMissionRichPanels/);
  });

  it("shows terms and steps remaining in lesson progress banner", () => {
    expect(sessionSource).toMatch(/word-mission-lesson-progress/);
    expect(sessionSource).toMatch(/termsRemaining/);
    expect(sessionSource).toMatch(/stepsRemaining/);
    expect(sessionSource).toMatch(/left on this term/);
    expect(sessionSource).toMatch(/WORD_MISSION_CAPTAIN_UI/);
    expect(sessionSource).toMatch(/wordMissionSpeakText/);
  });
});

describe("WordMissionApp styling", () => {
  it("imports certified vocab studio stylesheet", () => {
    expect(appSource).toMatch(/vocab-studio\.css/);
    expect(appSource).toMatch(/vocab-flight-deck/);
  });

  it("includes mobile-first word mission CSS", () => {
    expect(cssSource).toMatch(/\.word-mission-panel/);
    expect(cssSource).toMatch(/\.word-mission-step-tabs/);
    expect(cssSource).toMatch(/\.word-mission-step-tab\.active/);
    expect(cssSource).toMatch(/color: #fff/);
  });
});
