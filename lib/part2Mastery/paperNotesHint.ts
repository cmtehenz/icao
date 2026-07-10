import type { NotesScope, RecommendedNotes } from "@/lib/exams/types";

export type PaperNotesPhase = "readback" | "problem" | "confirm" | "reported";

export type PaperNotesHint = {
  phase: PaperNotesPhase;
  /** Codes Captain suggests jotting on paper — not the full model answer. */
  codes: string[];
  captainLine: string;
};

function normalizeKey(code: string): string {
  return code.trim().toUpperCase();
}

/** Loose match — optional "FREQ" matches ideal "FREQ 119.25". */
export function codesMatch(idealNote: string, poolCode: string): boolean {
  const note = normalizeKey(idealNote);
  const pool = normalizeKey(poolCode);
  return note === pool || note.includes(pool) || pool.includes(note);
}

/** Keep idealNotes order; include codes from required/optional pool only. */
export function pickCodesInIdealOrder(
  idealNotes: string[],
  requiredCodes: string[],
  optionalCodes: string[] = [],
  limit = 10,
): string[] {
  const pool = [...requiredCodes, ...optionalCodes];
  if (!idealNotes.length) {
    return pool.slice(0, limit);
  }

  const out: string[] = [];
  const seen = new Set<string>();

  for (const note of idealNotes) {
    if (!pool.some((code) => codesMatch(note, code))) continue;
    const key = normalizeKey(note);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(note);
    if (out.length >= limit) break;
  }

  for (const code of pool) {
    const key = normalizeKey(code);
    if (seen.has(key)) continue;
    if (out.some((note) => codesMatch(note, code))) continue;
    seen.add(key);
    out.push(code);
    if (out.length >= limit) break;
  }

  return out;
}

const CLEARANCE_HINT =
  /^(SQK|RWY|HDG|HD|↑|↓|FL|FREQ|EXPECT|TAXI|RPT|ILS|RNAV|VIS|DCT|VEC|MAINT|PRC|HOLD)/i;

function isClearanceShorthand(note: string): boolean {
  return CLEARANCE_HINT.test(note.trim());
}

/** Clearance-only codes in idealNotes order (when readback.idealNotes is absent). */
function readbackCodesInOrder(notes: RecommendedNotes): string[] {
  const scope = notes.readback ?? notes;
  if (scope.idealNotes.length) return scope.idealNotes.slice(0, 10);

  const pool = [...scope.requiredCodes, ...(scope.optionalCodes ?? [])];
  return notes.idealNotes
    .filter(
      (note) =>
        isClearanceShorthand(note) && pool.some((code) => codesMatch(note, code)),
    )
    .slice(0, 10);
}

/** Situation codes after the readback segment — still in full idealNotes order. */
function problemCodesInOrder(notes: RecommendedNotes): string[] {
  const readbackScope = notes.readback ?? notes;
  const readbackKeys = new Set(
    (readbackScope.idealNotes.length
      ? readbackScope.idealNotes
      : readbackCodesInOrder(notes)
    ).map(normalizeKey),
  );

  return notes.idealNotes.filter((note) => {
    const key = normalizeKey(note);
    if ([...readbackKeys].some((rb) => key === rb || codesMatch(note, rb))) return false;
    const pool = [...notes.requiredCodes, ...(notes.optionalCodes ?? [])];
    return pool.some((code) => codesMatch(note, code));
  });
}

function confirmCodesInOrder(notes: RecommendedNotes): string[] {
  const pool = notes.requiredCodes.filter((c) => /AFF|NEG|CFM|HLD/i.test(c));
  return pickCodesInIdealOrder(notes.idealNotes, pool, notes.optionalCodes ?? []);
}

/** After clearance — problem, ATC echo, confirm (excludes readback segment). */
function reportedCodesInOrder(notes: RecommendedNotes): string[] {
  return problemCodesInOrder(notes);
}

/** Step index matches FullSimulationMode (0–8). */
export function paperNotesHintForStep(
  step: number,
  recommendedNotes?: RecommendedNotes,
): PaperNotesHint {
  if (!recommendedNotes) {
    return {
      phase: "readback",
      codes: [],
      captainLine:
        "Use paper and pen like the real SDEA. Jot clearance elements while you listen — squawk, altitude, heading, frequency.",
    };
  }

  if (step <= 1) {
    return {
      phase: "readback",
      codes: readbackCodesInOrder(recommendedNotes),
      captainLine:
        "Listen once. Jot clearance elements on your paper in this order — not full sentences:",
    };
  }

  if (step <= 3) {
    return {
      phase: "problem",
      codes: problemCodesInOrder(recommendedNotes).slice(0, 10),
      captainLine:
        "Add problem and intention codes on your paper as the abnormal situation unfolds:",
    };
  }

  if (step <= 5) {
    return {
      phase: "confirm",
      codes: confirmCodesInOrder(recommendedNotes).slice(0, 10),
      captainLine:
        "Controller replied. Check your paper — AFFIRM or NEGATIVE? Confirm key facts before you speak:",
    };
  }

  if (step === 6) {
    return {
      phase: "reported",
      codes: [],
      captainLine:
        "You already wrote notes when the controller spoke. Answer from your paper — no new clearance codes here.",
    };
  }

  return {
    phase: "reported",
    codes: reportedCodesInOrder(recommendedNotes).slice(0, 10),
    captainLine:
      "Report what the controller said — use your paper from the ATC reply (problem, hold, confirm), not the departure clearance:",
  };
}
