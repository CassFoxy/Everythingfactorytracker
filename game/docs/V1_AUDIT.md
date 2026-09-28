# TEFI V1 Repository Audit — 2026-09-28

Baseline: `6fa2effce60c62efbf254544e452f087e168d593` on `main`. Read-only audit completed before V1-010 edits. Compared all four runtime files with AGENTS.md, the complete Development Bible and all 168 roadmap tickets. Existing Bible source-audit notes describe prototype components, not V1 release certification.

## Overall finding

V1 is a functioning numerical prototype, not a release candidate. The required 2D tile factory, transport, mutations, rebirth, permanent progression and offline progression are absent or insufficiently specified. Working components should be retained. No whole-game completion percentage is meaningful while scope-defining decisions remain open.

## How to read this audit

The system table supplies existing behavior, missing work, affected files, downstream dependencies and readiness/design decisions. The ticket index gives every roadmap ticket an explicit status and links it to that system assessment. NOT STARTED child tickets may still be blocked by their group's DESIGN REQUIRED decisions. REVIEW REQUIRED means implementation exists but specification/verification needs resolution. COMPLETE is restricted to the named, narrow component and does not certify future grid integration.

File key: **G** = `game/game.js`; **O** = `game/ores.js`; **H** = `game/index.html`; **C** = `game/style.css`; **D** = `game/docs/` (Bible, audit, specifications/tests). `game/AGENTS.md` and `game/V1_ROADMAP.md` were inspected only. Tests/docs remain inside the permitted docs directory.

## System assessments

### Foundation

- **Status:** IN PROGRESS. **Tickets:** V1-001, V1-002, V1-003.
- **Exists:** Bible, roadmap and source review; globals and a resource catalogue.
- **Missing:** Document conflicts, extract deterministic logic in small tickets, establish broad regression coverage.
- **Files:** G/O/H/D.
- **Systems depending on it:** All future systems.
- **Immediate work / design gate:** Audit/tests can start; architecture incrementally after save hardening. No new gameplay design for extraction.

### Versioning

- **Status:** NOT STARTED. **Tickets:** V1-010.
- **Exists:** One unversioned localStorage object.
- **Missing:** Explicit schema identity and legacy compatibility.
- **Files:** G/D.
- **Systems depending on it:** All migrations and durable progress.
- **Immediate work / design gate:** Yes: additive integer schema 1; legacy absent/0. This is a technical format choice, independent of the Bible’s game/design/document versions.

### Validation

- **Status:** NOT STARTED. **Tickets:** V1-011.
- **Exists:** Partial nullish defaults; no complete validation.
- **Missing:** Validate types, finite numbers, ranges, item IDs, nested objects and cross-field consistency.
- **Files:** G/O/D.
- **Systems depending on it:** Recovery, migrations, all saved systems.
- **Immediate work / design gate:** Yes for established fields; preserve unknown fields and document policy. New-system fields await their specifications.

### Migration

- **Status:** IN PROGRESS. **Tickets:** V1-012.
- **Exists:** Ad hoc missing-field defaults and Boolean achievement conversion.
- **Missing:** Ordered, version-to-version migration registry, fixtures, failures and idempotence.
- **Files:** G/D.
- **Systems depending on it:** Schema consolidation, grid saves and later progression.
- **Immediate work / design gate:** After versioning and validation. No new gameplay design.

### Recovery

- **Status:** NOT STARTED. **Tickets:** V1-013.
- **Exists:** Malformed JSON aborts startup; no backup or recovery screen.
- **Missing:** Non-destructive backup/export/recovery path, storage failure handling and clear UI.
- **Files:** G/H/C/D.
- **Systems depending on it:** Every returning player; release stability.
- **Immediate work / design gate:** After version/validation foundation. Technical recovery flow can be designed without inventing rewards or resets; never auto-delete the original.

### Schema

- **Status:** IN PROGRESS. **Tickets:** V1-014.
- **Exists:** Flat cash/machine counters plus nested inventory, collection, bonuses, cosmetics, achievements and furnace batch.
- **Missing:** Canonical defaults and documented ownership; currently duplicated/derived fields can diverge.
- **Files:** G/O/D.
- **Systems depending on it:** Migration, grid persistence, rebirth.
- **Immediate work / design gate:** Document first; consolidate only through tested migrations. Future variant/reset schemas need design.

### Save tests

- **Status:** NOT STARTED. **Tickets:** V1-015.
- **Exists:** No checked-in test suite in the game tree.
- **Missing:** Round trips, malformed data, autosave, reset, legacy fixtures and future-version protection.
- **Files:** G/O/H/D.
- **Systems depending on it:** Every persistence change.
- **Immediate work / design gate:** Yes; focused version tests in this task do not finish comprehensive save testing.

### Opening

- **Status:** IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION. **Tickets:** V1-020, V1-023, V1-024, V1-025.
- **Exists:** Start at $100; $10 Dropper immediately purchasable; manual mining and furnace sale work.
- **Missing:** Earned first upgrade and automation sequence, guidance and clear sale feedback.
- **Files:** G/H/C/D.
- **Systems depending on it:** Early economy, first factory, balance.
- **Immediate work / design gate:** Review now. Starting cash, first upgrade and unlock conditions require owner decision; no rebalance.

