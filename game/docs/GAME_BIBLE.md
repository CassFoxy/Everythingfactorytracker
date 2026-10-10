<!-- ========================================================================== -->
<!-- EVERYTHING FACTORY INCREMENTAL                                              -->
<!-- DEVELOPMENT BIBLE                                                           -->
<!-- FRAMEWORK VERSION 1.0.0                                                     -->
<!-- PART 1 - FRONT MATTER                                                       -->
<!-- ========================================================================== -->

# Everything Factory Incremental
## Development Bible

> **Document Status:** 🟡 Framework In Development
>
> **Framework Version:** 1.0.0
>
> **Development Bible Version:** 1.0.2
>
> **Game Version:** 0.1.0 Alpha
>
> **Specification Version:** 1.1.0
>
> **Repository:** [CassFoxy/Everythingfactorytracker](https://github.com/CassFoxy/Everythingfactorytracker)
>
> **Primary Branch:** `main`
>
> **Maintained By:** Project Development Team
>
> **Last Updated:** 2026-10-06
>
> **Document Type:** Engineering Specification & Development Handbook

---

# Current specification and implementation boundary

This revision synchronizes the owner-approved [6 October handoff](TEFI_Consolidated_Development_Specification.md). Its earlier “Bible updates pending approval” note is historical: synchronization is now authorized. The handoff is retained unchanged for provenance; this Bible is the canonical gameplay specification and the [roadmap](../V1_ROADMAP.md) is the implementation sequence. Follow [AGENTS.md](../AGENTS.md) first. For this synchronization the approved handoff supersedes conflicting older Bible, roadmap and prototype wording.

**Defined** means approved design, not implemented. **Recommended** remains a proposal. **Open** means DESIGN REQUIRED. **Deferred** excludes active implementation in the current phase. These states are independent of implementation status. Newly specified mechanics below are future requirements; this documentation change does not make their acceptance checks pass.

The reviewed V1-003 and V1-010–015 testing/persistence foundation is accepted; V1-020 review is accepted. Production still uses save schema **1**, counter-based legacy machines and the old opening. The planned instance schema is **2**; neither it nor the new balance is activated by this revision. The dated prototype register below is historical evidence only.

Canonical player-facing names are **Miner**, **Polisher**, **Refiner**. Dropper/Adder/Multiplier names are retained only in explicitly historical or migration descriptions; do not rename production fields in a documentation ticket.

## Canonical navigation

| Area | Canonical chapter / exact reference |
|---|---|
| Opening and disclosure | 2.1–2.5; 3.20 |
| Manual mining, Pickaxes and separate manual Luck | 3.3 / Reference A |
| Resources and materials | 3.4; 4.1 |
| Normal Shop and Cash rounding | 3.7 / Reference J; 3.8 / Reference E |
| Miner, Polisher, Refiner and Furnace | 3.8 / References B–E |
| XP; Milestones; Achievements | 3.13–3.15 / Reference G |
| Rebirth and permanent perks | 3.17 / Reference H reset matrix; Reference J perks |
| Statistics and challenges | 3.19 / Reference H; 3.23 / Reference F |
| Current persistence and planned V2 | 3.22 / Reference I; SAVE_VERSIONING.md |
| Unresolved, recommended and deferred | Reference K below |
| Future implementation acceptance | Reference L below; roadmap ticket mappings |

### Units and calculation conventions

- Cash and Stardust are different currencies. Global Cash price rounding does not apply to Stardust costs.
- Cost level L means the level being purchased, starting at 1. An upgrade's effect uses the owned level, starting at 0.
- T is a machine's resulting target tier; k is crafted Pickaxe tier, with Default at k=0.
- Formula probabilities use fractions: 25% = 0.25. Display percentages may be rounded.
- Keep Pickaxe Power and probability weights at full calculation precision. Resource, material and Gem Dust quantities are integers.
- For positive values, round means normal half-up rounding unless an explicit floor or ceil is specified.
- Compute each price independently from its original formula, apply eligible discount, then the specified Cash rounding. Never multiply a previous rounded purchase price.
- V1 maxima: 5 Miners, 3 Polishers, 1 Refiner and 1 permanent placed Furnace; Miner tier 25, Polisher/Refiner tier 10, Furnace tier 20; ore tiers T1–T4.
- The only Stone probability floor is the automated Miner floor of 25%.

## Reference K Open recommended and deferred decisions

### Open definitions

1. **Destroyed-ore challenge wording:** The principal rule is successful surviving passes only. The supplied exception about an already-completed destruction event could imply an additional path to progress. The last review recommended: count a pass only when its ore survives; a destruction event awards no progress. That final editorial clarification has not been explicitly accepted separately.
2. **Legacy reconstruction beyond current caps:** Specify the approved legacy-equivalent purchase and upgrade schedule for unsupported old tiers and overflow Polisher slots. Current tables end at the new caps; compensation cannot be invented from unavailable prices.
3. **Whole-item challenge targets and claim precision:** Target quantities must be integers, but the exact friendly-rounding procedure is not supplied. Cash/XP claim fractions likewise need the existing currency precision policy or an explicit rule; use exact fractions to calculate, not truncated display percentages.
4. **Stone and Ore Value:** Earlier wording says Ore Value affects ores. It does not explicitly decide whether the Stone resource receives that modifier.
5. **Rebirth Furnace Capacity:** An early mention exists without a final perk definition. Confirm whether it remains required or is superseded by the 50×tier capacity progression.

These entries isolate unresolved definitions rather than silently creating new game balance. They do not prevent work on separately authorized systems whose behavior is fully defined.

### Recommended values pending canon approval

- Material Factory XP: Wood 5, Scrap 15, Metal 50.
- Factory Purchase Discount price curve: 250,000 × 2^(L−1), total 255,750,000 Stardust.

### Deferred systems

- Machine Inscriptions and all active effects/costs/caps; placeholders remain 1×.
- New ore tiers T5–T10 and their values/rarities/unlock rows.
- Miner tiers above 25 and future machine types requiring absent systems.
- Additional Achievement entries and detailed reward balancing.
- Milestone reward types, amounts and balancing.

The threshold structure and existing Achievement infrastructure are not deferred merely because their rewards are.

### Other unresolved dependencies retained from the roadmap

The handoff does not settle starting grid dimensions, placement/removal versus resale, conveyor movement/routing/congestion, expansion prices, inventory capacity, mutations, offline simulation, remaining Factory Level unlock/reward tables, or settings. These remain DESIGN REQUIRED where needed; no generic example in older prose is approval. Deferred reward catalogues are not current-phase release gates. Resolve only the decisions required by the next bounded ticket.

Two compatibility/lifecycle details also need explicit resolution when their tickets are scoped: how retained legacy Milestone flags/claims map to the new 250 thresholds without losing progress; and what happens to a Refiner's reserved active inputs when it is sold. The handoff defines retention/refund principles but not these exact edge-case mappings. Do not choose a new gameplay outcome merely to finish migration or resale.

### Decision 19 — Machine Inscriptions

- **Which machines can be inscribed:** Deferred for the current phase. No active Inscription purchasing or bonuses are required. All Inscription multipliers are 1.

- **Which stats can be inscribed on Miners:** Deferred planning direction: Ore Luck and output.

- **Which stats can be inscribed on Polishers:** Deferred planning direction: capacity and polished value.

- **Which stats can be inscribed on Refiner:** Deferred planning direction: capacity and Dust yield.

- **Which stats can be inscribed on Furnace:** Deferred planning direction: capacity and sale value.

- **Gem Dust cost per Inscription level:** Deferred; no approved Gem Dust price catalogue.

- **Cost scaling:** Deferred; no approved cost curve.

- **Maximum levels:** Deferred; no approved level limits.

- **Caps:** Deferred. Any future system must respect ore locks, Refine 15, machine counts and established speed/probability caps.

- **Do Inscriptions survive Rebirth:** Deferred ownership plan: permanent slot records would survive Rebirth. Do not implement this merely because the placeholder multiplier exists.

- **Do Inscriptions survive selling a machine:** Deferred ownership plan: slot records would survive resale.

- **Are Inscriptions tied to the individual machine or globally unlocked:** Deferred planning direction: persistent machine slots rather than a global bonus. Exact catalogue/lifecycle remains future work.

## Reference L Acceptance checks for future development

These consolidate the original progression tests with the later owner decisions. This handoff does not claim that tests have run or passed.

1. Fresh state has $0, Level 0 / 0 XP, Default Pickaxe and one free Miner slot.
2. First manual click produces Stone with no material substitution; later clicks use accessible manual weights.
3. First Furnace sale grants Cash and removes the sold resources once.
4. Unlock Miner requires Mining Power I; buying the unlock and buying the Miner are separate transactions.
5. Miner ownership begins automation; each entity's tier, Ore Luck, interval, investment and state are independent.
6. Miner limits/slot prices and persistent purchased access are enforced; T4 cannot appear before Miner 6 even with extreme Luck.
7. Automated probability rows total 1 and Stone remains ≥0.25; manual probabilities have no artificial Stone floor.
8. Shop/manual, automated Overall Luck and automated Ore Luck affect only their stated rolls.
9. Mining Power fractional output is unbiased; material chance is once per click and materials cannot duplicate.
10. Power retains precision through ×1.75 tiers; Pickaxe Luck uses additive 2.5 per crafted tier.
11. One click consumes one durability; break/equip tie rules are deterministic.
12. Durability uses floored hundred-unit maxima; upgrades preserve damage on usable copies and never revive broken copies.
13. Repairs are broken-only, use ceil(95% recipe), and restore the current maximum; require all ingredients atomically.
14. Polisher rejects Stone/repolishing, processes partial batches and uses slot prices independently of tier upgrade costs.
15. Refiner input/count/value/roll order, Dust retention on destruction, 15-pass cap and integer expected Dust yield are respected.
16. Furnace capacity/value/exponential speed and manual/automatic tier gates use the final formulas.
17. All purchases calculate from original formulas; discount precedes eligible Cash rounding; local Ore Luck gets no discount.
18. Resale refunds half actual qualifying Cash paid, rounded down; preserved tiers and permanent perks do not create refundable Cash.
19. Rebirth computes Stardust before resetting Cash, preserves actual XP/Level/Pickaxes/materials/slots and applies the reset matrix.
20. Daily and Weekly sets use 3/7 counts, exact per-set reward fractions, claim-time snapshots and no payout inflation of qualifying earnings.
21. Challenge generation uses current capabilities, 30-click manual fallback, safety margin, no duplicate objectives and Refiner survival-adjusted output.
22. Scheduled resets expire all unclaimed objectives; Rebirth itself retains objective state.
23. Weekly Stardust has exactly one eligible extra-reward objective, requires a previous Rebirth at generation, floors reward with 100 minimum, and receives no Stardust Gain multiplier.
24. All 250 Milestones are unique and increasing, final threshold 10,000; claims and earned flags remain permanent.
25. V0/V1 migration to V2 preserves supported progress, applies deterministic conversion/compensation once and never re-runs on V2 reload.
26. Active reservations, cycles and payouts save/reload without loss, double production, duplicate timers or cross-machine state contamination.
27. Invalid/unsupported saves preserve original data for recovery rather than starting a fresh save silently.
28. A complete opening-to-upgrade-to-save/reload scenario follows the final progression order.

---

# Copyright & Usage

This Development Bible is the authoritative engineering specification for **Everything Factory Incremental**.

It defines every gameplay mechanic, progression system, balancing philosophy, implementation requirement, technical standard, design decision, and development process associated with the project.

This document shall always represent the current intended design of the game.

If any discrepancy exists between this document and the implementation, one of them is incorrect and must be updated until both accurately reflect the intended behaviour.

---

# Purpose

The purpose of this document is to provide sufficient information for an experienced software developer to understand, maintain, extend and continue development of Everything Factory Incremental without requiring assistance from the original project creator.

This document serves as the project's:

- Complete gameplay specification
- Technical reference
- Design reference
- Engineering specification
- Project handbook
- Development roadmap
- Historical decision log
- Quality assurance reference
- Long-term project memory

This document intentionally contains significantly more information than is required to play the game.

Its intended audience is the development team.

---

# Intended Audience

This manual is written for multiple audiences.

## Designers

Responsible for gameplay mechanics, balancing, progression and player experience.

---

## Programmers

Responsible for implementing systems described within this specification.

---

## Artists

Responsible for visual identity, user interface, animations, icons and assets.

---

## Quality Assurance

Responsible for validating that implementation matches the specification.

---

## Future Contributors

Responsible for continuing development after the original author.

---

## Project Owner

Responsible for maintaining the long-term vision of Everything Factory Incremental.

---

# Philosophy

The Development Bible follows one fundamental principle.

> **The Development Bible is the single authoritative source of truth for the project.**

Every gameplay mechanic.

Every balancing decision.

Every implementation requirement.

Every progression system.

Every technical standard.

Every future expansion.

Every design decision.

Every significant project discussion.

Shall ultimately be documented within this manual.

---

# Documentation Objectives

The Development Bible has been designed to satisfy the following objectives.

- Complete
- Accurate
- Searchable
- Consistent
- Self-Contained
- Progression-Based
- Easy to Maintain
- Easy to Extend
- Suitable for Long-Term Development

---

# Core Principles

## Principle 1

Assume no prior knowledge.

Every system shall be documented as though the reader has never encountered the project.

---

## Principle 2

Explain purpose before implementation.

Readers should understand why a system exists before learning how it functions.

---

## Principle 3

Progression before reference.

Gameplay systems shall be introduced in the same order they are encountered by the player.

---

## Principle 4

Consistency above convenience.

Every specification shall follow a consistent structure.

---

## Principle 5

Nothing undocumented.

Every implemented gameplay feature shall exist within this Development Bible.

---

## Principle 6

Documentation precedes implementation.

Major gameplay systems should be documented before implementation begins.

---

## Principle 7

Design decisions must be justified.

Where practical, significant design decisions shall include the reasoning behind the chosen solution.

---

# How To Use This Manual

This document has been written as a progression-based engineering specification.

It is not intended to be read alphabetically.

Readers unfamiliar with the project should begin at Volume I and continue sequentially.

Readers seeking information about a specific feature should use either:

- GitHub Search
- Markdown Search
- Master Index
- Entity IDs
- Cross References

---

# Reading Paths

## New Developer

Read sequentially from the beginning.

---

## Gameplay Designer

Volumes I–IV

---

## Programmer

Volumes I–V

---

## Artist

Volumes I, II, III and relevant Reference Library entries.

---

## QA Tester

Volumes III–VI

---

## Project Owner

Entire document.

---

# Documentation Status

| Status | Meaning |
|----------|----------|
| ⚪ | Specification Not Started |
| 🟡 | Designing / Planning |
| 🟠 | In Development |
| 🔵 | Under Review |
| 🟢 | Complete |
| 🔴 | Deprecated / Replaced |

---

> **Historical/migration evidence only.** The following snapshot predates accepted persistence/CI work and the 6 October design. Old machine names, probabilities, costs, XP defaults and missing-test statements below are not active design rules or a current audit. Use the canonical chapters and roadmap above.

<details>
<summary>Expand the dated prototype evidence and discrepancy record</summary>

# Historical prototype register — 2026-09-28

This review records what is present in the current HTML/CSS/JavaScript reference implementation. As specified in [game/AGENTS.md](../AGENTS.md), the Roblox Luau port follows completion and testing of the web V1.0.

**Reviewed branch:** `main` at [`c7fc8f8`](https://github.com/CassFoxy/Everythingfactorytracker/commit/c7fc8f820144030b0846dce80d55eaca3bc8a6e3).

**Evidence:**

- [`game.js`](https://github.com/CassFoxy/Everythingfactorytracker/blob/c7fc8f820144030b0846dce80d55eaca3bc8a6e3/game/game.js) — blob `ba05b67aff9d9f76aef17ae66a3035b492368817`.
- [`index.html`](https://github.com/CassFoxy/Everythingfactorytracker/blob/c7fc8f820144030b0846dce80d55eaca3bc8a6e3/game/index.html) — blob `52e4d8e50e42d5c462852d5c67643a5095a23cdc`.
- [`ores.js`](https://github.com/CassFoxy/Everythingfactorytracker/blob/c7fc8f820144030b0846dce80d55eaca3bc8a6e3/game/ores.js) — blob `ac7bd8ba4ee6f09f87abd2ce6b4801f993abcc10`.
- [`style.css`](https://github.com/CassFoxy/Everythingfactorytracker/blob/c7fc8f820144030b0846dce80d55eaca3bc8a6e3/game/style.css) — blob `7b29d45826849e96e540b3395a1209f4f8cc83b9`.

All four source files were reviewed alongside the complete Development Bible. Statuses are based on source inspection; this documentation review did not execute the game, perform balance simulations or certify release readiness.

## Implementation Status Definitions

| Status | Meaning |
|--------|---------|
| 🟢 Completed | The explicitly named feature has an end-to-end implementation in the current web code, including its player interaction or automatic execution path. This is an implementation assessment, not a claim of defect-free operation or completed launch testing. |
| 🟠 In Progress | A system has implemented components or code scaffolding, but identified behaviour, integration or reliability work remains. |
| ⚪ Not Started | No implementation of the named behaviour exists. A specification, comment, placeholder reward, unused save field or unrelated reset does not implement a playable system. |

Implementation status and documentation status are independent. The existing documentation lifecycle continues to describe specification maturity. A detailed design may describe a system whose implementation is Not Started; a working feature may have an unfinished catalogue entry.

The component table below credits the existing web features independently. Chapter-level implementation statuses assess the broader scope described in that chapter. For example, basic inventory is Completed, while the full Inventory System is In Progress because capacity and organisation are absent. Likewise, Dropper/Adder/Multiplier effects are Completed without implying that placed buildings or conveyors exist.

Planned examples and future-expansion lists are not automatically V1.0 requirements. Sections 1.7 and 1.8 retain responsibility for release scope. This review records discrepancies without approving new mechanics, changing formulas or replacing the intended design.

## Historical Implementation Register

| Feature or system | Implementation status | Bible reference | Code evidence | Implemented scope or remaining work |
|-------------------|-----------------------|-----------------|---------------|------------------------------------|
| Manual mining — current button interaction | 🟢 Completed | 3.3 | `mineOre()`; `mineButton` | Awards Stone or one ore, inventory, XP, manual-mining statistics and first-discovery feedback. World nodes and mining audiovisual effects are separate planned work. |
| Base resources and four-tier ore rolls | 🟢 Completed | 3.4; 4.1 | `ORES`, `STONE`, tier arrays; `mineOre()` | Stone plus 20 ores. Tier probabilities are 1/25, 1/1,000, 1/50,000 and 1/250,000; each tier then selects one of five ores uniformly. All ores are available from the start. |
| Basic stacked inventory | 🟢 Completed | 3.5 | `createDefaultInventory()`; `save.inventory`; `updateInventoryTooltip()` | Stores quantities for Stone and all ores, displays stack values and removes items during smelting. Capacity, sorting and variants are not included in this completed scope. |
| Cash earning and spending | 🟢 Completed | 3.6 | `save.cash`; `confirmSmelt()`; `finishAutoFurnaceCycle()`; purchase handlers | Smelting awards Cash and purchases deduct it. Additional currencies and income bonuses are not implemented. |
| Manual smelting | 🟢 Completed | 3.6; 3.8 | `buildFurnaceMenu()`; `prepareSmelt()`; `confirmSmelt()` | 25%, 50% and 100% stack selection, capped by furnace capacity, with confirmation and Cash/XP awards. Manual smelting is blocked while an automatic batch is processing. |
| Dropper production | 🟢 Completed | 3.8 | `getDropperCost()`; `produceStone()`; one-second interval | Each owned Dropper produces one Stone per tick. Ownership is a counter; no placed building or conveyor is involved. |
| Adder value effect | 🟢 Completed | 3.8 | `getAdderCost()`; `updateUI()`; smelting value paths | Stone value is `1 + adders`. Applies to Stone from either source when selected for smelting; it does not increase ore values. |
| Multiplier duplication effect | 🟢 Completed | 3.8 | `getMultiplierCost()`; `produceStone()` | Each automatically produced Stone gets one duplication check at `multipliers * 0.001`. Manual mining is unaffected; the current code can award at most one extra Stone per check. |
| Three-tier furnace upgrades | 🟢 Completed | 3.8; 4.3 | `FURNACES`; `upgradeFurnace()` | Starter, Basic and Auto Furnace capacities are 10, 50 and 100; upgrade costs are 500 and 2,500 Cash. |
| Auto Furnace batch processing and controls | 🟢 Completed | 3.10 | `getAutoFurnaceBatch()`; cycle functions; `updateAutoFurnaceUI()` | Ten-second batches, highest-value ores first, optional Stone filler, three resource modes, available/full batch modes, live batch/time/value displays, and stop-after-current-batch behaviour. |
| Active Auto Furnace batch persistence | 🟢 Completed | 3.10; 3.22 | `save.autoFurnaceBatch`; `save.autoFurnaceStartTime`; initialisation | Restores reserved items and the original timestamp. An elapsed saved batch can finish after loading. It does not simulate missed Dropper ticks or repeated offline batches. |
| Current purchase transactions | 🟢 Completed | 3.7 | `buyDropper`, `buyAdder`, `buyMultiplier`; `upgradeFurnace()` | Cash affordability checks, cost scaling, ownership updates and furnace progression are implemented. Generalised shop rules and failure feedback are separate unfinished work. |
| Ore discovery and basic Collection Book | 🟢 Completed | 3.12; 3.16 | `save.oreCollection`; `updateOreDisplay()`; `showDiscoveryPopup()` | Tracks cumulative acquisitions of 20 ores independently of spendable inventory; reveals unknown entries and displays discovered count. Stone is not a collection entry. |
| Base Factory XP awards | 🟢 Completed | 3.13 | `addFactoryXP()`; mining, production and smelting paths | Manual mining grants resource XP; produced Stone and duplicate Stone grant 1 XP each; smelting grants 1 XP per item. Bonus multipliers are not applied. |
| Factory Level milestones — tracking and menu | 🟢 Completed | 3.14 | `generateMilestones()`; `checkFactoryMilestones()`; `buildMilestonesMenu()` | Records 113 level thresholds through level 10,000 and shows locked/unlocked entries and completion count. Multi-unlock notification delivery remains unfinished. |
| Achievement condition and claim-state handling | 🟢 Completed | 3.15 | `ACHIEVEMENTS`; `checkAchievements()`; `unlockAchievement()`; `claimAchievement()` | Six achievements, statistic/level conditions, saved unlocked/claimed states, progress bars and claim ordering. Claiming currently changes state only. |
| Current resource statistics | 🟢 Completed | 3.19 | `save.totalOres`; Stone/tier counters; `achievementStats`; statistics modal | Tracks generated resources, last manually mined resource/value, manual actions, unique ore discoveries and items smelted. Broader lifetime metrics are separate work. |
| Core browser saving and autosave | 🟢 Completed | 3.22 | `saveGame()`; initial load; five-second save interval | Stores the save object under `ef_incremental`, restores normal saves and fills many missing fields. This does not certify malformed-save recovery. |
| Legacy achievement-save conversion | 🟢 Completed | 3.22 | Boolean conversion during save initialisation | Converts old Boolean achievement entries to unlocked/claimed objects. There is no general versioned migration system. |
| Save reset | 🟢 Completed | 3.22 | `resetSave()` | Asks for confirmation, removes the local save and reloads. This is a development reset, not rebirth. |
| Dashboard, modals and basic feedback | 🟢 Completed | 3.20 | `index.html`; modal functions; `style.css` | Existing game cards, inventory/collection/statistics/furnace/achievement/milestone views, XP bar, tooltips, discovery popup and achievement toast have code and UI. |
| Early resource-to-upgrade gameplay loop | 🟠 In Progress | 3.2 | Mining, furnace and purchase paths | The repeatable earning/upgrading loop exists. The full progression journey, factory layout and rebirth stages remain unfinished. |
| Shop organisation and progression rules | 🟠 In Progress | 3.7 | Purchase handlers; `updateUI()` | Dashboard purchases exist and Adder/Multiplier cards appear at levels 2/5. Requirements are not centrally defined; handlers check Cash but do not independently enforce those level gates. |
| Shared production-building framework | 🟠 In Progress | 3.8 | Ownership counters and `FURNACES` | Four building effects exist. Per-building instances, positions, connections and a common building lifecycle are absent. |
| Automation across the full factory design | 🟠 In Progress | 3.10 | One-second production loop; 100 ms furnace polling | Dropper-to-inventory-to-Auto-Furnace automation exists. Connected transport and multi-stage production networks are not started. |
| Factory Level calculation and display | 🟠 In Progress | 3.13 | `getXPForLevel()`; `updateFactoryLevel()`; XP-bar rendering | Level calculation, progress display and two UI unlocks exist. New saves start at 0 XP while Level 1's baseline is 100, producing a negative calculated initial bar width; level-bonus integration is absent. |
| Complete achievement reward flow | 🟠 In Progress | 3.15 | `ACHIEVEMENTS.reward`; `claimAchievement()` | Unlocking and claiming are implemented, but rewards use `type: null`, `value: 0`; the menu displays `???` and no reward is granted. |
| Permanent/cycle bonus infrastructure | 🟠 In Progress | 3.13; 3.15; 3.17 | `permanentBonuses`; `cycleBonuses`; multiplier helpers | Saved fields and calculation helpers exist. They do not provide an active reward/bonus system; production, luck, income, XP, capacity and speed integration remains absent. |
| Full inventory and collection presentation | 🟠 In Progress | 3.5; 3.16 | Fixed resource inventory and collection views | Basic views work. Inventory capacity/sorting, collection percentages/category summaries and variant tracking are absent. |
| Expanded player statistics | 🟠 In Progress | 3.19 | Current counters and statistics modal | Core resource counters exist; earnings, play time, session/personal-best breakdowns and rebirth history are absent. |
| Notification coordination | 🟠 In Progress | 3.21 | `pendingMilestone`; `pendingAchievement`; popup/toast functions | Three notification types exist. A single pending slot per type can lose individual notices when several unlock together; no priority or queue exists. |
| Save validation and compatibility | 🟠 In Progress | 3.22 | Initial `JSON.parse()`; nullish defaults; achievement conversion | Basic compatibility exists. No schema version, corrupt-save recovery or storage-error handling is present. |
| Large-number presentation | 🟠 In Progress | 3.20 | Formatting helpers; `LARGE_NUMBER_SUFFIXES` | Ordinary values, suffixes and Cash tooltips exist. The intended beyond-last-suffix scientific fallback is bypassed because a suffix remains selected; formatting does not extend JavaScript numeric precision. |
| Complete launch interface and onboarding | 🟠 In Progress | 2.1–2.11; 3.20 | Dashboard and modal controls | Existing controls support the prototype. Settings, remaining feature screens, onboarding and accessibility/device verification remain unfinished. |
| Cosmetic infrastructure | 🟠 In Progress | 1.8; 4.4 | `save.cosmetics` | Default unlock/equipment fields exist only; no cosmetic selection, earning or appearance application exists. Extensive cosmetics remain outside V1.0 scope. |
| Conveyors and resource routing | ⚪ Not Started | 1.7; 3.8–3.10 | No runtime implementation | No conveyor entities, movement or input/output routing. |
| Factory layout and building placement | ⚪ Not Started | 3.9 | No runtime implementation | No factory coordinates, placement, rotation, collisions, removal or relocation. The CSS card grid is interface layout only. |
| Factory expansion and construction capacity | ⚪ Not Started | 3.11 | No runtime implementation | Buying more counters is implemented; purchasing construction space or build capacity is not. |
| Mutations and resource variants | ⚪ Not Started | 1.7; 4.1 | No runtime implementation | No variant data, generation, effects, inventory representation or collection tracking. A furnace comment mentioning mutations is not an implementation. |
| Rebirth gameplay | ⚪ Not Started | 3.17 | No runtime implementation | No unlock, confirmation, reset/retention rules, reward calculation, rebirth count or shop. Bonus save fields do not implement rebirth. |
| Offline progression simulation | ⚪ Not Started | 3.18 | No runtime implementation | No last-session timestamp, elapsed-time production calculation, cap or return summary. Active furnace batch recovery is listed separately as completed. |
| Permanent achievement reward granting | ⚪ Not Started | 1.7; 3.15 | Placeholder reward objects only | No concrete rewards or grant/application logic; claim-state handling already exists. |
| Settings interface and persistence | ⚪ Not Started | 1.7; 3.20 | No runtime implementation | No player settings controls or settings model. |
| Inventory limits and storage upgrades | ⚪ Not Started | 3.5 | No runtime implementation | No enforced capacity, capacity display, full-inventory behaviour or storage upgrades. |
| Additional playable currencies | ⚪ Not Started | 4.2 | No runtime implementation | Cash is implemented; Gems, Stardust and Ancient Shards have no balances, earning/spending logic or UI. Catalogue names do not establish additional launch requirements. |
| Gameplay audio and world production animation | ⚪ Not Started | 2.1–2.11 | No runtime implementation | No sound playback, mining/world animation or moving factory resources. Existing CSS progress and toast effects are implemented separately. |
| Automated gameplay test suite | ⚪ Not Started | Volume V; Volume VI | No test files in the inspected game tree | No calculation, save, rebirth or economy tests. A roadmap checkbox is not evidence of implemented tests. |

## Design and Documentation Discrepancies

These observations record the current code and identify reconciliation work. They do not authorise gameplay changes.

- **Platform:** Section 1.2 describes current Roblox development; `game/AGENTS.md` and the code establish the web game as the current reference implementation and the Luau port as later work.
- **Resource availability:** Section 3.12 describes progression-gated resources, while section 4.1 and `mineOre()` make every base ore available from the beginning. Base discovery is implemented; progression-gated ore unlocks are not.
- **Rarity terminology:** The listed 1-in-N probabilities apply to selecting a tier. Each of five ores then has an equal chance within that tier, so individual ore probabilities are 1/125, 1/5,000, 1/250,000 and 1/1,250,000 respectively. The `rarity` field stores the tier denominator. Stone is available from the start but is not guaranteed on a manual roll.
- **Stone collection:** Stone is produced by both mining and Droppers and tracked in inventory/statistics. The Collection Book contains only the 20 ores. Section 4.1's Stone collection-completion statement does not match the code.
- **Achievement wording:** First Swing checks the manual-action counter and can unlock on a non-Stone result; First Smelt counts smelted items including Stone. Their labels are narrower than their implemented conditions.
- **Milestone/reward scope:** Level milestone recognition and achievement claiming already exist. Milestones grant no rewards, and achievement claims currently grant none. This does not make the recognition systems Not Started.
- **Starting XP:** New saves use 0 XP; missing-XP compatibility defaults use 100. The level is clamped to at least 1, but the progress-bar calculation subtracts a 100 XP baseline without clamping the lower bound.
- **Number formatting:** Display suffixes do not remove JavaScript numeric limits. In `formatLargeNumber()`, a selected suffix prevents the stated beyond-Centillion fallback from running for sufficiently large finite values.
- **Roadmap drift:** `game/V1_ROADMAP.md` leaves Adders, Multipliers, furnace progression, milestones and achievements unchecked despite existing implementations. It was inspected for context and remains unchanged; this register records current code evidence.
- **Specification gaps:** Mutation, rebirth reward/reset rules, the first end-game, and the division between the web factory and later spatial/Roblox presentation still need sufficiently precise design decisions. Existing examples do not supply those missing rules.

## Documentation and Release Verification

Volumes I–III contain substantial prose, but their existing review/acceptance states must not be upgraded solely because text exists. Volume IV sections 4.2–4.13 contain catalogue outlines rather than complete entries. Volumes V and VI and the appendices are predominantly reserved headings. An unwritten Save System chapter does not mean browser saving is absent.

No automated test files exist in the inspected `game/` tree. Balance, browser/device behaviour, save recovery and full new-save-to-end-game acceptance have not been certified by this review. These are verification tasks, not reasons to erase credit for implemented mechanics.

## Status Review History

| Bible revision | Date | Summary |
|----------------|------|---------|
| 1.0.1 | 2026-09-28 | Reviewed the complete Bible against the four runtime files; added implementation evidence and Completed/In Progress/Not Started statuses, separated specification maturity, and recorded unresolved discrepancies. Gameplay code, formulas and release scope were not changed. |

---


</details>

# Documentation Quality Standard

Every completed section shall satisfy the following criteria.

- Complete
- Correct
- Consistent
- Contextual
- Connected
- Maintainable
- Justified
- Testable

A section that does not satisfy every quality criterion shall not be considered complete.

---

# Document Maintenance

The Development Bible is a living document.

It shall evolve alongside the project throughout development.

Documentation shall be reviewed whenever:

- A gameplay mechanic changes
- A balancing decision changes
- A new feature is introduced
- Existing functionality is removed
- Technical implementation significantly changes
- Future development priorities change

---

# End of Framework Part 1

<!-- ========================================================================== -->
<!-- EVERYTHING FACTORY INCREMENTAL                                              -->
<!-- DEVELOPMENT BIBLE                                                           -->
<!-- FRAMEWORK VERSION 1.0.0                                                     -->
<!-- PART 2 - DOCUMENT STANDARDS & GOVERNANCE                                   -->
<!-- ========================================================================== -->

# Document Governance

The Development Bible is governed by a defined set of documentation standards.

These standards exist to ensure that every section of the document remains consistent regardless of when it was written or who authored it.

All contributors shall follow these standards when modifying or extending this document.

---

# Document Lifecycle

Every section of this Development Bible progresses through the following lifecycle.

| Status | Description |
|----------|-------------|
| ⚪ Not Started | Section reserved within the framework. No specification has been written. |
| 🟡 Designing | Design work has begun. Specification may be incomplete. |
| 🟠 In Development | Specification is actively being written or revised. |
| 🔵 Under Review | Specification is considered complete and awaiting validation. |
| 🟢 Complete | Specification has been reviewed and accepted as the current authoritative design. |
| 🔴 Deprecated | Specification has been superseded by a newer implementation and retained only for historical reference. |

---

# Versioning

Three independent version numbers shall be maintained throughout development.

## Game Version

Represents the playable version of Everything Factory Incremental.

Example:

0.1.0 Alpha

0.4.3 Beta

1.0 Release

---

## Development Bible Version

Represents revisions made to this document.

Examples include:

• Additional documentation

• Improved explanations

• New diagrams

• Updated cross references

• Corrected terminology

Changes to the Development Bible do not necessarily indicate changes to gameplay.

---

## Specification Version

Represents intentional changes to the game's design.

Whenever gameplay behaviour changes, the Specification Version shall also change.

Examples include:

• New mechanics

• Balance changes

• System redesigns

• New progression

• New currencies

• New buildings

---

# Requirement Language

The following terminology shall be used throughout the Development Bible.

## MUST

Mandatory behaviour.

The implementation is considered incorrect if this requirement is not satisfied.

---

## MUST NOT

Behaviour that is prohibited.

---

## SHOULD

Strong recommendation.

Alternative implementations may exist but require documented justification.

---

## SHOULD NOT

Generally discouraged.

Exceptions shall be documented.

---

## MAY

Optional behaviour.

No requirement exists to implement this feature.

---

## WILL

Used only to describe confirmed future implementation.

---

## RESERVED

Section intentionally exists within the framework but has not yet been specified.

---

# Writing Standards

All documentation shall follow the following writing standards.

## Tone

Professional.

Objective.

Technical.

---

## Perspective

Third person.

Never first person.

Never conversational.

---

## Terminology

Consistent throughout the document.

Avoid synonyms where one defined term already exists.

---

## Language

British English.

---

## Formatting

Markdown.

GitHub compatible.

Readable in plain text.

---

## Assumptions

None.

Every concept shall be introduced before use.

---

## Self-Contained Documentation

Every major section of the Development Bible shall be understandable in isolation.

A reader should be able to navigate directly to any chapter and understand the purpose, design, implementation and reasoning behind the documented feature without needing to read large portions of the document beforehand.

Important information may therefore be intentionally repeated throughout the Development Bible where doing so improves clarity and understanding.

Cross references should still be provided where appropriate, but they should supplement the documentation rather than replace essential explanations.

This Development Bible prioritises understanding over minimising repetition.

---

## Redundancy Over Ambiguity

When choosing between repeating important information or requiring the reader to search elsewhere within the document, repetition shall be preferred.

The Development Bible is intended to be a complete engineering specification rather than a concise reference manual.

Important concepts, design reasoning and gameplay context may therefore appear in multiple locations where they improve the reader's understanding.

The objective is not to minimise document length.

The objective is to maximise clarity, maintainability and long-term usability.

---

## Assume Zero Prior Knowledge

Every section should be written as though the reader has never seen the project before.

No feature, mechanic, formula or design decision should rely upon undocumented knowledge.

Where additional context improves understanding, it should be included even if that information is available elsewhere within the Development Bible.

A contributor should never need to contact the original developer to understand how or why a system exists.

---

# Section Numbering

Every section shall use hierarchical numbering.

Example:

1

1.1

1.1.1

1.1.2

2

2.1

2.1.1

The numbering system shall remain stable throughout the lifetime of the project.

---

# Entity IDs

Every significant gameplay entity shall receive a permanent Entity ID.

Entity IDs shall never change, even if the entity moves within the document.

Entity IDs shall remain unique.

---

## Entity Prefixes

| Prefix | Entity |
|----------|--------|
| SYS | Gameplay System |
| ORE | Ore |
| GEM | Gem |
| CUR | Currency |
| BLD | Building |
| MAC | Machine |
| UPG | Upgrade |
| ACH | Achievement |
| MIL | Milestone |
| MUT | Mutation |
| UI | User Interface |
| SFX | Sound Effect |
| MUS | Music |
| NPC | Non-Player Character |
| EVT | Event |
| REF | Reference Entry |
| DEV | Development Section |
| TECH | Technical Section |

Example IDs:

ORE-001

BLD-001

SYS-001

ACH-001

---

# Cross References

Cross references shall be used whenever one section depends upon another.

Cross references should reference:

• Section Number

• Entity ID

• Entity Name

Example

See Section 3.4

See ORE-001 (Stone)

See SYS-004 (Inventory)

Cross references shall be updated whenever documentation changes.

---

# Reserved Sections

Reserved sections intentionally exist before content has been written.

Reserved sections shall contain only:

• Section Heading

• Status

• Entity ID

• Revision Number

• Reserved Notice

No partial specifications shall exist.

---

# Definition of Complete

A section shall only be marked as 🟢 Complete when every applicable criterion has been satisfied.

Minimum completion criteria include:

☐ Purpose documented

☐ Summary documented

☐ Gameplay specification complete

☐ Design rationale documented

☐ Technical notes documented

☐ Related systems documented

☐ Cross references added

☐ Acceptance criteria completed

☐ Testing considerations documented

☐ Future considerations documented

☐ Revision history updated

☐ Status reviewed

---

# Maintenance Protocol

Whenever a gameplay feature changes, documentation shall be updated in the following order.

1. Update the Specification.

2. Update Design Rationale if required.

3. Update Technical Notes.

4. Update Related Systems.

5. Update Cross References.

6. Update Acceptance Criteria.

7. Update Revision History.

8. Update Decision Log.

9. Update Roadmap if required.

10. Review Document Status.

Documentation shall always reflect the current intended implementation.

---

# Documentation Workflow

Every new gameplay feature shall follow the workflow below.

Idea

↓

Design

↓

Specification

↓

Review

↓

Implementation

↓

Testing

↓

Documentation Review

↓

Release

No feature shall be considered complete until the corresponding documentation has also reached 🟢 Complete status.

---

# Change Management

All meaningful changes shall be recorded.

The following sections shall be updated where applicable.

• Revision History

• Decision Log

• Changelog

• Roadmap

• Related Systems

• Future Considerations

This ensures that the historical reasoning behind every major design decision is preserved.

---

# End of Framework Part 2

<!-- ========================================================================== -->
<!-- EVERYTHING FACTORY INCREMENTAL                                              -->
<!-- DEVELOPMENT BIBLE                                                           -->
<!-- FRAMEWORK VERSION 1.0.0                                                     -->
<!-- PART 3 - DOCUMENT STRUCTURE                                                 -->
<!-- ========================================================================== -->

# Development Bible Structure

The Development Bible is divided into a series of Volumes.

Each Volume documents a different aspect of the project.

Volumes shall remain in the order defined below throughout the lifetime of the project.

Gameplay content shall always be documented in progression order.

Development information shall always be documented after the gameplay specification.

---

# Volume I - Project Foundation

> [!IMPORTANT]
>
> **Volume Status:** 🟠 In Development
>
> **Volume Purpose:** Define the vision, philosophy, identity and long-term direction of Everything Factory Incremental.
>
> **Target Audience:** All contributors.
>
> **Prerequisites:** None.
>
> **Estimated Reading Time:** 20–30 Minutes.

---

# Overview

Volume I establishes the conceptual foundation of Everything Factory Incremental.

Before implementing gameplay systems, balancing mechanics, technical architecture or user interface elements, every contributor should understand the project's vision, design philosophy and intended player experience.

The purpose of this volume is to ensure that all future development aligns with a shared understanding of what Everything Factory Incremental is trying to achieve.

Every major gameplay mechanic documented elsewhere within this Development Bible should support the principles defined throughout this volume.

This volume should be read in its entirety before contributing to any other area of the project.

---

# Objectives

Upon completing this volume the reader should understand:

- The overall vision of Everything Factory Incremental.
- The purpose of the project.
- The intended player experience.
- The design philosophy guiding development.
- The development philosophy used throughout the project.
- The scope of the initial release.
- Which features are intentionally excluded from Version 1.0.

---

# Volume Structure

| Section | Documentation status | Purpose |
|---------|----------------------|---------|
| **1.1 Game Vision** | 🟠 In Development | Defines the long-term vision and identity of the game. |
| **1.2 Project Overview** | 🟠 In Development | Provides a concise overview of the entire project. |
| **1.3 Design Philosophy** | 🟠 In Development | Defines the principles used when designing gameplay systems. |
| **1.4 Development Philosophy** | 🟠 In Development | Defines the principles used while developing the project. |
| **1.5 Player Experience Goals** | 🟠 In Development | Describes how the player should feel throughout progression. |
| **1.6 Documentation Standards** | 🟠 In Development | References the documentation standards established within the framework. |
| **1.7 Project Scope** | 🟠 In Development | Defines the intended scope of Version 1.0. |
| **1.8 Out of Scope Features** | 🟠 In Development | Lists features intentionally excluded from Version 1.0. |

---

# Dependencies

Volume I has no prerequisites.

Every subsequent volume within the Development Bible should reference the principles established here where appropriate.

---

# Completion Criteria

Volume I shall be considered complete once:

- All sections have been documented.
- Every design principle has been reviewed.
- The long-term vision has been approved.
- The intended player experience has been clearly defined.
- The Version 1.0 scope has been established.
- All contributors agree that the documented vision accurately represents the intended direction of the project.

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial creation of Volume I framework. |

---

## 1.1 Game Vision

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-001
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Entire Project
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the long-term vision for Everything Factory Incremental.

Every gameplay mechanic, progression system, balancing decision, user interface element and future update should support the vision established within this chapter.

If a future feature conflicts with this vision, the feature should be redesigned or rejected.

---

# Vision Statement

Everything Factory Incremental is designed to appear simple at first glance while continuously revealing new mechanics, systems and progression as the player advances.

The objective is not simply to create another incremental game, but to create a long-term experience where curiosity, experimentation and optimisation are rewarded just as much as progression.

Every session should provide the player with meaningful progress, while always presenting another objective to pursue.

---

# Project Vision

The project aims to become a continually expanding incremental game capable of supporting years of future development without losing its original identity.

Version 1.0 represents the foundation of this journey rather than its conclusion.

Every new system should naturally build upon existing mechanics instead of replacing them.

The game should grow wider as well as deeper, ensuring players always have meaningful choices rather than following a single linear progression path.

---

# Core Vision

The player should begin with an experience that feels familiar and approachable.

As progression continues, the player gradually discovers increasingly complex mechanics, hidden interactions, optimisation opportunities and collection systems.

The game should consistently reward curiosity.

Players who experiment should discover strategies, efficiencies and mechanics that are not immediately obvious.

The feeling of discovering "just one more thing" should continue throughout the lifetime of the game.

---

# Core Design Pillars

Every major design decision should support one or more of the following principles.

## Simplicity Creates Accessibility

The game should be easy to begin.

Players should never feel overwhelmed during their first session.

Complexity should emerge naturally through progression rather than being introduced immediately.

---

## Discovery Creates Engagement

Players should regularly unlock new mechanics rather than repeatedly interacting with identical gameplay loops.

Every major milestone should introduce either:

- A new mechanic.
- A new decision.
- A new optimisation opportunity.
- A new collection objective.
- A new long-term goal.

---

## Progression Creates Motivation

Players should always feel that meaningful progress is being made.

Progress should never rely solely upon increasing numerical values.

New gameplay opportunities should accompany numerical progression wherever possible.

---

## Every System Has Purpose

No mechanic should exist simply to increase playtime.

Every feature introduced into the game should contribute towards:

- Progression
- Optimisation
- Player choice
- Long-term goals
- Collection
- Discovery

---

## Expand, Don't Replace

New content should build upon existing systems rather than making them obsolete.

Earlier mechanics should continue providing value throughout progression.

The player's factory should grow rather than restart from nothing whenever possible.

---

# Player Fantasy

The player is not simply clicking for resources.

The player is constructing, expanding and continuously improving an increasingly efficient factory.

Every upgrade, unlock and discovery contributes towards creating a larger, more capable and more rewarding production system.

The player should gradually transform from manually gathering resources into managing a highly optimised automated factory.

---

# Intended Player Experience

Throughout progression the player should experience:

- Curiosity.
- Discovery.
- Satisfaction.
- Achievement.
- Optimisation.
- Collection.
- Long-term progression.
- Continuous improvement.

Completing one objective should naturally reveal the next.

The player should rarely feel that there is nothing meaningful left to achieve.

---

# Target Audience

Everything Factory Incremental is designed to appeal to a broad audience.

The game should be approachable for casual players while providing sufficient depth for players who enjoy optimisation, completion, collection and long-term progression.

No single playstyle should be considered the "correct" way to experience the game.

---

# Long-Term Vision

Everything Factory Incremental is intended to remain expandable throughout its lifetime.

Future updates should introduce meaningful mechanics, new progression systems and additional content while preserving the identity established within this Development Bible.

The project should evolve through expansion rather than redesign.

---

# Success Criteria

The project will be considered successful if players:

- Enjoy the journey rather than focusing solely on the destination.
- Feel rewarded for experimentation.
- Frequently discover new mechanics.
- Return regularly to continue progressing.
- Remember the milestones they achieved.
- Become excited for future updates.

---

# Vision Summary

Everything Factory Incremental is intended to become an incremental game that rewards curiosity, experimentation and long-term progression.

While the core gameplay begins with familiar incremental mechanics, the experience should continually expand through meaningful systems, rewarding discoveries and satisfying optimisation.

Every mechanic should have purpose.

Every progression step should feel worthwhile.

Every update should expand the world rather than replace it.

The ultimate goal is to create a game that remains enjoyable not because players are forced to continue playing, but because they genuinely want to discover what comes next.

---

# Related Sections

- 1.2 Project Overview
- 1.3 Design Philosophy
- 1.5 Player Experience Goals
- Volume II – Player Journey

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Game Vision created. |
---

## 1.2 Project Overview

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-002
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Entire Project
>
> **Last Updated:** Initial Revision

---

# Purpose

This section provides a high-level overview of Everything Factory Incremental.

It introduces the game's primary gameplay loop, progression structure, target audience and defining characteristics without detailing the implementation of individual systems.

The purpose of this section is to ensure that any contributor can quickly understand what the project is attempting to achieve before reading the more detailed specifications found elsewhere within this Development Bible.

---

# Overview

Everything Factory Incremental is a progression-based factory building and incremental game developed first as an HTML/CSS/JavaScript web reference, with a later Roblox Luau port.

The player begins with almost nothing and gradually builds an increasingly efficient production factory through exploration, optimisation and automation.

While the game initially presents itself as a familiar incremental experience, its long-term design focuses on continually introducing new mechanics, meaningful progression systems and opportunities for discovery.

The game is designed to remain approachable for new players while providing enough depth to reward long-term engagement and experimentation.

---

# Core Gameplay Loop

The core gameplay loop follows a continuous cycle of progression.

```text
Gather Resources

↓

Earn Currency

↓

Purchase Upgrades

↓

Expand Factory

↓

Unlock New Systems

↓

Optimise Production

↓

Reach New Milestones

↓

Discover Additional Content

↓

Repeat with Greater Efficiency
```

Each iteration of the loop should introduce either:

- A new gameplay mechanic.
- A meaningful upgrade.
- A strategic decision.
- A new optimisation opportunity.
- A long-term objective.

The player should never feel as though they are repeating the exact same gameplay indefinitely.

---

# Game Structure

Everything Factory Incremental is structured around multiple interconnected systems that gradually unlock throughout progression.

Examples include:

- Manual resource gathering.
- Automated production.
- Factory expansion.
- Ore discovery.
- Collection logging.
- Achievements.
- Milestones.
- Factory Levels.
- Mutations.
- Rebirth progression.
- Future expansion systems.

Each system contributes towards the player's overall progression and should remain relevant throughout the game.

---

# Progression Philosophy

Progression is designed to expand in multiple directions rather than following a single linear path.

As the player advances, they should gain access to:

- New mechanics.
- Additional optimisation opportunities.
- Collection goals.
- Factory upgrades.
- Long-term progression systems.
- Optional objectives.
- Strategic choices.

The game should reward exploration and experimentation alongside numerical growth.

---

# Core Gameplay Themes

Everything Factory Incremental is built around several recurring themes.

## Discovery

Players should regularly encounter new mechanics, features and objectives.

---

## Automation

Manual actions should gradually transition into automated systems.

Automation should enhance gameplay rather than remove player decision-making.

---

## Optimisation

Players should continually discover more efficient ways to build and improve their factories.

Meaningful optimisation should remain valuable throughout the game.

---

## Collection

Players should be encouraged to discover, collect and complete long-term objectives.

Collection systems should reward dedication without becoming mandatory for progression.

---

## Long-Term Growth

The game should continually provide meaningful objectives that encourage players to return.

Progression should feel infinite without becoming repetitive.

---

# Target Experience

The intended player experience combines accessibility with long-term depth.

New players should quickly understand the core mechanics.

Experienced players should discover increasingly complex interactions, optimisation strategies and progression systems over time.

The game should remain enjoyable whether played in short sessions or over hundreds of hours.

---

# What Makes Everything Factory Incremental Different

Everything Factory Incremental is not intended to rely solely upon increasing numbers.

Instead, progression is driven through the gradual introduction of meaningful gameplay systems.

Players are rewarded for:

- Experimentation.
- Discovery.
- Planning.
- Optimisation.
- Long-term progression.
- Completing collections.
- Mastering interconnected systems.

The project is designed to continually evolve through future updates while preserving the identity established within this Development Bible.

---

# Long-Term Project Direction

Everything Factory Incremental is intended to become a continuously expanding platform rather than a game with a fixed ending.

Each major update should introduce meaningful additions that build upon existing systems.

Future content should increase the depth of the game while preserving compatibility with previous progression wherever practical.

The long-term objective is to create a project capable of growing for many years without requiring fundamental redesigns.

---

# Summary

Everything Factory Incremental is a progression-focused factory building game that combines automation, optimisation, collection and discovery into a continually expanding gameplay experience.

Although the game begins with simple mechanics, its long-term identity is defined by meaningful progression, interconnected systems and rewarding exploration.

Every gameplay system documented throughout this Development Bible should contribute towards creating an experience that remains engaging for both new and returning players.

---

# Related Sections

- 1.1 Game Vision
- 1.3 Design Philosophy
- Volume II – Player Journey
- Volume III – Gameplay Specification

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Project Overview created. |

---

## 1.3 Design Philosophy

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-003
>
> **Priority:** 🔴 Critical
>
> **Applies To:** All Gameplay Systems
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the core design principles that govern every gameplay mechanic within Everything Factory Incremental.

These principles are intended to guide all future design decisions and ensure that the game maintains a consistent identity throughout its lifetime.

Every new feature should be evaluated against these principles before implementation.

If a feature conflicts with the philosophy defined within this section, it should be redesigned or rejected.

---

# Philosophy Overview

Everything Factory Incremental is designed around the belief that players should remain engaged through meaningful progression, discovery and decision-making rather than repetition alone.

The objective is not simply to make numbers increase.

The objective is to create a game where every milestone introduces something interesting, every system has purpose and every update expands the overall experience.

---

# Core Design Principles

## 1. Every System Must Have a Purpose

No gameplay system should exist solely to increase playtime.

Every feature introduced into the game must contribute towards at least one of the following:

- Progression
- Discovery
- Optimisation
- Collection
- Player Choice
- Long-Term Engagement

If a system does not provide meaningful value, it should not be added.

---

## 2. Progression Before Complexity

The player should never feel overwhelmed.

Complexity should emerge gradually through progression.

Every new mechanic should build naturally upon mechanics the player already understands.

The game should teach through gameplay rather than lengthy tutorials.

---

## 3. Discovery Should Be Continuous

Players should regularly discover:

- New mechanics
- New resources
- New upgrades
- New optimisation opportunities
- Hidden interactions
- Collection goals

The feeling of "there is always something else to unlock" should remain throughout progression.

---

## 4. Expand Rather Than Replace

New mechanics should expand existing gameplay instead of making earlier systems obsolete.

Whenever possible:

- Earlier buildings should remain useful.
- Earlier upgrades should retain value.
- Earlier resources should continue serving a purpose.
- Previous knowledge should remain relevant.

Progression should feel cumulative.

---

## 5. Reward Optimisation

Players who experiment with layouts, upgrade paths and strategies should be rewarded.

There should rarely be a single perfect solution.

Instead, players should have opportunities to improve efficiency through thoughtful decision-making.

---

## 6. Every Unlock Should Feel Meaningful

Unlocks should represent more than larger numbers.

Whenever possible, an unlock should provide one or more of the following:

- A new gameplay mechanic.
- A new strategic choice.
- A new optimisation opportunity.
- A new collection objective.
- A new way to interact with the factory.

Players should look forward to unlocking new content.

---

## 7. Respect the Player's Time

Progress should feel meaningful regardless of session length.

Short play sessions should provide visible progress.

Long play sessions should reward planning, optimisation and persistence rather than unnecessary repetition.

Idle progression should support active gameplay, not replace it.

---

## 8. Encourage Multiple Playstyles

Players should be free to enjoy the game in different ways.

Examples include:

- Optimising factory layouts.
- Completing every collection.
- Unlocking achievements.
- Chasing rare mutations.
- Speeding through progression.
- Playing casually.

No single playstyle should be mandatory.

---

## 9. Design for Longevity

Every major gameplay system should be designed with future expansion in mind.

Systems should be modular wherever practical.

Future updates should build upon existing mechanics instead of requiring complete redesigns.

The game should remain maintainable as its content grows.

---

## 10. Make Goals Visible

Players should always have a meaningful objective.

Whether immediate or long-term, the game should clearly communicate opportunities for progression.

The player should rarely reach a point where they feel uncertain about what to work towards next.

---

## 11. Celebrate Achievement

Major accomplishments should feel rewarding.

The game should acknowledge player milestones through:

- Unlocks
- Visual feedback
- Achievements
- Collection progress
- Statistics
- Milestones

Players should remember what they have achieved, not simply how large their numbers became.

---

## 12. Build Depth Through Interconnection

The strongest gameplay experiences emerge when systems interact.

Whenever practical, new mechanics should connect with existing ones rather than functioning independently.

Examples include:

- Mutations affecting production.
- Achievements influencing progression.
- Collection systems unlocking rewards.
- Factory Levels enhancing automation.

Interconnected systems create more meaningful decisions and increase replayability.

---

# Design Decision Checklist

Before introducing a new gameplay feature, consider the following questions.

- Does it introduce meaningful gameplay?
- Does it support at least one core design principle?
- Does it create interesting decisions?
- Does it encourage discovery?
- Does it avoid unnecessary complexity?
- Does it remain valuable throughout progression?
- Does it integrate with existing systems?
- Can it support future expansion?

If the answer to multiple questions is "No", the feature should be reconsidered.

---

# Success Criteria

A successful gameplay system should:

- Be easy to understand.
- Be enjoyable to use.
- Reward experimentation.
- Support long-term progression.
- Integrate naturally with other systems.
- Feel worthwhile to unlock.
- Remain relevant as the player progresses.

---

# Summary

The design philosophy of Everything Factory Incremental is centred around meaningful progression, rewarding discovery and long-term engagement.

Rather than relying solely on increasing numerical values, the game aims to create a constantly evolving experience where every mechanic contributes towards a richer and more interconnected gameplay loop.

These principles should guide every future design decision made throughout the lifetime of the project.

---

# Related Sections

- 1.1 Game Vision
- 1.2 Project Overview
- 1.4 Development Philosophy
- 1.5 Player Experience Goals
- Volume III – Gameplay Specification

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Design Philosophy created. |

---

## 1.4 Development Philosophy

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-004
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Entire Development Process
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the principles that guide the development of Everything Factory Incremental.

While the Design Philosophy defines how the game should be designed, the Development Philosophy defines how the project itself should be built, maintained and expanded.

These principles exist to ensure the project remains scalable, maintainable and enjoyable to develop over the long term.

---

# Philosophy Overview

Everything Factory Incremental is intended to be a long-term project rather than a one-time release.

Development should prioritise quality, maintainability and scalability over short-term speed.

The goal is to build a project that can continue expanding for years without requiring significant rewrites or redesigns.

---

# Core Development Principles

## 1. Foundations Before Features

Core systems should always be completed before large amounts of content are added.

A stable foundation reduces technical debt and makes future development significantly easier.

---

## 2. Documentation First

Major systems should be documented within the Development Bible before implementation begins.

Documentation is considered part of development rather than an optional task.

---

## 3. Build for Expansion

Every system should be designed with future updates in mind.

Whenever practical:

- Avoid hardcoded limitations.
- Support modular additions.
- Make systems reusable.
- Allow content to grow naturally.

---

## 4. Quality Over Speed

Features should be implemented correctly rather than quickly.

It is preferable to delay a feature than release an unstable or poorly designed implementation.

---

## 5. Small, Complete Iterations

Development should progress through small, well-defined milestones.

Each completed feature should reach a stable state before moving on to the next major system.

---

## 6. Reuse Before Rewrite

Existing systems should be extended wherever possible.

Duplicate logic should be avoided.

Reusable code should always be preferred over multiple independent implementations.

---

## 7. Data-Driven Design

Values such as costs, rewards, progression and balancing should be stored in structured data wherever practical.

This allows balancing changes without large code modifications.

---

## 8. Performance Matters

Performance should be considered throughout development rather than only during optimisation.

Efficient systems are easier to maintain and provide a better player experience.

---

## 9. Test Frequently

Features should be tested throughout development.

Finding issues early is significantly easier than correcting large problems later.

---

## 10. Every Update Should Improve the Game

Updates should introduce meaningful improvements rather than increasing content for its own sake.

Each release should leave the game in a better state than before.

---

# Long-Term Development Goals

Development should always aim to:

- Improve existing systems.
- Expand gameplay depth.
- Reduce unnecessary complexity.
- Improve maintainability.
- Preserve backwards compatibility where practical.
- Support years of future content.

---

# Development Workflow

The preferred development workflow is:

```text
Idea

↓

Specification

↓

Review

↓

Implementation

↓

Testing

↓

Documentation Update

↓

Release
```

This workflow ensures that the Development Bible remains synchronised with the implementation.

---

# Success Criteria

Successful development should result in:

- Stable gameplay systems.
- Easy maintenance.
- Consistent code quality.
- Clear documentation.
- Straightforward future expansion.
- Minimal technical debt.

---

# Summary

Everything Factory Incremental should be developed as a long-term platform rather than a short-term project.

Every decision made during development should consider not only the immediate implementation but also the future growth of the game.

The project should remain enjoyable to develop, straightforward to maintain and capable of supporting years of continued expansion.

---

# Related Sections

- 1.3 Design Philosophy
- 1.5 Player Experience Goals
- Volume V – Technical Specification
- Volume VI – Project Management

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Development Philosophy created. |

---

## 1.5 Player Experience Goals

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-005
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Gameplay, UI, Progression and Balancing
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the intended emotional and psychological experience of the player throughout their journey in Everything Factory Incremental.

Unlike gameplay systems, which describe how the game functions, this section describes how the player should feel while interacting with those systems.

Every feature should contribute positively towards at least one of the experiences defined below.

---

# Overview

Everything Factory Incremental is designed to create a rewarding progression journey that remains engaging over hundreds of hours.

The player should experience a constant sense of growth, discovery and achievement.

Progression should never feel meaningless or repetitive.

Instead, every session should provide a reason to continue playing, whether that is reaching a milestone, unlocking a new mechanic, discovering a rare item or improving factory efficiency.

---

# First-Time Player Experience

During the first few minutes, the player should feel:

- Curious.
- Comfortable.
- Interested.
- Rewarded.

The game should appear approachable and easy to understand.

Players should never feel overwhelmed with information or mechanics immediately after joining.

Instead, complexity should reveal itself gradually.

---

# Early Game Experience

During the early game, the player should begin learning the core gameplay loop.

The intended emotions are:

- Excitement.
- Progress.
- Curiosity.
- Motivation.

The player should quickly discover that the game offers more depth than initially expected.

Unlocks should happen regularly and each should introduce something meaningful.

---

# Mid Game Experience

As additional mechanics become available, the player should begin making strategic decisions.

The intended emotions are:

- Experimentation.
- Optimisation.
- Discovery.
- Satisfaction.

Players should start building personal strategies instead of simply following a linear path.

---

# Late Game Experience

The late game should reward mastery.

The intended emotions are:

- Achievement.
- Efficiency.
- Collection.
- Long-term planning.

Players should have multiple meaningful goals available simultaneously rather than completing one objective before beginning another.

---

# Long-Term Experience

After many hours of gameplay, the player should still feel motivated to return.

Reasons to return may include:

- Completing collections.
- Finding rare mutations.
- Improving factory efficiency.
- Preparing for future updates.
- Unlocking remaining achievements.
- Experimenting with different strategies.

The game should avoid reaching a point where progression completely stops.

---

# Core Emotional Goals

Every major gameplay system should contribute towards one or more of the following emotions.

## Curiosity

The player should regularly wonder:

> "What happens if I unlock this?"

---

## Satisfaction

Major milestones should feel genuinely rewarding.

Players should feel proud of their achievements.

---

## Discovery

The game should regularly surprise the player with new mechanics, interactions and opportunities.

---

## Progress

Every play session should produce visible progress.

Players should rarely feel that their time has been wasted.

---

## Ownership

Players should feel that their factory is unique and represents the time and effort they have invested.

---

## Mastery

Experienced players should continue discovering better strategies long after understanding the basic mechanics.

Skill should remain valuable throughout progression.

---

# Player Motivation

The game should provide both short-term and long-term goals.

## Short-Term Goals

Examples include:

- Purchasing an upgrade.
- Unlocking a building.
- Completing an achievement.
- Discovering a new ore.
- Improving factory efficiency.

---

## Long-Term Goals

Examples include:

- Completing the Collection Log.
- Unlocking every achievement.
- Reaching major Factory Levels.
- Obtaining rare mutations.
- Preparing for future content.

Both forms of motivation are essential for maintaining long-term engagement.

---

# Frustration Guidelines

The game should minimise unnecessary frustration.

Players should rarely lose progress.

Progression should feel challenging without becoming unfair.

Randomness should create excitement rather than annoyance.

Grind should support progression rather than artificially extend playtime.

---

# Success Criteria

The intended player experience has been achieved if players:

- Enjoy returning to the game.
- Feel excited about future unlocks.
- Remember important milestones.
- Continue experimenting with optimisation.
- Feel rewarded for their time.
- Recommend the game to others.

---

# Summary

Everything Factory Incremental aims to create a progression experience that remains rewarding, varied and memorable.

The player should never feel as though they are simply waiting for numbers to increase.

Instead, every stage of progression should introduce meaningful goals, satisfying rewards and opportunities to discover something new.

The player journey should remain engaging from the first click to the most advanced content available.

---

# Related Sections

- 1.1 Game Vision
- 1.2 Project Overview
- 1.3 Design Philosophy
- Volume II – Player Journey
- Volume III – Gameplay Specification

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Player Experience Goals created. |

---

## 1.6 Documentation Standards

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-006
>
> **Priority:** 🟡 High
>
> **Applies To:** Entire Development Bible
>
> **Last Updated:** Initial Revision

---

# Purpose

This section summarises the documentation standards that govern the Everything Factory Incremental Development Bible.

While the complete documentation framework is defined within the opening Framework chapters of this document, this section establishes the principles that every contributor should understand before modifying or extending any part of the Development Bible.

Documentation is considered a core component of the project and should remain synchronised with the game's implementation throughout development.

---

# Documentation Philosophy

The Development Bible exists to serve as the single authoritative source of information for Everything Factory Incremental.

Its purpose is to ensure that every gameplay mechanic, design decision, technical implementation and future expansion is documented clearly enough that another developer can understand, maintain and continue development without requiring additional explanation from the original author.

The Development Bible should always prioritise clarity, completeness and long-term maintainability.

---

# Documentation Principles

Every section of the Development Bible should follow the principles below.

## Accuracy

Documentation should always reflect the intended implementation.

If the game changes, the documentation should be updated as soon as practical.

---

## Consistency

Terminology, formatting and structure should remain consistent throughout the document.

Defined terms should always be used consistently.

---

## Self-Contained Documentation

Each chapter should provide enough context for a reader to understand the documented feature without needing to search extensively throughout the document.

Important concepts may be intentionally repeated where doing so improves understanding.

---

## Redundancy Over Ambiguity

Where a choice exists between repeating important information or requiring the reader to locate another section, repetition should normally be preferred.

The objective is to maximise clarity rather than minimise document length.

---

## Assume Zero Prior Knowledge

Documentation should be written as though the reader has never previously encountered the project.

Every mechanic should introduce sufficient context to explain:

- What it is.
- Why it exists.
- How it works.
- How it interacts with other systems.

---

## Maintainability

The Development Bible should remain easy to update throughout the lifetime of the project.

Large revisions should build upon the existing structure rather than replacing it.

---

# Responsibilities

Contributors should aim to:

- Keep documentation current.
- Record meaningful design decisions.
- Update revision histories where appropriate.
- Preserve historical reasoning.
- Follow the established documentation structure.

Documentation should evolve alongside the game.

---

# Relationship to the Framework

This chapter provides a high-level overview of the documentation standards.

Detailed rules governing formatting, governance, versioning, maintenance procedures and documentation lifecycle are defined within the Framework section at the beginning of this Development Bible.

Where conflicts exist, the Framework shall take precedence.

---

# Success Criteria

Documentation is considered successful when it:

- Accurately reflects the project.
- Is understandable by new contributors.
- Can be maintained over many years.
- Supports future expansion.
- Reduces reliance on undocumented knowledge.
- Provides a single trusted source of project information.

---

# Summary

The Development Bible is more than a reference manual.

It is the primary design, technical and development specification for Everything Factory Incremental.

Every contributor should treat documentation as an essential part of development, ensuring that the project remains understandable, maintainable and expandable throughout its lifetime.

---

# Related Sections

- Framework
- 1.3 Design Philosophy
- 1.4 Development Philosophy
- Volume VI – Project Management

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Documentation Standards created. |

---

## 1.7 Project Scope

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-007
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Initial Release (Version 1.0)
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the intended scope of Everything Factory Incremental Version 1.0.

The purpose of this section is to establish a clear boundary between features required for the initial release and features planned for future updates.

Any feature not listed within this section should be assumed to be outside the scope of Version 1.0 unless otherwise documented.

---

# Release Vision

Version 1.0 is intended to deliver a complete, polished and enjoyable gameplay experience that establishes the foundations of Everything Factory Incremental.

The objective is not to release every planned idea.

Instead, Version 1.0 should introduce the core systems that define the game's identity while providing a stable foundation for years of future expansion.

---

# Primary Objectives

Version 1.0 should successfully achieve the following objectives.

- Introduce the player to the core gameplay loop.
- Establish meaningful long-term progression.
- Deliver a satisfying automation experience.
- Encourage optimisation and experimentation.
- Reward exploration and discovery.
- Provide multiple progression paths.
- Support future expansion without requiring major redesigns.

---

# Gameplay Systems Included

The following are the broad V1 system areas. Defined rules and the current-phase exclusions in Reference K take precedence over this older scope outline. Detailed Achievement/Milestone rewards are Deferred; Daily/Weekly challenges in 3.23 are now included. Unspecified mutation/offline/grid/settings behavior still needs design.

## Core Gameplay

- Manual Mining
- Resource Collection
- Inventory
- Selling Resources
- Cash Economy
- Experience (XP)
- Factory Levels

---

## Factory Systems

- Miners
- Conveyors
- Furnaces
- Polishers
- Refiners

---

## Progression Systems

- Ore Progression
- Factory Expansion
- Shop Progression
- Milestones
- Achievements
- Collection Log
- Statistics
- Rebirth

---

## Special Systems

- Mutation System
- Offline Progress
- Save System
- Permanent Achievement Rewards

---

## User Interface

Version 1.0 should include a complete user interface for all implemented systems, including:

- Inventory
- Shop
- Collection Log
- Achievements
- Statistics
- Settings
- Factory Information
- Progression Information

---

# Technical Requirements

Version 1.0 should provide:

- Stable save system.
- Reliable autosaving.
- Expandable architecture.
- Modular gameplay systems.
- Good performance on supported web devices, with later Luau portability.
- Consistent balancing.
- Maintainable code structure.
- Comprehensive documentation.

---

# Content Requirements

The initial release should include sufficient content to provide long-term progression.

This includes:

- Multiple ore tiers.
- Multiple building types.
- Upgrade progression.
- Collection content.
- Achievement progression.
- Meaningful milestones.
- Factory Levels.
- Mutations.
- Rebirth progression.

The objective is not to maximise the amount of content but to ensure that every implemented system is enjoyable, polished and expandable.

---

# Release Quality Standards

Version 1.0 should meet the following quality expectations before release.

## Stability

Core gameplay systems function correctly.

---

## Balance

Progression feels rewarding without excessive grinding.

---

## Performance

Gameplay remains responsive across supported devices.

---

## Accessibility

New players can quickly understand the game.

---

## Expandability

Future systems can be added without redesigning existing mechanics.

---

## Polish

User interface, gameplay feedback and progression should feel complete and intentional.

---

# Definition of Version 1.0

Version 1.0 should represent a complete game rather than an early prototype.

Players should be able to:

- Start a new save.
- Progress through every intended gameplay stage.
- Unlock all core mechanics.
- Complete long-term objectives.
- Experience the full gameplay loop.
- Reach the first major end-game.

Future updates should expand this experience rather than complete unfinished systems.

---

# Success Criteria

Version 1.0 will be considered successful if it:

- Provides a satisfying progression loop.
- Encourages players to return.
- Supports multiple playstyles.
- Rewards optimisation.
- Creates memorable milestones.
- Establishes a strong foundation for future updates.

---

# Scope Management

During development, every proposed feature should be evaluated against this section.

Questions to consider include:

- Does this feature support the Version 1.0 vision?
- Is this feature required for launch?
- Does this feature delay the release unnecessarily?
- Can this feature be introduced in a future update without negatively affecting the launch experience?

If the answer to the final question is "Yes", the feature should normally be scheduled after Version 1.0.

---

# Summary

The purpose of Version 1.0 is to establish Everything Factory Incremental as a complete, polished and expandable gameplay experience.

The initial release should prioritise quality, stability and meaningful progression over the quantity of content.

Future updates should build upon the foundations established within this release rather than introducing unfinished mechanics prematurely.

---

# Related Sections

- 1.1 Game Vision
- 1.2 Project Overview
- 1.3 Design Philosophy
- 1.4 Development Philosophy
- 1.8 Out of Scope Features
- Volume III – Gameplay Specification

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Project Scope created. |

---

## 1.8 Out of Scope Features

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL1-008
>
> **Priority:** 🔴 Critical
>
> **Applies To:** Initial Release (Version 1.0)
>
> **Last Updated:** Initial Revision

---

# Purpose

This section defines the features that are intentionally excluded from Version 1.0 of Everything Factory Incremental.

The purpose of this section is to prevent unnecessary feature creep during development while providing a clear roadmap for future expansion.

Features listed here are not considered cancelled.

Instead, they have been intentionally postponed until a future update where they can receive the attention and development time they deserve.

---

# Philosophy

Everything Factory Incremental is intended to be a long-term project.

Not every planned idea needs to be included in the initial release.

Version 1.0 should focus on delivering a polished, stable and enjoyable foundation.

Future updates should expand the game through carefully designed additions rather than rushing unfinished mechanics into the launch version.

Quality shall always take priority over quantity.

---

# Features Intentionally Excluded From Version 1.0

The following systems are currently considered outside the scope of the initial release.

## Multiplayer Features

Examples include:

- Cooperative gameplay.
- Trading.
- Guilds or Clans.
- Shared factories.
- Competitive leaderboards with social interaction.

These systems may be explored after the core gameplay experience has matured.

---

## Live Service Features

Examples include:

- Daily login rewards.
- Limited-time events.
- Battle Passes.
- Seasonal progression.
- Limited-time event challenges (the Defined Daily/Weekly system in 3.23 is included).

Version 1.0 excludes seasonal/live-event systems; the Defined Daily/Weekly progression challenges in 3.23 are an explicit exception to this older exclusion.

---

## Additional Worlds

Future worlds, dimensions or large expansion areas are not required for the initial release.

Version 1.0 should establish one complete progression experience before introducing additional locations.

---

## Advanced Progression Layers

Examples include:

- Super Rebirths.
- Ascension systems.
- World prestige.
- End-game prestige currencies.

The initial release should focus on refining the primary Rebirth system before introducing additional progression layers.

---

## Community Features

Examples include:

- Player profiles.
- Friends systems.
- Public showcases.
- Factory sharing.
- Community competitions.

These systems may become valuable once a player community has been established.

---

## Cosmetic Expansion

Examples include:

- Extensive cosmetic collections.
- Character customisation.
- Factory themes.
- Premium visual effects.

Cosmetic systems should not delay gameplay-focused development.

---

## Advanced Analytics

Examples include:

- Detailed performance dashboards.
- Historical progression graphs.
- Advanced statistics.
- Personal gameplay reports.

Basic player statistics are included in Version 1.0.

Expanded analytics may be introduced in future updates.

---

# Future Expansion Philosophy

Every feature excluded from Version 1.0 should satisfy the following principles before implementation.

- Expand existing gameplay.
- Preserve previous progression.
- Integrate naturally with existing systems.
- Maintain backwards compatibility where practical.
- Improve the overall player experience.

Future updates should feel like natural extensions of the game rather than complete redesigns.

---

# Feature Evaluation

When a new idea is proposed during development, the following questions should be considered.

- Does this improve the Version 1.0 experience?
- Is it required for launch?
- Can it be added after release without negatively affecting players?
- Will delaying this feature allow Version 1.0 to become more polished?

If the answer to the final two questions is "Yes", the feature should normally be postponed.

---

# Living Roadmap

This section is intended to evolve throughout development.

Features may move:

- From Out of Scope to Project Scope.
- From Future Ideas to Planned Updates.
- From Planned Updates to Released Content.

Every change should be documented within the project's Revision History and Changelog.

---

# Summary

Version 1.0 is intended to establish Everything Factory Incremental as a polished and expandable gameplay experience.

Not every planned feature belongs in the initial release.

Delaying non-essential mechanics allows development to focus on quality, stability and the systems that define the game's identity.

A smaller, polished release is preferred over a larger but unfinished experience.

---

# Related Sections

- 1.1 Game Vision
- 1.2 Project Overview
- 1.3 Design Philosophy
- 1.7 Project Scope
- Volume VI – Project Management
- Future Ideas

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Out of Scope Features created. |
---

# Volume II - Player Journey

> Volume overview status tables below are retained September planning snapshots. Use the current chapter contract and roadmap for current design/implementation status; Defined design never implies implementation completion.



> [!IMPORTANT]
>
> **Volume Status:** 🟠 In Development
>
> **Volume Purpose:** Document the player's complete journey through Everything Factory Incremental from launching the game for the first time to reaching long-term progression.
>
> **Target Audience:** Gameplay Designers, Programmers, UI Designers, QA Testers.
>
> **Prerequisites:** Volume I – Project Foundation.
>
> **Estimated Reading Time:** 45–60 Minutes.

---

# Overview

Volume II documents the intended player journey throughout Everything Factory Incremental.

Unlike later volumes, which define the technical implementation of gameplay systems, this volume focuses entirely on the player's experience.

Every chapter follows the order in which the player naturally encounters milestones throughout progression.

The purpose of this volume is to ensure that gameplay systems are introduced in a logical, rewarding and engaging sequence that supports the design principles established within Volume I.

Rather than measuring progression using time, this volume measures progression through meaningful gameplay milestones.

This allows the player journey to remain accurate even if balancing changes alter how quickly progression occurs.

---

## Volume II Documentation Rule

Volume II documents the player's experience rather than the implementation of gameplay systems.

Whenever possible, chapters should focus on:

- Player expectations.
- Emotional responses.
- Learning progression.
- Gameplay pacing.
- Natural discovery.
- Milestone transitions.

Detailed mechanics, numerical balancing, formulas, technical implementation and development considerations are intentionally deferred to later volumes.

---

# Objectives

Upon completing this volume the reader should understand:

- How a new player begins the game.
- The intended onboarding experience.
- The order in which mechanics are introduced.
- The reasoning behind each progression milestone.
- How the player gradually learns increasingly complex systems.
- How progression transitions from manual gameplay to automation.
- The intended pacing of the player's journey.
- The complete progression path from a new save to long-term gameplay.

---

# Volume Structure

| Section | Documentation status | Implementation status | Purpose |
|---------|----------------------|-----------------------|---------|
| **2.1 First Launch** | 🟠 In Development | 🟠 In Progress | Documents the player's very first interaction with the game. |
| **2.2 First Resource** | 🟠 In Development | 🟠 In Progress | Covers the first manual gathering of Stone and introduction to resource collection. |
| **2.3 First Sale** | 🟠 In Development | 🟠 In Progress | Introduces the economy, selling resources and earning the first currency. |
| **2.4 First Upgrade** | 🟠 In Development | 🟠 In Progress | Covers the player's first permanent progression upgrade and introduces progression philosophy. |
| **2.5 First Automation** | 🟠 In Development | 🟠 In Progress | Documents unlocking and understanding the first automated factory components. |
| **2.6 First Factory Expansion** | 🟠 In Development | ⚪ Not Started | Covers expanding the factory and introducing larger-scale production. |
| **2.7 First Optimisation** | 🟠 In Development | 🟠 In Progress | Documents when players begin experimenting with layouts, efficiency and strategy. |
| **2.8 First Discovery** | 🟠 In Development | 🟠 In Progress | Introduces discovering new ores, mechanics and hidden progression. |
| **2.9 First Long-Term Goal** | 🟠 In Development | 🟠 In Progress | Covers achievements, collections, milestones and other persistent objectives. |
| **2.10 First Rebirth** | 🟠 In Development | ⚪ Not Started | Documents the player's first prestige experience and permanent progression reset. |
| **2.11 Long-Term Progression** | 🟠 In Development | 🟠 In Progress | Defines the intended experience after all core mechanics have been introduced. |

---

# Dependencies

Volume II builds directly upon the principles established within Volume I.

Every gameplay milestone documented within this volume should support:

- Game Vision
- Design Philosophy
- Development Philosophy
- Player Experience Goals

Detailed implementation is intentionally deferred to Volume III.

---

# Completion Criteria

Volume II shall be considered complete once:

- Every major progression milestone has been documented.
- The onboarding experience has been fully specified.
- The order of gameplay mechanics has been established.
- Every gameplay system has an intended introduction point.
- Long-term progression has been defined.
- The complete player journey can be understood without referencing later volumes.

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Volume II framework created. |

---

# Player Journey Structure

The player journey is divided into three major acts.

Each act represents a significant shift in the player's understanding of the game and introduces new expectations, mechanics and long-term objectives.

The purpose of these acts is to ensure that gameplay complexity increases naturally while maintaining a rewarding and engaging experience.

---

# Act I — Learning the Basics

**Chapters**

- 2.1 First Launch
- 2.2 First Resource
- 2.3 First Sale
- 2.4 First Upgrade

**Purpose**

Introduce the player to the world, establish the core gameplay loop and teach the fundamental mechanics required for progression.

The player should finish this act understanding the basic gameplay cycle while looking forward to unlocking automation.

---

# Act II — Building the Factory

**Chapters**

- 2.5 First Automation
- 2.6 First Factory Expansion
- 2.7 First Optimisation
- 2.8 First Discovery

**Purpose**

Transition the player from manual gameplay into factory management.

The emphasis shifts from learning mechanics to improving efficiency, discovering new systems and making meaningful strategic decisions.

---

# Act III — Mastery & Long-Term Progression

**Chapters**

- 2.9 First Long-Term Goal
- 2.10 First Rebirth
- 2.11 Long-Term Progression

**Purpose**

Introduce persistent progression systems that encourage players to continue improving their factory over weeks, months and future updates.

By the end of this act, every major gameplay system introduced in Version 1.0 should have become interconnected.

---

# Act I — Learning the Basics

> *The player learns the fundamental gameplay loop and establishes the foundations that every future gameplay system builds upon.*

---

# 2.1 First Launch

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

Fresh saves start with $0, Factory Level 0, 0 Factory XP and the infinite-durability Default Pickaxe. The first-ever manual mining action guarantees Stone and cannot substitute a crafting material. Subsequent actions use the normal accessible manual pool.

Opening sequence: first Stone → first Starter Furnace sale → Mining Power I → Unlock Miner → buy first Miner → automatic production. Mining Power I is required before the shop unlock, which is separate from buying a Miner. The Starter Furnace is the selling system; no separate direct-sale mechanic is required.

The Furnace, Upgrade Shop, Collection and Statistics are visible from the start. Miner purchase/unlock access appears in the Upgrade Shop with applicable requirements. Achievements are revealed after the first Achievement unlocks; Milestones after the first completed Rebirth. Track milestone progress before reveal. Pickaxes and resources share an inventory screen with appropriate tabs; crafting has its own screen. Raw, Polished and Refined resources use separate tabs.

---

# 2.2 First Resource

The first-ever manual action guarantees Stone and cannot substitute a material. Default Pickaxe is infinite. Later actions use accessible manual weights; this guarantee is not a permanent Stone-only phase. See 3.3 for exact quantity, accessibility and material rules.

---

# 2.3 First Sale

The Starter Furnace is the selling system. The first sale consumes its reserved resources and pays Cash exactly once. There is no separate direct-sale mechanic to build. Starter tier is free, manually activated, with the capacity/value/time formulas in Reference E.

---

# 2.4 First Upgrade

Mining Power I is the required opening upgrade, raw Cash price $250. Unlock Miner costs $100 afterward and is a separate transaction from buying the $100 Tier 1 Miner. Enforce the Mining Power prerequisite in purchase logic, not only visibility. See 3.7.

---

# 2.5 First Automation

The opening order is: fresh $0 / Level 0 / XP 0 → guaranteed first Stone → Starter Furnace sale → Mining Power I → Unlock Miner ($100) → separately purchase Tier 1 Miner ($100 before eligible discount) → first automatic production. The first Miner slot is free. A shop unlock alone produces nothing. Miner ownership begins production; automatic Furnace activation starts at Furnace Tier 3, not at fresh start. See References B/E and roadmap V1-021–025.

---

## 2.6 First Factory Expansion

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-006
>
> **Implementation Status:** ⚪ Not Started
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Additional machines can be purchased as ownership counters, but there is no construction space, placement or spatial factory-expansion milestone.
>
> **Player Milestone:** First Factory Expansion
>
> **Prerequisite:** First Automation
>
> **Next Milestone:** First Optimisation

---

# Purpose

This milestone introduces the player to the concept of expanding and managing a growing factory.

Rather than focusing on a single automated machine, the player now begins thinking about the factory as an interconnected production system.

Expansion should feel exciting, rewarding and full of possibilities.

The player should recognise that their factory is no longer a temporary setup but something that will continue to evolve throughout their journey.

---

# Design Philosophy

Factory expansion represents the transition from owning machines to designing a production network.

The player should begin making decisions about:

- Where to place new buildings.
- How production flows through the factory.
- How available space is used.
- Which areas should be expanded first.
- How future growth should be planned.

Growth should encourage thoughtful decisions rather than simply placing more machines wherever space allows.

---

# Intended Player Experience

The player should experience:

- Ambition.
- Creativity.
- Ownership.
- Curiosity.
- Achievement.

The player should begin viewing the factory as a personal creation rather than a collection of independent buildings.

Every expansion should feel like visible progress.

---

# System Overview

Factory expansion introduces the concept that progression is not limited to unlocking new buildings.

The arrangement, organisation and growth of the factory become important parts of gameplay.

As the factory expands, the player naturally begins to encounter:

- Increased production.
- Larger layouts.
- More building interactions.
- More opportunities for improvement.
- Greater planning requirements.

Expansion should create opportunities rather than complications.

---

# Gameplay Flow

The intended sequence is:

```text
Player earns additional currency

↓

Player purchases more factory components

↓

Production increases

↓

Available space begins filling

↓

The player rearranges parts of the factory

↓

The factory becomes noticeably larger

↓

The player begins recognising opportunities for improvement
```

The player should clearly see the difference between their original factory and its expanded form.

The growth should feel earned.

---

# User Interface Behaviour

During this milestone the player should become comfortable with:

- Placing additional machines.
- Navigating a larger factory.
- Viewing production areas.
- Managing available space.
- Identifying where expansion is possible.

The interface should continue feeling organised despite the increasing number of factory components.

---

# Audio & Visual Feedback

As the factory grows, the environment should become increasingly active.

Examples include:

- Multiple machines operating simultaneously.
- Larger production lines.
- Continuous conveyor movement.
- Increased resource flow.
- More visual activity throughout the factory.

The player should be able to observe the factory becoming busier over time.

The factory should look alive.

---

# Educational Purpose

This milestone teaches the player that:

- Growth creates new opportunities.
- Planning ahead becomes increasingly valuable.
- Factory layout influences future development.
- Expansion is an ongoing process rather than a single achievement.

The player should naturally begin thinking beyond their next purchase.

---

# Developer Intent

The purpose of this milestone is to establish factory building as a core gameplay experience.

Expansion should never feel like placing identical machines repeatedly.

Instead, every addition should make the player feel that their factory is becoming larger, more capable and more impressive.

The player should develop a sense of ownership over their factory.

When they look at it, they should recognise it as the result of their own decisions and progression.

This emotional connection encourages long-term investment in the game.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Expands beyond their initial production setup.
- Understands that factory growth is a continuous objective.
- Begins planning future layouts.
- Takes pride in the appearance and efficiency of their factory.
- Wants to continue expanding rather than remaining with a minimal setup.

---

# Transition

As the factory grows, simply adding more machines becomes less effective.

The player naturally begins asking questions such as:

- "Can I arrange this better?"
- "Is there a more efficient layout?"
- "Am I using my space effectively?"

This marks the beginning of **2.7 First Optimisation**, where the player's focus shifts from expanding production to improving it.

---

# Related Sections

- 2.5 First Automation
- 2.7 First Optimisation
- Volume III – Factory System
- Volume III – Building Placement
- Volume III – Factory Expansion
- Volume III – Production Flow

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Factory Expansion specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

## 2.7 First Optimisation

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-007
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Upgrade spending and Auto Furnace resource/batch modes provide choices. Layout-based optimisation and visible production networks are absent.
>
> **Player Milestone:** First Optimisation
>
> **Prerequisite:** First Factory Expansion
>
> **Next Milestone:** First Discovery

---

# Purpose

This milestone introduces the player to optimisation as a core gameplay philosophy.

Until this point, progression has primarily been achieved by collecting more resources, purchasing additional buildings and expanding the factory.

Now the player begins improving what already exists.

Rather than asking "What should I buy next?", the player begins asking "Can I make this better?"

This marks the transition from simple progression into strategic gameplay.

---

# Design Philosophy

Optimisation is intended to reward curiosity, experimentation and thoughtful planning.

The player should naturally discover that two factories containing the same buildings may perform very differently depending upon how they have been designed.

The game should encourage players to experiment rather than presenting a single perfect solution.

Every improvement should feel earned through understanding rather than luck.

---

# Intended Player Experience

The player should experience:

- Curiosity.
- Satisfaction.
- Creativity.
- Problem solving.
- Mastery.

Players should begin feeling that their own decisions directly influence the success of their factory.

Success should increasingly come from making good choices rather than simply spending more currency.

---

# System Overview

This milestone introduces optimisation as an ongoing objective rather than a single feature.

The player begins recognising opportunities to improve:

- Factory layouts.
- Building placement.
- Production flow.
- Upgrade priorities.
- Resource management.
- Expansion planning.

Optimisation should become a habit that continues throughout the remainder of the game.

---

# Gameplay Flow

The intended sequence is:

```text
Player observes factory

↓

Player notices an inefficiency

↓

Player experiments with a change

↓

Factory performance improves

↓

Player receives immediate feedback

↓

Player begins searching for additional improvements

↓

Optimisation becomes part of normal gameplay
```

Improvement should feel rewarding regardless of how small the optimisation may be.

---

# User Interface Behaviour

The interface should support experimentation by making information easy to understand.

Players should be able to quickly identify:

- Building locations.
- Production flow.
- Upgrade effects.
- Factory organisation.
- Available space.

The interface should help players make informed decisions without solving the optimisation challenge for them.

---

# Audio & Visual Feedback

Optimisation should create noticeable visual improvements.

Examples include:

- Smoother production flow.
- Fewer interruptions.
- Better organised factory layouts.
- More active production lines.
- Increased visual activity.

The player should feel that the factory is operating more efficiently because of their decisions.

---

# Educational Purpose

This milestone teaches the player that:

- Bigger is not always better.
- Planning ahead creates long-term benefits.
- Rearranging existing systems can be as valuable as purchasing new ones.
- Efficiency is another form of progression.

The player should understand that knowledge becomes a resource alongside currency.

---

# Developer Intent

This milestone exists to transform the player's mindset.

Until now, progression has largely been driven by unlocking and expanding.

From this point onwards, progression should increasingly reward understanding.

The player should begin analysing their own factory, recognising opportunities for improvement and feeling proud when those improvements produce measurable results.

Importantly, the game should avoid forcing optimisation.

Casual players should still be able to progress naturally, while players who enjoy experimentation and efficiency should feel rewarded for investing additional thought into their factory design.

This philosophy supports multiple playstyles without making either one feel incorrect.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Experiments with improving their factory.
- Understands that efficiency matters.
- Recognises the value of planning.
- Begins making strategic decisions.
- Feels rewarded for thoughtful optimisation.

---

# Transition

As players become comfortable optimising their factory, they naturally begin looking beyond what is immediately visible.

Questions such as:

- "What else can I unlock?"
- "Are there rarer resources?"
- "What other systems exist?"
- "What secrets haven't I discovered yet?"

begin to replace questions about efficiency alone.

This curiosity introduces **2.8 First Discovery**, where the player realises that Everything Factory Incremental contains far more depth than was initially apparent.

---

# Related Sections

- 2.6 First Factory Expansion
- 2.8 First Discovery
- Volume III – Factory Layout
- Volume III – Production Flow
- Volume III – Building Systems
- Volume III – Upgrade Systems

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Optimisation specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

## 2.8 First Discovery

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-008
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** First ore discoveries reveal Collection Book entries and display a popup. The broader discovery journey remains unfinished; the modal currently interrupts interaction rather than providing the non-interrupting feedback described below.
>
> **Player Milestone:** First Discovery
>
> **Prerequisite:** First Optimisation
>
> **Next Milestone:** First Long-Term Goal

---

# Purpose

This milestone represents the moment the player realises that Everything Factory Incremental is far larger than it first appeared.

Up until this point, progression has focused on learning, building and improving the factory.

Now the player begins discovering systems, mechanics and opportunities that were not immediately visible during the early game.

The objective of this milestone is to create genuine excitement about what still remains to be discovered.

---

# Design Philosophy

Discovery is one of the defining pillars of Everything Factory Incremental.

The game should never feel completely understood.

As the player progresses, new mechanics, interactions and opportunities should naturally reveal themselves.

The player should regularly experience moments where they realise there is far more depth than they originally expected.

Discovery should reward curiosity rather than luck alone.

---

# Intended Player Experience

The player should experience:

- Surprise.
- Curiosity.
- Excitement.
- Wonder.
- Motivation.

This milestone should reinforce the belief that exploration and experimentation are worthwhile.

Players should feel encouraged to investigate the game rather than simply progressing through it.

---

# System Overview

The first discovery is intentionally not tied to a single gameplay mechanic.

Instead, it represents the player's first encounter with gameplay that expands their understanding of the game.

Examples may include:

- Discovering a rare resource.
- Encountering a mutation.
- Unlocking a hidden mechanic.
- Revealing a new collection entry.
- Finding an unexpected interaction.
- Unlocking a previously unknown progression path.

The specific implementation may evolve throughout development, but the intended player experience should remain unchanged.

---

# Gameplay Flow

The intended sequence is:

```text
Player continues progressing

↓

Player encounters something unexpected

↓

The player investigates

↓

A new mechanic or opportunity is revealed

↓

The player begins experimenting

↓

The player's understanding of the game expands

↓

The player becomes excited to discover even more
```

The discovery should feel natural rather than scripted.

Players should feel as though they uncovered something rather than simply being handed new content.

---

# User Interface Behaviour

When a discovery occurs, the interface should acknowledge it without interrupting gameplay.

Examples include:

- Discovery notifications.
- Collection updates.
- New menu indicators.
- Achievement progress.
- Unlock animations.

The interface should celebrate discovery while encouraging continued exploration.

---

# Audio & Visual Feedback

Discoveries should feel memorable.

Possible feedback includes:

- Distinct audio cues.
- Special visual effects.
- Unique animations.
- Collection highlights.
- Celebration effects.

Players should immediately recognise that they have experienced something significant.

---

# Educational Purpose

This milestone teaches the player that:

- Not every mechanic is immediately available.
- Exploration is valuable.
- Curiosity is rewarded.
- The game contains hidden depth.
- Future progression will continue introducing meaningful surprises.

Players should begin actively looking for opportunities to discover additional mechanics.

---

# Developer Intent

This milestone exists to establish discovery as a permanent part of the gameplay loop.

The player should stop viewing progression as a predictable sequence of upgrades.

Instead, they should begin expecting that future progression may reveal entirely new mechanics, systems and possibilities.

This sense of discovery should remain throughout the lifetime of the game.

Future updates should continue supporting this philosophy by introducing new content in ways that reward exploration and experimentation.

Whenever possible, discovery should feel earned rather than simply unlocked by reaching a numerical requirement.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Experiences genuine surprise.
- Understands that the game contains hidden depth.
- Begins actively exploring.
- Looks forward to discovering additional mechanics.
- Feels excited about continuing their journey.

---

# Transition

By this stage, the player understands the core gameplay loop and has experienced automation, expansion, optimisation and discovery.

The player is now ready to pursue objectives that extend beyond immediate progression.

Rather than asking:

> "What can I unlock next?"

the player begins asking:

> "What do I want to achieve?"

This change in mindset begins **Act III — Mastery & Long-Term Progression**, starting with **2.9 First Long-Term Goal**, where the player is introduced to persistent objectives that encourage continued engagement over many play sessions.

---

# Related Sections

- 1.1 Game Vision
- 1.3 Design Philosophy
- 2.7 First Optimisation
- 2.9 First Long-Term Goal
- Volume III – Discovery Systems
- Volume III – Collection Systems
- Volume III – Mutation System

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Discovery specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

# Act III — Mastery & Long-Term Progression

> *The player shifts from following guided progression to pursuing personal goals, mastering interconnected systems and preparing for years of future expansion.*

---

## 2.9 First Long-Term Goal

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-009
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Collection goals, level milestones and six achievements exist. Achievement rewards are placeholders; rebirth preparation and the full long-term progression path are absent.
>
> **Player Milestone:** First Long-Term Goal
>
> **Prerequisite:** First Discovery
>
> **Next Milestone:** First Rebirth

---

# Purpose

This milestone introduces the player to objectives that extend beyond immediate progression.

Until this point, most goals have been naturally presented by the game through unlocking new mechanics and expanding the factory.

Now the player begins pursuing objectives that require planning, persistence and personal motivation over many play sessions.

The game shifts from asking the player to progress to inviting the player to choose what they want to accomplish next.

---

# Design Philosophy

Long-term goals exist to give progression lasting meaning.

Rather than providing a single path, the game should present multiple objectives that appeal to different types of players.

Some players may focus on completing collections.

Others may pursue achievements, optimise their factory, unlock every upgrade or prepare for future progression.

There should never be only one "correct" objective.

---

# Intended Player Experience

The player should experience:

- Motivation.
- Ambition.
- Freedom.
- Ownership.
- Accomplishment.

The player should feel that they are no longer following a fixed path.

Instead, they are beginning to create their own journey through the game.

---

# System Overview

Long-term goals introduce persistent objectives that continue alongside normal gameplay.

Examples include:

- Completing the Collection Log.
- Unlocking achievements.
- Reaching major Factory Levels.
- Improving factory efficiency.
- Discovering rare content.
- Preparing for rebirth.
- Completing milestone objectives.

These systems provide direction without restricting player choice.

---

# Gameplay Flow

The intended sequence is:

```text
Player reviews available objectives

↓

Player selects a personal goal

↓

Gameplay naturally supports that objective

↓

Progress towards the goal becomes visible

↓

The player reaches meaningful milestones

↓

New goals become available

↓

Long-term progression becomes self-directed
```

The player should feel that every session contributes towards something meaningful.

---

# User Interface Behaviour

The interface should help players understand:

- Available objectives.
- Current progress.
- Completed goals.
- Upcoming rewards.
- Suggested next milestones.

Progress should be easy to follow without becoming overwhelming.

The interface should encourage players to set their own priorities.

---

# Audio & Visual Feedback

Completing meaningful objectives should feel memorable.

Examples include:

- Achievement celebrations.
- Collection completion effects.
- Milestone notifications.
- Progress animations.
- Reward presentations.

Major accomplishments should feel distinct from everyday gameplay.

---

# Educational Purpose

This milestone teaches the player that:

- Progression extends beyond unlocking mechanics.
- Personal goals are an important part of the game.
- Multiple progression paths can be pursued simultaneously.
- Long-term planning is rewarding.

The player should begin thinking beyond immediate upgrades and instead focus on broader accomplishments.

---

# Developer Intent

This milestone exists to shift motivation from externally driven progression to internally driven progression.

By this stage, the player understands the mechanics of the game.

The challenge is no longer learning how to play.

The challenge becomes deciding what to achieve.

Different players should naturally gravitate towards different objectives, creating a more personal and engaging experience.

Long-term goals should remain relevant throughout the lifetime of the game and continue expanding through future updates.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Chooses a long-term objective.
- Understands that multiple progression paths exist.
- Feels motivated to continue playing.
- Begins planning future achievements.
- Develops personal goals beyond immediate upgrades.

---

# Transition

After spending time pursuing long-term goals, the player eventually encounters the first major progression decision.

They begin asking:

> "Is there a way to become permanently stronger?"

This question introduces **2.10 First Rebirth**, where the player experiences the game's first prestige mechanic and learns that sacrificing short-term progress can unlock long-term growth.

---

# Related Sections

- 1.5 Player Experience Goals
- 2.8 First Discovery
- 2.10 First Rebirth
- Volume III – Achievement System
- Volume III – Collection Log
- Volume III – Milestones
- Volume III – Factory Levels

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Long-Term Goal specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |
---

## 2.10 First Rebirth

> The exact eligibility, payout, reset/retention matrix and permanent perks are now Defined in 3.17. Generic examples below are illustrative only; XP, Pickaxes and materials are retained.

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-010
>
> **Implementation Status:** ⚪ Not Started
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** There is no rebirth eligibility, confirmation, reset or reward flow. The development save-reset button is not rebirth.
>
> **Player Milestone:** First Rebirth
>
> **Prerequisite:** First Long-Term Goal
>
> **Next Milestone:** Long-Term Progression

---

# Purpose

This milestone introduces the player's first rebirth.

The rebirth represents the largest progression decision the player has encountered.

For the first time, the player is asked to willingly sacrifice short-term progress in exchange for permanent long-term growth.

The objective is to transform rebirth from feeling like a reset into feeling like an achievement.

---

# Design Philosophy

Rebirth should never feel like punishment.

Instead, it should represent the completion of one chapter of the player's journey and the beginning of another.

The player should feel excited to rebirth because they understand the long-term benefits that will become available.

Progress is not being lost.

Progress is being converted into future strength.

---

# Intended Player Experience

The player should experience:

- Pride.
- Excitement.
- Curiosity.
- Anticipation.
- Confidence.

The player should understand that everything they have learned will allow them to progress faster during the next cycle.

The rebirth should create optimism rather than hesitation.

---

# System Overview

The rebirth system introduces permanent progression that extends beyond a single factory.

The player learns that progression exists on multiple layers.

Examples include:

- Permanent bonuses.
- New progression opportunities.
- Faster future growth.
- Access to previously unavailable content.
- Long-term account progression.

The first rebirth establishes a gameplay loop that can continue throughout the lifetime of the game.

---

# Gameplay Flow

The intended sequence is:

```text
Player reaches rebirth requirements

↓

Player reviews rebirth rewards

↓

Player decides to rebirth

↓

Payout is calculated from current Cash before reset

↓

Only the Reference H reset fields are cleared; retained progress stays intact

↓

Player begins a new factory

↓

Early progression feels noticeably faster

↓

Player starts planning the next rebirth
```

The player should immediately notice the value of having rebirthed.

---

# User Interface Behaviour

The rebirth interface should clearly communicate:

- What will reset.
- What will remain.
- Permanent rewards.
- Rebirth benefits.
- Confirmation before proceeding.

The player should never feel uncertain about the consequences of rebirth.

Transparency is essential.

---

# Audio & Visual Feedback

The first rebirth should feel like a major achievement.

Examples include:

- Large visual celebration.
- Distinctive sound effects.
- Transition animation.
- Permanent reward presentation.
- New progression indicators.

This should feel significantly more important than purchasing an upgrade or unlocking a new building.

---

# Educational Purpose

This milestone teaches the player that:

- Temporary progress can create permanent growth.
- Progression exists on multiple layers.
- Repeating the early game can be rewarding.
- Knowledge becomes increasingly valuable.

The player should recognise that each rebirth represents another opportunity to build a better factory.

---

# Developer Intent

The rebirth system exists to extend the lifespan of the game without invalidating previous achievements.

The player's understanding of the game should become one of their greatest advantages.

The second factory should not simply be faster because of permanent bonuses.

It should also be faster because the player now understands:

- Better layouts.
- Better upgrade priorities.
- Better optimisation.
- Better long-term planning.

The rebirth system should reward both permanent progression and player knowledge.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Completes their first rebirth.
- Understands the value of permanent progression.
- Feels excited to begin again.
- Immediately notices faster progression.
- Begins planning future rebirths.

---

# Transition

After completing the first rebirth, the player has experienced every major progression mechanic introduced within Version 1.0.

The focus now shifts away from individual milestones.

Instead, the player enters a continuous gameplay cycle centred around:

- Expansion.
- Optimisation.
- Discovery.
- Collection.
- Mastery.
- Future updates.

This begins **2.11 Long-Term Progression**, where the player's journey becomes self-directed and continually evolves as the game expands.

---

# Related Sections

- 1.3 Design Philosophy
- 2.9 First Long-Term Goal
- 2.11 Long-Term Progression
- Volume III – Rebirth System
- Volume III – Permanent Progression
- Volume III – Progression Loops

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Rebirth specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---
## 2.11 Long-Term Progression

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL2-011
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Repeated production, upgrades, collection and level milestones already support ongoing play. The full cycle involving expansion, rebirth and permanent growth has not been implemented.
>
> **Player Milestone:** Long-Term Progression
>
> **Prerequisite:** First Rebirth
>
> **Next Milestone:** None (Ongoing Gameplay)

---

# Purpose

This section defines the intended long-term player experience after every major Version 1.0 gameplay system has been introduced.

Unlike previous milestones, this chapter does not represent a single event.

Instead, it describes the ongoing gameplay experience that encourages players to continue returning to Everything Factory Incremental over hundreds of hours.

The objective is to ensure that progression remains engaging long after the player understands the core mechanics of the game.

---

# Design Philosophy

Long-term progression should never become repetitive simply because numerical values continue increasing.

Instead, the player should continue finding new reasons to improve, experiment and expand.

The game should reward:

- Curiosity.
- Planning.
- Optimisation.
- Collection.
- Experimentation.
- Mastery.

The player should feel that every session contributes towards a meaningful long-term objective.

---

# Intended Player Experience

The player should experience:

- Continuous progression.
- Freedom.
- Ownership.
- Discovery.
- Achievement.
- Mastery.
- Excitement for future updates.

Rather than feeling that they have "finished" the game, the player should feel that they have reached a stage where they can define their own objectives.

---

# System Overview

At this point, every major gameplay system introduced in Version 1.0 should now work together as a unified progression experience.

The player's gameplay naturally alternates between:

- Expanding the factory.
- Improving efficiency.
- Discovering new mechanics.
- Completing collections.
- Unlocking achievements.
- Rebirthing.
- Pursuing personal goals.

Progression should feel interconnected rather than separated into isolated systems.

---

# Gameplay Flow

The intended long-term gameplay cycle is:

```text
Set Personal Goal

↓

Expand Factory

↓

Optimise Production

↓

Discover New Opportunities

↓

Complete Objectives

↓

Rebirth

↓

Unlock Permanent Progress

↓

Return Stronger

↓

Set A Bigger Goal
```

Unlike earlier milestones, this cycle has no intended conclusion.

Each completion naturally creates the next objective.

---

# User Interface Behaviour

The interface should increasingly support long-term gameplay by making important information easy to monitor.

Examples include:

- Goal tracking.
- Collection progress.
- Achievement completion.
- Factory statistics.
- Progress summaries.
- Rebirth preparation.

The interface should help players manage increasingly complex progression without becoming overwhelming.

---

# Audio & Visual Feedback

Long-term progression should remain visually rewarding.

Examples include:

- Larger factories.
- More active production lines.
- Rare discovery celebrations.
- Achievement effects.
- Collection milestones.
- Rebirth celebrations.

The world should visibly reflect the player's continued progression.

The player's factory should feel substantially different from where it began.

---

# Educational Purpose

This milestone teaches the player that:

- There is always another objective.
- Progression exists on multiple layers.
- Knowledge continues increasing alongside permanent upgrades.
- Every gameplay system supports long-term progression.
- Future updates will naturally expand existing mechanics rather than replacing them.

The player should understand that mastery is an ongoing journey.

---

# Developer Intent

This milestone represents the fulfilment of the design vision established within Volume I.

By this stage, the player should no longer require the game to dictate every objective.

Instead, the player should naturally identify opportunities for improvement based upon their own interests and preferred playstyle.

One player may pursue complete collections.

Another may build the most efficient factory possible.

Another may chase rare discoveries.

Another may prepare for future updates.

None of these goals should be considered more correct than another.

The purpose of Everything Factory Incremental is not to force a single path.

The purpose is to provide a continually expanding sandbox of meaningful progression where players always feel there is another objective waiting to be achieved.

---

# Success Criteria

Long-term progression has achieved its objective if players:

- Continue returning after completing major milestones.
- Regularly set new personal goals.
- Feel motivated to improve their factory.
- Continue discovering meaningful content.
- Look forward to future updates.
- Recommend the game to others because of the depth of progression.

---

# Transition

Volume II concludes at this point.

The player journey has now progressed from:

- Learning the basics.
- Building an automated factory.
- Discovering deeper mechanics.
- Pursuing long-term mastery.

The remaining volumes no longer focus on the player's experience.

Instead, they define the systems, mechanics and technical implementation that make this journey possible.

The reader should now continue to **Volume III – Gameplay Specification**, where each gameplay system is documented in complete technical detail.

---

# Related Sections

- Volume I – Project Foundation
- Volume III – Gameplay Specification
- Volume VI – Project Management

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Long-Term Progression specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

# Volume III - Gameplay Specification

> Volume overview status tables below are retained September planning snapshots. Use the current chapter contract and roadmap for current design/implementation status; Defined design never implies implementation completion.



> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Volume ID:** VOL3
>
> **Purpose:** Define every gameplay system, mechanic and gameplay rule that exists within Everything Factory Incremental.
>
> Systems are documented in the order they are introduced to the player rather than alphabetically.
>
> This volume should provide sufficient detail for a developer to implement every gameplay mechanic without requiring additional clarification.

---

# Overview

Volume III documents the complete gameplay specification for Everything Factory Incremental.

Unlike Volume II, which focuses on the player's journey, this volume focuses on the systems that create that journey.

Each chapter explains:

- Why the system exists.
- How the system behaves.
- How it interacts with other gameplay systems.
- What player behaviours it is designed to encourage.
- Important balancing considerations.
- Future expansion opportunities.

Every gameplay mechanic introduced in Version 1.0 should be fully documented within this volume.

---

# Volume Structure

Gameplay systems are organised into logical parts based on their role within the game.

## Part I — Core Gameplay

Introduces the fundamental gameplay loop that every player experiences.

Topics include:

- Gameplay Loop
- Manual Mining
- Resource System
- Inventory System
- Economy System
- Shop System

---

## Part II — Factory Systems

Documents the systems responsible for automation and factory construction.

Topics include:

- Production Buildings
- Conveyor System
- Processing System
- Factory Layout
- Automation System
- Factory Expansion

---

## Part III — Progression Systems

Documents systems responsible for long-term player progression.

Topics include:

- Resource Progression
- Factory Levels
- Milestones
- Achievements
- Collection Log
- Rebirth
- Offline Progression

---

## Part IV — Supporting Systems

Documents gameplay systems that support, monitor and enhance the player's experience.

Topics include:

- Statistics System
- User Interface Behaviour
- Notification System
- Saving & Loading (Gameplay Perspective)

---

# Implementation Coverage by Chapter

The chapter statuses below cover the broader designs. Completed current components are itemised in the Implementation Status Review above and in each chapter's implementation note.

| Chapter | Implementation status |
|---------|-----------------------|
| 3.2 Core Gameplay Loop | 🟠 In Progress |
| 3.3 Manual Mining System | 🟠 In Progress |
| 3.4 Resource System | 🟢 Completed |
| 3.5 Inventory System | 🟠 In Progress |
| 3.6 Economy System | 🟠 In Progress |
| 3.7 Shop System | 🟠 In Progress |
| 3.8 Production Building System | 🟠 In Progress |
| 3.9 Factory Layout System | ⚪ Not Started |
| 3.10 Automation System | 🟠 In Progress |
| 3.11 Factory Expansion System | ⚪ Not Started |
| 3.12 Resource Progression System | 🟠 In Progress |
| 3.13 Factory Level System | 🟠 In Progress |
| 3.14 Milestone System | 🟠 In Progress |
| 3.15 Achievement System | 🟠 In Progress |
| 3.16 Collection Log System | 🟠 In Progress |
| 3.17 Rebirth System | ⚪ Not Started |
| 3.18 Offline Progression System | ⚪ Not Started |
| 3.19 Player Statistics System | 🟠 In Progress |
| 3.20 User Interface Behaviour | 🟠 In Progress |
| 3.21 Notification System | 🟠 In Progress |
| 3.22 Saving & Loading Behaviour | 🟠 In Progress |

---

# Planned Chapters

## Introduction

# 3.1 Volume Overview

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.1

---

# Purpose

This chapter defines the purpose, scope and structure of Volume III.

It explains what information is contained within this volume, how gameplay systems are documented, and the standards that should be followed when creating or maintaining gameplay specifications.

---

# Overview

Volume III serves as the complete gameplay specification for Everything Factory Incremental.

While previous volumes define the project's vision and the intended player experience, this volume documents the gameplay systems responsible for creating that experience.

Each chapter focuses on a single gameplay system, describing its purpose, behaviour, interactions and design intent.

The objective of this volume is to ensure that every gameplay mechanic can be understood, implemented and maintained consistently throughout the lifetime of the project.

---

# Objectives

Volume III aims to:

- Document every gameplay system introduced throughout the game.
- Define the intended behaviour of each gameplay mechanic.
- Explain how gameplay systems interact with one another.
- Record the design reasoning behind major gameplay decisions.
- Provide a single authoritative reference for gameplay behaviour.
- Reduce ambiguity during development by defining expected behaviour before implementation.

---

# Scope

This volume documents gameplay systems only.

Examples include:

- Resource management
- Economy
- Inventory
- Factory construction
- Automation
- Progression
- Player statistics
- Achievements
- Rebirth
- Supporting gameplay systems

Implementation details such as data structures, networking, optimisation, save formats and source code architecture are documented separately within Volume V.

---

# Design Philosophy

Gameplay systems should be documented from a design perspective rather than an implementation perspective.

Each chapter should explain:

- Why the system exists.
- What problem it solves.
- How the player interacts with it.
- How it contributes to the overall gameplay loop.
- How it interacts with other gameplay systems.
- What behaviours are considered correct.

Where possible, documentation should describe intended behaviour rather than hardcoded values.

Balance values, timings and numerical tuning may evolve throughout development, while the underlying purpose and behaviour of a system should remain stable.

---

# System Documentation Standard

Unless otherwise unnecessary, gameplay system chapters should follow a consistent structure.

Typical sections include:

1. Purpose
2. Overview
3. Design Goals
4. Gameplay Rules
5. Player Experience
6. System Behaviour
7. Dependencies
8. System Interactions
9. Balancing Considerations
10. Future Expansion
11. Developer Notes
12. Related Sections
13. Revision History

Not every gameplay system requires every section.

However, consistency should be prioritised wherever practical.

---

# Relationships Between Volumes

This volume builds upon previous documentation.

Volume I defines why the game exists.

Volume II defines how the player experiences the game.

Volume III defines the gameplay systems responsible for creating that experience.

Volume V describes how those gameplay systems are implemented from a technical perspective.

Each volume should complement the others without duplicating information.

---

# Success Criteria

Volume III is considered complete when:

- Every gameplay system has been documented.
- Every gameplay rule has been defined.
- System interactions are clearly described.
- Gameplay behaviour can be understood without reference to source code.
- Future developers can implement gameplay systems consistently using this documentation.

---

# Related Sections

- Volume I – Project Foundation
- Volume II – Player Journey
- Volume V – Technical Specification

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial section created. |

# 3.2 Core Gameplay Loop

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.2
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Mining, inventory, manual/automatic smelting, Cash, upgrades, XP, levels and discovery form an implemented loop. Factory networks, expansion and rebirth are absent.

---

# Purpose

This chapter defines the primary gameplay loop of Everything Factory Incremental.

The gameplay loop represents the continuous cycle of player actions that drives progression throughout the game. Every gameplay system documented within this volume should either contribute to, expand upon or enhance this loop.

---

# Responsibilities

The Core Gameplay Loop is responsible for:

- Defining the primary gameplay cycle.
- Establishing the order in which gameplay systems interact.
- Providing the foundation for player progression.
- Guiding the design of future gameplay systems.
- Ensuring every gameplay system contributes to player progression.

The Core Gameplay Loop is not responsible for:

- Defining individual gameplay systems.
- Balancing specific mechanics.
- Managing resources or currencies.
- Implementing player progression directly.

---

# Overview

Everything Factory Incremental is built around a continuously expanding optimisation loop.

Players begin by manually gathering resources before gradually replacing manual interaction with automated factory production.

As new systems are introduced, the gameplay loop becomes increasingly complex while retaining the same fundamental objective: improve production efficiency to unlock greater progression.

Every gameplay system should reinforce at least one stage of the gameplay loop.

---

# Design Intent

The gameplay loop is designed to create a constant feeling of forward momentum.

Each completed cycle should result in one or more meaningful outcomes:

- Increased production.
- Greater efficiency.
- Access to new content.
- Improved automation.
- Long-term progression.

The player should rarely feel as though they are repeating identical actions without making measurable progress.

---

# Core Gameplay Loop

At its highest level, the gameplay loop consists of the following stages.

```
Acquire Resources
        ↓
Process Resources
        ↓
Generate Currency
        ↓
Purchase Improvements
        ↓
Increase Production
        ↓
Unlock New Content
        ↓
Optimise Factory
        ↓
Repeat
```

This loop remains consistent throughout the entire game.

As progression systems are introduced, each stage expands rather than being replaced.

---

# Gameplay Loop Evolution

## Stage One — Manual Play

The player performs every task manually.

```
Mine

↓

Collect

↓

Sell

↓

Purchase Upgrades

↓

Repeat
```

Focus:

- Learning controls.
- Understanding resource value.
- Introducing progression.

---

## Stage Two — Early Automation

Simple factory buildings begin producing resources automatically.

```
Mine

+

Factory Production

↓

Collect Resources

↓

Sell

↓

Expand Factory

↓

Repeat
```

Focus:

- Reducing repetitive manual actions.
- Introducing optimisation.
- Teaching factory construction.

---

## Stage Three — Factory Growth

Automation becomes the primary method of progression.

```
Automated Production

↓

Resource Processing

↓

Generate Income

↓

Purchase Better Equipment

↓

Increase Efficiency

↓

Expand Factory

↓

Repeat
```

Focus:

- Production scaling.
- Factory optimisation.
- Strategic decision making.

---

## Stage Four — Long-Term Progression

Progress shifts towards optimisation rather than simple expansion.

```
Optimise

↓

Unlock New Systems

↓

Complete Collections

↓

Earn Achievements

↓

Rebirth

↓

Improve Permanent Progress

↓

Repeat
```

Focus:

- Long-term goals.
- Meta progression.
- Replayability.

---

# Relationship to Gameplay Systems

Every gameplay system introduced within this volume should support at least one stage of the Core Gameplay Loop.

Examples include:

| System | Supports |
|---------|----------|
| Resource System | Acquire Resources |
| Inventory System | Store Resources |
| Economy System | Generate & Spend Currency |
| Shop System | Purchase Improvements |
| Production Building System | Increase Production |
| Factory Expansion System | Optimise Factory |
| Achievement System | Long-Term Progression |
| Rebirth System | Repeat the Gameplay Loop |

No gameplay system should exist in isolation.

Each system should provide value by strengthening one or more stages of the gameplay loop.

---

# Design Principles

The gameplay loop should always encourage:

- Continuous progression.
- Meaningful player decisions.
- Visible improvement.
- Increasing efficiency.
- Discoverability.
- Long-term engagement.

Systems that interrupt or unnecessarily slow the gameplay loop should be carefully evaluated before implementation.

---

# Future Expansion

Future gameplay systems should integrate naturally into the existing gameplay loop rather than replacing it.

Where possible, new mechanics should expand existing stages instead of introducing entirely separate progression paths.

This approach maintains a cohesive gameplay experience while allowing the game to grow over time.

---

# Related Sections

- 3.3 Manual Mining System
- 3.4 Resource System
- 3.6 Economy System
- 3.8 Production Building System
- 3.17 Rebirth System

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial gameplay loop specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

# Part I — Core Gameplay

# 3.3 Manual Mining System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 2 — Mining Power

- **Exact effect per level:** +2 raw power units per shop level, equivalent to +0.5 expected resources per manual click. Maximum level is 75.

- **Confirm whether it stays the same effect for all 50 levels:** Yes. The increase is unchanged across all 75 levels. Retained Cash pricing is RawCost(L) = 250 × 1.38^(L−1).

- **Exact Mining Power formula:** TotalMiningPower = 0.25 × (EquippedPickaxePower + 2 × ShopMiningPowerLevel). Award floor(TotalMiningPower), plus one additional base resource with probability equal to its fractional part.

- **Confirm how Shop Mining Power combines with Pickaxe Power:** Add the equipped Pickaxe's full-precision raw power and the shop contribution before multiplying by 0.25. Use one shop Mining Power stat. Mining Duplication is applied afterward to each eligible resource.

### Decision 3 — Mining Luck

- **Exact luck increase per level:** +5% of base manual Luck per level; this adds 0.05 to the multiplier, not five percentage points to an ore's drop chance.

- **Exact Shop Mining Luck multiplier formula:** ShopMiningLuck = 1 + 0.05 × Level. Maximum 150 levels gives 8.5×. Raw Cash cost to buy level L = 100 × 1.20^(L−1). The earlier 500-level draft is superseded.

- **Confirm how it combines with Pickaxe Luck:** FinalManualLuck = ShopMiningLuck × EquippedPickaxeLuck. This affects both accessible manual ore-tier selection and within-tier selection. It does not affect automated Miners.

### Decision 4 — Pickaxe progression

- **Exact number of Pickaxe tiers:** Eight crafted Pickaxe tiers plus the permanent Default Pickaxe, which is Tier 0.

- **Exact Pickaxe names/order:** Default → Amber → Malachite → Citrine → Aquamarine → Spinel → Emerald → Onyx → Diamond.

- **Exact ore tier unlocked by each Pickaxe:** Default: Stone/T1/T2. Amber: adds T3. Malachite: adds T4. Remaining V1 Pickaxes improve power, Luck and durability without adding a V1 ore tier.

- **Exact crafting recipe for each Pickaxe:** Each crafted Pickaxe requires 32 of its named ore plus its fixed material ingredient. The complete recipes and repair quantities are in Reference A.

- **Confirm whether every Pickaxe requires 32 total ores or 32 of each required ore:** 32 total ores per craft. The adopted recipes each use one named ore, so each requires 32 of that ore.

- **Exact amount of crafting material required:** Amber 8 Wood; Malachite 16 Wood; Citrine 32 Wood; Aquamarine 12 Scrap; Spinel 24 Scrap; Emerald 48 Scrap; Onyx 16 Metal; Diamond 32 Metal. These replace the old 18–48 generic range.

- **Exact source of the separate crafting material:** Manual mining performs one 15% material roll per click, after choosing the resource and base quantity. On success, replace one base resource with one material. Conditional material selection: Wood 60%, Scrap 30%, Metal 10%. Materials cannot be duplicated. The first guaranteed Stone is exempt.

- **Exact Pickaxe Power for each tier:** PickaxePower(k) = 4 × 1.75^k, where k = 0…8. Preserve full precision internally; display may round to two decimals. Reference A lists the exact values.

- **Exact Pickaxe Luck for each tier:** PickaxeLuck(k) = 1 + 2.5k. Default 1×; Amber 3.5×; Malachite 6×; Citrine 8.5×; Aquamarine 11×; Spinel 13.5×; Emerald 16×; Onyx 18.5×; Diamond 21×. It is additive, not repeated ×2.5 scaling.

- **Exact Pickaxe durability for each tier:** Default is infinite. Crafted tier k has base durability 500k. RoundedMax = floor((500k × (1 + 0.05 × DurabilityLevel))/100) × 100. The permanent durability perk has 100 levels. One manual click consumes one hit, regardless of output.

- **What happens when a Pickaxe reaches 0 durability:** The copy remains in inventory, broken with 0 durability. Equip the highest-tier usable owned copy; ties use greatest remaining durability, then most recently manually equipped copy, then oldest inventory ID. Auto-equipping does not update the last-manually-equipped record.

- **Can Pickaxes be repaired:** Only broken Pickaxes can be repaired. Each ingredient costs ceil(OriginalCraftRequirement × 0.95). A repair restores the current upgraded rounded maximum. Partially damaged Pickaxes cannot be repaired.

- **Can multiple Pickaxes be owned:** Yes. Save separate copies with their tier, remaining durability, broken state and equipment history. Only one is equipped.

- **Can old Pickaxes be re-equipped:** Yes, if the owned copy is not broken. Default is the final fallback.

### Decision 5 — Manual mining ore availability

- **Exact rule for which ore tiers each Pickaxe can access:** Ore tier r is accessible when r ≤ PickaxeTier + 2; cap at T4 for V1. Set locked weights to 0 before Luck adjustment and normalization.

- **Confirm whether the “Pickaxe 2 tiers before ore tier” rule is final:** Yes. Tier 0 Default reaches T2, crafted Tier 1 reaches T3, and crafted Tier 2 reaches T4.

- **Confirm what the default Pickaxe can mine:** Stone, T1 and T2, except that the first-ever fresh-save click guarantees Stone.

- **Confirm whether Luck can ever bypass Pickaxe ore locks:** No. A locked tier always has zero probability, regardless of Luck.

## Reference A Pickaxe catalogue and manual mining

### Complete recipes and stats

Power values below are the exact stored mathematical values; the UI may show two decimals. Base durability excludes the permanent durability perk. Repair materials are calculated with ceil(recipe × 0.95); every repair also requires 31 of the named ore. Repairs are available only when broken.

| k | Pickaxe | Craft ore | Craft material | Exact raw power | Luck | Base hits | Repair material | Highest V1 ore tier |
|---:|---|---|---|---:|---:|---:|---|---|
| 0 | Default | Free | None | 4 | 1× | Infinite | N/A | T2 |
| 1 | Amber | 32 Amber | 8 Wood | 7 | 3.5× | 500 | 8 Wood | T3 |
| 2 | Malachite | 32 Malachite | 16 Wood | 12.25 | 6× | 1000 | 16 Wood | T4 |
| 3 | Citrine | 32 Citrine | 32 Wood | 21.4375 | 8.5× | 1500 | 31 Wood | T4 |
| 4 | Aquamarine | 32 Aquamarine | 12 Scrap | 37.515625 | 11× | 2000 | 12 Scrap | T4 |
| 5 | Spinel | 32 Spinel | 24 Scrap | 65.65234375 | 13.5× | 2500 | 23 Scrap | T4 |
| 6 | Emerald | 32 Emerald | 48 Scrap | 114.8916015625 | 16× | 3000 | 46 Scrap | T4 |
| 7 | Onyx | 32 Onyx | 16 Metal | 201.060302734375 | 18.5× | 3500 | 16 Metal | T4 |
| 8 | Diamond | 32 Diamond | 32 Metal | 351.85552978515625 | 21× | 4000 | 31 Metal | T4 |

### Permanent durability upgrade

Defined maximum 100 levels, effect +5% of base maximum per level, for a maximum 6× base durability before rounding. StardustCost(L) = round(1,000 × 1.10^(L−1)); total 137,796,124 Stardust.

RawMax = BaseDurability × (1 + 0.05 × DurabilityLevel).  
RoundedMax = floor(RawMax/100) × 100.

RoundedMax is the actual usable maximum. Some early levels have no immediate effect on weaker Pickaxes: Amber's maximum remains 500 at perk levels 1–3 and becomes 600 at level 4.

When a usable copy's maximum increases, add NewRoundedMax−OldRoundedMax to its remaining durability. This preserves damage already taken. A broken copy remains at 0, regardless of the maximum increase. Repair restores its current RoundedMax. Rebirth keeps the perk and all remaining/broken states.

### Material generation and awards

A click rolls one base resource type, then calculates the integer base quantity by probabilistic rounding of TotalMiningPower. Perform one 15% material substitution roll for the click; on success replace exactly one base resource with one material. Conditional material probabilities are Wood 60%, Scrap 30%, Metal 10%, giving overall per-click chances 9%, 4.5% and 1.5%.

After substitution, independently duplicate each remaining mineable resource at the Mining Duplication chance. Do not duplicate materials. One click consumes one durability regardless of ore amount, duplicated copies or material substitution.

Latest recommended material XP before applicable normal gameplay XP modifiers: Wood 5, Scrap 15, Metal 50 per material. These numbers retain their recommended status pending canon approval. Materials count toward Total Resources Gathered and their own counters, not ore-specific counters.

### Manual tier and ore selection

FinalManualLuck = (1 + 0.05 × ShopMiningLuckLevel) × (1 + 2.5k).

Max Shop Mining Luck = 8.5×; Diamond gives 21×, so maximum from these two sources is 178.5×. Mining Luck resets on Rebirth; the crafted Pickaxe remains.

Base manual weights:

| Bucket | Base weight | Manual Luck exponent |
|---|---:|---:|
| Stone | 239,744 | 0.00 |
| T1 | 10,000 | 0.35 |
| T2 | 250 | 0.70 |
| T3 | 5 | 1.05 |
| T4 | 1 | 1.40 |

Set inaccessible bucket weights to 0. Adjust each available weight by FinalManualLuck^exponent, then divide by the sum of available adjusted weights. Do not clamp manual Stone chance.

When all tiers are accessible at 1× Luck, probabilities are Stone 95.8976%, T1 4%, T2 0.1%, T3 0.002%, T4 0.0004%. When tiers are locked, normalization changes the available probabilities.

After choosing a non-Stone tier, lock that tier. Its five ores use BaseOreWeight(i)=0.65^(i−1), with Luck exponent 0.1×(i−1), i=1…5 ordered from cheapest to most expensive. Multiply by FinalManualLuck^exponent, then normalize within that tier. Rebirth Ore Luck and local Miner Ore Luck are not used in manual mining.

Order: select Pickaxe-accessible pool → calculate manual Luck → roll tier → roll ore within the locked tier → resolve Mining Power quantity → perform one material substitution roll → duplicate remaining resources independently → award output and statistics.

---

# 3.4 Resource System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

V1 includes Stone, the 20 ores below, and Wood/Scrap/Metal crafting materials. Resource acquisition, processed output and discovery are distinct events. Material substitution and duplication ordering are in Reference A. Material Factory XP values remain Recommended in Reference K; do not use them as approved awards. Ore tiers beyond T4 and mutation definitions are not supplied by this catalogue.

### V1 ore catalogue

The retained ore values and XP are from the reference catalogue. Position 1–5 orders within-tier weights from cheapest to most expensive. Tier rarity in this catalogue is a manual base tier-hit rarity, not the chance of each individual ore and not a Miner progression row.

| Resource | Tier | Position | Base Cash value | Base resource XP |
|---|---|---:|---:|---:|
| Stone | Common | N/A | $1 | 1 |
| Amber | T1 | 1 | $10 | 5 |
| Quartz | T1 | 2 | $20 | 5 |
| Topaz | T1 | 3 | $30 | 5 |
| Amethyst | T1 | 4 | $40 | 5 |
| Malachite | T1 | 5 | $50 | 5 |
| Citrine | T2 | 1 | $250 | 25 |
| Garnet | T2 | 2 | $500 | 25 |
| Peridot | T2 | 3 | $750 | 25 |
| Jade | T2 | 4 | $900 | 25 |
| Aquamarine | T2 | 5 | $1,000 | 25 |
| Spinel | T3 | 1 | $5,000 | 100 |
| Tourmaline | T3 | 2 | $10,000 | 100 |
| Sapphire | T3 | 3 | $15,000 | 100 |
| Ruby | T3 | 4 | $20,000 | 100 |
| Emerald | T3 | 5 | $25,000 | 100 |
| Onyx | T4 | 1 | $50,000 | 1000 |
| Tanzanite | T4 | 2 | $75,000 | 1000 |
| Alexandrite | T4 | 3 | $100,000 | 1000 |
| Black Opal | T4 | 4 | $150,000 | 1000 |
| Diamond | T4 | 5 | $250,000 | 1000 |

Collection discoveries persist independently of consumable inventory. The inherited prototype's collection catalogue contains the 20 ores; Stone/material statistics do not automatically create new ore-collection entries.

---

# 3.5 Inventory System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 16 — Refiner refined-ore inventory

- **How are Refine 1–15 ores stored:** Maintain ore ID, processing state, Refine Count and value-defining metadata. Refined stacks cannot lose the original pre-Refiner value.

- **Separate inventory stack for every Refine level:** Yes. Distinguish Refine Counts 1–15 and any differing pre-Refiner value cohorts. Raw, Polished and Refined resources have separate inventory tabs.

- **Or one stack with metadata:** Use structured stack records with metadata; do not merge different counts or incompatible values into one undifferentiated quantity.

- **How does the player choose which Refine level to send back through the Refiner:** The player selects ore type and current Refine Count. Polished is count 0; a successful surviving pass returns count n+1. Count 15 cannot enter again. Reserve input when the cycle starts.

- **How does the Furnace choose which Refine level to sell:** Manual selling selects a visible stack. Auto Furnace selects highest final sale value first, using a stable ore-ID/Refine-Count tie break, and reserves input/value for its active batch.

Keep separate Pickaxe copies, durability/broken/equip history and materials per Reference A. Use raw, Polished and Refined resource tabs; preserve pre-Refiner value and metadata when grouping compatible cohorts. Do not collapse unlike refined value bases. Collection remains independent from spendable inventory. Active reservations must survive save/reload and cannot also be available for another transaction. Inventory capacity remains DESIGN REQUIRED, not an invented cap.

---

# 3.6 Economy System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

Cash is earned through Furnace sales and spent on approved purchases. Raw ore values are in 3.4; processing and Furnace multipliers in References C–E. Use immutable pre-Refiner value for repeated passes. Calculate prices from the original formula, eligible discount, then the exact Cash rounding bands in Reference E. Resale uses half actual qualifying Cash paid, rounded down; separately record refunds and earnings. Migration reconstruction is the explicit exception in Reference I.

Stardust comes from Rebirth and the defined Weekly reward; Gem Dust comes from Refiners. These are distinct currencies with distinct precision rules. Gems/Ancient Shards are not active V1 requirements. Ore Value on Stone and challenge Cash/XP precision remain Open.

---

# 3.7 Shop System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 1 — Unlock Miner upgrade

- **Exact cash cost:** $100 Cash. This unlock is separate from the $100 purchase of a Tier 1 Miner. Factory Purchase Discount does not reduce the shop unlock fee.

- **Confirm this is the first required Upgrade Shop purchase:** No. The latest opening order is guaranteed first Stone → first Furnace sale → Mining Power I → Unlock Miner → purchase first Miner → automated production.

- **Confirm Mining Power is not required before it:** No. Mining Power I is a required prerequisite for Unlock Miner. Enforce the prerequisite in purchase logic as well as the UI. This supersedes the earlier optional-Mining-Power opening.

### Decision 21 — Factory Purchase Discount

- **Maximum level:** 10 levels.

- **Stardust starting cost:** Latest recommended curve starts at 250,000 Stardust. It supersedes the earlier 1,000-start/×5 draft, but remains marked recommended pending canon approval.

- **Stardust cost formula:** Latest recommended Cost(L) = 250,000 × 2^(L−1). Effect: payable machine price = raw price × (1−0.05 × DiscountLevel), then apply global Cash rounding.

- **Total cost to max:** 255,750,000 Stardust for the latest recommended curve; level 10 costs 128,000,000.

- **Confirm it affects machine purchase prices:** Yes: Miner, Polisher and Refiner purchases.

- **Confirm it affects machine tier upgrades:** Yes: Miner, Polisher, Refiner and Furnace tier upgrades.

- **Confirm whether it affects Miner slots:** No. Also exclude individual Miner Ore Luck, normal shop purchases, Pickaxe crafting/repairs, materials and Rebirth upgrades.

- **Confirm whether it affects Polisher/Refiner unlock prices:** Yes for Polisher/Refiner machine purchase prices. The separate Unlock Miner shop upgrade is excluded.

## Reference J — Normal Cash Shop

### Normal Cash Shop

These are retained costs unless explicitly superseded. Apply global Cash price rounding to purchases. Factory Purchase Discount does not apply to these shop stats.

| Upgrade | Raw Cash cost to buy L | Effect at owned L | Maximum | Rebirth |
|---|---|---|---|---|
| Ore Value | 25 × 1.12^(L−1) | BaseOreValue × (1+0.05L) | Unlimited | Reset |
| Mining Power | 250 × 1.38^(L−1) | +2 raw power per level | 75 | Reset |
| Mining Luck | 100 × 1.20^(L−1) | 1+0.05L manual multiplier | 150 | Reset |
| Mining Duplication | 250 × 1.27^(L−1) | 0.005L independent chance per eligible resource | 100 levels 50% | Reset |
| Unlock Miner | $100 | Access after Mining Power I; separate Miner purchase | One per cycle | Reset |

Ore Value applies to ore values before processing. Whether Stone receives that same global modifier is not explicitly resolved; see Reference K. No separate Cash Shop Ore Luck is added.

Purchase handlers must enforce affordability, owned levels, caps and prerequisites independently of UI. Show relevant requirements in the Upgrade Shop. Unlock Miner does not grant a machine, local Miner Ore Luck is not a global shop stat, and Mining Luck affects manual rolls only. Factory Purchase Discount effect/eligibility is Defined, but its Stardust price is Recommended; do not implement purchases using that price without approval.

---

# 3.8 Production Building System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

V1 uses independent machine entities with stable identity, slot, tier, investment and processing state. Miner ≤5, Polisher ≤3, Refiner ≤1, and one permanent Furnace. Reuse working persistence and processing where compatible; the old counter-based effects are legacy behavior only. Grid integration is a separate dependent task, not a reason to invent conveyor rules.

### Decision 6 — Miner V1 maximum tier

- **Exact V1 Miner maximum tier:** Exactly Tier 25 for V1.

- **Current document says approximately 25; needs an exact number:** Tier 25 is a release-specific cap. Tier 26+ belongs to future updates; the architecture must support later expansion.

### Decision 7 — Miner base rarity progression

- **Exact Stone/T1/T2/T3/T4 probabilities for every Miner tier:** Use the recovered Miner 1–25 table in Reference B. Those stored balance entries are rounded source values; normalize them into full-precision internal probabilities.

- **Or exact formula used to generate them:** Keep the Stone anchor S exactly. Distribute 1−S among eligible ore columns proportionally, apply the recorded Overall Luck exponents, normalize, then enforce the automated 25% Stone floor. Reference B gives the complete formula.

- **Exact T1 unlock tier:** T1 is available at Miner Tier 1.

- **Exact T2 unlock tier:** T2 is available at Miner Tier 1.

- **Exact T3 unlock tier:** T3 is available at Miner Tier 1.

- **T4 unlock is currently Tier 6 — confirm:** Yes. T4 weight is 0 for Miner Tiers 1–5 and becomes eligible at Tier 6. Overall Luck never bypasses this.

- **Exact tiers where the ×7.5 upgrade-cost milestone occurs:** Tier 6 only in V1. Raw upgrade costs use ×7.5 for that target tier instead of ×4, then return to ×4. Reference B lists the recurrence and full cost table.

### Decision 8 — Future Miner ore tiers

- **Rule for introducing T5/T6/etc:** T5+ is deferred. Plan data structures to support ore tiers through at least T10, but do not create their rarity/value/unlock balance before launch. More ores are intended for future updates.

- **How future ore tiers affect Stone/T1/T2/T3/T4 probabilities:** Preserve existing Miner 1–25 balance. New Miner tiers can redistribute the remaining ore budget among old and newly unlocked tiers while Stone remains at least 25%.

- **Whether future ore-tier unlocks always create a ×7.5 cost milestone:** The retained general rule uses ×7.5 on a tier step that introduces a new ore tier, then ×4 afterward. Future unlock tiers and rarity rows remain deferred.

### Decision 9 — Stone floor

- **Confirm final Stone minimum is 25%, not 10%:** 25% for automated Miner production only. Manual mining has no artificial Stone floor.

- **Update all tests to use the same Stone floor:** Future tests must use this automated floor consistently, verify normalization, and separately verify that manual probabilities are not clamped to 25%.

### Decision 10 — Ore Luck source

- **Confirm whether V1 Ore Luck comes from:** Both permanent Rebirth Ore Luck and cash individual-Miner Ore Luck apply to automated mining. There is no separate cash Upgrade Shop stat named Ore Luck; the shop's Mining Luck affects manual mining.

- **Rebirth progression only,:** RebirthOreLuck = 1 + 0.002 × Level, capped at level 5,000 / 11×. It persists permanently.

- **individual Miner upgrades,:** IndividualMinerOreLuck = 1 + 0.02 × Level, capped at level 50 / 2×. It belongs to one Miner and is removed on resale or Rebirth.

- **or both:** Both automated sources multiply. Manual Shop Mining Luck remains a separate system.

- **If both, exact formula for combining them:** FinalMinerOreLuck = RebirthOreLuck × IndividualMinerOreLuck × InscriptionOreLuck. InscriptionOreLuck remains 1 while Inscriptions are deferred. Owning more Miners does not multiply Luck.

### Decision 11 — Miner Ore Luck

- **If individual Miners have their own Ore Luck:** Yes. Each Miner saves and upgrades its own local Ore Luck level independently.

- **How is it upgraded:** Purchase levels on that individual Miner using Cash. The stat starts at level 0 and is not preserved by Machine Tier Preservation.

- **What does it cost:** RawCost(L) = 1,000 × 1.25^(L−1); apply global Cash price rounding. Factory Purchase Discount does not apply. Record the actual payment in that Miner's resale investment.

- **Maximum level:** 50 levels.

- **Effect per level:** +2% local Ore Luck per level: 1 + 0.02L, reaching 2×. It only changes the ore chosen within an already selected tier.

### Decision 12 — Miner replacement + Tier Preservation

- **When a Miner is sold and repurchased, does Tier Preservation apply:** Yes. A replacement starts at the applicable preserved tier, while local Ore Luck starts at level 0. Selling removes the old entity; occupied slot access remains available.

- **Does Preservation apply to every machine purchase or only the first purchase after a Rebirth:** Apply Preservation to every newly purchased machine, including replacements. Apply once at creation, not on reload; increasing the perk does not automatically raise existing machines.

### Decision 13 — Miner slot purchases

- **Confirm slot prices are final:** Slot 1 free; slot 2 $10,000; slot 3 $1,000,000; slot 4 $10,000,000,000; slot 5 $1,000,000,000,000. Buying a slot makes its Miner purchasable; the Miner purchase is separate.

- **Confirm whether Factory Purchase Discount affects Miner slot prices:** No. Discount covers machine purchases and tiers, not Miner slot unlocks.

- **Confirm whether Miner slots survive Rebirth:** Yes. Purchased slot access persists; owned Miners are removed.

## Reference B Miner rarity costs and production

### Stored base balance

The following source table is the accepted recovered balance direction. Treat its Stone column as an anchor and its ore columns as relative weights to resolve small rounding discrepancies. These are not UI-rounded values to use as independent percentages without normalization.

| Miner | Stone | T1 | T2 | T3 | T4 |
|---:|---:|---:|---:|---:|---:|
| 1 | 95.898% | 4.000% | 0.100% | 0.002% | — |
| 2 | 95.086% | 4.726% | 0.185% | 0.003% | — |
| 3 | 93.439% | 6.177% | 0.378% | 0.006% | — |
| 4 | 91.203% | 8.018% | 0.768% | 0.011% | — |
| 5 | 88.480% | 10.000% | 1.500% | 0.020% | — |
| **6** | 85.344% | 12.722% | 1.908% | 0.025% | **0.0004%** |
| 7 | 81.861% | 15.134% | 2.754% | 0.250% | 0.0011% |
| 8 | 78.096% | 17.538% | 3.799% | 0.565% | 0.0021% |
| 9 | 74.119% | 19.851% | 5.048% | 0.979% | 0.0034% |
| **10** | **70.000%** | **22.000%** | **6.500%** | **1.495%** | **0.0050%** |
| 11 | 65.813% | 22.097% | 8.375% | 3.704% | 0.011% |
| 12 | 61.631% | 21.463% | 10.485% | 6.402% | 0.019% |
| 13 | 57.521% | 20.068% | 12.810% | 9.573% | 0.028% |
| 14 | 53.542% | 17.907% | 15.325% | 13.188% | 0.039% |
| **15** | **49.744%** | **15.000%** | **18.000%** | **17.206%** | **0.050%** |
| 16 | 46.165% | 14.167% | 19.364% | 20.179% | 0.125% |
| 17 | 42.830% | 13.026% | 20.650% | 23.285% | 0.208% |
| 18 | 39.754% | 11.600% | 21.853% | 26.494% | 0.299% |
| 19 | 36.939% | 9.915% | 22.969% | 29.780% | 0.397% |
| **20** | **34.383%** | **8.000%** | **24.000%** | **33.117%** | **0.500%** |
| 21 | 32.075% | 7.169% | 23.498% | 36.482% | 0.776% |
| 22 | **30.000%** | 6.241% | 22.829% | 39.864% | 1.067% |
| 23 | **28.141%** | 5.229% | 22.011% | 43.251% | 1.369% |
| 24 | **26.481%** | 4.145% | 21.062% | 46.631% | 1.680% |
| **25** | **25.000%** | **3.000%** | **20.000%** | **50.000%** | **2.000%** |

### Exact normalization procedure

For the selected Miner tier:

1. Set S = stored Stone percentage / 100.
2. Let v(r) be the listed ore-column value; locked tiers have v=0.
3. BaseOreProbability(r) = (1−S) × v(r) / sum(v).
4. AdjustedStoneWeight = S.
5. AdjustedTierWeight(r) = BaseOreProbability(r) × OverallLuck^e(r).
6. Use e(T1)=0.20, e(T2)=0.40, e(T3)=0.60, e(T4)=0.80.
7. Normalize all weights into probabilities.
8. If Stone would be below 0.25, assign Stone=0.25 and distribute 0.75 among eligible ore tiers proportionally to their adjusted weights.

T4 must remain zero before Miner Tier 6, before and after normalization. Internal probabilities sum to 1. The UI alone may adjust its largest displayed percentage by a rounding remainder so displayed values total 100%; do not change RNG probabilities to fix presentation.

### Automated within tier selection

First choose Stone/T1/T2/T3/T4 with Overall Luck. On a non-Stone outcome, lock the tier.

FinalMinerOreLuck = (1 + 0.002 × RebirthOreLuckLevel) × (1 + 0.02 × LocalMinerOreLuckLevel) × 1.

The final factor is the deferred Inscription placeholder. For the five ores within the chosen tier:

AdjustedOreWeight(i) = 0.65^(i−1) × FinalMinerOreLuck^(0.1×(i−1)).  
ConditionalProbability(i) = AdjustedOreWeight(i) / sum(AdjustedOreWeights).

The base conditional distribution is approximately 39.59% / 25.74% / 16.73% / 10.87% / 7.07%. Each Miner rolls independently; ownership count never acts as a Luck multiplier.

### Cash and speed

Purchase raw price = $100. Raw upgrade into T2 = $400. For each subsequent target tier, multiply the previous unrounded raw upgrade cost by ×4, except target T6 uses ×7.5. Return to ×4 at T7. No other V1 ore-tier milestone exists.

CalculatedTierInterval = max(0.1, 5 × 0.96^(Tier−1)).  
FinalMinerInterval = max(0.1, CalculatedTierInterval × (1−0.01 × RebirthMinerSpeedLevel)).

One normal cycle produces one base resource, subject to future duplication only when the normal tier speed curve has reached its floor. The +1% duplication per subsequent tier, guaranteed copies per whole 100%, and fractional extra-copy roll are retained future architecture; they do not activate within V1's 25 tiers. Rebirth speed does not move that tier-based breakpoint.

Cash investment records include actual purchase, paid tier upgrades and local Ore Luck payments. Resale requires confirmation and refunds floor(0.50 × ActualQualifyingCashInvestment). Free preserved tiers and permanent Stardust upgrades do not create refund investment.


### Miner raw purchase and upgrade table

Normal seconds exclude Rebirth speed. Cash prices are before discount/global rounding. Tier 1 is a purchase; later rows are the cost to upgrade into that target tier.

| Tier | Raw Cash price | Normal seconds |
|---:|---:|---:|
| 1 | $100 | 5.0000 |
| 2 | $400 | 4.8000 |
| 3 | $1,600 | 4.6080 |
| 4 | $6,400 | 4.4237 |
| 5 | $25,600 | 4.2467 |
| 6 | $192,000 | 4.0769 |
| 7 | $768,000 | 3.9138 |
| 8 | $3,072,000 | 3.7572 |
| 9 | $12,288,000 | 3.6069 |
| 10 | $49,152,000 | 3.4627 |
| 11 | $196,608,000 | 3.3242 |
| 12 | $786,432,000 | 3.1912 |
| 13 | $3,145,728,000 | 3.0635 |
| 14 | $12,582,912,000 | 2.9410 |
| 15 | $50,331,648,000 | 2.8234 |
| 16 | $201,326,592,000 | 2.7104 |
| 17 | $805,306,368,000 | 2.6020 |
| 18 | $3,221,225,472,000 | 2.4979 |
| 19 | $12,884,901,888,000 | 2.3980 |
| 20 | $51,539,607,552,000 | 2.3021 |
| 21 | $206,158,430,208,000 | 2.2100 |
| 22 | $824,633,720,832,000 | 2.1216 |
| 23 | $3,298,534,883,328,000 | 2.0367 |
| 24 | $13,194,139,533,312,000 | 1.9553 |
| 25 | $52,776,558,133,248,000 | 1.8771 |

### Decision 14 — Polisher purchase behaviour

- **Is the $5,000 price for each of the three Polishers:** No. Slot 1 purchase costs $5,000; slot 2 $100,000; slot 3 $2,000,000, before discount.

- **Or does each additional Polisher have a different purchase price:** Prices are fixed by persistent slot identity. Replacing a Polisher in slot 3 still uses slot 3's price. Slot surcharges do not affect tier upgrades; every Polisher uses the same T2–T10 curve.

- **Confirm whether Polisher ownership survives Rebirth:** No. Rebirth removes Polisher ownership. The slot-specific purchase schedule still applies when rebuilding.

## Reference C Polisher behavior

Three independent slot-based Polishers, each tier 1–10, with separate selected ore, queue, cycle and investment. Only unpolished ores are valid inputs; Stone is invalid. Polished ores cannot be polished again. Multiple Polishers increase throughput, never repeatedly multiply one ore's polished value.

PolishedValue = CurrentOreValue × 1.50 × (1 + 0.0001 × RebirthPolisherValueLevel).

Apply the normal Ore Value modifier before polishing. Normal and Polished inventories remain separate.

CycleTime(T) = 7.5 × 0.799413^(T−1).  
BatchSize(T) = round(1.668101^(T−1)).  
ProcessedAmount = min(BatchSize, available selected unpolished quantity).

Tier 1 is approximately 7.5 seconds / 1 ore; tier 10 approximately 1 second / 100 ores. These inherited interpolation constants are rounded source coefficients; the intended endpoint is T10 at 1 second / 100. A partial batch is allowed; no input means Idle.

RawUpgradeCost(T) = 5,000 × 10^(T−1), for T2–T10. Slot purchase cost is separate: $5,000 / $100,000 / $2,000,000. Apply eligible discount then Cash rounding. Selling removes only that entity, refunds 50% of actual qualifying Cash paid rounded down, and returns queued/unprocessed input once. Already-polished output stays in inventory.

### Decision 15 — Refiner purchase cost

- **Exact Refiner unlock price:** $25,000 Cash before applicable Factory Purchase Discount and Cash price rounding.

- **Exact T2–T10 upgrade costs:** T2 $125,000; T3 $1,250,000; T4 $12,500,000; T5 $125,000,000; T6 $1,250,000,000; T7 $12,500,000,000; T8 $125,000,000,000; T9 $1,250,000,000,000; T10 $12,500,000,000,000. These are raw prices.

- **Exact upgrade cost formula:** RawRefinerUpgradeCost(T) = 125,000 × 10^(T−2), for target T2–T10: exactly 2.5× the corresponding Polisher tier upgrade.

- **Confirm whether there are milestone jumps:** No milestone jumps.

### Decision 17 — Refiner value rules

- **Confirm the newer Refine 1–15 formula replaces the older Refiner value section:** Yes. The final Refine 1–15 model in Reference D replaces the earlier compounding and per-pass-current-value model.

- **Confirm Refine 15 is the hard maximum:** Yes. Count 15 is the hard maximum; no further pass is allowed.

- **Confirm refined value always uses the pre-Refiner value rather than compounding:** Yes. RefinedValue(n) = PreRefinerValue × (1 + RefineBonus(n)). The immutable pre-Refiner basis is used for every pass.

### Decision 18 — Gem Dust

- **Base Gem Dust awarded on a successful roll:** One base Gem Dust per successful per-ore roll before the Yield multiplier.

- **Can Gem Dust be fractional:** No. Gem Dust is an integer currency. Stardust may separately retain two decimal places.

- **If not, how does +5% Gem Dust Yield handle partial Dust:** For expected Dust y = 1 + 0.05 × YieldLevel, award floor(y) and one additional Dust with probability y−floor(y).

- **Confirm whether probabilistic rounding is used:** Yes. Dust is rolled and awarded before ore destruction; later destruction does not remove gained Dust.

## Reference D Refiner behavior and value

Maximum one Refiner, tier 1–10. Input is Polished or previously Refined ore only. Stone and raw unpolished ore are invalid.

Interval(T) = 15 × 0.2^((T−1)/9).  
Batch(T) = round(1 + 9 × ((T−1)/9)^1.2).  
TierBaseDustChance(T) = 0.02 + (0.08/9) × (T−1).

Thus T1 is 15 seconds / 1 ore / 2% base Dust; T10 is 3 seconds / 10 ores / 10% base Dust.

Let input count be c and the attempted resulting pass number n=c+1. Reject c=15.  
EffectiveBaseDustChance = min(0.25, TierBaseDustChance + 0.005 × RebirthDustChanceLevel).  
FinalDustChance = min(0.95, EffectiveBaseDustChance × 1.25^c).  
BaseDestroyChance = min(0.95, 0.15 × n).  
FinalDestroyChance = clamp(BaseDestroyChance−0.005 × StabilityLevel, 0.05, 0.95).

Roll Dust and award it first; then roll destruction. A destroyed input is removed permanently. A surviving input gains the new count and resulting value, then returns to Refined inventory. Dust remains even if the ore is destroyed. Overall Luck and Ore Luck have no effect on Refiner Dust or destruction.

The owner's principal challenge rule is that each successful surviving pass counts, including repeated passes on the same ore. A final sentence allowing possible progress on a destroyed ore remains under review in Reference K; the clarified survivor-only wording has not been separately ratified.

### Noncompounding value

Store the immutable original PreRefinerValue on the first pass. It includes applicable Polisher value.

StartingRefineBonus = 0.50 + 0.0014 × RebirthRefinerValueLevel.

For n=1…5: RefineBonus(n) = StartingRefineBonus × (5−n)/4.  
For n=6…15: RefineBonus(n) = −0.09 × (n−5).  
RefinedValue(n) = PreRefinerValue × (1 + RefineBonus(n)).

Without the value perk, Refines 1–5 give +50%, +37.5%, +25%, +12.5%, 0%. At perk level 5,000 they give +750%, +562.5%, +375%, +187.5%, 0%. Negative stages remain −9%, −18%, …, −90% regardless of that perk.

Never multiply the previous refined value by the next pass's bonus. Preserve pre-Refiner value metadata when stacking cohorts.

### Gem Dust quantities

Base successful roll awards 1 Dust. ExpectedYield = 1 + 0.05 × GemDustYieldLevel. Award floor(ExpectedYield), with one extra at probability equal to its fractional part. Keep Gem Dust integer and persistent across Rebirth.

Refiner resale refunds 50% of qualifying actual Cash investment, rounded down. Permanent Rebirth perks and future Inscriptions are not refunded.

### Decision 20 — Furnace progression

- **Exact Tier 1–20 capacity progression:** Capacity(T) = 50 × T for T1–T20. T1 50; T5 250; T10 500; T20 1,000. This replaces every previous 25-start, 10+40 and T5=150 draft.

- **Exact sell-value progression per Furnace tier:** FurnaceTierValueMultiplier = 1 + 0.25 × (T−1). T1 1×; T2 1.25×; T5 2×; T10 3.25×; T20 5.75×. Apply Rebirth Furnace Value afterward.

- **Exact Furnace speed progression per tier:** NormalInterval(T) = 10 × 0.1^((T−1)/19), with a 1-second normal minimum. FinalInterval = max(0.5, NormalInterval × (1−0.01 × RebirthSpeedLevel)). Use the exact interpolation formula.

- **Exact Furnace tier upgrade costs:** T1 is the free placed Starter. T2 costs $100; T3 $1,000; T4–T20 raw cost = 1,000 × 4^(T−3). Apply discount and global Cash rounding.

- **Exact cost scaling:** ×10 from the T2 cost to T3, then ×4 per target tier from T4 onward; no milestone jumps. Automation unlocks at T3; T1–T2 require manual activation.

- **Confirm normal Furnace minimum interval is 1 second:** Yes, 1.0 second before the Rebirth speed perk.

- **Confirm Rebirth Furnace Speed can reduce it to 0.5 seconds:** Yes, the 50-level Rebirth speed perk can reduce the final interval to 0.5 seconds.

- **Confirm Furnace cannot be sold:** Yes. The single placed Furnace cannot be sold.

## Reference E Cash price rounding and Furnace table

### Global Cash pricing

Calculate the original raw formula for the target purchase. Apply Factory Purchase Discount only if eligible, using factor 1−0.05×level. Then choose the rounding band from the resulting discounted amount and round half-up:

| Discounted amount | Rounding step |
|---|---:|
| Below $1,000 | $1 |
| $1,000 to below $1,000,000 | $10 |
| $1,000,000 to below $1,000,000,000 | $1,000 |
| $1,000,000,000 and above | $1,000,000 |

ActualPaid = step × floor(DiscountedRaw/step + 0.5).

Local Miner Ore Luck follows these Cash rounding bands but receives no Factory Purchase Discount. Do not use its old floor formula as the payable price. Resale uses actual payments, not a recomputed theoretical price. Stardust perks use their own integer rounding rules.

### Furnace

Capacity(T)=50T. TierValue(T)=1+0.25(T−1). NormalInterval(T)=max(1,10×0.1^((T−1)/19)). FinalInterval=max(0.5,NormalInterval×(1−0.01×RebirthFurnaceSpeedLevel)).

FinalSaleValue = current resource's applicable raw/Polished/Refined value × TierValue × RebirthFurnaceValueMultiplier. The resource value includes the applicable Ore Value modifier; do not apply a modifier twice. Future Achievement/Milestone effects remain deferred until their exact stacking order is defined.

The table lists raw prices before discount/rounding and interval display approximations. T1 is free and placed permanently.

| Tier | Capacity | Tier value | Normal seconds | Raw upgrade Cash |
|---:|---:|---:|---:|---:|
| 1 | 50 | 1.00× | 10.0000 | Free starter |
| 2 | 100 | 1.25× | 8.8587 | $100 |
| 3 | 150 | 1.50× | 7.8476 | $1,000 |
| 4 | 200 | 1.75× | 6.9519 | $4,000 |
| 5 | 250 | 2.00× | 6.1585 | $16,000 |
| 6 | 300 | 2.25× | 5.4556 | $64,000 |
| 7 | 350 | 2.50× | 4.8329 | $256,000 |
| 8 | 400 | 2.75× | 4.2813 | $1,024,000 |
| 9 | 450 | 3.00× | 3.7927 | $4,096,000 |
| 10 | 500 | 3.25× | 3.3598 | $16,384,000 |
| 11 | 550 | 3.50× | 2.9764 | $65,536,000 |
| 12 | 600 | 3.75× | 2.6367 | $262,144,000 |
| 13 | 650 | 4.00× | 2.3357 | $1,048,576,000 |
| 14 | 700 | 4.25× | 2.0691 | $4,194,304,000 |
| 15 | 750 | 4.50× | 1.8330 | $16,777,216,000 |
| 16 | 800 | 4.75× | 1.6238 | $67,108,864,000 |
| 17 | 850 | 5.00× | 1.4384 | $268,435,456,000 |
| 18 | 900 | 5.25× | 1.2743 | $1,073,741,824,000 |
| 19 | 950 | 5.50× | 1.1288 | $4,294,967,296,000 |
| 20 | 1000 | 5.75× | 1.0000 | $17,179,869,184,000 |

T1–T2 require manual activation. T3+ automatically processes valid queued resources when available. Capacity limits each processing cycle. Auto selection uses highest final sale value first and a stable tie break. Persist active reservations and cycle state so reload does not duplicate inputs or payouts.

### Decision 22 — Machine Tier Preservation

- **Exact maximum level for V1:** 25 levels for V1, matching Miner Tier 25, which exceeds Furnace 20 and Polisher/Refiner 10.

- **Exact cost multiplier/curve once V1 maximum machine tier is known:** Cost(L) = round(7,500 × 1.484168297348115^(L−1)), L = 1…25. Individual Stardust costs round to the nearest integer.

- **Confirm target total cost:** Target approximately 300,000,000 Stardust; calculated total 299,999,997. Level 25 costs 97,871,643.

- **Confirm Preservation affects Miner, Polisher, Refiner and Furnace:** Yes. StartingTier = min(MachineMaximumTier, max(1, PreservationLevel)). Individual Miner Ore Luck is excluded; no free preserved tier creates refund investment.

- **Confirm whether Furnace tier is preserved even though Furnace itself is never sold:** Yes. At Rebirth restore the permanent placed Furnace to min(20, max(1, PreservationLevel)). Do not sell or recreate the Furnace.

---

# 3.9 Factory Layout System

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.9
>
> **Implementation Status:** ⚪ Not Started
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** The runtime has no placed-building records, coordinates, rotation, collisions, relocation or connection graph. The HTML/CSS dashboard grid does not implement factory layout.

---

# Purpose

The Factory Layout System defines how production buildings are positioned, connected and organised within the player's factory.

It establishes the rules governing factory construction while encouraging efficient layouts, experimentation and long-term optimisation.

The Factory Layout System transforms individual production buildings into a cohesive production network.

---

# Responsibilities

The Factory Layout System is responsible for:

- Managing the placement of production buildings.
- Defining how buildings occupy factory space.
- Supporting connections between compatible buildings.
- Providing the framework for factory organisation.
- Enabling layout optimisation through player choice.
- Supporting future expansion of factory construction.

The Factory Layout System is not responsible for:

- Defining individual production buildings.
- Managing resource generation.
- Processing resources.
- Determining production rates.
- Managing player progression.

---

# Overview

The Factory Layout System governs how the player's factory is physically constructed.

Rather than treating production buildings as isolated objects, the system allows buildings to operate together as part of a larger production network.

Players are encouraged to continually refine and reorganise their layouts in pursuit of greater efficiency and production capacity.

The system should reward thoughtful planning without unnecessarily restricting creativity.

---

# Design Intent

The Factory Layout System is designed to:

- Encourage experimentation with factory design.
- Reward efficient use of available space.
- Support increasingly complex production networks.
- Create meaningful building placement decisions.
- Ensure factory growth remains engaging throughout progression.

The layout of a factory should become a reflection of the player's strategy rather than a predetermined solution.

---

# Layout Framework

Every factory layout is constructed from individual production buildings operating within a shared environment.

The Factory Layout System defines how buildings:

- Are placed.
- Occupy space.
- Connect with other buildings.
- Interact with neighbouring structures.
- Contribute to the overall production network.

The framework should remain consistent regardless of factory size or progression level.

---

# Placement Behaviour

Production buildings should follow consistent placement rules.

Placement behaviour may include:

- Position validation.
- Rotation where applicable.
- Collision prevention.
- Build restrictions.
- Placement confirmation.
- Removal and relocation.

Placement should be intuitive and provide clear visual feedback before confirmation.

---

# Building Connections

Where applicable, production buildings should be capable of interacting with neighbouring buildings.

Connections should operate predictably and consistently.

The Factory Layout System defines the framework for these interactions while individual building behaviours are defined separately within the Production Building System.

---

# Factory Organisation

Players should be free to organise their factory according to their preferred strategy.

The system should support a wide variety of layouts without requiring a single optimal arrangement.

Factory organisation should remain flexible as new buildings and gameplay systems are introduced.

---

# Progression Role

The Factory Layout System becomes increasingly important as the player's factory grows.

Effective layouts should improve:

- Production efficiency.
- Resource flow.
- Factory expansion.
- Automation effectiveness.
- Long-term optimisation.

Layout planning should gradually become a meaningful component of gameplay rather than an afterthought.

---

# Dependencies

The Factory Layout System depends upon:

- Production Building System
- Resource System
- Automation System
- Factory Expansion System
- User Interface Behaviour

These systems provide the buildings, resources and available space required for factory construction.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Production Building System | Places and organises production buildings. |
| Resource System | Supports resource movement throughout the factory. |
| Automation System | Enables automated production networks. |
| Factory Expansion System | Increases available construction space. |
| Shop System | Provides access to additional production buildings. |
| Statistics System | Records factory development where applicable. |

The Factory Layout System acts as the structural framework that supports every production network within the game.

---

# Balancing Considerations

Factory layouts should reward thoughtful planning without punishing experimentation.

Players should be encouraged to improve and redesign their factories as new production opportunities become available.

The system should avoid forcing a single optimal layout while still allowing skilled players to achieve greater efficiency through careful planning.

---

# Future Expansion

The Factory Layout System should support future additions without requiring structural redesign.

Potential future expansions include:

- Multiple factory areas.
- Layout templates.
- Blueprint systems.
- Building grouping.
- Advanced placement tools.
- Factory zones.
- Additional construction mechanics.

Future additions should enhance layout management while remaining compatible with the existing framework.

---

# Developer Notes

This chapter defines how production buildings are organised within the factory.

It intentionally avoids documenting individual building mechanics, dimensions or placement requirements.

Specific building definitions are maintained within **Volume IV – Building Catalogue**, while this chapter defines the rules governing overall factory construction.

---

# Related Sections

- 3.8 Production Building System
- 3.10 Automation System
- 3.11 Factory Expansion System
- Volume IV – Building Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Factory Layout System specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

# 3.10 Automation System

> Current canonical automation is independent Miners and Tier 3+ Furnace activation (3.8). Legacy Stone-only machine effects and fixed ten-second/three-tier prototype descriptions below are historical, not approved formulas. Connected grid/transport remains a separate design dependency.

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.10
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Completed components: one-second Dropper ticks and configurable ten-second Auto Furnace batches, including start/stop controls, highest-value selection, reserved inventory, live progress and saved-batch recovery. Connected production networks and multi-stage routing remain absent.

---

# Purpose

The Automation System defines how gameplay processes are performed without requiring continuous player interaction.

It establishes the framework that allows production buildings to operate together as automated production networks, enabling the player to shift from manual resource collection towards optimisation and strategic factory management.

The Automation System is one of the primary progression systems within Everything Factory Incremental.

---

# Responsibilities

The Automation System is responsible for:

- Defining automated production behaviour.
- Coordinating interactions between production buildings.
- Managing continuous production workflows.
- Reducing the need for repetitive manual actions.
- Supporting scalable production networks.
- Providing the foundation for long-term factory automation.

The Automation System is not responsible for:

- Defining individual production buildings.
- Managing factory layouts.
- Generating resources independently.
- Storing player resources.
- Defining production building statistics.

---

# Overview

Automation represents the evolution of gameplay from active participation to strategic oversight.

As players progress, manual tasks are gradually replaced by interconnected production systems capable of operating continuously.

Rather than eliminating player involvement, automation shifts the player's focus from performing work to improving the efficiency of the factory.

Automation should always complement gameplay rather than replace meaningful decision-making.

---

# Design Intent

The Automation System is designed to:

- Reduce repetitive gameplay.
- Encourage long-term optimisation.
- Reward thoughtful factory design.
- Create increasingly complex production chains.
- Maintain player engagement through strategic decision-making.

Players should feel that each automation improvement increases their productivity while introducing new opportunities for optimisation.

---

# Automation Framework

Automation is achieved through the interaction of multiple gameplay systems.

Automated production may involve:

- Resource generation.
- Resource transportation.
- Resource processing.
- Resource transformation.
- Value enhancement.
- Multi-stage production chains.

The Automation System provides the framework that enables these processes to operate continuously and reliably.

---

# Automation Behaviour

Automated systems should operate consistently according to their defined behaviour.

Automation should:

- Continue operating without repeated player input.
- React predictably to changing production conditions.
- Support continuous resource flow.
- Recover gracefully from temporary interruptions.
- Resume normal operation whenever possible.

Automation should always remain understandable to the player.

---

# Production Networks

Automation is achieved through networks of interconnected production buildings.

Each production network should:

- Perform a clearly defined function.
- Support expansion as the factory grows.
- Operate consistently over time.
- Integrate with other production networks where appropriate.

Players should be encouraged to improve these networks rather than simply increasing their size.

---

# Player Interaction

Although production becomes automated, the player remains responsible for:

- Designing production networks.
- Expanding factory capacity.
- Improving production efficiency.
- Unlocking new technologies.
- Responding to production bottlenecks.
- Pursuing long-term optimisation.

Automation changes the nature of gameplay from manual execution to strategic management.

---

# Progression Role

Automation represents one of the most significant milestones in player progression.

As automation expands, the player's focus gradually shifts from:

- Performing work

towards

- Designing systems.

Successful automation enables:

- Greater production.
- Improved efficiency.
- Faster progression.
- More complex production chains.
- Increased long-term optimisation.

---

# Dependencies

The Automation System depends upon:

- Production Building System
- Factory Layout System
- Resource System
- Economy System
- Factory Expansion System

These systems provide the infrastructure required for automated production.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Production Building System | Defines the behaviour of automated buildings. |
| Factory Layout System | Determines how automated production networks are constructed. |
| Resource System | Supplies resources that flow through automated processes. |
| Economy System | Converts automated production into economic value. |
| Factory Expansion System | Enables larger and more advanced automated factories. |
| Shop System | Unlocks automation-related content. |
| Statistics System | Records automated production activity. |

The Automation System acts as the operational layer that allows all production systems to function together without continuous player input.

---

# Balancing Considerations

Automation should always provide meaningful improvements over manual gameplay.

Players should consistently feel rewarded for improving automation, while maintaining opportunities for further optimisation.

Automation should never completely remove player decision-making.

The challenge should evolve from performing actions to designing increasingly efficient systems.

---

# Future Expansion

The Automation System has been designed to support future additions, including:

- Advanced production logic.
- Conditional automation.
- Smart routing systems.
- Automation priorities.
- Production scheduling.
- Automated balancing.
- Intelligent factory management.
- Additional automation mechanics.

Future additions should expand the capabilities of automated production while remaining compatible with the existing framework.

---

# Developer Notes

This chapter defines the behaviour of automation as a gameplay system.

It intentionally avoids documenting the specific mechanics of individual production buildings or automation devices.

Individual buildings and their unique automation capabilities are documented within **Volume IV – Building Catalogue**.

---

# Related Sections

- 3.8 Production Building System
- 3.9 Factory Layout System
- 3.11 Factory Expansion System
- Volume IV – Building Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Automation System specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

# 3.11 Factory Expansion System

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.11
>
> **Implementation Status:** ⚪ Not Started
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** No construction-area purchase, factory region or build-capacity model exists. Higher Dropper ownership and furnace capacity upgrades are implemented separately and do not provide the spatial expansion described in this chapter.

---

# Purpose

The Factory Expansion System defines how players increase the size, capacity and capabilities of their factory throughout Everything Factory Incremental.

It establishes the framework for expanding the playable factory environment, allowing increasingly complex production networks while supporting long-term progression.

The Factory Expansion System ensures that growth remains meaningful and paced alongside the player's overall development.

---

# Responsibilities

The Factory Expansion System is responsible for:

- Defining how factory capacity increases.
- Governing access to additional construction space.
- Supporting larger production networks.
- Integrating expansion into gameplay progression.
- Providing a scalable framework for future factory growth.
- Encouraging long-term planning and investment.

The Factory Expansion System is not responsible for:

- Defining production buildings.
- Managing factory layouts.
- Controlling automation behaviour.
- Generating resources.
- Determining player progression rewards.

---

# Overview

Factory expansion represents the player's ability to increase the scale of their production facilities.

Rather than providing unlimited construction space from the beginning of the game, additional capacity is introduced gradually through progression.

Expansion creates opportunities for more advanced layouts, increased automation and larger production chains while maintaining meaningful progression goals.

---

# Design Intent

The Factory Expansion System is designed to:

- Encourage long-term factory development.
- Make increased production feel earned.
- Support increasingly complex factory layouts.
- Reward strategic planning.
- Prevent players from becoming overwhelmed early in the game.

Factory growth should feel like a natural consequence of progression rather than an arbitrary restriction.

---

# Expansion Framework

Factory expansion should occur through clearly defined progression systems.

Expansion may include:

- Increased construction area.
- Additional build capacity.
- New factory regions.
- Additional production zones.
- Improved construction capabilities.
- Future expansion mechanics.

The framework should remain flexible enough to support future gameplay additions.

---

# Expansion Behaviour

Factory expansion should be gradual and meaningful.

Each expansion should:

- Increase production potential.
- Enable new layout opportunities.
- Support additional automation.
- Encourage factory redesign where beneficial.
- Integrate naturally into player progression.

Expansion should consistently provide new opportunities without invalidating previous factory designs.

---

# Capacity Management

The Factory Expansion System defines the limits within which the factory operates.

Capacity may govern:

- Available construction space.
- Maximum production scale.
- Organisational flexibility.
- Future gameplay systems.

Capacity should increase in a predictable manner that supports continued gameplay progression.

---

# Progression Role

Factory expansion is a major driver of long-term progression.

As the factory grows, players gain the ability to:

- Build increasingly advanced production networks.
- Improve automation efficiency.
- Experiment with larger layouts.
- Pursue more ambitious production goals.

Expansion should reinforce the player's sense of achievement and progression throughout the game.

---

# Dependencies

The Factory Expansion System depends upon:

- Factory Layout System
- Production Building System
- Automation System
- Shop System
- Economy System
- Factory Level System

These systems determine how expansion is unlocked and how additional capacity is utilised.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Factory Layout System | Provides additional space for layout design. |
| Production Building System | Allows more production buildings to be constructed. |
| Automation System | Enables larger automated production networks. |
| Shop System | May unlock expansion opportunities or related upgrades. |
| Economy System | Supports the investment required for expansion. |
| Factory Level System | May govern access to future expansion milestones. |
| Statistics System | Records factory growth where applicable. |

The Factory Expansion System provides the physical foundation that allows every other factory system to continue scaling throughout the game.

---

# Balancing Considerations

Factory expansion should feel rewarding while preserving meaningful progression.

Additional capacity should unlock new gameplay possibilities rather than simply increasing production numbers.

Expansion pacing should ensure that players have sufficient opportunity to utilise existing space before significantly increasing factory size.

The system should avoid making early expansion feel restrictive while still preserving a satisfying sense of growth.

---

# Future Expansion

The Factory Expansion System has been designed to support future additions, including:

- Multiple factories.
- Specialised factory regions.
- Modular expansion systems.
- Expansion upgrades.
- Environmental modifiers.
- World-specific construction areas.
- Expansion-based gameplay mechanics.

Future additions should integrate into the existing framework without requiring structural redesign.

---

# Developer Notes

This chapter defines how factory capacity and construction potential increase throughout gameplay.

It intentionally avoids documenting specific expansion requirements, unlock conditions or numerical limits.

Implementation details and balancing values are maintained within **Volume IV – Building Catalogue** and related reference documentation.

---

# Related Sections

- 3.8 Production Building System
- 3.9 Factory Layout System
- 3.10 Automation System
- 3.12 Resource Progression System
- Volume IV – Building Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Factory Expansion System specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

# Part III — Progression Systems

# 3.12 Resource Progression System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

Manual access is Pickaxe-dependent: ore tier r ≤ equipped Pickaxe tier + 2, capped at T4. Default accesses T1/T2; Amber adds T3; Malachite adds T4. Locked weights are zero before Luck/normalization. Automated Miners access T1–T3 at Miner Tier 1 and T4 at Miner Tier 6. Luck never bypasses either source’s locks. Discovery is an acquisition record, not itself an ore-unlock purchase. Manual rolls have no Stone floor; automated Stone remains at least 25%. References A/B define the separate distributions. This replaces all-ores-at-start and uniform-within-tier prototype design wording.

---

# 3.13 Factory Level System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 24 — Factory XP progression

- **Exact XP requirement formula per Factory Level:** TotalXPRequired(L) = 100 × L². Fresh state is Level 0 / 0 XP. Level 1 requires 100 total XP. FactoryLevel = floor(sqrt(TotalXP/100)); next-level span = 100 × (2L+1).

- **Confirm current milestone schedule:** 250 thresholds: first five 10, 25, 50, 75, 100. For indices 6–250, j=index−5 and threshold = round((100 + 9,900 × (j/245)^1.2)/5) × 5. Reference G lists all 250.

- **Confirm whether Factory Level has a maximum:** No hard Factory Level cap. Level 10,000 is the final current milestone, not a maximum attainable level.

- **Confirm whether Factory XP resets on Rebirth:** No. Factory XP and Factory Level permanently survive Rebirth.

### Factory XP and earnings

Factory XP is permanent. Total threshold for L is 100L²; L=0 begins at 0 XP. Derive Level from total XP. Full next-level span is 100(2L+1), not the remaining XP to its threshold.

The normal gameplay XP perk multiplies base gameplay XP by 1+0.0004×level, capped at 5×. Do not multiply the percentage-based challenge XP reward again. Excess challenge XP carries through level-ups.

CashEarnedThisRebirth records qualifying earned Cash and survives spending but resets on Rebirth. Exclude challenge payouts and resale refunds from the challenge-reward basis. Current unspent Cash, not this earnings statistic, is the actual Rebirth payout basis.

New design starts at Level 0 / XP 0. The production fresh XP 0 versus missing-legacy XP 100 behavior is historical compatibility, unchanged by this documentation revision. Implement new defaults and level derivation in a dedicated ticket without treating existing earned XP as disposable. Other Level unlock/reward schedules remain DESIGN REQUIRED.

---

# 3.14 Milestone System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 29 — Milestones

- **Final V1 Milestone list:** 250 Factory Level entries using the final spacing formula in section 24 and Reference G. Rewards do not change the threshold schedule.

- **Exact rewards:** Deferred. Desired reward types include cosmetics and substantial permanent factory/value/Stardust/Dust/mining-power boosts. Do not invent or balance those rewards in the current phase.

- **Confirm whether Milestones are permanent:** Yes. Keep earned flags and future permanent effects; do not grant again when revisiting a level.

- **Confirm first Rebirth reveals the system:** Yes. Track qualifying milestone progress before reveal; show the system after the first completed Rebirth.

## Reference G Milestones and deferred rewards

Milestones 1–5 are Factory Levels 10,25,50,75,100. For indices 6–250 use j=index−5:

RawLevel=100+9,900×(j/245)^1.2.  
MilestoneLevel=round(RawLevel/5)×5.

This yields 250 unique increasing thresholds, ends at 10,000 and has later rounded gaps of 15–50. Rounding may make individual adjacent gaps fluctuate slightly; the overall spacing trend increases.

Complete threshold catalogue, grouped in index order:

- Entries 1–25: 10, 25, 50, 75, 100, 115, 130, 150, 170, 195, 215, 240, 265, 290, 315, 340, 365, 390, 420, 445, 475, 505, 530, 560, 590.
- Entries 26–50: 620, 650, 680, 710, 740, 770, 800, 835, 865, 895, 930, 960, 995, 1025, 1060, 1090, 1125, 1160, 1190, 1225, 1260, 1295, 1325, 1360, 1395.
- Entries 51–75: 1430, 1465, 1500, 1535, 1570, 1605, 1640, 1675, 1715, 1750, 1785, 1820, 1855, 1895, 1930, 1965, 2005, 2040, 2075, 2115, 2150, 2190, 2225, 2265, 2300.
- Entries 76–100: 2340, 2375, 2415, 2455, 2490, 2530, 2570, 2605, 2645, 2685, 2725, 2760, 2800, 2840, 2880, 2920, 2960, 2995, 3035, 3075, 3115, 3155, 3195, 3235, 3275.
- Entries 101–125: 3315, 3355, 3395, 3435, 3480, 3520, 3560, 3600, 3640, 3680, 3720, 3765, 3805, 3845, 3885, 3930, 3970, 4010, 4055, 4095, 4135, 4180, 4220, 4260, 4305.
- Entries 126–150: 4345, 4390, 4430, 4475, 4515, 4555, 4600, 4640, 4685, 4730, 4770, 4815, 4855, 4900, 4940, 4985, 5030, 5070, 5115, 5160, 5200, 5245, 5290, 5330, 5375.
- Entries 151–175: 5420, 5465, 5505, 5550, 5595, 5640, 5685, 5725, 5770, 5815, 5860, 5905, 5950, 5995, 6035, 6080, 6125, 6170, 6215, 6260, 6305, 6350, 6395, 6440, 6485.
- Entries 176–200: 6530, 6575, 6620, 6665, 6710, 6755, 6800, 6845, 6895, 6940, 6985, 7030, 7075, 7120, 7165, 7215, 7260, 7305, 7350, 7395, 7445, 7490, 7535, 7580, 7630.
- Entries 201–225: 7675, 7720, 7765, 7815, 7860, 7905, 7955, 8000, 8045, 8095, 8140, 8185, 8235, 8280, 8330, 8375, 8420, 8470, 8515, 8565, 8610, 8660, 8705, 8755, 8800.
- Entries 226–250: 8850, 8895, 8945, 8990, 9040, 9085, 9135, 9180, 9230, 9275, 9325, 9375, 9420, 9470, 9515, 9565, 9615, 9660, 9710, 9760, 9805, 9855, 9905, 9950, 10000.

Track earned flags permanently, including before UI reveal after first Rebirth. Keep milestone progress through Rebirth. Detailed reward types, amounts and balancing are deferred. Desired direction is substantial permanent boosts and cosmetics; there is no approved +75% reward assigned to a particular threshold.

---

# 3.15 Achievement System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 28 — Achievements

- **Final V1 Achievement list:** Detailed additional V1 entries are deferred. Retain the existing six-entry structure and IDs while awaiting a final catalogue. The requested direction is varied difficulty, approximately 20+ entries per category, with both click-count and resource-count objectives.

- **Exact rewards:** Deferred. Future rewards should match activity and difficulty; for example, a major manual-click achievement can improve resource quantity. Placeholder reward values are not finalized zero rewards.

- **Confirm whether rewards survive Rebirth:** Permanent progress and permanent reward effects persist. One-time cash/XP rewards are claimed once and follow the relevant currency rules afterward.

- **Confirm when the Achievements button becomes visible:** Hidden until the first Achievement unlocks; remains visible thereafter.

Existing Achievement IDs and current triggers are retained as implementation history:

| ID | Name | Current trigger | Reward status |
|---|---|---|---|
| firstSwing | First Swing | totalOresMined ≥1 | Deferred placeholder |
| stoneMiner | Ore Miner | totalOresMined ≥100 | Deferred placeholder |
| dedicatedMiner | Dedicated Miner | totalOresMined ≥1,000 | Deferred placeholder |
| firstDiscovery | Shiny | oresDiscovered ≥1 | Deferred placeholder |
| firstSmelt | First Smelt | oresSmelted ≥1 | Deferred placeholder |
| factoryOwner | Factory Owner | Factory Level ≥10 | Deferred placeholder |

The current totalOresMined implementation increments per manual action. The owner's final direction calls for both click-count and actual-resource-count Achievement categories; additional entries and their rewards remain deferred rather than silently changing old IDs' meanings.

Preserve unlocked/claimed states and legacy compatibility. Expanded click/resource categories and reward catalogues are Deferred; placeholder zero rewards are not approved final rewards.

---

# 3.16 Collection Log System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

Retain all 20 ore discoveries and cumulative collection progress independently of inventory, processing and sales. Preserve it through Rebirth and migration. Stone and crafting-material counters do not create new ore entries. Separate discoveries from quantities and from processed/refined events. Extra tier/variant catalogues require their own approved definitions; T5+ is Deferred.

---

# 3.17 Rebirth and Permanent Progression

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 23 — Rebirth reset rules

- **Cash:** Reset to $0 after awarding Rebirth Stardust from the pre-reset unspent balance. Reset Cash Earned This Rebirth.

- **Normal ores:** Reset all raw ore and Stone inventory.

- **Polished ores:** Reset Polished ore inventory.

- **Refined ores:** Reset Refined ore inventory and active in-process reservations.

- **Pickaxes:** Keep all crafted copies, equipment records, remaining durability and broken state. Do not repair/refill them through Rebirth.

- **Crafting materials:** Keep Wood, Scrap and Metal.

- **Normal Upgrade Shop upgrades:** Reset Ore Value, Mining Power, Mining Luck, Mining Duplication and Unlock Miner. Permanent Stardust durability upgrades are separate and retained.

- **Miner slots:** Keep all purchased Miner slot unlocks.

- **Miners:** Remove owned Miners and their local Ore Luck; repurchased machines use Preservation.

- **Polishers:** Remove owned Polishers.

- **Refiner:** Remove owned Refiner.

- **Furnace tier:** Furnace remains placed; reset tier unless restored by Machine Tier Preservation.

- **Factory XP:** Never reset Factory XP on Rebirth.

- **Factory Level:** Never reset Factory Level on Rebirth.

- **Gem Dust:** Keep Gem Dust.

- **Inscriptions:** Deferred. Active bonuses remain 1; the proposed permanent slot ownership is not an active V1 feature.

- **Achievements:** Keep unlocked/claimed progress and permanent bonuses. Never re-award a previously claimed one-time reward.

- **Milestones:** Keep unlocked progress and permanent rewards; the first-Rebirth reveal remains unlocked.

- **Collection progress:** Keep all discoveries and collection progress.

- **Statistics:** Reset cycle statistics; retain lifetime counters, personal bests and Rebirth history. Resetting a cycle XP-earned statistic does not reset actual Factory XP.

- **Daily Challenge progress:** Keep active Daily objectives, progress, completion/claim state and scheduled deadline.

- **Weekly Challenge progress:** Keep active Weekly state and deadline; this Rebirth counts toward a matching objective.

- **Rebirth perks:** Keep Rebirth count/history, unspent Stardust and purchased permanent perks.

## Reference H — Rebirth payout and reset matrix

### Rebirth payout

Eligibility: current unspent Cash ≥ $1,000,000.  
BaseStardust=10+5×log2(max(1,CurrentCash/1,000,000)).  
StardustGainMultiplier=1+4×StardustGainLevel/7,500.  
AwardStardust=roundToTwoDecimals(BaseStardust×StardustGainMultiplier).

Calculate before resetting Cash. Previously spent Cash is excluded. Stardust Gain affects Rebirth payout only, not Weekly Stardust. Stardust can have two decimal places; Gem Dust remains integer.

| System | On Rebirth |
|---|---|
| Cash and Cash Earned This Rebirth | Reset |
| Raw ore and Stone | Reset |
| Polished and Refined ore | Reset |
| Active processing inputs/reservations | Clear with reset inventories; no duplicate payout |
| Ore Value Mining Power Mining Luck Mining Duplication and Unlock Miner | Reset |
| Owned Miners Polishers Refiner | Remove |
| Local Miner Ore Luck | Remove with Miner |
| Furnace entity | Keep placed |
| Furnace tier | Reset/restored by Preservation |
| Actual Factory XP and Level | Keep permanently |
| Pickaxe copies durability broken state and equipment history | Keep |
| Pickaxe Durability perk | Keep |
| Wood Scrap Metal | Keep |
| Miner slot access | Keep |
| Stardust and purchased Rebirth perks | Keep |
| Gem Dust | Keep |
| Achievement claim states and permanent effects | Keep |
| Milestone flags and reveal state | Keep |
| Collection and lifetime statistics | Keep |
| Current Rebirth counters | Reset |
| Daily and Weekly objective state | Keep until scheduled reset |
| Inscriptions | Deferred; multipliers 1 |

Machine Tier Preservation starts purchases at min(machine cap,max(1,perk level)); restore Furnace by the same rule at reset. Apply at creation/reset, never repeatedly on load. Do not automatically tier-up existing purchased machines when the perk increases. Local Ore Luck is never preserved.

## Reference J — Permanent Stardust perks

### Permanent Stardust perks

Effects use owned level; costs use the level being purchased. round in this table is whole Stardust unless stated otherwise. Each perk persists through Rebirth.

| Perk | Maximum | Effect or cap | Stardust cost to buy L | Total to max |
|---|---:|---|---|---:|
| Overall Luck | 5,000 | 1+0.002L automated tier Luck max 11× | L | 12,502,500 |
| Ore Luck | 5,000 | 1+0.002L automated within-tier Luck max 11× | L | 12,502,500 |
| Furnace Value | 5,000 | 1+0.001L max 6× sale multiplier | L | 12,502,500 |
| Polisher Value | 5,000 | 1+0.0001L max 1.5× extra polished multiplier | L | 12,502,500 |
| Refiner Value | 5,000 | Starting bonus 0.50+0.0014L max +750% at Refine 1 | L | 12,502,500 |
| Machine Tier Preservation | 25 | Starting tier capped by machine max | round(7,500 × 1.484168297348115^(L−1)) | 299,999,997 |
| Refiner Dust Chance | 30 | +0.005L base chance max effective base 25% | 2L | 930 |
| Gem Dust Yield | 50 | 1+0.05L max 3.5× expected yield | round(50 × 1.3368^(L−1)) | 298,482,964 |
| Refiner Stability | 180 | −0.005L destruction max −0.90 with 5% floor | 5+sum(ceil(i/10),i=2…L) | 107,025 |
| Factory XP Gain | 10,000 | 1+0.0004L max 5× gameplay XP | 20L | 1,000,100,000 |
| Stardust Gain | 7,500 | 1+4L/7,500 max 5× Rebirth payout only | 18L | 506,317,500 |
| Miner Speed | 50 | Interval factor 1−0.01L with 0.1s floor | round(100,000 × 1.121118909^(L−1)) | 250,000,002 |
| Furnace Speed | 50 | Interval factor 1−0.01L with 0.5s floor | round(100,000 × 1.121118909^(L−1)) | 250,000,002 |
| Pickaxe Durability | 100 | 1+0.05L base maximum then floor to 100 | round(1,000 × 1.10^(L−1)) | 137,796,124 |
| Factory Purchase Discount | 10 | 5 percentage points per level max 50% | Recommended 250,000 × 2^(L−1) | Recommended 255,750,000 |

For Stability level 1 the sum is empty, so price=5. These numeric totals use each specified individual-level rounding, not rounded headline estimates. There is no universal 400M maximum-cost rule.

Freeze Preservation prices by version. Future tier additions may require a new cost schedule, but do not silently reprice already purchased levels.

An independent Rebirth Furnace Capacity perk was mentioned in an early specification, but no final curve/cap/price is defined here. It is not included as an invented active perk; confirmation is recorded in Reference K.

The final Defined formulas supersede any universal Rebirth-perk cost ceiling, XP reset, compounding Refiner value, or automatic repair on Rebirth. Recommended Discount prices and the unresolved Furnace Capacity perk are not active purchase definitions.

---

# 3.18 Offline Progression System

> DESIGN REQUIRED: the handoff does not authorize offline simulation. Restoring an existing reserved Furnace batch is persistence behavior, not repeated offline production.

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.18
>
> **Implementation Status:** ⚪ Not Started
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** There is no offline session-duration calculation, production simulation, limit or return summary. An already-started Auto Furnace batch can finish after reload using its saved timestamp; missed Dropper ticks and repeated offline batches are not simulated.

---

# Purpose

The Offline Progression System defines how gameplay progression is simulated while the player is not actively playing Everything Factory Incremental.

It provides a framework for rewarding players for previously established factory automation while ensuring that offline progression remains fair, predictable and balanced.

The Offline Progression System extends gameplay continuity beyond active play without replacing player engagement.

---

# Responsibilities

The Offline Progression System is responsible for:

- Simulating eligible gameplay during player absence.
- Calculating offline production.
- Awarding offline progression.
- Presenting offline progress summaries.
- Supporting long-term gameplay continuity.
- Providing a scalable framework for future offline mechanics.

The Offline Progression System is not responsible for:

- Defining production behaviour.
- Managing automation.
- Recording achievements.
- Controlling Factory Levels.
- Defining rebirth mechanics.
- Managing save data.

---

# Overview

The Offline Progression System allows eligible gameplay systems to continue generating progress while the player is away from the game.

Rather than attempting to fully simulate every gameplay interaction, offline progression should provide a simplified representation of factory performance based upon the player's established production capabilities.

Offline progression should reward preparation rather than replace active gameplay.

---

# Design Intent

The Offline Progression System is designed to:

- Reward investment in factory automation.
- Maintain gameplay continuity.
- Respect the player's time.
- Encourage efficient factory design.
- Support long-term progression.

Players should feel rewarded for building an efficient factory while still recognising that active play offers greater opportunities for optimisation.

---

# Offline Simulation Framework

Offline progression is based upon the player's factory state at the time gameplay ends.

The simulation framework may include:

- Automated production.
- Resource generation.
- Passive economic progression.
- Time-based progression.
- Future passive gameplay systems.

The framework should remain flexible enough to support future gameplay additions.

---

# Offline Behaviour

Offline progression should:

- Begin when active gameplay ends.
- End when gameplay resumes.
- Produce predictable results.
- Scale appropriately with factory progression.
- Respect gameplay balance.
- Operate consistently across supported platforms.

Players should always receive understandable and transparent offline results.

---

# Offline Rewards

Upon returning to the game, players should receive a clear summary of their offline progression.

This summary may include:

- Time spent offline.
- Resources produced.
- Economic progression.
- Factory performance.
- Other eligible progression.

Players should understand how offline rewards were generated.

---

# Progression Role

The Offline Progression System supports long-term engagement by allowing progression to continue between play sessions.

It rewards players who invest in efficient automation while encouraging them to return and continue improving their factory.

Offline progression should complement active gameplay rather than becoming the primary method of progression.

---

# Dependencies

The Offline Progression System depends upon:

- Automation System
- Production Building System
- Resource System
- Economy System
- Statistics System
- Saving & Loading Behaviour

These systems provide the production state, gameplay data and persistence required to calculate offline progression.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Automation System | Provides the automated production simulated while offline. |
| Production Building System | Determines the behaviour of production buildings during simulation. |
| Resource System | Supplies the resources generated through offline production. |
| Economy System | Calculates economic progression resulting from offline activity. |
| Statistics System | Records offline production where applicable. |
| Saving & Loading Behaviour | Stores and restores the data required to calculate offline progression. |

The Offline Progression System extends existing gameplay systems into periods when the player is not actively playing.

---

# Balancing Considerations

Offline progression should provide meaningful rewards without surpassing the value of active gameplay.

Players should benefit from investing in automation while still being encouraged to actively manage, optimise and expand their factory.

Offline progression should remain predictable, transparent and resistant to unintended exploitation.

---

# Future Expansion

The Offline Progression System has been designed to support future additions, including:

- Improved simulation models.
- Expansion-specific offline mechanics.
- Offline progression upgrades.
- Offline event systems.
- Enhanced production summaries.
- Additional passive gameplay systems.

Future additions should integrate naturally into the existing framework while preserving gameplay balance.

---

# Developer Notes

This chapter defines how offline progression functions as a gameplay system.

It intentionally avoids documenting simulation formulas, production rates, offline limits or balancing values.

Implementation details are maintained within Volume IV and the game's balancing documentation.

---

# Related Sections

- 3.10 Automation System
- 3.11 Factory Expansion System
- 3.17 Rebirth System
- 4.X Saving & Loading Behaviour
- Volume IV – Progression Reference

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Offline Progression System specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

---

# Part IV — Supporting Systems

# 3.19 Player Statistics System

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 30 — Statistics

- **Exact V1 statistics to track:** Use the accepted catalogue in Reference H: cash earnings/spending/refunds, clicks, manual and Miner outputs, normal/Polished/Refined activity, refine attempts/survivors/losses, XP, Dust, Stardust, Rebirths/history, challenges, discoveries, bests and play time.

- **Which statistics reset each Rebirth:** Reset ThisRebirth counters such as earnings/spending/refunds, clicks/outputs, processing/sales, cycle XP earned, cycle Dust earned and cycle time. Keep current objective progress independently.

- **Which statistics are lifetime:** Keep lifetime equivalents, total Stardust earned/spent, completed Rebirths/history, best Cash/Factory Level/machine tiers, collection, challenge completions and lifetime play time.

- **Confirm separate stats for normal, polished and refined ores:** Yes. Distinguish base acquisitions, polished outputs and successful refined passes; materials have separate counters and are not ores. Track clicks separately from awarded quantities.

## Reference H — Statistics catalogue

### Statistics

Keep current balances separate from lifetime and cycle event counters. Rebirth must not reset true Factory XP merely because a cycle XP-earned counter is reset.

| Record | Lifetime | Current Rebirth | Required distinction |
|---|---|---|---|
| Furnace sale Cash earned | Yes | Yes | Qualifying reward basis excludes challenge payouts and refunds |
| Cash spent | Yes | Yes | Record actual payable discounted/rounded cost |
| Resale refunds | Yes | Yes | Separate from qualifying earnings |
| Manual clicks | Yes | Yes | One action, irrespective of output |
| Manual normal output | Yes | Yes | Per resource ID and tier; include duplicates |
| Miner output | Yes | Yes | Per resource ID/tier and source; include duplicates |
| Wood Scrap Metal obtained | Yes | Yes where cycle counters are shown | Separate materials; not ore counts |
| Polished output | Yes | Yes | Per ore ID |
| Refinement attempts | Yes | Yes | Per ore/pass count |
| Refinement survivors and losses | Yes | Yes | Distinguish outputs from destruction |
| Raw Polished Refined sales | Yes | Yes | Quantity and revenue; preserve Refine Count breakdown |
| XP earned | Yes | Yes | Gameplay and challenge sources separate from actual permanent Factory XP |
| Gem Dust earned and spent | Yes | Cycle earnings | Separate persistent balance |
| Stardust earned and spent | Yes | Source-specific history | Separate Rebirth and Weekly sources |
| Rebirth count and history | Yes | Current duration | Record cash payout basis, time and reward |
| Challenge completions and claims | Yes | Active reset-cycle state | Daily and Weekly separate |
| Highest Cash Level and machine tiers | Yes | Optional cycle views | Lifetime bests survive |
| Collection discoveries | Yes | No reset | Resource ID; materials are not ore discoveries |
| Play time | Yes | Current cycle | Do not invent offline simulation |

Total Resources Gathered includes materials. Ore-specific counters exclude materials. Repeated surviving refinement is processed output, not acquisition of a new raw ore. Keep normal, Polished and Refined counters distinct.

---

# 3.20 User Interface Behaviour

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

Fresh saves start with $0, Factory Level 0, 0 Factory XP and the infinite-durability Default Pickaxe. The first-ever manual mining action guarantees Stone and cannot substitute a crafting material. Subsequent actions use the normal accessible manual pool.

Opening sequence: first Stone → first Starter Furnace sale → Mining Power I → Unlock Miner → buy first Miner → automatic production. Mining Power I is required before the shop unlock, which is separate from buying a Miner. The Starter Furnace is the selling system; no separate direct-sale mechanic is required.

The Furnace, Upgrade Shop, Collection and Statistics are visible from the start. Miner purchase/unlock access appears in the Upgrade Shop with applicable requirements. Achievements are revealed after the first Achievement unlocks; Milestones after the first completed Rebirth. Track milestone progress before reveal. Pickaxes and resources share an inventory screen with appropriate tabs; crafting has its own screen. Raw, Polished and Refined resources use separate tabs.

Requirements must also be enforced in transaction logic. Show machine-specific tier, local upgrades, investment and state independently. Show price after eligible discount and rounding; separate destructive resale/Rebirth confirmations from normal upgrades. Preserve existing accessibility and readable feedback; these rules do not authorize an unrelated UI redesign.

---

# 3.21 Notification System

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.21
>
> **Implementation Status:** 🟠 In Progress
>
> **Status Reviewed:** 2026-09-28
>
> **Historical prototype review (2026-09-28; not current acceptance):** Discovery and milestone modals plus a seven-second achievement toast are implemented. Single pending slots and shared toast timing do not provide reliable queued delivery for simultaneous events; priority handling and offline/rebirth notifications are absent.

---

# Purpose

The Notification System defines how significant gameplay events are communicated to the player throughout Everything Factory Incremental.

It provides a framework for delivering timely, relevant and understandable notifications while ensuring that important information is presented without unnecessarily interrupting gameplay.

The Notification System acts as the primary mechanism for drawing the player's attention to meaningful events and changes in game state.

---

# Responsibilities

The Notification System is responsible for:

- Communicating significant gameplay events.
- Prioritising notifications based on importance.
- Delivering timely player feedback.
- Preventing unnecessary notification overload.
- Supporting gameplay awareness.
- Providing a scalable framework for future notification types.

The Notification System is not responsible for:

- Displaying permanent gameplay information.
- Managing interface layouts.
- Defining gameplay mechanics.
- Recording gameplay statistics.
- Saving game data.
- Determining gameplay progression.

---

# Overview

The Notification System informs players when meaningful gameplay events occur.

Rather than requiring players to constantly monitor every gameplay system, notifications provide concise and timely updates whenever player attention is required or significant progress has been made.

Notifications should enhance player awareness without becoming distracting or repetitive.

---

# Design Intent

The Notification System is designed to:

- Improve gameplay awareness.
- Reinforce player accomplishments.
- Communicate important system changes.
- Reduce unnecessary player confusion.
- Maintain gameplay flow.

Notifications should provide useful information at the moment it becomes relevant.

---

# Notification Framework

Notifications may be generated by any gameplay system when significant events occur.

Examples include notifications relating to:

- Progression.
- Factory development.
- Resource discovery.
- Achievements.
- Milestones.
- Economy.
- Automation.
- Offline progression.
- Future gameplay systems.

The framework should remain flexible enough to support additional notification categories as the game evolves.

---

# Notification Behaviour

Notifications should:

- Appear promptly when triggered.
- Clearly communicate the associated event.
- Remain visible for an appropriate duration.
- Avoid interrupting normal gameplay unnecessarily.
- Be dismissed automatically or by player interaction where appropriate.

Notification behaviour should remain predictable and consistent throughout the game.

---

# Notification Priority

Notifications should be prioritised according to their importance.

Priority should determine factors such as:

- Presentation style.
- Visibility.
- Duration.
- Player interaction requirements.
- Whether notifications may be grouped or queued.

Critical gameplay information should never be obscured by lower-priority notifications.

---

# Feedback Principles

Notifications should communicate:

- What happened.
- Why it happened where appropriate.
- Whether player action is required.
- Any resulting gameplay changes.

Notifications should be concise while providing sufficient information for informed decision-making.

---

# Progression Role

The Notification System supports gameplay progression by ensuring players remain informed as their factory develops.

Notifications reinforce important accomplishments, highlight newly available opportunities and communicate changes that may influence player decisions.

The system should strengthen player engagement without becoming a substitute for exploration or experimentation.

---

# Dependencies

The Notification System depends upon:

- User Interface Behaviour
- Player Statistics System
- Factory Level System
- Achievement System
- Milestone System
- Collection Log System
- Rebirth System
- Offline Progression System

These systems generate the events that may require player notification.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| User Interface Behaviour | Displays notifications consistently throughout the interface. |
| Player Statistics System | Supports notifications based on recorded gameplay events where applicable. |
| Factory Level System | Triggers progression-related notifications. |
| Achievement System | Triggers achievement completion notifications. |
| Milestone System | Triggers milestone completion notifications. |
| Collection Log System | Notifies players when new discoveries are recorded. |
| Rebirth System | Communicates rebirth availability and completion. |
| Offline Progression System | Presents summaries of offline progress upon returning to the game. |

The Notification System provides a unified communication layer that delivers significant gameplay events to the player.

---

# Balancing Considerations

Notifications should communicate meaningful information without overwhelming the player.

Frequently occurring events should avoid generating excessive notifications where this would reduce their effectiveness.

The system should prioritise quality and relevance over quantity, ensuring that notifications remain useful throughout all stages of progression.

---

# Future Expansion

The Notification System has been designed to support future additions, including:

- Custom notification preferences.
- Notification history.
- Notification filtering.
- Context-sensitive notifications.
- Expansion-specific notification types.
- Accessibility enhancements.
- Additional presentation methods.

Future additions should integrate into the existing notification framework while preserving clarity and consistency.

---

# Developer Notes

This chapter defines how gameplay notifications function as a support system.

It intentionally avoids documenting specific notification messages, visual presentation, animations or interface layouts.

Notification content, presentation assets and implementation details are maintained within the project's interface documentation and supporting reference material.

---

# Related Sections

- 3.20 User Interface Behaviour
- 3.22 Saving & Loading Behaviour
- 3.13 Factory Level System
- 3.14 Milestone System
- 3.15 Achievement System
- 3.16 Collection Log System
- 3.17 Rebirth System

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Notification System specification created. |
| 1.0.1 | 2026-09-28: Added source-based implementation status and remaining-work notes; intended design retained. |

# 3.22 Saving & Loading Behaviour

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

The future [V2 State and Compatibility Contract](V2_STATE_CONTRACT.md) is the field-level companion for this chapter: authoritative/cache distinctions, manual state, machine slots/IDs/investment, active reservations, source mappings, additive V1 boundaries and the V2 activation gate. It changes no gameplay formulas or production schema. Its M1 (unknown legacy first-action history) and B1 (unmapped legacy effects) boundaries require owner decisions where applicable. T1 decisions 1A/2A(all)/3A/4A/5A are owner-approved: one saved cycle may finish after downtime, active upgrades affect future reservations only, effects bind at reservation, processed Lots are not retroactively repriced, and accepted coordinator order governs competing actions. The [final lifecycle contract](V1_MACHINE_LIFECYCLE_CONTRACT.md#7a-t1-final-approved-coordination-and-recovery) and [effect context](V2_STATE_CONTRACT.md#7a-t1-final-durable-effect-context-future-v2-only) specify future implementation; no V2 activation is implied; K.2 and the existing milestone/Refiner-resale questions remain Open. The current milestone catalogue may remain intact until a separate approved mapping exists. No partial V2 can be written before every migrated machine has a functional consumer.

The accepted current contract is [SAVE_VERSIONING.md](SAVE_VERSIONING.md): schema 1, canonical defaults, sequential migrations, validation before runtime, and non-destructive recovery. Never silently reset or overwrite rejected data; block gameplay/autosave, export exact original bytes, allow retry, and require explicit reset confirmation. Current V1 legacy fields remain in production until an implementation ticket changes them.

### Decision 31 — Save migration

- **Confirm old Dropper data migrates to Miner:** Yes. Convert each legacy Dropper to an independent Miner, up to 5. Count-only records create Tier 1 Miners in fixed slot order. Migration unlocks enough slots for retained Miners without charging Cash.

- **Confirm old Adder data migrates to Polisher:** Yes. Convert Adders to Polishers, up to 3; assign persistent slots 1–3. Count-only records start at Tier 1.

- **Confirm old Multiplier data migrates to Refiner:** Yes. Any positive valid Multiplier ownership converts to one Refiner. Zero ownership does not create a free Refiner. Compensate overflow separately.

- **Confirm all new saves use only the new names:** Yes. V2 writes canonical new structures/names. Loader accepts legacy names via migration; original bytes remain recoverable if parsing, migration or validation fails.

- **Confirm save version number/migration strategy:** Existing unversioned schema is 0; inspected accepted schema is 1. New instance structures use 2. Load sequentially 0→1→2, validate before normal play, and do not reapply V2 migration on reload. Reference I gives conversion, compensation and open reconstruction details.

## Reference I Save version 2 migration

The inspected persistence foundation uses saveVersion 1, accepts unversioned legacy 0 through sequential migration, validates loaded state, preserves rejected raw data and offers recovery. Keep that foundation. New instance structures use schema 2, independent of game/Bible document versions.

Load: parse → identify version → migrate each required step → validate V2 → apply defined defaults → start gameplay. Unsupported future versions must not be downgraded or overwritten. Write canonical machine names and instance records. Once migrated, V2 reload never reapplies migration or compensation.

### Entity conversion

- Each Dropper becomes one Miner, up to 5.
- Each Adder becomes one Polisher, up to 3.
- Positive Multiplier ownership becomes one Refiner.
- If individual records exist, rank strongest by compatible tier, then recorded investment, then oldest ID.
- Count-only saves create Tier 1 entities in deterministic slot order; new stats with no equivalent begin at level 0.
- Clamp compatible tiers to the new machine cap. Local Ore Luck begins at 0 unless a compatible prior record explicitly exists.
- Assign Polishers to slots 1–3. Retain only occupied ownership for the converted count.
- Unlock enough Miner slots for retained Miners, maximum 5, free of migration Cash charges.
- Generate stable deterministic IDs for count-only records so a failed/retried migration does not change compensation decisions.

### Investment and compensation

Use recorded compatible investment where available. When absent, the supplied policy reconstructs using current undiscounted equivalent purchase and tier prices, without Factory Purchase Discount. This is a migration exception to normal gameplay's actual-paid investment rule.

For removed overflow machines: refund 50% of their reconstructed full investment. For a retained machine whose old tier exceeds the new cap, reconstruct before clamping; compensate 50% of the lost above-cap portion, and keep only retained-tier investment as its future resale basis. Do not credit both full lost investment and retained investment as refunds.

Unsupported progression receives 100% of recorded Cash investment; without historical information use an approved closest current equivalent cost. Compensation is Cash only, never Stardust. Exact equivalent prices above current tier/slot limits remain open in Reference K; do not invent high-value overflow compensation.

Retain total Factory XP; derive its appropriate Level using 100L² if old level/XP are inconsistent. Rebirth gameplay never resets either. Preserve lifetime statistics, collection, claims and supported unknown data through the existing validation/recovery policy.

**Planned, not activated:** unversioned/V0 → V1 → V2. Before shipping V2, resolve Reference K’s unsupported investment reconstruction and define the exact field contract, defaults and validators. Include individual machine IDs/slots/tiers/local stats/investment and independent reserved processing state; preserve compatible unknown data. No placeholder future systems or unapproved overflow formulas. Test compensation exactly once, tier reconstruction before clamping, full chain, active-batch continuity and recovery.

# 3.23 Daily and Weekly Challenges

**Design status:** Defined except explicit Recommended/Open/Deferred entries. **Implementation:** not certified against this revision; see the roadmap.

### Decision 25 — Daily Challenges

- **Exact number of Daily Challenges available at once:** Three active Daily Challenges.

- **Can players reroll a challenge:** No player rerolls in V1. Correct invalid generated state without duplicate rewards; completed challenges are not immediately replaced.

- **Does a completed but unclaimed challenge disappear at reset:** Yes. At the scheduled reset, unclaimed completed or incomplete challenges expire and the entire set is replaced.

- **Does Stone appear in normal Daily ore challenges:** Stone is excluded from standard ore-specific Daily objectives. A Stone-specific type must be explicitly defined if used.

- **Exact minimum/maximum quantity safeguards:** Minimum quantity 1. Standard resource targets use at most 30 minutes of current sustainable production, with a 60% expected-output safety factor. Exclude resources whose expected output in the chosen window is below 5. Manual fallback is 30 clicks/minute. Whole-item/friendly target rounding remains a technical detail to specify.

- **Confirm Daily rewards use Cash Earned This Rebirth:** Yes. Each Daily awards 0.10 × CashEarnedThisRebirth and (0.50/3) × the current full next-level XP span. The advertised 30% Cash/50% XP applies to the full set at a common progression state. Exclude challenge Cash and resale refunds from the qualifying earnings basis. Calculate each reward at claim; do not multiply challenge XP by the XP perk again.

### Decision 26 — Weekly Challenges

- **Exact number of Weekly Challenges available at once:** Seven active Weekly Challenges.

- **Is the 150% reward exactly 150% or a minimum of 150%:** The 150% applies to the seven-challenge set. Each challenge awards (1.50/7) of its claim-time Cash basis and full next-level XP span. Claims at different progression states need not sum to 150% of a single historical value.

- **Exact Stardust reward rules:** After at least one completed Rebirth, exactly one generated Weekly objective has extra Stardust: max(100, floor(CurrentEligibleStardust × 0.10)), in addition to its normal Cash/XP share. No Stardust Gain multiplier. First Rebirth mid-week enables this at the next reset only.

- **Maximum Rebirth-count objective:** Maximum 15. Exclude if estimated cycle time exceeds 240 minutes. Otherwise target = clamp(floor(240/EstimatedMinutesPerRebirth),1,15). Prefer the last 3 valid Rebirth durations; without history estimate 1,000,000 / sustainable non-Challenge Cash per minute. If no reliable rate exists, exclude.

- **Can weekly challenges require Refined ores as well as Polished ores:** Yes. Refined objectives accept any successful surviving pass, resulting count ≥1; exact Refine Counts are not required in V1. Account for Refiner throughput and destruction, then apply the 60% safety factor. One ore surviving several passes can award several progress events.

### Decision 27 — Challenge reset timezone

- **Confirm resets use fixed GMT/UTC year-round:** Fixed UTC/GMT year-round: Daily 00:01; Weekly Friday 17:00.

- **Or UK local time including BST:** No BST adjustment. In Europe/London during BST these are Daily 01:01 and Weekly Friday 18:00.

## Reference F Factory XP and challenges

### Factory XP and earnings

Factory XP is permanent. Total threshold for L is 100L²; L=0 begins at 0 XP. Derive Level from total XP. Full next-level span is 100(2L+1), not the remaining XP to its threshold.

The normal gameplay XP perk multiplies base gameplay XP by 1+0.0004×level, capped at 5×. Do not multiply the percentage-based challenge XP reward again. Excess challenge XP carries through level-ups.

CashEarnedThisRebirth records qualifying earned Cash and survives spending but resets on Rebirth. Exclude challenge payouts and resale refunds from the challenge-reward basis. Current unspent Cash, not this earnings statistic, is the actual Rebirth payout basis.

### Generation and progress

Generate 3 Daily and 7 Weekly objectives at fixed reset boundaries. Requirements are fixed at generation; reward values remain dynamic until claim. Identical objectives, including the same ore/state/action with different target quantities, cannot appear twice within one set. Different resources or genuinely different actions can share a system.

Use only current owned machines, upgrades and accessible systems, never assumed future purchases. All unlocked low-tier ores remain in the eligible pool. Standard Daily ore objectives exclude Stone. Polished/Refined objectives require the corresponding ore access and processing capability.

Use current sustainable automatic output for standard objectives. Daily effort is 10–30 minutes, with a maximum 30-minute resource target. Weekly individual resource targets must be achievable in approximately four hours or less. Explicit manual objectives and fallback for players without automation use 1 click every 2 seconds (30/minute), adjusted for current Pickaxe, Luck, power, duplication and accessible pool.

ResourceTarget = ExpectedOutputDuringTargetWindow × 0.60. Exclude an ore if expected quantity during the window is below 5. This margin makes ordinary completion more likely but never guarantees RNG outcomes. Whole-item target rounding is noted in Reference K.

For Polished output, account for acquisition supply and Polisher throughput. For Refined output, account for input supply, Refiner throughput and survival probability. ExpectedSuccessfulOutput = effective processing input rate × survival probability. Apply the 60% factor afterward.

Progress records activity after generation, not pre-existing inventory. Progress does not consume resources. Manual and automated acquisition both count for normal collection unless the objective says manual-only. Polished progress counts qualifying outputs. Refined progress follows the surviving-pass rule discussed above. Completed objectives stay in the set; do not replace them immediately.

### Daily and Weekly claim formulas

At each claim, snapshot all applicable bases before awarding any payout:

DailyCash = 0.30/3 × CashEarnedThisRebirth = 0.10 × basis.  
DailyXP = 0.50/3 × FullNextLevelXPSpan.

WeeklyCash = 1.50/7 × CashEarnedThisRebirth.  
WeeklyXP = 1.50/7 × FullNextLevelXPSpan.

Use exact fractions internally, not the rounded display percentages. At a common progression state, a complete set represents its advertised totals. If bases change between claims, the awarded totals need not equal those percentages of a single historical snapshot. Cash/XP reward fractional precision still requires the existing currency policy or explicit definition in Reference K.

Cash received from a challenge does not increase the qualifying challenge earnings basis. A Rebirth can therefore reset the basis for a later claim without resetting the objective itself.

### Weekly Rebirth targets

Prefer the average of the last 3 valid completed Rebirth durations; if fewer exist, use all available. Without history, estimate minutes = 1,000,000 / sustainable non-Challenge CashPerMinute. This quotient is already in minutes.

Exclude Rebirth objectives when the rate is unreliable/nonpositive or the estimated cycle exceeds 240 minutes. Otherwise target=min(15,max(1,floor(240/EstimatedMinutesPerRebirth))). Track completed Rebirth events while the objective is active.

### Weekly Stardust

If the player has already completed at least 1 Rebirth when the set is generated, designate exactly 1 of the 7 Weekly challenges as the Stardust objective. It receives normal Weekly Cash and XP shares plus extra Stardust:

WeeklyStardust = max(100, floor(CurrentEligibleStardust×0.10)).

Do not multiply it by Stardust Gain. It rounds down to whole Stardust before the 100 minimum. First Rebirth mid-week does not alter existing objectives; eligibility takes effect at the next reset.

With one such reward there is no same-cycle reward chaining. If multiple are introduced later, exclude earlier Weekly Stardust awards in that cycle from later eligible balance calculations.

### Reset times

Daily: 00:01 UTC every day. Weekly: Friday 17:00 UTC. These are fixed GMT/UTC times, not Europe/London wall-clock times adjusted for BST. Replace the entire set on reset; all unclaimed objectives expire, even when completed. Rebirth does not refresh or remove challenge state.

**Implementation gates:** Reference K’s target rounding, payout precision and destroyed-ore wording must be resolved for affected challenge generation/claims. The exact formulas above are not permission to guess those missing rules.

---

# Documentation Standard

Every gameplay system documented within this volume should follow a consistent structure.

Each chapter should include, where applicable:

1. Purpose
2. Design Philosophy
3. Gameplay Overview
4. Core Rules
5. Player Interaction
6. Progression Role
7. System Interactions
8. Balancing Considerations
9. Edge Cases
10. Future Expansion
11. Developer Notes
12. Related Sections
13. Revision History

Not every chapter will require every section.

However, consistency should always be prioritised wherever possible.

---

# Dependencies

This volume depends upon:

- Volume I — Project Foundation
- Volume II — Player Journey

Future volumes should reference Volume III when discussing implementation or technical behaviour.

---

# Completion Criteria

Volume III is considered complete when:

- Every gameplay mechanic has been documented.
- Every gameplay rule has been defined.
- System interactions have been documented.
- Progression behaviour has been specified.
- Gameplay balancing intent has been recorded.
- Future expansion considerations have been identified.

A developer unfamiliar with the project should be capable of implementing the complete gameplay experience using this volume alongside the technical documentation contained within later volumes.

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Volume III framework created. |

---

# Volume IV – Game Content Reference

---

# 4.0 Game Content Reference

> [!IMPORTANT]
>
> **Documentation Status:** 🟠 In Development
>
> **Section ID:** VOL4-4.0

---

# Purpose

Defines the purpose of Volume IV and its role within the Everything Factory Incremental Development Bible.

Explains that Volume IV serves as the authoritative reference for every gameplay entity while Volume III defines gameplay behaviour.

---

# Scope

Defines exactly what belongs within Volume IV.

Includes:

- Resources
- Currencies
- Buildings
- Upgrades
- Factory Levels
- Milestones
- Achievements
- Collection Entries
- Player Statistics
- Notifications
- Interface References
- Gameplay Constants
- Formula References
- Future Gameplay Content

Excludes:

- Gameplay behaviour
- Technical implementation
- Engine architecture

---

# Documentation Philosophy

Defines the philosophy behind Volume IV.

Explains that:

- Behaviour belongs in Volume III.
- Content belongs in Volume IV.
- Technical implementation belongs in Volume V.

Entries should remain implementation-focused rather than system-focused.

---

# Documentation Conventions

Defines the documentation standards used throughout the volume.

Examples include:

- Consistent formatting.
- Consistent terminology.
- One authoritative entry per gameplay entity.
- No duplicated gameplay behaviour.
- Reference related gameplay systems where appropriate.
- Keep entries concise and factual.
- Update entries whenever gameplay content changes.

---

# Entry Template Convention

Defines how catalogue entries are structured.

Every catalogue consists of individual entries.

Each catalogue defines its own template.

All templates should:

- Use a consistent layout.
- Remain implementation-focused.
- Avoid documenting gameplay behaviour.
- Include related systems where appropriate.
- Include developer notes when necessary.

Examples include:

- Resource Template
- Currency Template
- Building Template
- Upgrade Template
- Achievement Template
- Collection Template

---

# Relationships with Other Volumes

Defines how Volume IV interacts with the rest of the Development Bible.

| Volume | Responsibility |
|----------|---------------|
| Volume III | Gameplay systems and behaviour |
| Volume IV | Gameplay content and implementation data |
| Volume V | Technical implementation |

---

# Future Expansion

Defines how future gameplay content should be added.

New gameplay entities should be added by creating additional catalogue entries rather than modifying gameplay system documentation.

---

# Developer Notes

Additional notes regarding maintenance of Volume IV.

---

# Related Sections

- Volume III – Gameplay Systems
- 4.1 Resource Catalogue
- 4.2 Currency Catalogue
- 4.3 Production Building Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Volume IV specification created. |

---

# Part I — Core Game Content

# 4.1 Resource Catalogue

Use the exact V1 ore/XP table in 3.4. References A/B define source-specific accessibility and probability; all-ores-at-start and uniform per-tier selection are superseded. Stone/materials are not Collection entries.

---

# 4.2 Currency Catalogue

Cash: Furnace sales and approved costs. Stardust: Rebirth/permanent perks and eligible Weekly reward. Gem Dust: Refiner integer rolls; Inscriptions remain Deferred. See 3.6, References D/H/J. Other currency examples are not active requirements.

---

# 4.3 Production Building Catalogue

Miner tiers 1–25, Polisher/Refiner 1–10, Furnace 1–20. Exact ownership, slots, costs, intervals, value and resale rules: 3.8 / References B–E. Conveyors remain required by AGENTS but their detailed mechanics need design.

---

# 4.4 Upgrade Catalogue

Normal Cash Shop and permanent Stardust tables are in 3.7 and 3.17 (Reference J). Mining Luck, automated Overall Luck and automated Ore Luck are separate. Recommended Discount price and unresolved Furnace Capacity perk are not canonical costs.

---

# 4.5 Factory Level Reference

Use 3.13: total threshold 100L², Level floor(sqrt(XP/100)), fresh Level 0 / XP 0, permanent XP. Other unlock/reward tables remain DESIGN REQUIRED.

---

# 4.6 Milestone Catalogue

Reference G in 3.14 contains the exact 250 thresholds through Level 10,000. Track before first-Rebirth reveal; retain earned/claim flags. Rewards Deferred.

---

# 4.7 Achievement Catalogue

Retain the six IDs and historical triggers in 3.15. Reveal after first unlock. Additional entries and detailed rewards Deferred.

---

# 4.8 Collection Catalogue

The 20 ores in 3.4; see 3.16 for persistent discovery independent of inventory. No implicit Stone/material entries.

---

# 4.9 Statistics Catalogue

Reference H in 3.19 is the accepted event/cycle/lifetime catalogue. Actual balances, qualifying earnings and refunds are distinct.

---

# 4.10 Notification Reference

Use 3.21 for existing notification behavior and roadmap V1-190–196 for remaining coordination. Do not invent reward events for Deferred rewards.

---

# 4.11 Interface Reference

Use 3.20 for disclosure, inventory tabs and purchase requirements. Do not expose unimplemented systems as usable controls.

---

# 4.12 Gameplay Constants

Authoritative numeric tables are stored once in References A–J in the relevant chapters. Preserve full precision, explicit caps and source status. Future tiers/inscriptions have no active constants.

---

# 4.13 Formula Reference

Manual: Reference A. Miner: B. Polisher: C. Refiner: D. Furnace/Cash rounding: E. XP/challenges: F. Milestones: G. Rebirth/statistics: H. Migration: I. Shop/perks/resources: J. Reference K lists unresolved/recommended/deferred values. Reference L lists future acceptance checks, not results.

---

# Volume V - Technical Specification

**Purpose**

Documents implementation guidance for developers.

This volume defines architecture rather than gameplay.

---

## Planned Sections

### Project Structure ⚪

### Folder Structure ⚪

### Save System ⚪

### Data Structures ⚪

### Performance ⚪

### Optimisation ⚪

### Local Storage ⚪

### Balancing Systems ⚪

### Formula Reference ⚪

### Technical Standards ⚪

### Coding Standards ⚪

### Naming Standards ⚪

### Testing Standards ⚪

---

# Volume VI - Project Management

**Purpose**

Contains all project management and development information.

This volume changes frequently throughout development.

---

## Planned Sections

### Current Development Dashboard ⚪

### Current Milestone ⚪

### Current Sprint ⚪

### Roadmap ⚪

### Task Backlog ⚪

### Decision Log ⚪

### Changelog ⚪

### Developer Journal ⚪

### Known Issues ⚪

### Technical Debt ⚪

### Future Ideas ⚪

### Future Expansions ⚪

### Release Checklist ⚪

### Release Notes ⚪

### Version History ⚪

---

# Appendices

Appendices provide quick reference material.

---

## Planned Appendices

### Glossary ⚪

### Acronyms ⚪

### Entity ID Index ⚪

### Formula Index ⚪

### Progression Tables ⚪

### Ore Value Tables ⚪

### Unlock Tables ⚪

### Requirement Index ⚪

### Mermaid Diagrams ⚪

### External References ⚪

---

# Master Index

The Master Index shall contain every documented entity within the Development Bible.

Entries shall include:

• Entity Name

• Entity ID

• Section Number

• Current Status

The Master Index shall be maintained throughout the lifetime of the project.

---

# Framework Completion Status

The table below refers only to the existence of the document framework and reserved headings. It does not mark gameplay, detailed specifications, testing or launch readiness as completed.

| Area | Status |
|--------|--------|
| Front Matter | 🟢 Complete |
| Documentation Standards | 🟢 Complete |
| Document Structure | 🟢 Complete |
| Volume Framework | 🟢 Complete |
| Gameplay Framework | 🟢 Complete |
| Reference Framework | 🟢 Complete |
| Technical Framework | 🟢 Complete |
| Development Framework | 🟢 Complete |
| Appendix Framework | 🟢 Complete |

---

# Framework Revision History

| Framework Version | Date | Summary |
|-------------------|------|---------|
| 1.0.0 | Initial Release | Established the complete framework, documentation standards and permanent document structure for the Everything Factory Incremental Development Bible. |

---

# End of Framework Part 3

