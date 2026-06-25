import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { isAllowedRecordingMime, normalizeRecordingMime } from "@/lib/recordings/mime";
import { isBlobStorageEnabled, readRecording, recordingStorageMode, saveRecording } from "@/lib/recordings/storage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const MAX_AUDIO_BYTES =
  process.env.VERCEL === "1" ? 4 * 1024 * 1024 : 8 * 1024 * 1024;

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await context.params;
  const row = await prisma.evaluation.findFirst({
    where: { id, userId: user.id },
    select: { audioKey: true },
  });

  if (!row?.audioKey) {
    return NextResponse.json({ error: "Áudio não encontrado." }, { status: 404 });
  }

  const body = await readRecording(row.audioKey);
  if (!body) {
    return NextResponse.json({ error: "Arquivo de áudio ausente." }, { status: 404 });
  }

  if (body.kind === "stream") {
    return new NextResponse(body.stream, {
      headers: {
        "Content-Type": body.mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  return new NextResponse(new Uint8Array(body.buffer), {
    headers: {
      "Content-Type": body.mimeType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await context.params;
  const row = await prisma.evaluation.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });

  if (!row) {
    return NextResponse.json({ error: "Avaliação não encontrada." }, { status: 404 });
  }

  try {
    const form = await request.formData();
    const file = form.get("audio");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Arquivo de áudio obrigatório." }, { status: 400 });
    }
    if (file.size > MAX_AUDIO_BYTES) {
      const maxMb = Math.round(MAX_AUDIO_BYTES / (1024 * 1024));
      return NextResponse.json({ error: `Áudio muito grande (máx. ${maxMb} MB).` }, { status: 413 });
    }

    const filename = file.name || "recording.webm";
    const rawMime = file.type || "audio/webm";
    if (!isAllowedRecordingMime(rawMime, filename)) {
      return NextResponse.json({ error: `Tipo de arquivo inválido: ${rawMime || "desconhecido"}.` }, { status: 400 });
    }

    if (process.env.VERCEL === "1" && !isBlobStorageEnabled()) {
      return NextResponse.json(
        { error: "Armazenamento de áudio não configurado (BLOB_READ_WRITE_TOKEN)." },
        { status: 503 },
      );
    }

    const mimeType = normalizeRecordingMime(rawMime, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    const audioKey = await saveRecording(user.id, id, buffer, mimeType);

    await prisma.evaluation.update({
      where: { id },
      data: { audioKey },
    });

    return NextResponse.json({ ok: true, audioKey });
  } catch (e) {
    console.error("[audio] upload failed", { storage: recordingStorageMode(), error: e });
    return NextResponse.json({ error: "Erro ao salvar áudio." }, { status: 500 });
  }
}
