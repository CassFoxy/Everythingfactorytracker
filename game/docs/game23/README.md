# GAME23 — Six-Achievement Consolidation

One catalogue, six stable IDs, no reward activation and no saved-field additions.

## Implementation and audit

- `achievement-model.js` owns the existing definitions and shared progress/eligibility/claim rules. Private and legacy unlock checks use the same rules. The browser renderer is separate in `achievement-ui.js` and caches unchanged presentation.
- `firstSwing` / First Swing / “Mine your first stone.” / 1 manual action.
- `stoneMiner` / Ore Miner / “Mine 100 ores.” / 100 manual actions.
- `dedicatedMiner` / Dedicated Miner / “Mine 1,000 ores.” / 1,000 manual actions.
- `firstDiscovery` / Shiny! / “Discover your first ore.” / 1 unique ore.
- `firstSmelt` / First Smelt / “Smelt an ore.” / 1 item smelted.
- `factoryOwner` / Factory Owner / “Reach Factory Level 10.” / Level 10.

The historical mining descriptions say ores/Stone while their authoritative counter counts manual actions. GAME_BIBLE 3.15 explicitly retains these meanings; GAME23 preserves descriptions and labels progress as manual actions. The Bible table abbreviates “Shiny” while the existing name is “Shiny!”; the catalogue retains the existing punctuation. No resource-count reinterpretation or new reward policy is introduced.

The previous interface was visible before first unlock and advertised “Reward Available / CLAIM REWARD” despite deferred rewards. It now derives permanent reveal from unlocked records and offers “Record claim,” explicitly explaining that rewards remain deferred. Existing placeholder reward metadata is retained without activation. Private claims previously mutated live state before saving; they now use the full validated persist-before-publish command and exact retry.

## Compatibility and accessibility

Claiming changes only the requested claim flag. Locked, duplicate and unknown claims reject. Existing Boolean conversion, object records, unrelated fields, manual counters, Rebirth retention and raw-byte recovery remain supported. There is no load-time write or historical unlock replay. Existing legacy save behaviour remains separate.

GAME20 keeps its priorities/FIFO and simultaneous events. The detail route focuses the exact achievement card, with no second popup for private gameplay. Cards remain visible after claiming. Native buttons, named progress bars, keyboard focus containment/restoration, visible focus and internal scrolling work at all seven supported sizes. There are no new animations; reduced motion is verified.

## Verification

Targeted: eight new pure/runtime tests, existing achievement regressions, and seven real Chromium viewport flows. Full suite results and CI are recorded in the pull request after final verification.

Coverage includes every threshold boundary; six simultaneous unlocks; manual clicks versus output; no reward mutation; Boolean conversion; malformed recovery; reload/Rebirth; failed unlock and claim writes; repeated exact retry; notification navigation; simultaneous achievements/discovery/milestone; no historical replay; cached rendering; keyboard access; console errors; duplicate IDs and viewport fit.

## Chromium screenshots

Captured from the actual `/game/` entry point with claimed, unlocked and locked cards. The focused discovery achievement is scrolled into view on smaller screens; other cards and the summary remain reachable through internal scrolling. All seven images were inspected.

| Viewport | Screenshot |
|---|---|
| 2560 × 1440 | [Large desktop](2560x1440.webp) |
| 1920 × 1080 | [Desktop](1920x1080.webp) |
| 1366 × 768 | [Laptop](1366x768.webp) |
| 1280 × 720 | [Compact desktop](1280x720.webp) |
| 1280 × 600 | [Short laptop](1280x600.webp) |
| 768 × 1024 | [Tablet](768x1024.webp) |
| 390 × 844 | [Mobile](390x844.webp) |

## Deferred

Additional achievements/categories, reward amounts and effects, mutations, challenges and public V2 migration. No XP/Cash/Stardust, production, Collection, milestone or Rebirth formula changes.
