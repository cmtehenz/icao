# Assets

Static media catalog for ICAO Delta 2.0.

**Current production assets** still live in `public/` and `provas/` — this folder documents the target layout and holds curated assets as we migrate.

---

## Structure

| Folder | Contents |
|--------|----------|
| `audio/` | Curated clips, TTS exports, mission audio |
| `images/` | Pictures (Part 4), diagrams, marketing |
| `icons/` | PWA icons, UI icons, exam pictograms |
| `voices/` | Captain Delta voice samples, examiner scripts (reference) |

---

## Migration map

| Current location | Future |
|------------------|--------|
| `public/provas/` | `assets/audio/exams/` (symlink or copy in build) |
| `public/exams/` | `assets/audio/exams/normalized/` |
| `public/simulado/pictures/` | `assets/images/simulado/` |
| App icons in `public/` | `assets/icons/` |

Do not move files until build pipeline is updated — see [docs/architecture.md](../docs/architecture.md).

---

## Guidelines

- Prefer lossless or high-quality MP3 for exam audio
- Name tracks with exam version + situation id
- No secrets in this folder
- Large binaries: consider Git LFS if repo grows
