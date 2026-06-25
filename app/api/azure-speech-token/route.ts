import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";

export async function GET() {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    return Response.json({ configured: false });
  }

  try {
    const res = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: { "Ocp-Apim-Subscription-Key": key },
      },
    );

    if (!res.ok) {
      return Response.json(
        { configured: true, error: "Falha ao obter token Azure" },
        { status: 502 },
      );
    }

    const token = await res.text();
    return Response.json({ configured: true, token, region });
  } catch {
    return Response.json({ configured: true, error: "Azure indisponível" }, { status: 502 });
  }
}

export type AzureSpeechTokenResponse = {
  configured: boolean;
  token?: string;
  region?: string;
  error?: string;
};

export type { AzurePronunciationResult };
