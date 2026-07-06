# Application source (`src/`)

**Status:** Planned migration — application code currently lives at the repository root.

---

## Target layout (ICAO Delta 2.0)

```
src/
├── app/              # Next.js App Router
├── components/       # React UI
├── lib/              # Business logic
├── hooks/            # React hooks
└── styles/           # Extracted from globals.css (optional)
```

---

## Why not moved yet

Moving to `src/` requires updating:

- `tsconfig.json` paths
- Next.js config
- Import aliases (`@/`)
- CI and Vercel build

This is a **structural** change with zero product benefit if rushed. Phase 0 keeps code at root; Phase 1+ migrates incrementally.

---

## Current code locations

| Target | Current |
|--------|---------|
| `src/app/` | `app/` |
| `src/components/` | `components/` |
| `src/lib/` | `lib/` |
| `src/hooks/` | `hooks/` |

**No application behavior should change during the `src/` migration.**

---

## See also

- [flight-manual/README.md](../flight-manual/README.md)
- [flight-manual/14-roadmap.md](../flight-manual/14-roadmap.md)
