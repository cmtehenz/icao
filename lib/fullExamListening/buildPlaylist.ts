import { CARDS } from "@/lib/cards";
import { getPart1CardsForExam } from "@/data/exams/part1";
import { getSituationsByExam } from "@/data/exams/part2Data";
import { examAudioUrl, SOUND_CHECK_TRACK } from "@/lib/exams/audio";
import type { ExamVersion } from "@/lib/exams/types";
import type { ExamAudioItem, FullExamId } from "./types";
import { EXAM_ID_TO_VERSION } from "./types";

function cardByNum(num: string) {
  return CARDS.find((c) => c.num === num);
}

function pushInstruction(
  items: ExamAudioItem[],
  id: string,
  part: ExamAudioItem["part"],
  text: string,
  label?: string,
): void {
  items.push({
    id,
    part,
    type: "instruction",
    speaker: "female_examiner",
    text,
    label,
  });
}

function pushExaminer(
  items: ExamAudioItem[],
  id: string,
  part: ExamAudioItem["part"],
  text: string,
  label?: string,
): void {
  items.push({
    id,
    part,
    type: "examiner_question",
    speaker: "female_examiner",
    text,
    label,
  });
}

function pushModel(
  items: ExamAudioItem[],
  id: string,
  part: ExamAudioItem["part"],
  text: string,
  label?: string,
): void {
  items.push({
    id,
    part,
    type: "model_answer",
    speaker: "male_candidate",
    text,
    label,
  });
}

function pushAudio(
  items: ExamAudioItem[],
  id: string,
  part: ExamAudioItem["part"],
  version: ExamVersion,
  track: number,
  label: string,
): void {
  const src = examAudioUrl(version, track);
  items.push({
    id,
    part,
    type: "original_audio",
    speaker: "original_atc",
    audioSrc: src,
    label,
  });
}

function pushPause(items: ExamAudioItem[], id: string, part: ExamAudioItem["part"], seconds: number): void {
  items.push({ id, part, type: "pause", pauseSeconds: seconds });
}

/** Build the full ordered playlist for one SDEA exam version. */
export function buildFullExamPlaylist(examId: FullExamId): ExamAudioItem[] {
  const version = EXAM_ID_TO_VERSION[examId];
  const items: ExamAudioItem[] = [];

  pushInstruction(
    items,
    `${examId}-intro`,
    "part1",
    "Welcome to the ICAO English proficiency test. This listening simulation follows the real exam structure.",
    "Introduction",
  );

  // —— Part 1 ——
  pushInstruction(
    items,
    `${examId}-p1-intro`,
    "part1",
    "Part One. Aviation Topics. I will ask you three questions. Please answer as fully as you can.",
    "Part 1 — Introduction",
  );

  const part1Nums = getPart1CardsForExam(version);
  part1Nums.forEach((num, i) => {
    const card = cardByNum(num);
    if (!card) return;
    const model =
      card.answerLevel5 ?? card.answerLevel4 ?? card.answer;
    pushExaminer(
      items,
      `${examId}-p1-q${num}`,
      "part1",
      card.question,
      `Part 1 · Question ${i + 1}`,
    );
    pushPause(items, `${examId}-p1-pause-${num}`, "part1", 2);
    pushModel(
      items,
      `${examId}-p1-a${num}`,
      "part1",
      model,
      `Model answer · Q${num}`,
    );
    pushPause(items, `${examId}-p1-gap-${num}`, "part1", 1.5);
  });

  // —— Part 2 ——
  pushInstruction(
    items,
    `${examId}-p2-intro`,
    "part2",
    "Part Two. Interacting as a Pilot. Listen to the controller and read back. Then respond to the situations.",
    "Part 2 — Introduction",
  );

  pushInstruction(
    items,
    `${examId}-p2-soundcheck`,
    "part2",
    "Sound check. Listen to the following recording.",
    "Sound check",
  );
  pushAudio(items, `${examId}-audio-1`, "part2", version, SOUND_CHECK_TRACK, "Sound check — original");

  const situations = getSituationsByExam(version);
  for (const s of situations) {
    const n = s.situationNumber;

    pushInstruction(
      items,
      `${examId}-s${n}-ctx`,
      "part2",
      `Situation ${n}. ${s.context}`,
      `Situation ${n} — ${s.title}`,
    );

    pushExaminer(
      items,
      `${examId}-s${n}-rb-inst`,
      "part2",
      `Listen to ${s.readback.atcFacility} and read back.`,
      `Readback instruction`,
    );

    pushAudio(
      items,
      `${examId}-s${n}-rb-audio`,
      "part2",
      version,
      s.readback.audioTrack,
      `ATC clearance — situation ${n}`,
    );

    pushModel(
      items,
      `${examId}-s${n}-rb-model`,
      "part2",
      s.readback.modelReadback,
      `Model readback`,
    );

    pushPause(items, `${examId}-s${n}-gap1`, "part2", 1.5);

    pushExaminer(
      items,
      `${examId}-s${n}-int`,
      "part2",
      s.interaction.prompt,
      `Interaction prompt`,
    );

    pushModel(
      items,
      `${examId}-s${n}-report`,
      "part2",
      s.interaction.modelReport,
      `Model report`,
    );

    pushPause(items, `${examId}-s${n}-gap2`, "part2", 1);

    pushAudio(
      items,
      `${examId}-s${n}-fu-audio`,
      "part2",
      version,
      s.atcFollowUp.audioTrack,
      `ATC follow-up`,
    );

    pushModel(
      items,
      `${examId}-s${n}-corr`,
      "part2",
      s.atcFollowUp.modelCorrection,
      `AFFIRM / NEGATIVE`,
    );

    pushExaminer(
      items,
      `${examId}-s${n}-rep-q`,
      "part2",
      "What did the controller say?",
      `Reported speech question`,
    );

    pushModel(
      items,
      `${examId}-s${n}-rep-a`,
      "part2",
      s.reportedSpeech.modelAnswer,
      `Reported speech answer`,
    );

    pushPause(items, `${examId}-s${n}-gap3`, "part2", 2);
  }

  // Part 3 / 4 placeholders (not in current SDEA dataset)
  pushInstruction(
    items,
    `${examId}-p3-note`,
    "part3",
    "Part Three. Describing a picture. In the live exam the examiner shows a picture. Practice describing aviation scenes aloud after this simulation.",
    "Part 3 — Note",
  );

  pushInstruction(
    items,
    `${examId}-p4-note`,
    "part4",
    "Part Four. Responding to questions about the picture. This concludes the listening simulation for this exam version.",
    "Part 4 — Note",
  );

  pushInstruction(
    items,
    `${examId}-end`,
    "part4",
    "End of exam listening simulation. Well done.",
    "End",
  );

  return items;
}

export function estimatePlaylistMinutes(items: ExamAudioItem[]): number {
  let seconds = 0;
  for (const item of items) {
    if (item.type === "pause") {
      seconds += item.pauseSeconds ?? 1;
    } else if (item.type === "original_audio") {
      seconds += 45;
    } else if (item.text) {
      seconds += Math.max(8, item.text.split(/\s+/).length * 0.45);
    }
  }
  return Math.max(1, Math.round(seconds / 60));
}
