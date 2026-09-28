# Save schema version 1 — V1-010, V1-011 and V1-012

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

`readVersionedSave` has no DOM/storage side effects. It parses JSON, calls `migrateSaveData`, then calls `validateSaveData` before returning a stored state. The V1-011 and V1-012 contracts below supplement the original version checks.

## Compatibility and limits

Version 0 to 1 has no structural gameplay transformation. Future schema changes must implement explicit migrations before raising SAVE_VERSION; simply changing the constant is insufficient. Do not treat a future version as legacy.

Older game code ignores the extra property and preserves it during ordinary saves. An older client cannot enforce the new future-version protection. This ticket does not solve concurrent tabs or downgrade protection in already published older builds.

Rejected saves currently leave gameplay unable to start and report an error in the browser console. This intentionally preserves data; it is not the recovery UI requested by V1-013. JSON/storage read errors remain unhandled, as do quota/write failures. Do not tell players to delete their save as an automatic recovery path.

Missing cash/machine counts and malformed nested fields are now rejected by V1-011. Established optional defaults remain unchanged, including fresh XP 0 versus legacy fallback XP 100. No schema regrouping, balancing, rebirth, permanent rewards or final factory behavior changes are included.

## Tests

From repository root, with Node.js available:

```sh
node --check game/game.js
node --check game/ores.js
node --check game/docs/tests/save-versioning.test.cjs
node --check game/docs/tests/browser-smoke.cjs
node --test game/docs/tests/save-versioning.test.cjs
```

The dependency-free node:test checks use the real ores.js and entire game.js in a VM with a small DOM/storage/timer adapter. The original 23 checks are retained alongside the V1-011 cases described below. Coverage includes fresh saves, populated unversioned saves, version 0/current/repeated round trips, optional missing fields, legacy Boolean achievements, malformed roots/JSON, eight invalid/future versions, autosave, reset confirmation, current mining/discovery/purchases/furnaces, XP/milestones/achievements and resumed furnace batch payment exactly once.

Optional real-browser test:

```sh
node game/docs/tests/browser-smoke.cjs
```

Requires Playwright plus a browser; it is not needed for the dependency-free suite. Use TEFI_PLAYWRIGHT_PATH to point to an existing Playwright installation. TEFI_BROWSER_CHANNEL may select an installed `msedge` or `chrome`; otherwise Playwright's Chromium is used. The script serves only the four runtime files on an ephemeral loopback port and uses isolated temporary browser contexts, never the player's normal browser save. Timers are controlled for deterministic checks, and normal actions use actual UI clicks.

Optionally set TEFI_BASELINE_GAME to the audited pre-change game.js file. The smoke test repeats the same actions against it and compares every saved gameplay field, excluding only the new version tag.

## Original V1-010 validation results (2026-09-28)

- Syntax checks: passed.
- Existing game test suite: none present in the audited repository tree.
- Node suite: 23 passed, 0 failed.
- Browser: installed Microsoft Edge (Chromium), headless, real HTML and scripts; mining, Dropper purchase, Stone production, furnace selection/confirmation, autosave callback, reload and existing menu rendering passed without unexpected console/page errors.
- Legacy populated save/reload: passed without console errors.
- Malformed JSON and newer version: original bytes retained; no simulation/autosave timers registered; one expected startup error per rejected case.
- Baseline comparison: all saved gameplay fields identical after the same mining/purchase/smelt/reload sequence.
- Initial browser runner attempts found no bundled Chromium executable and then an incorrect test locator ("Smelt" instead of the existing "Select" label). Runner configuration/locator were corrected; the final Edge run passed. No production gameplay change was made to satisfy the runner.
- Cross-browser/mobile, long-session, full furnace-mode matrix, full missing-field validation and V1 release playthroughs are not certified by these checks.

V1-010 was reviewed and accepted; broader V1-003/V1-015 coverage remains incomplete. See V1_AUDIT.md for the original audit and design gates.

## Version 1 field validation — V1-011

Validation runs on the parsed version-compatible candidate before any existing defaults mutate it, before it becomes live save state, and before event handlers/timers are registered. It has no storage or DOM side effects. Failures identify the field and preserve the original localStorage string. No schema version increment is required: this validates the existing format rather than changing it.