### Base resources

- **Status:** REVIEW REQUIRED. **Tickets:** V1-021, V1-022, V1-030, V1-031.
- **Exists:** Manual mining, Stone plus 20 ores, four random tiers, inventory/XP/counters and first discovery.
- **Missing:** Reconcile availability and rarity wording; preserve current algorithm.
- **Files:** G/O/H/D.
- **Systems depending on it:** Economy, inventory, collection, machines and mutations.
- **Immediate work / design gate:** Tests/review can start. Section 3.12 gating conflicts with 4.1/code all available; tier odds are not individual-ore odds. No rarity/unlock changes without decision.

### Value pipeline

- **Status:** IN PROGRESS. **Tickets:** V1-032, V1-033.
- **Exists:** Base ore values, Stone value from Adders, cash/XP display helpers.
- **Missing:** Central value composition and consistent large-number display/limits.
- **Files:** G/O/H/D.
- **Systems depending on it:** Economy, all processors, mutations and permanent bonuses.
- **Immediate work / design gate:** Formatting review and baseline tests safe. Effect order/stacking and final bonuses require approved design.

### Inventory base/UI

- **Status:** IN PROGRESS. **Tickets:** V1-040, V1-043, V1-044.
- **Exists:** Per-resource quantity map, fixed HTML entries and value tooltips.
- **Missing:** Sorting/filtering and generated UI; reusable inventory operations.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** Furnaces, collection, mutations, factory inputs.
- **Immediate work / design gate:** Existing-resource rendering/refactor can start after tests; no need to change stacking or capacity.

### Inventory design

- **Status:** DESIGN REQUIRED. **Tickets:** V1-041, V1-042.
- **Exists:** Unlimited base-resource counts; no item-instance/variant identity.
- **Missing:** Variant equivalence, modified-value stacking, capacity/overflow and factory transfers.
- **Files:** G/O/H/D.
- **Systems depending on it:** Mutations, transport entities, furnace value preservation.
- **Immediate work / design gate:** No final model/capacity implementation until specified.

### Economy/shop

- **Status:** IN PROGRESS. **Tickets:** V1-050, V1-051, V1-052, V1-053.
- **Exists:** Cash sales and machine/furnace purchase handlers; scalable costs; unlocks hidden in UI.
- **Missing:** Central transactions, data-driven shop/upgrade definitions, unlock enforcement and purchase feedback.
- **Files:** G/H/C/D.
- **Systems depending on it:** Opening, expansions, rebirth and permanent shop.
- **Immediate work / design gate:** Infrastructure preserving known prices can start after saves/tests. New upgrades/prices/unlocks require specification.

### Grid foundation

- **Status:** NOT STARTED. **Tickets:** V1-060, V1-061, V1-062, V1-063, V1-064, V1-065, V1-067, V1-070.
- **Exists:** Only global machine counters/cards; no coordinates, occupancy or placed instances.
- **Missing:** Grid state, bounds, rendering, footprints, IDs, direction/rotation, placement/removal, connections and persistence.
- **Files:** G/H/C/D.
- **Systems depending on it:** All spatial machines, network, expansion, debug tools.
- **Immediate work / design gate:** A parameterised grid/data foundation is safe after tests/architecture. Player-facing placement awaits starting dimensions, footprints, orientation/port rules and removal/refund decisions; do not invent them.

### Relocation

- **Status:** DESIGN REQUIRED. **Tickets:** V1-066.
- **Exists:** No placed buildings or move action.
- **Missing:** Free move versus remove/rebuild; handling of in-flight resources and refunds.
- **Files:** G/H/D.
- **Systems depending on it:** Factory editing, save transitions.
- **Immediate work / design gate:** No: movement policy needs approval.

### Droppers

- **Status:** IN PROGRESS. **Tickets:** V1-071.
- **Exists:** Buy/scaled costs; each Dropper produces Stone each second with XP and optional duplication.
- **Missing:** Placeable instances, network output and blocked-output behavior.
- **Files:** G/O/H/D.
- **Systems depending on it:** Conveyors, factory throughput, production statistics.
- **Immediate work / design gate:** Regression tests and definitions safe. Grid/output integration depends on approved placement/transport rules.

### Transport

- **Status:** DESIGN REQUIRED. **Tickets:** V1-072, V1-073, V1-077, V1-078, V1-079.
- **Exists:** No moving resource entities, conveyors or network.
- **Missing:** Speed, spacing/capacity, turning, input/output arbitration, congestion/full outputs, entity identity and processing state.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** Final machines, network furnaces, offline simulation, throughput and balance.
- **Immediate work / design gate:** No gameplay implementation until transport rules and item model are approved. 73/77/78/79 have no implementation.

### Adders

- **Status:** DESIGN REQUIRED. **Tickets:** V1-074.
- **Exists:** Purchased count adds +1 Stone value each, calculated inside updateUI.
- **Missing:** Final affected property/resources, timing, amount, stacking, order and upgrades.
- **Files:** G/H/D.
- **Systems depending on it:** Value pipeline, factory processing and balance.
- **Immediate work / design gate:** No final behavior until approved; preserve prototype.

### Multipliers

