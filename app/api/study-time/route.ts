import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import {
  dateKeyFromInput,
  mergeStudyDays,
  normalizeStudyDay,
  studyDaysToMap,
  studyDayToDbFields,
  type StudyDaysMap,
} from "@/lib/studyTimeMerge";

const HISTORY_DAYS = 365;

function cutoffDate(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - HISTORY_DAYS);
  return d;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const rows = await prisma.studyDay.findMany({
    where: {
      userId: user.id,
      date: { gte: cutoffDate() },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ days: studyDaysToMap(rows) });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  try {
    const body = await request.json();
    const incomingRaw = (body.days ?? {}) as StudyDaysMap;
    if (typeof incomingRaw !== "object" || incomingRaw === null) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }

    const incoming: StudyDaysMap = {};
    for (const [date, day] of Object.entries(incomingRaw)) {
      const key = dateKeyFromInput(date);
      if (!key || !day) continue;
      incoming[key] = normalizeStudyDay(day);
    }

    const remoteRows = await prisma.studyDay.findMany({
      where: { userId: user.id, date: { gte: cutoffDate() } },
    });
    const merged = mergeStudyDays(incoming, studyDaysToMap(remoteRows));

    await prisma.$transaction(
      Object.entries(merged).map(([dateStr, day]) => {
        const fields = studyDayToDbFields(day);
        return prisma.studyDay.upsert({
          where: {
            userId_date: {
              userId: user.id,
              date: new Date(`${dateStr}T12:00:00`),
            },
          },
          create: {
            userId: user.id,
            date: new Date(`${dateStr}T12:00:00`),
            ...fields,
          },
          update: fields,
        });
      }),
    );

    return NextResponse.json({ days: merged });
  } catch (e) {
    console.error("[study-time] save failed", e);
    return NextResponse.json({ error: "Erro ao salvar atividades de estudo." }, { status: 500 });
  }
}
