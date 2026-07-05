# Architecture — Index

How the ICAO Delta system works (not what each feature does).

| Document | Topic |
|----------|--------|
| [ARCHITECTURE-LOCK.md](./ARCHITECTURE-LOCK.md) | **🔒 Finalized** — canonical engine, home, state, events |
| [ARCHITECTURE-FINAL-REVIEW.md](./ARCHITECTURE-FINAL-REVIEW.md) | Phase transition + validation report |
| [sprint-1-first-flight-experience.md](./sprint-1-first-flight-experience.md) | Sprint 1 spec + acceptance criteria |
| [mission-state-sync.md](./mission-state-sync.md) | Sync model (local cache → server) |
| [event-catalog.md](./event-catalog.md) | All browser event namespaces |
| [event-governance.md](./event-governance.md) | Breaking vs minor event rules |
| [adr/](./adr/) | ADR-001 – ADR-012 (immutable) |
| [mission-flow-matrix.md](./mission-flow-matrix.md) | **Canonical** mission leg order — Standard, Intense, Passive |
| [runtime-map.md](./runtime-map.md) | Real codebase entry points (current only) |
| [product-map.md](./product-map.md) | Module information exchange (not leg order) |
| [product-architecture.md](./product-architecture.md) | Product layers: Captain, Mission Engine, missions, tools |
| [learning-architecture.md](./learning-architecture.md) | Progressive Assistance, gates, debrief loops |
| [ai-architecture.md](./ai-architecture.md) | AI agents spec vs production APIs |
| [data-flow.md](./data-flow.md) | Runtime data movement and storage |
| [folder-structure.md](./folder-structure.md) | Repository and documentation layout |

Feature specifications remain in core chapters and `learning-tools/`.
