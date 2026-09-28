# Everything Factory Incremental

# Version 1.0 Development Roadmap

> **Game:** Everything Factory Incremental
> **Roadmap Target:** Version 1.0 Public Testing
> **Current Platform:** HTML / CSS / JavaScript Web Prototype
> **Future Platform:** Roblox / Luau
> **Primary Specification:** `GAME_BIBLE.md`
> **Roadmap Status:** Active Development

---

# 1. Purpose

This roadmap defines the development work required to bring Everything Factory Incremental from its current web prototype state to a complete Version 1.0 build suitable for public testing.

The web version is the reference implementation for gameplay systems, progression, balancing and testing.

Once Version 1.0 has been completed and validated, the systems will later be translated into Roblox using Luau.

The web implementation should therefore prioritise:

* Correct gameplay behaviour.
* Maintainable architecture.
* Clear separation between gameplay logic and user interface logic.
* Data-driven systems.
* Automated testing.
* Reusable calculations.
* Future Luau compatibility.
* Save compatibility.
* Expandability.

The Development Bible remains the authoritative source of truth for intended gameplay behaviour.

If this roadmap conflicts with the Development Bible, the Development Bible takes priority unless the roadmap contains an explicitly approved newer design decision.

---

# 2. Development Status Definitions

Every roadmap item must use one of the following statuses.

## ✅ COMPLETE

The system is sufficiently implemented for Version 1.0.

Additional polish may still occur later.

---

## 🟠 IN PROGRESS

A functional implementation exists but significant Version 1.0 requirements remain incomplete.

---

## ⚪ NOT STARTED

No meaningful implementation currently exists.

---

## 🟣 DESIGN REQUIRED

The system is intended for Version 1.0, but its gameplay specification is not yet detailed enough for safe implementation.

Astra MUST NOT invent the missing rules.

The design must first be approved and documented in the Development Bible.

---

## 🔵 REVIEW REQUIRED

An implementation exists but must be reviewed against the Development Bible before additional development continues.

---

# 3. Priority Definitions

## P0 — Release Blocker

Fundamental architecture, data or specification work required before dependent systems should be developed.

---

## P1 — Core Gameplay

Systems required for the main factory gameplay loop.

---

## P2 — Progression

Systems that create medium- and long-term progression.

---

## P3 — Retention and Completion

Achievements, collections, statistics and long-term objectives.

---

## P4 — Release Quality

User experience, testing, performance, balancing and public-test preparation.

---

# 4. Version 1.0 Definition

Version 1.0 should provide a complete gameplay loop in which the player can:

1. Begin from a new save.
2. Manually gather resources.
3. Discover resources.
4. Store resources in an inventory.
5. Sell/process resources to earn Cash.
6. Purchase their first upgrades.
7. Unlock automation.
8. Build a factory using a 2D tile/grid system.
9. Place production buildings.
10. Connect factory machines using conveyors.
11. Process resources through the factory.
12. Optimise layouts and throughput.
13. Expand factory capacity.
14. Increase Factory Level.
15. Unlock additional systems.
16. Complete milestones.
17. Complete achievements.
18. Expand the Collection Log.
19. Discover mutations.
20. Reach Rebirth.
21. Perform Rebirth.
22. Receive permanent progression.
23. Begin a stronger subsequent run.
24. Continue progressing indefinitely through the Version 1.0 gameplay loop.

Version 1.0 public testing begins only once all core systems above are functional and no major system remains a placeholder.

---

# 5. Phase 0 — Specification and Architecture

## V1-001 — Development Bible Gap Audit

**Priority:** P0
**Status:** 🟠 IN PROGRESS

Review every system required for Version 1.0 and identify areas where the Development Bible does not yet provide sufficient implementation detail.

Particular attention must be given to:

* Conveyors.
* Adders.
* Multipliers.
* Factory placement.
* Factory expansion.
* Machine interactions.
* Rebirth formula.
* Rebirth reset rules.
* Permanent upgrades.
* Mutation behaviour.
* Offline progression.
* Achievement rewards.

### Completion Criteria

* Every V1 system is classified as sufficiently specified or requiring design.
* Missing specifications are listed.
* Astra does not invent undefined gameplay rules.

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

**Priority:** P0
**Status:** ⚪ NOT STARTED