- **Status:** DESIGN REQUIRED. **Tickets:** V1-075.
- **Exists:** Purchased count adds 0.1% duplication chance per Dropper-produced Stone, at most one extra item per check.
- **Missing:** Decide quantity/value effect, stacking/order, mutation interaction and upgrades.
- **Files:** G/H/D.
- **Systems depending on it:** Value pipeline, production network and balance.
- **Immediate work / design gate:** No final behavior until approved; preserve prototype.

### Furnaces

- **Status:** IN PROGRESS. **Tickets:** V1-076, V1-080, V1-081, V1-082, V1-083, V1-084, V1-085.
- **Exists:** Starter/Basic/Auto capacities 10/50/100; manual percentage/confirmation; 10s auto batch, modes, reserved items, saved batch/time and stop-after-current.
- **Missing:** Network integration, broader regressions, review pending manual smelt state and input ownership.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** First sale, economy, XP, machine network and mutation processing.
- **Immediate work / design gate:** Existing behavior tests safe; network integration waits for transport/variant design. Do not rewrite working furnace mechanics.

### Expansion

- **Status:** DESIGN REQUIRED. **Tickets:** V1-090, V1-091, V1-092, V1-093.
- **Exists:** No grid size or expansion data.
- **Missing:** Starting dimensions, increment size, cost, requirements/maximum and saved bounds.
- **Files:** G/H/D.
- **Systems depending on it:** Playable grid, placement limits, economy and progression.
- **Immediate work / design gate:** No player-facing expansion until dimensions/cost rules approved.

### XP/levels

- **Status:** IN PROGRESS. **Tickets:** V1-100, V1-101, V1-102, V1-103, V1-104.
- **Exists:** XP from mining/Stone/smelting; level floor(sqrt(XP/100)) min1; milestone checks; unused bonus helpers.
- **Missing:** Resolve XP0 fresh versus XP100 fallback, progress bar baseline, approved unlock table and bonus integration/feedback.
- **Files:** G/O/H/D.
- **Systems depending on it:** Unlocks, milestones, achievements, economy and rebirth.
- **Immediate work / design gate:** Current-formula tests safe. Starting convention and intended bonuses/unlocks need decision before gameplay change.

### Mutations

- **Status:** DESIGN REQUIRED. **Tickets:** V1-110, V1-111, V1-112, V1-113, V1-114, V1-115, V1-116, V1-117, V1-124.
- **Exists:** No mutation definitions/rolls/variants/persistence/UI.
- **Missing:** Eligibility, generation odds, stacking, effects/order, identity, value, discovery/stats and reset retention.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** Variant inventory, factory items, collection, furnaces and rebirth.
- **Immediate work / design gate:** No gameplay until V1-110 and item model approved. Child implementation tickets are not started.

### Collection

- **Status:** IN PROGRESS. **Tickets:** V1-120, V1-121, V1-122, V1-123, V1-125.
- **Exists:** 20-ore discovery counts and labels, discovered/20, tooltips; independent of spent inventory, saved.
- **Missing:** Generated display, percentage/details, mutation entries and confirmed permanent/rebirth behavior.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** Discovery rewards, achievements, completion goals and rebirth.
- **Immediate work / design gate:** Base UI/tests safe. Stone collection inclusion and reset retention must be resolved; no rebirth implementation.

### Milestones

- **Status:** IN PROGRESS. **Tickets:** V1-130, V1-131, V1-132, V1-133.
- **Exists:** 113 generated level thresholds, saved flags, list and last-pending popup.
- **Missing:** Reward definitions, scalable content/conditions and lossless multi-unlock feedback.
- **Files:** G/H/C/D.
- **Systems depending on it:** Long-term goals, notifications, progression and resets.
- **Immediate work / design gate:** Recognition/tests/queue safe. Rewards and retention need approved rules.

### Achievements

- **Status:** IN PROGRESS. **Tickets:** V1-140, V1-141, V1-142, V1-143, V1-144, V1-145.
- **Exists:** Six achievement definitions, saved unlock/claim state, progress display and toast; Boolean compatibility conversion.
- **Missing:** Real rewards, broader approved catalogue, permanent effects and regression coverage.
- **Files:** G/H/C/D.
- **Systems depending on it:** Progression, permanent bonuses and statistics.
- **Immediate work / design gate:** Framework/tests safe; rewards/bonus/reset rules require design. Claim currently grants nothing.

### Statistics

- **Status:** IN PROGRESS. **Tickets:** V1-150, V1-151, V1-152, V1-153, V1-154, V1-155, V1-156, V1-165.
- **Exists:** Total/Stone/tier counts, last ore/value and manual-mining/discovery/smelt achievement counters.
- **Missing:** Cash earned/spent, production/factory/playtime/rebirth/bests and precise lifetime/current-run semantics.
- **Files:** G/H/D.
- **Systems depending on it:** Achievements, balance simulations, rebirth and diagnostics.
- **Immediate work / design gate:** Existing counters and simple cash instrumentation after transaction centralisation safe. New metric definitions/reset scopes need decision; do not label manual-action count as all production.

### Rebirth

