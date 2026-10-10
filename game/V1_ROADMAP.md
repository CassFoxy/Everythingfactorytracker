# Everything Factory Incremental — Version 1.0 Development Roadmap

Updated 6 October 2026 after owner approval of the consolidated design handoff. The web implementation remains the reference for a later Luau port.

## Authority and status

Follow [AGENTS.md](AGENTS.md), then the owner-approved [handoff](docs/TEFI_Consolidated_Development_Specification.md), the synchronized [Game Bible](docs/GAME_BIBLE.md), this roadmap and existing implementation, in that order for this synchronization. The Bible carries canonical gameplay; the handoff remains a reference, not a replacement Bible.

Retain existing implementation statuses: **✅ COMPLETE** (implemented, tested and accepted for the named scope), **🟠 IN PROGRESS** (prototype/components exist, requirements remain), **⚪ NOT STARTED**, **🟣 DESIGN REQUIRED**, **🔵 REVIEW REQUIRED**. A separate **Design: DESIGN COMPLETE / READY** qualifier never marks implementation complete. **Design: DEFERRED** means excluded from the current implementation phase. **Recommended** values remain proposals.

V1-003, V1-010–015 and the V1-020 review are accepted. Newly Defined gameplay is not implemented merely by this synchronization. Legacy component completions cover only their named retained scope. Schema 1 remains active. No production changes or acceptance passes are claimed here.

## Dependency order and immediate boundary

Ticket numbers preserve history, not execution order. Complete one bounded child at a time; a parent is not permission for an entire architecture rewrite.

