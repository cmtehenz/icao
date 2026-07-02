import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { dbWordToVault, normalizeVaultWordKey, vaultWordToDb } from "@/lib/vaultMerge";
import {
  resetVaultWordCounts,
  sanitizeVaultWord,
  vaultCountLooksCorrupt,
  type VaultWord,
} from "@/lib/pronunciationVault";

export const runtime = "nodejs";

function prismaCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: string }).code);
  }
  return undefined;
}

function isSchemaMismatchError(error: unknown): boolean {
  const code = prismaCode(error);
  if (code === "P2022" || code === "P2021") return true;

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("passCount") ||
    message.includes("does not exist") ||
    message.includes("column") ||
    message.includes("VaultWord")
  );
}

function isTransactionPoolerError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Transaction") ||
    message.includes("transaction") ||
    message.includes("prepared statement") ||
    message.includes("25P02")
  );
}

async function replaceUserVault(userId: string, rows: ReturnType<typeof vaultWordToDb>[]) {
  await prisma.vaultWord.deleteMany({ where: { userId } });
  if (!rows.length) return;

  try {
    await prisma.vaultWord.createMany({ data: rows, skipDuplicates: true });
  } catch (error) {
    if (prismaCode(error) !== "P2002") throw error;

    for (const row of rows) {
      await prisma.vaultWord.upsert({
        where: { userId_word: { userId, word: row.word } },
        create: row,
        update: {
          lowestAccuracy: row.lowestAccuracy,
          lastAccuracy: row.lastAccuracy,
          errorType: row.errorType,
          errorLabel: row.errorLabel,
          context: row.context,
          timesSeen: row.timesSeen,
          practiceCount: row.practiceCount,
          passCount: row.passCount,
          lastSeenAt: row.lastSeenAt,
          lastPracticedAt: row.lastPracticedAt,
        },
      });
    }
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const rows = await prisma.vaultWord.findMany({
      where: { userId: user.id },
      orderBy: { lowestAccuracy: "asc" },
    });

    const needsDbRepair = rows.some(
      (row) => vaultCountLooksCorrupt(row.timesSeen) || vaultCountLooksCorrupt(row.practiceCount),
    );

    if (needsDbRepair && rows.length) {
      await prisma.vaultWord.updateMany({
        where: { userId: user.id },
        data: { timesSeen: 1, practiceCount: 1 },
      });
      return NextResponse.json({
        words: rows.map((row) => resetVaultWordCounts(dbWordToVault(row))),
      });
    }

    return NextResponse.json({ words: rows.map(dbWordToVault).map(sanitizeVaultWord) });
  } catch (error) {
    console.error("[vault GET]", error);
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        {
          error:
            "Banco desatualizado. Rode prisma migrate deploy no Neon ou redeploy na Vercel com DATABASE_URL configurado.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Erro ao carregar palavras." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  try {
    const body = await request.json();
    const raw = Array.isArray(body.words) ? (body.words as VaultWord[]) : [];
    const incoming = raw.map(sanitizeVaultWord);

    const deduped = new Map<string, VaultWord>();
    for (const word of incoming) {
      const key = normalizeVaultWordKey(word.word);
      if (key.length < 2) continue;
      deduped.set(key, { ...word, word: key });
    }
    const merged = [...deduped.values()].sort((a, b) => a.lowestAccuracy - b.lowestAccuracy);

    const rows = merged.flatMap((word) => {
      try {
        return [vaultWordToDb(word, user.id)];
      } catch (e) {
        console.warn("[vault PUT] skipping invalid word", word.word, e);
        return [];
      }
    });

    await replaceUserVault(user.id, rows);

    const saved = rows.map((row) =>
      sanitizeVaultWord({
        word: row.word,
        lowestAccuracy: row.lowestAccuracy,
        lastAccuracy: row.lastAccuracy,
        errorType: row.errorType,
        errorLabel: row.errorLabel,
        context: row.context,
        timesSeen: row.timesSeen,
        practiceCount: row.practiceCount,
        passCount: row.passCount,
        returnCount: 0,
        lastSeenAt: row.lastSeenAt.toISOString(),
        lastPracticedAt: row.lastPracticedAt?.toISOString(),
      }),
    );

    return NextResponse.json({ words: saved, total: saved.length });
  } catch (error) {
    console.error("[vault PUT]", error);
    if (isSchemaMismatchError(error)) {
      return NextResponse.json(
        {
          error:
            "Banco desatualizado. Rode prisma migrate deploy no Neon ou redeploy na Vercel com DATABASE_URL configurado.",
        },
        { status: 503 },
      );
    }
    if (isTransactionPoolerError(error)) {
      return NextResponse.json(
        { error: "Erro temporário ao salvar. Tente novamente em alguns segundos." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Erro ao salvar palavras." }, { status: 500 });
  }
}
