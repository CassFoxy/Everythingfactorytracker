# Everything Factory Incremental — Agent Instructions

Everything Factory Incremental (TEFI) is currently being developed as an
HTML/CSS/JavaScript web game.

The web version is the reference implementation. Once V1.0 is complete and
tested, the game will be ported to Roblox using Luau.

## Development Rules

1. Never change established gameplay formulas without explicit approval.
2. Never remove existing functionality to simplify implementation.
3. Preserve save compatibility whenever possible.
4. Keep gameplay logic separated from DOM/UI logic where practical.
5. Design new systems so they can later be reproduced in Luau.
6. Avoid hard-coded balance values scattered throughout the codebase.
7. Prefer data-driven systems.
8. Add automated tests for important calculations and progression systems.
9. Test existing functionality after making changes.
10. Never rebalance unrelated systems while implementing a feature.
11. Do not implement features outside the requested development ticket.
12. Report architectural problems rather than silently redesigning systems.
13. Existing documented game design takes priority over assumptions.
14. Ask for clarification when required behaviour is genuinely ambiguous.

## Development Process

Before implementing a feature:

1. Read the relevant project documentation.
2. Inspect the existing implementation.
3. Identify systems affected by the change.
4. Implement the smallest complete solution.
5. Add/update tests.
6. Run regression tests.
7. Report what changed and any remaining concerns.



# Everything Factory Incremental — Agent Instructions

## Project Overview

Everything Factory Incremental (TEFI) is currently being developed as an HTML/CSS/JavaScript web game.

The web version is the primary development, balancing and testing environment.

Once Version 1.0 has been completed, tested and stabilised, the game will later be converted to Roblox using Luau.

The web implementation should therefore be treated as the **reference gameplay implementation** for the future Roblox version.

---

# Authoritative Project Files

Before making meaningful gameplay changes, read the following files where relevant:

1. `AGENTS.md`
2. `GAME_BIBLE.md`
3. `V1_ROADMAP.md`
4. Relevant source files

The Development Bible is the authoritative source of truth for intended gameplay behaviour.

`V1_ROADMAP.md` defines the implementation order, current development status and work required to reach Version 1.0.

If implementation and documentation conflict, report the conflict before making assumptions.

---

# Core Development Rules

## 1. Never Invent Undefined Gameplay

If a roadmap item is marked:

`🟣 DESIGN REQUIRED`

do not implement the missing gameplay rules.

Instead:

1. Identify what information is missing.
2. Explain what decisions are required.
3. Stop work on that specific ticket.
4. Continue only after the specification has been approved.

This applies especially to systems such as:

* Conveyors.
* Final Adder behaviour.
* Final Multiplier behaviour.
* Factory expansion.
* Mutations.
* Rebirth.
* Permanent progression.
* Offline progression.
* Achievement rewards.

Never create balance values, formulas or mechanics purely to complete a task.

---

## 2. Preserve Existing Functionality

Existing working systems should be extended rather than unnecessarily rewritten.

Before changing an existing system:

1. Understand its current behaviour.
2. Identify its dependencies.
3. Preserve compatible functionality.
4. Add regression tests where practical.
5. Confirm the requested feature does not break unrelated systems.

Do not remove working functionality merely because another implementation would be simpler.

---

## 3. Work in Small, Complete Tickets

Do not attempt to implement the entire V1 roadmap in one task.

Work on:

* One roadmap ticket, or
* A small group of directly dependent tickets.

Complete the requested work fully before moving on.

A ticket should normally progress through:

Specification review
→ Existing implementation review
→ Implementation plan
→ Code changes
→ Testing
→ Regression testing
→ Result summary

---

## 4. Do Not Expand Scope Without Approval

Do not add unrelated systems while implementing a ticket.

Example:

If implementing save migrations, do not also redesign achievements.

If implementing conveyors, do not rebalance ore rarity.

If implementing Factory Levels, do not redesign Rebirth.

Report useful future improvements separately instead of silently including them.

---

# Version 1.0 Factory Architecture

Version 1.0 uses a **2D tile/grid factory system** in the web implementation.

The factory system should be designed so it can later be reproduced in Roblox using Luau.

The grid architecture should support:

* Tile coordinates.
* Building occupancy.
* Direction.
* Rotation.
* Building placement.
* Building removal.
* Factory expansion.
* Resource movement.
* Machine input/output.
* Factory saving/loading.

The visual implementation should remain readable and functional rather than unnecessarily complex.

Do not build the web factory around browser-specific behaviour that would make the gameplay logic difficult to reproduce in Luau.

---

# Gameplay Logic and UI Separation