### Required data and defaults

Cash and the three machine counts are required on stored saves because the existing legacy loader has no missing-field defaults for them. Missing values are rejected, not replaced with fresh-game money or machines. Fresh saves still start with exactly the existing values.

Other established optional fields may be absent; the unchanged default block then supplies them, including partial inventory/collection maps, milestone flags, bonus entries, cosmetics, furnace settings and achievement statistics. Explicit null, wrong types and non-finite numbers are invalid rather than treated as absence. This also catches NaN/Infinity serialised as JSON null. No strings/Booleans are coerced into numbers.

### Enforced rules

| Data | Validation |
|---|---|
| saveVersion | Existing absent/0 -> 1 compatibility; current 1 accepted; invalid/future versions rejected. |
| Cash, lastOreValue, stoneValue | Finite, non-negative numbers. Fractional cash/value snapshots are retained. |
| Factory XP, machine counts, production/tier counters | Finite, non-negative integers. |
| Factory Level | Finite integer at least 1; not recomputed or reconciled with XP here. |
| lastOre | Nonempty string; historical display text is retained. |
| Furnace tier | Integer indexing one of the existing furnace definitions. |
| Inventory / Ore Collection | Objects of non-negative integer counts. Inventory allows Stone and current ore IDs; collection allows the existing 20 ore IDs. Unknown IDs reject the whole save, never silently disappear. |
| Milestones | Object keyed by the existing generated milestone levels with Boolean flags. |
| Achievements | Existing IDs only; legacy Booleans retain their existing conversion. Object records require Boolean unlocked and claimed; claimed while locked is invalid. Extra record properties are retained. |
| Achievement statistics | Object of non-negative integer counters; unique ore discoveries cannot exceed the current ore catalogue. Missing established entries retain defaults. |
| Bonus scaffolding | Object of finite numbers. No invented sign restrictions, caps, effects or upgrade eligibility. Unknown numeric entries remain intact. |
| Cosmetics | Objects; unlock flags are Booleans and equipped IDs are nonempty strings. String IDs are preserved without a new catalogue or ownership/equipping policy. |
| Auto Furnace settings | Boolean enabled flag and one of the existing three resource modes/two batch modes. |
| Auto Furnace timestamp | Non-negative integer representable as a JavaScript date. Future timestamps are accepted because clocks can move; no offline/time-repair policy is introduced. |
| Auto Furnace batch | Array of unique known resource IDs; positive integer quantities, finite non-negative reserved values and plain-text name/emoji strings. Total quantity must fit the existing 100-item capacity. Payout and cash plus payout must remain finite. |
| Furnace consistency | A nonempty batch needs Auto Furnace tier and positive timestamp. An empty batch needs timestamp zero. Stopped-but-processing batches remain valid. |

Batch label markup containing a less-than sign is rejected because the current UI inserts labels into HTML. No catalogue name/value rewrite occurs: existing reserved values and plain-text labels are kept. Resources were removed from inventory at batch start; therefore the validator does not demand that batch resources also exist in inventory. It does not require the batch to match newly selected modes or current Adder values.

### Preservation and boundaries

Unknown top-level fields are retained. Known indexed maps validate their IDs rather than deleting unknown entries. Invalid saves are rejected as a whole before any autosave; there is no partial-reset salvage.

Finite large progression values are not given new balance caps or a blanket safe-integer ceiling. Existing JavaScript precision limits, eventual arithmetic overflow and high-machine-count simulation performance remain technical follow-ups. Schema versions and timestamps have their own stricter technical bounds.

Fresh XP remains 0, while absent legacy XP defaults to 100. Level/XP, totals/collection and achievement progress are not forcibly reconciled: current immediate saves can capture intermediate counters, and repairing them would exceed validation scope. Bonus sign/cap rules and cosmetic eligibility remain undefined; their type-safe scaffolding is preserved.

Validation covers loading, not every live mutation or storage write. Transactional saves, storage/quota errors, concurrent tabs, recovery UI/backups (V1-013), and schema consolidation (V1-014) remain separate work. Migration infrastructure is described below. A rejected save still stops startup and reports a console error; its original data stays intact.

### V1-011 test results

