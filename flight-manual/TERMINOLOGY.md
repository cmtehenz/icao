# ICAO Delta — Standard Terminology

**Authoritative glossary.** Use these terms consistently across the Flight Manual.

When two terms appeared historically, the **Preferred term** is mandatory in new writing. Legacy terms are listed only for search and migration.

**Assistance codes (PA, PR, VB, P1…):** [ASSISTANCE-TAXONOMY.md](./ASSISTANCE-TAXONOMY.md) — use when “Level” would be ambiguous.

**Documentation layers:** [DOCUMENTATION-HIERARCHY.md](./DOCUMENTATION-HIERARCHY.md)

---

## Core product

| Preferred term | Do not use | Notes |
|----------------|------------|-------|
| **ICAO Delta** | English app, language course | An **AI Flight Training Platform** — Digital Flight Academy |
| **Training Program** | Course, module, curriculum (standalone) | Pluggable educational package on the platform — Section 21 |
| **ICAO English** | The app, the platform | **Program 1** (`icao-english`) — first official training program |
| **Captain Delta** | Chatbot, AI assistant, ChatGPT | Personal flight instructor — all programs |
| **Mission Engine** | Study menu, module picker | Central daily workflow — Section 03 |
| **Daily Flight Mission** | Study plan, lesson list | One exam per day, ordered legs — sequence in [mission-flow-matrix.md](./architecture/mission-flow-matrix.md) |
| **Flight Debrief** | Feedback screen, summary | Section 10; session closing |
| **Learning Memory** | Database (product sense), instructor DB | Section 13; what Captain remembers |
| **Mission Recall** | Rapid Review, Quick Review (mission leg) | Section 08; active recall before mock on Intense flights |
| **Mock Exam** | Simulado, practice test | Section 09; examiner mode; Intense daily path |
| **Passive Flight Training** | Audio only (generic) | Pedagogy: learning-tools; infrastructure: Section 11 |

---

## ICAO proficiency (never rename)

| Term | Meaning |
|------|---------|
| **ICAO Level 4** | Minimum operational proficiency — exam outcome |
| **ICAO Level 5** | Extended proficiency — exam outcome |

Do not use assistance codes (PA-5, PR-4, etc.) for ICAO exam results.

---

## Learning tools

| Preferred term | Do not use | File |
|----------------|------------|------|
| **Progressive Assistance** | Scaffolding (generic) | `learning-tools/progressive-assistance.md` |
| **Confidence Gates** | Level unlock, completion gates | `learning-tools/confidence-gates.md` |
| **Conversation Confidence** | Fluency score, English level | `learning-tools/conversation-confidence.md` |
| **Mission Readiness** | Exam ready %, pass probability | `learning-tools/mission-readiness.md` |
| **Mission Timeline** | Progress bar, step list | `learning-tools/mission-timeline.md` |
| **Situation Board** | Operations Room, debrief board | `learning-tools/situation-board.md` |
| **Instructor Whiteboard** | _(component)_ | Final stage **inside** Situation Board |
| **Quick Notes** | Student notes, scratchpad | `learning-tools/quick-notes.md` |
| **Replay Debrief** | Playback review | `learning-tools/replay-debrief.md` |
| **Visual Coaching** | Highlights, keyword mode | `learning-tools/visual-coaching.md` |
| **Flight Logbook** | History, activity log | `learning-tools/flight-logbook.md` |
| **Captain Radio** | Podcast intro, TTS tips | `learning-tools/captain-radio.md` |
| **Adaptive Conversation Engine** | Chat mode | `learning-tools/adaptive-conversation-engine.md` |

### Deprecated terms

| Deprecated | Use instead |
|------------|-------------|
| **Operations Room** | Situation Board |
| **Operational Situation Analysis** | Situation Board |
| **Visual Scenario Discussion** | Visual Coaching |
| **Rapid Review** | Mission Recall |
| **13-database** (chapter) | [13-learning-memory.md](./13-learning-memory.md) |

---

## Missions (sections)

| Section | File | Mission name |
|---------|------|--------------|
| 04 | `04-pronunciation.md` | Pronunciation Mission |
| 05 | `05-vocabulary.md` | Vocabulary Mission |
| 06 | `06-part1.md` | Part 1 Mission |
| 07 | `07-part2.md` | Part 2 Mission |
| 08 | `08-mission-recall.md` | Mission Recall |
| 09 | `09-mock-exam.md` | Mock Exam |
| 10 | `10-debrief.md` | Flight Debrief |
| 11 | `11-audio-missions.md` | Audio Missions *(infrastructure)* — pedagogy: Passive Flight Training |

**Canonical leg order:** [architecture/mission-flow-matrix.md](./architecture/mission-flow-matrix.md)

---

## Roadmap naming

| Term | Meaning |
|------|---------|
| **Era 4–10** | Long-term product evolution buckets in [18-product-roadmap.md](./18-product-roadmap.md) |
| **Version X.Y** (chapter header) | Document revision only — not the same as roadmap Eras |

---

## Technical (outside Flight Manual)

| Term | Location |
|------|----------|
| PostgreSQL / Prisma schema | `docs/database.md` |
| API routes | `docs/api.md` |
| AI prompts | `prompts/` |
| Current code paths | [architecture/runtime-map.md](./architecture/runtime-map.md) |

Product writers must not confuse **Learning Memory** with **database**.
