# Event Catalog

**ICAO Delta browser event architecture — post Architecture Lock.**

**Related:** ADR-006, ADR-008, ADR-009, [event-governance.md](./event-governance.md)

Events use `window.dispatchEvent(CustomEvent)`. **No Redux.** Namespaces prevent coupling.

---

## Namespaces

| Namespace | Owner | Purpose |
|-----------|-------|---------|
| **Core Events** | `lib/captainDelta/events.ts` | Captain coaching UI |
| **Visual Events** | `lib/captainDelta/visual/events.ts` | Visual coaching highlights |
| **Examiner Events** | `lib/captainDelta/examiner/events.ts` | Simulado persona |
| **Telemetry Events** | `lib/studyActivityRecord.ts`, `lib/studyTime.ts` | Study points, activity |
| **Mission Events** | `lib/*DailyMission.ts`, `lib/dailyMissionSync.ts` | Leg state changed |

---

## Core Events (Captain Delta coaching)

| Constant | String | Emitter | Subscriber | Payload |
|----------|--------|---------|------------|---------|
| `CAPTAIN_DELTA_SUGGESTION` | `icao-captain-delta-suggestion` | `emitCaptainDeltaSuggestion` | `CaptainDeltaProvider` | `CaptainDeltaSuggestionPayload` |
| `CAPTAIN_DELTA_AFTER_ANSWER` | `icao-captain-delta-after-answer` | `emitCaptainDeltaAfterAnswer` | `CaptainDeltaProvider` | `CaptainDeltaAfterAnswerPayload` |
| `CAPTAIN_DELTA_DEBRIEF` | `icao-captain-delta-debrief` | `emitCaptainDeltaDebrief` | `CaptainDeltaProvider` | `CaptainDeltaDebriefPayload` |

**Also core-adjacent** (lesson UI, not mission state):

| Constant | File | Purpose |
|----------|------|---------|
| `CAPTAIN_DELTA_LESSON_CONTEXT` | `lessonContext.ts` | Route context for coach |
| `CAPTAIN_DELTA_START_RECORD` | `lessonContext.ts` | PTT record start |
| `CAPTAIN_DELTA_STOP_RECORD` | `lessonContext.ts` | PTT record stop |
| `CAPTAIN_DELTA_SECONDARY_ACTION` | `lessonContext.ts` | Secondary coach action |

---

## Visual Events

| Constant | String | Emitter | Subscriber |
|----------|--------|---------|------------|
| `CAPTAIN_DELTA_VISUAL_PLAN` | `icao-captain-delta-visual-plan` | `emitCaptainDeltaVisualPlan` | `CaptainDeltaVisualBridge` |
| `CAPTAIN_DELTA_VISUAL_CLEAR` | `icao-captain-delta-visual-clear` | `emitCaptainDeltaVisualClear` | `CaptainDeltaVisualBridge` |

---

## Examiner Events

| Constant | String | When |
|----------|--------|------|
| `CAPTAIN_DELTA_ROLE` | `icao-captain-delta-role` | Enter/exit examiner persona |
| `CAPTAIN_DELTA_EXAM_STEP` | `icao-captain-delta-exam-step` | Simulado step advance |
| `CAPTAIN_DELTA_EXAM_FINISHED` | `icao-captain-delta-exam-finished` | Mock complete |
| `EXAMINER_HISTORY_EVENT` | `icao-captain-delta-examiner-change` | Examiner history store |

**Rule:** Examiner events only during `/simulado` flow (Mock Exam leg).

---

## Telemetry Events

| Constant | String | Owner | Purpose |
|----------|--------|-------|---------|
| `STUDY_ACTIVITY_RECORDED_EVENT` | `icao-study-activity-recorded` | `studyActivityRecord.ts` | Points + minutes |
| `STUDY_ACTIVITY_NEAR_MISS_EVENT` | `icao-study-activity-near-miss` | `studyActivityRecord.ts` | Near goal feedback |
| `STUDY_PLAN_CHANGE_EVENT` | `icao-study-plan-change` | `studyTime.ts` | Standard/intense toggle |
| `STUDY_TIME_CHANGE_EVENT` | `icao-study-time-change` | `studyTime.ts` | Day activity updated |
| `SCORE_HISTORY_CHANGE_EVENT` | `icao-score-history-change` | `scoreHistory.ts` | Score snapshots |
| `ACADEMY_CHANGE_EVENT` | `icao-academy-change` | `academy/store.ts` | Gamification store |
| `ACADEMY_SESSION_END` | `icao-academy-session-end` | `academy/events.ts` | Session end (deprecated path) |

Telemetry **must not** mutate mission leg state (ADR-008).

---

## Mission Events

| Constant | Leg module |
|----------|------------|
| `PRONUNCIATION_DAILY_MISSION_EVENT` | `pronunciationDailyMission.ts` |
| `VOCAB_DAILY_MISSION_EVENT` | `vocabDailyMission.ts` |
| `PART1_DAILY_MISSION_EVENT` | `part1DailyMission.ts` |
| `PART2_DAILY_MISSION_EVENT` | `part2DailyMission.ts` |
| `DAILY_MISSION_LOG_EVENT` | `dailyMissionLog.ts` |
| `DAILY_MISSION_SYNC_EVENT` | `dailyMissionSync.ts` |
| `MISSION_RECALL_EVENT` | `missionRecallProgress.ts` |
| `MISSION_RECALL_START_EVENT` | `missionRecall/events.ts` |
| `MISSION_RECALL_COMPLETE_EVENT` | `missionRecall/events.ts` |
| `FLIGHT_DEBRIEF_EVENT` | `flightDebriefProgress.ts` |
| `FLIGHT_DEBRIEF_AVAILABLE_EVENT` | `flightDebrief/events.ts` |
| `FLIGHT_DEBRIEF_COMPLETE_EVENT` | `flightDebrief/events.ts` |

**Subscribers:** `DailyMissionPanel`, dashboards, `AuthProvider` (sync) — **not** CaptainDeltaProvider for checklist refresh (ADR-006).

---

## Learning Memory events (read-side notifications)

| Constant | Owner |
|----------|-------|
| `CAPTAIN_DELTA_MEMORY_EVENT` | `memory/store.ts` |
| `CAPTAIN_DELTA_SESSION_RECORD` | `memory/events.ts` |
| `INSTRUCTOR_MEMORY_EVENT` | `flightInstructor/memory.ts` |

Memory events update **personalization stores**, not mission leg completion.

---

## Governance summary

See [event-governance.md](./event-governance.md):

| Class | Requirement |
|-------|-------------|
| **Breaking** | New ADR + update this catalog |
| **Minor** | Update this catalog only |

---

## Legacy / deprecated events

| Event | Status |
|-------|--------|
| `ACADEMY_SESSION_END` | Deprecated with `AcademySessionBridge` (ADR-007) |

Do not add subscribers to deprecated events in new code.
