import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Não autenticado." }, { status: 401 }),
    };
  }
  return { user, response: null };
}
