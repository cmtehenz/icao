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
    expect(sessionSource).toMatch(/vocab-studio-practice-box/);
    expect(sessionSource).toMatch(/pron-captain-recorder-panel/);
    expect(sessionSource).toMatch(/pron-captain-coaching-card/);
  });

  it("uses segmented L1–L4 level tabs with active state", () => {
    expect(sessionSource).toMatch(/word-mission-level-tabs pron-level-tabs/);
    expect(sessionSource).toMatch(/word-mission-level-tab \$\{active \? "active"/);
    expect(sessionSource).toMatch(/WM_LEVEL_NAMES\[l\]/);
  });

  it("does not mount duplicate Record buttons — Captain recorder only", () => {
    expect(sessionSource).not.toMatch(/PronunciationRecorder/);
    expect(sessionSource).not.toMatch(/>Record</);
    expect(sessionSource).not.toMatch(/Stop & assess/);
    expect(sessionSource).toMatch(/Captain Recorder/);
  });

  it("shows term header with phonetic hint and meaning", () => {
    expect(sessionSource).toMatch(/WordPhoneticHint/);
    expect(sessionSource).toMatch(/word-mission-meaning-line/);
    expect(sessionSource).toMatch(/item\.meaning/);
  });

  it("hides raw Azure debug behind technical details", () => {
    expect(sessionSource).toMatch(/pron-captain-technical word-mission-technical/);
    expect(sessionSource).not.toMatch(/word-mission-recorder-note/);
  });
});

describe("WordMissionApp styling", () => {
  it("imports certified vocab studio stylesheet", () => {
    expect(appSource).toMatch(/vocab-studio\.css/);
    expect(appSource).toMatch(/vocab-flight-deck/);
    expect(appSource).toMatch(/pronunciation-flight-deck/);
  });

  it("includes mobile-first word mission CSS", () => {
    expect(cssSource).toMatch(/\.word-mission-panel/);
    expect(cssSource).toMatch(/@media \(max-width: 520px\)/);
    expect(cssSource).toMatch(/\.word-mission-level-tabs/);
  });
});
