# Sprint 6.1 Report — Continuous AI Presence

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Frozen — HEX, Mission Engine, CDLI unchanged

---

## Problem

Sprint 6 HEX correctly silenced Captain Delta during oral assessment, but users perceived the AI as broken. Silence looked like abandonment.

## UX principle shipped

**Presence over Activity** — AI does not need to speak constantly; it must feel present. The interface communicates who is active, who is observing, and what comes next.

---

## Deliverables

### Task 1 — Persistent AI status indicator

- `AIPresenceIndicator` in `MissionFocusLayout`
- `AIPresenceProvider` + `lib/aiPresence/events.ts`
- Auto-updates: Captain monitoring / Examiner assessing / Captain preparing debrief

### Task 2 — Examiner presence banner

- `ExaminerPresencePanel` — persistent, compact, non-modal
- "Captain Delta is listening. You'll receive coaching after this discussion."

### Task 3 — Conversation progress

- Discussion `N / total` + stage pipeline (Question → … → Captain Debrief)

### Task 4 — Captain standby

- Standby line inside examiner panel
- FAB visual standby ring during HEX

### Task 5 — Floating Captain never empty

- `CaptainStandbyCard` when FAB opens without `currentMessage`

### Task 6 — Voice independence

- `CAPTAIN_DELTA_PROACTIVE_ENABLED = true` separate from `CAPTAIN_DELTA_VOICE_ENABLED`
- Pronunciation suggestions emit without voice gate

### Task 7 — Examiner thinking state

- 500ms delayed "Examiner is preparing the next question…" with pulse animation

### Task 8 — Conversation transition

- 1.4s closing beat before Captain debrief fetch
- Presence phases: `conversation_closing` → `captain_standby` → `captain_debrief`

### Task 9 — Explicit conversation states

`idle`, `examiner_speaking`, `student_speaking`, `examiner_thinking`, `listening`, `conversation_closing`, `captain_standby`, `captain_debrief`

### Task 10 — Recovery

- `processHexAnswerSafe()` — graceful fallback + conversation close on repeated failure

---

## Files

| New | Purpose |
|-----|---------|
| `lib/aiPresence/types.ts` | Phase + presence types |
| `lib/aiPresence/conversationPresence.ts` | Phase derivation, progress, copy |
| `lib/aiPresence/events.ts` | Global presence events |
| `lib/aiPresence/processHexAnswer.ts` | Safe HEX processing |
| `lib/aiPresence/tests/aiPresence.test.ts` | 14 tests |
| `components/aiPresence/*` | Indicator, panel, provider, standby card |

| Modified | Change |
|----------|--------|
| `VoiceCoachPanel.tsx` | HEX presence UI, thinking, transition |
| `CaptainDeltaFloatingAssistant.tsx` | Standby card |
| `lib/captainDelta/voiceConfig.ts` | Voice ≠ intelligence |
| `MissionFocusLayout.tsx` | Presence indicator |
| `AppShell.tsx` | AIPresenceProvider |
| `PronunciationWordsMode.tsx` | Un-gated suggestions |

---

## Tests & build

- **84 tests passing** (`npm test`)
- **Build passes** (`npm run build`)

---

## Definition of done

- [x] Persistent AI presence indicator
- [x] Examiner banner during HEX
- [x] Conversation progress
- [x] Captain standby visible
- [x] FAB never opens empty
- [x] Voice independent from intelligence
- [x] Examiner thinking state
- [x] Natural conversation → debrief transition
- [x] Explicit conversation states
- [x] Recovery path
- [x] Tests + build pass
- [x] Docs updated
