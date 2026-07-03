import { assessServerPronunciation } from "@/lib/azure/serverSpeech";
import { requireUser } from "@/lib/auth/requireUser";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  let body: { audioBase64?: string; referenceText?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.audioBase64) {
    return Response.json({ error: "audioBase64 required" }, { status: 400 });
  }

  const result = await assessServerPronunciation(body.audioBase64, body.referenceText ?? "");
  if (!result) {
    return Response.json({ error: "Pronunciation assessment failed" }, { status: 422 });
  }

  return Response.json(result);
}
