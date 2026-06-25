import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
