/** Checkride probe bank — short speaking diagnostic (RFC-004). */

export type CheckrideStep =
  | { id: string; kind: "word"; prompt: string; reference: string }
  | { id: string; kind: "readback"; prompt: string; reference: string }
  | { id: string; kind: "oral"; prompt: string; reference: string };

export const CHECKRIDE_STEPS: CheckrideStep[] = [
  {
    id: "w1",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "turbulence",
  },
  {
    id: "w2",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "approach",
  },
  {
    id: "w3",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "altitude",
  },
  {
    id: "w4",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "hold short",
  },
  {
    id: "w5",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "go around",
  },
  {
    id: "w6",
    kind: "word",
    prompt: "Say this word clearly:",
    reference: "cleared to land",
  },
  {
    id: "r1",
    kind: "readback",
    prompt: "Read back this clearance:",
    reference: "ANAC123, hold short runway one eight",
  },
  {
    id: "r2",
    kind: "readback",
    prompt: "Read back this clearance:",
    reference: "ANAC123, continue approach runway one four",
  },
  {
    id: "o1",
    kind: "oral",
    prompt:
      "In one or two sentences: what do you do if you hear 'go around' on short final?",
    reference: "go around",
  },
];

export function checkrideProgressLabel(index: number, total: number): string {
  return `Probe ${Math.min(index + 1, total)} of ${total}`;
}
