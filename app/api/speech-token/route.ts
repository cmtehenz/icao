import { issueAzureSpeechToken } from "@/lib/azure/speechToken";

export async function GET() {
  return issueAzureSpeechToken();
}

export type { AzureSpeechTokenResponse } from "@/lib/azure/speechToken";