Create an automated testing framework for gameplay calculations.

Initial testing should cover:

* Resource rolls.
* Resource values.
* XP calculations.
* Factory Level calculations.
* Machine costs.
* Furnace calculations.
* Save/load behaviour.
* Achievement progress.
* Milestone progress.

Additional tests must be added alongside future systems.

### Completion Criteria

* Tests can be run automatically.
* Failed calculations produce understandable errors.
* Core gameplay calculations have regression protection.

---

# 6. Phase 1 — Save System and Player State

## V1-010 — Save Versioning

**Priority:** P0
**Status:** 🟠 IN PROGRESS

Add explicit save versioning.

Example concept:

`saveVersion`

The exact version format should follow the project's selected versioning standard.

---

## V1-011 — Save Validation

**Priority:** P0
**Status:** ⚪ NOT STARTED

Validate loaded save data before applying it.

Protect against:

* Missing properties.
* Invalid values.
* Incorrect data types.
* NaN values.
* Negative values where impossible.
* Invalid item/building IDs.

---

## V1-012 — Save Migration

**Priority:** P0
**Status:** ⚪ NOT STARTED

Create a migration system allowing older saves to upgrade safely when game data changes.

---

## V1-013 — Corrupted Save Recovery

**Priority:** P0
**Status:** ⚪ NOT STARTED

Prevent corrupted LocalStorage data from making the game permanently unplayable.

Provide a safe fallback or recovery mechanism.

---

## V1-014 — Save Schema Consolidation

**Priority:** P0
**Status:** 🟠 IN PROGRESS

Organise save data into clearly defined groups.

Suggested conceptual categories:

* Player.
* Economy.
* Inventory.
* Discovery.
* Factory.
* Progression.
* Achievements.
* Milestones.
* Rebirth.
* Statistics.
* Settings.

Exact implementation may differ where justified.

---

## V1-015 — Save Regression Tests

**Priority:** P0
**Status:** ⚪ NOT STARTED

Test:

* New save creation.
* Existing save loading.
* Autosaving.
* Reloading.
* Missing values.
* Older save migration.
* Corrupted save handling.
* Reset Save.

---

# 7. Phase 2 — Opening Progression

## V1-020 — Fresh Save Progression Review

**Priority:** P1
**Status:** 🟠 IN PROGRESS

The opening progression must follow the intended player journey rather than giving automation immediately.

The intended progression should follow the Development Bible's progression structure.

The current starting Cash and immediately available Dropper must be reviewed.

---

## V1-021 — First Resource

**Priority:** P1
**Status:** ✅ COMPLETE

Manual resource production exists.

Review only for integration with future systems.

---

## V1-022 — First Discovery

**Priority:** P1
**Status:** ✅ COMPLETE

First-time ore discovery currently exists.

Preserve existing behaviour unless documentation changes.

---

## V1-023 — First Sale

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Ensure the player has a clear and understandable first sale/process interaction.

The opening economy should teach:

Resource → Value → Cash.

---

## V1-024 — First Upgrade

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Introduce a meaningful early upgrade before full automation.

The exact upgrade must follow the Development Bible or an approved design specification.

---

## V1-025 — First Automation Unlock

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Automation should be earned through progression rather than immediately available at game start unless documentation explicitly states otherwise.

---

# 8. Phase 3 — Resource System

## V1-030 — Base Resource Catalogue

**Priority:** P1
**Status:** ✅ COMPLETE

Current implementation includes:

* Stone.
* Tier 1 resources.
* Tier 2 resources.
* Tier 3 resources.
* Tier 4 resources.

Resource definitions contain:

* Name.
* Tier.
* Base value.
* XP.
* Rarity.

Preserve the existing resource catalogue unless the Development Bible changes.

---

## V1-031 — Resource Generation

**Priority:** P1
**Status:** ✅ COMPLETE

Manual rarity/resource selection exists.

Add automated tests before further balancing.

---

## V1-032 — Resource Value Calculation

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Current base values work.

The calculation system must later support:

* Adders.
* Multipliers.
* Mutations.
* Permanent bonuses.
* Achievement bonuses.
* Rebirth bonuses.

Values should be calculated through a central pipeline rather than unrelated modifications.

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

# 9. Phase 4 — Inventory

