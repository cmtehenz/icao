import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pronunciationMissionLink } from "@/lib/pronunciationDailyMission";
import {
  isMissionEntryMode,
  nextIncompleteMissionWord,
  resolvePronunciationEntryWord,
  shouldMountCallsignDrill,
} from "@/lib/pronunciation/pronunciationEntry";
import { todayKey } from "@/lib/studyTime";
import type { VaultWord } from "@/lib/pronunciationVault";

const STORAGE_KEY = "icao_pronunciation_daily_mission_v1";
const VAULT_KEY = "icao_pronunciation_vault_v1";

function seedVault(words: string[]): VaultWord[] {
  const vault: VaultWord[] = words.map((word) => ({
    word,
    lowestAccuracy: 55,
    lastAccuracy: 55,
    errorType: "None",
    errorLabel: "test",
    context: "",
    timesSeen: 1,
    practiceCount: 1,
    passCount: 0,
    returnCount: 0,
    lastSeenAt: new Date().toISOString(),
  }));
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  return vault;
}

describe("pronunciation entry flow", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00Z"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("Begin Flight link includes the next mission word", () => {
    seedVault(["climb", "route"]);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: todayKey(),
        words: ["climb", "route"],
        completedWords: [],
      }),
    );
    expect(pronunciationMissionLink("climb")).toBe("/pronunciation?word=climb");
  });

  it("resolvePronunciationEntryWord returns vault word for Begin Flight deep link", () => {
    const vault = seedVault(["climb", "route"]);
    const resolved = resolvePronunciationEntryWord("climb", vault);
    expect(resolved?.word).toBe("climb");
  });

  it("resolvePronunciationEntryWord returns daily placeholder when word left vault", () => {
    const vault = seedVault(["route"]);
    const date = todayKey();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date,
        words: ["climb", "route"],
        completedWords: [],
      }),
    );
    const resolved = resolvePronunciationEntryWord("climb", vault);
    expect(resolved?.word).toBe("climb");
  });

  it("nextIncompleteMissionWord picks first incomplete daily word", () => {
    const vault = seedVault(["climb", "route"]);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: todayKey(),
        words: ["climb", "route"],
        completedWords: ["climb"],
      }),
    );
    expect(nextIncompleteMissionWord(vault)?.word).toBe("route");
  });

  it("mission mode does not mount CallsignDrillPanel", () => {
    expect(
      shouldMountCallsignDrill(false, null, true, "climb"),
    ).toBe(false);
    expect(
      shouldMountCallsignDrill(true, null, false, "climb"),
    ).toBe(false);
    expect(
      shouldMountCallsignDrill(true, null, false, null),
    ).toBe(true);
  });

  it("isMissionEntryMode is true for Begin Flight deep link", () => {
    expect(isMissionEntryMode(false, "climb")).toBe(true);
    expect(isMissionEntryMode(true, null)).toBe(true);
    expect(isMissionEntryMode(false, null)).toBe(false);
  });
});

describe("pronunciation Azure mount policy", () => {
  const root = join(process.cwd());

  it("useAzurePronunciation does not probe token on mount", () => {
    const src = readFileSync(join(root, "hooks/useAzurePronunciation.ts"), "utf8");
    expect(src).not.toMatch(/useEffect\(\(\) => \{[\s\S]*fetchAzureSpeechConfig/);
  });

  it("useAzureSpeech does not probe token on mount", () => {
    const src = readFileSync(join(root, "hooks/useAzureSpeech.ts"), "utf8");
    expect(src).not.toMatch(
      /useEffect\(\(\) => \{\s*fetchToken\(\)\s*\.then\(\(d\) => setConfigured/,
    );
  });

  it("PronunciationWordsMode mounts recording controller only with activeWord", () => {
    const src = readFileSync(
      join(root, "components/Part2Trainer/PronunciationWordsMode.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/usePronunciationRecordingController/);
    expect(src).toMatch(/activeWord && \(\s*\n?\s*<PronunciationLessonSession/);
  });
});

describe("PronunciationWordsMode mission guard", () => {
  it("does not mount CallsignDrillPanel during mission entry", () => {
    const src = readFileSync(
      join(process.cwd(), "components/Part2Trainer/PronunciationWordsMode.tsx"),
      "utf8",
    );
    expect(src).toMatch(/showCallsignDrill && <CallsignDrillPanel/);
    expect(src).not.toMatch(/browseMode && !activeWord && <CallsignDrillPanel/);
  });
});
