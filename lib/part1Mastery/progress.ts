const STORAGE_KEY = "icao_part1_mastery_card_v1";
export const PART1_MASTERY_PROGRESS_EVENT = "icao-part1-mastery-progress-change";

export type Part1CardStudyProgress = {
  briefSeen: boolean;
  anchorDone: boolean;
  keywordsDone: boolean;
};

export type Part1MasteryProgressStore = Record<string, Part1CardStudyProgress>;

function emptyCard(): Part1CardStudyProgress {
  return { briefSeen: false, anchorDone: false, keywordsDone: false };
}

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PART1_MASTERY_PROGRESS_EVENT));
}

export function loadPart1MasteryProgress(): Part1MasteryProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Part1MasteryProgressStore;
  } catch {
    return {};
  }
}

function save(store: Part1MasteryProgressStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  notify();
}

export function getPart1CardStudyProgress(cardNum: string): Part1CardStudyProgress {
  return loadPart1MasteryProgress()[cardNum] ?? emptyCard();
}

function patchCard(
  cardNum: string,
  patch: Partial<Part1CardStudyProgress>,
): Part1CardStudyProgress {
  const store = loadPart1MasteryProgress();
  const next = { ...(store[cardNum] ?? emptyCard()), ...patch };
  save({ ...store, [cardNum]: next });
  return next;
}

export function markPart1BriefSeen(cardNum: string): Part1CardStudyProgress {
  return patchCard(cardNum, { briefSeen: true });
}

export function markPart1AnchorDone(cardNum: string): Part1CardStudyProgress {
  return patchCard(cardNum, { anchorDone: true, briefSeen: true });
}

export function markPart1KeywordsDone(cardNum: string): Part1CardStudyProgress {
  return patchCard(cardNum, { keywordsDone: true });
}

export function clearPart1CardStudyProgress(cardNums: string[]): void {
  const store = loadPart1MasteryProgress();
  for (const raw of cardNums) {
    const padded = raw.padStart(2, "0");
    delete store[padded];
    delete store[raw];
  }
  save(store);
}
