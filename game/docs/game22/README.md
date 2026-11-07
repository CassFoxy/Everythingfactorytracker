# GAME22 — Base Ore Collection implementation and review

## Implementation

`collection-model.js` projects the authoritative `ORES` catalogue and `save.oreCollection` into pure presentation facts. Tier order follows the existing catalogue. Unknown entries contain only position, tier and discovery state: no name, ID, icon, value, rarity or quantity. `collection-ui.js` builds the modal with generic locked artwork, native discovered-entry buttons, derived progress and one reusable details pane. It caches unchanged facts, preserves internal scroll/focus and does not recreate unrelated dashboard controls.

Discovered details show name, tier, local artwork, base value, the existing catalogue's tier-rarity reference, cumulative acquisitions and permanent discovery status. The rarity reference is explicitly not a live per-ore drop chance; source, access and Luck remain governed by existing models. No fictional first-discovery dates, sources or rewards are displayed. Cumulative counts are not available inventory.

GAME20 adds only a transient resource ID to its existing committed discovery fact; its detail action opens/focuses that ore. Queue ordering, priority, retry, duplicate suppression and persistent progression are unchanged. Private and untagged saves continue using their existing authoritative counters with no new fields, load writes or inventory-based reconstruction. Mutation Collection, relics, new tiers, rewards and public V2 remain excluded.

## Verification

Pure tests cover 20 unique authoritative entries, tier order, 0/1/partial/full completion, repeated acquisitions, redaction and notification routing. Runtime tests exercise private/legacy loading, malformed recovery, actual Furnace/Polisher/Refiner processing, Rebirth, exact failed-write retry and permanent cumulative quantities. Existing gameplay regressions remain intact.

Seven real Chromium flows verify unknown DOM/accessible-data redaction, real manual discovery, notification focus routing, simultaneous discoveries, failure/retry, useful details, unchanged-DOM caching, keyboard focus containment/restoration, 7/20 and 20/20 progress, inventory independence, Rebirth/reload, reduced motion, duplicate IDs, console errors and overflow. Screenshots show 7/20 (35%) with Ruby selected and cumulative quantity four, independently of its available inventory. The catalogue is scrolled to the selected ore; both catalogue and details remain internally scrollable.

- [2560×1440](2560x1440.webp)
- [1920×1080](1920x1080.webp)
- [1366×768](1366x768.webp)
- [1280×720](1280x720.webp)
- [1280×600](1280x600.webp)
- [768×1024](768x1024.webp)
- [390×844](390x844.webp)

All seven screenshots were captured from `/game/` and visually inspected. Final syntax, full Node/Chromium and GitHub Actions counts/results are recorded on the implementation PR. No gameplay formulas, machine lifecycle, Rebirth reset or milestone policy changed.
