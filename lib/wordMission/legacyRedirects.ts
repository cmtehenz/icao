import { resolveVocabTermIdForWord, wordMissionLink } from "@/lib/wordMission/wordDailyMission";

function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const raw = params[key];
  if (Array.isArray(raw)) return raw[0]?.trim() || undefined;
  return raw?.trim() || undefined;
}

export function legacyPronunciationRedirectTarget(
  params: Record<string, string | string[] | undefined>,
): string {
  const word = paramValue(params, "word");
  if (word) {
    const termId = resolveVocabTermIdForWord(word);
    if (termId) return wordMissionLink(termId);
  }
  return "/word-mission";
}

export function legacyVocabRedirectTarget(
  params: Record<string, string | string[] | undefined>,
): string {
  const term = paramValue(params, "term");
  if (term) return wordMissionLink(term);
  return "/word-mission";
}