## V1-040 — Basic Inventory

**Priority:** P1
**Status:** ✅ COMPLETE

Current inventory tracks quantities of base resources.

---

## V1-041 — Inventory Data Model Upgrade

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

The inventory model must be capable of supporting future item properties such as:

* Mutations.
* Modified values.
* Other future variants.

The final structure must be approved before mutation development begins.

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

## V1-043 — Inventory Sorting and Filtering

**Priority:** P3
**Status:** ⚪ NOT STARTED

Allow useful organisation once the item system grows.

---

## V1-044 — Inventory UI Generation

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Replace unnecessary manually duplicated HTML with data-driven rendering where practical.

---

# 10. Phase 5 — Economy and Shop

## V1-050 — Cash Economy

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Cash earning and spending exist.

Review all income and spending through a central economy system.

---

## V1-051 — Shop Framework

**Priority:** P1
**Status:** ⚪ NOT STARTED

Create a proper Shop interface rather than relying solely on individual machine cards.

The Shop should eventually display:

* Name.
* Description.
* Cost.
* Ownership.
* Unlock requirements.
* Affordability.
* Relevant effect.

---

## V1-052 — Upgrade Framework

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Create a scalable upgrade system.

Upgrade definitions should be data-driven.

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

# 11. Phase 6 — 2D Tile Factory Foundation

## V1-060 — Factory Grid

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

**Priority:** P1
**Status:** ⚪ NOT STARTED

Players must be able to select and place factory buildings.

---

## V1-063 — Placement Validation

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

**Priority:** P1
**Status:** ⚪ NOT STARTED

Allow rotation for directional buildings.

---

## V1-065 — Building Removal

**Priority:** P1
**Status:** ⚪ NOT STARTED

Allow removal of buildings.

Refund behaviour requires an approved design decision.

---

## V1-066 — Building Movement

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Determine whether players may freely relocate machines or must remove/rebuild them.

---

## V1-067 — Factory Save/Load

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

# 12. Phase 7 — Production Buildings

## V1-070 — Building Definition Framework

**Priority:** P1
**Status:** ⚪ NOT STARTED

Create data-driven definitions for production buildings.

Each building should eventually define:

* ID.
* Name.
* Type.
* Cost.
* Footprint.
* Input behaviour.
* Output behaviour.
* Rotation rules.
* Processing behaviour.
* Unlock requirement.

---

## V1-071 — Droppers

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Current behaviour:

* Purchasing works.
* Cost scaling works.
* Automatic Stone generation works.
* Factory XP works.

Required changes:

* Convert from global machine counter into placeable factory building.
* Output generated resources into the factory network.
* Retain existing numerical behaviour where compatible with approved design.

---

## V1-072 — Conveyors

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

## V1-074 — Adders

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

Current prototype behaviour increases Stone value.

The final production-building behaviour must be formally specified before conversion into a placeable factory machine.

Define:

* What an Adder modifies.
* Amount added.
* Eligible resources.
* Processing timing.
* Stacking.
* Multiple Adders.
* Interactions with Multipliers.
* Upgrade behaviour.

---

## V1-075 — Multipliers

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

Current prototype behaviour provides duplication chance.

The intended V1 production behaviour must be approved before implementation.

Define:

* What is multiplied.
* Whether value, quantity or another property changes.
* Processing order.
* Stacking.
* Interaction with Adders.
* Interaction with mutations.
* Upgrade behaviour.

---

## V1-076 — Furnaces as Factory Buildings

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Existing furnace mechanics are substantial and should be preserved where possible.

Integrate furnaces into the factory grid.

---

## V1-077 — Production Chain

**Priority:** P1
**Status:** ⚪ NOT STARTED

Resources must be able to travel through an actual production network.

Target conceptual flow:

Dropper
→ Conveyor
→ Processing Building(s)
→ Furnace
→ Cash / Output

Exact processing order is determined by player layout.

---

## V1-078 — Resource Entity / Factory Item Model

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

# 13. Phase 8 — Furnace System

## V1-080 — Starter Furnace

**Priority:** P1
**Status:** ✅ COMPLETE

Preserve existing behaviour unless factory integration requires changes.

---

## V1-081 — Basic Furnace

**Priority:** P1
**Status:** ✅ COMPLETE

