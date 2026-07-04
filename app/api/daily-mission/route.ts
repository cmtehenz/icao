import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import {
  mergeDailyMissionBundles,
  type DailyMissionBundle,
} from "@/lib/dailyMissionSync";
import type { Part1DailyMissionState } from "@/lib/part1DailyMission";
import type { Part2DailyMissionState } from "@/lib/part2DailyMission";
import type { VocabDailyMissionState } from "@/lib/vocabDailyMission";

export const runtime = "nodejs";

const HISTORY_DAYS = 60;

function dateKeyFromInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return value;
}

function rowToBundle(row: {
  date: Date;
  part1: unknown;
  part2: unknown;
  vocab: unknown;
  complete: boolean;
}): DailyMissionBundle {
  const date = row.date.toISOString().slice(0, 10);
  return {
    date,
    part1: (row.part1 as Part1DailyMissionState | null) ?? null,
    part2: (row.part2 as Part2DailyMissionState | null) ?? null,
    vocab: (row.vocab as VocabDailyMissionState | null) ?? null,
    complete: row.complete,
  };
}

function emptyBundle(date: string): DailyMissionBundle {
  return { date, part1: null, part2: null, vocab: null, complete: false };
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const date = dateParam ? dateKeyFromInput(dateParam) : null;

  if (date) {
    const row = await prisma.dailyMissionDay.findUnique({
      where: {
        userId_date: { userId: user.id, date: new Date(`${date}T12:00:00`) },
      },
    });
    const logRows = await prisma.dailyMissionDay.findMany({
      where: { userId: user.id, complete: true },
      select: { date: true },
      orderBy: { date: "desc" },
      take: HISTORY_DAYS,
    });
    const log: Record<string, boolean> = {};
    for (const r of logRows) {
      log[r.date.toISOString().slice(0, 10)] = true;
    }
    const bundle = row ? rowToBundle(row) : emptyBundle(date);
    return NextResponse.json({ mission: { ...bundle, log } });
  }

  const rows = await prisma.dailyMissionDay.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: HISTORY_DAYS,
  });

  const log: Record<string, boolean> = {};
  for (const r of rows) {
    if (r.complete) log[r.date.toISOString().slice(0, 10)] = true;
  }

  const latest = rows[0] ? rowToBundle(rows[0]) : null;
  return NextResponse.json({
    mission: latest ? { ...latest, log } : { date: null, part1: null, part2: null, vocab: null, complete: false, log },
  });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  try {
    const body = (await request.json()) as DailyMissionBundle;
    const date = dateKeyFromInput(body.date);
    if (!date) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }

    const incoming: DailyMissionBundle = {
      date,
      part1: body.part1 ?? null,
      part2: body.part2 ?? null,
      vocab: body.vocab ?? null,
      complete: !!body.complete,
      log: body.log && typeof body.log === "object" ? body.log : {},
    };

    const existing = await prisma.dailyMissionDay.findUnique({
      where: {
        userId_date: { userId: user.id, date: new Date(`${date}T12:00:00`) },
      },
    });

    const remote = existing ? rowToBundle(existing) : emptyBundle(date);
    const merged = mergeDailyMissionBundles(incoming, remote);

    await prisma.dailyMissionDay.upsert({
      where: {
        userId_date: { userId: user.id, date: new Date(`${date}T12:00:00`) },
      },
      create: {
        userId: user.id,
        date: new Date(`${date}T12:00:00`),
        part1: merged.part1 ?? undefined,
        part2: merged.part2 ?? undefined,
        vocab: merged.vocab ?? undefined,
        complete: merged.complete,
      },
      update: {
        part1: merged.part1 ?? undefined,
        part2: merged.part2 ?? undefined,
        vocab: merged.vocab ?? undefined,
        complete: merged.complete,
      },
    });

    // Merge completion log from other days the client knows about
    if (incoming.log) {
      const logEntries = Object.entries(incoming.log).filter(([, v]) => v);
      await Promise.all(
        logEntries.map(async ([logDate, done]) => {
          if (!done || logDate === date) return;
          const key = dateKeyFromInput(logDate);
          if (!key) return;
          await prisma.dailyMissionDay.upsert({
            where: {
              userId_date: { userId: user.id, date: new Date(`${key}T12:00:00`) },
            },
            create: {
              userId: user.id,
              date: new Date(`${key}T12:00:00`),
              complete: true,
            },
            update: { complete: true },
          });
        }),
      );
    }

    const logRows = await prisma.dailyMissionDay.findMany({
      where: { userId: user.id, complete: true },
      select: { date: true },
      orderBy: { date: "desc" },
      take: HISTORY_DAYS,
    });
    const log: Record<string, boolean> = {};
    for (const r of logRows) {
      log[r.date.toISOString().slice(0, 10)] = true;
    }
    if (merged.complete) log[date] = true;

    return NextResponse.json({ mission: { ...merged, log } });
  } catch (e) {
    console.error("[daily-mission] save failed", e);
    return NextResponse.json({ error: "Erro ao salvar missão." }, { status: 500 });
  }
}
