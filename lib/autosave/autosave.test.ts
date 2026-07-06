import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashStudyDaysPayload, hashVaultPayload } from "@/lib/autosave/payloadHash";
import {
  noteStudyTimePushSuccess,
  noteVaultPushSuccess,
  resetAutosaveSyncStateForTests,
  shouldSkipStudyTimePush,
  shouldSkipVaultPush,
} from "@/lib/autosave/syncState";
import { saveStudyDays, STUDY_TIME_CHANGE_EVENT } from "@/lib/studyTime";
import { saveVault, VAULT_CHANGE_EVENT, type VaultWord } from "@/lib/pronunciationVault";

const sampleWord: VaultWord = {
  word: "complete",
  lowestAccuracy: 70,
  lastAccuracy: 80,
  errorType: "None",
  errorLabel: "None",
  context: "test",
  timesSeen: 1,
  practiceCount: 1,
  passCount: 0,
  returnCount: 0,
  lastSeenAt: "2026-07-06T00:00:00.000Z",
};

describe("autosave dedupe", () => {
  beforeEach(() => {
    resetAutosaveSyncStateForTests();
  });

  it("unchanged vault does not resend", () => {
    const words = [sampleWord];
    noteVaultPushSuccess(words);
    expect(shouldSkipVaultPush(words)).toBe(true);
    expect(shouldSkipVaultPush([{ ...sampleWord }])).toBe(true);
  });

  it("one vault change sends exactly one PUT hash transition", () => {
    const first = [sampleWord];
    const second = [{ ...sampleWord, lastAccuracy: 90 }];
    noteVaultPushSuccess(first);
    expect(shouldSkipVaultPush(first)).toBe(true);
    expect(shouldSkipVaultPush(second)).toBe(false);
    expect(hashVaultPayload(first)).not.toBe(hashVaultPayload(second));
  });

  it("saveVault does not dispatch when payload unchanged", () => {
    const store = new Map<string, string>();
    const listeners = new Map<string, Set<() => void>>();
    vi.stubGlobal("window", {
      dispatchEvent: (event: Event) => {
        listeners.get(event.type)?.forEach((fn) => fn());
        return true;
      },
      addEventListener: (type: string, fn: () => void) => {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(fn);
      },
    });
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    });

    const handler = vi.fn();
    window.addEventListener(VAULT_CHANGE_EVENT, handler);
    saveVault([sampleWord]);
    expect(handler).toHaveBeenCalledTimes(1);
    saveVault([sampleWord]);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("saveStudyDays does not dispatch when payload unchanged", () => {
    const store = new Map<string, string>();
    const listeners = new Map<string, Set<() => void>>();
    vi.stubGlobal("window", {
      dispatchEvent: (event: Event) => {
        listeners.get(event.type)?.forEach((fn) => fn());
        return true;
      },
      addEventListener: (type: string, fn: () => void) => {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(fn);
      },
    });
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    });

    const handler = vi.fn();
    window.addEventListener(STUDY_TIME_CHANGE_EVENT, handler);
    const days = {
      "2026-07-06": {
        shadow: 0,
        shadowPart2: 0,
        simulate: 0,
        pronunciation: 1,
        vocabulary: 0,
      },
    };
    saveStudyDays(days);
    expect(handler).toHaveBeenCalledTimes(1);
    saveStudyDays({ ...days });
    expect(handler).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("study time batches via unchanged hash after successful push", () => {
    const days = {
      "2026-07-06": {
        shadow: 0,
        shadowPart2: 0,
        simulate: 0,
        pronunciation: 1,
        vocabulary: 0,
      },
    };
    noteStudyTimePushSuccess(days);
    expect(shouldSkipStudyTimePush(days)).toBe(true);
    expect(hashStudyDaysPayload(days)).toBe(hashStudyDaysPayload({ ...days }));
  });

  it("idle unchanged vault produces skip", () => {
    noteVaultPushSuccess([sampleWord]);
    expect(shouldSkipVaultPush([sampleWord])).toBe(true);
  });
});
