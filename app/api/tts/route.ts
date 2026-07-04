import { synthesizeServerMp3 } from "@/lib/azure/serverSpeech";
import type { AzureVoiceRole } from "@/lib/azure/azureTts";
import { requireUser } from "@/lib/auth/requireUser";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  let body: { text?: string; voiceType?: AzureVoiceRole };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) return Response.json({ error: "text required" }, { status: 400 });

  const role: AzureVoiceRole =
    body.voiceType === "male_candidate"
      ? "male_candidate"
      : body.voiceType === "captain_delta"
        ? "captain_delta"
        : "female_examiner";
  const buffer = await synthesizeServerMp3(text, role);
  if (!buffer) {
    return Response.json({ error: "Azure TTS unavailable" }, { status: 503 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
