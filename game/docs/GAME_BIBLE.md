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

| Section | Status | Purpose |
|---------|--------|---------|
| **2.1 First Launch** | ⚪ | Documents the player's very first interaction with the game. |
| **2.2 First Resource** | ⚪ | Covers the first manual gathering of Stone and introduction to resource collection. |
| **2.3 First Sale** | ⚪ | Introduces the economy, selling resources and earning the first currency. |
| **2.4 First Upgrade** | ⚪ | Covers the player's first permanent progression upgrade and introduces progression philosophy. |
| **2.5 First Automation** | ⚪ | Documents unlocking and understanding the first automated factory components. |
| **2.6 First Factory Expansion** | ⚪ | Covers expanding the factory and introducing larger-scale production. |
| **2.7 First Optimisation** | ⚪ | Documents when players begin experimenting with layouts, efficiency and strategy. |
| **2.8 First Discovery** | ⚪ | Introduces discovering new ores, mechanics and hidden progression. |
| **2.9 First Long-Term Goal** | ⚪ | Covers achievements, collections, milestones and other persistent objectives. |
| **2.10 First Rebirth** | ⚪ | Documents the player's first prestige experience and permanent progression reset. |
| **2.11 Long-Term Progression** | ⚪ | Defines the intended experience after all core mechanics have been introduced. |

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

## 2.1 First Launch

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-001
>
> **Player Milestone:** First Launch
>
> **Prerequisite:** None
>
> **Next Milestone:** First Resource

---

# Purpose

This section defines the player's first experience when launching Everything Factory Incremental.

The first launch is responsible for creating a positive first impression, introducing the game's visual identity and encouraging the player to begin interacting with the world.

No complex gameplay systems should be introduced during this stage.

Instead, the objective is to establish curiosity and confidence.

---

# Design Philosophy

The first launch should answer three questions for the player as quickly as possible.

- What is this game?
- What am I supposed to do?
- Why should I keep playing?

The player should never feel confused immediately after joining.

Instead, they should feel encouraged to explore.

---

# Intended Player Experience

The player should experience:

- Curiosity.
- Excitement.
- Comfort.
- Confidence.

The player should immediately understand that the game is approachable while also sensing that there is significantly more depth waiting to be discovered.

---

# First Impression Goals

The opening experience should communicate:

- The visual style of the game.
- The atmosphere of the world.
- The quality of the user interface.
- The polish of the gameplay.
- The responsiveness of player controls.

The player should feel that they are entering a carefully designed world rather than an unfinished project.

---

# Initial World Design

Upon spawning, the player should immediately see:

- Their starting factory area.
- The first resource node.
- A clear route towards interaction.
- A clean and uncluttered environment.
- Visual hints towards future expansion.

The world should feel larger than the player's current capabilities.

This encourages curiosity without overwhelming the player.

---

# User Interface

Only essential interface elements should be visible during the first launch.

Examples include:

- Cash.
- Inventory.
- Experience.
- Factory Level.
- Basic objective.

Advanced systems should remain hidden until they become relevant.

The interface should gradually expand alongside progression.

---

# Player Guidance

The game should naturally encourage the player towards interacting with the first resource.

Guidance should rely upon environmental design wherever possible.

Examples include:

- Camera positioning.
- Object placement.
- Lighting.
- Visual emphasis.
- Simple objective prompts.

Lengthy tutorials should be avoided.

Players should learn primarily through interaction.

---

# Audio & Presentation

The first launch should establish the identity of Everything Factory Incremental.

Considerations include:

- Ambient music.
- User interface sounds.
- Mining sound effects.
- Interaction feedback.
- Visual animations.

Every interaction should feel responsive.

---

# Success Criteria

The first launch has achieved its objective if the player:

- Understands where they are.
- Understands what to interact with.
- Feels comfortable exploring.
- Successfully begins interacting with the world.
- Looks forward to discovering additional mechanics.

---

# Transition

The completion of this milestone occurs when the player successfully begins interacting with their first resource.

At this point, progression moves into **2.2 First Resource**, where the player learns the fundamental gameplay mechanic of gathering materials.

---

# Related Sections

- Volume I – Project Foundation
- 1.5 Player Experience Goals
- 2.2 First Resource
- Volume III – Core Gameplay Systems

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Launch specification created. |

---

## 2.2 First Resource

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-002
>
> **Player Milestone:** First Resource
>
> **Prerequisite:** First Launch
>
> **Next Milestone:** First Sale

---

# Purpose

This milestone introduces the player to the first interactive gameplay mechanic within Everything Factory Incremental.

The player gathers their first resource, Stone, establishing the fundamental gameplay loop that every future progression system will build upon.

This interaction should immediately communicate that player actions produce tangible rewards.

---

# Design Philosophy

The first resource serves as the player's introduction to progression.

Although gathering Stone appears simple, it establishes several important concepts that remain relevant throughout the entire game.

These concepts include:

- Interaction produces resources.
- Resources have value.
- Resources contribute towards progression.
- Every action moves the player forward.

This milestone should feel satisfying despite its simplicity.

---

# Intended Player Experience

The player should experience:

- Curiosity.
- Satisfaction.
- Immediate feedback.
- A sense of accomplishment.

The player should understand that interacting with the world always results in meaningful progress.

---

# System Overview

Stone represents the first obtainable resource within Everything Factory Incremental.

It is intentionally common and easy to collect.

Although Stone has relatively low value compared with later resources, it establishes mechanics that will later apply to every ore and collectible item within the game.

Stone is designed to teach gameplay rather than provide significant wealth.

---

# Gameplay Flow

The intended sequence is:

```text
Player approaches Stone

↓

Player interacts

↓

Mining animation begins

↓

Stone collected

↓

Inventory updates

↓

Player receives visual and audio feedback

↓

Player notices increasing inventory

↓

Player begins asking:

"What do I do with this?"
```

This final question naturally transitions the player into the next milestone.

---

# User Interface Behaviour

During this milestone the player should become familiar with:

- Inventory count increasing.
- Resource notifications.
- Collection feedback.
- Experience gained (if applicable).
- Progress indicators.

Only the information required for this milestone should be visible.

The interface should avoid unnecessary complexity.

---

# Audio & Visual Feedback

Collecting the first Stone should feel rewarding.

Feedback should include:

- Mining sound effects.
- Collection sound.
- Visual particle effects.
- Inventory animation.
- Resource popup.
- Subtle screen feedback where appropriate.

Every interaction should reinforce that progress has been made.

---

# Educational Purpose

Without presenting explicit tutorials, the player should naturally learn that:

- Resources can be gathered.
- Gathering resources is straightforward.
- The inventory stores collected materials.
- Collected materials will become useful.

The game should encourage learning through interaction rather than instruction.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Successfully collects Stone.
- Understands that resources can be gathered.
- Notices the inventory updating.
- Understands that progression has begun.
- Wants to discover the purpose of the collected resources.

---

# Transition

At the completion of this milestone the player has collected resources but has not yet received a reward for doing so.

The natural question becomes:

> "How do I turn these resources into progress?"

The answer is introduced in **2.3 First Sale**, where the player learns that collected resources can be exchanged for currency, unlocking the economic progression that drives the early game.

---

# Related Sections

- 2.1 First Launch
- 2.3 First Sale
- Volume III – Resource System
- Volume III – Stone
- Volume III – Inventory

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Resource specification created. |

---

## 2.3 First Sale

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-003
>
> **Player Milestone:** First Sale
>
> **Prerequisite:** First Resource
>
> **Next Milestone:** First Upgrade

---

# Purpose

This milestone introduces the player to the in-game economy by allowing them to exchange their first collected resources for currency.

It establishes one of the most important progression concepts within Everything Factory Incremental:

> Collected resources have value.

The player should immediately understand that gathering resources directly contributes towards future progression.

---

# Design Philosophy

The first sale exists to connect effort with reward.

Until this point the player has gathered resources but has not yet experienced meaningful progression.

Selling resources transforms collected items into purchasing power, introducing the economic loop that drives the remainder of the game.

This interaction should feel rewarding without requiring explanation.

---

# Intended Player Experience

The player should experience:

- Satisfaction.
- Achievement.
- Motivation.
- Curiosity.

The player should begin asking:

- "What can I buy now?"
- "How can I earn currency faster?"
- "What happens if I keep collecting resources?"

These questions naturally encourage continued progression.

---

# System Overview

The selling system introduces the concept that gathered resources contribute towards permanent progression.

The player learns that:

- Resources are valuable.
- Currency is earned through gameplay.
- Currency enables progression.
- Gathering resources has a meaningful purpose.

The first sale marks the moment where the complete gameplay loop begins to take shape.

---

# Gameplay Flow

The intended sequence is:

```text
Player gathers Stone

↓

Player reaches the selling point

↓

Player sells collected resources

↓

Currency increases

↓

Selling feedback is displayed

↓

Player notices they can now afford new upgrades

↓

Player begins exploring available purchases
```

The sale should feel immediate and rewarding.

Waiting should never interrupt the player's first experience with the economy.

---

# User Interface Behaviour

During this milestone the player should become familiar with:

- Current currency.
- Currency increases.
- Selling interface.
- Resource totals.
- Basic purchasing information.

The player should always understand:

- What they sold.
- What they received.
- Their new balance.

Feedback should be clear, immediate and satisfying.

---

# Audio & Visual Feedback

Selling resources should provide positive reinforcement.

Examples include:

- Currency increase animation.
- Coin sound effect.
- Resource removal animation.
- Currency popup.
- UI highlights.

The player should immediately recognise that progression has occurred.

---

# Developer Intent

The purpose of this milestone is to establish trust in the game's progression system.

The player should quickly understand that every action has a tangible reward.

The selling mechanic is intentionally introduced before any major upgrades so that players appreciate the relationship between gathering resources, earning currency and unlocking new opportunities.

This milestone also creates anticipation for the next stage of progression, where currency can be invested rather than simply collected.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Successfully sells resources.
- Understands that resources generate currency.
- Recognises that currency enables progression.
- Begins looking for ways to improve earnings.
- Wants to purchase their first upgrade.

---

# Transition

After earning currency for the first time, the player's attention naturally shifts towards spending it.

Rather than asking:

> "How do I make money?"

The player now asks:

> "What should I buy first?"

This curiosity leads directly into **2.4 First Upgrade**, where the player experiences their first permanent improvement and begins to understand that every investment strengthens their future progression.

---

# Related Sections

- 2.2 First Resource
- 2.4 First Upgrade
- Volume III – Selling System
- Volume III – Currency System
- Volume III – Economy

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Sale specification created. |

---

## 2.4 First Upgrade

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-004
>
> **Player Milestone:** First Upgrade
>
> **Prerequisite:** First Sale
>
> **Next Milestone:** First Automation

---

# Purpose

This milestone introduces the player to permanent progression through their first meaningful purchase.

For the first time, the player exchanges earned currency for a lasting improvement that increases future efficiency.

This establishes one of the most important concepts within Everything Factory Incremental:

> Investing resources today creates greater rewards tomorrow.

This milestone transforms progression from simple resource gathering into long-term decision making.

---

# Design Philosophy

The first upgrade is intentionally designed to create excitement for future progression.

Rather than simply increasing a statistic, the purchase should demonstrate that the player's decisions permanently improve their factory and future gameplay.

The player should immediately notice the benefit of their investment.

Every future upgrade builds upon this same philosophy.

---

# Intended Player Experience

The player should experience:

- Satisfaction.
- Ownership.
- Progress.
- Anticipation.

The player should feel that they have taken the first meaningful step towards building something much larger than their starting factory.

The upgrade should encourage the player to immediately begin working towards their next purchase.

---

# System Overview

The first upgrade introduces several important progression concepts.

The player learns that:

- Currency has long-term value.
- Purchases permanently improve progression.
- Different upgrades will eventually require meaningful decisions.
- Progress is no longer temporary.

This milestone establishes the foundation for every future upgrade system within the game.

---

# Gameplay Flow

The intended sequence is:

```text
Player earns currency

↓

Player opens the upgrade interface

↓

Player reviews available upgrades

↓

Player purchases their first upgrade

↓

The upgrade immediately takes effect

↓

The player notices improved efficiency

↓

The player begins planning their next purchase
```

The improvement should be obvious enough that the player immediately recognises the value of investing in upgrades.

---

# User Interface Behaviour

The player should become familiar with:

- Upgrade categories.
- Upgrade descriptions.
- Purchase buttons.
- Cost displays.
- Upgrade levels.
- Affordability indicators.

The interface should clearly communicate:

- What the upgrade does.
- What it costs.
- Whether it has been purchased.
- How progression has changed.

The purchasing experience should feel quick, intuitive and rewarding.

---

# Audio & Visual Feedback

