import { requireUser } from "@/lib/auth/requireUser";

export type AzureSpeechTokenResponse = {
  configured: boolean;
  token?: string;
  region?: string;
  error?: string;
};

export async function issueAzureSpeechToken(): Promise<Response> {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    return Response.json({ configured: false } satisfies AzureSpeechTokenResponse);
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
      const body = await res.text().catch(() => "");
      console.error("[AzureSpeechToken] STS token request failed", {
        status: res.status,
        statusText: res.statusText,
        region,
        body: body.slice(0, 500),
      });
      return Response.json(
        {
          configured: true,
          error: body.trim() || "Falha ao obter token Azure",
        } satisfies AzureSpeechTokenResponse,
        { status: 502 },
      );
    }

    const token = await res.text();
    return Response.json({ configured: true, token, region } satisfies AzureSpeechTokenResponse);
  } catch (err) {
    console.error("[AzureSpeechToken] STS token request error", {
      region,
      error: err instanceof Error ? err.message : String(err),
    });
    return Response.json(
      { configured: true, error: "Azure indisponível" } satisfies AzureSpeechTokenResponse,
      { status: 502 },
    );
  }
}
