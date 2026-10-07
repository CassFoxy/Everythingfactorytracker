# Everything Factory Incremental — Version 1.0 Development Roadmap

Updated 6 October 2026 after owner approval of the consolidated design handoff. The web implementation remains the reference for a later Luau port.

## Authority and status

Follow [AGENTS.md](AGENTS.md), then the owner-approved [handoff](docs/TEFI_Consolidated_Development_Specification.md), the synchronized [Game Bible](docs/GAME_BIBLE.md), this roadmap and existing implementation, in that order for this synchronization. The Bible carries canonical gameplay; the handoff remains a reference, not a replacement Bible.

Retain existing implementation statuses: **✅ COMPLETE** (implemented, tested and accepted for the named scope), **🟠 IN PROGRESS** (prototype/components exist, requirements remain), **⚪ NOT STARTED**, **🟣 DESIGN REQUIRED**, **🔵 REVIEW REQUIRED**. A separate **Design: DESIGN COMPLETE / READY** qualifier never marks implementation complete. **Design: DEFERRED** means excluded from the current implementation phase. **Recommended** values remain proposals.

V1-003, V1-010–015 and the V1-020 review are accepted. Newly Defined gameplay is not implemented merely by this synchronization. Legacy component completions cover only their named retained scope. Schema 1 remains active. No production changes or acceptance passes are claimed here.

## Dependency order and immediate boundary

Ticket numbers preserve history, not execution order. Complete one bounded child at a time; a parent is not permission for an entire architecture rewrite.

1. **V1-021A** fresh Cash/Level baseline only (implemented and tested; continue with the contract work in step 2).
2. V1-016 state/compatibility contract; V1-026 Default Pickaxe/access and V1-021B first-ever Stone; V1-050 price rules and V1-023 Starter sale. Agree incremental persistence boundaries before writing new fields.
3. V1-041 inventory contract, V1-028/029 manual quantity/material/Luck, V1-027 crafting/copies and V1-051/052 normal Shop; integrate V1-024 Mining Power I. Material XP recommendations and Stone Ore Value remain gated.
4. V1-070 machine lifecycle contract → V1-071A/B basic Miner → V1-017/018 complete safe V2 conversion/activation → V1-025 separate unlock/purchase → V1-071C/D individual Luck/resale. Do not expose partial V2 gameplay or ship compensation before K.2 is resolved.
5. V1-074A/B Polisher → V1-075A/B Refiner → V1-080–085 Furnace modernization, integrating independent reservations. Do not delay the opening Tier 1 sale until every later Furnace feature exists.
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

**Status:** ⚪ NOT STARTED
**Design:** Behavior Defined; unsupported compensation DESIGN REQUIRED
**Dependencies:** V1-014–015; References I/K

Define exact canonical instance fields and ownership for machines, slots, investments, reservations and newly implemented opening/manual state. Cover deterministic IDs, optional defaults, established unknown-data/recovery policy and V0→V1→V2. Do not activate V2 here. Specify a dependency-safe path for incremental opening fields; material shape changes require adjacent migration, not unversioned additions. Resolve K.2 before shipping compensation; do not reset existing progress. This contract is technical work, not permission to invent gameplay.

**Acceptance:** Reference L checks 25–27.

---

## V1-017 — Adjacent V1 to V2 Conversion

**Status:** ⚪ NOT STARTED
**Design:** DESIGN REQUIRED: Reference K.2 blocks complete migration
**Dependencies:** V1-016, owner-approved unsupported reconstruction policy, V1-070/041 runtime contracts

Convert legacy Dropper counts to ≤5 Miners, Adders to ≤3 Polishers and positive Multiplier ownership to one Refiner. Deterministic slot order/IDs, compatible record ranking, slot reconstruction, zero default local Ore Luck. Reconstruct before clamping; overflow half full investment, retained above-cap half lost investment, unsupported progress per approved policy; never double-compensate. Preserve XP, claims, milestones, discovery, statistics, unknown safe data and active Furnace reservations. No fake Version 2 without the actual instance transition.

**Acceptance:** Reference L checks 25–27.

---

## V1-018 — V2 Validation, Recovery and Runtime Activation

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE contract; depends on migration resolution
**Dependencies:** V1-017, compatible runtime consumers in V1-041/070/071A

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
**Design:** DESIGN COMPLETE; persistence contract prerequisite
**Dependencies:** V1-021A, V1-016 field contract and compatible activation path, V1-026

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

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-021A, V1-016 inventory/default contract

