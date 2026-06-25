import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import {
  isAllowedRecordingMime,
  normalizeRecordingMime,
} from "@/lib/recordings/mime";
import { isBlobStorageEnabled, recordingStorageMode, saveRecording } from "@/lib/recordings/storage";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES =
  process.env.VERCEL === "1" ? 4 * 1024 * 1024 : 8 * 1024 * 1024;

type EvaluationPayload = {
  type?: string;
  question?: string;
  transcript?: string;
  scores?: Record<string, number>;
  icaoLevel?: number | null;
  icaoCriteria?: Record<string, number>;
  summary?: string;
};

function parseScores(scores: Record<string, number> = {}) {
  return {
    overallScore: Number(scores.overall ?? 0),
    structureScore: Number(scores.structure ?? 0),
    contentScore: Number(scores.content ?? 0),
    phraseologyScore: Number(scores.phraseology ?? 0),
    pronunciationScore: Number(scores.pronunciation ?? 0),
  };
}

async function createEvaluationRow(userId: string, body: EvaluationPayload) {
  const scores = parseScores(body.scores);
  return prisma.evaluation.create({
    data: {
      userId,
      type: String(body.type ?? "part1"),
      question: String(body.question ?? "").slice(0, 500),
      transcript: String(body.transcript ?? "").slice(0, 4000),
      ...scores,
      icaoLevel: body.icaoLevel != null ? Number(body.icaoLevel) : null,
      icaoCriteria: body.icaoCriteria ? JSON.stringify(body.icaoCriteria) : null,
      summary: String(body.summary ?? "").slice(0, 1000),
    },
  });
}

async function attachAudioToEvaluation(
  userId: string,
  evaluationId: string,
  file: File,
): Promise<{ ok: true; audioKey: string } | { ok: false; error: string; status: number }> {
  if (file.size === 0) {
    return { ok: false, error: "Arquivo de áudio vazio.", status: 400 };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    const maxMb = Math.round(MAX_AUDIO_BYTES / (1024 * 1024));
    return { ok: false, error: `Áudio muito grande (máx. ${maxMb} MB).`, status: 413 };
  }

  const filename = file.name || "recording.webm";
  const rawMime = file.type || "audio/webm";
  if (!isAllowedRecordingMime(rawMime, filename)) {
    return { ok: false, error: `Tipo de arquivo inválido: ${rawMime || "desconhecido"}.`, status: 400 };
  }

  if (process.env.VERCEL === "1" && !isBlobStorageEnabled()) {
    console.error("[audio] BLOB_READ_WRITE_TOKEN missing on Vercel");
    return {
      ok: false,
      error: "Armazenamento de áudio não configurado (BLOB_READ_WRITE_TOKEN).",
      status: 503,
    };
  }

  const mimeType = normalizeRecordingMime(rawMime, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const audioKey = await saveRecording(userId, evaluationId, buffer, mimeType);
    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { audioKey },
    });
    return { ok: true, audioKey };
  } catch (e) {
    console.error("[audio] save failed", {
      evaluationId,
      storage: recordingStorageMode(),
      error: e,
    });
    return { ok: false, error: "Erro ao salvar áudio.", status: 500 };
  }
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const rows = await prisma.evaluation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      question: true,
      transcript: true,
      overallScore: true,
      structureScore: true,
      contentScore: true,
      phraseologyScore: true,
      pronunciationScore: true,
      icaoLevel: true,
      summary: true,
      audioKey: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    evaluations: rows.map((r) => ({
      ...r,
      hasAudio: !!r.audioKey,
      audioKey: undefined,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const dataRaw = form.get("data");
      if (typeof dataRaw !== "string") {
        return NextResponse.json({ error: "Campo data obrigatório." }, { status: 400 });
      }

      const body = JSON.parse(dataRaw) as EvaluationPayload;
      const row = await createEvaluationRow(user.id, body);

      const audioFile = form.get("audio");
      if (!(audioFile instanceof File)) {
        return NextResponse.json({
          id: row.id,
          createdAt: row.createdAt.toISOString(),
          audioSaved: false,
        });
      }

      const audioResult = await attachAudioToEvaluation(user.id, row.id, audioFile);
      if (!audioResult.ok) {
        return NextResponse.json({
          id: row.id,
          createdAt: row.createdAt.toISOString(),
          audioSaved: false,
          audioError: audioResult.error,
        });
      }

      return NextResponse.json({
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        audioSaved: true,
        audioKey: audioResult.audioKey,
      });
    }

    const body = (await request.json()) as EvaluationPayload;
    const row = await createEvaluationRow(user.id, body);

    return NextResponse.json({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      audioSaved: false,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao salvar avaliação." }, { status: 500 });
  }
}
