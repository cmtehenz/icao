# Implementation Status

**Purpose:** Compare Flight Manual specification to what exists in the codebase **today**.

**Not a roadmap.** For release planning see [18-product-roadmap.md](./18-product-roadmap.md). For shipped UX see [CURRENT-PRODUCT.md](./CURRENT-PRODUCT.md).

**Legend:** ✅ Implemented · 🟡 Partial · 🔴 Planned · 🔵 Vision

---

## Mission Engine

| Capability | Spec | Backend | Frontend | Captain Delta | Azure | DB | Status | Priority |
|------------|------|---------|----------|---------------|-------|-----|--------|----------|
| Daily exam rotation 23C–26C | 03 | — | ✅ | — | — | — | ✅ | — |
| Pronunciation daily (5 words) | 04 | — | ✅ | 🟡 | ✅ | ✅ | ✅ | — |
| Vocabulary daily (20 terms) | 05 | — | ✅ | — | — | local | ✅ | — |
| Part 1 daily (3 cards shadow+coach) | 06 | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ | — |
| Part 2 daily (5 situations) | 07 | ✅ | ✅ | 🟡 | ✅ | 🟡 | ✅ | — |
| Mission Recall leg | 08 | — | 🟡 | 🟡 | 🟡 | ✅ | 🟡 | P2 |
| Mock Exam (intense mode) | 09 | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 | P2 |
| Flight Debrief panel | 10 | ✅ | ✅ | 🟡 | — | ✅ | 🟡 | P2 |
| End-of-flight debrief leg | 10 | ✅ | 🟡 | 🟡 | — | ✅ | 🟡 | P2 |
| Passive Flight Training | 11 | — | 🟡 | 🔴 | ✅ | — | 🟡 | P3 |
| "Begin Flight" unified briefing | 03A | — | ✅ | 🟡 | — | — | 🟡 | P2 |
| Mission Timeline UI | tool | — | 🟡 | — | — | — | 🟡 | P2 |
| Mission Focus Layout (no sidebar on flight) | UX | — | ✅ | — | — | — | ✅ | — |
| Continuous AI Presence (Sprint 6.1) | UX | — | ✅ | ✅ | — | — | ✅ | — |

---

## Captain Delta

| Capability | Spec | Backend | Frontend | Captain Delta | Azure | DB | Status | Priority |
|------------|------|---------|----------|---------------|-------|-----|--------|----------|
| Identity & personality rules | 02 | — | — | ✅ | — | — | ✅ | — |
| Screen coach (PTT) | 02 | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | P3 |
| Post-answer Flight Instructor | 10 | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| Proactive route tips / briefing | 02 | — | 🔴 | 🔴 | 🔴 | — | 🔴 | P3 |
| TTS voice | 02 | ✅ | 🔴 | 🔴 | ✅ | — | 🔴 | voice off |
| Examiner mode (simulado) | 09 | — | ✅ | 🟡 | 🟡 | 🟡 | 🟡 | P2 |
| Context isolation (pronunciation) | 02 | — | ✅ | ✅ | — | — | ✅ | — |
| Multi-agent AI Brain | 14 | 🔴 | — | — | — | — | 🔵 | vision |

---

## Missions (detail)

| Capability | Spec | Backend | Frontend | Captain Delta | Azure | DB | Status | Priority |
|------------|------|---------|----------|---------------|-------|-----|--------|----------|
| Pronunciation vault + graduation L1–L4 | 04 | 🟡 | ✅ | 🟡 | ✅ | ✅ | ✅ | — |
| Vocabulary SRS + exam pool | 05 | — | ✅ | — | — | local | ✅ | — |
| Vocabulary L1–L4 parity | 05 | — | ✅ | 🟡 | 🟡 | local | ✅ | — |
| Part 1 PEEL shadow | 06 | ✅ | ✅ | — | ✅ | local | ✅ | — |
| Part 1 professional conversation / follow-up | 06 | ✅ | ✅ | 🟡 | — | local | ✅ | — |
| Part 2 readback element scoring | 07 | ✅ | ✅ | — | ✅ | — | ✅ | — |
| Part 2 full simulation | 07 | ✅ | ✅ | 🟡 | ✅ | local | ✅ | — |
| Simulado Part 1 per exam version | 09 | — | ✅ | — | — | local | ✅ | recent |
| Simulado Part 3–4 production | 09 | 🟡 | 🟡 | 🟡 | 🟡 | — | 🟡 | P3 |
| Escutar Prova / offline packs | 11 | — | ✅ | — | ✅ | local | 🟡 | P3 |