158 Node tests passed, 0 failed: the 23 existing V1-010 tests plus 135 focused validation/default/compatibility tests in the same harness. Coverage includes wrong types, negatives, fractions, non-finite values, invalid IDs/maps/achievement/milestone data, batches/timestamps/payout overflow, missing optional versus required fields, unknown data, legacy compatibility, repeated round trips and non-destructive rejection.

Syntax checks passed for both game scripts and both existing test scripts. The existing Edge browser smoke runner passed normal gameplay/menus, save/reload, legacy saves, malformed JSON, future versions, negative cash, wrongly typed inventory counts and a null furnace batch. Rejected cases had their expected startup error and no timers. The normal gameplay snapshot matched accepted V1-010 across all saved fields.

V1-011 was reviewed and accepted. Its validation rules remain unchanged by V1-012.

## Ordered save migrations — V1-012

The production schema remains **saveVersion 1**. Loading now follows:

```text
Read LocalStorage → parse JSON → identify version → migrate each step
→ validate current-schema state → apply established defaults → start gameplay
```

### Registry and step contract

`SAVE_MIGRATIONS` is keyed by source version. The only production entry is `0`, which returns the existing data plus `saveVersion: 1`. Unversioned input is identified as legacy 0. No Version 2 schema or future gameplay fields are introduced.

`migrateSaveData(data, targetVersion = SAVE_VERSION, migrations = SAVE_MIGRATIONS)` advances in a loop. At each version N it requires an own registry entry N that is a function, calls it, and requires a returned object whose own saveVersion is exactly N + 1. Missing steps, thrown exceptions, invalid results, skipped versions and downgrades fail with a diagnostic naming the affected step. Invalid/future input versions are rejected before any step runs.

The optional target/registry arguments allow test-only artificial chains without changing production configuration. Normal loading always uses the production defaults. Current-version saves run no registry functions.

Each migration must be synchronous and deterministic, with no storage, DOM, timer, random or clock side effects. It should preserve unknown fields unless an approved schema transformation explicitly changes them. New real schemas must add the next adjacent step and tests before increasing SAVE_VERSION; older entries remain to support the entire chain.

### Data ownership, validation and failure

The runner recursively copies parsed JSON data before running steps, including nested objects and arrays. Even an in-place migration, or a later step that throws, cannot mutate the caller's original parsed object through the provided argument. Own property names such as __proto__ remain data properties. The copy does not use stringify/parse, which would turn non-finite numbers into null before validation.

This helper is for parsed JSON trees, not arbitrary cyclic objects or browser objects. Future migration authors remain responsible for avoiding external side effects and for preserving fields their transformation does not own.

Migration performs schema transformations, not corruption repair. After reaching the target, `readVersionedSave` separately calls the unchanged V1-011 validator. Existing optional defaults and Boolean achievement conversion then run exactly as before, including for already-versioned saves. Missing/invalid fields are not silently repaired by a migration.

No migration or validation writes to LocalStorage during loading. Failed loads abort before gameplay handlers/timers and preserve the original stored bytes. Successful migrated data is persisted only by the existing normal save/autosave paths.

### V1-012 test results

- **186 Node tests passed, 0 failed**: all 158 existing cases plus 28 migration cases in the same test harness.
- New tests cover unversioned/0/1 compatibility, exact data preservation, unknown nested fields, source isolation, current/fresh no-transform paths, deterministic results, multiple adjacent test-only steps, missing intermediate steps, invalid step outputs, thrown errors, version rejection, pipeline ordering and post-migration validation.
- Test-only startup fault injection verifies original bytes, no writes, no handlers and no timers after migration or validation failure. Repeated save/load, active furnace batches and established defaults remain covered by the existing regressions.
- Syntax checks passed for game.js, ores.js and both existing test scripts.
- The unchanged Edge browser smoke suite passed normal gameplay, menus, save/reload, legacy loading and expected corrupted/future-save rejection. Saved gameplay state matched accepted V1-011 after identical actions, with no unexpected console/page errors.

V1-012 is implemented and tested. The starting-XP inconsistency and existing validation boundaries are unchanged. Storage failures, concurrent tabs, recovery UI/backups and later schema consolidation remain separate work. Recommended next ticket: **V1-013 — Corrupted Save Recovery**, after review.

