import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

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

  try {
    const body = await request.json();
    const scores = body.scores ?? {};

    const row = await prisma.evaluation.create({
      data: {
        userId: user.id,
        type: String(body.type ?? "part1"),
        question: String(body.question ?? "").slice(0, 500),
        transcript: String(body.transcript ?? "").slice(0, 4000),
        overallScore: Number(scores.overall ?? 0),
        structureScore: Number(scores.structure ?? 0),
        contentScore: Number(scores.content ?? 0),
        phraseologyScore: Number(scores.phraseology ?? 0),
        pronunciationScore: Number(scores.pronunciation ?? 0),
        icaoLevel: body.icaoLevel != null ? Number(body.icaoLevel) : null,
        icaoCriteria: body.icaoCriteria ? JSON.stringify(body.icaoCriteria) : null,
        summary: String(body.summary ?? "").slice(0, 1000),
      },
    });

    return NextResponse.json({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao salvar avaliação." }, { status: 500 });
  }
}