Purchasing an upgrade should feel like a meaningful achievement.

Examples include:

- Purchase sound effects.
- Upgrade animations.
- Visual confirmation.
- Updated progression indicators.
- Immediate gameplay feedback.

The player should never question whether the purchase was successful.

---

# Developer Intent

This milestone exists to teach investment rather than spending.

The player should understand that currency is not simply collected—it is transformed into permanent progress.

The first upgrade should deliberately create a positive feedback loop:

- Gather resources.
- Earn currency.
- Invest in upgrades.
- Progress faster.
- Unlock new possibilities.

This loop becomes the foundation for the remainder of the game.

The player's first purchase should also create anticipation for larger and more exciting upgrades later in progression.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Purchases their first upgrade.
- Understands that upgrades provide permanent progression.
- Notices an immediate improvement.
- Feels motivated to purchase additional upgrades.
- Begins planning future progression.

---

# Transition

At this point the player understands the complete manual progression loop.

They can:

- Gather resources.
- Sell resources.
- Purchase upgrades.

The next milestone introduces the first major evolution of gameplay.

Rather than performing every action manually, the player unlocks automation for the first time.

This transition represents one of the largest shifts in the player's journey and marks the beginning of factory management.

The player now enters **Act II — Building the Factory**, beginning with **2.5 First Automation**.

---

# Related Sections

- 2.3 First Sale
- 2.5 First Automation
- Volume III – Upgrade System
- Volume III – Shop System
- Volume III – Progression Systems

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Upgrade specification created. |

---

# Act II — Building the Factory

> *The player transitions from manually gathering resources to designing, expanding and optimising an increasingly capable automated factory.*

---

## 2.5 First Automation

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-005
>
> **Player Milestone:** First Automation
>
> **Prerequisite:** First Upgrade
>
> **Next Milestone:** First Factory Expansion

---

# Purpose

This milestone introduces the player to automation for the first time.

Automation represents the largest shift in gameplay since the beginning of the game.

Until this point, every resource has required direct player interaction.

From this milestone onwards, the factory itself begins contributing towards progression.

The player's role begins transitioning from manually gathering resources to designing, expanding and improving an increasingly efficient production system.

---

# Design Philosophy

Automation should feel transformative.

The player's first automated machine should not simply reduce clicking.

Instead, it should fundamentally change how the player thinks about progression.

From this point onwards, the player should begin asking questions such as:

- How can I make this faster?
- How can I build a better factory?
- What should I automate next?
- How can I improve efficiency?

Automation should introduce a new layer of gameplay rather than replacing existing gameplay.

---

# Intended Player Experience

The player should experience:

- Excitement.
- Empowerment.
- Curiosity.
- Creativity.
- Satisfaction.

This milestone should create the feeling that the player is now building something much larger than themselves.

The factory should begin to feel alive.

---

# System Overview

Automation introduces the first factory components capable of producing resources independently.

The player begins interacting with production systems rather than performing every task manually.

This milestone establishes the foundation for every future factory mechanic including:

- Production chains.
- Resource flow.
- Factory layouts.
- Building placement.
- Efficiency improvements.
- Future automation systems.

Automation should complement manual gameplay rather than immediately replacing it.

---

# Gameplay Flow

The intended sequence is:

```text
Player unlocks automation

↓

Player purchases their first automated building

↓

Player places the building

↓

The building begins operating

↓

Resources are produced automatically

↓

The player observes the production process

↓

The player begins experimenting with factory layouts

↓

The player wants to expand production
```

The first automated production cycle should be immediately visible.

The player should never wonder whether the machine is working.

---

# User Interface Behaviour

The player should become familiar with:

- Building placement.
- Production indicators.
- Machine status.
- Resource flow.
- Factory interaction.
- Automation controls.

The interface should communicate that automation is simple to understand while leaving room for increasing complexity later in the game.

---

# Audio & Visual Feedback

Automation should feel satisfying to watch.

Examples include:

- Machine operating sounds.
- Conveyor movement.
- Resource animations.
- Building activation effects.
- Production indicators.
- Continuous movement throughout the factory.

The factory should appear active even when the player is not interacting directly.

Movement creates the impression that the factory is constantly working.

---

# Educational Purpose

This milestone should naturally teach the player that:

- Machines can perform work independently.
- Factory layout influences production.
- Automation increases efficiency.
- Building placement matters.
- Production can continue while the player focuses elsewhere.

The player should begin thinking like a factory designer rather than simply a resource collector.

---

# Developer Intent

This milestone represents the point where Everything Factory Incremental establishes its unique identity.

The objective is not to remove manual gameplay.

Instead, the objective is to shift the player's role.

Before automation, the player performs the work.

After automation, the player improves the systems that perform the work.

This change in perspective is fundamental to the long-term design of the game.

Every future production system, upgrade and optimisation mechanic builds upon this milestone.

If the player finishes this milestone feeling excited to redesign and improve their factory, then it has achieved its purpose.

---

# Success Criteria

This milestone has achieved its objective if the player:

- Successfully unlocks automation.
- Places their first automated building.
- Understands that machines can produce resources independently.
- Watches automated production with interest.
- Begins considering factory layout.
- Wants to expand their production capabilities.

---

# Transition

The player has now experienced the first stage of automation.

The natural next question becomes:

> "How much bigger can I make this?"

Rather than focusing on a single automated machine, the player begins thinking about expanding their entire production line.

This transition marks the beginning of **2.6 First Factory Expansion**, where the player starts building a larger, more capable and increasingly efficient factory.

---

# Related Sections

- 2.4 First Upgrade
- 2.6 First Factory Expansion
- Volume III – Factory System
- Volume III – Droppers
- Volume III – Conveyors
- Volume III – Automation

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial First Automation specification created. |

---

## 2.6 First Factory Expansion

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-006
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

---

## 2.7 First Optimisation

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-007
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

---

## 2.8 First Discovery

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-008
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

---

# Act III — Mastery & Long-Term Progression

> *The player shifts from following guided progression to pursuing personal goals, mastering interconnected systems and preparing for years of future expansion.*

---

## 2.9 First Long-Term Goal

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-009
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
---

## 2.10 First Rebirth

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-010
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

Factory progression resets

↓

Permanent progression is awarded

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

---
## 2.11 Long-Term Progression

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL2-011
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

---

# Volume III - Gameplay Specification

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
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

# Planned Chapters

## Introduction

# 3.1 Volume Overview

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
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
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.2

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

---

# Part I — Core Gameplay

# 3.3 Manual Mining System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.3

---

# Purpose

The Manual Mining System serves as the player's first method of resource acquisition.

It introduces the fundamental interaction between the player and the game world while establishing the core gameplay loop that all future automation systems will expand upon.

Manual Mining exists primarily as a learning and progression mechanic rather than a permanent method of resource production.

---

# Responsibilities

The Manual Mining System is responsible for:

- Allowing players to manually acquire resources.
- Validating mining interactions.
- Awarding resources following successful mining.
- Providing player feedback during mining.
- Introducing the player to resource acquisition.

The Manual Mining System is not responsible for:

- Defining individual resources.
- Managing inventory storage.
- Assigning economic value.
- Processing resources.
- Factory automation.

---

# Overview

At the beginning of a new game, manual mining is the only available method of obtaining resources.

The player actively mines resource nodes through direct interaction, receiving resources that can later be processed, sold or used for progression.

As the factory develops, manual mining gradually becomes supplementary rather than essential.

Although automation eventually replaces manual production, manual mining remains available throughout the game.

---

# Design Intent

The Manual Mining System is designed to:

- Teach the player how resources are acquired.
- Introduce the relationship between effort and reward.
- Familiarise the player with the game's controls.
- Provide meaningful interaction before automation is unlocked.
- Encourage players to transition naturally towards automated production.

Manual mining should feel rewarding during the opening stages of the game while becoming increasingly inefficient compared to factory automation.

The player should naturally want to automate production rather than feeling forced to do so.

---

# Gameplay Rules

The Manual Mining System should follow these principles:

- Mining requires direct player interaction.
- Mining always produces valid resources.
- Resource acquisition should be immediate and clearly communicated.
- Mining actions should provide satisfying visual and audio feedback.
- The player should never be left uncertain whether a mining action succeeded.

Manual mining should remain reliable and predictable throughout the game.

---

# Player Interaction

The player performs manual mining by interacting with mineable resource nodes within the world.

Successful interactions produce resources which are immediately transferred into the player's inventory, provided sufficient inventory space is available.

Each successful mining action should provide clear feedback through animation, sound and user interface updates.

---

# Progression Role

Manual mining introduces several core concepts that are expanded upon throughout the game.

These include:

- Resource acquisition.
- Inventory management.
- Currency generation.
- Factory progression.
- Production efficiency.

Manual mining acts as the player's first production method before automation systems become available.

---

# System Behaviour

The Manual Mining System should:

- Detect valid mineable objects.
- Validate player interaction.
- Generate the appropriate resource.
- Transfer resources to the inventory.
- Trigger visual, audio and UI feedback.
- Update gameplay statistics where appropriate.

The system should operate consistently regardless of progression level.

---

# Dependencies

The Manual Mining System depends upon:

- Resource System
- Inventory System
- User Interface Behaviour
- Statistics System

These systems determine how mined resources are generated, stored and presented to the player.

---

# System Interactions

The Manual Mining System interacts directly with:

| System | Interaction |
|----------|-------------|
| Resource System | Determines which resources are produced. |
| Inventory System | Stores mined resources. |
| Economy System | Allows mined resources to be converted into currency. |
| Statistics System | Records mining activity. |
| Achievement System | Tracks mining milestones where applicable. |

Manual Mining serves as the entry point for multiple gameplay systems introduced later within the game.

---

# Balancing Considerations

Manual mining should:

- Be satisfying during the early game.
- Never become completely obsolete.
- Always remain less efficient than equivalent automated production.
- Reward active play without invalidating automation.

Balance should encourage progression rather than dependency.

---

# Future Expansion

Potential future improvements may include:

- Tool upgrades.
- Mining speed improvements.
- Resource-specific mining bonuses.
- Temporary buffs.
- Critical mining events.
- Special manual-only resources.
- New interaction mechanics.

These additions should enhance manual gameplay without replacing the importance of automation.

---

# Developer Notes

Manual Mining is intentionally designed as the player's introductory production method.

The objective is not to maximise long-term efficiency, but to establish the gameplay concepts that every subsequent production system expands upon.

Automation should always feel like the logical evolution of manual mining rather than a completely separate mechanic.

---

# Related Sections

- 3.2 Core Gameplay Loop
- 3.4 Resource System
- 3.5 Inventory System
- 3.6 Economy System
- 3.8 Production Building System

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Manual Mining System specification created. |

# 3.4 Resource System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.4

---

# Purpose

The Resource System defines how all collectible resources within Everything Factory Incremental are represented, acquired, categorised, processed and utilised.

It provides a consistent framework that governs every resource introduced throughout the game, regardless of rarity, progression stage or acquisition method.

Individual resources are documented separately within **Volume IV – Reference Library**.

---

# Responsibilities

The Resource System is responsible for:

- Defining how resources are represented.
- Categorising resources.
- Defining resource properties and behaviours.
- Providing a consistent framework for all collectible resources.
- Supporting future resource expansion.

The Resource System is not responsible for:

- Storing player-owned resources.
- Pricing resources.
- Defining production methods.
- Managing gameplay progression.
- Documenting individual resources.

---

# Overview

Resources are the primary objects that drive player progression.

Every major gameplay system either generates, transforms, consumes or rewards resources.

The Resource System provides a common set of rules that ensure all resources behave consistently while allowing individual resources to possess unique characteristics.

Rather than defining individual items, this system defines how resources function as a whole.

---

# Design Intent

The Resource System is designed to:

- Provide a consistent structure for all collectible resources.
- Support simple early-game progression while allowing significant long-term expansion.
- Encourage discovery through increasingly valuable resources.
- Ensure new resources can be introduced without requiring changes to the underlying system.
- Separate gameplay behaviour from individual resource definitions.

This approach allows the content of the game to expand indefinitely while keeping the gameplay rules stable.

---

# Resource Definition

Every resource should define its own set of gameplay properties.

Typical properties may include:

- Name
- Description
- Category
- Tier
- Base Value
- Rarity
- Stack Behaviour
- Processing Behaviour
- Unlock Requirements
- Visual Representation
- Audio Feedback
- Special Properties

Not every resource will require every property.

Additional properties may be introduced as new gameplay systems are developed.

---

# Resource Categories

Resources may be organised into categories based upon their gameplay purpose.

Examples include:

- Basic Resources
- Ores
- Refined Materials
- Precious Resources
- Manufactured Components
- Event Resources
- Collectibles
- Special Items

