# Sprint UX Focus Report — Mission Focus Layout

**Date:** 2026-07-05  
**Status:** Complete  
**Architecture:** Frozen — Mission Engine unchanged

---

## Goal

Remove the dashboard feel (persistent sidebar + bottom nav) during the daily flight mission so students enter a focused Digital Flight Academy experience.

---

## Problem

Mission logic and progress strip shipped in Sprints 1–6, but the app shell still rendered a full sidebar (desktop) and bottom navigation (mobile) on every route — competing visually with today's flight.

---

## Solution

**Mission Focus Layout** for mission routes:

| Route | Layout |
|-------|--------|
| `/` | Mission Focus |
| `/pronunciation` | Mission Focus |
| `/vocabulario` | Mission Focus |
| `/part1` | Mission Focus |
| `/part2` | Mission Focus |
| `/mission-recall` | Mission Focus |
| `/flight-debrief` | Mission Focus |
| `/simulado` | Mission Focus |

**Legacy layout** (sidebar + bottom nav) retained for:

- `/conta`
- `/escutar-prova`
- `/structure`
- other non-mission pages

---

## Files changed

### New

| File | Purpose |
|------|---------|
| `lib/missionFocusRoutes.ts` | Route matching only (no business logic) |
| `lib/missionFocusRoutes.test.ts` | Route tests |
| `components/layout/MissionFocusLayout.tsx` | Top bar + progress strip + content slot |
| `components/layout/MissionFocusTopBar.tsx` | Branding, Today's Flight CTA, profile link |
| `components/layout/MissionFocusLayout.test.ts` | Composition tests |

### Modified

| File | Change |
|------|--------|
| `components/AppShell.tsx` | Branch: Mission Focus vs Legacy layout |
| `components/home/HomePage.tsx` | Strip moved to layout (no duplicate) |
| Mission route apps | Removed per-page `MissionRouteProgress` / strip |
| `app/globals.css` | Mission focus shell styles (mobile-first) |

---

## Mission Focus shell

```
┌─────────────────────────────────────┐
│ Top bar: ICAO Delta · profile       │
│ [Today's Flight] on sub-routes      │
├─────────────────────────────────────┤
│ Flight Progress Strip               │
├─────────────────────────────────────┤
│ Page content                        │
│ Captain Delta floating assistant    │
└─────────────────────────────────────┘
```

**Home** keeps Begin/Continue Flight via `MissionCTA` in page content — not duplicated in the top bar.

---

## Constraints honored

- No Mission Engine changes
- No business logic in layout components
- No duplicate progress strip on mission pages
- Captain Delta floating assistant unchanged

---

## Tests & build

- **70 tests passing** (`npm test`)
- **Build passes** (`npm run build`)

---

## Definition of done

- [x] Sidebar removed on mission routes
- [x] Bottom nav removed on mission routes
- [x] Minimal top bar with branding
- [x] Flight Progress Strip in layout
- [x] Profile accessible (secondary)
- [x] Home: Briefing → Strip → CTA → Mission Panel
- [x] Legacy pages keep sidebar
- [x] Tests + build pass
- [x] Docs updated