Infinite Default Pickaxe, source-specific accessible tiers, locked weights zero before Luck; default reaches T2. Establish the runtime boundary without implementing future tiers. Legacy mapping/defaults must be explicit before persisted additions.

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

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE behavior; technical field contract required
**Dependencies:** V1-016

Independent Pickaxe copies/materials and raw/Polished/Refined cohorts. Preserve resource identity, Refine Count and immutable value metadata; merge only compatible cohorts. Model reserved inputs separately from available stock. No mutations, capacity rules or future ore placeholders in this change.

**Acceptance:** Reference L checks 11–15, 26.

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
**Design:** DESIGN COMPLETE
**Dependencies:** Accepted tests; Reference E

Centralize original-formula → eligible discount → discounted-band half-up rounding. Never scale a previously rounded cost. Track actual Cash paid separately from refunds; retained free Preservation tiers add no investment. Do not implement Recommended Discount purchase pricing.

**Acceptance:** Reference L checks 17–18.

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

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE behavior; technical contract work
**Dependencies:** V1-016, V1-050

Define per-instance IDs/slots/tiers, independent upgrades/state/queues, creation/removal, investment and reservation boundaries. Separate simulator from DOM/grid. Reuse accepted save pipeline; no conveyor assumptions. This contract precedes concrete Miner/processor code and V2 activation.

**Acceptance:** Reference L checks 5, 18, 26.

---

## V1-071 — Miner System

**Status:** 🟠 IN PROGRESS
**Design:** DESIGN COMPLETE; legacy counter prototype only
**Dependencies:** Children 071A–D; V1-018/025 integration

Replace final-design ownership semantics through the planned V2 transition, not a production-field rename. Implement children as bounded tickets; source table entries and caps remain data-driven for future extension.

**Acceptance:** Reference L checks 5–8, 17–18, 26.

---

## V1-071A — Miner Slots, Entities and Purchases

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-070, V1-050, V1-016; activation with V1-018

Five slots: free / $10,000 / $1,000,000 / $10,000,000,000 / $1,000,000,000,000, retained after resale/Rebirth and not discounted. Separate unlock and $100 machine purchase; independent entities with tier/local level/state/investment. Enforce caps in handlers.

**Acceptance:** Reference L checks 4–6, 17, 26.

---

## V1-071B — Miner Tier Curve and Automated Distribution

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-071A, V1-030

Use every Reference B tier-1–25 table entry and original cost recurrence (Tier 6 ×7.5 only), interval/speed floors and one base output/cycle. T4 zero before Miner 6. Normalize ore columns around Stone anchor, apply Overall Luck, normalize and enforce Stone ≥25%. Do not activate future output duplication/tier 26+.

**Acceptance:** Reference L checks 5–8.

---

## V1-071C — Miner Luck and Individual Upgrades

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-071B, V1-050

Separate Overall Luck tier roll from within-tier Ore Luck. Local Ore Luck levels 0–50, own cost curve, no Discount; multiply with permanent Ore Luck and 1× deferred Inscription factor. Track actual local investment; no cross-Miner sharing or ownership-count Luck.

**Acceptance:** Reference L checks 5, 8, 17.

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

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-070, V1-041, V1-050, V1-018

Reference C raw-ore-only input, no Stone/repolishing; 1–10 tiers, exact time/capacity/value, partial batches, selected ore and independent queue/reservation state.

**Acceptance:** Reference L checks 14, 26.

---

## V1-074B — Polisher Slot Purchases, Upgrades and Resale

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-074A

Three slot-specific prices $5,000/$100,000/$2,000,000 independent of tier costs. Persistent slot identity; resale confirmation/refund on actual investment, return queued/unprocessed input once and retain polished output.

**Acceptance:** Reference L checks 14, 17–18, 26.

---

## V1-075 — Refiner System

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE processing; challenge wording separately Open
**Dependencies:** V1-075A/B

Legacy Multiplier ownership migrates to a Refiner; old duplication and compounding value are superseded. K.1 gates affected challenge progress, not the physical survivor/destruction rules.

**Acceptance:** Reference L checks 15, 17–18, 26.

---

## V1-075A — Refiner Processing and Gem Dust

**Status:** ⚪ NOT STARTED
**Design:** DESIGN COMPLETE
**Dependencies:** V1-074A, V1-041, V1-070, V1-018

One Refiner; polished or refined 1–14 inputs only. Reserve inputs, exact time/capacity/probability formulas, Dust roll/award before destruction, integer probabilistic yield; survivor count ≤15 and immutable pre-Refiner value. Separate metadata/cohorts and preserve Dust on destruction.

**Acceptance:** Reference L checks 15, 26.

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