Categories exist primarily for organisation and gameplay interactions.

The complete list of categories is maintained within Volume IV.

---

# Resource Lifecycle

Every resource follows the same general lifecycle.

```
Generated

↓

Collected

↓

Stored

↓

Used

↓

Consumed
or
Retained
```

Not every resource will utilise every stage.

Some resources may bypass processing entirely, while others may participate in multiple gameplay systems before being consumed.

---

# Resource Acquisition

Resources may be obtained through multiple gameplay systems.

Examples include:

- Manual Mining
- Automated Production
- Processing Buildings
- Exploration
- Achievements
- Events
- Milestones
- Rebirth Rewards

Future acquisition methods should integrate into this system without requiring structural changes.

---

# Resource Behaviour

Every resource should behave consistently within the game world.

Resources may define:

- Whether they can stack.
- Whether they can be processed.
- Whether they may be sold.
- Whether they can be consumed.
- Whether they are permanent.
- Whether they unlock additional progression.

Individual behaviours are determined by each resource's own properties rather than hardcoded exceptions.

---

# Progression Role

Resources form the foundation of player progression.

They enable:

- Factory expansion.
- Economic growth.
- Production chains.
- Collection progression.
- Achievement completion.
- Unlock progression.

Almost every gameplay system either produces resources or depends upon them.

---

# Dependencies

The Resource System depends upon:

- Manual Mining System
- Inventory System
- Economy System
- Production Building System
- Collection Log System

These systems determine how resources are generated, stored, transformed and rewarded.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Manual Mining System | Generates resources. |
| Inventory System | Stores resources. |
| Economy System | Assigns value to resources. |
| Shop System | May require resources for purchases. |
| Production Building System | Produces or processes resources. |
| Collection Log System | Tracks resource discovery. |
| Achievement System | Monitors resource-related milestones. |

The Resource System serves as one of the central systems within the game and interacts with almost every other gameplay mechanic.

---

# Balancing Considerations

The Resource System should promote a satisfying sense of progression.

New resources should generally represent increased player capability rather than simply larger numerical values.

Resource rarity, usefulness and availability should encourage exploration, optimisation and long-term goals.

The system should remain scalable as additional content is introduced.

---

# Future Expansion

The Resource System has been designed to support future additions without requiring structural redesign.

Potential expansions include:

- New resource categories.
- Alternate resource qualities.
- Mutations.
- Enchantments.
- Resource durability.
- Seasonal resources.
- Event-exclusive materials.
- Multi-stage processing chains.

These additions should extend the system while remaining compatible with its existing rules.

---

# Developer Notes

This chapter intentionally avoids documenting individual resources.

Specific resources, their statistics and balancing values are maintained within **Volume IV – Reference Library**.

Volume III defines how resources behave.

Volume IV defines what resources exist.

Maintaining this separation improves consistency, reduces duplication and simplifies long-term maintenance.

---

# Related Sections

- 3.3 Manual Mining System
- 3.5 Inventory System
- 3.6 Economy System
- 3.8 Production Building System
- Volume IV – Resource Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Resource System specification created. |

# 3.5 Inventory System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.5

---

# Purpose

The Inventory System is responsible for storing, organising and managing all resources and items owned by the player.

It provides a consistent method of tracking player possessions while supporting progression, production and interaction with other gameplay systems.

The Inventory System serves as the central repository for all collectible content throughout the game.

---

# Responsibilities

The Inventory System is responsible for:

- Storing player-owned resources.
- Managing inventory capacity.
- Organising inventory contents.
- Supporting resource stacking.
- Providing inventory access to other gameplay systems.
- Persisting inventory state.

The Inventory System is not responsible for:

- Creating resources.
- Assigning resource values.
- Selling resources.
- Producing resources.
- Defining individual inventory items.

---

# Overview

Every collectible resource obtained by the player is transferred into the inventory unless otherwise specified.

The inventory acts as the bridge between resource acquisition and resource usage, allowing players to store materials before using them for progression, production or other gameplay systems.

The Inventory System should remain intuitive regardless of the quantity or variety of items the player possesses.

---

# Design Intent

The Inventory System is designed to:

- Provide a reliable method of storing player-owned resources.
- Present collected items in a clear and organised manner.
- Support increasing amounts of content throughout progression.
- Encourage inventory expansion as part of player progression.
- Integrate seamlessly with all gameplay systems that generate or consume resources.

The inventory should reduce unnecessary friction while still encouraging meaningful progression through increased storage capacity and organisation.

---

# Inventory Structure

The inventory stores player-owned resources using a standardised format.

Each stored entry should maintain information relevant to that resource, such as:

- Resource Reference
- Quantity
- Acquisition State
- Stack Information
- Special Properties (where applicable)

The Inventory System manages these entries without requiring knowledge of the individual resource's behaviour.

---

# Inventory Behaviour

The Inventory System is responsible for:

- Receiving newly acquired resources.
- Updating existing resource quantities.
- Creating new inventory entries when required.
- Removing resources when consumed.
- Maintaining inventory consistency across gameplay sessions.

All inventory operations should occur predictably and without ambiguity.

---

# Capacity Management

Inventory capacity determines the maximum amount of content that can be stored.

Capacity may increase through gameplay progression, upgrades or future gameplay systems.

The Inventory System should clearly communicate available capacity and notify the player whenever storage limitations affect gameplay.

Capacity should support progression without becoming an unnecessary source of frustration.

---

# Stack Behaviour

Resources may occupy individual slots or combine into stacks where appropriate.

Stack behaviour is determined by each resource's own properties as defined by the Resource System.

The Inventory System should manage stacking automatically without requiring manual player interaction.

---

# Sorting & Organisation

The Inventory System should provide methods for organising stored resources.

Examples include:

- Category
- Name
- Quantity
- Rarity
- Value
- Recently Acquired

Additional sorting and filtering methods may be introduced as the amount of game content increases.

---

# User Experience

Players should always be able to:

- Identify owned resources.
- Locate resources efficiently.
- Understand inventory capacity.
- Recognise newly acquired items.
- Access relevant resource information.

Inventory interactions should remain fast, responsive and visually consistent.

---

# Progression Role

The Inventory System supports progression by:

- Preserving player resources.
- Enabling crafting and production.
- Supporting factory expansion.
- Allowing long-term collection goals.
- Acting as the foundation for future gameplay systems.

Without inventory management, resource progression cannot function reliably.

---

# Dependencies

The Inventory System depends upon:

- Resource System
- Manual Mining System
- User Interface Behaviour
- Save & Load System

These systems determine how resources enter, are displayed within and persist inside the inventory.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Manual Mining System | Adds newly mined resources. |
| Resource System | Defines resource properties. |
| Economy System | Removes resources during sales or purchases where applicable. |
| Shop System | May consume or reward inventory resources. |
| Production Building System | Deposits produced resources. |
| Collection Log System | Detects first-time acquisitions. |
| Achievement System | Tracks inventory-related milestones. |
| Save & Load System | Persists inventory data between sessions. |

The Inventory System serves as one of the primary integration points between gameplay systems.

---

# Balancing Considerations

Inventory limitations should encourage progression rather than inconvenience.

Players should feel rewarded as storage capacity increases.

Inventory management should never become excessively time-consuming or require repetitive maintenance.

The system should scale comfortably throughout the entire game.

---

# Future Expansion

Potential future additions include:

- Inventory upgrades.
- Additional inventory tabs.
- Search functionality.
- Favourite or locked items.
- Automatic organisation.
- Resource filtering.
- Bulk actions.
- Advanced storage systems.

Future additions should improve usability without fundamentally altering the purpose of the Inventory System.

---

# Developer Notes

The Inventory System defines how resources are stored and managed.

It does not define individual resources, stack limits or inventory sizes.

Specific inventory content and balancing values are maintained within Volume IV.

---

# Related Sections

- 3.3 Manual Mining System
- 3.4 Resource System
- 3.6 Economy System
- 3.7 Shop System
- Volume IV – Inventory Reference

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Inventory System specification created. |

# 3.6 Economy System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.6

---

# Purpose

The Economy System governs how value is generated, stored, exchanged and consumed throughout Everything Factory Incremental.

It provides the rules that define how currencies and economic resources flow between gameplay systems, ensuring that progression remains balanced, rewarding and scalable.

The Economy System forms the foundation of all player progression by transforming production into meaningful advancement.

---

# Responsibilities

The Economy System is responsible for:

- Managing player currency balances.
- Awarding economic value.
- Validating economic transactions.
- Recording economic activity.
- Providing a framework for multiple currencies.
- Supporting progression through value exchange.

The Economy System is not responsible for:

- Defining individual currencies.
- Pricing shop items.
- Managing player inventories.
- Determining production rates.
- Defining resource behaviour.

---

# Overview

The Economy System manages the relationship between player effort, production output and progression.

Resources obtained through gameplay are converted into economic value, which can then be invested into upgrades, expansion and other progression systems.

Rather than defining individual currencies, this chapter defines the behaviours and principles that all currencies should follow.

Individual currencies are documented separately within **Volume IV – Reference Library**.

---

# Design Intent

The Economy System is designed to:

- Reward player effort and optimisation.
- Create meaningful decisions when spending resources.
- Encourage continuous reinvestment into factory growth.
- Support both short-term and long-term progression.
- Remain scalable throughout the lifetime of the game.

The economy should always reinforce the core gameplay loop by making every improvement feel worthwhile.

---

# Economic Principles

The Economy System is built upon several core principles.

## Value Generation

Players should generate value through gameplay rather than passive rewards alone.

Primary sources of value include:

- Resource production
- Resource processing
- Factory optimisation
- Achievements
- Milestones
- Events
- Other gameplay systems

---

## Value Storage

Economic value should persist until intentionally spent or otherwise consumed.

Players should always understand:

- How much value they possess.
- How value was earned.
- What value can be used for.

---

## Value Expenditure

Spending value should represent meaningful progression.

Common expenditure includes:

- Purchasing buildings.
- Unlocking upgrades.
- Expanding the factory.
- Unlocking new gameplay systems.
- Investing in long-term progression.

Players should feel that every purchase contributes towards future efficiency.

---

# Currency Framework

The Economy System supports multiple currencies.

Each currency may define its own:

- Purpose
- Acquisition methods
- Spending methods
- Availability
- Progression role
- Persistence behaviour

Currencies should operate independently while remaining consistent within the overall economy.

Specific currencies are documented within Volume IV.

---

# Economic Behaviour

The Economy System is responsible for:

- Awarding value.
- Tracking balances.
- Validating transactions.
- Removing spent value.
- Recording economic statistics.
- Supporting future currency types.

All economic transactions should be predictable, transparent and reliable.

---

# Progression Role

The Economy System transforms gameplay into progression.

Without an economy:

- Resources have no measurable value.
- Upgrades cannot be purchased.
- Expansion cannot occur.
- Progress cannot be quantified.

Every major gameplay system should either generate, consume or influence economic value.

---

# Dependencies

The Economy System depends upon:

- Resource System
- Inventory System
- Shop System
- Statistics System
- Save & Load System

These systems determine how value is generated, stored, spent and persisted.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource System | Determines the economic value of resources. |
| Inventory System | Supplies resources for economic transactions where applicable. |
| Shop System | Consumes currency during purchases. |
| Production Building System | Generates value through production. |
| Achievement System | May reward additional value. |
| Milestone System | May unlock new economic opportunities. |
| Statistics System | Records economic activity. |

The Economy System acts as the central exchange between production and progression.

---

# Balancing Considerations

The economy should maintain a satisfying pace of progression.

Growth should reward optimisation while avoiding excessive inflation or stagnation.

Economic progression should remain understandable at all stages of the game, even as numerical values become significantly larger.

New currencies should expand gameplay rather than replace existing progression systems.

---

# Future Expansion

The Economy System has been designed to support future additions, including:

- Multiple currency types.
- Premium currencies.
- Seasonal currencies.
- Limited-time event currencies.
- Trading systems.
- Dynamic pricing.
- Research resources.
- Prestige currencies.

Future additions should integrate into the existing framework without requiring structural redesign.

---

# Developer Notes

This chapter defines the behaviour of the game's economy rather than individual currencies.

Currency names, icons, values and balancing are maintained within **Volume IV – Reference Library**.

Separating economic behaviour from economic content ensures that new currencies can be introduced without modifying the underlying system.

---

# Related Sections

- 3.4 Resource System
- 3.5 Inventory System
- 3.7 Shop System
- 3.8 Production Building System
- Volume IV – Currency Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Economy System specification created. |

# 3.7 Shop System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.7

---

# Purpose

The Shop System provides the primary interface through which players exchange economic value for progression.

It enables players to purchase buildings, upgrades, unlocks and other gameplay content while acting as the bridge between the Economy System and the wider progression systems.