- **Status:** DESIGN REQUIRED. **Tickets:** V1-160, V1-161, V1-162, V1-163, V1-164, V1-166.
- **Exists:** No rebirth; developer reset is destructive save deletion only.
- **Missing:** Unlock, reward formula/currency, reset/retention matrix, preview/confirmation and central reset engine.
- **Files:** G/H/C/D.
- **Systems depending on it:** Permanent progression, repeat loop, stats, offline and release playthroughs.
- **Immediate work / design gate:** No until complete approved specification; child tickets not started.

### Permanent

- **Status:** DESIGN REQUIRED. **Tickets:** V1-170, V1-171, V1-172, V1-173, V1-174, V1-175.
- **Exists:** Saved bonus maps and accessor/multiplier helper scaffolding; no applied permanent progression.
- **Missing:** Upgrade catalogue/costs/currency, stacking/caps, purchase application, persistence/reset rules and UI.
- **Files:** G/H/C/D.
- **Systems depending on it:** Rebirth strength, economy, XP, mutations and balance.
- **Immediate work / design gate:** Tests can record current inert scaffold. No shop/effects until design approved.

### Offline

- **Status:** DESIGN REQUIRED. **Tickets:** V1-180, V1-181, V1-182, V1-183, V1-184.
- **Exists:** Active auto-furnace batch can finish after reload; no general offline simulation.
- **Missing:** Time source/limits, eligible systems, blocked-output treatment, efficiency/caps and return summary.
- **Files:** G/H/D.
- **Systems depending on it:** All automated production, economy, statistics and saves.
- **Immediate work / design gate:** No: one resumed batch is not a general offline system.

### Notifications

- **Status:** IN PROGRESS. **Tickets:** V1-190, V1-191, V1-192, V1-193, V1-194, V1-195, V1-196.
- **Exists:** Discovery modal, achievement toast, milestone popup; pending single slots overwrite earlier events.
- **Missing:** Queue/priority/deduplication, level/unlock/purchase feedback and presentation tests.
- **Files:** G/H/C/D.
- **Systems depending on it:** Progression clarity and purchase UX.
- **Immediate work / design gate:** Queue preserving existing content safe. New unlock/bonus notifications depend on those definitions.

### Settings

- **Status:** DESIGN REQUIRED. **Tickets:** V1-200, V1-201, V1-202, V1-203.
- **Exists:** Auto-furnace mode controls only; no general settings framework.
- **Missing:** Approved gameplay/visual/performance options, defaults and persistence.
- **Files:** G/H/C/D.
- **Systems depending on it:** Accessibility, performance and save schema.
- **Immediate work / design gate:** Container scaffolding possible after saves, but no invented options/default gameplay changes.

### Developer tools

- **Status:** IN PROGRESS. **Tickets:** V1-210, V1-211, V1-212, V1-213, V1-214, V1-215.
- **Exists:** Visible Reset Save button and confirmation; no isolated developer mode.
- **Missing:** Gated tools for cash/XP/resources/progression, grid inspection and save inspection.
- **Files:** G/H/C/D.
- **Systems depending on it:** Testing, balance and debugging.
- **Immediate work / design gate:** Save inspector and isolated controls for existing data can start after saves/tests; future-system controls wait for implementation.

### UI

- **Status:** IN PROGRESS. **Tickets:** V1-220, V1-221, V1-222, V1-223, V1-224, V1-225, V1-226, V1-227, V1-228, V1-229, V1-230, V1-231, V1-232, V1-233, V1-234.
- **Exists:** HUD/cards/modals with CSS auto-fit layout; furnace controls and catalogue hardcoding.
- **Missing:** Grid/selection/shop/rebirth/permanent/settings UIs, mobile/accessibility coverage and consistent generated lists.
- **Files:** G/H/C/D.
- **Systems depending on it:** Every player-facing system and release usability.
- **Immediate work / design gate:** Existing display cleanup/testing safe. Feature UIs depend on approved system design; absent viewport and fixed toast widths merit mobile review.

### Balance

- **Status:** NOT STARTED. **Tickets:** V1-240, V1-241, V1-242, V1-243, V1-244, V1-245.
- **Exists:** Current numerical constants exist; no simulator or documented full-loop validation.
- **Missing:** Deterministic simulation, opening/mid/rebirth/post-rebirth runs and exploit review.
- **Files:** G/O/D.
- **Systems depending on it:** Release quality and long-run progression.
- **Immediate work / design gate:** Baseline simulator/review safe after tests. No balance changes without approval; full loop blocked by unfinished designs.

### Quality

- **Status:** NOT STARTED. **Tickets:** V1-250, V1-251, V1-252, V1-253, V1-254, V1-255, V1-256.
- **Exists:** Browser prototype with no repeatable stress/compatibility suite or error logging.
- **Missing:** Grid/inventory/long-session/save/large-number stress and cross-browser checks.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** Release confidence and diagnostics.
- **Immediate work / design gate:** Existing-system tests safe now; grid stress waits for grid. Number formatting does not solve JS precision/overflow.

### Release

