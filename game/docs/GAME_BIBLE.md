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
> **Game Version:** 0.1.0 Alpha
>
> **Specification Version:** 1.0.0
>
> **Repository:** *To Be Added*
>
> **Primary Branch:** *To Be Added*
>
> **Maintained By:** Project Development Team
>
> **Last Updated:** *To Be Updated Automatically*
>
> **Document Type:** Engineering Specification & Development Handbook

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

| Section | Status | Purpose |
|---------|--------|---------|
| **1.1 Game Vision** | ⚪ | Defines the long-term vision and identity of the game. |
| **1.2 Project Overview** | ⚪ | Provides a concise overview of the entire project. |
| **1.3 Design Philosophy** | ⚪ | Defines the principles used when designing gameplay systems. |
| **1.4 Development Philosophy** | ⚪ | Defines the principles used while developing the project. |
| **1.5 Player Experience Goals** | ⚪ | Describes how the player should feel throughout progression. |
| **1.6 Documentation Standards** | ⚪ | References the documentation standards established within the framework. |
| **1.7 Project Scope** | ⚪ | Defines the intended scope of Version 1.0. |
| **1.8 Out of Scope Features** | ⚪ | Lists features intentionally excluded from Version 1.0. |

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
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
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

Everything Factory Incremental is a progression-based factory building and incremental game developed on the Roblox platform.

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
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
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

The following gameplay systems are considered part of the Version 1.0 release.

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

- Droppers
- Conveyors
- Furnaces
- Adders
- Multipliers

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
- Good performance on Roblox-supported devices.
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
> **Status:** 🟠 In Development
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
- Timed challenges.

Version 1.0 should remain focused on permanent progression rather than temporary content.

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

**Purpose**

Documents the intended player experience from the moment the game launches through to long-term progression.

This volume focuses on how the player experiences the game rather than how systems are implemented.

---

## Planned Sections

### 1. First Launch ⚪

### 2. First Minute ⚪

### 3. First Five Minutes ⚪

### 4. First Hour ⚪

### 5. Early Game ⚪

### 6. Mid Game ⚪

### 7. Late Game ⚪

### 8. End Game ⚪

### 9. First Rebirth ⚪

### 10. Long-Term Progression ⚪

---

# Volume III - Gameplay Specification

**Purpose**

Defines every gameplay mechanic in the order it is introduced to the player.

Systems shall be documented in progression order rather than alphabetical order.

---

## Planned Sections

### Introduction ⚪

### Gameplay Loop ⚪

### Manual Mining ⚪

### Stone ⚪

### Inventory ⚪

### Cash ⚪

### Shop ⚪

### First Buildings ⚪

#### Dropper ⚪

#### Conveyor ⚪

#### Furnace ⚪

#### Adder ⚪

#### Multiplier ⚪

### Ore Progression ⚪

### Automation ⚪

### Factory Expansion ⚪

### Factory Statistics ⚪

### Collection Log ⚪

### Achievements ⚪

### Milestones ⚪

### Factory Levels ⚪

### Rebirth ⚪

### Offline Progression ⚪

---

# Volume IV - Reference Library

**Purpose**

Provides the complete technical specification for every individual gameplay entity.

Unlike Volume III, this volume serves as an encyclopaedia rather than a progression guide.

All entities shall be ordered by progression or value rather than alphabetically.

---

## Planned Sections

### Ores ⚪

Stone

Amber

Amethyst

Malachite

Quartz

Topaz

Aquamarine

Citrine

Garnet

Jade

Peridot

Emerald

Ruby

Sapphire

Spinel

Tourmaline

Alexandrite

Black Opal

Diamond

Onyx

Tanzanite

---

### Buildings ⚪

Dropper

Conveyor

Furnace

Adder

Multiplier

Future Buildings

---

### Machines ⚪

---

### Upgrades ⚪

---

### Mutations ⚪

---

### Achievements ⚪

---

### Milestones ⚪

---

### User Interface ⚪

---

### Currencies ⚪

Cash

XP

Future Currencies

---

### Statistics ⚪

---

### Visual Effects ⚪

---

### Audio ⚪

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
