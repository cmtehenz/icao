import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import {
  isAllowedRecordingMime,
  normalizeRecordingMime,
  playbackContentType,
} from "@/lib/recordings/mime";
import {
  isBlobStorageEnabled,
  readRecordingBuffer,
  recordingStorageMode,
  saveRecording,
} from "@/lib/recordings/storage";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const MAX_AUDIO_BYTES =
  process.env.VERCEL === "1" ? 4 * 1024 * 1024 : 8 * 1024 * 1024;

function audioResponse(
  buffer: Buffer,
  mimeType: string,
  request: Request,
): NextResponse {
  const size = buffer.length;
  const headers = {
    "Content-Type": mimeType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  };

  const rangeHeader = request.headers.get("range");
  if (rangeHeader) {
    const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : size - 1;
      if (start >= size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }
      const slice = buffer.subarray(start, end + 1);
      return new NextResponse(new Uint8Array(slice), {
        status: 206,
        headers: {
          ...headers,
          "Content-Length": String(slice.length),
          "Content-Range": `bytes ${start}-${end}/${size}`,
        },
      });
    }
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      ...headers,
      "Content-Length": String(size),
    },
  });
}

export async function GET(request: Request, context: RouteContext) {
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

  const recording = await readRecordingBuffer(row.audioKey);
  if (!recording) {
    return NextResponse.json({ error: "Arquivo de áudio ausente." }, { status: 404 });
  }

  const mimeType = playbackContentType(recording.mimeType, row.audioKey);
  return audioResponse(recording.buffer, mimeType, request);
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