---

## Learning tools

| Tool | Spec | Backend | Frontend | Captain Delta | Azure | DB | Status | Priority |
|------|------|---------|----------|---------------|-------|-----|--------|----------|
| Progressive Assistance | LT | — | 🟡 | 🟡 | — | — | 🟡 | P1 |
| Confidence Gates | LT | — | 🔴 | 🔴 | — | — | 🔴 | P2 |
| Conversation Confidence | LT | — | 🔴 | — | — | — | 🔴 | P2 |
| Mission Readiness | LT | — | 🔴 | 🔴 | — | — | 🔴 | P2 |
| Mission Timeline | LT | — | 🟡 | — | — | — | 🟡 | P2 |
| Situation Board | LT | — | 🔴 | 🔴 | — | — | 🔴 | P3 |
| Quick Notes | LT | — | 🟡 | — | — | local | 🟡 | P2 |
| Replay Debrief | LT | — | 🔴 | 🔴 | — | — | 🔴 | P3 |
| Visual Coaching | LT | — | 🟡 | 🟡 | — | — | 🟡 | P2 |
| Flight Logbook | LT | 🟡 | 🔴 | — | — | 🟡 | 🔴 | P3 |
| Captain Radio | LT | — | 🔴 | 🔴 | ✅ | — | 🔴 | P3 |
| Passive Flight Training modes | LT | — | 🔴 | 🔴 | ✅ | — | 🔴 | P3 |
| Adaptive Conversation Engine | LT | 🔴 | 🔴 | 🔴 | — | — | 🔵 | vision |

*LT = learning-tools/*

---

## Learning Memory & data

| Capability | Spec | Backend | Frontend | Captain Delta | Azure | DB | Status | Priority |
|------------|------|---------|----------|---------------|-------|-----|--------|----------|
| Instructor memory (local) | 13 | — | ✅ | ✅ | — | local | ✅ | — |
| Captain Delta memory store | 13 | — | ✅ | ✅ | — | local | 🟡 | P2 |
| Vault sync server | 13 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Evaluation history | 13 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| StudyDay / activity sync | 13 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| DailyMissionDay sync | 03 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Recall/debrief server sync | 03 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Pronunciation daily server sync | 03 | ✅ | ✅ | — | — | ✅ | ✅ | — |
| Unified Learning Memory API | 13 | 🔴 | — | — | — | 🔴 | 🔵 | vision |

---

## Summary by status

| Status | Count (approx.) | Meaning |
|--------|-----------------|---------|
| ✅ Implemented | Core missions, vault, simulado P1–2, auth, evaluate APIs | Shipped in production |
| 🟡 Partial | Debrief UX, visual coaching, passive listen, examiner | Works but not full spec |
| 🔴 Planned | Mission Recall, timeline, situation board, vocabulary levels, unified briefing | In manual, not built |
| 🔵 Vision | AI Brain agents, adaptive conversation, logbook UI, Captain Radio | Long-term |

---

## Priority key

| Priority | Meaning |
|----------|---------|
| P1 | Next product slice — mission completeness |
| P2 | Learning tools + mock exam polish |
| P3 | Passive training + advanced debrief UI |

Update this file when shipping features. **Never mark 🔵 or 🔴 as ✅.**