- **Status:** NOT STARTED. **Tickets:** V1-260, V1-261, V1-262, V1-263, V1-264, V1-265, V1-266, V1-267, V1-270, V1-271, V1-272, V1-273, V1-280.
- **Exists:** TEST VERSION page; unfinished game loop and known document drift.
- **Missing:** Feature freeze, full and multi-rebirth playthroughs, compatibility/UI/balance/perf reviews, Bible sync, closed feedback/build and public release gates.
- **Files:** G/O/H/C/D.
- **Systems depending on it:** V1 public test and later Luau port.
- **Immediate work / design gate:** Bug-report process and document review safe. Release/build certification waits for all core systems; this audit is not a launch approval.

## Specification conflicts and concrete defects

1. Bible 1.2 still describes current Roblox development. AGENTS and the updated roadmap explicitly establish the web reference and later Luau port.
2. Bible 3.12 implies gated resources; 4.1 and mineOre make all base ores available immediately. Preserve current rolls until reconciled.
3. Ore rarity metadata names tier odds. Each of five ores has an equal conditional draw, so individual probabilities differ by a factor of five. Do not silently rebalance.
4. Bible 4.1 includes Stone in collection completion; actual collection has only 20 ores. Decide intended completion scope.
5. The Bible's older audit “Roadmap drift” note refers to an earlier roadmap. Its uncertainty about web versus spatial factory is superseded by the new explicit web 2D grid decision. Other missing mechanics are not resolved by that decision.
6. Fresh save XP is 0, compatibility fallback is 100, level is clamped to 1 and the progress formula subtracts 100 without a lower clamp. Resolve the intended starting convention before changing progression.
7. First Swing checks manual actions, including non-Stone; First Smelt includes Stone. Claims mark achievement state but award no reward. Bonus functions are not wired into live calculations.
8. updateUI writes stoneValue, mixing gameplay and rendering. Purchases check affordability but do not enforce the UI's level gates in the transaction handlers. Centralise incrementally after tests.
9. Save defaults do not cover all core fields (cash and machine counters); nested invalid data and invalid furnace tiers can break startup. JSON/storage errors are unhandled. Several actions depend on the five-second autosave; no unload flush or transactional save boundary.
10. confirmSmelt does not revalidate pending inventory or clear the pending transaction. A stale confirmation after an auto batch has completed can consume resources already removed; repeated direct confirmation can also reuse state. This requires its own regression/fix, not a versioning rewrite.
11. Single pending achievement/milestone slots lose simultaneous notifications. Milestone notification tickets 133 and 192 duplicate different completion claims; queue coverage is needed before treating the overall subsystem as complete.
12. Large-number suffixes do not prevent floating-point overflow/precision loss; the beyond-largest-suffix fallback is effectively bypassed after a suffix is selected.

## Immediate safe P0 sequence

1. **V1-010 Save Versioning** — additive schema version; preserve legacy data and prevent future-version overwrites. No prerequisite gameplay design. Selected for this task.
2. **V1-011 Save Validation** — canonical defaults and validation for existing fields, documented non-destructive handling of invalid data.
3. **V1-012 Save Migration** — ordered migrations with legacy fixtures and explicit failure handling. Existing Boolean/default conversions are only a partial precursor.
4. **V1-013 Corrupted Save Recovery** — retain/export original bytes, provide clear recovery UI and handle storage failures.
5. **V1-014 Save Schema Consolidation** — only necessary cleanup, with migrations; avoid inventing future variant/reset schemas.
6. **V1-003 and V1-015 broader automated regression coverage** — focused tests accompany every prior change; the full framework/coverage remains its own ticket.
7. **V1-002 architecture work** — isolate state, pure calculations, transactions and rendering incrementally; parameterised grid foundation after that. Audit completion alone does not satisfy V1-002's modularity acceptance criteria.

Do not start transport gameplay, final Adders/Multipliers, mutations, rebirth, permanent progression or offline simulation until their identified specifications are complete. Tests preserving prototypes do not approve final designs.

## Per-ticket baseline status

The assessment column above is the detailed dependency/readiness report for each linked system. Differences from the roadmap include V1-010 (no version field exists), V1-012 (legacy conversions exist but no framework), and reward/placement tickets whose prose still requires design.