The Shop System focuses on how purchases are presented, validated and completed rather than defining the value of individual purchases.

---

# Responsibilities

The Shop System is responsible for:

- Presenting purchasable content to the player.
- Organising purchases into logical categories.
- Validating purchase requirements.
- Processing successful purchases.
- Delivering purchased content or unlocks.
- Communicating purchase outcomes to the player.

The Shop System is not responsible for:

- Defining currency values.
- Managing player currency balances.
- Determining production rates.
- Defining individual shop items.
- Storing purchased resources.

---

# Overview

The Shop System acts as the player's primary method of spending accumulated value.

Throughout progression, players repeatedly return to the shop to invest in improved production, expanded capabilities and new gameplay systems.

The shop should remain intuitive, responsive and scalable regardless of the amount of available content.

---

# Design Intent

The Shop System is designed to:

- Encourage regular reinvestment into progression.
- Clearly communicate available purchases.
- Make purchasing feel rewarding.
- Present progression in an organised manner.
- Support significant future content expansion.

The shop should always reinforce the gameplay loop by encouraging players to improve efficiency rather than simply accumulate unused currency.

---

# Purchase Framework

Every purchasable object should define its own purchasing properties.

Typical properties may include:

- Name
- Description
- Category
- Cost
- Unlock Requirements
- Purchase Requirements
- Purchase Behaviour
- Maximum Ownership
- Visual Representation

Individual purchases are documented separately within **Volume IV – Reference Library**.

---

# Shop Organisation

Purchasable content should be grouped into logical categories.

Examples include:

- Buildings
- Upgrades
- Factory Expansion
- Automation
- Permanent Unlocks
- Research
- Cosmetic Content
- Event Content

The complete category structure may evolve as new gameplay systems are introduced.

---

# Purchase Behaviour

The Shop System is responsible for validating every purchase.

Successful purchases should:

- Verify all purchase requirements.
- Consume the required currencies or resources.
- Award the purchased content.
- Update relevant gameplay systems.
- Provide clear visual and audio feedback.

Failed purchases should communicate the reason for failure clearly to the player.

---

# Unlock Progression

Not all purchasable content should be immediately available.

The Shop System should support unlock conditions based on gameplay progression.

Examples include:

- Factory Level
- Milestones
- Research
- Achievements
- Resource Discovery
- Previous Purchases
- Special Events

Unlock systems should encourage exploration and provide players with meaningful progression goals.

---

# User Experience

The Shop System should always enable players to:

- Browse available content.
- Understand purchase requirements.
- Compare available upgrades.
- Easily identify newly unlocked content.
- Complete purchases quickly.

The purchasing process should minimise unnecessary steps while providing sufficient information for informed decision-making.

---

# Dependencies

The Shop System depends upon:

- Economy System
- Inventory System
- Resource System
- User Interface Behaviour
- Save & Load System

These systems provide the data required to validate purchases and apply their effects.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Economy System | Validates and consumes currency during purchases. |
| Inventory System | Awards or consumes resources where applicable. |
| Resource System | Defines purchasable resource requirements. |
| Production Building System | Unlocks or purchases production buildings. |
| Factory Expansion System | Purchases additional factory capacity. |
| Achievement System | May unlock new purchasable content. |
| Milestone System | Controls progression-based unlocks. |
| Statistics System | Records purchasing activity. |

The Shop System serves as the primary progression interface for the player.

---

# Balancing Considerations

Purchases should always feel meaningful.

The availability, pricing and pacing of purchasable content should encourage continuous progression without overwhelming the player.

The shop should consistently present desirable long-term goals while ensuring that short-term purchases remain rewarding.

Players should rarely feel that there is nothing worthwhile to purchase.

---

# Future Expansion

The Shop System has been designed to support future additions, including:

- Multiple shop interfaces.
- NPC vendors.
- Travelling merchants.
- Event-exclusive shops.
- Limited-time offers.
- Research terminals.
- Premium stores.
- Dynamic inventories.
- Player trading systems.

Future additions should integrate into the existing purchasing framework while preserving a consistent player experience.

---

# Developer Notes

This chapter defines how purchasing operates within Everything Factory Incremental.

It intentionally avoids documenting individual buildings, upgrades, unlocks or prices.

Specific shop content is maintained within **Volume IV – Reference Library**, while this chapter defines the rules that govern purchasing behaviour.

---

# Related Sections

- 3.5 Inventory System
- 3.6 Economy System
- 3.8 Production Building System
- 3.11 Factory Expansion System
- Volume IV – Shop Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Shop System specification created. |

---

# Part II — Factory Systems

# 3.8 Production Building System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.8

---

# Purpose

The Production Building System defines the framework used by all production-based structures within Everything Factory Incremental.

It establishes how buildings are placed, operated and integrated into the factory while providing a consistent set of behaviours that every production building must follow.

Individual buildings are documented separately within **Volume IV – Reference Library**.

---

# Responsibilities

The Production Building System is responsible for:

- Defining how production buildings behave.
- Establishing a common framework for all production buildings.
- Managing building placement and operation.
- Supporting resource generation and processing.
- Providing consistent interactions between buildings.
- Supporting future building types.

The Production Building System is not responsible for:

- Defining individual buildings.
- Determining building prices.
- Managing player currency.
- Storing produced resources.
- Managing factory layout optimisation.

---

# Overview

Production buildings form the operational core of the player's factory.

Every automated process within the game is performed by one or more production buildings.

Although individual buildings perform different tasks, they all follow a common framework that allows them to interact predictably with one another.

The Production Building System ensures that new buildings can be introduced without requiring changes to the underlying gameplay systems.

---

# Design Intent

The Production Building System is designed to:

- Encourage automation over manual production.
- Create satisfying production chains.
- Promote experimentation with different factory designs.
- Support gradual complexity as the player progresses.
- Provide a scalable framework for future content.

Every production building should contribute towards increasing factory efficiency or expanding player capabilities.

---

# Building Framework

Every production building should define a common set of gameplay properties.

Typical properties include:

- Name
- Description
- Building Category
- Production Behaviour
- Input Requirements
- Output Behaviour
- Placement Rules
- Operating Requirements
- Upgrade Path
- Visual Representation
- Audio Behaviour

Additional properties may be introduced as new gameplay systems require.

---

# Building Categories

Production buildings may be organised into categories based on their primary function.

Examples include:

- Resource Generation
- Transportation
- Processing
- Value Enhancement
- Manufacturing
- Storage
- Automation Support
- Utility

Categories exist to improve organisation and system interactions.

Individual building classifications are maintained within Volume IV.

---

# Production Behaviour

Each production building performs a defined gameplay function.

Examples include:

- Generating resources.
- Transporting resources.
- Processing materials.
- Increasing resource value.
- Combining materials.
- Supporting automation.

Each building should perform its intended role consistently and predictably.

---

# Building Lifecycle

Every production building generally follows the same lifecycle.

```
Purchased

↓

Placed

↓

Activated

↓

Operating

↓

Modified
or
Upgraded

↓

Removed
or
Replaced
```

Not every building will require every stage, but the overall lifecycle should remain consistent throughout the game.

---

# Resource Interaction

Production buildings interact directly with the Resource System.

Buildings may:

- Generate resources.
- Receive resources.
- Transfer resources.
- Modify resources.
- Consume resources.
- Produce new resources.

The exact behaviour is determined by the building's individual definition rather than the Production Building System itself.

---

# Progression Role

Production buildings represent the player's primary method of increasing efficiency.

As additional buildings become available, players are able to:

- Increase production capacity.
- Reduce manual interaction.
- Build more complex production chains.
- Improve economic output.
- Unlock advanced gameplay systems.

Production buildings should remain the primary driver of factory progression.

---

# Dependencies

The Production Building System depends upon:

- Resource System
- Inventory System
- Economy System
- Shop System
- Factory Layout System
- Automation System

These systems provide the resources, progression and interactions required for production buildings to operate.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource System | Generates, receives and modifies resources. |
| Inventory System | Deposits produced resources where appropriate. |
| Economy System | Produces economic value through production. |
| Shop System | Unlocks and purchases production buildings. |
| Factory Layout System | Determines how buildings are arranged. |
| Automation System | Coordinates automated production. |
| Factory Expansion System | Provides additional building space. |
| Statistics System | Records production activity. |

The Production Building System serves as the operational centre of the factory.

---

# Balancing Considerations

Production buildings should provide meaningful improvements over manual gameplay.

New buildings should introduce additional strategic opportunities rather than simply increasing numerical output.

The system should reward efficient factory design while remaining approachable for new players.

Building progression should feel consistent throughout the entire game.

---

# Future Expansion

The Production Building System has been designed to support future additions, including:

- New production categories.
- Multi-stage manufacturing.
- Modular buildings.
- Building upgrades.
- Tiered production chains.
- Utility structures.
- Advanced automation devices.
- Special event buildings.

Future buildings should integrate into the existing framework without requiring structural redesign.

---

# Developer Notes

This chapter defines the behaviour shared by all production buildings.

Individual buildings—including their appearance, statistics, costs and specific mechanics—are documented within **Volume IV – Building Catalogue**.

Maintaining this separation allows new production buildings to be introduced without modifying the underlying system specification.

---

# Related Sections

- 3.4 Resource System
- 3.6 Economy System
- 3.7 Shop System
- 3.9 Factory Layout System
- 3.10 Automation System
- Volume IV – Building Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Production Building System specification created. |

# 3.9 Factory Layout System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.9

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

# 3.10 Automation System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.10

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

# 3.11 Factory Expansion System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.11

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

---

# Part III — Progression Systems

# 3.12 Resource Progression System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.12

---

# Purpose

The Resource Progression System defines how players discover, unlock and utilise increasingly advanced resources throughout Everything Factory Incremental.

It establishes the progression framework that governs resource availability while ensuring that new resources are introduced in a rewarding and scalable manner.

The Resource Progression System provides the foundation for long-term content expansion without altering the underlying Resource System.

---

# Responsibilities

The Resource Progression System is responsible for:

- Defining how new resources become available.
- Governing resource progression throughout the game.
- Supporting gradual content discovery.
- Encouraging exploration and optimisation.
- Integrating new resources into player progression.
- Providing a scalable framework for future resource additions.

The Resource Progression System is not responsible for:

- Defining individual resources.
- Assigning resource properties.
- Managing resource storage.
- Determining economic value.
- Processing resources.

---

# Overview

Resource progression is the process through which players gain access to increasingly advanced resources as they develop their factory.

Rather than making every resource immediately available, new resources are introduced gradually through gameplay progression.

This approach provides players with clear progression goals while maintaining a consistent sense of discovery throughout the game.

---

# Design Intent

The Resource Progression System is designed to:

- Maintain a continual sense of discovery.
- Encourage long-term progression.
- Introduce new gameplay opportunities over time.
- Support increasing production complexity.
- Ensure the game continues to reward player advancement.

Players should regularly encounter new resources that expand production possibilities without invalidating previously unlocked content.

---

# Progression Framework

Resource progression should occur through clearly defined progression milestones.

Resources may become available through:

- Factory progression.
- Building progression.
- Production achievements.
- Gameplay milestones.
- Research systems.
- Exploration.
- Special events.
- Future progression mechanics.

The framework should remain flexible enough to accommodate future gameplay systems.

---

# Resource Availability

Not every resource should be available from the beginning of the game.

Resource availability should expand alongside player progression.

The introduction of new resources should:

- Reward previous progression.
- Introduce new production opportunities.
- Encourage factory expansion.
- Support increasingly complex production chains.
- Provide meaningful long-term goals.

---

# Discovery Behaviour

Players should experience a consistent sense of discovery throughout progression.

Discovering a new resource should:

- Feel rewarding.
- Expand gameplay possibilities.
- Encourage experimentation.
- Integrate naturally into existing production systems.

The pace of discovery should remain satisfying throughout the lifetime of the game.

---

# Progression Scaling

As progression advances, resource complexity may increase.

Future resources may introduce:

- Additional production requirements.
- Longer production chains.
- Multiple processing stages.
- Greater strategic value.
- New gameplay interactions.

Progression should favour increased gameplay depth rather than simply larger numerical values.

---

# Progression Role

Resource progression supports long-term engagement by providing a continual stream of new objectives.

As additional resources become available, players are encouraged to:

- Improve factory efficiency.
- Expand production capacity.
- Optimise existing systems.
- Pursue increasingly ambitious production goals.

Resource progression should reinforce the overall gameplay loop by ensuring there is always another objective to pursue.

---

# Dependencies

The Resource Progression System depends upon:

- Resource System
- Production Building System
- Economy System
- Shop System
- Factory Level System
- Milestone System

