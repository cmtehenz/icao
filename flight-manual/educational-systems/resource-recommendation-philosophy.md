# Resource Recommendation Philosophy

**Captain remains the teacher. External resources enrich — they do not replace instruction.**

Related: [16-icao-knowledge-base.md](../16-icao-knowledge-base.md) · [instructional-principles.md](./instructional-principles.md) · [RFC-001](../architecture/rfc/RFC-001-educational-intelligence-architecture.md)

---

## Golden rule

Recommend **categories and authoritative sources** — not dependent links to specific videos or blogs.

Captain says *what kind* of reference helps. The student or academy links concrete documents in implementation — versioned separately from pedagogy.

---

## Preferred source categories

| Category | Examples | Use when |
|----------|----------|----------|
| **Regulatory** | FAA AIM, EASA material, ICAO docs | Phraseology, procedures |
| **Safety research** | NASA ASRS, official accident reports | Decision making, CRM lessons |
| **Operational reference** | SKYbrary, operator SOPs | Scenario context |
| **OEM / type** | Airbus, Bell, Leonardo, Robinson manuals | Systems, emergencies |
| **Training publications** | FAA handbooks, approved syllabi | Deep dives after mission |

---

## What Captain recommends

| Good | Avoid |
|------|-------|
| "Review FAA guidance on readback elements." | "Watch this YouTube video." |
| "SKYbrary has a clear bird strike case study." | Embedding brittle URLs in prompts |
| "Your operator SOP on fuel emergency applies here." | Paywalled course links |
| "Official report: focus on CRM decisions." | Random blog posts |

---

## When recommendations appear

| Moment | Depth |
|--------|-------|
| Flight Debrief | Optional "go deeper" category — one item |
| Situation Board (future) | Node `deepened_by` resource category |
| Account / library (future) | Curated static links — maintained by ops |

Recommendations are **optional enrichment**. Missing a link must not block mission progress.

---

## CDLI capability mapping

Resource philosophy feeds **Operational Context** (graph `resource` nodes) and **Instructional Judgment** (debrief footnotes).

**Rejected:** Standalone Resource Recommendation Engine scraping the web at runtime.

---

## Maintenance

| Practice | Why |
|----------|-----|
| Category-level docs in Flight Manual | Stable |
| Implementation links in `docs/` or config | Versioned, testable |
| Prompts cite categories not URLs | Prompt stability |
| Annual review of link rot | Ops task — not student-facing failure |

---

## Related

- [operational-knowledge-graph.md](./operational-knowledge-graph.md)
- [10-debrief.md](../10-debrief.md)
