# Sprint 5 Report — Vocabulary Mission Parity

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Frozen — Mission Engine unchanged

---

## Goal

Transform Vocabulary from simple SRS into a real daily mission with **VB-1 → VB-4** levels, Captain coaching, and Flight Debrief integration.

---

## Files changed

### New

| File | Purpose |
|------|---------|
| `lib/vocabGraduation.ts` | VB level codes, mission term complete (4/4), next level |
| `lib/vocabCoach.ts` | Captain feedback per VB attempt, mission intro copy |
| `lib/vocabMission.ts` | `buildVocabMissionDebrief()` for weak/strong terms |
| `lib/vocabGraduation.test.ts` | Graduation unit tests |
| `components/VocabularyTrainer/VocabMissionPanel.tsx` | Mission-mode UI for today's terms |

### Modified

| File | Change |
|------|--------|
| `lib/vocabRecordings.ts` | Captain coaching + daily complete only when VB 4/4 |
| `lib/studyActivityRecord.ts` | Removed auto-complete on any vocab activity |
| `components/VocabularyTrainer/VocabularyTrainerMode.tsx` | Routes mission terms to `VocabMissionPanel` |
| `components/VocabularyTrainer/VocabTrainingPanel.tsx` | VB-1…VB-4 tab labels |
| `components/VocabularyTrainer/VocabDailyMissionChecklist.tsx` | VB x/4 per term |
| `lib/flightDebrief/buildFlightDebrief.ts` | Vocab weak terms in priority + opening |
| `app/vocabulario/vocab-studio.css` | Mission panel styles |

---

## VB level model

| Code | Name |
|------|------|
| VB-1 | Meaning |
| VB-2 | Operational Expression |
| VB-3 | Aviation Sentence |
| VB-4 | ICAO Use |

**Daily mission rule:** A term counts toward today's 20 only when all four VB levels are passed (≥75% Azure score each). Free practice outside the mission checklist is unchanged.

---

## Captain Delta

- Mission intro in `VocabMissionPanel`
- Per-attempt coaching via `emitCaptainDeltaSuggestion` after Azure assessment
- Flight Debrief uses `buildVocabMissionDebrief()` for weak terms and tomorrow focus

---

## Tests & build

- **45 tests passing** (`npm test`)
- **Build passes** (`npm run build`)

---

## Known limitations

| Limitation | Notes |
|------------|-------|
| VB-5 conversation | Not implemented (ASSISTANCE-TAXONOMY target) |
| Mission mode only for today's 20 terms | Catalog practice still free-form level picker |
| Captain voice/TTS | Text coaching only |
| No separate Flight Instructor JSON for vocab | Uses suggestion + debrief heuristics |

---

## Next recommended sprint

**Sprint 6 — Captain voice + Replay Debrief foundation** (per Sprint 4 roadmap).

---

## Definition of done

- [x] VB-1→VB-4 graduation rules
- [x] Daily mission requires 4/4 levels per term
- [x] VocabMissionPanel for today's terms
- [x] Captain coaching on attempts
- [x] Debrief vocabulary integration
- [x] Tests + build pass
- [x] Docs updated
