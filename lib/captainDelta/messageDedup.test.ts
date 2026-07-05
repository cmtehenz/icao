import { describe, expect, it } from "vitest";
import { buildActiveMissionTermLine } from "@/lib/captainDelta/briefing";
import {
  buildCaptainMessageKey,
  createCaptainMessageDedupState,
  evaluateCaptainMessageDelivery,
  markActiveTermDelivered,
  shouldDeliverActiveTermSync,
} from "@/lib/captainDelta/messageDedup";

describe("Captain message dedup", () => {
  it("builds stable message keys from route, kind, term, speech, source", () => {
    const key = buildCaptainMessageKey({
      route: "pronunciation",
      kind: "coaching",
      activeTerm: "route",
      text: 'Today\'s word: "route".',
      speechText: "Today's word: route.",
      source: "sync-effect",
    });
    expect(key).toContain("pronunciation");
    expect(key).toContain("route");
    expect(key).toContain("sync-effect");
  });

  it("same eventId processed twice is ignored", () => {
    let state = createCaptainMessageDedupState();
    const input = {
      route: "pronunciation" as const,
      kind: "coaching" as const,
      activeTerm: "route",
      text: 'Today\'s word: "route".',
      speechText: "Today's word: route.",
      source: "sync-effect",
      eventId: "sync-term:pronunciation:route",
    };
    const first = evaluateCaptainMessageDelivery(state, input);
    expect(first.deliver).toBe(true);
    state = first.next;

    const second = evaluateCaptainMessageDelivery(state, input);
    expect(second.deliver).toBe(false);
    expect(second.reason).toBe("duplicate eventId");
  });

  it("duplicate message key within window is ignored", () => {
    let state = createCaptainMessageDedupState();
    const input = {
      route: "pronunciation" as const,
      kind: "coaching" as const,
      activeTerm: "route",
      text: 'Today\'s word: "route".',
      speechText: "Today's word: route.",
      source: "sync-effect",
    };
    state = evaluateCaptainMessageDelivery(state, input).next;
    const second = evaluateCaptainMessageDelivery(state, input);
    expect(second.deliver).toBe(false);
    expect(second.reason).toBe("duplicate message key");
  });

  it("shouldDeliverActiveTermSync blocks re-speak for same term", () => {
    let state = markActiveTermDelivered(createCaptainMessageDedupState(), "route");
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "route")).toBe(false);
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "descend")).toBe(true);
  });

  it("changing active term allows one new sync delivery", () => {
    let state = createCaptainMessageDedupState();
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "route")).toBe(true);
    state = markActiveTermDelivered(state, "route");
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "route")).toBe(false);
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "descend")).toBe(true);
  });

  it("activeWord route emits one Captain sync message only", () => {
    let state = createCaptainMessageDedupState();
    const line = buildActiveMissionTermLine("route", "pronunciation");
    const eventId = "sync-term:pronunciation:route";
    const input = {
      route: "pronunciation" as const,
      kind: "coaching" as const,
      activeTerm: "route",
      text: line.text,
      speechText: line.speechText,
      source: "sync-effect",
      eventId,
    };
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "route")).toBe(true);
    const first = evaluateCaptainMessageDelivery(state, input);
    expect(first.deliver).toBe(true);
    state = first.next;
    expect(shouldDeliverActiveTermSync(state, "pronunciation", "route")).toBe(false);
    const second = evaluateCaptainMessageDelivery(state, input);
    expect(second.deliver).toBe(false);
  });
});