1. **V1-021A** fresh Cash/Level baseline only (implemented and tested; continue with the contract work in step 2).
2. V1-016 contract documented; next implement the V1-026 Default-only portion using its [incremental boundary](docs/V2_STATE_CONTRACT.md#11-incremental-development-before-v2-activation). V1-021B first-ever Stone waits on M1 legacy policy. V1-050 price rules and V1-023 sale work must respect the same non-writing/compatible limits.
3. V1-041 inventory contract, V1-028/029 manual quantity/material/Luck, V1-027 crafting/copies and V1-051/052 normal Shop; integrate V1-024 Mining Power I. Material XP recommendations and Stone Ore Value remain gated.
4. V1-070 lifecycle contract → V1-071A/B Miner consumers and V1-071C/D local upgrades/resale; develop V1-017 migration and V1-018 validation against candidate fixtures without activating V2. K.2 and applicable contract decision gates must be resolved before release.
5. V1-074A/B Polisher → V1-075A/B Refiner → V1-080–085 Furnace modernization, integrating independent reservations. Build consumers before V2 activation; they depend on the contract, not an already-active V2. Only after all migrated data has working consumers may V1-018 activate V2 and V1-025 expose new Miner automation. Compatible opening sale work need not wait for all later tiers, but must not reinterpret old active batches.
6. V1-060–079 grid/network integration and V1-090–093 expansion after their unresolved design contracts; reuse tested machine simulation. Machine formulas do not define conveyor behavior.
7. V1-100/101 XP integration, V1-130/131 milestones and retained Achievements; implement V1-150–155 event statistics alongside their producers, before dependent Rebirth/challenges.
8. V1-170/172 perk definitions/calculations → V1-160–166 Rebirth → V1-164/171/173–175 permanent Shop/integration. Purchase pricing for Recommended Discount and any unapproved Capacity perk stay excluded.
9. V1-157–159 challenges after open target/progress/precision decisions; remaining V1 progression/UI/quality work after its own specifications. Deferred catalogues are not silently restored as mandatory work.

The required opening is **$0 / Level 0 / XP 0 → guaranteed first Stone → Starter Furnace sale → Mining Power I → Unlock Miner ($100) → separate Tier 1 Miner purchase ($100 before eligible discount) → automatic production**. Enforce the Mining Power prerequisite and separate transactions in purchase logic as well as UI. First Miner slot is free.

## Open decisions and deferred scope

[Bible Reference K](docs/GAME_BIBLE.md#reference-k-open-recommended-and-deferred-decisions) keeps the five owner decisions together: destroyed-ore challenge wording; legacy reconstruction beyond caps; whole-item target rounding and Cash/XP precision; Ore Value on Stone; Rebirth Furnace Capacity. Additional technical-contract ambiguities must be reported there before choosing gameplay behavior.

Recommended only: material XP (Wood 5 / Scrap 15 / Metal 50), Factory Purchase Discount Stardust pricing. Deferred: Inscriptions, T5+ ores, Miner tiers 26+, extra Achievement catalogue/rewards and detailed Milestone rewards. Existing thresholds, claims and infrastructure are not deferred.

Existing unresolved grid/conveyor/expansion, inventory capacity, mutations, offline simulation, additional level unlock/reward and settings requirements remain DESIGN REQUIRED where needed. This synchronization does not silently remove them from the broader V1 backlog.

## Ticket map and acceptance references

Original ticket IDs are retained. New suffixes split affected systems into bounded work; V1-016–018 covers the real V2 transition, V1-026–029 the new manual architecture, and V1-157–159 challenges. “Reference L checks” refers to the numbered **future** acceptance requirements in the Bible/handoff, not current passing tests. Every implementation also requires its focused unit/state tests, legacy/current round trips where affected, and existing Node/browser regression suite.

Priorities retain P0 foundations, P1 core loop, P2 progression, P3 retention and P4 release quality. Accepted work is not reopened as a full audit.

# Foundations and future save transition

## V1-001 — Development Bible Gap Register

**Status:** 🟠 IN PROGRESS
**Design:** Targeted follow-up only
**Dependencies:** Current Bible Reference K

The previous broad audit is historical. Keep remaining owner decisions visible and review only dependencies of the active ticket; do not re-audit all systems. Defined machine/Rebirth formulas no longer need speculative design. Deferred rewards do not become immediate implementation requirements.

---

## V1-002 — Core Code Architecture Review

**Priority:** P0
**Status:** 🟠 IN PROGRESS

Review the current JavaScript architecture and identify areas that should be separated before additional large systems are implemented.

The current implementation should evolve towards separating:

* Game state.
* Resource definitions.
* Building definitions.
* Progression definitions.
* Save handling.
* Factory simulation.
* Economy calculations.
* Achievement logic.
* Collection logic.
* UI rendering.
* Input/event handling.

### Requirements

Avoid unnecessary rewrites.

Existing functional systems should be reused wherever practical.

### Completion Criteria

* Core gameplay calculations can operate without direct dependency on DOM elements.
* New systems can be implemented as modular components.
* Balance values are data-driven where practical.
* Future Luau conversion is easier than the current architecture.

---

## V1-003 — Automated Test Framework

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed GitHub Actions syntax/Node/browser automation. Reuse existing npm commands, Node harness and browser smoke runner. This is not certification of future gameplay.

---

## V1-010 — Save Versioning

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-011 — Save Validation

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-012 — Save Migration

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-013 — Corrupted Save Recovery

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-014 — Save Schema Consolidation

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-015 — Save Regression Tests

**Status:** ✅ COMPLETE
**Design:** Accepted implementation
**Dependencies:** None remaining for accepted scope

Reviewed and accepted schema-1 persistence foundation. Preserve current compatibility, canonical defaults, ordered migration, validation and recovery; V2 work is separately scoped below.

---

## V1-016 — V2 State and Compatibility Contract

**Status:** ✅ COMPLETE (technical contract/documentation only)
**Design:** Contract specified; listed gameplay/migration gates remain DESIGN REQUIRED
**Dependencies:** Accepted V1-010–015/V1-021A; References I/K

Define exact canonical instance fields and ownership for machines, slots, investments, reservations and newly implemented opening/manual state. Cover deterministic IDs, optional defaults, established unknown-data/recovery policy and V0→V1→V2. Do not activate V2 here. Specify a dependency-safe path for incremental opening fields; material shape changes require adjacent migration, not unversioned additions. Resolve K.2 before shipping compensation; do not reset existing progress. This contract is technical work, not permission to invent gameplay.

**Contract:** [V2_STATE_CONTRACT.md](docs/V2_STATE_CONTRACT.md). Field tables, exact ID/slot and investment ownership, reservation commit protocol, conversion responsibilities, decision gates and pre-V2 paths are documented. This completion does not certify an implemented migration or activate schema 2. The existing 225 Node tests and 11 browser scenarios remain unchanged.

**Future implementation acceptance:** Reference L checks 25–27, plus the contract activation checklist.

---

## V1-017 — Adjacent V1 to V2 Conversion

**Status:** ⚪ NOT STARTED
**Design:** DESIGN REQUIRED: Reference K.2 blocks complete migration
**Dependencies:** V1-016, completed V1-070 lifecycle contract and V1-041A/V1-050B pure models; owner-approved unsupported reconstruction policy for affected conversion. Candidate adapters/tests do not require already-active V2; full release still waits on V1-018 consumer/activation gates

Convert legacy Dropper counts to ≤5 Miners, Adders to ≤3 Polishers and positive Multiplier ownership to one Refiner. Deterministic slot order/IDs, compatible record ranking, slot reconstruction, zero default local Ore Luck. Reconstruct before clamping; overflow half full investment, retained above-cap half lost investment, unsupported progress per approved policy; never double-compensate. Preserve XP, claims, milestones, discovery, statistics, unknown safe data and active Furnace reservations. No fake Version 2 without the actual instance transition.

**Acceptance:** Reference L checks 25–27.

---

## V1-018 — V2 Validation, Recovery and Runtime Activation

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE contract; depends on migration resolution
**Dependencies:** V1-017; completed V1-070 contract; runtime integration from V1-041B/V1-050C/071A–C, V1-074A/B, V1-075A/B and V1-080–085; all applicable [activation gates](docs/V2_STATE_CONTRACT.md#12-activation-gate-for-v1-018). Consumers and validators may be built/tested against candidate V2 records before activation; activation must not precede them.

Validate after adjacent migrations; complete canonical defaults before runtime. Run full V0/V1/V2 fixtures, caps, IDs, investments, active cycles, retry, export, exactly-once compensation and rejection-with-original-bytes tests. Activate schema 2 only when all supported data can load into functional consumers safely; do not ship partial destructive conversion.

**Acceptance:** Reference L checks 25–28.

---

# Opening and manual progression

## V1-020 — Fresh Save Progression Review

**Status:** ✅ COMPLETE
**Design:** Review accepted; newer owner decisions incorporated
**Dependencies:** None

The review identified the old opening and decision gaps. It did not implement gameplay. The 6 October handoff now defines the opening; follow V1-021–025 and their prerequisites. The accepted report is in the owner conversation, not a separate repository file.

---

## V1-021 — Fresh Baseline and First Resource

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE; implement children separately
**Dependencies:** V1-003, V1-010–015; 021A before 021B

Existing manual acquisition is reusable, but the new baseline and first-ever guarantee are not complete. Split into 021A (cash/level baseline) and 021B (first-action lifecycle). Do not mark this parent COMPLETE until both are tested.

**Acceptance:** Reference L checks 1–2.

---

## V1-021A — Fresh Cash and Factory Level Baseline

**Status:** ✅ COMPLETE
**Design:** Implemented and tested for this bounded baseline only
**Dependencies:** Accepted persistence/testing foundation

Smallest next implementation: change fresh Cash to $0 and fresh Level/XP to 0/0; use total threshold 100L² and Level floor(sqrt(XP/100)) consistently for initial display. Update the directly affected default/validation/display tests. Preserve existing total XP and valid legacy saves; assess any compatibility adjustment before editing. Do not add Pickaxes, first-click flags, machine entities, shop gates or V2 in this ticket. V1-100/101 later integrate the same formula; do not duplicate it.

**Acceptance:** Reference L checks 1 (cash/XP/level portion only).

Implemented fresh Cash/XP/Level 0/0/0, derived Level from total XP and valid Level-0 progress. Existing Cash/XP and missing-legacy XP fallback 100 are retained; saveVersion remains 1. Verified four syntax checks, 225 Node regressions and 11 browser scenarios. The first-resource, Pickaxe, sale, Shop and automation steps remain separate incomplete tickets.

---

## V1-021B — Guaranteed First Manual Resource

**Status:** ⚪ NOT STARTED
**Design:** Fresh guarantee Defined; legacy first-action backfill DESIGN REQUIRED (M1)
**Dependencies:** V1-021A, V1-026 and V1-016 contract gate M1 approved; use the validated additive manual envelope if implemented before V2

Implement the once-ever Stone/no-material first action, persisted so reload cannot repeat it. Define legacy completion defaults in the technical contract without inventing past player events. Later actions use the manual pool. Do not use inventory emptiness as a first-action flag.

**Acceptance:** Reference L checks 1–2, 28.

---

## V1-022 — First Discovery and Collection Continuity

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-021B, V1-029

Reuse existing discoveries and notifications; integrate accessible manual tiers and quantity-vs-click statistics. Keep ore collection independent from inventory, exclude Stone/materials and preserve firstDiscovery compatibility.

**Acceptance:** Reference L checks 2, 8, 28.

---

## V1-023 — Starter Furnace First Sale

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-021B, V1-050; processing contract from V1-016

Use the free permanent Tier 1 Furnace as the selling system, with Reference E tier-1 capacity/value/time and manual activation. Remove/reserve items and award sale Cash exactly once, including reload. No new direct-sale feature. Modernizing later tiers is V1-080–085.

**Acceptance:** Reference L checks 3, 16, 26, 28.

---

## V1-024 — Mining Power I as First Required Upgrade

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-023, V1-028, V1-050–052

Integrate Mining Power I with its $250 original cost and approved effect. Show the requirement for Unlock Miner and enforce it in the transaction path. Do not imply that unrelated affordable Shop stats are forbidden before Mining Power: the handoff requires it before Unlock Miner, not a general ban on every other purchase.

**Acceptance:** Reference L checks 4, 9, 17, 28.

---

## V1-025 — Separate Miner Unlock and First Automation

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-024, V1-071A/B, V1-018

Unlock Miner costs $100, requires Mining Power I and produces nothing. Purchase the first Miner separately for $100 before eligible discount, using the free first slot. Enforce access/ownership/caps in handlers and UI. Only owned entities start production. Rebirth removes unlock/Miners but retains slot access.

**Acceptance:** Reference L checks 4–8, 28.

---

## V1-026 — Default Pickaxe and Manual Access

**Status:** ✅ COMPLETE (bounded Default-only runtime/manual access)
**Design:** Implemented and tested for Default Tier 0 only
**Dependencies:** V1-021A and documented V1-016 contract. Default-only manual access can proceed in schema 1; crafted copies and first-action history are separate gated work

Infinite Default Pickaxe, source-specific accessible tiers, locked weights zero before Luck; default reaches T2. Establish the runtime boundary without implementing future tiers. Legacy mapping/defaults must be explicit before persisted additions.

Implemented unconditional runtime Default (Tier 0, raw Power 4, Luck 1×, infinite durability). Manual gameplay filters Reference A base weights to Stone/T1/T2, zeros T3/T4 and normalizes the accessible pool without an automated Stone floor. Existing within-tier selection, one-resource output, awards/discovery and automated Dropper behavior are preserved. No new persisted fields, migration or saveVersion change; schema 1 remains active. Verified four syntax checks, 230 Node tests and 12 browser scenarios. This does not complete V1-021B, V1-027, V1-028, V1-029 or V1-031; first-action history remains gated by M1.

**Acceptance:** Reference L checks 1–2, 7–8.

---

## V1-027 — Pickaxe Copies, Crafting, Durability and Repair

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-026, V1-028 materials, V1-041, compatible persistence activation

Implement Reference A exact eight recipes, full-precision power, additive Luck, independent copies, one hit/click, deterministic break/equip ties, broken-only ceil(95%) atomic repair, and damage-preserving durability upgrades. No repair through Rebirth.

**Acceptance:** Reference L checks 10–13, 19, 26.

---

## V1-028 — Manual Quantity, Materials and Duplication

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE except material XP award values
**Dependencies:** V1-026, V1-050–052 stat definitions, V1-041

Implement probabilistic power rounding, once-per-click 15% material substitution, conditional 60/30/10 material selection and per-eligible-resource duplication. First click exempts materials. Wood/Scrap/Metal XP recommendations need approval before awarding those values; split the award portion rather than silently adopting them or inventing zero XP.

**Acceptance:** Reference L checks 2, 9–10.

---

## V1-029 — Manual Luck and Within-Tier Selection

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-026, V1-030; shop stat definitions

Reference A tier weights/exponents, accessible pool normalization and 0.65 within-tier weighting. FinalManualLuck combines only shop and equipped Pickaxe Luck; no automated Stone clamp or Rebirth automated Luck.

**Acceptance:** Reference L checks 7–8, 10.

---

# Resources

## V1-030 — V1 Resource Catalogue

**Status:** ✅ COMPLETE
**Design:** Existing Stone + 20 base ore values/XP retained
**Dependencies:** None

Retain the approved ore catalogue in Bible 3.4 / Reference J. This completion covers base definitions only, not new weighted generation, Pickaxes or material XP recommendations. T5+ Deferred.

---

## V1-031 — Resource Generation Integration

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE; child pipelines separately implemented
**Dependencies:** V1-028–029, V1-071B/C

Integrate separate manual and automated generators with inventory, discovery, XP and statistics. Preserve source distinctions and prevent double counting. The old uniform tier roll is not final V1 completion.

**Acceptance:** Reference L checks 2, 6–10, 26.

---

## V1-032 — Resource Value and Processing Bases

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN REQUIRED only for Stone × Ore Value interaction
**Dependencies:** V1-041, V1-050, V1-074A, V1-075A

Use ore values and Ore Value before processing, Polisher multiplier, immutable pre-Refiner basis and Furnace factors in order. Resolve Reference K.4 before applying or excluding Ore Value on Stone; do not choose silently.

**Acceptance:** Reference L checks 14–17.

---

## V1-033 — Large Number Formatting

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Review all number formatting for consistency across:

* Cash.
* XP.
* Values.
* Costs.
* Statistics.
* Rebirth currency.

---

# Inventory

## V1-040 — Basic Inventory

**Priority:** P1
**Status:** ✅ COMPLETE

Current inventory tracks quantities of base resources.

---

## V1-041 — Pickaxe and Processed Inventory Model

**Status:** 🟠 IN PROGRESS
**Design:** Defined behavior and V1-016 field contract; pure model complete, integration gated
**Dependencies:** V1-016

Independent Pickaxe copies/materials and raw/Polished/Refined cohorts. Preserve resource identity, Refine Count and immutable value metadata; merge only compatible cohorts. Model reserved inputs separately from available stock. No mutations, capacity rules or future ore placeholders in this change.

Consumer tickets depending on V1-041 may use completed V1-041A to build/test candidate models before persisted integration. They do not wait for V1-041B activation to implement their consumers; 041B is integrated alongside those consumers and must satisfy V1-018 before enabling V2 writes.

**Acceptance:** Reference L checks 11–15, 26.

---

## V1-041A — Pickaxe and Processed Inventory Pure Model

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** V1-016; existing resource catalogue and regression harness

`InventoryModel` in `ores.js` validates/constructs canonical Lots, material balances, processed inventories and crafted Pickaxe copies with a caller-supplied durability maximum. Compatibility compares all six identity/value fields exactly; pure merge/split/add operations preserve snapshots and return independent records, with null for an exhausted remainder. Invalid records, incompatible merges, numeric overflow and quantity-loss arithmetic reject explicitly. Counts retain finite-integer compatibility beyond safe-integer size when the requested operation is representable; IDs/equip sequences remain safe integers. Refined historical bonuses may be negative; validation checks structural value safety, not a new Refiner/perk formula.

Existing raw inventory remains an integer map. No model object is attached to live state; defaults, validators, migrations and saveVersion 1 are unchanged. Verified four syntax checks, 243 Node regressions (13 focused model/boundary tests added) and the unchanged 12 browser smoke scenarios. This does not complete Pickaxe gameplay, material awards, machine processing, Furnace modernization or V2 activation.

---

## V1-041B — Persisted Inventory Integration

**Status:** ⚪ NOT STARTED — BLOCKED by applicable integration/activation gates
**Dependencies:** V1-041A; owning V1-027/028/074/075/080+ consumers; V1-017/018 for V2 structures; applicable V1-016 decision gates

Integrate only records with working consumers and approved lifetime/migration semantics. Any additive schema-1 manual path must follow the explicit contract and its owning ticket; it must not change the raw resource-count map. Processed inventory and incompatible structures wait for the adjacent V1→V2 conversion, validation/recovery coverage and complete activation gate. Preserve snapshot metadata without resolving T1 repricing or other Open rules. No partial V2 writes. V1-041 remains incomplete until the required integration is implemented and tested.

---

## V1-042 — Inventory Capacity

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

The Development Bible intends inventory capacity/progression.

Define:

* Starting capacity.
* Capacity increases.
* Full-inventory behaviour.
* Factory interaction.

---

## V1-043 — Inventory Tabs, Sorting and Selection

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE for required tabs/selection only
**Dependencies:** V1-041

Pickaxes/resources share inventory; Raw/Polished/Refined tabs, separate crafting screen. Manual Furnace selects visible stack; automatic selection uses Reference D ordering. Extra sorting/filter options beyond approved behavior require specification.

---

## V1-044 — Inventory UI Generation

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Replace unnecessary manually duplicated HTML with data-driven rendering where practical.

---

# Economy and Shop

## V1-050 — Cash Price and Investment Rules

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE; pure pricing and investment models complete, transaction integration pending
**Dependencies:** Accepted tests; Reference E

Centralize original-formula → eligible discount → discounted-band half-up rounding. Never scale a previously rounded cost. Track actual Cash paid separately from refunds; retained free Preservation tiers add no investment. Do not implement Recommended Discount purchase pricing.

Consumers may use completed V1-050A for candidate price calculations and V1-050B for recorded-payment accounting before transaction integration. V1-050C is implemented alongside the owning transactions; it is not permission to change legacy prototype prices or activate partial V2 state.

**Acceptance:** Reference L checks 17–18.

---

## V1-050A — Cash Pricing and Rounding Model

**Status:** ✅ COMPLETE (pure pricing only)
**Dependencies:** Accepted regression harness; Reference E and Defined Discount eligibility

`CashPricingModel` in `ores.js` provides `getCashRoundingStep`, `roundCashPrice`, `getDiscountFactor` and `calculateCashPrice(rawPrice, {category, discountLevel})`. The caller supplies the original target formula's raw price and explicit level 0–10. Eligible categories are `minerPurchase`, `minerTier`, `polisherPurchase`, `polisherTier`, `refinerPurchase`, `refinerTier`, `furnaceTier`. Cash categories `unlockMiner`, `minerSlot`, `minerOreLuck`, `oreValue`, `miningPower`, `miningLuck`, `miningDuplication` still round but receive no Discount. Unknown/non-Cash categories and eligibility overrides reject; Pickaxe recipes, materials and Stardust/Rebirth costs must use their own future rules.

Eligible factor is 1−0.05L. Choose $1/$10/$1,000/$1,000,000 step from discounted raw values at the $1,000/$1M/$1B boundaries, then apply step × floor(amount/step+0.5). No epsilon adjustment, previous-price compounding, hidden save state or actual debit. Invalid inputs and non-finite calculated prices reject; legitimate zero quotes are allowed without creating investment entries. Verified four syntax checks, 253 Node tests (10 focused pricing/boundary regressions added), and the unchanged 12 browser scenarios. No production save fields or legacy purchase behavior changed.

---

## V1-050B — Pure Payment, Investment and Refund Model

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** V1-050A; V1-016 Payment/Investment contract

`InvestmentModel` in `ores.js` validates exact `{kind, targetLevel, cashPaid, basis}` Payments and `{entries}` Investments. Context `{machineType, owned}` distinguishes an empty unowned candidate from an owned ledger with exactly one purchase. Tier targets are 2–25 for Miners and 2–10 for Polishers/Refiners; Miner-only Ore Luck targets are 1–50. Duplicate purchase/tier/Ore Luck targets reject. Different kinds may share a numeric target. Missing upgrade entries are never inferred from a preserved/current tier.

`createActualPayment` and `appendActualPayment` accept only new `actual` records; structural validation can read supplied `legacyEquivalentV1` candidates and retain historical entries when appending an actual payment. This validates structure, not migration provenance or historical prices. Appending clones the ledger and each record. `sumInvestment` and `calculateRefund` use recorded amounts only; refund is floor(50% × total), with no persisted refund total. Zero purchases and fractional recorded Cash are retained exactly. Non-finite or non-reversible additions reject without rounding, an epsilon or an arbitrary safe-integer Cash cap; this also rejects fractional combinations whose exact sum cannot be represented.

Verified four syntax checks, 265 Node tests (12 focused accounting/boundary regressions added), and the unchanged 12 browser scenarios. No live ledgers, Cash debits/credits, machine ownership/resale, save fields or migrations were added. Production saveVersion remains 1. K.2 reconstruction and compensation remain DESIGN REQUIRED.

---

## V1-050C — Transaction / Investment Integration

**Status:** 🟡 IN PROGRESS
**Design:** Actual-payment/refund rules Defined; K.2 reconstruction remains DESIGN REQUIRED
**Dependencies:** V1-050A/B; V1-016 Payment/Investment contract; applicable transaction consumers and persistence gates for live integration

Integrate the completed pure pricing/accounting models with successful actual debits in the owning machine transactions under their approved schema boundaries. Quote → validate affordability/eligibility/ownership → debit and update ownership → append actual payment → atomically commit the complete transaction. A quote is not proof of payment. Include only qualifying purchase, paid tier and Miner-local Ore Luck costs; free/preserved tiers create no payment. Resale must remove the machine and credit floor(50% × recorded qualifying total) exactly once, never use current catalogue replacement cost. Furnace is not sellable. Test transaction failures and reloads without duplicate debits/refunds. Do not introduce Recommended Discount-perk purchase pricing or invent K.2 reconstruction. Live integration waits for its owning consumers and safe persistence boundary; the V1-050 parent remains incomplete until that integration is tested.

### V1-050C1 — Pure Miner Upgrade Candidate Transactions

**Status:** ✅ COMPLETE (non-persisted, idle-only candidate scope)
**Dependencies:** V1-071A1, V1-071B1, V1-071C1, V1-050A/B and V1-016 / V1-070 contracts

`MinerUpgradeCandidateModel` exposes `prepareTierUpgrade(state,minerId,discountLevel,otherEntityIds)` and `prepareOreLuckUpgrade` with the same arguments. It reuses the exact MinerCandidateModel projection: `{cash,shop:{minerUnlocked},factory:{minerSlots,miners},identity:{nextEntitySequence,nextManualEquipSequence}}`. Required external ID context covers allocated non-Miner entities as in A1. This is not a complete V2 adapter. Unknown fields/extensions reject instead of being silently dropped; a future full-state adapter must preserve those separately. All supplied Miners must be idle because the existing candidate validator cannot certify active cycles, including non-target cycles.

Resolve the unique target by canonical owned ID, derive its next level, quote through MinerTierModel or MinerOreLuckModel, validate affordability and exact representability of the Cash debit, append the proposed actual-basis payment through InvestmentModel, and return independent Cash/entity/ledger state. Revalidate the result. Tier cap is 25 and local cap 50; local quotes receive no Discount. No payment is synthesized for preserved tiers or missing historical levels. Existing duplicate/future-level history rejects. Preserve all supported unrelated data, slot flags, IDs and global/per-entity counters; allocate nothing.

The returned actual-basis payment is a **proposed atomic debit**, not evidence of a committed historical payment. Only a future successful durable production commit makes it historical fact. No live Cash, entity, cycle, save or investment changes occur. Exact-debit checking and copying stay local because the corresponding A1 helpers are private; existing public contracts/formulas are unchanged.

Seven deterministic tests cover tier milestones/maxima, local upgrade rounding/Discount exclusion, free Preservation history, immutable inputs and independent ledgers, unknown IDs/unsupported shapes, active cycles, duplicate records, caps, insufficient Cash, precision rejection, sequential candidates and unchanged production saves/gameplay. Four syntax checks, 321 Node tests and all 12 existing browser smoke scenarios pass locally. Production saveVersion remains 1.

### V1-050C2 — Durable Transaction and Investment Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-050C1, V1-070, applicable owning consumers and V1-016/V1-018 persistence/activation contracts; unresolved active-work timing/effect gates where applicable

Implement the complete candidate-to-durable-commit boundary, failure/retry handling and full-state adapters without dropping unrelated data. Do not publish proposed payments as history before commit. Live machine ownership, upgrades/resale and production integration require their own consumers and applicable design gates. V1-071A2, V1-071B2, V1-071C2 and V1-018 remain outstanding. Parent V1-050C and overall V1-050 stay incomplete until live integration is implemented and tested; K.2 reconstruction and T1 active-upgrade binding are not resolved here.

---

## V1-051 — Normal Upgrade Shop and Transaction Gates

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-050, V1-016 field contract

Data-driven normal Shop table from Reference J, clear affordability/cap/prerequisite checks in logic and UI. Normal upgrades reset on Rebirth. Keep global Mining Luck separate from local Miner Ore Luck. Ore Value on Stone is gated by K.4.

**Acceptance:** Reference L checks 4, 8–9, 17.

---

## V1-052 — Normal Upgrade Effects

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE except K.4
**Dependencies:** V1-050–051

Apply approved Mining Power, Mining Luck and Mining Duplication effects/caps. Ore Value applies to ores before processing; Stone behavior waits on owner decision. Integrate with manual pipeline without adding automated Shop Ore Luck.

**Acceptance:** Reference L checks 8–10, 17.

---

## V1-053 — Purchase Feedback

**Priority:** P3
**Status:** ⚪ NOT STARTED

Players should clearly understand:

* Successful purchases.
* Insufficient Cash.
* Locked items.
* Requirements.

---

# Grid foundation — design-dependent integration

## V1-060 — Factory Grid

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Implement the Version 1.0 web factory as a 2D tile/grid factory.

The system should be simple, readable and enjoyable rather than visually complex.

The factory grid should support future Roblox translation.

### Requirements

The grid must support:

* Tile coordinates.
* Empty/occupied state.
* Building placement.
* Building removal.
* Rotation where required.
* Machine IDs.
* Connections.
* Expansion.

---

## V1-061 — Factory Grid Rendering

**Priority:** P1
**Status:** ⚪ NOT STARTED

Create a clear visual representation of factory tiles.

Players should easily distinguish:

* Empty tiles.
* Buildings.
* Conveyors.
* Input direction.
* Output direction.
* Resources moving through the factory.
* Invalid placement.

---

## V1-062 — Building Placement

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Players must be able to select and place factory buildings.

---

## V1-063 — Placement Validation

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Prevent invalid placement.

Validation should consider:

* Occupied tiles.
* Factory bounds.
* Building footprint.
* Other restrictions defined later.

---

## V1-064 — Building Rotation

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Allow rotation for directional buildings.

---

## V1-065 — Building Removal

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Allow removal of buildings.

Refund behaviour requires an approved design decision.

---

## V1-066 — Building Movement

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Determine whether players may freely relocate machines or must remove/rebuild them.

---

## V1-067 — Factory Save/Load

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Placed buildings and factory layout must persist.

Save:

* Coordinates.
* Rotation.
* Building type.
* Building state.
* Upgrades where applicable.

---

# Machine contracts and independent processors

## V1-070 — Independent Machine Lifecycle Contract

**Status:** ✅ COMPLETE (technical contract/documentation only)
**Design:** Shared lifecycle specified; listed gameplay/migration gates remain DESIGN REQUIRED
**Dependencies:** V1-016, V1-041A, V1-050A/B. Live V1-050C integration is subsequent work, not a prerequisite for defining its contract

**Contract:** [V1_MACHINE_LIFECYCLE_CONTRACT.md](docs/V1_MACHINE_LIFECYCLE_CONTRACT.md). Reuses exact V2 entity/slot/ID/queue/cycle fields; defines atomic purchase/upgrade and reserve/resolve/commit boundaries, existing pure-model calls, write failure/reload handling, resale and central Rebirth ownership. Separates UI/grid integration from authoritative simulation. Records K.2/M1/P1/R1/T1/B1, grid and applicable value/perk/challenge gates without inventing resolutions. Future adapters must reconcile exact pure-model records with V2 inert-extension preservation.

Documentation verification: existing four syntax checks, 265 Node tests and 12 browser scenarios pass; no new gameplay tests or runtime code. This does not certify future entity transactions/cycles. V1-050A/B remain COMPLETE, V1-050C remains outstanding and parent V1-050 remains IN PROGRESS. Next bounded implementation is V1-071A's non-writing candidate-state portion; no production instances or V2 activation yet.

**Future implementation acceptance:** Reference L checks 5, 18, 26 and the lifecycle contract's transition/crash-boundary checklist.

---

## V1-071 — Miner System

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE; legacy counter prototype only
**Dependencies:** Children 071A–D; V1-018/025 integration

Replace final-design ownership semantics through the planned V2 transition, not a production-field rename. Implement children as bounded tickets; source table entries and caps remain data-driven for future extension.

**Acceptance:** Reference L checks 5–8, 17–18, 26.

---

## V1-071A — Miner Slots, Entities and Purchases

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-070, V1-050A/B, V1-016 for candidate slot/entity/purchase preparation; V1-050C durable transaction integration and V1-018 gates before live writes/activation

Five slots: free / $10,000 / $1,000,000 / $10,000,000,000 / $1,000,000,000,000, retained after resale/Rebirth and not discounted. Separate unlock and $100 machine purchase; independent entities with tier/local level/state/investment. Enforce caps in handlers.

V1-071A1 completes pure candidate validation/purchase preparation under the [lifecycle contract](docs/V1_MACHINE_LIFECYCLE_CONTRACT.md#12-implementation-handoff-and-future-acceptance). V1-071A2 remains gated live integration. Do not convert live legacy counts, start production, add grid activation rules or write instance records into schema 1. Completing the pure portion alone does not complete V1-071A or the parent Miner system.

**Acceptance:** Reference L checks 4–6, 17, 26.

---

## V1-071A1 — Pure Miner Slot, Entity and Purchase Candidate Model

**Status:** ✅ COMPLETE (pure idle candidates only)
**Dependencies:** V1-016, V1-070, V1-050A/B

`MinerCandidateModel` in `ores.js` supplies `createSlotAccess`, `validateSlots`, `validateIdleMiner`, `validateCollection`, `validateCandidate`, `getSlotState`, `getSlotPrice`, `getMinerPrice`, `prepareSlotUnlock` and `preparePurchase`. Slots are exactly five Booleans with slot 1 true; fixed catalogue prices use `minerSlot` pricing without Discount. Nonsequential access is valid. Slot-unlock candidates debit only their private Cash/slot projection, never create a Miner or investment entry, and reject already-unlocked access.

The exact non-persisted projection is `{cash, shop:{minerUnlocked}, factory:{minerSlots,miners}, identity:{nextEntitySequence,nextManualEquipSequence}}`. `validateCandidate(state, otherEntityIds)` requires explicit context containing every currently allocated non-Miner entity ID (Pickaxe/Polisher/Refiner, excluding reserved Default/Furnace IDs). `preparePurchase(state, slot, {discountLevel,preservationLevel}, otherEntityIds)` and `prepareSlotUnlock(state, slot, discountLevel, otherEntityIds)` return independent projections. Future full-state adapters must supply complete ID context, retain unrelated fields/extensions and preserve allocation history; these helpers do not certify omitted collections or replace the whole save. No implicit empty-ID default or new persisted context field is introduced.

Miner records use exactly `id`, `slot`, `tier`, `oreLuckLevel`, `investment`, `nextCycleSequence`, `cycle`. Collection checks enforce five owners, unique IDs/slots and unlocked access. Tier 1–25, local level 0–50, positive safe operation counters and owned investment are validated; payments cannot claim levels above owned progress. Free tiers do not require invented payments. **Only `cycle:null` is certified**: any non-null cycle rejects explicitly pending its owning active-cycle validator, rather than passing unchecked work. Exact record fields are required at this pure-model boundary; future V2 inert-extension adapters remain required.

Purchases require explicit `shop.minerUnlocked:true`, vacant unlocked slot and sufficient representable Cash. `CashPricingModel` quotes the original $100 machine purchase with Discount level 0–10. Preservation input is integer 0–25; starting tier is min(25,max(1,L)) once at creation. `InvestmentModel` records exactly one actual purchase payment, never free tier/local/slot charges. New local Ore Luck is 0, cycle null and operation sequence 1. A successful candidate consumes one global sequence; failures consume none. Existing entity state, historical payments and the manual-equip counter are retained independently. Counter exhaustion, malformed inputs and precision-losing debits reject without partial changes.

Verified four syntax checks, 278 Node tests (13 focused candidate regressions added), and all 12 unchanged browser scenarios. No live transactions, production simulation, migration, UI, schema/default or legacy cost changes; production saveVersion remains 1. V1-050C and all live Miner integration remain outstanding.

---

## V1-071A2 — Live Miner Purchase and Ownership Integration

**Status:** ⚪ NOT STARTED
**Design:** Candidate contract Defined; live release gated
**Dependencies:** V1-071A1, V1-050C transaction coordinator, V1-018 consumer/activation gates and approved grid placement/activation semantics where applicable

Adapt the approved pure projection to the authoritative full state without dropping unrelated/unknown data. Supply complete global identity context, validate any active cycles through their owning consumer, and commit actual Cash, access/ownership, identity and ledger atomically. Bind prerequisites/feedback in UI while enforcing them in logic. Preserve slot access after removal and reject stale/failed transactions without duplicate debit or ID consumption. No partial instance writes into schema 1, no implicit ownership-to-placement rule, and no live activation before required V2 consumers and gates. Coordinate prerequisite Shop ownership with its owning ticket; this child does not invent Unlock Miner or production rules.

**Acceptance:** Reference L checks 4–6, 17, 26 plus the lifecycle transaction failure/reload checklist.

---

## V1-071B — Miner Tier Curve and Automated Distribution

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-071A, V1-030

Use every Reference B tier-1–25 table entry and original cost recurrence (Tier 6 ×7.5 only), interval/speed floors and one base output/cycle. T4 zero before Miner 6. Normalize ore columns around Stone anchor, apply Overall Luck, normalize and enforce Stone ≥25%. Do not activate future output duplication/tier 26+.

V1-071B1 completes the pure mathematical model only. V1-071B2 remains outstanding for live production; this does not complete V1-071, V1-025, purchase integration or V2 activation.

**Acceptance:** Reference L checks 5–8.

---

## V1-071B1 — Pure Miner Tier Curves and Automated Distribution

**Status:** ✅ COMPLETE (pure mathematics only)
**Dependencies:** Reference B / V1-030 catalogue, V1-050A pricing; V1-071A1 provides the separate candidate ownership boundary

`MinerTierModel` in `ores.js` exposes `getTierSource`, `getTierProbabilities`, `getRawTierUpgradeCost`, `getTierUpgradePrice`, `getProductionInterval` and immutable `BASE_OUTPUT_PER_CYCLE:1`. Source rows are frozen copies of all 25 approved rows; `stone` is a percentage anchor and `tier1`–`tier4` are relative ore-column weights. Probability results use the same keys as fractions and are independent objects. T4 is explicitly zeroed below Miner 6, separate from manual Pickaxe access.

Distribute 1−S over eligible ore columns, multiply by explicit Overall Luck exponents 0.20/0.40/0.60/0.80, normalize with unchanged Stone weight, then enforce Stone ≥0.25 by proportionally assigning 0.75 to adjusted ore weights. Identity Luck retains the source Stone anchor exactly. Full-precision normalization sums to 1 within floating-point precision; no display rounding or remainder is charged to Stone/locked tiers. Positive finite multiplier inputs, including numerical extremes, remain finite; this mathematical input does not grant or persist perk ownership. The current Defined permanent source still caps at 11×. No within-tier Ore Luck calculation or tier-roll/RNG helper is implemented here.

Raw upgrades start at $400 into T2, use ×4 except ×7.5 into T6, then ×4 through T25 ($52,776,558,133,248,000). Recompute the original raw recurrence for each target; `CashPricingModel` applies `minerTier` Discount and Cash rounding. No upgrade transaction/payment is appended. Tier 1 purchase remains V1-071A1.

Intervals return full-precision seconds: max(0.1, max(0.1,5×0.96^(T−1))×(1−0.01L)), with validated tiers 1–25 and Defined Miner Speed levels 0–50. The floor remains in the formula but does not bind within these caps; no invalid higher tier/perk is enabled to demonstrate it. One base resource is an invariant, not an award; duplication remains inactive.

Verified four syntax checks, 287 Node tests (nine focused model regressions added), and all 12 unchanged browser scenarios. Tests compare every source row against both canonical documents, validate normalized/floored/locked distributions and relative Luck weighting, original costs/quotes, intervals and unchanged production saves/manual/legacy behavior. Production saveVersion remains 1; no state, handler, timer, award, migration or UI integration.

---

## V1-071B2 — Live Automated Production Integration

**Status:** ⚪ NOT STARTED
**Design:** Mathematical rules Defined; timing/activation still gated
**Dependencies:** V1-071B1, V1-071A2, V1-071C within-tier selection, V1-070 cycle contract, V1-050C transaction coordination and V1-018 consumer/activation gates; T1 timing/effect binding and applicable grid activation decisions

Connect independent owned Miner cycles to the pure tier model and the separately approved within-tier ore model. Explicitly bind effects at the approved timing boundary, reserve/resolve/commit outcomes once, and integrate resource awards, XP, Collection and statistics with their owning consumers. Rebuild only valid schedulers after load; do not generate offline catch-up, double-pay results or infer production activation from grid ownership. Implement deterministic roll boundary and lifecycle/reload tests in the existing harness. No partial production writes into schema 1 or duplicated legacy Dropper production.

**Acceptance:** Reference L checks 5–8, 26 and V1-070's cycle/reload checklist.

---

## V1-071C — Miner Luck and Individual Upgrades

**Status:** 🟡 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-071B, V1-050

Separate Overall Luck tier roll from within-tier Ore Luck. Local Ore Luck levels 0–50, own cost curve, no Discount; multiply with permanent Ore Luck and 1× deferred Inscription factor. Track actual local investment; no cross-Miner sharing or ownership-count Luck.

**Acceptance:** Reference L checks 5, 8, 17.

Pure calculations are complete in C1; live local upgrades and production use remain outstanding in C2/B2. This does not complete the parent or the Miner system.

### V1-071C1 — Pure Miner Ore Luck and Within-Tier Selection

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** V1-071B1, V1-050A; Reference B / Decisions 10–11 and the existing ore catalogue

`MinerOreLuckModel` in `ores.js` provides:

- `getFinalOreLuck(rebirthLevel, localLevel)`: `(1 + 0.002R) × (1 + 0.02L)` with integer R=0…5000 and L=0…50; maximum 22×. Deferred Inscriptions remain 1×; no ownership-count factor.
- `getOreWeights(R,L)`: five full-precision weights `0.65^i × FinalMinerOreLuck^(0.1i)`, i=0…4.
- `getOreProbabilities(oreTier,R,L)`: fresh ordered `{resourceId, probability}` records using the existing five-ore T1…T4 catalogues. Stone is rejected: the future production caller bypasses this second stage for Stone. Overall Luck and access locks remain the first-stage responsibility.
- `selectOreId(oreTier,R,L,roll)`: explicit roll in [0,1), half-open cumulative intervals and a final floating-point remainder assigned only to the last eligible ore in the selected tier. No runtime RNG or awards.
- `getRawUpgradeCost(targetLevel)` / `getUpgradePrice(targetLevel,discountLevel)`: original `1000 × 1.25^(L−1)` for target 1…50; CashPricingModel category `minerOreLuck` applies Cash rounding but no Discount. Quotes do not create payments or change owned levels.

Seven deterministic regressions cover formula/level limits, canonical ordering, approximate display distribution versus unrounded probabilities, boundary rolls, input rejection, independent results, unchanged Overall Luck results and production persistence/gameplay. Local verification: all four syntax checks, 294 Node tests and the existing 12 browser smoke scenarios pass. No schema change; production saveVersion remains 1.

### V1-071C2 — Individual Miner Ore Luck Upgrade Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-071C1, V1-071A2, V1-050C, V1-018 and the V1-070 lifecycle contract; applicable T1 in-flight effect-binding decisions

Use C1 quotes for a selected owned Miner's next local level, enforce cap/affordability in simulation, and atomically debit Cash, update that entity and append its actual InvestmentModel payment. No Discount, Preservation grant or cross-Miner change. Bind the second-stage selection to future V1-071B2 cycles only through the approved runtime/cycle boundary. No live transaction, timer, inventory award or migration is supplied by C1. A2, B2, V1-050C and V1-018 remain outstanding.

---

## V1-071D — Miner Resale and Slot Persistence

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-071A–C, V1-050, V1-018

Explicit confirmation; floor half actual purchase/tier/local Cash investment. Retain slot access, remove local level with sold entity; replacement starts from Preservation at creation only. Test no refund for free tiers and no duplicate refunds after reload.

**Acceptance:** Reference L checks 18, 26.

---

## V1-072 — Conveyors

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

Conveyors are required for V1.0.

The current Development Bible does not yet fully define their behaviour.

Before implementation, specify:

* Movement speed.
* Direction.
* Resource capacity.
* Tile interaction.
* Corners/turning.
* Building inputs.
* Building outputs.
* Resource congestion.
* Whether multiple items may occupy a conveyor.
* Upgrade behaviour if applicable.

Astra MUST NOT invent these rules.

---

## V1-073 — Conveyor Simulation

**Priority:** P1
**Status:** ⚪ NOT STARTED

Implement only after V1-072 is approved.

---

## V1-074 — Polisher System

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-074A/B

Legacy Adder effects are migration context, not final Polisher behavior. Separate processing and ownership transactions.

**Acceptance:** Reference L checks 14, 17–18, 26.

---

## V1-074A — Polisher Processing

**Status:** 🟡 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-070, V1-041A, V1-050A/B and V1-016 for candidate processing; V1-041B/V1-050C for applicable persisted/transaction integration and gate T1 before affected activation. Implement/test consumer before V1-018 activation

Reference C raw-ore-only input, no Stone/repolishing; 1–10 tiers, exact time/capacity/value, partial batches, selected ore and independent queue/reservation state.

**Acceptance:** Reference L checks 14, 26.

Pure mathematics and Lot construction are complete in A1. Ownership, input transfer and actual processing remain outstanding in A2; the parent and overall Polisher system are not complete.

### V1-074A1 — Pure Polisher Tier, Processing and Value Model

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** Reference C / Decision 14, V1-041A, V1-050A; V1-016 / V1-070 contracts

`PolisherModel` in `ores.js` supplies:

- `getCycleTime(tier)` / `getBatchSize(tier)`: tiers 1…10, exact `7.5 × 0.799413^(T−1)` seconds and positive half-up `1.668101^(T−1)` capacity. Approved source coefficients remain unchanged; no speed floor or forced endpoint.
- `getProcessedAmount(tier,availableQuantity)`: finite non-negative integer quantity, minimum of available and capacity, including zero/partial batches. No inventory consumption or capacity policy.
- `validateInputLot(lot)`: reuse InventoryModel canonical validation, then require raw ore; no Stone, materials, unknown IDs or already processed inputs.
- `calculatePolishedValue(currentOreValue,rebirthValueLevel)`: finite non-negative supplied basis already includes applicable Ore Value; multiply once by `1.50 × (1 + 0.0001L)`, integer L=0…5000. Preserve full precision; reject overflow. This does not resolve T1 snapshot timing or reprice existing Lots.
- `createPolishedLot(resourceId,processedQuantity,polishedValue)`: delegate exact metadata/positive quantity validation to InventoryModel; return an independent Lot with the supplied historical value, without attaching it to any inventory.
- `getRawTierUpgradeCost(targetTier)` / `getTierUpgradePrice(targetTier,discountLevel)`: original `5000 × 10^(T−1)` for target 2…10, using CashPricingModel `polisherTier` Discount-before-rounding. No slot purchase prices, debit or investment append.

Seven deterministic regressions cover formulas, quantities, all 20 raw ores, stage/value rejection, precise historical metadata, original costs, immutable inputs and unchanged production saves/gameplay. Local verification: all four syntax checks, 301 Node tests and the unchanged 12 browser smoke scenarios pass. SaveVersion remains 1; no live state integration.

### V1-074A2 — Polisher Processing Lifecycle Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-074A1, V1-070, V1-041A and V1-016 for candidate lifecycle; V1-041B / V1-050C for applicable persisted/transaction integration; gate T1 before affected activation

Implement independent selected-ore, queue/reservation and cycle transitions through the lifecycle contract. Transfer input ownership once and commit canonical Polished output once, preserving historical metadata across reloads. Use A1 calculations without choosing unresolved timing/value binding. Build/test the consumer before V1-018 activation. A1 does not implement ownership, queues, cycles, output awards or migration. V1-074B, V1-041B, V1-050C, V1-017 and V1-018 remain outstanding.

---

## V1-074B — Polisher Slot Purchases, Upgrades and Resale

**Status:** 🟡 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-074A

Three slot-specific prices $5,000/$100,000/$2,000,000 independent of tier costs. Persistent slot identity; resale confirmation/refund on actual investment, return queued/unprocessed input once and retain polished output.

**Acceptance:** Reference L checks 14, 17–18, 26.

Pure purchases/upgrades are complete in B1; live ownership and resale are outstanding in B2. The parent and full Polisher system remain incomplete.

### V1-074B1 — Pure Polisher Purchase and Upgrade Candidate Model

**Status:** ✅ COMPLETE (idle, non-persisted candidate scope)
**Dependencies:** V1-074A1, V1-050A/B, V1-016 / V1-070 contracts and the V1-050C1 candidate safety boundary

`PolisherCandidateModel` in `ores.js` validates the exact projection `{cash,factory:{polishers},identity:{nextEntitySequence,nextManualEquipSequence}}`. Required `otherEntityIds` contains every allocated Miner/Pickaxe/Refiner ID, excluding reserved Default/Furnace identities. Reject unsupported extensions; a future full-state adapter must preserve them separately. This is not a complete V2 adapter. Canonical Polisher fields remain `{id,slot,tier,selectedOreId,queue,investment,nextCycleSequence,cycle}`. Selectors may be null or any current ore ID, without requiring available inventory. All queues must be empty and all cycles null, including non-target entities; active work is not certified or discarded.

Public operations:

- `validateIdlePolisher`, `validateCollection`, `validateCandidate`: enforce three-machine cap, fixed slots 1…3, unique canonical IDs/global sequences, tiers 1…10, operation counters, supported selectors and InvestmentModel ledgers. No paid tier above owned tier, duplicate targets or Miner-only Ore Luck entries.
- `getPurchasePrice(slot,discountLevel)` and `preparePurchase(state,slot,{discountLevel,preservationLevel},otherEntityIds)`: vacant slots are independent, with fixed raw machine prices $5,000/$100,000/$2,000,000 and eligible CashPricingModel Discount/rounding. Preservation level 0…25 grants min(10,max(1,L)) once, with only one purchase Payment. Allocate `polisher:<nextEntitySequence>` and increment exactly once; reject exhaustion. New selector null, empty queue, nextCycleSequence 1, cycle null. No access ledger or automatic ore selection.
- `prepareTierUpgrade(state,polisherId,discountLevel,otherEntityIds)`: target an owned immutable ID, quote the next tier through PolisherModel, append the proposed actual tier payment and change only that tier. Slot identity never changes the upgrade curve. No ID or operation-counter consumption and no fabricated Preservation payments.

Both operations validate exact representable Cash debit and investment arithmetic, preserve supported unrelated candidate data, and return independent nested records. Failure mutates nothing. Actual-basis payments remain proposals until a future successful durable production commit; no history is certified by candidate preparation.

Seven deterministic tests cover slots/replacement pricing, canonical creation, Preservation, discounted upgrades, identity collisions/exhaustion, unsupported active work/extensions, numeric safety, independent records and unchanged schema-1 gameplay. Local verification: four syntax checks, 328 Node tests and all 12 existing browser smoke scenarios pass. Existing Miner/Polisher model implementations are unchanged; saveVersion remains 1.

### V1-074B2 — Polisher Live Ownership, Purchases, Upgrades and Resale Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-074B1, V1-074A2, V1-050C2, V1-041B and applicable V1-018 consumer/activation gates; T1 before affected active-work transitions

Integrate durable ownership and payments without dropping other factory state. Resale requires confirmation, exactly-once refund/removal and the Defined queued/unprocessed input return policy. Do not discard active work or choose unresolved timing/value binding. B1 supplies no resale, queue handling, live Cash/ownership, processing or migration. V1-074A2, V1-050C live integration, V1-041B and V1-018 remain outstanding.

---

## V1-075 — Refiner System

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE processing; challenge wording separately Open
**Dependencies:** V1-075A/B

Legacy Multiplier ownership migrates to a Refiner; old duplication and compounding value are superseded. K.1 gates affected challenge progress, not the physical survivor/destruction rules.

**Acceptance:** Reference L checks 15, 17–18, 26.

---

## V1-075A — Refiner Processing and Gem Dust

**Status:** 🟡 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-074A, V1-041A, V1-070 and V1-016 for candidate processing; V1-041B for persisted integration and gate T1 before affected activation. R1 continues to block active resale in V1-075B. Implement/test consumer before V1-018 activation

One Refiner; polished or refined 1–14 inputs only. Reserve inputs, exact time/capacity/probability formulas, Dust roll/award before destruction, integer probabilistic yield; survivor count ≤15 and immutable pre-Refiner value. Separate metadata/cohorts and preserve Dust on destruction.

**Acceptance:** Reference L checks 15, 26.

Pure calculations and hypothetical outcomes are complete in A1. Actual reservation, destruction, Dust credit and survivor output remain outstanding in A2; neither the parent nor the Refiner system is complete.

### V1-075A1 — Pure Refiner Tier, Probability, Value and Gem Dust Model

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** Reference D / Decisions 17–18, V1-041A, V1-074A1 and V1-016 / V1-070 contracts

`RefinerModel` in `ores.js` exposes deterministic calculations with explicit levels/rolls:

- `getInterval`, `getBatchSize`, `getProcessedAmount`: tiers 1…10, full-precision `15 × 0.2^((T−1)/9)`, positive half-up `1 + 9 × ((T−1)/9)^1.2`, and min(capacity, finite non-negative integer available quantity). Partial/empty input supported without mutation.
- `validateInputLot` reuses InventoryModel and accepts Polished count 0 or Refined count 1…14 only. `getNextPass(c)` is c+1; count 15 rejects.
- `getTierBaseDustChance`, `getEffectiveBaseDustChance`, `getDustChance`: Reference D base formula, +0.005 per Dust Chance level 0…30 with 25% effective-base cap, then ×1.25^c with 95% final cap.
- `getDestructionChance(c,stabilityLevel)`: attempted pass n=c+1; clamp(min(0.95,0.15n)−0.005L,0.05,0.95), Stability level 0…180. No Luck or ownership modifier.
- `getExpectedDustYield` / `getDustQuantity`: Yield level 0…50, expected 1+0.05L; explicit Boolean Dust success plus independent fractional roll in [0,1). Integer floor plus probabilistic remainder, or zero on failed success.
- `getRefineBonus` / `calculateRefinedValue`: passes 1…15 and Value level 0…5000 follow Reference D exactly, including intentional negative bonuses after pass 5. `createRefinedLot(input,successfulQuantity,valueLevel)` validates positive quantity no larger than input and delegates canonical metadata to InventoryModel. First basis is historical polishedValue; later basis remains preRefinerValue, never the prior derived result.
- `evaluateItem(input,tier,perks,rolls)` requires input amount exactly 1, perks `{dustChanceLevel,stabilityLevel,yieldLevel,valueLevel}` and separate rolls `{dust,fractionalYield,destruction}`. Returns `{dust,destroyed,refinedLot}`. Dust is calculated first and survives hypothetical destruction; destroyed outcomes have null output. Surviving output is one independent Lot. Future batch callers require separate rolls per item; no batch-wide outcome, inventory splitting/merging or award occurs here.

Eight focused deterministic regressions cover full formulas, caps, eligibility, roll boundaries, integer yield, all 15 value passes, historical metadata, malformed inputs/overflow, independence and unchanged production persistence/gameplay. Local checks: four syntax checks, 309 Node tests and all 12 existing browser smoke scenarios pass. Production saveVersion stays 1.

### V1-075A2 — Refiner Processing Lifecycle Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-075A1, V1-070, V1-041A and V1-016 for candidate lifecycle; V1-041B / V1-050C for applicable persisted/transaction integration; gate T1 before affected activation

Implement per-item reservation/result ownership and exactly-once commits for Dust, destruction and surviving Refined Lots using the established cycle contract. Preserve independent rolls and immutable value bases across reload. A1 has no reservation, active cycle, payout, statistics or challenge event. K.1 destroyed-ore challenge credit remains unresolved; R1 still blocks active Refiner resale in V1-075B; T1 timing/value binding is not decided by these mathematical helpers. V1-075B, V1-041B, V1-050C and V1-018 remain outstanding; no V2 activation or migration occurs here.

---

## V1-075B — Refiner Purchases, Tiers and Resale

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE stated costs/refund; active-cycle disposal requires contract review
**Dependencies:** V1-075A, V1-050

$25,000 purchase; target-tier upgrades 125,000 × 10^(T−2); tier cap 10. Half actual Cash investment resale, no Stardust refund. Confirm active-cycle removal/reservation handling before implementing destructive removal if the technical contract cannot preserve the defined processing result without new gameplay policy.

**Acceptance:** Reference L checks 17–18, 26.

---

## V1-076 — Furnaces as Factory Buildings

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Existing furnace mechanics are substantial and should be preserved where possible.

Integrate furnaces into the factory grid.

---

## V1-077 — Production Chain

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Resources must be able to travel through an actual production network.

Target conceptual flow:

Miner
→ Conveyor
→ Processing Building(s)
→ Furnace
→ Cash / Output

Exact processing order is determined by player layout.

---

## V1-078 — Resource Entity / Factory Item Model

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Resources travelling through the grid must retain relevant data including:

* Resource type.
* Base value.
* Current modified value.
* Mutation data when implemented.
* Other future processing properties.

---

## V1-079 — Factory Throughput Handling

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** ⚪ NOT STARTED

Handle:

* Production speed.
* Processing speed.
* Congestion.
* Full outputs.
* Blocked machines.
* Invalid/disconnected chains.

---

# Furnaces

## V1-080 — Starter Furnace Modernization

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-023

Complete shared Reference E tier-1 behavior and permanent entity ownership. The prior Starter implementation is reusable but its old capacity is superseded.

**Acceptance:** Reference L checks 3, 16, 26.

---

## V1-081 — Furnace Tier Progression and Value

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-080, V1-050

Implement exact tiers 1–20 and price table/formulas; capacity 50T, value 1+0.25(T−1), exponential time and separate speed floor. T1/T2 manual, T3+ automatic. No resale.

**Acceptance:** Reference L checks 16–17.

Pure formulas are complete in V1-081A. The parent remains IN PROGRESS; the current Furnace prototype is not switched to these rules until its integration tickets are ready.

### V1-081A — Pure Furnace Tier, Capacity, Speed and Value Model

**Status:** ✅ COMPLETE (pure model only)
**Dependencies:** Reference E / Decision 20, V1-050A and V1-016 / V1-070 contracts; existing processed-value models

`FurnaceModel` in `ores.js` supplies:

- `getCapacity(tier)` / `getTierValueMultiplier(tier)`: integer tiers 1…20, capacity 50T and direct noncumulative value 1+0.25(T−1).
- `getRebirthValueMultiplier(valueLevel)`: integer 0…5000, multiplier 1+0.001L (max 6×).
- `calculateSaleValue(currentResourceValue,tier,valueLevel)`: supplied finite non-negative applicable raw/Polished/Refined value times the two Furnace multipliers, without display rounding. Reject overflow. No catalogue lookup, repeated Ore Value/processing modifier, historical Lot repricing, new Achievement/Milestone modifier or snapshot timing. An explicit Stone basis does not resolve K.4.
- `getNormalInterval(tier)` / `getFinalInterval(tier,speedLevel)`: exact full-precision seconds, max(1,10×0.1^((T−1)/19)), then max(0.5,normal×(1−0.01L)), integer Speed 0…50.
- `isAutoProcessingEligible(tier)`: false at T1/T2, true at T3…20; tier permission only, never changes saved preferences or starts processing.
- `getRawTierUpgradeCost(targetTier)` / `getTierUpgradePrice(targetTier,discountLevel)`: target 2…20, original $100 for T2 then 1000×4^(T−3). Reuse CashPricingModel category `furnaceTier` for Discount before Cash rounding. Free T1 is not a paid upgrade; no payment or investment ledger.

Furnace remains conceptually a permanent, unsellable singleton. These helpers do not allocate identity, implement ownership or apply Preservation/reset. K.5 Capacity perk and T1 timing remain open; no placeholder state is added.

Five deterministic regressions cover all formulas, speed floors, historical value precision, price bands, invalid inputs/overflow and unchanged saves/preferences/prototype behavior. Local verification: four syntax checks, 314 Node tests and all 12 existing browser smoke scenarios pass. Production saveVersion remains 1.

### V1-081B — Live Furnace Tier and Value Integration

**Status:** ⚪ NOT STARTED
**Dependencies:** V1-081A, V1-080, V1-050C; V1-070 lifecycle and V1-016 candidate contract; applicable T1 timing/value binding and V1-018 activation gates

Integrate quotes, affordability, atomic tier/Cash updates and value consumers with the permanent Furnace without an investment ledger. Preserve preferences and historical reservations; use tier permission without overriding autoEnabled. Coordinate manual/automatic processing and selection through V1-082–085, not from a pure formula call. V1-080, V1-082–085, V1-050C, V1-017 and V1-018 remain incomplete. No live processing, sale, upgrade, reservation, Rebirth or V2 migration is supplied by V1-081A.

---

## V1-082 — Auto Furnace Processing Integration

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-081, V1-041, V1-075A

Retain safe reservation/timestamp recovery; support raw/Polished/Refined cohorts, highest final value ordering and stable ore-ID/Refine-Count ties. Save active values and pay once after reload. No repeated offline simulation.

**Acceptance:** Reference L checks 16, 26.

---

## V1-083 — Furnace Capacity and Speed Perks

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE tier/speed; Rebirth Capacity perk DESIGN REQUIRED
**Dependencies:** V1-081, V1-172; K.5 for any capacity perk

Use Defined 50×tier capacity and speed formulas only. No independent Rebirth Capacity perk until owner confirms existence/effect/cap/price.

**Acceptance:** Reference L checks 16.

---

## V1-084 — Processing Presentation

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE necessary behavior
**Dependencies:** V1-074A, V1-075A, V1-082

Present independent active queues, reserved values, selected modes and progress without changing calculation ownership. Preserve manual/automatic activation gates.

**Acceptance:** Reference L checks 26.

---

## V1-085 — Furnace Regression Integration

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-080–084

Extend existing harness for all tier formulas, reservation/payout equivalence, processed-stack selection, manual gates and reload. Keep schema-1 historical fixtures meaningful.

**Acceptance:** Reference L checks 3, 16, 26.

---

# Factory expansion — design required

## V1-090 — Initial Factory Size

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

Define starting grid dimensions.

---

## V1-091 — Expansion Purchases

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define:

* Expansion cost.
* Expansion size.
* Progression requirements.
* Maximum V1 grid size if any.

---

## V1-092 — Expansion Implementation

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P2
**Status:** ⚪ NOT STARTED

Implement after design approval.

---

## V1-093 — Expansion Persistence

**Planning gate:** Detailed grid/transport/expansion behavior remains DESIGN REQUIRED where absent from the Bible. Run after machine contracts; numbers below identify scope, not execution order. Resale economics are now Defined in 3.8; spatial removal/relocation must not invent a refund or reserved-item policy.

**Priority:** P2
**Status:** ⚪ NOT STARTED

Factory dimensions must persist through saves.

---

# Factory XP and Level

## V1-100 — Factory XP Integration

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE except material XP recommendation
**Dependencies:** V1-021A, V1-031, V1-172

Reuse 100L² baseline; integrate defined resource/processing XP and gameplay perk, separate challenge XP without double multiplier. Retain total XP through Rebirth/migration. Material XP values require approval.

---

## V1-101 — Factory Level Derivation

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-021A, V1-100

Consistent floor(sqrt(totalXP/100)) without hard cap; next span 100(2L+1). V2 reconciles inconsistent historical level/XP while retaining total XP.

**Acceptance:** Reference L checks 1, 19, 25.

---

## V1-102 — Level Unlock Table

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define what unlocks at important Factory Levels.

---

## V1-103 — Level Rewards

**Priority:** P2
**Status:** 🟠 IN PROGRESS

Existing bonus functions must either be integrated into gameplay or removed if no longer intended.

Do not leave unused progression calculations.

---

## V1-104 — Level-Up Feedback

**Priority:** P3
**Status:** ⚪ NOT STARTED

Provide clear notification of:

* New level.
* New unlocks.
* New bonuses.

---

# Mutations — unresolved existing V1 backlog

## V1-110 — Mutation Specification

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define the complete V1 mutation system.

Specify:

* Mutation list.
* Mutation chances.
* Value effects.
* Production effects.
* Visual representation.
* Discovery rules.
* Stacking rules.
* Multiple mutation rules if applicable.

---

## V1-111 — Mutation Generation

**Priority:** P2
**Status:** ⚪ NOT STARTED

Implement approved mutation roll logic.

---

## V1-112 — Mutation Inventory Support

**Priority:** P2
**Status:** ⚪ NOT STARTED

Mutated resources must retain identity inside inventory.

---

## V1-113 — Mutation Factory Support

**Priority:** P2
**Status:** ⚪ NOT STARTED

Mutated resources must retain properties while travelling through machines.

---

## V1-114 — Mutation Furnace Support

**Priority:** P2
**Status:** ⚪ NOT STARTED

Final value calculation must correctly include mutations.

---

## V1-115 — Mutation Collection Support

**Priority:** P3
**Status:** ⚪ NOT STARTED

Track mutation discoveries.

---

## V1-116 — Mutation Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

Track relevant mutation statistics.

---

## V1-117 — Mutation Tests

**Priority:** P2
**Status:** ⚪ NOT STARTED

Test rarity, value, persistence and machine interactions.

---

# Collection

## V1-120 — Base Ore Collection

**Priority:** P3
**Status:** ✅ COMPLETE

Current ore discovery tracking works.

---

## V1-121 — Data-Driven Collection UI

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Generate entries from resource data rather than manually maintaining every ore entry where practical.

---

## V1-122 — Collection Completion Percentage

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-123 — Collection Entry Details

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Show useful discovered-resource information.

---

## V1-124 — Mutation Collection

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-125 — Collection Persistence

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Verify behaviour through saves and later Rebirth.

---

# Milestones

## V1-130 — 250 Milestone Thresholds

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-101; V1-016 milestone compatibility contract

Replace legacy threshold schedule with exact Reference G 250-entry catalogue/formula, end 10,000. Preserve legitimate earned/claimed historical progress during mapping; do not invent rewards or discard claims.

**Acceptance:** Reference L checks 24–25.

---

## V1-131 — Milestone Tracking and Reveal

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-130, V1-163

Track before reveal, reveal after first completed Rebirth and retain permanently. Separate UI disclosure from earned state.

**Acceptance:** Reference L checks 19, 24.

---

## V1-132 — Milestone Rewards

**Status:** ⚪ NOT STARTED
**Design:** DEFERRED — not current-phase implementation
**Dependencies:** Future owner-approved reward catalogue

Retain earned/claim infrastructure but do not invent reward amounts/types. Detailed reward implementation is deferred.

---

## V1-133 — Milestone Notifications

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Existing popup can be retained and improved.

---

# Achievements

## V1-140 — Achievement Compatibility and Reveal

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE retained infrastructure
**Dependencies:** V1-022; compatible persistence

Keep six IDs, unlocked/claimed state and existing meanings; reveal after first unlock and retain thereafter. Do not change manual-click counter meaning into resource quantity under existing IDs.

**Acceptance:** Reference L checks 19, 25.

---

## V1-141 — Additional Achievement Catalogue

**Status:** ⚪ NOT STARTED
**Design:** DEFERRED — not current-phase implementation
**Dependencies:** Future approved catalogue

Additional click-count/resource-count categories and entries remain deferred; direction is not a mandatory immediate entry count.

---

## V1-142 — Detailed Achievement Rewards

**Status:** ⚪ NOT STARTED
**Design:** DEFERRED — not current-phase implementation
**Dependencies:** Future approved rewards

Placeholder rewards are not approved zero rewards; do not implement speculative amounts.

---

## V1-143 — Permanent Achievement Reward Effects

**Status:** ⚪ NOT STARTED
**Design:** DEFERRED detailed effects; retain compatibility scaffolding
**Dependencies:** V1-142 when authorized

Preserve existing permanent effects/claims and no-repeat granting. Exact new stacking and effect catalogue requires future approval.

---

## V1-144 — Achievement Claim Compatibility

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE retained state; reward granting Deferred
**Dependencies:** V1-140; V1-142 only when rewards are approved

Preserve unlocked/claimed ordering and one-time semantics through migration/Rebirth. Do not require invented rewards to complete current claim-state compatibility; grant logic for new rewards waits on the deferred catalogue.

---

## V1-145 — Achievement Regression Tests

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

# Statistics and challenges

## V1-150 — Statistics Event Contract

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE
**Dependencies:** V1-016, Reference H

Replace the old narrow “complete” claim with full accepted catalogue ownership. Balances are separate from event counters; clicks distinct from output, materials from ores, processing from acquisition. Implement 151–156 alongside their event producers before challenges.

---

## V1-151 — Cash Earnings, Spending and Refunds

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-050, V1-023/071D

Record actual paid costs, separate refunds and challenge payouts; qualifying CashEarnedThisRebirth includes sale earnings, survives spending, resets on Rebirth.

---

## V1-152 — Resource and Processing Statistics

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-031, V1-074A, V1-075A, V1-082

Per-ID/tier/source manual/Miner acquisitions, materials, polished outputs, attempts/survivors/losses and raw/polished/refined sales. Keep legacy achievement counter meanings.

---

## V1-153 — Factory and Best-Tier Statistics

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE stated catalogue
**Dependencies:** V1-070, V1-150

Track accepted machine-tier personal bests and source events. Do not invent undefined conveyor efficiency statistics.

---

## V1-154 — Play Time and Cycle Statistics

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE; no offline simulation
**Dependencies:** V1-150

Lifetime and current-cycle play time, gameplay/challenge XP-earned counters distinct from permanent XP; no offline production inferred from elapsed timestamps.

---

## V1-155 — Rebirth and Currency History

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-160–165

Lifetime Rebirth durations/bases/rewards and Stardust source/spend history; persistent Gem Dust balance separate from lifetime/cycle earnings.

---

## V1-156 — Personal Best and Challenge Statistics

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-150–155, V1-157–159 integration

Retain highest Cash/Level/machine tiers, discoveries and Daily/Weekly completions/claims; never reset lifetime records with cycle counters.

---

## V1-157 — Daily and Weekly Objective Generation

**Status:** ⚪ NOT STARTED
**Design:** DESIGN REQUIRED for target rounding and destroyed-ore progress
**Dependencies:** V1-150–155, machine/manual capability calculations, K.1/K.3

3 Daily/7 Weekly, current capabilities only, no duplicate objectives, fixed requirements, manual 30-click/min fallback, 60% safety factor, minimum 1 and expected-output exclusion below 5. Use throughput/survival-adjusted processed outputs and defined Rebirth duration estimator; no invented target rounding.

**Acceptance:** Reference L checks 20–21.

---

## V1-158 — Challenge Claims and Rewards

**Status:** ⚪ NOT STARTED
**Design:** DESIGN REQUIRED for Cash/XP precision
**Dependencies:** V1-157, V1-151, V1-101, V1-162, K.3

Snapshot claim-time bases; exact per-set fractions, exclude challenge/refund earnings, no second XP multiplier. Weekly extra Stardust exactly one eligible objective, 100 minimum, floor, no gain multiplier. Atomically prevent repeat claims.

**Acceptance:** Reference L checks 20, 23, 26.

---

## V1-159 — UTC Resets and Challenge Persistence

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE reset rules; integrate after open claim/generation rules
**Dependencies:** V1-157–158, V1-163, compatible schema

Daily 00:01 UTC; Weekly Friday 17:00 UTC, no BST. Replace whole sets and expire unclaimed completed objectives; no player rerolls/immediate replacement. Rebirth preserves objectives/deadlines; mid-week first Rebirth changes eligibility only at next generation.

**Acceptance:** Reference L checks 22–23, 26.

---

# Rebirth

## V1-160 — Rebirth Eligibility and Reset Contract

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-150–155, V1-172 effects contract, Bible 3.17

Eligibility $1,000,000 current unspent Cash; Reference H payout/reset matrix. Separate actual permanent XP from cycle counters. Technical atomic reset contract must preserve already claimed rewards and supported persistent state.

**Acceptance:** Reference L checks 19.

---

## V1-161 — Rebirth Preview

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-160, V1-162

Show exact before-reset payout and reset/retention consequences; do not count historical spending as payout Cash.

---

## V1-162 — Rebirth Confirmation and Stardust Formula

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-160

Explicit confirmation; 10+5log2(max(1,Cash/1m)), gain multiplier, two-decimal payout calculated before reset. Never apply gain to Weekly Stardust.

**Acceptance:** Reference L checks 19, 23.

---

## V1-163 — Central Rebirth Reset and Retention

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-162, implemented inventory/machine/Shop/XP systems

Apply Reference H matrix once: reset Cash/cycle progress/raw+processed stock/reservations/normal upgrades/unlock and owned production machines; retain Pickaxe damage/history/materials/slots/XP/claims/discoveries/currencies/perks/lifetime state. Keep placed Furnace with Preservation tier. Challenge integration retains active state.

**Acceptance:** Reference L checks 19, 22, 26.

---

## V1-164 — Stardust Balance and Permanent Shop

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE except Recommended Discount price
**Dependencies:** V1-162, V1-170–172

Two-decimal Stardust balance; exact Defined per-level prices, no universal 400M cap. Exclude unapproved Discount pricing and unspecified Capacity perk.

---

## V1-165 — Rebirth Statistics Integration

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-163, V1-155

Record actual payout basis, duration and rewards without confusing cycle XP-earned counters with permanent Factory XP.

---

## V1-166 — Rebirth Regression Tests

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-160–165

Exercise reset matrix, repeated claims, reserved items, retained damage/slots/XP/collection and reload; no reset repair exploit.

**Acceptance:** Reference L checks 19, 22, 26.

---

# Permanent progression

## V1-170 — Permanent Perk Definitions

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE Defined rows; exclusions explicit
**Dependencies:** Reference J and K

Use exact table effects/caps/prices/totals for Defined perks. Freeze Preservation price version; no invented capacity perk. Factory Purchase Discount price remains Recommended.

---

## V1-171 — Permanent Shop Transactions

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE for Defined prices
**Dependencies:** V1-164, V1-170

Affordability/caps, correct owned-vs-purchased level and actual Stardust spend. Exclude Discount purchase until approved pricing; do not make all perks wait on that optional curve.

---

## V1-172 — Permanent Perk Calculations

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE effects; isolate unapproved purchase definitions
**Dependencies:** V1-170

Exact separate automated Luck, value, speed, dust, durability, XP, Stardust and Preservation effects. Apply Preservation on purchase/reset only; no free investment/no load-time retiering. Discount eligibility/effect Defined, price not.

**Acceptance:** Reference L checks 8, 12, 15–19.

---

## V1-173 — Permanent Perk System Integration

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE Defined effects
**Dependencies:** V1-172 and affected machine/manual systems

Apply each approved effect at its stated stage, with caps/rounding; no duplicate multipliers or unintended source crossover. Deferred Inscriptions remain 1×, not a feature.

---

## V1-174 — Permanent Progress Save Compatibility

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE; exact field contract before writes
**Dependencies:** V1-016/018, V1-171–173

Preserve actual purchases/currencies and bonuses; new schema transitions when required, never silently add incompatible shapes.

---

## V1-175 — Permanent Perk Regression Tests

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE Defined rules
**Dependencies:** V1-171–174

Test original price curves/rounding, effects, caps, frozen Preservation pricing, investment exclusion and persistence. Do not turn Recommended values into asserted canon.

---

# Offline progression — design required

## V1-180 — Offline Progress Specification

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define:

* Eligible systems.
* Offline efficiency.
* Time cap.
* Production calculation.
* XP behaviour.
* Mutation behaviour.
* Factory blockage behaviour.

---

## V1-181 — Last Active Timestamp

**Priority:** P2
**Status:** ⚪ NOT STARTED

---

## V1-182 — Offline Simulation

**Priority:** P2
**Status:** ⚪ NOT STARTED

Prefer calculation/simulation rather than attempting to replay every frame.

---

## V1-183 — Offline Return Summary

**Priority:** P3
**Status:** ⚪ NOT STARTED

Display what was earned while away.

---

## V1-184 — Offline Progress Tests

**Priority:** P2
**Status:** ⚪ NOT STARTED

---

# Notifications

## V1-190 — Discovery Notification

**Priority:** P3
**Status:** ✅ COMPLETE

---

## V1-191 — Achievement Notification

**Priority:** P3
**Status:** ✅ COMPLETE

---

## V1-192 — Milestone Notification

**Priority:** P3
**Status:** ✅ COMPLETE

---

## V1-193 — Level-Up Notification

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-194 — Unlock Notification

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-195 — Purchase Feedback

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-196 — Notification Queue

**Priority:** P3
**Status:** ⚪ NOT STARTED

Prevent simultaneous notifications from overlapping or becoming unreadable.

---

# Settings — unresolved catalogue

## V1-200 — Settings Framework

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-201 — Gameplay Settings

**Priority:** P4
**Status:** 🟣 DESIGN REQUIRED

---

## V1-202 — Visual/Performance Settings

**Priority:** P4
**Status:** 🟣 DESIGN REQUIRED

---

## V1-203 — Settings Persistence

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

# Developer tools

## V1-210 — Developer Mode

**Priority:** P2
**Status:** 🟠 IN PROGRESS

Current Reset Save control exists.

Expand development tools so systems can be tested quickly.

---

## V1-211 — Economy Controls

**Priority:** P2
**Status:** ⚪ NOT STARTED

Developer controls should allow authorised testing of:

* Cash.
* Factory XP.
* Factory Level.
* Rebirth currency once implemented.

---

## V1-212 — Resource Controls

**Priority:** P2
**Status:** ⚪ NOT STARTED

Allow:

* Granting resources.
* Forcing specific resource drops.
* Forcing rarity tiers.
* Forcing mutations after implementation.

---

## V1-213 — Progression Controls

**Priority:** P2
**Status:** ⚪ NOT STARTED

Allow jumping to important progression stages.

---

## V1-214 — Factory Debugging

**Priority:** P2
**Status:** ⚪ NOT STARTED

Display useful factory information such as:

* Tile coordinates.
* Building IDs.
* Resource state.
* Input/output direction.
* Throughput.
* Blocked states.

---

## V1-215 — Save Inspector

**Priority:** P2
**Status:** ⚪ NOT STARTED

Allow easy inspection of current save/state during development.

---

# Interface integration

## V1-220 — Main HUD

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-221 — Factory Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-222 — Building Selection Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-223 — Shop Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-224 — Inventory Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-225 — Collection Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-226 — Furnace Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-227 — Achievement Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-228 — Milestone Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-229 — Statistics Interface

**Priority:** P4
**Status:** 🟠 IN PROGRESS

---

## V1-230 — Rebirth Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-231 — Permanent Upgrade Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-232 — Settings Interface

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-233 — Responsive Layout

**Priority:** P4
**Status:** 🟠 IN PROGRESS

The existing responsive grid provides a foundation.

---

## V1-234 — Mobile Usability

**Priority:** P4
**Status:** ⚪ NOT STARTED

Verify factory placement and all major interfaces on smaller screens.

---

# Balance and simulation

## V1-240 — Progression Simulator

**Priority:** P4
**Status:** ⚪ NOT STARTED

Create tools capable of simulating progression without manually playing for long periods.

---

## V1-241 — Early Game Balance

**Priority:** P4
**Status:** ⚪ NOT STARTED

Review:

* First resource.
* First sale.
* First upgrade.
* First automation.
* Early Factory Levels.

---

## V1-242 — Mid-Game Balance

**Priority:** P4
**Status:** ⚪ NOT STARTED

Review:

* Factory growth.
* Building costs.
* Expansion.
* Resource progression.
* Mutation frequency.

---

## V1-243 — First Rebirth Balance

**Priority:** P4
**Status:** ⚪ NOT STARTED

Determine an appropriate progression curve once Rebirth is implemented.

---

## V1-244 — Post-Rebirth Balance

**Priority:** P4
**Status:** ⚪ NOT STARTED

Ensure permanent progression makes subsequent runs meaningfully faster without removing gameplay.

---

## V1-245 — Economy Exploit Review

**Priority:** P4
**Status:** ⚪ NOT STARTED

Identify unintended combinations that produce excessive or invalid progression.

---

# Performance and stability

## V1-250 — Factory Stress Testing

**Priority:** P4
**Status:** ⚪ NOT STARTED

Test large factories and high throughput.

---

## V1-251 — Inventory Stress Testing

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-252 — Long-Session Testing

**Priority:** P4
**Status:** ⚪ NOT STARTED

Test extended browser sessions.

---

## V1-253 — Save Stress Testing

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-254 — Large Number Testing

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-255 — Browser Compatibility

**Priority:** P4
**Status:** ⚪ NOT STARTED

Test current major desktop browsers.

---

## V1-256 — Error Logging

**Priority:** P4
**Status:** ⚪ NOT STARTED

Provide useful development diagnostics for unexpected errors.

---

# Release candidate

## V1-260 — Feature Freeze

**Priority:** P4
**Status:** ⚪ NOT STARTED

Once all V1 systems are implemented, stop introducing unrelated gameplay features.

Development should focus only on:

* Bugs.
* Balance.
* Performance.
* Usability.
* Documentation.

---

## V1-261 — Complete Fresh-Save Playthrough

**Priority:** P4
**Status:** ⚪ NOT STARTED

A tester must be able to progress from a completely new save through the complete Version 1.0 loop without developer tools.

---

## V1-262 — Multi-Rebirth Playthrough

**Priority:** P4
**Status:** ⚪ NOT STARTED

Verify progression remains functional through repeated Rebirths.

---

## V1-263 — Save Compatibility Test

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-264 — UI/UX Review

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-265 — Balance Review

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-266 — Performance Review

**Priority:** P4
**Status:** ⚪ NOT STARTED

---

## V1-267 — Game Bible Synchronisation

**Priority:** P4
**Status:** ⚪ NOT STARTED

Confirm every implemented Version 1.0 system is accurately documented.

---

# Closed testing

## V1-270 — Closed Tester Build

**Priority:** P4
**Status:** ⚪ NOT STARTED

Provide the game to a limited tester group.

---

## V1-271 — Bug Reporting Process

**Priority:** P4
**Status:** ⚪ NOT STARTED

Define a consistent way for testers to report:

* Bug.
* Severity.
* Reproduction steps.
* Expected behaviour.
* Actual behaviour.
* Save state where relevant.

---

## V1-272 — Progression Feedback

**Priority:** P4
**Status:** ⚪ NOT STARTED

Collect feedback on:

* Confusing progression.
* Slow sections.
* Overpowered strategies.
* Weak upgrades.
* Factory usability.
* Rebirth pacing.

---

## V1-273 — Critical Bug Resolution

**Priority:** P4
**Status:** ⚪ NOT STARTED

All critical and save-breaking issues must be fixed before public testing.

---

# Public testing

## V1-280 — Public Test Build

**Priority:** P4
**Status:** ⚪ NOT STARTED

Version 1.0 enters public testing only when:

* All P0 items are complete.
* All P1 items are complete.
* All required P2 systems are complete.
* No major gameplay system remains a placeholder.
* Saves are stable.
* Rebirth works.
* Factory production works.
* Major exploits have been addressed.
* The complete progression loop can be played from a fresh save.

---

# Release and execution rules

The complete V1 release is not certified by documentation or by the accepted persistence foundation. Final gates remain a complete opening, approved factory/grid/transport, integrated machines/Furnace, progression, save compatibility, UI, stability and bounded balance/playthrough review. Resolve remaining V1 scope/design decisions before feature freeze; deferred detailed rewards/inscriptions/future tiers are not current-phase acceptance requirements.

V1-267 remains the eventual release-wide Bible verification, not COMPLETE merely because this handoff synchronization is done. Read only relevant specifications/dependencies for each future ticket. Follow AGENTS.md; preserve working systems, add focused tests, stop at the ticket boundary and report unresolved design instead of inventing it.

## Verification commands

From repository root: `npm test` (four syntax checks and the established 222 Node regressions), then `npm run test:browser` with installed Playwright Chromium or the established local browser override. See [SAVE_VERSIONING.md](docs/SAVE_VERSIONING.md) for setup and CI details. GitHub Actions runs the actual suite for PRs targeting main and pushes to main. New gameplay tickets should add coverage for their Reference L checks rather than claiming the existing 222 tests certify the future design.