These systems collectively determine when and how new resources become available.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource System | Defines the resources introduced through progression. |
| Production Building System | Unlocks new production opportunities for advanced resources. |
| Economy System | Integrates new resources into the game's economy. |
| Shop System | May unlock buildings or upgrades related to newly available resources. |
| Factory Level System | Controls progression milestones where applicable. |
| Milestone System | Rewards resource progression through gameplay achievements. |
| Collection Log System | Records newly discovered resources. |
| Achievement System | Tracks progression-related accomplishments. |

The Resource Progression System acts as the bridge between gameplay progression and expanding game content.

---

# Balancing Considerations

Resource progression should maintain a steady pace throughout the game.

Players should consistently feel that new resources represent meaningful progression rather than simple statistical improvements.

Previously unlocked resources should remain relevant wherever practical.

The introduction of new resources should expand gameplay possibilities without overwhelming the player.

---

# Future Expansion

The Resource Progression System has been designed to support future additions without requiring structural redesign.

Potential future expansions include:

- Additional progression paths.
- Hidden resources.
- Branching resource progression.
- Prestige-exclusive resources.
- Seasonal resources.
- World-specific resources.
- Expansion-specific resource sets.

Future additions should integrate naturally into the existing progression framework while preserving consistency across all gameplay systems.

---

# Developer Notes

This chapter defines how resources are introduced throughout player progression.

It intentionally avoids documenting individual resources, unlock requirements or progression values.

Specific resources, progression data and balancing values are maintained within **Volume IV – Resource Catalogue**.

---

# Related Sections

- 3.4 Resource System
- 3.6 Economy System
- 3.8 Production Building System
- 3.13 Factory Level System
- 3.14 Milestone System
- Volume IV – Resource Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Resource Progression System specification created. |

# 3.13 Factory Level System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.13

---

# Purpose

The Factory Level System defines how overall factory progression is measured and represented throughout Everything Factory Incremental.

It provides a unified progression framework that reflects the player's long-term development while supporting the gradual introduction of new gameplay systems, content and capabilities.

The Factory Level System serves as a central indicator of player progression without replacing other progression systems.

---

# Responsibilities

The Factory Level System is responsible for:

- Measuring overall factory progression.
- Awarding Factory Levels through gameplay.
- Supporting progression-based content unlocks.
- Providing long-term progression goals.
- Communicating player advancement.
- Integrating progression across multiple gameplay systems.

The Factory Level System is not responsible for:

- Defining progression rewards.
- Unlocking specific resources.
- Managing production buildings.
- Tracking achievements.
- Recording collections.
- Managing rebirth progression.

---

# Overview

The Factory Level System represents the player's overall advancement within the game.

As players expand, automate and optimise their factory, they earn progress towards higher Factory Levels.

Each level reflects accumulated progression across the entire gameplay experience rather than a single activity.

The Factory Level System provides players with a clear sense of long-term achievement while supporting future content expansion.

---

# Design Intent

The Factory Level System is designed to:

- Provide a clear measure of player progression.
- Encourage continuous long-term play.
- Unite multiple progression systems under a common framework.
- Create meaningful progression milestones.
- Support scalable gameplay expansion.

Factory Levels should represent the growth of the player's factory rather than acting as a simple experience counter.

---

# Level Framework

Factory Levels are earned through gameplay progression.

Progress towards new levels may be influenced by:

- Factory development.
- Production growth.
- Automation.
- Resource progression.
- Gameplay milestones.
- Future progression systems.

The Factory Level System provides the framework for measuring progression regardless of how future gameplay systems evolve.

---

# Progression Behaviour

Factory Levels should increase steadily throughout gameplay.

Progression should:

- Reward consistent play.
- Reflect meaningful factory growth.
- Scale appropriately throughout the game.
- Encourage continued progression.
- Remain understandable to the player.

Level progression should always feel achievable while supporting long-term gameplay.

---

# Level Visibility

Factory Levels should be clearly communicated to the player.

The system should provide:

- Current Factory Level.
- Progress towards the next level.
- Clear progression feedback.
- Recognition when new levels are achieved.

Level progression should reinforce the player's sense of accomplishment.

---

# Progression Role

The Factory Level System acts as the central progression indicator that connects multiple gameplay systems.

Factory Levels provide a framework through which players experience:

- Long-term advancement.
- Gameplay progression.
- Unlock opportunities.
- Increasing production complexity.
- Continued gameplay objectives.

The system should reinforce player motivation without becoming the sole focus of progression.

---

# Dependencies

The Factory Level System depends upon:

- Resource Progression System
- Production Building System
- Automation System
- Economy System
- Milestone System
- Achievement System

These systems collectively contribute towards the player's overall progression.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource Progression System | Contributes to overall progression. |
| Production Building System | Expands factory capability. |
| Automation System | Reflects increasing production maturity. |
| Economy System | Supports continued factory development. |
| Milestone System | Recognises significant progression events. |
| Achievement System | Complements long-term player progression. |
| Shop System | Unlocks additional progression opportunities. |
| Statistics System | Records Factory Level progression where applicable. |

The Factory Level System acts as the overarching measure of player advancement across the game.

---

# Balancing Considerations

Factory Level progression should remain rewarding throughout the entire game.

Progression should avoid large periods without meaningful advancement while also preventing levels from becoming trivial to obtain.

Factory Levels should complement other progression systems rather than overshadow them.

Players should feel that every level represents genuine factory development.

---

# Future Expansion

The Factory Level System has been designed to support future additions, including:

- Additional level milestones.
- Alternative progression paths.
- Prestige level systems.
- Seasonal progression.
- Expansion-specific level tracks.
- New unlock categories.

Future additions should integrate seamlessly into the existing progression framework while maintaining consistency across gameplay systems.

---

# Developer Notes

This chapter defines how Factory Levels measure overall progression.

It intentionally avoids documenting specific experience formulas, level requirements, unlock tables or balancing values.

Implementation details are maintained within Volume IV and supporting balancing documentation.

---

# Related Sections

- 3.12 Resource Progression System
- 3.14 Milestone System
- 3.15 Achievement System
- 3.17 Rebirth System
- Volume IV – Progression Reference

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Factory Level System specification created. |

# 3.14 Milestone System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.14

---

# Purpose

The Milestone System defines how significant progression events are recognised throughout Everything Factory Incremental.

It establishes a framework for rewarding players when they achieve meaningful gameplay objectives, providing clear indicators of advancement while encouraging continued progression.

The Milestone System highlights important moments in the player's journey without replacing the broader Factory Level progression framework.

---

# Responsibilities

The Milestone System is responsible for:

- Recognising significant gameplay achievements.
- Defining progression checkpoints.
- Providing milestone-based rewards where applicable.
- Encouraging long-term gameplay objectives.
- Reinforcing player progression.
- Supporting scalable progression throughout the game.

The Milestone System is not responsible for:

- Measuring overall progression.
- Defining achievements.
- Recording player statistics.
- Managing gameplay rewards outside milestone progression.
- Determining experience or Factory Levels.

---

# Overview

Milestones represent notable progression points reached during gameplay.

Unlike continuous progression systems, milestones occur when players accomplish specific objectives or reach predefined stages of development.

Milestones provide structure to long-term progression by recognising meaningful accomplishments throughout the player's factory journey.

---

# Design Intent

The Milestone System is designed to:

- Celebrate meaningful player accomplishments.
- Provide clear short- and medium-term objectives.
- Break long-term progression into achievable goals.
- Reinforce a sense of advancement.
- Encourage continued engagement.

Milestones should make progression feel memorable by recognising moments that meaningfully expand or transform gameplay.

---

# Milestone Framework

Milestones may be awarded for a wide variety of gameplay accomplishments.

Examples include progress related to:

- Factory development.
- Resource production.
- Factory expansion.
- Automation progression.
- Collection progression.
- Economic progression.
- Future gameplay systems.

The framework should remain flexible so new milestone categories can be introduced without changing the underlying system.

---

# Milestone Behaviour

Milestones should:

- Be awarded immediately when their conditions are met.
- Provide clear player feedback.
- Be permanently recorded where appropriate.
- Remain understandable and predictable.
- Encourage continued progression after completion.

Milestones should always represent meaningful accomplishments rather than routine gameplay actions.

---

# Progression Role

Milestones provide structure between major stages of progression.

They serve as intermediate goals that guide players towards larger objectives while reinforcing continuous gameplay.

Milestones should help players understand how their factory has evolved over time and provide regular moments of accomplishment.

---

# Dependencies

The Milestone System depends upon:

- Factory Level System
- Resource Progression System
- Production Building System
- Automation System
- Economy System
- Statistics System

These systems provide the gameplay events and progression data used to evaluate milestone completion.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Factory Level System | Complements overall progression by recognising key achievements. |
| Resource Progression System | Supports milestones related to resource advancement. |
| Production Building System | Contributes building-related progression milestones. |
| Automation System | Supports milestones for factory automation. |
| Economy System | Enables economic progression milestones. |
| Collection Log System | Supports discovery-related milestones where applicable. |
| Achievement System | Operates alongside milestones while remaining a separate reward system. |
| Statistics System | Supplies progression data required for milestone evaluation. |

The Milestone System acts as a progression checkpoint system that highlights meaningful accomplishments throughout gameplay.

---

# Balancing Considerations

Milestones should be distributed consistently throughout the player's progression.

They should become progressively more ambitious while remaining achievable.

Milestones should encourage varied gameplay rather than rewarding repetitive optimisation of a single activity.

Completing a milestone should always feel like a meaningful accomplishment.

---

# Future Expansion

The Milestone System has been designed to support future additions, including:

- Multi-stage milestone chains.
- Hidden milestones.
- Seasonal milestones.
- Expansion-specific milestones.
- Community event milestones.
- Challenge milestones.
- Alternative progression milestones.

Future additions should integrate naturally into the existing milestone framework while preserving consistency across all progression systems.

---

# Developer Notes

This chapter defines how milestone progression functions as a gameplay system.

It intentionally avoids documenting specific milestone requirements, rewards or completion values.

Individual milestones and balancing data are maintained within **Volume IV – Milestone Catalogue**.

---

# Related Sections

- 3.13 Factory Level System
- 3.15 Achievement System
- 3.16 Collection Log System
- 3.17 Rebirth System
- Volume IV – Milestone Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Milestone System specification created. |

# 3.15 Achievement System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.15

---

# Purpose

The Achievement System defines how player accomplishments are recognised and rewarded throughout Everything Factory Incremental.

It provides a framework for celebrating gameplay accomplishments beyond standard progression, encouraging exploration, mastery and long-term engagement.

The Achievement System complements other progression systems by recognising a broad range of player activities without replacing core gameplay objectives.

---

# Responsibilities

The Achievement System is responsible for:

- Recognising player accomplishments.
- Awarding achievements upon completion of defined objectives.
- Providing optional and long-term gameplay goals.
- Encouraging varied playstyles.
- Supporting achievement-based rewards where applicable.
- Providing a scalable framework for future achievements.

The Achievement System is not responsible for:

- Measuring overall player progression.
- Defining progression milestones.
- Recording gameplay statistics.
- Managing Factory Levels.
- Defining Collection Log entries.

---

# Overview

Achievements recognise accomplishments that extend beyond the player's normal progression through the game.

While many achievements may naturally be earned through gameplay, others encourage players to explore additional mechanics, pursue mastery or complete optional objectives.

Achievements provide recognition for player accomplishments while adding long-term replay value.

---

# Design Intent

The Achievement System is designed to:

- Reward player mastery.
- Encourage exploration of game mechanics.
- Promote varied gameplay.
- Provide meaningful optional objectives.
- Increase long-term replayability.

Achievements should feel rewarding without becoming mandatory for overall progression.

---

# Achievement Framework

Achievements may recognise accomplishments across many gameplay systems.

Achievement categories may include:

- Factory progression.
- Resource production.
- Automation.
- Economy.
- Building usage.
- Collection completion.
- Exploration.
- Special challenges.
- Hidden objectives.
- Future gameplay systems.

The framework should remain flexible enough to support new achievement categories throughout future development.

---

# Achievement Behaviour

Achievements should:

- Unlock immediately when their conditions are met.
- Provide clear player feedback.
- Be permanently recorded.
- Remain understandable where appropriate.
- Support hidden achievements where beneficial.

Achievements should consistently reward meaningful accomplishments rather than routine gameplay.

---

# Reward Philosophy

Achievements may provide rewards where appropriate.

Achievement rewards should:

- Reinforce accomplishment.
- Encourage continued progression.
- Complement existing gameplay systems.
- Avoid becoming mandatory for balanced gameplay.

The primary purpose of achievements should remain player recognition rather than progression gating.

---

# Progression Role

Achievements provide optional objectives that extend beyond standard gameplay progression.

They encourage players to:

