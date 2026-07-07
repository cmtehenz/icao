import { CARDS } from "@/lib/cards";
import { getSituationsByExam } from "@/data/exams/part2Data";
import { getTodayExamVersion, getTodayPart1CardNums } from "@/lib/dailyExamRotation";
import { pickDailySlice } from "@/lib/dailyRotation";
import { getOrCreatePart1DailyMission } from "@/lib/part1DailyMission";
import { getOrCreatePronunciationDailyMission } from "@/lib/pronunciationDailyMission";
import { getOrCreateWordDailyMission } from "@/lib/wordMission/wordDailyMission";
import { getWordMissionVocabulary } from "@/lib/wordMission/wordMissionCatalog";
import type { MissionRecallItem } from "@/lib/missionRecall/missionRecallTypes";
import { todayKey } from "@/lib/studyTime";

const PRONUNCIATION_RECALL_COUNT = 3;
const VOCAB_RECALL_COUNT = 3;
const PART2_RECALL_COUNT = 2;

function vocabMeaningPrompt(meaning: string): string {
  return `What aviation word or phrase matches: "${meaning}"? Then use it in one operational sentence.`;
}

function part2RecallPrompts(situation: ReturnType<typeof getSituationsByExam>[number]): string[] {
  const prompts: string[] = [];
  if (situation.readback?.atcMessage) {
    prompts.push("What did ATC instruct in today's readback scenario?");
  }
  if (situation.interaction?.prompt) {
    prompts.push("What did you report in today's abnormal situation?");
  }
  if (situation.atcFollowUp?.atcMessage) {
    prompts.push("What did the controller tell you after your report?");
  }
  return prompts;
}

/** Build recall items from today's mission material only (Section 08). */
export function buildMissionRecallItems(dateKey = todayKey()): MissionRecallItem[] {
  const items: MissionRecallItem[] = [];

  const pronMission = getOrCreatePronunciationDailyMission();
  const vocabMission = getOrCreateWordDailyMission();
  const part1Mission = getOrCreatePart1DailyMission(dateKey);
  const examVersion = getTodayExamVersion(dateKey);
  const situations = getSituationsByExam(examVersion);

  const pronWords = pickDailySlice(
    pronMission.words.filter((w) => pronMission.completedWords.includes(w.toLowerCase()) || pronMission.words.includes(w)),
    Math.min(PRONUNCIATION_RECALL_COUNT, pronMission.words.length),
    dateKey,
    3,
  );
  if (!pronWords.length) {
    pronWords.push(...pickDailySlice(pronMission.words, PRONUNCIATION_RECALL_COUNT, dateKey, 3));
  }

  for (const word of pronWords) {
    const key = word.toLowerCase();
    items.push({
      id: `pron-${key}`,
      stage: "pronunciation",
      prompt: `Pronounce "${word}" naturally, then use it in one sentence.`,
      sourceRef: `pronunciation:${key}`,
    });
  }

  const vocabTerms = vocabMission.termIds
    .map((id) => getWordMissionVocabulary().find((t) => t.id === id))
    .filter((t): t is ReturnType<typeof getWordMissionVocabulary>[number] => !!t);
  const recallTerms = pickDailySlice(vocabTerms, Math.min(VOCAB_RECALL_COUNT, vocabTerms.length), dateKey, 7);

  for (const term of recallTerms) {
    items.push({
      id: `vocab-${term.id}`,
      stage: "vocabulary",
      prompt: vocabMeaningPrompt(term.meaning),
      sourceRef: `vocabulary:${term.id}`,
    });
  }

  const part1Nums = getTodayPart1CardNums(dateKey);
  const part1Num = part1Nums[daysMod(part1Nums.length, dateKey)] ?? part1Mission.cards[0]?.cardNum;
  const part1Card = CARDS.find((c) => c.num === part1Num);
  if (part1Card) {
    items.push({
      id: `part1-${part1Card.num}`,
      stage: "part1",
      prompt: part1Card.question,
      sourceRef: `part1:${part1Card.num}`,
    });
  }

  const part2Picks = pickDailySlice(situations, Math.min(PART2_RECALL_COUNT, situations.length), dateKey, 11);
  part2Picks.forEach((situation, index) => {
    const prompts = part2RecallPrompts(situation);
    const prompt = prompts[index % prompts.length] ?? `Recall today's scenario: ${situation.title}`;
    items.push({
      id: `part2-${situation.id}`,
      stage: "part2",
      prompt,
      sourceRef: `part2:${situation.id}`,
    });
  });

  const surpriseVocab = recallTerms[0] ?? vocabTerms[0];
  const surprisePart1 = part1Card;
  if (surpriseVocab && surprisePart1) {
    items.push({
      id: "surprise-1",
      stage: "surprise",
      prompt: `Surprise: connect "${surpriseVocab.term}" to today's Part 1 topic — ${surprisePart1.question.slice(0, 80)}…`,
      sourceRef: `surprise:${surpriseVocab.id}:${surprisePart1.num}`,
    });
  } else if (surprisePart1) {
    items.push({
      id: "surprise-1",
      stage: "surprise",
      prompt: `Surprise: answer today's Part 1 question from memory — ${surprisePart1.question}`,
      sourceRef: `surprise:part1:${surprisePart1.num}`,
    });
  }

  return items;
}

function daysMod(length: number, dateKey: string): number {
  if (length <= 0) return 0;
  const ms = new Date(`${dateKey}T12:00:00`).getTime();
  const day = Math.floor(ms / (24 * 60 * 60 * 1000));
  return day % length;
}
