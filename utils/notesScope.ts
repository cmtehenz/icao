import type { NotesScope, RecommendedNotes } from "@/lib/exams/types";
import { codesEquivalent, normalizeNoteToken, variantsForCode } from "./noteNormalization";

/** Codes that belong to interaction / emergency / follow-up — not initial clearance readback */
const INTERACTION_CODE_RE =
  /^(GEAR|FIRE|CAB|MED|PAX|ENG|GPS|HYD|LF|RTN|DIV|EMLND|FOD|DRONE|DOG|BIRD|COLLISION|TOW|NEG|AFF|CFM|HLD|HOTOIL|SMK|LOP|ELEC|FMS|PROP|WS|GPWS)/i;

export function idealLabelForCode(code: string, idealNotes: string[]): string {
  for (const ideal of idealNotes) {
    if (codesEquivalent(code, ideal)) return ideal;
  }
  const normCode = normalizeNoteToken(code);
  for (const ideal of idealNotes) {
    const normIdeal = normalizeNoteToken(ideal);
    if (normIdeal.includes(normCode) || normCode.includes(normIdeal)) return ideal;
  }
  return code;
}

function deriveReadbackScope(full: RecommendedNotes): NotesScope {
  const requiredCodes = full.requiredCodes.filter(
    (code) => !INTERACTION_CODE_RE.test(normalizeNoteToken(code)),
  );

  const optionalCodes = [
    ...(full.optionalCodes ?? []),
    ...full.requiredCodes.filter((code) => INTERACTION_CODE_RE.test(normalizeNoteToken(code))),
  ];

  const idealNotes = full.idealNotes.filter(
    (ideal) => !INTERACTION_CODE_RE.test(normalizeNoteToken(ideal)),
  );

  return {
    idealNotes: idealNotes.length ? idealNotes : full.idealNotes.slice(0, 3),
    requiredCodes: requiredCodes.length ? requiredCodes : full.requiredCodes.slice(0, 1),
    optionalCodes: [...new Set(optionalCodes)],
  };
}

export type NotesComparisonScope = "full" | "readback";

export function resolveNotesScope(
  notes: RecommendedNotes,
  scope: NotesComparisonScope,
): NotesScope {
  if (scope === "readback") {
    return notes.readback ?? deriveReadbackScope(notes);
  }
  return notes;
}
