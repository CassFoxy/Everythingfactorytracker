# Save schema version 1 — V1-010

## Contract

Storage key remains `ef_incremental`. The save remains the same player-state object, with one additive top-level field: `saveVersion: 1`.

Schema versions are non-negative safe integers independent of game, Bible and design version strings. There was no selected save-specific format in the Bible: its versioning section names those three separate document/product versions, and section 3.22 deliberately leaves storage formats to technical documentation. This integer convention is a technical implementation choice, not a gameplay change.

- No stored key (`getItem` returns null): create the existing fresh state with version 1.
- A JSON object without `saveVersion`, or with explicit version 0: preserve every existing field and add version 1. Existing missing-field defaults and Boolean achievement conversion still run.
- Version 1: preserve data; normal existing defaults still run.
- Invalid version type, fractional/negative/unsafe integer, or unsupported newer version: abort startup before event registration/timers. Never downgrade or overwrite it.
- Invalid JSON or non-object root: abort before timers and retain the original stored bytes. Only absence of the key means a fresh save; stored JSON null/false/0 no longer silently becomes a new game.
- Reads do not immediately write. Existing saves/autosaves persist the tag using the unchanged storage key and cadence. Unknown fields are retained.
- Active furnace batch, timestamp, modes and stopped/enabled state remain in their original fields. No offline simulation is added.

`readVersionedSave` has no DOM/storage side effects. The narrow root/version checks are necessary to safely interpret the version tag, not a complete validator.

## Compatibility and limits

Version 0 to 1 has no structural gameplay transformation. Future schema changes must implement explicit migrations before raising SAVE_VERSION; simply changing the constant is insufficient. Do not treat a future version as legacy.

Older game code ignores the extra property and preserves it during ordinary saves. An older client cannot enforce the new future-version protection. This ticket does not solve concurrent tabs or downgrade protection in already published older builds.

Rejected saves currently leave gameplay unable to start and report an error in the browser console. This intentionally preserves data; it is not the recovery UI requested by V1-013. JSON/storage read errors remain unhandled, as do quota/write failures. Do not tell players to delete their save as an automatic recovery path.

Existing defaults remain partial: missing cash/machine counts and malformed nested fields are V1-011 work. Fresh XP 0 versus legacy fallback XP 100 is unchanged. No schema regrouping, balancing, rebirth, permanent rewards or final factory behavior changes are included.

## Tests

From repository root, with Node.js available:

```sh
node --check game/game.js
node --check game/ores.js
node --check game/docs/tests/save-versioning.test.cjs
node --check game/docs/tests/browser-smoke.cjs
node --test game/docs/tests/save-versioning.test.cjs
```

The 23 dependency-free node:test checks use the real ores.js and entire game.js in a VM with a small DOM/storage/timer adapter. Coverage includes fresh saves, populated unversioned saves, version 0/current/repeated round trips, optional missing fields, legacy Boolean achievements, malformed roots/JSON, eight invalid/future versions, autosave, reset confirmation, current mining/discovery/purchases/furnaces, XP/milestones/achievements and resumed furnace batch payment exactly once.

Optional real-browser test:

```sh
node game/docs/tests/browser-smoke.cjs
```

Requires Playwright plus a browser; it is not needed for the dependency-free suite. Use TEFI_PLAYWRIGHT_PATH to point to an existing Playwright installation. TEFI_BROWSER_CHANNEL may select an installed `msedge` or `chrome`; otherwise Playwright's Chromium is used. The script serves only the four runtime files on an ephemeral loopback port and uses isolated temporary browser contexts, never the player's normal browser save. Timers are controlled for deterministic checks, and normal actions use actual UI clicks.

Optionally set TEFI_BASELINE_GAME to the audited pre-change game.js file. The smoke test repeats the same actions against it and compares every saved gameplay field, excluding only the new version tag.

## Validation results (2026-09-28)

- Syntax checks: passed.
- Existing game test suite: none present in the audited repository tree.
- Node suite: 23 passed, 0 failed.
- Browser: installed Microsoft Edge (Chromium), headless, real HTML and scripts; mining, Dropper purchase, Stone production, furnace selection/confirmation, autosave callback, reload and existing menu rendering passed without unexpected console/page errors.
- Legacy populated save/reload: passed without console errors.
- Malformed JSON and newer version: original bytes retained; no simulation/autosave timers registered; one expected startup error per rejected case.
- Baseline comparison: all saved gameplay fields identical after the same mining/purchase/smelt/reload sequence.
- Initial browser runner attempts found no bundled Chromium executable and then an incorrect test locator ("Smelt" instead of the existing "Select" label). Runner configuration/locator were corrected; the final Edge run passed. No production gameplay change was made to satisfy the runner.
- Cross-browser/mobile, long-session, full furnace-mode matrix, full missing-field validation and V1 release playthroughs are not certified by these checks.

V1-010 is implemented and tested; broader V1-003/V1-015 coverage remains incomplete. Recommended next ticket: V1-011. See V1_AUDIT.md for the full audit and design gates.

