/** Short pipeline labels for Part 2 mission UI (aligned with Part 1 chips). */
export const PART2_MISSION_STEP_LABELS = [
  "Listen",
  "Readback",
  "Situation",
  "Report",
  "ATC",
  "Confirm",
  "Examiner",
  "Reported",
  "Review",
] as const;

export const PART2_MISSION_STEP_TECHNIQUES = [
  "Active listening",
  "Clearance elements",
  "Abnormal event",
  "Problem report",
  "Listen again",
  "AFFIRM / NEG",
  "Examiner Q",
  "Reported speech",
  "Debrief",
] as const;

export function part2MissionStepMeta(stepIndex: number): {
  label: string;
  technique: string;
  captainHint: string;
} {
  const label = PART2_MISSION_STEP_LABELS[stepIndex] ?? "Step";
  const technique = PART2_MISSION_STEP_TECHNIQUES[stepIndex] ?? "Exam flow";
  const hints = [
    "Headset on. Jot clearance codes on your paper — no ATC text on screen.",
    "Read back all clearance elements. Callsign at start or end.",
    "Read the abnormal situation. Add problem codes to your paper.",
    "Facility, callsign, problem, intention, request — speak clearly.",
    "Listen to the controller. Check your paper before you confirm.",
    "AFFIRM or NEGATIVE — short and precise.",
    "The examiner asks: what did the controller say?",
    "Reported speech for the examiner — use your paper notes.",
    "Compare models, then continue to the next situation or finish the exam.",
  ];
  return {
    label,
    technique,
    captainHint: hints[stepIndex] ?? "",
  };
}
