# 09 — ICAOFlix

## Purpose

ICAOFlix is a **secondary video library** — curated YouTube references organized by Part 1 categories. It complements the daily mission (speak-first) with operational context, CRM, phraseology, and exam mindset.

It does **not** replace recording legs or become the home CTA.

---

## Positioning

| Rule | Detail |
|------|--------|
| Secondary surface | Same tier as Escutar Prova — sidebar nav + home quick link only |
| No auto-play | Student presses play; embed loads on demand in modal |
| No mission gate | Watching is optional; never blocks daily mission progression |
| Curated only | Tier 2–5 sources (FAA, SKYbrary, EuroSafety Training, approved instructors) — no AI-invented media |

---

## Captain recommendations

When the student has recorded difficulty data (`buildDifficultyInsights`):

1. Match weak Part 1 cards → videos linked to that card
2. Match weak Part 2 situations → phraseology / CRM tags
3. Match weak vocabulary / pronunciation → tagged reference videos

**Pinned section:** recommended videos the student has **not** marked as watched appear at the top under “Captain recomenda”. After `markVideoWatched`, they leave the pinned row but remain in the catalog.

Recommendations are **deterministic** (no LLM) in MVP.

---

## Data model

Catalog: [`data/icaoFlix/catalog.ts`](../data/icaoFlix/catalog.ts)

```ts
type IcaoFlixVideo = {
  id: string;
  youtubeId: string;
  title: string;
  source: string;
  why: string;           // pedagogical line — required
  category: Category;    // lib/categories.ts
  tags: string[];
  links: {
    part1Cards?: string[];
    part2Situations?: string[];
    difficultyAreas?: DifficultyArea[];
  };
};
```

Part 1 brief step reuses the same catalog via `getVideosForPart1Card()` — single source of truth with [`data/part1/briefResources.ts`](../data/part1/briefResources.ts) (leads + SKYbrary links only).

**Category filters:** `cards.json` defaults all Part 1 cards to `helicopter`. ICAOFlix uses `CARD_FLIX_CATEGORY` (semantic map per card), `VIDEO_CATEGORY_OVERRIDES` (shared YouTube IDs), and `CATEGORY_SPOTLIGHT_VIDEOS` so filters like Personal, Airports, Future and General stay populated.

**Featured channel:** [EuroSafety Training](https://www.youtube.com/@EUROSAFETYTRAINING) — helicopter cockpit, preflight, radio and emergency procedures. Curated subset in catalog with `source: "EuroSafety Training"`.

Progress: `localStorage` key `icao_flix_progress_v1` — `watchedVideoIds[]`.

---

## Route

`/icao-flix` — standard AppShell (sidebar visible), not mission-focus layout.

---

## Out of scope (MVP)

- Hosted/uploaded video
- Account sync of watch history
- Admin panel for Chief Instructor
- Captain debrief deep-link (phase 2)
- Auto-detect watch completion from YouTube iframe events
