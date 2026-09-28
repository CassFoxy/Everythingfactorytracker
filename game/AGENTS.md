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
