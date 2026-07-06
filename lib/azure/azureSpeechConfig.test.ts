import { describe, expect, it, vi } from "vitest";
import {
  AZURE_NOT_CONFIGURED_MESSAGE,
  AZURE_TOKEN_REQUEST_FAILED_MESSAGE,
  fetchAzureSpeechConfig,
  isAzureEnvMissing,
  resolveAzureConfigFromResponse,
} from "@/lib/azure/azureSpeechConfig";

describe("azureSpeechConfig", () => {
  it("treats missing env as not configured on 200", () => {
    const status = resolveAzureConfigFromResponse(
      new Response(JSON.stringify({ configured: false }), { status: 200 }),
      { configured: false },
    );
    expect(isAzureEnvMissing(status)).toBe(true);
    expect(status.hasToken).toBe(false);
  });

  it("token 200 enables recording", () => {
    const status = resolveAzureConfigFromResponse(
      new Response(JSON.stringify({ configured: true, token: "abc", region: "eastus" }), {
        status: 200,
      }),
      { configured: true, token: "abc", region: "eastus" },
    );
    expect(status.configured).toBe(true);
    expect(status.hasToken).toBe(true);
    expect(status.region).toBe("eastus");
  });

  it("token 502 shows token request failed, not env missing", () => {
    const status = resolveAzureConfigFromResponse(
      new Response(JSON.stringify({ configured: true, error: "fail" }), { status: 502 }),
      { configured: true, error: "fail" },
    );
    expect(isAzureEnvMissing(status)).toBe(false);
    expect(status.configured).toBe(true);
    expect(status.hasToken).toBe(false);
    expect(AZURE_TOKEN_REQUEST_FAILED_MESSAGE).toContain("token request failed");
  });

  it("401 is not treated as missing env", () => {
    const status = resolveAzureConfigFromResponse(
      new Response(JSON.stringify({ error: "Não autenticado." }), { status: 401 }),
      { configured: false, error: "Não autenticado." },
    );
    expect(isAzureEnvMissing(status)).toBe(false);
    expect(status.configured).toBe(true);
    expect(status.hasToken).toBe(false);
  });

  it("fetchAzureSpeechConfig logs configured token on 200", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ configured: true, token: "tok", region: "eastus" }), {
          status: 200,
        }),
      ),
    );

    const status = await fetchAzureSpeechConfig();
    expect(status.hasToken).toBe(true);
    expect(info).toHaveBeenCalledWith(
      "[AzureConfig]",
      expect.objectContaining({
        configured: true,
        hasToken: true,
        region: "eastus",
      }),
    );

    info.mockRestore();
    vi.unstubAllGlobals();
  });

  it("missing env message is distinct from token failure", () => {
    expect(AZURE_NOT_CONFIGURED_MESSAGE).toContain("not configured");
    expect(AZURE_TOKEN_REQUEST_FAILED_MESSAGE).toContain("token request failed");
  });
});
