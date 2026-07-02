import { buildFullExamPlaylist, estimatePlaylistMinutes } from "@/lib/fullExamListening/buildPlaylist";
import type { ExamAudioItem, FullExamId, FullExamMeta } from "@/lib/fullExamListening/types";
import { EXAM1_META } from "./exam1";
import { EXAM2_META } from "./exam2";
import { EXAM3_META } from "./exam3";
import { EXAM4_META } from "./exam4";

const BASE_METAS = [EXAM1_META, EXAM2_META, EXAM3_META, EXAM4_META];

export const FULL_EXAM_METAS: FullExamMeta[] = BASE_METAS.map((m) => ({
  ...m,
  durationEstimateMin: estimatePlaylistMinutes(buildFullExamPlaylist(m.id)),
}));

export function getExamPlaylist(id: FullExamId): ExamAudioItem[] {
  return buildFullExamPlaylist(id);
}

export function getExamMeta(id: FullExamId): FullExamMeta {
  return FULL_EXAM_METAS.find((e) => e.id === id) ?? FULL_EXAM_METAS[0];
}

export { EXAM1_META, EXAM2_META, EXAM3_META, EXAM4_META };