Preserve existing behaviour unless documentation changes.

---

## V1-082 — Auto Furnace

**Priority:** P1
**Status:** 🟠 IN PROGRESS

The existing Auto Furnace includes substantial functionality.

Preserve and adapt rather than rewriting unnecessarily.

---

## V1-083 — Furnace Capacity

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Ensure capacity works correctly within factory network behaviour.

---

## V1-084 — Furnace Processing

**Priority:** P1
**Status:** 🟠 IN PROGRESS

Integrate processing with resources arriving from factory connections.

---

## V1-085 — Furnace Regression Tests

**Priority:** P1
**Status:** ⚪ NOT STARTED

Test every furnace tier and processing mode.

---

# 14. Phase 9 — Factory Expansion

## V1-090 — Initial Factory Size

**Priority:** P1
**Status:** 🟣 DESIGN REQUIRED

Define starting grid dimensions.

---

## V1-091 — Expansion Purchases

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define:

* Expansion cost.
* Expansion size.
* Progression requirements.
* Maximum V1 grid size if any.

---

## V1-092 — Expansion Implementation

**Priority:** P2
**Status:** ⚪ NOT STARTED

Implement after design approval.

---

## V1-093 — Expansion Persistence

**Priority:** P2
**Status:** ⚪ NOT STARTED

Factory dimensions must persist through saves.

---

# 15. Phase 10 — Factory XP and Levels

## V1-100 — Factory XP

**Priority:** P2
**Status:** 🟠 IN PROGRESS

Current XP generation exists.

---

## V1-101 — Factory Level Calculation

**Priority:** P2
**Status:** 🟠 IN PROGRESS

Review the current XP/level formula and starting-state inconsistency.

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

# 16. Phase 11 — Mutations

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

# 17. Phase 12 — Collection Log

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

# 18. Phase 13 — Milestones

## V1-130 — Existing Level Milestones

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Existing milestone tracking is based largely around Factory Level.

---

## V1-131 — Milestone Framework

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Allow milestones to use different requirement types.

Examples may include:

* Factory progression.
* Resource discovery.
* Economy.
* Automation.
* Expansion.
* Collection.
* Rebirth.

Use only approved milestone definitions.

---

## V1-132 — Milestone Rewards

**Priority:** P3
**Status:** 🟣 DESIGN REQUIRED

Define whether and how milestones reward players.

---

## V1-133 — Milestone Notifications

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Existing popup can be retained and improved.

---

# 19. Phase 14 — Achievements

## V1-140 — Achievement Framework

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Current framework supports:

* Requirements.
* Progress.
* Unlock state.
* Claim state.
* Notifications.
* Persistence.

---

## V1-141 — Achievement Catalogue Expansion

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Add achievements covering approved systems such as:

* Mining.
* Resources.
* Discovery.
* Cash.
* Buildings.
* Automation.
* Factory Level.
* Collection.
* Mutations.
* Rebirth.

---

## V1-142 — Achievement Rewards

**Priority:** P3
**Status:** ⚪ NOT STARTED

Current reward data exists but does not grant rewards.

---

## V1-143 — Permanent Achievement Bonuses

**Priority:** P3
**Status:** 🟣 DESIGN REQUIRED

Define approved permanent reward types.

---

## V1-144 — Achievement Claiming

**Priority:** P3
**Status:** 🟠 IN PROGRESS

Claiming exists but must grant actual rewards.

---

## V1-145 — Achievement Regression Tests

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

# 20. Phase 15 — Statistics

## V1-150 — Existing Mining Statistics

**Priority:** P3
**Status:** ✅ COMPLETE

Basic mining/tier statistics exist.

---

## V1-151 — Lifetime Cash Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

Track:

* Lifetime Cash earned.
* Cash spent.

---

## V1-152 — Production Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

Track appropriate values such as:

* Resources produced.
* Automated resources.
* Resources processed.
* Machine throughput.

---

## V1-153 — Factory Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-154 — Playtime Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

Track:

* Current run time.
* Total playtime.

---

## V1-155 — Rebirth Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-156 — Personal Bests

**Priority:** P3
**Status:** ⚪ NOT STARTED

Only implement statistics that have defined gameplay value.

---

# 21. Phase 16 — Rebirth

