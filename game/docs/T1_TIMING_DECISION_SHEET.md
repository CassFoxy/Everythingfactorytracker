# T1 — Owner-Approved Timing Decisions and Review History

**T1 gameplay status: OWNER APPROVED. T1-FINAL technical contract: complete for review. Runtime implementation: outstanding.**

The owner explicitly approved **1A, 2A for all four machines, 3A, 4A and 5A** after T1-REVIEW. These are no longer proposals. Approval establishes gameplay semantics, not permission to activate V2 or a claim that runtime guarantees exist.

## Approved choices

| Decision | Owner-approved semantics | Alternatives retained as history, not selected |
|---|---|---|
| 1A | One previously reserved cycle per machine can finish on reopening after its original deadline. No repeated offline cycles or processing of unreserved queue entries. | Pause-on-close would require durable remaining-time/checkpoint semantics and different crash handling. Not selected. |
| 2A | Paid tier upgrades for Miner, Polisher, Refiner and Furnace, and Miner local Ore Luck upgrades, are allowed during reserved or resolved work. Changes apply only to future reservations. | Requiring idle would simplify validation but obstruct continuously working machines. Not selected. Recalculating existing reservations was never authorized. |
| 3A | All applicable cycle inputs/effects bind at successful reservation, including queue-to-cycle transfer. Resolve RNG later using those inputs. | Resolution-time effects would let later purchases change pending outcomes. Not selected. |
| 4A | Existing Polished and Refined Lots keep their historical processing metadata after upgrades as well as reloads. New Furnace reservations may use current Furnace effects without rewriting that metadata. | Explicit stockpile repricing would need conversion rules and old bases. Not selected. |
| 5A | Accepted single-writer command order determines competing actions; a deadline does not backdate completion ahead of an accepted action. Resolved Miner/Polisher results follow ordinary commit before resale is revalidated. Existing Refiner R1 and central Rebirth rules remain. | Forced settlement of merely due work before ordinary resale was not selected. |

## Binding and technical handoff

The exact proposed future durable representation and model mapping are in [V2 section 7a](V2_STATE_CONTRACT.md#7a-t1-final-durable-effect-context-future-v2-only). The final timing, active-upgrade, ordering and failure contract is in [lifecycle section 7a](V1_MACHINE_LIFECYCLE_CONTRACT.md#7a-t1-final-approved-coordination-and-recovery).

- Miner: bound tier, Overall Luck, Rebirth/local Ore Luck and speed; one base output. Tier selection and within-tier selection occur at resolution, not reservation.
- Polisher: bound tier/value perk and already-adjusted ore basis; reserved inputs determine identity and quantity.
- Refiner: bound tier, Dust Chance, Stability, Dust Yield and Refiner Value; input Lots retain incoming count and immutable value basis. Independent per-item rolls, Dust before destruction.
- Furnace: bound tier, speed/value levels and activation evidence; reserved quantities, duration and exact unit sale values remain fixed.
- Preference changes affect future work only. No saved historical Lot, resolved result or reserved sale value is repriced.
- Whole-save reserve/resolve/commit and exact retry protect ownership under one authoritative writer; they do not promise multi-tab or tamper protection.

## Compatibility and remaining work

Production remains **saveVersion 1**. No JavaScript, schema writer, migration or runtime consumer is changed. Legacy Furnace reservations retain original quantities, unit values, start and 10,000 ms duration through the explicit compatibility branch; missing modern context is never inferred from current perks.

R1, K.1, K.2, K.4, K.5, M1, P1, B1, grid and other unrelated gates retain their statuses. Recommended material XP/Discount purchase pricing and Deferred systems remain unchanged.

- [x] Owner approved all five choices.
- [x] Technical effect-context shape, ordering and failure requirements documented.
- [ ] Implement pure context/cycle validation with deterministic fixtures.
- [ ] Implement full-state adapters and durable single-writer transactions.
- [ ] Implement machine consumers and test every failure/reload/removal boundary.
- [ ] Complete compatibility and V1-017/V1-018 activation gates before production V2 writes.

The original review's recommendations are retained above as selected decisions with rejected alternatives. No additional owner choice is requested for the already approved five semantics. Next work must remain a separately bounded ticket.
