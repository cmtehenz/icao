import type { CaptainStudentModel } from "@/lib/captainDelta/infinity/types";

const GENERIC_PRAISE = /^(good job|nice job|well done|great job)\.?$/i;

export function isGenericPraise(text: string): boolean {
  return GENERIC_PRAISE.test(text.trim());
}

export function specificPraiseForSuccess(
  model: CaptainStudentModel,
  word: string,
  context: { focus?: "rhythm" | "stress" | "clarity" | "sentence" | "general" },
): string {
  const q = `"${word.trim()}"`;
  if (context.focus === "rhythm" || model.pronunciationWeakness === "rhythm") {
    return `Nice — your rhythm improved a lot on that sentence. ${q} flowed naturally.`;
  }
  if (context.focus === "stress" || model.pronunciationWeakness === "stress") {
    return `Strong — the stress on ${q} landed much more naturally that time.`;
  }
  if (context.focus === "clarity" || model.pronunciationWeakness === "vowel") {
    return `Clear — ${q} came through sharper. I understood you on the first pass.`;
  }
  if (model.wordMastered) {
    return `Solid — ${q} is ready to use in a real line now.`;
  }
  if (context.focus === "sentence") {
    return `Nice — that full sentence sounded like a calm radio call. ${q} fit naturally.`;
  }
  return `Nice — ${q} sounded clear and operational. That's the level we want.`;
}

export function specificPraiseForPartial(
  word: string,
  understood: boolean,
): string {
  const q = `"${word.trim()}"`;
  if (understood) {
    return `Good attempt — I understood you, and ${q} is almost there.`;
  }
  return `Good attempt on ${q} — let's polish one sound, not the whole sentence.`;
}