- Improve factory efficiency.
- Explore different strategies.
- Complete difficult objectives.
- Experiment with gameplay systems.
- Pursue long-term completion goals.

The Achievement System should increase gameplay depth without restricting player freedom.

---

# Dependencies

The Achievement System depends upon:

- Factory Level System
- Milestone System
- Resource Progression System
- Collection Log System
- Statistics System

These systems provide the gameplay events and progression data required for achievement evaluation.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Factory Level System | Complements overall progression with accomplishment recognition. |
| Milestone System | Operates alongside milestones while recognising different types of accomplishments. |
| Resource Progression System | Supports progression-related achievements. |
| Collection Log System | Enables collection-based achievements. |
| Production Building System | Supports building-related achievements. |
| Automation System | Enables automation-focused achievements. |
| Economy System | Supports economy-related achievements. |
| Statistics System | Provides gameplay data used to evaluate achievement completion. |

The Achievement System provides recognition for accomplishments across nearly every gameplay system without directly controlling progression.

---

# Balancing Considerations

Achievements should encourage players to engage with a wide variety of gameplay systems.

Objectives should range from easily obtainable accomplishments to significant long-term challenges.

Achievements should reward dedication and creativity without requiring repetitive or frustrating gameplay.

Optional achievements should enhance replayability while remaining separate from mandatory progression.

---

# Future Expansion

The Achievement System has been designed to support future additions, including:

- Expansion-specific achievements.
- Seasonal achievements.
- Hidden achievement chains.
- Community event achievements.
- Difficulty-based achievements.
- Challenge achievements.
- Meta-achievements.
- Cooperative or multiplayer achievements.

Future additions should integrate seamlessly into the existing achievement framework.

---

# Developer Notes

This chapter defines how achievements function as a gameplay system.

It intentionally avoids documenting individual achievements, completion requirements, rewards or balancing values.

Specific achievements and their implementation details are maintained within **Volume IV – Achievement Catalogue**.

---

# Related Sections

- 3.13 Factory Level System
- 3.14 Milestone System
- 3.16 Collection Log System
- 3.17 Rebirth System
- Volume IV – Achievement Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Achievement System specification created. |

# 3.16 Collection Log System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.16

---

# Purpose

The Collection Log System defines how discovered game content is permanently recorded and presented to the player throughout Everything Factory Incremental.

It provides a structured framework for tracking discovery, encouraging exploration, rewarding completion and preserving the player's collection progress across gameplay.

The Collection Log System serves as the player's record of what they have encountered, unlocked and collected during their progression.

---

# Responsibilities

The Collection Log System is responsible for:

- Recording discovered game content.
- Tracking collection completion.
- Presenting collection progress to the player.
- Encouraging exploration and discovery.
- Supporting long-term completion goals.
- Providing a scalable framework for future collectible content.

The Collection Log System is not responsible for:

- Defining collectible content.
- Managing player inventory.
- Awarding achievements.
- Measuring overall progression.
- Unlocking gameplay systems.
- Storing gameplay statistics unrelated to collections.

---

# Overview

The Collection Log provides players with a permanent record of their discoveries throughout the game.

As new content is encountered, the Collection Log expands to reflect the player's progress and serves as both a reference and a long-term completion objective.

The Collection Log should encourage curiosity and provide players with meaningful reasons to continue exploring all areas of the game.

---

# Design Intent

The Collection Log System is designed to:

- Encourage discovery.
- Reward exploration.
- Promote long-term completion.
- Provide a clear record of player progress.
- Increase replayability.

Players should feel motivated to discover new content while gradually working towards a complete collection.

---

# Collection Framework

The Collection Log may contain entries for a wide variety of gameplay content.

Collection categories may include:

- Resources.
- Production buildings.
- Upgrades.
- Technologies.
- Factory components.
- Special items.
- Rare discoveries.
- Event content.
- Future gameplay systems.

The framework should remain flexible enough to support new categories without requiring structural changes.

---

# Discovery Behaviour

Collection entries should be added when players first satisfy the defined discovery conditions.

Discovery should:

- Be immediate.
- Provide clear player feedback.
- Permanently record progression.
- Preserve historical completion.
- Remain consistent across all collection categories.

Players should always understand when new content has been added to their Collection Log.

---

# Collection Progress

The Collection Log should clearly communicate progression towards completion.

Players should be able to view:

- Total discovered entries.
- Remaining undiscovered entries where appropriate.
- Completion percentages.
- Category progression.
- Overall collection progress.

Collection progress should encourage continued exploration without overwhelming new players.

---

# Progression Role

The Collection Log supports long-term gameplay by rewarding exploration rather than production efficiency.

It encourages players to:

- Discover new content.
- Experiment with different gameplay systems.
- Pursue full completion.
- Revisit previously explored mechanics.
- Engage with optional content.

The Collection Log should complement progression systems without replacing them.

---

# Dependencies

The Collection Log System depends upon:

- Resource Progression System
- Production Building System
- Achievement System
- Statistics System

These systems provide the discoverable content and gameplay events required to populate the Collection Log.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource Progression System | Adds newly discovered resources to the Collection Log. |
| Production Building System | Records newly encountered production buildings where applicable. |
| Achievement System | May reference collection completion objectives. |
| Milestone System | May recognise significant collection progression. |
| Factory Level System | Complements overall player progression through discovery. |
| Statistics System | Provides discovery and completion data where required. |

The Collection Log System serves as the player's permanent record of exploration and discovery across the game.

---

# Balancing Considerations

Collection progression should reward exploration without becoming excessively repetitive.

Players should encounter new discoveries at a satisfying pace throughout gameplay.

Collection completion should remain an engaging long-term objective rather than a mandatory progression requirement.

The system should balance accessibility with meaningful completion challenges.

---

# Future Expansion

The Collection Log System has been designed to support future additions, including:

- Expansion-specific collections.
- Seasonal collection categories.
- Hidden entries.
- Rare discoveries.
- Variant collections.
- Challenge collections.
- Community event collections.
- Additional content categories.

Future additions should integrate naturally into the existing collection framework while maintaining consistency across all gameplay systems.

---

# Developer Notes

This chapter defines how collection tracking functions as a gameplay system.

It intentionally avoids documenting individual collection entries, unlock conditions or completion values.

Specific collection categories and entries are maintained within **Volume IV – Collection Catalogue**.

---

# Related Sections

- 3.12 Resource Progression System
- 3.13 Factory Level System
- 3.14 Milestone System
- 3.15 Achievement System
- 3.17 Rebirth System
- Volume IV – Collection Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Collection Log System specification created. |

# 3.17 Rebirth System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.17

---

# Purpose

The Rebirth System defines how players voluntarily reset portions of their gameplay progression in exchange for permanent progression, new opportunities and long-term advancement.

It provides a cyclical progression framework that extends gameplay beyond a single factory while encouraging continued optimisation, experimentation and mastery.

The Rebirth System serves as the primary long-term progression mechanic within Everything Factory Incremental.

---

# Responsibilities

The Rebirth System is responsible for:

- Defining the rebirth gameplay cycle.
- Resetting eligible progression systems.
- Awarding permanent rebirth progression.
- Supporting long-term replayability.
- Encouraging repeated factory optimisation.
- Providing a scalable framework for future prestige mechanics.

The Rebirth System is not responsible for:

- Managing Factory Levels.
- Recording achievements.
- Tracking collections.
- Defining individual rebirth rewards.
- Managing gameplay statistics unrelated to rebirth.

---

# Overview

Rebirth allows players to voluntarily restart their factory progression after reaching appropriate stages of development.

In return, players receive permanent progression that improves future gameplay and enables access to increasingly advanced opportunities.

Rather than acting as the conclusion of progression, rebirth establishes a new cycle in which players apply their accumulated knowledge and permanent upgrades to build a stronger factory.

---

# Design Intent

The Rebirth System is designed to:

- Extend long-term gameplay.
- Reward player mastery.
- Encourage optimisation.
- Support multiple progression cycles.
- Create meaningful long-term goals.

Each rebirth should leave the player feeling more capable than before, even though parts of their factory progression have been reset.

---

# Rebirth Framework

Rebirth consists of four core stages:

1. Preparation
2. Confirmation
3. Progression Reset
4. Permanent Reward

Each stage should be communicated clearly to ensure players fully understand the consequences and benefits of rebirth.

The framework should remain flexible enough to support additional rebirth mechanics in future updates.

---

# Reset Behaviour

When a rebirth occurs, eligible gameplay systems are reset according to the game's progression rules.

The Rebirth System defines the reset process but does not determine which individual systems or content are affected.

Reset behaviour should:

- Be predictable.
- Be clearly communicated.
- Preserve permanent progression.
- Maintain game integrity.
- Prepare the player for the next progression cycle.

---

# Permanent Progression

A rebirth should always provide lasting value.

Permanent progression may include:

- New gameplay opportunities.
- Permanent upgrades.
- Improved production potential.
- Additional progression systems.
- New strategic options.
- Future prestige mechanics.

Each rebirth should meaningfully strengthen future progression without eliminating the satisfaction of rebuilding.

---

# Player Decision

Rebirth should always remain a voluntary choice.

Before confirming a rebirth, players should be provided with:

- A clear explanation of what will reset.
- A summary of what will be retained.
- An overview of permanent rewards.
- Confirmation before the reset occurs.

Players should never be surprised by the outcome of a rebirth.

---

# Progression Role

The Rebirth System represents the highest layer of gameplay progression.

It allows players to:

- Restart progression more efficiently.
- Reach higher levels of production.
- Unlock additional gameplay systems.
- Pursue increasingly ambitious factories.
- Continue progressing beyond conventional limits.

Rebirth transforms repeated gameplay into meaningful long-term advancement.

---

# Dependencies

The Rebirth System depends upon:

- Factory Level System
- Resource Progression System
- Economy System
- Achievement System
- Collection Log System
- Statistics System

These systems determine progression state before rebirth and preserve the information that remains permanent.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Factory Level System | Resets or preserves progression according to rebirth rules. |
| Resource Progression System | Restarts resource progression where applicable. |
| Economy System | Resets economic progression where applicable. |
| Production Building System | Returns factory construction to its initial state where applicable. |
| Factory Expansion System | Applies rebirth rules to factory capacity where applicable. |
| Achievement System | Preserves achievement completion unless otherwise defined. |
| Collection Log System | Preserves collection progress unless otherwise defined. |
| Statistics System | Records rebirth history and lifetime progression. |

The Rebirth System coordinates progression resets while ensuring permanent systems continue to represent the player's long-term accomplishments.

---

# Balancing Considerations

Rebirth should always feel worthwhile.

Players should clearly understand that the long-term benefits outweigh the temporary loss of progression.

The pacing of rebirth should encourage optimisation rather than forcing frequent resets.

Each rebirth should provide meaningful improvements while maintaining satisfying long-term progression.

---

# Future Expansion

The Rebirth System has been designed to support future additions, including:

- Multiple prestige layers.
- Alternative rebirth paths.
- Rebirth modifiers.
- Challenge rebirths.
- Seasonal rebirth mechanics.
- Expansion-specific prestige systems.
- End-game progression systems.

Future additions should build upon the existing rebirth framework without requiring structural redesign.

---

# Developer Notes

This chapter defines how rebirth functions as a gameplay system.

It intentionally avoids documenting specific reset rules, reward values, unlock requirements or balancing data.

Implementation details and rebirth-specific content are maintained within **Volume IV – Progression Reference**.

---

# Related Sections

- 3.13 Factory Level System
- 3.14 Milestone System
- 3.15 Achievement System
- 3.16 Collection Log System
- 3.18 Offline Progression System
- Volume IV – Progression Reference

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Rebirth System specification created. |

# 3.18 Offline Progression System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.18

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

---

# Part IV — Supporting Systems

# 3.19 Player Statistics System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.19

---

# Purpose

The Player Statistics System defines how gameplay data is recorded, maintained and presented throughout Everything Factory Incremental.

It provides a framework for tracking the player's lifetime activity, progression and accomplishments while supporting other gameplay systems that rely upon statistical information.

The Player Statistics System serves as the authoritative record of the player's journey across all gameplay sessions.

---

# Responsibilities

The Player Statistics System is responsible for:

- Recording gameplay statistics.
- Maintaining lifetime progression data.
- Tracking cumulative gameplay activity.
- Providing statistical information to other systems.
- Supporting player progression analysis.
- Providing a scalable framework for future statistical tracking.

The Player Statistics System is not responsible for:

- Awarding achievements.
- Completing milestones.
- Defining gameplay progression.
- Managing player inventory.
- Saving game data.
- Performing gameplay calculations.

---

# Overview

The Player Statistics System continuously records significant gameplay events throughout the player's progression.

Statistics provide players with insight into their gameplay history while supplying reliable data for systems such as achievements, milestones and progression tracking.

