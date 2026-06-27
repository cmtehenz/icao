import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { dbWordToVault, vaultWordToDb } from "@/lib/vaultMerge";
import {
  resetVaultWordCounts,
  sanitizeVaultWord,
  vaultCountLooksCorrupt,
  type VaultWord,
} from "@/lib/pronunciationVault";

export async function GET() {
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
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  try {
    const body = await request.json();
    const incoming = ((body.words ?? []) as VaultWord[]).map(sanitizeVaultWord);
    if (!Array.isArray(incoming)) {
      return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
    }

    const deduped = new Map<string, VaultWord>();
    for (const word of incoming) {
      deduped.set(word.word.toLowerCase(), word);
    }
    const merged = [...deduped.values()].sort((a, b) => a.lowestAccuracy - b.lowestAccuracy);

    await prisma.$transaction(async (tx) => {
      await tx.vaultWord.deleteMany({ where: { userId: user.id } });
      if (merged.length) {
        await tx.vaultWord.createMany({
          data: merged.map((word) => vaultWordToDb(word, user.id)),
        });
      }
    });

    return NextResponse.json({ words: merged, total: merged.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao salvar palavras." }, { status: 500 });
  }
}
