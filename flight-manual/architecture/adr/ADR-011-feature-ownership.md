# ADR-011: Feature Ownership

| Field | Value |
|-------|-------|
| **Status** | **Locked** |
| **Date** | July 2026 |
| **Deciders** | Chief Product Architect, Staff Engineer |
| **Related** | ADR-001–010, runtime-map |

---

## Context

Shared ownership caused Sprint 0’s dual home and dual orchestrator. Every feature must have **exactly one owner** — consult, never co-own.

---

## Decision

### Ownership table

| Feature | **Single owner** | Primary entry | Consumes (read-only) |
|---------|------------------|---------------|----------------------|
| **Mission Engine** | `lib/dailyMission.ts` + `lib/*DailyMission.ts` + `lib/dailyMissionSync.ts` | `getNextMissionAction()` | Exam rotation, study mode |
| **Captain Delta** | `components/CaptainDelta/CaptainDeltaProvider.tsx` + `lib/captainDelta/` | `lib/captainDelta/events.ts` | Mission Engine (read), evaluate APIs |
| **Learning Memory** | `lib/captainDelta/memory/*` + `lib/flightInstructor/memory.ts` | `memory/store.ts`, `record.ts` | Evaluations, mission summaries (read) |
| **Mission Timeline** | `components/MissionTimeline/` *(Sprint 2)* + `lib/missionTimeline.ts` *(future)* | Timeline state reader | `getDailyMissionSummary()` |
| **Visual Coaching** | `lib/captainDelta/visual/*` + `CaptainDeltaVisualBridge` | `visual/events.ts` | Captain core events, lesson context |
| **Evaluation** | `lib/evaluate/*` + `app/api/evaluate/route.ts` | `localEvaluate.ts`, evaluate API | Azure STT output, prompts |
| **Azure** | `lib/azure/*` + `app/api/{stt,tts,pronunciation-assessment,azure-speech-token}/` | `serverSpeech.ts` | Env config |
| **Database** | `prisma/schema.prisma` + `lib/db.ts` + `app/api/*` sync routes | Prisma client | — |
| **Telemetry** | `lib/studyActivityRecord.ts` + `lib/studyTime.ts` | `recordStudyActivity()` | Activity events from trainers |
| **Achievements** | `lib/academy/achievements.ts` + `lib/academy/store.ts` | `evaluateAchievements()` | Telemetry, study log — **not** mission writes |
| **Logbook** | `lib/academy/logbook.ts` | `loadLogbookFlights()` | Mission completion events (read) |

### Boundary rules

1. **Owner writes; others read** — cross-feature writes go through owner’s public API.  
2. **No shared folders** — if two teams need the same file, split by owner or extract interface.  
3. **Captain Delta ≠ Mission Engine** — Captain owner may not own `*DailyMission.ts`.  
4. **Evaluation ≠ Mission Engine** — evaluate scores; leg modules mark mission progress when trainer confirms step.  
5. **Database ≠ Learning Memory** — Prisma is persistence; Learning Memory is product semantics (Section 13).

### Escalation

If a feature does not fit this table → **ADR-013+** before Sprint work.

---

## Anti-patterns (forbidden shared ownership)

| Pattern | Resolution |
|---------|------------|
| Captain + Engine both call `savePart1DailyMission` | Engine only |
| Home + Panel both compute next leg | Engine only |
| Achievements + Engine both mark day complete | Engine only |
| Evaluate + Captain both persist vault | Vault owner: `pronunciationVault.ts` |

---

## Verification

- [ ] New PR template asks “feature owner?”
- [ ] CODEOWNERS file (future) maps to this table