Where practical, separate gameplay calculations from DOM/UI rendering.

Avoid designs where important gameplay calculations depend directly on HTML elements.

Prefer:

```text
Game State
    ↓
Gameplay Logic
    ↓
Calculated Result
    ↓
UI Rendering
```

instead of:

```text
HTML Element
    ↓
Gameplay Calculation
    ↓
HTML Element
```

Core calculations should ideally be callable independently for:

* Automated tests.
* Progression simulations.
* Future Luau parity testing.

---

# Data-Driven Development

Prefer structured definitions over duplicated hard-coded logic.

Systems that should be data-driven where practical include:

* Resources.
* Buildings.
* Upgrades.
* Achievements.
* Milestones.
* Mutations.
* Factory Level unlocks.
* Permanent upgrades.

Balance values should not be scattered throughout unrelated functions.

Use central configuration/data definitions where appropriate.

Stone generated by Miners must never fall below a 25% probability unless you explicitly approve a future exception.

---

# Save System Rules

Save compatibility is a high priority.

When modifying persistent player data:

1. Identify whether the save schema changes.
2. Update the save version if required.
3. Add migration behaviour where necessary.
4. Provide safe defaults for missing values.
5. Validate loaded data.
6. Test saving and reloading.
7. Avoid destroying older saves unless explicitly approved.

Do not silently replace the entire save structure without a migration strategy.

Persistent systems eventually include:

* Economy.
* Inventory.
* Collection.
* Factory.
* Factory Levels.
* Achievements.
* Milestones.
* Statistics.
* Mutations.
* Rebirth.
* Permanent progression.
* Settings.

---

# Testing Requirements

Important gameplay features should include automated tests where practical.

At minimum, test deterministic calculations and state transitions.

Examples include:

* XP requirements.
* Level calculations.
* Resource values.
* Ore rarity selection.
* Machine costs.
* Furnace calculations.
* Save migrations.
* Achievement requirements.
* Milestone requirements.
* Factory placement validation.
* Factory processing.
* Rebirth calculations.
* Rebirth reset behaviour.
* Permanent bonuses.
* Offline progression calculations.

When fixing a bug, add a regression test where practical so the issue does not return.

---

# Regression Testing

After modifying a major system, check related systems.

Examples:

## Mining changes

Check:

* Inventory.
* Discovery.
* XP.
* Achievements.
* Statistics.

## Factory changes

Check:

* Saving.
* Economy.
* Factory XP.
* Inventory.
* Furnace processing.

## Mutation changes

Check:

* Inventory.
* Factory resource state.
* Furnace value.
* Collection.
* Statistics.
* Saving.

## Rebirth changes

Check:

* Cash.
* Inventory.
* Factory.
* Factory Levels.
* Achievements.
* Milestones.
* Collection.
* Statistics.
* Permanent progression.
* Save data.

---

# Balance Rules

Do not rebalance established gameplay unless the task specifically requests balancing.

Do not change:

* Ore probabilities.
* Resource values.
* XP rates.
* Machine costs.
* Upgrade costs.
* Production rates.
* Rebirth rewards.
* Mutation probabilities.

unless the change is explicitly requested or required by an approved specification.

If an existing value appears incorrect, report it rather than silently changing it.

---

# Development Bible Rules

Major gameplay behaviour should be documented before implementation.

If a newly approved design changes gameplay:

1. Update the relevant Development Bible specification.
2. Implement the change.
3. Add/update tests.
4. Update roadmap status where appropriate.

Do not silently change intended gameplay without updating documentation.

---

# Roadmap Status Rules

Do not mark a roadmap ticket `✅ COMPLETE` simply because code exists.

A ticket is complete only when:

* Required behaviour is implemented.
* Relevant UI is functional where applicable.
* Saving works where applicable.
* Relevant tests pass.
* Known critical bugs are resolved.
* The implementation matches the approved specification.
* Required dependencies are complete.

UI placeholders do not count as complete systems.

Stub functions do not count as complete systems.

Prototype behaviour does not automatically count as final V1 behaviour.

---

# Existing Systems

The current project already contains functional or partially functional implementations for systems including:

* Manual mining.
* Resource rarity selection.
* Resource catalogue.
* Inventory.
* Resource discovery.
* Collection tracking.
* Cash.
* Droppers.
* Adders prototype.
* Multipliers prototype.
* Furnaces.
* Auto Furnace.
* Factory XP.
* Factory Levels.
* Milestones.
* Achievements.
* Statistics.
* Autosaving.
* Notifications.

Inspect and reuse existing implementations before creating replacements.

---

# Factory Machine Development

The following systems require particular care.

## Droppers

A prototype already exists.