| Ticket | System / ticket | Audit status | Assessment |
|---|---|---|---|
| V1-001 | Development Bible Gap Audit | IN PROGRESS | [Foundation](#foundation) |
| V1-002 | Core Code Architecture Review | IN PROGRESS | [Foundation](#foundation) |
| V1-003 | Automated Test Framework | NOT STARTED | [Foundation](#foundation) |
| V1-010 | Save Versioning | NOT STARTED | [Versioning](#versioning) |
| V1-011 | Save Validation | NOT STARTED | [Validation](#validation) |
| V1-012 | Save Migration | IN PROGRESS | [Migration](#migration) |
| V1-013 | Corrupted Save Recovery | NOT STARTED | [Recovery](#recovery) |
| V1-014 | Save Schema Consolidation | IN PROGRESS | [Schema](#schema) |
| V1-015 | Save Regression Tests | NOT STARTED | [Save tests](#save-tests) |
| V1-020 | Fresh Save Progression Review | IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION | [Opening](#opening) |
| V1-021 | First Resource | COMPLETE | [Base resources](#base-resources) |
| V1-022 | First Discovery | COMPLETE | [Base resources](#base-resources) |
| V1-023 | First Sale | IN PROGRESS | [Opening](#opening) |
| V1-024 | First Upgrade | IN PROGRESS | [Opening](#opening) |
| V1-025 | First Automation Unlock | IN PROGRESS | [Opening](#opening) |
| V1-030 | Base Resource Catalogue | REVIEW REQUIRED | [Base resources](#base-resources) |
| V1-031 | Resource Generation | IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION | [Base resources](#base-resources) |
| V1-032 | Resource Value Calculation | IN PROGRESS | [Value pipeline](#value-pipeline) |
| V1-033 | Large Number Formatting | IN PROGRESS | [Value pipeline](#value-pipeline) |
| V1-040 | Basic Inventory | COMPLETE | [Inventory base/UI](#inventory-baseui) |
| V1-041 | Inventory Data Model Upgrade | DESIGN REQUIRED | [Inventory design](#inventory-design) |
| V1-042 | Inventory Capacity | DESIGN REQUIRED | [Inventory design](#inventory-design) |
| V1-043 | Inventory Sorting and Filtering | NOT STARTED | [Inventory base/UI](#inventory-baseui) |
| V1-044 | Inventory UI Generation | IN PROGRESS | [Inventory base/UI](#inventory-baseui) |
| V1-050 | Cash Economy | IN PROGRESS | [Economy/shop](#economyshop) |
| V1-051 | Shop Framework | NOT STARTED | [Economy/shop](#economyshop) |
| V1-052 | Upgrade Framework | IN PROGRESS | [Economy/shop](#economyshop) |
| V1-053 | Purchase Feedback | NOT STARTED | [Economy/shop](#economyshop) |
| V1-060 | Factory Grid | NOT STARTED | [Grid foundation](#grid-foundation) |
| V1-061 | Factory Grid Rendering | NOT STARTED | [Grid foundation](#grid-foundation) |
| V1-062 | Building Placement | DESIGN REQUIRED | [Grid foundation](#grid-foundation) |
| V1-063 | Placement Validation | DESIGN REQUIRED | [Grid foundation](#grid-foundation) |
| V1-064 | Building Rotation | DESIGN REQUIRED | [Grid foundation](#grid-foundation) |
| V1-065 | Building Removal | DESIGN REQUIRED | [Grid foundation](#grid-foundation) |
| V1-066 | Building Movement | DESIGN REQUIRED | [Relocation](#relocation) |
| V1-067 | Factory Save/Load | NOT STARTED | [Grid foundation](#grid-foundation) |
| V1-070 | Building Definition Framework | NOT STARTED | [Grid foundation](#grid-foundation) |
| V1-071 | Droppers | IN PROGRESS | [Droppers](#droppers) |
| V1-072 | Conveyors | DESIGN REQUIRED | [Transport](#transport) |
| V1-073 | Conveyor Simulation | NOT STARTED | [Transport](#transport) |
| V1-074 | Adders | DESIGN REQUIRED | [Adders](#adders) |
| V1-075 | Multipliers | DESIGN REQUIRED | [Multipliers](#multipliers) |
| V1-076 | Furnaces as Factory Buildings | IN PROGRESS | [Furnaces](#furnaces) |
| V1-077 | Production Chain | NOT STARTED | [Transport](#transport) |
| V1-078 | Resource Entity / Factory Item Model | DESIGN REQUIRED | [Transport](#transport) |
| V1-079 | Factory Throughput Handling | DESIGN REQUIRED | [Transport](#transport) |
| V1-080 | Starter Furnace | REVIEW REQUIRED | [Furnaces](#furnaces) |
| V1-081 | Basic Furnace | REVIEW REQUIRED | [Furnaces](#furnaces) |
| V1-082 | Auto Furnace | IN PROGRESS | [Furnaces](#furnaces) |
| V1-083 | Furnace Capacity | IN PROGRESS | [Furnaces](#furnaces) |
| V1-084 | Furnace Processing | IN PROGRESS | [Furnaces](#furnaces) |
| V1-085 | Furnace Regression Tests | NOT STARTED | [Furnaces](#furnaces) |
| V1-090 | Initial Factory Size | DESIGN REQUIRED | [Expansion](#expansion) |
| V1-091 | Expansion Purchases | DESIGN REQUIRED | [Expansion](#expansion) |
| V1-092 | Expansion Implementation | NOT STARTED | [Expansion](#expansion) |
| V1-093 | Expansion Persistence | NOT STARTED | [Expansion](#expansion) |
| V1-100 | Factory XP | IN PROGRESS | [XP/levels](#xplevels) |
| V1-101 | Factory Level Calculation | IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION | [XP/levels](#xplevels) |
| V1-102 | Level Unlock Table | DESIGN REQUIRED | [XP/levels](#xplevels) |
| V1-103 | Level Rewards | REVIEW REQUIRED | [XP/levels](#xplevels) |
| V1-104 | Level-Up Feedback | NOT STARTED | [XP/levels](#xplevels) |
| V1-110 | Mutation Specification | DESIGN REQUIRED | [Mutations](#mutations) |
| V1-111 | Mutation Generation | NOT STARTED | [Mutations](#mutations) |
| V1-112 | Mutation Inventory Support | NOT STARTED | [Mutations](#mutations) |
| V1-113 | Mutation Factory Support | NOT STARTED | [Mutations](#mutations) |
| V1-114 | Mutation Furnace Support | NOT STARTED | [Mutations](#mutations) |
| V1-115 | Mutation Collection Support | NOT STARTED | [Mutations](#mutations) |
| V1-116 | Mutation Statistics | NOT STARTED | [Mutations](#mutations) |
| V1-117 | Mutation Tests | NOT STARTED | [Mutations](#mutations) |
| V1-120 | Base Ore Collection | IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION | [Collection](#collection) |
| V1-121 | Data-Driven Collection UI | IN PROGRESS | [Collection](#collection) |
| V1-122 | Collection Completion Percentage | NOT STARTED | [Collection](#collection) |
| V1-123 | Collection Entry Details | IN PROGRESS | [Collection](#collection) |
| V1-124 | Mutation Collection | NOT STARTED | [Mutations](#mutations) |
| V1-125 | Collection Persistence | IN PROGRESS | [Collection](#collection) |
| V1-130 | Existing Level Milestones | IN PROGRESS | [Milestones](#milestones) |
| V1-131 | Milestone Framework | IN PROGRESS | [Milestones](#milestones) |
| V1-132 | Milestone Rewards | DESIGN REQUIRED | [Milestones](#milestones) |
| V1-133 | Milestone Notifications | IN PROGRESS | [Milestones](#milestones) |
| V1-140 | Achievement Framework | IN PROGRESS | [Achievements](#achievements) |
| V1-141 | Achievement Catalogue Expansion | IN PROGRESS | [Achievements](#achievements) |
| V1-142 | Achievement Rewards | DESIGN REQUIRED | [Achievements](#achievements) |
| V1-143 | Permanent Achievement Bonuses | DESIGN REQUIRED | [Achievements](#achievements) |
| V1-144 | Achievement Claiming | IN PROGRESS | [Achievements](#achievements) |
| V1-145 | Achievement Regression Tests | NOT STARTED | [Achievements](#achievements) |
| V1-150 | Existing Mining Statistics | REVIEW REQUIRED | [Statistics](#statistics) |
| V1-151 | Lifetime Cash Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-152 | Production Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-153 | Factory Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-154 | Playtime Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-155 | Rebirth Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-156 | Personal Bests | DESIGN REQUIRED | [Statistics](#statistics) |
| V1-160 | Rebirth Specification | DESIGN REQUIRED | [Rebirth](#rebirth) |
| V1-161 | Rebirth Preview | NOT STARTED | [Rebirth](#rebirth) |
| V1-162 | Rebirth Confirmation | NOT STARTED | [Rebirth](#rebirth) |
| V1-163 | Rebirth Reset Engine | NOT STARTED | [Rebirth](#rebirth) |
| V1-164 | Rebirth Currency | NOT STARTED | [Rebirth](#rebirth) |
| V1-165 | Rebirth Statistics | NOT STARTED | [Statistics](#statistics) |
| V1-166 | Rebirth Tests | NOT STARTED | [Rebirth](#rebirth) |
| V1-170 | Permanent Upgrade Specification | DESIGN REQUIRED | [Permanent](#permanent) |
| V1-171 | Permanent Upgrade Shop | NOT STARTED | [Permanent](#permanent) |
| V1-172 | Permanent Bonus Framework | IN PROGRESS | [Permanent](#permanent) |
| V1-173 | Permanent Bonus Integration | NOT STARTED | [Permanent](#permanent) |
| V1-174 | Permanent Progression Save Support | NOT STARTED | [Permanent](#permanent) |
| V1-175 | Permanent Progression Tests | NOT STARTED | [Permanent](#permanent) |
| V1-180 | Offline Progress Specification | DESIGN REQUIRED | [Offline](#offline) |
| V1-181 | Last Active Timestamp | NOT STARTED | [Offline](#offline) |
| V1-182 | Offline Simulation | NOT STARTED | [Offline](#offline) |
| V1-183 | Offline Return Summary | NOT STARTED | [Offline](#offline) |
| V1-184 | Offline Progress Tests | NOT STARTED | [Offline](#offline) |
| V1-190 | Discovery Notification | COMPLETE | [Notifications](#notifications) |
| V1-191 | Achievement Notification | REVIEW REQUIRED | [Notifications](#notifications) |
| V1-192 | Milestone Notification | REVIEW REQUIRED | [Notifications](#notifications) |
| V1-193 | Level-Up Notification | NOT STARTED | [Notifications](#notifications) |
| V1-194 | Unlock Notification | NOT STARTED | [Notifications](#notifications) |
| V1-195 | Purchase Feedback | NOT STARTED | [Notifications](#notifications) |
| V1-196 | Notification Queue | NOT STARTED | [Notifications](#notifications) |
| V1-200 | Settings Framework | NOT STARTED | [Settings](#settings) |
| V1-201 | Gameplay Settings | DESIGN REQUIRED | [Settings](#settings) |
| V1-202 | Visual/Performance Settings | DESIGN REQUIRED | [Settings](#settings) |
| V1-203 | Settings Persistence | NOT STARTED | [Settings](#settings) |
| V1-210 | Developer Mode | IN PROGRESS | [Developer tools](#developer-tools) |
| V1-211 | Economy Controls | NOT STARTED | [Developer tools](#developer-tools) |
| V1-212 | Resource Controls | NOT STARTED | [Developer tools](#developer-tools) |
| V1-213 | Progression Controls | NOT STARTED | [Developer tools](#developer-tools) |
| V1-214 | Factory Debugging | NOT STARTED | [Developer tools](#developer-tools) |
| V1-215 | Save Inspector | NOT STARTED | [Developer tools](#developer-tools) |
| V1-220 | Main HUD | IN PROGRESS | [UI](#ui) |
| V1-221 | Factory Interface | NOT STARTED | [UI](#ui) |
| V1-222 | Building Selection Interface | NOT STARTED | [UI](#ui) |
| V1-223 | Shop Interface | NOT STARTED | [UI](#ui) |
| V1-224 | Inventory Interface | IN PROGRESS | [UI](#ui) |
| V1-225 | Collection Interface | IN PROGRESS | [UI](#ui) |
| V1-226 | Furnace Interface | IN PROGRESS | [UI](#ui) |
| V1-227 | Achievement Interface | IN PROGRESS | [UI](#ui) |
| V1-228 | Milestone Interface | IN PROGRESS | [UI](#ui) |
| V1-229 | Statistics Interface | IN PROGRESS | [UI](#ui) |
| V1-230 | Rebirth Interface | NOT STARTED | [UI](#ui) |
| V1-231 | Permanent Upgrade Interface | NOT STARTED | [UI](#ui) |
| V1-232 | Settings Interface | NOT STARTED | [UI](#ui) |
| V1-233 | Responsive Layout | IN PROGRESS | [UI](#ui) |
| V1-234 | Mobile Usability | NOT STARTED | [UI](#ui) |
| V1-240 | Progression Simulator | NOT STARTED | [Balance](#balance) |
| V1-241 | Early Game Balance | NOT STARTED | [Balance](#balance) |
| V1-242 | Mid-Game Balance | NOT STARTED | [Balance](#balance) |
| V1-243 | First Rebirth Balance | NOT STARTED | [Balance](#balance) |
| V1-244 | Post-Rebirth Balance | NOT STARTED | [Balance](#balance) |
| V1-245 | Economy Exploit Review | NOT STARTED | [Balance](#balance) |
| V1-250 | Factory Stress Testing | NOT STARTED | [Quality](#quality) |
| V1-251 | Inventory Stress Testing | NOT STARTED | [Quality](#quality) |
| V1-252 | Long-Session Testing | NOT STARTED | [Quality](#quality) |
| V1-253 | Save Stress Testing | NOT STARTED | [Quality](#quality) |
| V1-254 | Large Number Testing | NOT STARTED | [Quality](#quality) |
| V1-255 | Browser Compatibility | NOT STARTED | [Quality](#quality) |
| V1-256 | Error Logging | NOT STARTED | [Quality](#quality) |
| V1-260 | Feature Freeze | NOT STARTED | [Release](#release) |
| V1-261 | Complete Fresh-Save Playthrough | NOT STARTED | [Release](#release) |
| V1-262 | Multi-Rebirth Playthrough | NOT STARTED | [Release](#release) |
| V1-263 | Save Compatibility Test | NOT STARTED | [Release](#release) |
| V1-264 | UI/UX Review | NOT STARTED | [Release](#release) |
| V1-265 | Balance Review | NOT STARTED | [Release](#release) |
| V1-266 | Performance Review | NOT STARTED | [Release](#release) |
| V1-267 | Game Bible Synchronisation | NOT STARTED | [Release](#release) |
| V1-270 | Closed Tester Build | NOT STARTED | [Release](#release) |
| V1-271 | Bug Reporting Process | NOT STARTED | [Release](#release) |
| V1-272 | Progression Feedback | NOT STARTED | [Release](#release) |
| V1-273 | Critical Bug Resolution | NOT STARTED | [Release](#release) |
| V1-280 | Public Test Build | NOT STARTED | [Release](#release) |

Baseline counts: 37 IN PROGRESS; 91 NOT STARTED; 4 IMPLEMENTED BUT CONFLICTS WITH DOCUMENTATION; 4 COMPLETE; 7 REVIEW REQUIRED; 25 DESIGN REQUIRED. These are ticket counts, not a completion percentage. COMPLETE rows are narrow current behaviors also checked by this task's post-edit regressions.

## Post-audit implementation result

V1-010 adds schema version 1 and legacy absent/0 compatibility. It rejects malformed roots/versions and future versions before gameplay timers; original stored data is retained. It does not provide full validation, a general migration registry or a recovery screen. Focused tests constitute partial progress toward V1-003/V1-015, not completion of those tickets. See SAVE_VERSIONING.md for the contract and validation commands.

Roadmap changes recommended, not applied: V1-010 -> COMPLETE following review of the tests; V1-001 -> COMPLETE for this documented gap-audit scope; V1-012 -> IN PROGRESS (existing legacy conversions, framework still missing). Leave V1-002 IN PROGRESS. V1-003/V1-015 now have initial focused coverage but remain IN PROGRESS, with broad acceptance still unmet. Reconcile other statuses using the table before claiming V1 readiness.