## V1-160 — Rebirth Specification

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Before implementation, define:

* Unlock requirement.
* Reward currency.
* Reward formula.
* Minimum reward.
* Reset behaviour.
* Retained systems.
* Achievement behaviour.
* Collection behaviour.
* Factory Level behaviour.
* Statistics behaviour.
* Mutation behaviour.

Astra MUST NOT create a Rebirth formula without approval.

---

## V1-161 — Rebirth Preview

**Priority:** P2
**Status:** ⚪ NOT STARTED

Show:

* Current reward.
* What will reset.
* What will remain.

---

## V1-162 — Rebirth Confirmation

**Priority:** P2
**Status:** ⚪ NOT STARTED

Prevent accidental Rebirth.

---

## V1-163 — Rebirth Reset Engine

**Priority:** P2
**Status:** ⚪ NOT STARTED

Create a central reset system rather than manually resetting unrelated variables throughout the code.

---

## V1-164 — Rebirth Currency

**Priority:** P2
**Status:** ⚪ NOT STARTED

Implement after currency and formula are approved.

---

## V1-165 — Rebirth Statistics

**Priority:** P3
**Status:** ⚪ NOT STARTED

---

## V1-166 — Rebirth Tests

**Priority:** P2
**Status:** ⚪ NOT STARTED

Test every reset/retain rule explicitly.

---

# 22. Phase 17 — Permanent Progression

## V1-170 — Permanent Upgrade Specification

**Priority:** P2
**Status:** 🟣 DESIGN REQUIRED

Define the permanent progression system.

Previously discussed ideas should not be assumed final unless they are documented in the Development Bible.

---

## V1-171 — Permanent Upgrade Shop

**Priority:** P2
**Status:** ⚪ NOT STARTED

---

## V1-172 — Permanent Bonus Framework

**Priority:** P2
**Status:** 🟠 IN PROGRESS

Existing `permanentBonuses` scaffolding may be reused where appropriate.

---

## V1-173 — Permanent Bonus Integration

**Priority:** P2
**Status:** ⚪ NOT STARTED

Ensure approved bonuses actually affect calculations.

---

## V1-174 — Permanent Progression Save Support

**Priority:** P2
**Status:** ⚪ NOT STARTED

---

## V1-175 — Permanent Progression Tests

**Priority:** P2
**Status:** ⚪ NOT STARTED

---

# 23. Phase 18 — Offline Progression

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

# 24. Phase 19 — Notifications and Feedback

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

# 25. Phase 20 — Settings

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

# 26. Phase 21 — Developer Tools

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

# 27. Phase 22 — UI/UX Completion

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

# 28. Phase 23 — Balance and Simulation

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

# 29. Phase 24 — Performance and Stability

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

# 30. Phase 25 — Version 1.0 Release Candidate

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

# 31. Phase 26 — Closed Testing

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

# 32. Phase 27 — Version 1.0 Public Testing

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

# 33. Current High-Level Status

## Completed

* Base resource catalogue.
* Core manual mining.
* Base rarity/resource rolling.
* Basic ore discovery.
* Basic inventory.
* Basic mining statistics.
* Starter Furnace.
* Basic Furnace.
* Discovery popup.
* Achievement notification.
* Milestone notification.

---

## In Progress

* Save system.
* Code architecture.
* Opening progression.
* Economy.
* Shop/upgrades.
* Inventory.
* Resource value pipeline.
* Droppers.
* Adders prototype.
* Multipliers prototype.
* Auto Furnace.
* Furnace integration.
* Factory XP.
* Factory Levels.
* Milestones.
* Achievements.
* Collection Log.
* Statistics.
* Developer tools.
* Main UI.
* Responsive UI.
* Permanent bonus scaffolding.

---

## Not Started

* Automated testing.
* Proper Shop framework.
* 2D factory grid.
* Building placement.
* Factory connections.
* Conveyor simulation.
* Production network.
* Factory expansion.
* Mutation implementation.
* Achievement rewards.
* Rebirth.
* Rebirth currency.
* Permanent progression.
* Offline progression.
* Settings.
* Factory debug tools.
* Progression simulator.
* Full balance pass.
* Stress testing.
* Closed testing.
* Public testing.

---

## Design Required Before Implementation

