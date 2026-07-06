import type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";

export type AzureSpeechConfigStatus = {
  configured: boolean;
  hasToken: boolean;
  region?: string;
  token?: string;
  tokenStatus: number | "network_error";
  error?: string;
};

export const AZURE_NOT_CONFIGURED_MESSAGE =
  "Azure Speech is not configured. Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.";

export const AZURE_TOKEN_REQUEST_FAILED_MESSAGE =
  "Azure token request failed. Check server env.";

export function traceAzureConfig(status: AzureSpeechConfigStatus): void {
  console.info("[AzureConfig]", {
    configured: status.configured,
    tokenStatus: status.tokenStatus,
    region: status.region ?? null,
    hasToken: status.hasToken,
    error: status.error ?? null,
  });
}

export function resolveAzureConfigFromResponse(
  res: Response,
  data: AzureSpeechTokenResponse,
): AzureSpeechConfigStatus {
  if (res.status === 401) {
    return {
      configured: true,
      hasToken: false,
      tokenStatus: res.status,
      error: data.error,
    };
  }

  if (!data.configured) {
    return {
      configured: false,
      hasToken: false,
      tokenStatus: res.status,
      error: data.error,
    };
  }

  const hasToken = res.ok && !!data.token && !!data.region;
  return {
    configured: true,
    hasToken,
    region: data.region,
    token: data.token,
    tokenStatus: res.status,
    error: data.error,
  };
}

export function isAzureEnvMissing(status: AzureSpeechConfigStatus): boolean {
  return status.tokenStatus === 200 && status.configured === false;
}

export function azureConfigStartErrorMessage(status: AzureSpeechConfigStatus): string {
  if (!status.configured) return AZURE_NOT_CONFIGURED_MESSAGE;
  if (!status.hasToken) return AZURE_TOKEN_REQUEST_FAILED_MESSAGE;
  return AZURE_TOKEN_REQUEST_FAILED_MESSAGE;
}

export async function fetchAzureSpeechConfig(): Promise<AzureSpeechConfigStatus> {
  try {
    const res = await fetch("/api/azure-speech-token");
    const data = (await res.json()) as AzureSpeechTokenResponse;
    const status = resolveAzureConfigFromResponse(res, data);
    traceAzureConfig(status);
    return status;
  } catch (e) {
    const status: AzureSpeechConfigStatus = {
      configured: false,
      hasToken: false,
      tokenStatus: "network_error",
      error: e instanceof Error ? e.message : "network_error",
    };
    traceAzureConfig(status);
    return status;
  }
}

/** Server env present (token may still fail). */
export function isAzureEnvConfigured(status: AzureSpeechConfigStatus): boolean {
  return status.configured === true;
}
