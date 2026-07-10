# 07 — Part 2 Mission (SDEA)

## Why Part 2 is different from Part 1

Part 1 teaches **structured oral answers** through retrieval (anchors → keywords → solo). Part 2 is **exam simulation under radio pressure** — listen, read back, report problems, confirm, reported speech.

The daily flight runs **one full Part 2 exam per day** (today's prova 23C–26C, all 5 situations). It is not broken into separate readback / interaction / reported tabs during the mission leg.

---

## Design principle: train like the real SDEA

| Real exam | ICAO Delta mission |
|-----------|-------------------|
| Paper and pen for quick notes | **Paper & pen** — Captain suggests codes; student writes offline |
| Listen to clearance audio | Original exam audio; **no ATC transcript** on listen steps |
| One continuous exam flow | Sound check → 5 situations × 9 steps → ICAO debrief |
| No digital scratchpad | No on-screen Quick Notes pad in mission mode |

Browse mode (`/part2?browse=1`) keeps readback / interaction / reported tabs for open review — no daily queue, no pronunciation warm-up gate, digital Quick Notes optional.

---

## Daily leg (Mission Engine)

| Item | Rule |
|------|------|
| Exam version | Same rotation as Part 1 — Mon→23C, Tue→24C, Wed→25C, Thu→26C |
| Situations | All **5** from that prova |
| Complete | All 5 situations finished + daily flag `simulationDone` |
| Route | `/part2` (mission default) |

Captain Delta shows **code hints** (from `part2RecommendedNotes`) — squawk, altitude, GEAR STK, AFF, etc. These are prompts for paper shorthand, not model answers.

After each situation, **Paper self-check** shows ideal notes so the student compares what they wrote on paper.

---

## Authority

| Owner | Responsibility |
|-------|----------------|
| Mission Engine | Today's exam version; leg complete when full exam done |
| `FullSimulationMode` (`missionMode`) | Exam flow, audio, Azure recordings |
| `paperNotesHint.ts` | Code hints per step |
| Browse trainer | Readback / interaction / reported / simulation unlock |

---

## Anti-patterns

- Typing notes on screen during the daily flight (breaks exam fidelity)
- Showing ATC clearance text before readback in mission mode
- Marking Part 2 daily complete from browse simulation only
- Splitting today's flight into disconnected Part 2 tabs