* Conveyor mechanics.
* Final Adder mechanics.
* Final Multiplier mechanics.
* Inventory capacity.
* Advanced inventory item model.
* Building movement/refunds.
* Starting factory size.
* Factory expansion rules.
* Factory Level unlock table.
* Mutation system.
* Milestone rewards.
* Permanent achievement rewards.
* Rebirth formula.
* Rebirth reset/retain rules.
* Rebirth currency.
* Permanent progression/upgrades.
* Offline progression rules.
* Relevant settings.

---

# 34. Recommended Immediate Development Sequence

Astra should initially work in the following order.

## Step 1

Complete a repository and specification audit.

Do not modify gameplay yet.

---

## Step 2

Harden:

* Save versioning.
* Save validation.
* Save migrations.
* Save recovery.

---

## Step 3

Create the automated testing foundation.

---

## Step 4

Separate core game logic from UI logic where required to support the factory simulation.

Avoid unnecessary rewriting.

---

## Step 5

Correct the opening progression.

Fresh save progression should clearly teach:

Manual resource gathering
→ Selling
→ Upgrade
→ Automation

---

## Step 6

Design and implement the 2D factory grid.

---

## Step 7

Implement building placement and persistence.

---

## Step 8

Pause development if Conveyor, Adder or Multiplier specifications are still incomplete.

Request design clarification instead of inventing behaviour.

---

## Step 9

Once specifications are approved, implement:

Dropper
→ Conveyor
→ Processing
→ Furnace

as a functioning production network.

---

## Step 10

Implement factory expansion and Factory Level progression.

---

## Step 11

Upgrade the inventory/resource model and implement mutations.

---

## Step 12

Complete:

* Collection Log.
* Milestones.
* Achievements.
* Achievement rewards.
* Statistics.

---

## Step 13

Design and implement Rebirth.

---

## Step 14

Implement permanent progression.

---

## Step 15

Implement offline progression.

---

## Step 16

Complete the UI and settings.

---

## Step 17

Run:

* Automated tests.
* Economy simulations.
* Progression simulations.
* Performance tests.
* Save tests.

---

## Step 18

Balance the entire V1 progression loop.

---

## Step 19

Create the Version 1.0 release candidate.

---

## Step 20

Begin closed testing.

---

## Step 21

Resolve major issues and release Version 1.0 for public testing.

---

# 35. Astra Development Rules for This Roadmap

When working from this roadmap, Astra MUST:

1. Read `AGENTS.md`.
2. Read the relevant Development Bible sections.
3. Inspect the existing implementation.
4. Preserve functional systems wherever practical.
5. Avoid unnecessary rewrites.
6. Never invent behaviour for a `DESIGN REQUIRED` system.
7. Never rebalance unrelated systems.
8. Implement one bounded ticket or closely related ticket group at a time.
9. Add or update tests.
10. Run relevant regression tests.
11. Preserve save compatibility where practical.
12. Report any conflict between code, roadmap and Development Bible.
13. Update roadmap status only when acceptance criteria are actually satisfied.
14. Never mark a system complete solely because UI exists.
15. Never mark a system complete solely because placeholder logic exists.
16. Treat the web game as the reference implementation for the eventual Luau version.

---

# 36. Version 1.0 Completion Standard

Version 1.0 is considered feature-complete when:

* The opening progression works.
* Manual mining works.
* Resource discovery works.
* Inventory works.
* Economy works.
* The 2D factory works.
* Building placement works.
* Conveyors work.
* Droppers work through the factory.
* Adders work through the factory.
* Multipliers work through the factory.
* Furnaces work through the factory.
* Factory expansion works.
* Factory XP and Levels work.
* Mutations work.
* Collection Log works.
* Milestones work.
* Achievements work.
* Achievement rewards work.
* Statistics work.
* Rebirth works.
* Permanent progression works.
* Offline progression works.
* Saving/loading is robust.
* Settings work.
* Major UI is complete.
* Automated tests pass.
* The economy has been balanced.
* Performance is acceptable.
* A player can complete the intended gameplay loop from a fresh save without developer tools.
* Multiple Rebirth cycles function correctly.
* No critical unfinished Version 1.0 systems remain.

At that point, development moves from feature development into public-testing support, balancing and bug fixing.
