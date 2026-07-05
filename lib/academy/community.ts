import type { CommunityFeatureFlags } from "@/lib/academy/types";

/** Future-ready community module — flags only, no implementation yet. */
export const COMMUNITY_FLAGS: CommunityFeatureFlags = {
  leaderboards: false,
  instructorChallenges: false,
  weeklyMissions: false,
  liveMockExams: false,
  sharedStatistics: false,
};

export function communityComingSoon(): string[] {
  return [
    "Leaderboards",
    "Instructor challenges",
    "Weekly academy missions",
    "Live mock exams",
    "Shared statistics",
  ];
}
