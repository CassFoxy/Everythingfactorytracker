# V1-070 — Independent Machine Lifecycle Contract

**Status:** Technical contract complete; gated transitions remain blocked. **Production saveVersion: 1.** No entity runtime, transaction coordinator, simulator or V2 writer is implemented by this document.

Follow [AGENTS.md](../AGENTS.md), the [Game Bible](GAME_BIBLE.md), [owner handoff](TEFI_Consolidated_Development_Specification.md), [V2 state contract](V2_STATE_CONTRACT.md) and [current save contract](SAVE_VERSIONING.md). The V2 contract owns serialized fields, types, defaults and lifetimes; this document defines how future consumers use them. Defined gameplay remains canonical; Recommended, Open and Deferred material is not promoted. No cost/rarity catalogue is replaced here.

## 1. Authoritative state and ownership

Use the exact records in [V2 sections 4–7](V2_STATE_CONTRACT.md#4-deterministic-identity). Machine type is supplied by the containing factory collection and validated ID prefix, not a new persisted `type` field. Slot identity is distinct from entity identity and from physical placement.

| Owner | Limit / tier cap | Existing authoritative fields, in addition to `id`, `tier`, `nextCycleSequence`, `cycle` |
|---|---|---|
| `factory.miners[]` | 0–5 / 25 | `slot`, `oreLuckLevel`, `investment` |
| `factory.polishers[]` | 0–3 / 10 | `slot`, `selectedOreId`, `queue`, `investment` |
| `factory.refiner` | null or one / 10 | `selection`, `investment` |
| `factory.furnace` | Exactly one permanent / 20 | `autoEnabled`, `resourceMode`, `batchMode`, `selection`, `queue` |

All entity fields remain required according to V2; null selections/cycles are explicit. Refiner's logical singleton slot is not an added stored `slot`. Furnace has no investment ledger. Miner has no input queue. `nextCycleSequence` is operation identity, not a production statistic. Machine-specific selections, modes and local upgrades remain owned by their systems. No persisted `owned`, `processing`, refund total, capacity, speed, current price or scheduler handle is added. Ownership is derived from collection membership; owned tier is authoritative, not reconstructed from payments.

Miner slot access is `factory.minerSlots`, exactly five Booleans, with slot 1 always true. Additional access uses [Decision 13](TEFI_Consolidated_Development_Specification.md#13-miner-slot-purchases); no sequential slot-buying gate is implied. Access survives resale/Rebirth and does not create or start a Miner. One owned Miner per unlocked slot. `shop.minerUnlocked` is a separate prerequisite, not ownership or slot access.

Polishers use fixed slots 1–3 and the [slot-specific machine prices](GAME_BIBLE.md#decision-14--polisher-purchase-behaviour). There is no separate purchased-access map. Removing slot 1's entity never renumbers slot 3 or changes its replacement price. Refiner adds no access/unlock structure. Furnace is always `furnace:permanent` and cannot be sold or recreated at Rebirth.

Ownership alone establishes no coordinates, placement activation, warehouse, footprints or conveyor routing. Those transitions await a grid contract; no `placed` flag is introduced. Candidate machine operations can be tested independently of that integration.

## 2. Identity allocation

Reuse [V2 section 4](V2_STATE_CONTRACT.md#4-deterministic-identity) without a second allocator:

- `identity.nextEntitySequence` is a positive safe integer shared by purchased machines and crafted Pickaxes. Runtime IDs are `miner:<sequence>`, `polisher:<sequence>`, `refiner:<sequence>` (canonical decimal, no leading zeros). Allocate the current value and its increment in the same private transaction as Cash, ledger and ownership. A failure/cancellation commits neither. Furnace's reserved ID consumes no sequence.
- Validate uniqueness across entity collections, matching prefixes and counters above recorded sequences. Array position, DOM order, time and future grid coordinates are never IDs. Removal/Rebirth does not rewind counters or permit reuse. Save/reload restores counters; it does not derive a smaller next value from surviving entities. `nextManualEquipSequence` remains the manual system's counter, preserved and untouched by machine actions.
- Each entity starts `nextCycleSequence:1`, `cycle:null`; supported queues start empty. Queue and cycle IDs share its sequence: `<entityId>/queue:<sequence>` and `<entityId>/cycle:<sequence>`. Increment only with successful queue insertion/reservation, never per timer tick. Queue-to-cycle transfer consumes a new cycle sequence and removes transferred queue ownership atomically; any partial remaining queue entry keeps its own identity and remaining quantity.
- Reject allocation if the allocated value **or incremented next counter** cannot be a positive safe integer. Never wrap, clamp or recycle. This applies to global and per-entity counters. Runtime callbacks for removed entities expire permanently. Furnace retains its identity and next cycle sequence through Rebirth, so old callbacks cannot match later work.
- Migration uses its own candidate counter: preserve recognized canonical IDs/counters from approved extensions, reserve their sequences first, then allocate retained Miners in slot order, Polishers in slot order, Refiner, and recognized crafted copies in source numeric creation order. Apply V2's recognized-source ranking before retained-slot assignment. Same source, adapter and approved policy yield the same ordered IDs. Never randomly identify legacy machines or mutate a live counter during conversion.

## 3. One future transaction owner

A future coordinator must own the authoritative runtime snapshot, serialization/write boundary and scheduler reconciliation. Pure helpers and UI callbacks cannot commit independent fragments. This is a required integration interface, not new persisted data or an implemented service.

Conceptual interface: **prepare(current snapshot, command, explicit catalogue/effect context) → validated candidate or failure; commit(candidate) → published snapshot or write failure**. Commands identify a machine by immutable ID (purchase identifies type/slot); the coordinator resolves and revalidates against current state. UI-supplied prices, tiers, outcomes and payment claims are not trusted inputs. Clock/RNG inputs belong only to future cycle consumers and deterministic tests, never the pricing/investment models.

Serialize operations through one runtime writer. During preparation, mutate only an independent candidate. Validate complete Cash/quantity arithmetic, identity, ownership, investment and cycle invariants before writing. Persist the whole candidate before publishing it or notifying UI/statistics listeners. Post-commit refreshes must not grant the same rewards again. A stale confirmation/command must be revalidated; it is not authority to overwrite a newer snapshot. Ephemeral command coordination is not an extra saved receipt system.

Simulation/state-owner code enforces validity, cost, ownership, transitions, timing, results, persistence and refunds. UI reads projections to display state, quotes, affordability, requirements and progress; it collects confirmations and shows success/failure. A disabled/hidden button is never the only enforcement. Core candidate operations must remain callable without DOM, and UI selections must not create invisible inventory ownership. No new UI or generic simulator is introduced here.

On a failed write retain the last committed snapshot and the exact pending candidate for controlled retry, and block conflicting mutations/autosave from committing over it. Do not regenerate IDs, recalculate paid history, reroll prepared results, debit again or publish speculative credits. Discarding/repreparing a candidate requires the state owner to establish that it was not committed. This requires future V1-050C/V1-018 integration; today's `saveGame` and quota handling do not yet provide these guarantees. One complete save is the commit unit. Cross-tab atomicity, disk durability guarantees and rollback/tamper resistance are not certified by this contract.

## 4. Purchase and upgrade boundaries

### Purchase

1. Resolve supported machine type and selected fixed slot; check capacity, vacant ownership, slot access and Defined prerequisites. Miner purchase needs its separate unlock. Do not debit a slot/access charge as part of a machine purchase or invent a Refiner prerequisite.
2. Set new tier once to `min(machine cap, max(1, PreservationLevel))`. No perk consumer means the Defined unowned level, not invented persisted ownership; unsupported legacy effects remain gate B1. New Miner local Ore Luck is 0. Reload or a later Preservation purchase never retier an existing machine.
3. Obtain original raw machine purchase cost from the relevant catalogue/slot, then `CashPricingModel.calculateCashPrice(rawPrice, {category, discountLevel})`. Use the purchase category even when Preservation starts above tier 1. Check affordability and exact representability of the debit.
4. In a private candidate allocate identity, construct the independent entity and prepare its actual purchase payment. `InvestmentModel.createInvestment()` is an unowned candidate; append `{kind:"purchase", targetLevel:null, cashPaid:amountDebited, basis:"actual"}` with `{machineType, owned:false}`. A valid zero purchase still has one purchase entry. Free starting tiers have no entries.
5. Validate the result with owned context and commit Cash, entity, ledger and incremented identity together. No payment becomes recorded evidence until the actual debit/ownership transaction succeeds. Quote, preview and construction alone prove no payment. Failure changes neither Cash, entity, slots, counter nor ledger; success then refreshes consumers/UI.

Slot purchase and Unlock Miner are separate nonrefundable transactions. Furnace is constructed once by the canonical future state constructor, not purchased through this sellable-machine flow.

### Upgrade

Resolve exactly one currently owned entity and validate its state. The next tier/local level is current plus one, within the catalogue cap. Evaluate that target's original raw formula, never the last rounded price. Quote with the proper category, validate affordability, prepare the Cash debit and only the target entity's upgrade. For sellable machines append the actual `tier` or Miner `oreLuck` payment with `{machineType, owned:true}` and commit all changes together. Duplicate paid targets reject; no history is fabricated for free Preservation tiers or unbought Ore Luck levels.

Miner-local Ore Luck stays independent from permanent Rebirth Ore Luck, starts at 0 and caps at 50. `minerOreLuck` rounds Cash but receives no Discount. A Furnace tier upgrade uses `furnaceTier` pricing and the same atomic debit/state boundary, **without** an InvestmentModel call: Furnace is not sellable. An upgrade affecting in-flight duration/value/rolls is blocked until T1 defines binding semantics; it cannot reset a reservation, reprice a resolved result or silently finish work. Tests may prepare idle-entity upgrades before that decision.

## 5. Processing phases and exclusive input ownership

Reuse [V2 section 7](V2_STATE_CONTRACT.md#7-persisted-cycles-and-exactly-once-resolution). The only serialized phases are **`reserved`** and **`resolved`**; idle is **`cycle:null`**.

| Conceptual transition | Persisted representation / ownership |
|---|---|
| Eligible stock / selection | Remains available; selector is a preference, not a resource owner. Another action may consume it before confirmation, requiring revalidation |
| Queue, where supported | `QueuedInput {id, lot}` owns stock removed from available inventory in that same commit; not a new cycle phase |
| Reserve / active work | Allocate Cycle and transfer available or queued input into `cycle.inputs`; set `phase:"reserved"`, `result:null`. Queue transfer must not subtract available stock again |
| Resolve | Persist `phase:"resolved"` plus validated `result`, without changing awarded inventory/Cash/XP/Dust/statistics yet |
| Commit result | Persist outputs, balances and event effects together with `cycle:null`; reservation is consumed exactly once |
| Next work | Separate revalidated reservation after successful commit; do not reuse the old cycle ID or backdate new work |

Exact Cycle fields stay `{id, phase, startedAtMs, durationMs, inputs, saleUnitValues, result}`. `saleUnitValues` is a matching Furnace unit-value array; otherwise null. `inputs` is empty only for a Miner. `durationMs` is positive and captured as required by the approved timing rule, not recalculated on load. `CycleResult` stays `{outputs, cashDelta, factoryXPDelta, gemDustDelta, events}`; inapplicable deltas are explicit zero. Events use V2's exact `{type, resourceId, stage, refineCount, amount}` fields and recognized discriminators, not arbitrary state paths or callback code.

Available raw stock remains `inventory[resourceId]` counts. Create a Raw Lot only for transfer; never replace the map with arrays. Available processed stock is `processedInventory`; exact cohort metadata identifies it. `InventoryModel.splitLot(lot, quantity)` returns `taken` and `remaining` (null when exhausted). The coordinator must atomically replace/decrement the source and assign `taken` to the selected owner. A copy returned by a pure helper is not itself a reservation. Queue/cycle IDs must belong to that machine; no cross-machine alias or shared mutable Lot is permitted.

`cycle.inputs` retains consumed input evidence while a resolved result is pending; it is not spendable stock. `result.outputs` is also pending, not simultaneously available inventory. Commit consumes the reservation and adds outputs once using count arithmetic or `addProcessedLot` as appropriate. Events, Collection/discovery, Cash, Gem Dust, XP, achievements and supported statistics are applied within the same commit, without intermediate event-handler saves. Stage conversion is not a new raw acquisition. Unsupported reward formulas and challenge credit are not inferred from the existence of a result field.

Machine-specific consumers enforce input restrictions, capacity, selection, timing, value/effect bindings, rolls and conservation; the shared coordinator enforces exclusive ownership and atomic transitions. Malformed results reject before credits. In particular, validate Furnace Cash against its reserved quantities/unit values and Refiner survivors/destruction/Dust against its permitted result, rather than trusting arbitrary serialized deltas.

## 6. Machine-specific consumer responsibilities

| Machine | Canonical source and boundary |
|---|---|
| Miner | [Reference B](GAME_BIBLE.md#reference-b-miner-rarity-costs-and-production): independent input-free cycle, automated tier/Overall Luck and local/global Ore Luck rules; T4 gated by tier and automated Stone floor at least 25%. Produce approved raw output/acquisition facts. Selection of future physical destinations/routing is outside this contract |
| Polisher | [Reference C](GAME_BIBLE.md#reference-c-polisher-behavior): selected raw ore only, no Stone/repolishing; independent queue/cycle and permitted partial batch. Produce Polished Lots with supplied, preserved `polishedValue`. No input means idle |
| Refiner | [Reference D](GAME_BIBLE.md#reference-d-refiner-behavior-and-value): direct reservation from polished count 0 or refined counts 1–14; no pre-reservation queue. Dust roll/award precedes the independent destruction roll per input; save both outcomes in the pending result. Survivors gain one count, capped at 15. First pass captures immutable `preRefinerValue`; later passes carry it unchanged with the saved successful `refineBonus`, never compound a previous result. Destroyed input does not remove awarded Dust. R1 blocks active resale |
| Furnace | [Reference E](GAME_BIBLE.md#reference-e-cash-price-rounding-and-furnace-table): permanent singleton; manual activation at tiers 1–2, automatic processing at 3+ subject to its preferences and valid inputs. Manual cohort selection or auto highest final-sale-value selection with stable ore-ID/Refine-Count ties. Preserve reserved sale values and award Cash once. This is the selling path, not an additional direct-sale economy |

Preserved historical `polishedValue`, `preRefinerValue`, `refineBonus` and Furnace reserved values are not updated merely because a save loads or a new catalogue quote differs. T1 controls unresolved evaluation/repricing points; K.4 controls new Ore Value-on-Stone calculations. Refiner physical destruction events can be recorded without resolving K.1 challenge eligibility.

## 7. Time, stopping, reload and write failures

Authoritative work is the saved entity/cycle ID, `startedAtMs`, captured `durationMs`, reserved inputs/values, phase and any resolved result. Timers merely wake the coordinator to inspect those fields. For an approved elapsed-time policy, use the supplied clock against the original start/duration; an early callback cannot complete work. Valid future timestamps are not repaired to now. Display progress is derived and bounded, not a new persisted timer.

Load via parse → adjacent migration → validation → established completion → runtime restoration, before registering schedulers. A successful load does not itself rewrite storage. A reserved cycle is scheduled only under its approved timing semantics; a resolved cycle uses its saved result and never rerolls. Each callback carries entity ID + cycle ID and rechecks both and the phase; duplicate/stale callbacks cannot consume, resolve or pay twice. Rebuild one scheduler owner per entity; never persist handles or run gameplay/autosave during recovery.

Turning off Furnace automation controls future automatic starts; an already reserved historical batch remains owned and may finish under existing behavior. `autoEnabled:false` is not idle or cancellation. Selection/mode changes are preferences for subsequent work, not permission to change reserved inputs. There is no new general pause/cancel field or machine toggle. New pause, close/reopen and active-upgrade behavior must not be invented from the timestamp layout; T1 remains open.

| Last successful snapshot at interruption | Reload/retry consequence |
|---|---|
| Before reservation | Input still belongs to available inventory/queue; uncommitted ID increment was not spent |
| Reserved | Inputs exist only in that cycle. A crash before a result is persisted may recompute an uncommitted roll; this is not save-scumming protection |
| Resolved | Reuse exact saved outputs/deltas/events; no further RNG or payment yet |
| Result committed and cycle cleared | Outputs/credits already exist; no cycle can pay them again |

In-session write failure retains the exact prepared candidate, even when resolution has not yet been saved; retry it, not fresh rolls. No speculative inventory, XP, Dust or Cash is published. Recovery/load failure preserves original raw bytes and registers no scheduler. Full write-boundary tests remain a future activation requirement, not a capability added to current schema 1 here.

Existing Auto Furnace may complete its single overdue reserved batch with original values/time. Do not simulate missed repeated cycles, backdate new cycles or infer offline Miner output. For new processors, **whether downtime advances even one pending cycle and how in-flight effects are bound remain T1**. Controlled-clock candidate tests are safe; production activation of affected timing is blocked. This document chooses neither pause-on-close nor wall-clock catch-up.

## 8. Resale and Rebirth

### Resale

Require the Defined confirmation for the exact sellable entity. Revalidate current ownership/ledger/work after confirmation; reject a missing entity or stale state rather than crediting a remembered quote. Furnace always rejects resale. Calculate `InvestmentModel.calculateRefund(investment, {machineType, owned:true})`: `floor(0.50 × recorded qualifying payments)`. Never use current tier, Discount, replacement prices or current Cash to reconstruct investment.

Prepare machine-specific work disposition, Cash credit and entity removal in one candidate. Validate representable Cash addition and inventory returns, persist, then remove its scheduler and refresh UI. Already removed IDs cannot sell again. Retain Miner slot access, stable Polisher slot identities, global counters, already available processed outputs and permanent perks/Dust. Remove the sold entity's local upgrades, ledger and operations. Slot access, Unlock Miner, normal Shop, materials, Pickaxes, Stardust and free Preservation tiers contribute no refund.

- Miner: remove its input-free work with ownership; never generate an extra pending production award as a refund. T1 still gates exact active-cycle timing/race semantics. Do not activate an unresolved timing-dependent sale path.
- Polisher: return queued and active **unprocessed** inputs once; keep already-polished available output. A saved resolved cycle follows normal result commit before an idle resale is revalidated, so the same input cannot both return raw and award polished output. Serialize completion/removal; never clear a failed commit to force a sale through. No partial-progress reward is invented.
- Refiner: idle resale accounting is Defined. An active reservation/result blocks the resale transition under R1 until the owner specifies active-input disposition. Do not automatically finish, return or destroy inputs because Sell was clicked. Ordinary approved cycle completion may independently make it idle; then revalidate a new sale.

### Rebirth

Use one central transaction following [Reference H](GAME_BIBLE.md#reference-h--rebirth-payout-and-reset-matrix) and [V2 section 8](V2_STATE_CONTRACT.md#8-rebirth-resale-and-retained-state). Compute the Defined Stardust payout from pre-reset Cash first; Rebirth is not a bulk machine resale.

Remove Miner/Polisher/Refiner entities, local Ore Luck and ledgers. Clear raw/processed inventory, queues and active/resolved work **without payout**. No old investment transfers to replacement entities; no refund is manufactured. Retain Miner access slots and fixed Polisher catalogue slots. Reset Cash, normal Shop and Miner unlock. Preserve actual Factory XP/derived Level, Collection, claims, Pickaxe/material state, permanent perks/currencies, lifetime records and identity counters under the existing reset matrix.

Keep the exact Furnace identity/preferences/next cycle sequence, clear work and unavailable selection, and restore tier to `min(20,max(1,PreservationLevel))`. Never recreate it or record that free tier as investment. Future repurchases use Preservation once and new IDs/ledgers/local level 0. Serialize Rebirth against pending commits: after its successful snapshot, old callbacks cannot resurrect cleared work. Failed persistence leaves the prior state authoritative and blocks conflicting operations. This defines technical reset ownership, not additional rewards, compensation, perk purchases or a Rebirth implementation.

## 9. Existing pure APIs and remaining integration work

Actual implementations are in [ores.js](../ores.js); no signatures or helpers change here.

| Future operation | Existing API use | Responsibility still outside the helper |
|---|---|---|
| Machine purchase quote | `CashPricingModel.calculateCashPrice(rawPrice, {category, discountLevel})`; `minerPurchase`, `polisherPurchase`, `refinerPurchase` | Original catalogue/slot formula, prerequisite/affordability validation and real debit |
| Tier / local upgrade quote | Same API: `minerTier`, `polisherTier`, `refinerTier`, `furnaceTier`, `minerOreLuck` | Correct next target/cap; local Ore Luck has no Discount; Furnace has no resale ledger |
| Access purchase quote | `minerSlot` / `unlockMiner` categories | Separate nonrefundable access transaction; no machine payment entry |
| New recorded payment | `createActualPayment(payment, machineType)`; `appendActualPayment(ledger, payment, context)` | Binding amount to an actual successful debit; no quote-as-payment shortcut. First append uses `owned:false`, later append `owned:true` |
| Ledger validation / refund | `validatePayment`, `validateInvestment`, `sumInvestment`, `calculateRefund` | Entity identity/owned-tier cross-checks, provenance of historical records, actual once-only deletion/credit |
| Select/reserve/return/output | `createLot`, `validateLot`, `splitLot`, `lotsCompatible`, `mergeLots`, `validateProcessedInventory`, `addProcessedLot` | Available raw-map arithmetic, source removal, owner IDs, queues/cycles/capacity, value producer and event commit |

Inventory helpers compare exact metadata and return independent values. Investment helpers reject duplicates, invalid machine targets, non-finite and non-reversible sums; recorded fractions remain unchanged. These guards do not validate an entire machine or guarantee a live Cash debit/credit is representable. Future coordinators must check those operations too, including a nonzero debit absorbed by a large Cash balance. No epsilon or arbitrary safe-integer Cash cap is introduced.

Structural InvestmentModel validation permits supplied `legacyEquivalentV1` records; runtime payment creation/append permits only new `actual` records. Existing historical entries may remain when appending actual payments. The migration adapter owns provenance and approved reconstruction; the model cannot certify it.

**Integration requirements, not helper changes:** complete candidate entity/cycle/result validators, global identity allocation, atomic raw/processed transfers, durable whole-state coordinator, machine-specific catalogue/effect evaluators and scheduler restoration are still needed. Existing pure records enforce exact fields, while V2 section 9 preserves inert unknown record extensions. The future serialization adapter must explicitly reconcile that boundary: validate canonical projections and preserve inert extensions without passing executable/excess fields into pure helpers or losing historical metadata. If safe transfer/merge of such extensions is undefined, block that affected adapter and settle its technical contract before activation; do not silently drop them or loosen the pure models here.

## 10. Migration and activation

Use [V2 section 10](V2_STATE_CONTRACT.md#10-exact-adjacent-migration-responsibilities) and [Reference I](GAME_BIBLE.md#reference-i-save-version-2-migration). Unversioned/V0 → existing unchanged 0→1 → future 1→2. Convert a validated/completed V1 deep copy, not live state or storage. The lifecycle consumes only fully validated canonical entities; it never reinterprets old counts as live ownership in parallel.

- Count-only Droppers become up to five Tier 1 Miners in deterministic slots, sufficient free access, local Ore Luck 0 and grandfathered Miner unlock (no invented Mining Power payment). Adders become up to three Tier 1 Polishers in fixed slots, null selector/empty queue/idle. Positive Multiplier ownership becomes one Tier 1 Refiner; zero becomes null. Other compatible record formats require a named adapter, not inference from unknown JSON.
- Recognized individual records use documented ranking and valid local upgrades; reconstruct investment before tier clamping/removal. Preserve compatible actual payments; only approved migration schedules may create legacy-equivalent entries. K.2 blocks missing historical equivalents/above-cap/overflow compensation. No modern-price guesswork, partial credit or silent reset.
- Map known Furnace prototype indices 0/1/2 to canonical 1/2/3, preserving preferences. Convert a nonempty historical batch to reserved raw Lots with exact original unit values, start and 10,000 ms duration; never subtract inventory twice or apply new capacity/price to that reservation. Compatible oversized/historical snapshots finish once, then new work obeys the new consumer. Unknown formats need explicit adapters.
- Build retained entities, counters, adjusted Cash, archived source and `ConversionReceipt` in one candidate. The receipt records the approved policy/source/reason/amount; it is evidence, never a replayable credit command. Validate before runtime startup. A failed conversion preserves original raw bytes and enters existing recovery. Successful load does not immediately write; later successful saves persist the migrated snapshot. Reloading V2 never reapplies conversion or compensation.

V1-017 may build approved candidate adapters/fixtures before runtime release; V1-018 may build validation tests before activation. **No production instance writes or retired-field changes before all V2 section-12 gates pass**, including working consumers for every retained legacy machine and active Furnace batch. This lifecycle document is not that activation gate passing.

## 11. Open decisions and blocked transitions

| Gate | Missing rule / exact boundary |
|---|---|
| K.2 | Missing historical purchase/tier/overflow equivalents and compensation: block affected migration reconstruction and complete supported migration release, not pure actual-payment accounting |
| M1 | Unknown legacy first-action history: block first-action backfill and dependent rollout; never infer it from inventory/XP/Collection |
| P1 | Legacy Milestone earned/claim mapping to new thresholds: block that catalogue transition; retain old catalogue/map together meanwhile |
| R1 | Active Refiner input disposition on resale: block active resale, not idle refund calculation |
| T1 | Downtime advancement for new cycles; in-flight tier/perk timing/value/roll binding; explicit upgrade repricing of unreserved processed stock: block affected active transitions/activation; retain existing Auto Furnace and historical snapshots |
| B1 | Unmapped nonzero legacy machine/perk effects or cosmetic alias conflicts: block affected adapters; archive/preserve, never reinterpret as purchased levels |
| Grid contract | Placement, activation and routing semantics: block physical grid/transport integration; ownership implies no new spatial state |
| K.4 | Ore Value on Stone: block the affected new value/snapshot producer, not preservation of an already reserved sale value |
| K.5 | Rebirth Furnace Capacity existence/effect: block that perk, add no placeholder |
| K.1 / K.3 | Destroyed-ore challenge progress and target/reward precision: block corresponding challenge consumers, not physical event recording |

Material XP and Factory Purchase Discount Stardust pricing remain **Recommended**. Inscriptions, ore tiers beyond T4, Miner tiers above 25, expanded Achievement catalogue/rewards and detailed Milestone rewards remain **Deferred**. None become lifecycle requirements through a placeholder multiplier or event field. Future helper-extension preservation above is a technical integration requirement, not owner approval of new gameplay.

## 12. Implementation handoff and future acceptance

V1-070 completes documentation only. V1-050A/B stay complete, V1-050C and parent V1-050 integration remain outstanding. Candidate consumers depend on completed pure models/contracts, not an already-activated V2 or their own future integration; live consumers still depend on safe persistence and all applicable gates.

Next bounded implementation: **V1-071A — Miner Slots, Entities and Purchases, candidate-state portion only**. Implement/test pure slot/entity validation and purchase preparation against the existing V2 fields and pure models. No live state writes, production cycles, timers, grid activation, legacy-count replacement or V2 activation. Actual durable commits remain coordinated with V1-050C/V1-018. This is a boundary for that next ticket, not work started here.

Future owning tickets must test identity overflow/no reuse, failed purchase/upgrade rollback, exact slot pricing, independent entities and local upgrades, preserved free tiers, no duplicate payments, exclusive input transfer, every reserve/resolve/commit crash boundary, saved RNG reuse, stale callbacks, failed writes, mode changes, resale returns/refunds once, Rebirth clearing and migrated historical batches. Include applicable Reference L checks 5, 14–18 and 25–27, using the existing deterministic harness. Those new-system checks are requirements, **not passing implemented tests**.