The system should operate automatically with minimal player interaction.

---

# Design Intent

The Player Statistics System is designed to:

- Record meaningful gameplay history.
- Support progression-based systems.
- Encourage long-term engagement.
- Provide players with measurable accomplishments.
- Preserve the history of the player's factory.

Statistics should help players understand the scale of their achievements rather than simply presenting large numbers.

---

# Statistics Framework

The Player Statistics System may record information relating to:

- Resource production.
- Factory development.
- Economic activity.
- Automation.
- Building usage.
- Factory expansion.
- Progression.
- Gameplay time.
- Rebirth history.
- Future gameplay systems.

The framework should remain flexible enough to accommodate new statistics as additional gameplay systems are introduced.

---

# Recording Behaviour

Statistics should be updated automatically whenever relevant gameplay events occur.

Recorded statistics should:

- Be accurate.
- Remain consistent.
- Persist across gameplay sessions where appropriate.
- Scale indefinitely.
- Avoid unnecessary duplication.

Players should never be required to manually maintain statistical information.

---

# Data Presentation

Statistics should be presented in a clear and understandable manner.

Where appropriate, players should be able to view:

- Lifetime totals.
- Session totals.
- Personal bests.
- Progression summaries.
- Historical records.

Information should remain accessible without overwhelming the player.

---

# Progression Role

Although statistics do not directly affect gameplay, they provide valuable context for the player's progression.

Statistics support:

- Achievement evaluation.
- Milestone progression.
- Collection tracking.
- Gameplay analysis.
- Personal goal setting.

The system reinforces long-term engagement by preserving the player's accomplishments.

---

# Dependencies

The Player Statistics System depends upon:

- Resource System
- Economy System
- Production Building System
- Factory Level System
- Achievement System
- Milestone System
- Collection Log System
- Rebirth System

These systems generate the gameplay events recorded by the Player Statistics System.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Resource System | Records lifetime resource production and collection. |
| Economy System | Tracks economic activity and lifetime earnings. |
| Production Building System | Records building-related statistics. |
| Factory Level System | Records progression history. |
| Achievement System | Supplies statistical data for achievement evaluation. |
| Milestone System | Supplies statistical data for milestone evaluation. |
| Collection Log System | Records collection progress where appropriate. |
| Rebirth System | Tracks rebirth history and lifetime progression. |

The Player Statistics System provides reliable gameplay data that supports progression, recognition and player feedback throughout the game.

---

# Balancing Considerations

Statistics should record meaningful gameplay without encouraging unhealthy optimisation solely for numerical growth.

Players should feel that statistics represent their journey rather than becoming mandatory objectives.

Recorded values should remain understandable even during extremely long play sessions.

---

# Future Expansion

The Player Statistics System has been designed to support future additions, including:

- Advanced statistical breakdowns.
- Trend analysis.
- Session comparisons.
- Historical progression graphs.
- Expansion-specific statistics.
- Seasonal statistics.
- Community comparison systems.
- Additional gameplay metrics.

Future additions should integrate naturally into the existing statistical framework without requiring structural redesign.

---

# Developer Notes

This chapter defines how gameplay statistics are recorded and utilised.

It intentionally avoids documenting individual statistics, presentation layouts or implementation details.

Specific tracked statistics are maintained within **Volume IV – Statistics Catalogue**.

---

# Related Sections

- 3.13 Factory Level System
- 3.14 Milestone System
- 3.15 Achievement System
- 3.16 Collection Log System
- 3.17 Rebirth System
- 3.22 Saving & Loading Behaviour
- Volume IV – Statistics Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Player Statistics System specification created. |

# 3.20 User Interface Behaviour

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.20

---

# Purpose

The User Interface Behaviour System defines how gameplay information is presented and communicated to the player throughout Everything Factory Incremental.

It establishes the behavioural framework for all user interface interactions, ensuring that information is delivered consistently, clearly and responsively across every gameplay system.

The User Interface Behaviour System supports player decision-making by presenting relevant information at the appropriate time without disrupting gameplay.

---

# Responsibilities

The User Interface Behaviour System is responsible for:

- Presenting gameplay information.
- Communicating system state changes.
- Supporting player interaction.
- Providing visual feedback.
- Maintaining interface consistency.
- Supporting accessibility across gameplay systems.

The User Interface Behaviour System is not responsible for:

- Defining gameplay mechanics.
- Managing gameplay progression.
- Performing gameplay calculations.
- Recording player statistics.
- Saving game data.
- Managing notification logic.

---

# Overview

The User Interface Behaviour System governs how players interact with gameplay systems through the game's interface.

Every gameplay system should communicate its current state through clear, responsive and consistent interface behaviour.

The interface should minimise unnecessary complexity while ensuring players always have access to the information required to make informed decisions.

---

# Design Intent

The User Interface Behaviour System is designed to:

- Present information clearly.
- Reduce unnecessary player confusion.
- Support rapid decision-making.
- Maintain consistency throughout the game.
- Reinforce gameplay through effective feedback.

The interface should assist the player without becoming the focus of gameplay.

---

# Interaction Framework

The interface should support intuitive interaction across all gameplay systems.

Interactions should be:

- Consistent.
- Predictable.
- Responsive.
- Easy to understand.
- Appropriate for the current gameplay context.

Players should not need to relearn interface behaviour when interacting with different gameplay systems.

---

# Information Hierarchy

The interface should prioritise information according to gameplay importance.

Information should be presented in a hierarchy that:

- Highlights critical gameplay information.
- Reduces unnecessary visual clutter.
- Groups related information together.
- Supports efficient decision-making.
- Scales effectively as additional systems are introduced.

The amount of visible information should remain manageable regardless of player progression.

---

# Feedback Behaviour

The interface should provide immediate feedback whenever meaningful player actions occur.

Feedback may communicate:

- Successful interactions.
- Invalid actions.
- Progress updates.
- Resource changes.
- System status.
- Gameplay events.

Feedback should always be understandable and proportional to the importance of the event.

---

# Consistency Principles

Interface behaviour should remain consistent across the entire game.

Consistency should include:

- Navigation behaviour.
- Interaction patterns.
- Terminology.
- Information presentation.
- Player expectations.
- Visual responses.

Consistent behaviour reduces cognitive load and improves usability.

---

# Accessibility Considerations

The User Interface Behaviour System should support accessibility wherever practical.

Accessibility considerations may include:

- Readable information presentation.
- Clear interaction feedback.
- Consistent navigation.
- Alternative communication methods.
- Adjustable interface options.
- Future accessibility features.

Accessibility should improve usability without compromising gameplay design.

---

# Progression Role

The User Interface Behaviour System supports every stage of gameplay progression.

As gameplay systems become more complex, the interface should continue presenting information in a way that remains understandable and approachable.

The interface should evolve alongside gameplay while maintaining consistent interaction principles.

---

# Dependencies

The User Interface Behaviour System depends upon:

- Player Statistics System
- Notification System
- Saving & Loading Behaviour
- Every gameplay system that presents information to the player

These systems provide the gameplay data and events required for meaningful interface presentation.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Gameplay Systems | Present gameplay information through the interface. |
| Player Statistics System | Displays statistical information where appropriate. |
| Notification System | Delivers gameplay notifications through the interface. |
| Saving & Loading Behaviour | Communicates save and loading states to the player. |
| Economy System | Displays economic information. |
| Inventory System | Presents inventory information and interactions. |
| Factory Level System | Displays progression information. |

The User Interface Behaviour System provides the primary communication layer between gameplay systems and the player.

---

# Balancing Considerations

The interface should communicate sufficient information to support informed decision-making without overwhelming the player.

Additional gameplay complexity should result in improved organisation rather than increased visual clutter.

Players should be able to understand the current state of their factory with minimal effort.

---

# Future Expansion

The User Interface Behaviour System has been designed to support future additions, including:

- Additional interface customisation.
- Alternative navigation methods.
- Advanced accessibility features.
- Expanded information displays.
- Modular interface components.
- Context-sensitive interface behaviour.
- Future gameplay systems.

Future additions should integrate into the existing interaction framework while maintaining behavioural consistency.

---

# Developer Notes

This chapter defines how the game's interface behaves as a gameplay support system.

It intentionally avoids documenting individual screens, layouts, artwork, visual themes or implementation details.

Specific interface designs, screen layouts and visual assets are maintained separately within the project's interface documentation and supporting reference material.

---

# Related Sections

- 3.19 Player Statistics System
- 3.21 Notification System
- 3.22 Saving & Loading Behaviour
- Volume IV – Interface Reference (if applicable)

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial User Interface Behaviour specification created. |

# 3.21 Notification System

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.21

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

# 3.22 Saving & Loading Behaviour

> [!IMPORTANT]
>
> **Status:** 🟠 In Development
>
> **Section ID:** VOL3-3.22

---

# Purpose

The Saving & Loading Behaviour System defines how player progression and game state are preserved and restored throughout Everything Factory Incremental.

It establishes a framework for maintaining gameplay continuity while ensuring that player progress remains reliable, consistent and resilient across gameplay sessions.

The Saving & Loading Behaviour System provides the persistence layer that supports every gameplay system within the game.

---

# Responsibilities

The Saving & Loading Behaviour System is responsible for:

- Preserving player progression.
- Restoring gameplay state.
- Maintaining save data integrity.
- Supporting gameplay continuity across sessions.
- Coordinating persistence for gameplay systems.
- Providing a scalable framework for future persistence features.

The Saving & Loading Behaviour System is not responsible for:

- Defining gameplay mechanics.
- Managing gameplay progression.
- Recording gameplay statistics.
- Calculating gameplay systems.
- Presenting interface layouts.
- Managing notification content.

---

# Overview

The Saving & Loading Behaviour System ensures that the player's factory and progression persist between gameplay sessions.

Whenever gameplay state changes, the system should preserve the information necessary to accurately restore the player's progress.

Loading should reliably reconstruct the gameplay state while maintaining consistency across all interconnected systems.

Persistence should be dependable and require minimal player intervention.

---

# Design Intent

The Saving & Loading Behaviour System is designed to:

- Protect player progression.
- Minimise the risk of data loss.
- Maintain gameplay continuity.
- Support reliable recovery from interruptions.
- Operate transparently during normal gameplay.

Players should feel confident that their progress is safely preserved without needing to think about the underlying persistence process.

---

# Persistence Framework

The Saving & Loading Behaviour System provides the framework through which gameplay systems preserve their state.

Persistent gameplay data may include:

- Factory progression.
- Player progression.
- Resource progression.
- Collection progress.
- Achievement progress.
- Statistics.
- Gameplay configuration.
- Future gameplay systems.

The framework should remain flexible enough to accommodate additional persistent data as development continues.

---

# Saving Behaviour

Saving should occur whenever appropriate to preserve meaningful player progress.

Saving behaviour should:

- Record a complete and consistent gameplay state.
- Avoid disrupting active gameplay.
- Preserve data integrity.
- Operate reliably under normal gameplay conditions.
- Support manual and automatic saving where applicable.

Players should always understand when significant progress has been successfully preserved.

---

# Loading Behaviour

Loading should accurately restore the previously saved gameplay state.

Loading behaviour should:

- Restore gameplay consistently.
- Validate save data before use where appropriate.
- Reconstruct interconnected gameplay systems.
- Minimise loading interruptions.
- Preserve gameplay integrity.

Players should resume gameplay in a state that accurately reflects their previous progress.

---

# Data Integrity

The Saving & Loading Behaviour System should prioritise data reliability.

The system should:

- Prevent incomplete gameplay states.
- Recover gracefully where possible.
- Maintain consistency between gameplay systems.
- Preserve permanent progression accurately.
- Support future compatibility with evolving gameplay systems.

Protecting player progression should remain a primary design objective.

---

# Progression Role

Although saving and loading do not directly contribute to gameplay progression, they enable every progression system within the game.

Reliable persistence ensures that:

- Factory growth is preserved.
- Long-term progression remains meaningful.
- Player accomplishments are retained.
- Rebirth progression is maintained.
- Collection progress remains permanent.

Without reliable persistence, long-term gameplay systems cannot function effectively.

---

# Dependencies

The Saving & Loading Behaviour System depends upon:

- Player Statistics System
- User Interface Behaviour
- Notification System
- Every gameplay system that maintains persistent progression

These systems provide the gameplay state and player feedback required to support reliable persistence.

---

# System Interactions

| System | Interaction |
|----------|-------------|
| Player Statistics System | Preserves recorded gameplay statistics. |
| User Interface Behaviour | Communicates save and loading states where appropriate. |
| Notification System | Informs players about significant save-related events where necessary. |
| Factory Level System | Preserves progression state. |
| Achievement System | Maintains achievement completion. |
| Collection Log System | Retains discovered content. |
| Rebirth System | Preserves permanent rebirth progression. |
| Offline Progression System | Supplies progression generated while the player was away. |

