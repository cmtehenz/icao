import type { ExaminerProfile } from "@/lib/humanExaminer/types";

export type ProfileLimits = {
  maxFollowUps: number;
  tonePrefix: string;
  recoveryFriendly: boolean;
};

const PROFILE_LIMITS: Record<ExaminerProfile, ProfileLimits> = {
  neutral: { maxFollowUps: 4, tonePrefix: "", recoveryFriendly: true },
  curious: { maxFollowUps: 5, tonePrefix: "Interesting. ", recoveryFriendly: true },
  reserved: { maxFollowUps: 3, tonePrefix: "", recoveryFriendly: false },
  supportive: { maxFollowUps: 4, tonePrefix: "Good. ", recoveryFriendly: true },
  time_pressure: { maxFollowUps: 2, tonePrefix: "Quickly — ", recoveryFriendly: false },
};

export const DEFAULT_EXAMINER_PROFILE: ExaminerProfile = "neutral";

export function getProfileLimits(profile: ExaminerProfile): ProfileLimits {
  return PROFILE_LIMITS[profile];
}

export function formatExaminerLine(profile: ExaminerProfile, question: string): string {
  const { tonePrefix } = getProfileLimits(profile);
  return `${tonePrefix}${question}`.trim();
}