The future grid implementation should integrate existing production behaviour rather than unnecessarily replacing it.

---

## Conveyors

Conveyors are required for Version 1.0 but their detailed mechanics must be approved before implementation.

Do not invent:

* Speed.
* Capacity.
* Congestion rules.
* Item spacing.
* Upgrade values.
* Routing rules.

without documentation.

---

## Adders

A numerical prototype already exists.

Do not assume the prototype behaviour is necessarily the final building behaviour unless confirmed by the Development Bible.

---

## Multipliers

A numerical prototype already exists.

Do not assume duplication chance is necessarily the final production-building mechanic unless confirmed by the Development Bible.

---

## Furnaces

The furnace system already contains substantial functionality.

Preserve and integrate it into the new factory system rather than rebuilding it from scratch unless a rewrite is technically necessary and approved.

---

# Rebirth Development

Do not implement Rebirth until its specification defines:

* Unlock requirement.
* Reward formula.
* Reward currency.
* Reset rules.
* Retained progress.
* Permanent progression.
* Interaction with achievements.
* Interaction with milestones.
* Interaction with collection.
* Interaction with Factory Levels.
* Interaction with statistics.

Rebirth must use a central reset mechanism.

Do not manually reset unrelated state throughout multiple independent functions.

---

# Developer Tools

Development tools may bypass normal progression for testing purposes.

Developer features should never accidentally affect normal gameplay.

Useful development tools may include:

* Set Cash.
* Set Factory XP.
* Set Factory Level.
* Grant resources.
* Force resource rarity.
* Force mutations.
* Unlock systems.
* Inspect save state.
* Inspect factory state.
* Inspect tile coordinates.
* Inspect machine inputs/outputs.
* Simulate progression.

Keep developer controls clearly separated from normal player functionality.

---

# Future Luau Conversion

When implementing gameplay logic, consider whether the same system can reasonably be reproduced in Luau.

Avoid unnecessary reliance on:

* DOM-specific state.
* Browser-only timing behaviour.
* UI elements as gameplay state.
* HTML structure as game logic.

The eventual Roblox version should be able to reproduce the same calculations and behaviour using the web implementation and automated tests as references.

---

# Code Quality

Prefer:

* Clear naming.
* Small focused functions.
* Reusable logic.
* Structured state.
* Data-driven definitions.
* Comments explaining non-obvious behaviour.
* Minimal duplication.
* Predictable state changes.

Avoid:

* Large duplicated code blocks.
* Hidden global side effects.
* Magic numbers scattered throughout functions.
* Gameplay calculations inside UI rendering code.
* Unnecessary architecture complexity.

Do not over-engineer simple systems.

---

# Before Implementing a Ticket

Before writing code:

1. Read the roadmap ticket.
2. Read relevant Development Bible sections.
3. Inspect existing code.
4. Identify dependencies.
5. Identify existing behaviour that must be preserved.
6. Check whether the ticket contains unresolved design decisions.
7. Determine which tests are required.

If important design information is missing, report it before implementation.

---

# After Implementing a Ticket

After completing work:

1. Run relevant automated tests.
2. Run relevant regression tests.
3. Check save/load if persistent state changed.
4. Check browser console for errors.
5. Confirm unrelated gameplay still works.
6. Summarise all files changed.
7. Summarise behaviour added or changed.
8. List tests performed.
9. Report unresolved issues.
10. Report any recommended future work separately.
11. State which roadmap ticket has been completed.

Do not automatically begin another roadmap ticket unless requested.

---

# Required Task Summary Format

At the end of implementation work, provide a concise report using the following structure:

## Completed

* What was implemented.

## Files Changed

* File names and purpose of changes.

## Tests

* Tests added.
* Tests run.
* Results.

## Existing Behaviour Preserved

* Important systems checked for regressions.

## Remaining Issues

* Any unresolved problems.

## Design Decisions Required

* Anything that requires project-owner approval.

## Roadmap

* Ticket completed.
* Recommended next dependent ticket.

---

For subsequent tickets, do not repeat the full repository or V1 roadmap audit unless explicitly requested. Read only the documentation and source files relevant to the current ticket and its direct dependencies. Reuse existing test infrastructure and documentation wherever possible. Keep reports concise and avoid creating new documentation files unless the ticket introduces a new technical contract or design that requires one.

# Final Rule

The objective is not to implement Version 1.0 as quickly as possible.

The objective is to create a stable, maintainable and testable reference implementation of Everything Factory Incremental that accurately represents the approved design and can later be translated into Roblox using Luau.

When uncertain:

**preserve existing behaviour, follow the documentation, report ambiguity and do not invent gameplay.**