The Saving & Loading Behaviour System provides the persistence foundation upon which every long-term gameplay system depends.

---

# Balancing Considerations

Saving and loading should operate consistently regardless of player progression.

The persistence system should minimise opportunities for unintended data loss or inconsistent gameplay states while remaining transparent during normal gameplay.

Players should trust that their progress is preserved accurately throughout extended gameplay.

---

# Future Expansion

The Saving & Loading Behaviour System has been designed to support future additions, including:

- Multiple save profiles.
- Cloud save support.
- Cross-platform progression.
- Automatic backup systems.
- Save recovery mechanisms.
- Version migration support.
- Additional persistence features.

Future additions should integrate into the existing persistence framework while maintaining data integrity and gameplay continuity.

---

# Developer Notes

This chapter defines how gameplay persistence functions as a supporting system.

It intentionally avoids documenting save file formats, serialisation methods, storage locations, compression, encryption or implementation-specific technical details.

Technical implementation and save data structures are maintained within the project's technical documentation.

---

# Related Sections

- 3.19 Player Statistics System
- 3.20 User Interface Behaviour
- 3.21 Notification System
- 3.17 Rebirth System
- 3.18 Offline Progression System
- Volume V – Technical Architecture (if applicable)

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Saving & Loading Behaviour specification created. |

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
> **Status:** 🟠 In Development
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

> [!IMPORTANT]
>
> **Status:** 🟢 Implemented
>
> **Section ID:** VOL4-4.1

---

# Purpose

The Resource Catalogue serves as the authoritative reference for every obtainable resource within Everything Factory Incremental.

It documents the implementation details, balancing values and gameplay purpose of each resource without redefining the gameplay systems responsible for resource generation, inventory management or progression.

This catalogue should be considered the single source of truth for all collectible resources currently available within the game.

---

# Scope

The Resource Catalogue contains every resource that can currently be obtained by the player.

Resources are primarily acquired through manual mining and form the foundation of the game's collection, economy and progression systems.

This catalogue documents:

- Resource properties
- Balancing values
- Rarity
- Experience rewards
- Collection information
- Related gameplay systems

The catalogue does not document:

- Mining mechanics
- Inventory behaviour
- Collection Log behaviour
- Economy calculations
- Factory production

These systems are documented within Volume III.

---

# Design Philosophy

Everything Factory Incremental intentionally avoids a traditional resource progression where increasingly valuable resources are unlocked over time.

Instead, every ore exists within a single randomised loot pool from the beginning of the game.

Players are encouraged to continue mining in pursuit of increasingly rare discoveries rather than reaching predetermined resource tiers through progression.

This philosophy creates a gameplay loop centred around discovery, collection and luck, while maintaining long-term excitement whenever a rare ore is found.

---

# Resource Entry Template

Every resource entry should contain:

- Name
- Tier
- Category
- Description
- Base Value
- XP Reward
- Rarity
- Unlock Requirement
- Obtainable From
- Primary Uses
- Collection Behaviour
- Related Systems
- Developer Notes

---

# Documentation Notes

When creating new resource entries:

- Maintain consistent balancing terminology.
- Avoid documenting gameplay behaviour.
- Update balancing values whenever implementation changes.
- Add new resources using the standard entry template.
- Maintain one authoritative entry per resource.

---

# Resource Overview

The current implementation contains twenty-one obtainable resources.

| Tier | Resources | Rarity |
|------|-----------|---------|
| Common | Stone | Always Available |
| Tier 1 | Amber, Quartz, Topaz, Amethyst, Malachite | 1 in 25 |
| Tier 2 | Citrine, Garnet, Peridot, Jade, Aquamarine | 1 in 1,000 |
| Tier 3 | Spinel, Tourmaline, Sapphire, Ruby, Emerald | 1 in 50,000 |
| Tier 4 | Onyx, Tanzanite, Alexandrite, Black Opal, Diamond | 1 in 250,000 |

---

# Gameplay Notes

## Resource Progression

Resources are **not** unlocked through gameplay progression.

Every resource is obtainable from the beginning of the game through random chance.

---

## Resource Usage

At the current stage of development, all resources share a single gameplay purpose.

Resources can be:

- Collected
- Stored within the player's inventory
- Sold for Cash
- Recorded within the Collection Log

Additional resource uses may be introduced during future development.

---

## Resource Variants

The current implementation contains no resource variants.

Future updates may introduce modifier systems (such as Mutations or Prefixes) which alter resource properties, but these systems are outside the scope of the current implementation.

---

# Catalogue Entries

---

# Stone

## Tier

Common

---

## Category

Basic Resource

---

## Description

Stone is the most common resource within Everything Factory Incremental and forms the foundation of the game's mining system.

---

## Base Value

$1

---

## XP Reward

1 XP

---

## Rarity

Always Available

---

## Unlock Requirement

Available from the start of the game.

---

## Obtainable From

- Manual Mining

---

## Primary Uses

- Sell for Cash
- Collection Log Completion

---

## Collection Behaviour

Recorded permanently upon first discovery.

---

## Related Systems

- Resource System
- Economy System
- Inventory System
- Collection Log System
- Factory Level System

---

## Developer Notes

Acts as the baseline resource against which all other resource values are balanced.

---

# Tier 1 Resources

| Resource | Value | XP | Rarity |
|----------|------:|---:|---------|
| Amber | $10 | 5 | 1 in 25 |
| Quartz | $20 | 5 | 1 in 25 |
| Topaz | $30 | 5 | 1 in 25 |
| Amethyst | $40 | 5 | 1 in 25 |
| Malachite | $50 | 5 | 1 in 25 |

Developer Notes:

Tier 1 introduces players to uncommon resources while remaining common enough to be discovered regularly.

---

# Tier 2 Resources

| Resource | Value | XP | Rarity |
|----------|------:|---:|---------|
| Citrine | $250 | 25 | 1 in 1,000 |
| Garnet | $500 | 25 | 1 in 1,000 |
| Peridot | $750 | 25 | 1 in 1,000 |
| Jade | $900 | 25 | 1 in 1,000 |
| Aquamarine | $1,000 | 25 | 1 in 1,000 |

Developer Notes:

Tier 2 represents the transition into genuinely rare discoveries and provides significantly higher economic rewards.

---

# Tier 3 Resources

| Resource | Value | XP | Rarity |
|----------|------:|---:|---------|
| Spinel | $5,000 | 100 | 1 in 50,000 |
| Tourmaline | $10,000 | 100 | 1 in 50,000 |
| Sapphire | $15,000 | 100 | 1 in 50,000 |
| Ruby | $20,000 | 100 | 1 in 50,000 |
| Emerald | $25,000 | 100 | 1 in 50,000 |

Developer Notes:

Tier 3 resources are intended to be memorable discoveries that may not appear for extended periods of gameplay.

---

# Tier 4 Resources

| Resource | Value | XP | Rarity |
|----------|------:|---:|---------|
| Onyx | $50,000 | 1,000 | 1 in 250,000 |
| Tanzanite | $75,000 | 1,000 | 1 in 250,000 |
| Alexandrite | $100,000 | 1,000 | 1 in 250,000 |
| Black Opal | $150,000 | 1,000 | 1 in 250,000 |
| Diamond | $250,000 | 1,000 | 1 in 250,000 |

Developer Notes:

Tier 4 resources represent the rarest naturally obtainable resources currently implemented and serve as long-term collection goals.

---

# Future Expansion

Future versions of this catalogue may include:

- Resource Mutations
- Resource Prefixes
- Additional Resource Tiers
- Event-exclusive Resources
- Crafted Resources
- Processing Chains
- Resource Metadata

---

# Related Sections

- Volume III – Resource System
- Volume III – Economy System
- Volume III – Collection Log System
- 4.2 Currency Catalogue

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Resource Catalogue created. |

---

## 4.2 Currency Catalogue

### Purpose

Documents every gameplay currency.

### Scope

Defines all currencies used throughout the game.

### Currency Entry Template

Every currency entry contains:

- Name
- Description
- Acquisition Methods
- Primary Uses
- Progression Role
- Related Systems
- Developer Notes

### Catalogue Entries

Cash

Gems

Stardust

Ancient Shards

Future Currencies

---

# Part II — Buildings

## 4.3 Production Building Catalogue

### Purpose

Documents every production building.

### Scope

Defines all factory buildings.

### Building Entry Template

Every building entry contains:

- Name
- Category
- Description
- Unlock Requirement
- Inputs
- Outputs
- Processing Behaviour
- Upgrade Path
- Variants
- Related Buildings
- Related Systems
- Developer Notes

### Catalogue Entries

Droppers

Conveyors

Furnaces

Adders

Multipliers

Storage

Future Buildings

---

## 4.4 Upgrade Catalogue

### Purpose

Documents every permanent upgrade.

### Scope

Defines all gameplay upgrades.

### Upgrade Entry Template

Every upgrade entry contains:

- Name
- Description
- Unlock Requirement
- Maximum Level
- Effect
- Cost Formula
- Dependencies
- Related Systems
- Developer Notes

### Catalogue Entries

Factory Upgrades

Conveyor Upgrades

Mining Upgrades

Automation Upgrades

Economy Upgrades

Future Upgrades

---

# Part III — Progression Content

## 4.5 Factory Level Reference

### Purpose

Documents every Factory Level.

### Scope

Defines progression by Factory Level.

### Factory Level Entry Template

Every entry contains:

- Level
- Unlocks
- Rewards
- Related Systems
- Developer Notes

### Catalogue Entries

Factory Levels

---

## 4.6 Milestone Catalogue

### Purpose

Documents every milestone.

### Scope

Defines all gameplay milestones.

### Milestone Entry Template

Every entry contains:

- Name
- Requirement
- Reward
- Unlock Conditions
- Related Systems
- Developer Notes

### Catalogue Entries

Gameplay Milestones

---

## 4.7 Achievement Catalogue

### Purpose

Documents every achievement.

### Scope

Defines all achievements.

### Achievement Entry Template

Every entry contains:

- Name
- Category
- Requirement
- Reward
- Hidden Status
- Repeatable
- Related Systems
- Developer Notes

### Catalogue Entries

Achievements

---

## 4.8 Collection Catalogue

### Purpose

Documents every Collection Log entry.

### Scope

Defines all collection entries.

### Collection Entry Template

Every entry contains:

- Name
- Category
- Unlock Requirement
- Discovery Method
- Related Content
- Completion Notes
- Developer Notes

### Catalogue Entries

Collection Entries

---

# Part IV — Supporting Content

## 4.9 Statistics Catalogue

### Purpose

Documents every tracked player statistic.

### Scope

Defines all statistics recorded by the game.

### Statistics Entry Template

Every entry contains:

- Name
- Description
- Recorded By
- Display Location
- Related Systems

### Catalogue Entries

Resources Collected

Buildings Placed

Play Time

Lifetime Earnings

Highest Factory Value

Future Statistics

---

## 4.10 Notification Reference

### Purpose

Documents every gameplay notification.

### Scope

Defines every notification generated by gameplay systems.

### Notification Entry Template

Every entry contains:

- Name
- Trigger
- Priority
- Display Behaviour
- Related Systems

### Catalogue Entries

Achievement Notifications

Milestone Notifications

Level Notifications

Discovery Notifications

Offline Progress Notifications

Future Notifications

---

## 4.11 Interface Reference

### Purpose

Documents every gameplay interface.

### Scope

Defines all player-facing interfaces.

### Interface Entry Template

Every entry contains:

- Name
- Purpose
- Accessible From
- Primary Functions
- Related Systems

### Catalogue Entries

HUD

Inventory

Shop

Factory View

Statistics

Settings

Future Interfaces

---

# Part V — Balancing Reference

## 4.12 Gameplay Constants

### Purpose

Documents global balancing values.

### Scope

Defines constants used throughout gameplay.

### Constant Entry Template

Every entry contains:

- Name
- Value
- Description
- Used By
- Developer Notes

### Catalogue Entries

Starting Inventory

Mining Speed

Walk Speed

Factory Limits

Global Multipliers

Future Constants

---

## 4.13 Formula Reference

### Purpose

Documents every gameplay formula.

### Scope

Defines mathematical formulas used throughout the game.

### Formula Entry Template

Every entry contains:

- Name
- Formula
- Description
- Variables
- Used By
- Developer Notes

### Catalogue Entries

Economy

Upgrade Costs

Experience

Factory Levels

Resource Scaling

Automation

Offline Progress

Future Formulae

---

# Revision History

| Version | Summary |
|----------|---------|
| 1.0.0 | Initial Volume IV structure created. |

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
