import {
  hashStudyDaysPayload,
  hashVaultPayload,
  payloadsEqualByHash,
} from "@/lib/autosave/payloadHash";
import type { VaultWord } from "@/lib/pronunciationVault";
import type { StudyDaysMap } from "@/lib/studyTime";

let lastVaultPushHash: string | null = null;
let lastStudyTimePushHash: string | null = null;

export function getLastVaultPushHash(): string | null {
  return lastVaultPushHash;
}

export function getLastStudyTimePushHash(): string | null {
  return lastStudyTimePushHash;
}

export function shouldSkipVaultPush(words: VaultWord[]): boolean {
  return payloadsEqualByHash(lastVaultPushHash, hashVaultPayload(words));
}

export function shouldSkipStudyTimePush(days: StudyDaysMap): boolean {
  return payloadsEqualByHash(lastStudyTimePushHash, hashStudyDaysPayload(days));
}

export function noteVaultPushSuccess(words: VaultWord[]): void {
  lastVaultPushHash = hashVaultPayload(words);
}

export function noteStudyTimePushSuccess(days: StudyDaysMap): void {
  lastStudyTimePushHash = hashStudyDaysPayload(days);
}

export function resetAutosaveSyncStateForTests(): void {
  lastVaultPushHash = null;
  lastStudyTimePushHash = null;
}
