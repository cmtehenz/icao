import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/requireUser", () => ({
  requireUser: vi.fn(async () => ({ user: { id: "test" }, response: null })),
}));

describe("issueAzureSpeechToken", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("logs STS failure body before returning 502", async () => {
    vi.stubEnv("AZURE_SPEECH_KEY", "test-key");
    vi.stubEnv("AZURE_SPEECH_REGION", "eastus");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Invalid subscription key", { status: 401, statusText: "Unauthorized" }),
      ),
    );

    const { issueAzureSpeechToken } = await import("@/lib/azure/speechToken");
    const res = await issueAzureSpeechToken();
    expect(res.status).toBe(502);
    expect(errorSpy).toHaveBeenCalledWith(
      "[AzureSpeechToken] STS token request failed",
      expect.objectContaining({
        status: 401,
        region: "eastus",
      }),
    );
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
