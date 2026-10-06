# Save schema version 1 — V1-010 through V1-015

## Planned V2 boundary — documentation synchronization, 2026-10-06

The active save version remains **1**. This file documents the accepted running V1 contract, including legacy field names and defaults; those are not the new gameplay design. [Bible 3.22 / Reference I](GAME_BIBLE.md#reference-i-save-version-2-migration) specifies the future adjacent 1→2 migration and canonical machine instances. Roadmap V1-016–018 covers field contracts, conversion/compensation, validation and recovery regressions. Unsupported above-cap reconstruction is DESIGN REQUIRED before shipping that migration. No migration or opening default changes are activated by documentation synchronization.


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

Rejected saves now open the V1-013 recovery screen while gameplay remains stopped. Players can download their original save, retry, or explicitly confirm starting fresh. JSON/load errors and storage reads/removals are handled; broader normal-gameplay quota/write failures remain follow-up work. There is no automatic deletion or repair.

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

V1-010 was reviewed and accepted. V1-015 regression verification is recorded below; broader V1-003 CI work remains separate. See V1_AUDIT.md for the original historical audit and design gates.

## Version 1 field validation — V1-011

Validation runs on the parsed version-compatible candidate before any existing defaults mutate it, before it becomes live save state, and before event handlers/timers are registered. It has no storage or DOM side effects. Failures identify the field and preserve the original localStorage string. No schema version increment is required: this validates the existing format rather than changing it.

### Required data and defaults

Cash and the three machine counts are required on stored saves because the existing legacy loader has no missing-field defaults for them. Missing values are rejected, not replaced with fresh-game money or machines. Fresh saves still start with exactly the existing values.

Other established optional fields may be absent; canonical default completion supplies them, including partial inventory/collection maps, milestone flags, bonus entries, cosmetics, furnace settings and achievement statistics. Explicit null, wrong types and non-finite numbers are invalid rather than treated as absence. This also catches NaN/Infinity serialised as JSON null. No strings/Booleans are coerced into numbers.

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

Validation covers loading, not every live mutation or storage write. Transactional saves, normal-gameplay storage/quota errors, atomic cross-tab coordination and automatic backups remain separate work. Migration, recovery and canonical default consolidation are described below. A rejected save stops gameplay and displays recovery options; its original data stays intact.

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

V1-012 was reviewed and accepted. Its migration contract and existing validation boundaries remain unchanged by V1-013.

## Player-facing recovery — V1-013

Save schema/version and gameplay values are unchanged. The startup boundary now catches recognised load failures and shows a separate recovery screen. Normal game content is hidden and inert. Game state/default initialization, furnace restoration, event handlers and the three gameplay/autosave intervals activate only after successful loading or an explicitly confirmed reset. Repeated successful retry cannot register duplicate timers. saveGame also refuses writes while startup is incomplete or recovery is active.

### Actions and preserved data

- **Download original save:** exports the captured raw string as a plain-text file, without parsing, formatting or replacing it. Whitespace, CRLF and Unicode text are preserved. Empty stored text is exportable; absence of the key is distinct. The underlying getRecoveryRawSave helper exposes the exact captured string for testing.
- **Retry load:** re-runs parse -> migration -> validation using the captured raw string after checking storage still matches it. It does not write or remove anything. Temporary storage-access failures can be retried; obtaining updated JavaScript still requires reloading the page.
- **Start fresh:** a browser confirmation warns that all stored progress will be removed and recommends downloading first. Cancellation changes nothing. After confirmation and a second storage comparison, removeItem removes the key; successful removal starts the same fresh Version 1 state as normal new-game startup. As before, normal save/autosave persists that state later. Recovery/reset itself never calls setItem.
- If storage changed since capture, retry/reset is blocked. The earlier copy remains downloadable; the UI asks the player to export it and reload to inspect the latest stored save. This is a best-effort comparison, not atomic cross-tab locking.
- If the first storage read fails, there is no readable snapshot to export. The UI says no data was changed, disables download/reset and offers retry. If a later read fails after capture, the original captured copy remains available.
- Removal failures retain the recovery screen and captured data. Export failures display a concise message and leave storage untouched. The download's short URL-cleanup timeout is separate from gameplay; no production or autosave timers run during recovery.

### Error categories and UI

Internal errors use code fields: PARSE_ERROR, VERSION_ERROR, MIGRATION_ERROR, VALIDATION_ERROR, STORAGE_READ_ERROR, STORAGE_REMOVE_ERROR, STORAGE_CHANGED and LOAD_ERROR fallback. Classification does not parse error-message strings. Pure load/migration/validation helpers still throw diagnostics; the startup boundary captures them in recoveryState.error.

The player sees fixed, concise category messages, preservation status, download/retry buttons and a separated destructive action. Raw data, exception messages and stacks are never inserted into the UI. Expected rejected saves no longer generate uncaught browser errors. The existing card/button styling is reused; other game UI is unchanged.

### Validation results

**207 Node tests passed, 0 failed:** the 186 previous cases plus 21 recovery cases. The same VM harness now exposes handled recovery diagnostics separately from uncaught errors and supports injected storage read/write/removal failures.

Tests cover all load failure categories, hidden/inert gameplay, no timers/autosave writes, exact raw export data, repeated failed retry, successful retry after restoring a migration, timer registration once, confirmation/cancellation, valid fresh state/reload, unreadable storage, failed removal, changed storage protection and no recovery/reset setItem calls. Previous migration, validation and gameplay regression coverage remains intact.

JavaScript syntax checks passed. Edge browser checks passed the actual recovery UI, exact downloaded text (including CRLF, Unicode and markup-looking text), failed retry, cancelled/confirmed reset, fresh save/reload, storage-read failure and successful retry. Normal game menus/actions and saved state matched V1-012. No unexpected console/page errors occurred. The recovery layout was visually inspected.

### Boundaries and follow-up

No import/replacement flow or automatic repair is included. Manual import can be a later bounded feature using the same load pipeline. No automatic backup or silent reset is introduced.

Normal gameplay quota/write-failure handling, atomic cross-tab coordination and transactional saves remain follow-ups. Explicit recovery actions avoid writes entirely; denied getItem/removeItem are handled here. Schema consolidation belongs to V1-014. The known fresh XP 0 versus missing legacy XP 100 inconsistency is unchanged.

V1-013 was reviewed and accepted. Its recovery contract remains unchanged by V1-014.

## Canonical state and ownership — V1-014

The current persisted shape remains Version 1. No fields were renamed, moved or removed, and no migration was added. The existing unversioned/0 -> 1 chain remains complete. Conceptual ownership below does not introduce extra nesting.

createDefaultSave() is the authoritative constructor for complete fresh player state. Inventory/collection maps use the existing resource catalogue helpers; milestone keys use createDefaultMilestones. Every call returns independent objects and arrays, including separate permanent/cycle bonus maps. The same constructor now supplies missing optional defaults after loading. Furnace upgrades and mode getters no longer repeat initialization defaults.

Loading remains parse -> adjacent migrations -> validation -> completeValidatedSave -> runtime initialization. completeValidatedSave is an internal helper for already-validated data: it copies its input, fills only missing own properties recursively, preserves present values and unknown data, and retains Boolean achievement conversion. Arrays are preserved as complete values, not merged by index. Invalid/null values are rejected before this helper; defaults cannot make required cash/machine fields optional.

There is one deliberate compatibility exception: absent XP in an existing save still receives 100; fresh XP remains 0. This is explicit beside default completion, rather than an accidental second set of defaults. Fixing opening XP is outside this ticket.

### Current persisted field ownership

| Owner | Fields and meaning |
| --- | --- |
| Persistence | saveVersion; Version 1 tag. Unknown top-level data is retained through load and normal save. |
| Economy | cash; available balance. |
| Factory progression | factoryXP, factoryLevel; current progression snapshot. |
| Machine ownership | droppers, adders, multipliers; owned counts. |
| Inventory | inventory; stone plus all current ORE_KEYS, with missing counts defaulting to zero. |
| Discovery | oreCollection; per-ore collection counts, distinct from spendable inventory. |
| Statistics/mining | totalOres, stoneOres, tier1Ores through tier4Ores, lastOre, lastOreValue; existing counters and last-result display data. |
| Achievements | achievements (known ID -> unlocked/claimed), achievementStats (totalOresMined, oresDiscovered, oresSmelted). Missing achievements remain an empty map; Boolean entries retain their compatibility conversion. |
| Milestones | factoryMilestones; generated threshold -> claimed Boolean. |
| Existing bonus scaffolding | permanentBonuses, cycleBonuses; oreValue, dropperSpeed, adderPower, multiplierPower, duplicateChance, furnaceCapacity, factoryXP, miningLuck, allLuck, allIncome, smeltSpeed. All already existed in initialized Version 1 state. No reward system is added. |
| Cosmetics | cosmetics.unlocked and cosmetics.equipped; existing default skin and four machine slots. |
| Furnace/automation | furnaceTier, autoFurnaceEnabled, autoFurnaceMode, autoFurnaceBatchMode, autoFurnaceStartTime, autoFurnaceBatch. Batch entries retain key, amount, value, name and emoji snapshots for reserved resources. |
| Stone pricing cache | stoneValue; existing persisted value refreshed by updateUI from Adders. Retained for compatibility. |

For exact defaults, see createDefaultSave in game.js. validateSaveData remains the authority for accepted types, IDs, required fields and constraints. A stored save may omit established optional fields; runtime state is completed from the constructor before gameplay starts. Normal saveGame serializes that state under the unchanged ef_incremental key. No separate serializer is needed while runtime and stored structures are identical.

### Persisted versus derived/runtime values

No existing field is removed. stoneValue is derivable but remains persisted; changing that contract or its UI-side refresh is unnecessary here. Factory Level and some statistics can overlap other data, but immediate saves may capture intermediate counters, so loading does not reconcile or reinterpret them. Collection, inventory and achievement statistics are not interchangeable.

Auto Furnace processing status and its runtime mirror are restored from the saved batch/timestamp/enabled fields. Batch unit values are historical snapshots and must not be recalculated from today's upgrades. UI selections, pending dialogs, recovery snapshots, timer handles and gameStarted remain runtime-only. Existing cost/capacity/progress calculations continue to derive their values without new persisted fields.

Future fields should be owned by their gameplay system, declared centrally when that system exists, validated, and accompanied by adjacent migrations whenever the persisted schema materially changes. No grid, settings, mutation, Rebirth or offline placeholders are introduced.

### Verification and follow-up

**217 Node tests passed, 0 failed:** all 207 V1-010 through V1-013 tests plus 10 consolidation tests. New cases cover canonical fresh state, nested object independence, every optional top-level default, every nested default leaf, immutable/deterministic completion, all legacy/current versions over repeated populated round trips, required-field protection and furnace mode preservation through upgrades.

JavaScript syntax checks passed for both runtime scripts and both test scripts. The existing Edge smoke suite passed normal mining/purchases/furnaces/menus, save/reload, legacy saves, rejected saves, exact raw recovery download, confirmation/cancellation and storage retry. Every saved gameplay field matched accepted V1-013 after identical actions; no unexpected console/page errors occurred.

Recovery UI, validation, migration and balance are unchanged. Known follow-ups remain opening-XP inconsistency, UI-owned stoneValue refresh, broader normal-gameplay storage write/quota handling and atomic cross-tab coordination. No design decision was needed for this bounded consolidation.

V1-014 was reviewed and accepted. Its schema and default-completion contract remain unchanged.

## Save regression certification — V1-015

This ticket changes only this document and the two existing test scripts. No production code, balance, schema version, migration, default values or recovery UI changed. No new persistence defect was found; no defect fix was required.

### Focused coverage review

The existing 217 cases already covered fresh/unversioned/0/1 saves, adjacent migration ordering/failures, current-version bypass, validation types/IDs, optional versus required fields, canonical object isolation, partial nested defaults, Boolean achievement conversion, unknown data, repeated populated reloads, historical furnace snapshots and completed-batch payouts. Recovery coverage already included exact export, retries, reset confirmation/cancellation, storage read/remove failures and changed-storage protection. The browser suite already covered normal gameplay/reload and the recovery journey.

The remaining useful gaps were advancing time through a running furnace across reloads, enabled batch chaining, full-batch waiting, a more broadly populated state and a longer sequence combining real actions with reloads. These were addressed without duplicating the existing validation matrix:

| Coverage added | Behaviour protected |
| --- | --- |
| Broad populated-state round trips | Nonzero mining counters across all tiers, achievement statistics, every bonus entry, multiple cosmetic slots, locked/unlocked/claimed achievements, partial milestones, unknown data and all inventory/collection keys survive five persistence cycles. |
| Mid-cycle furnace reload | Resources are reserved once; batch values/timestamp survive mode changes and stopping; no payout at 9,999 ms; one payout at 10,000 ms; later reloads cannot repeat it. |
| Enabled furnace chaining | A completed 100-item batch pays once, reserves the remaining 50 items, and restores that new batch independently before its single completion. |
| Full-batch waiting | 99 Stone survives idle reload unchanged; one real mining action permits a 100-item batch that survives another reload. |
| Longer gameplay sequence | 100 deterministic mines across four ore tiers and Stone, machine purchases, furnace upgrade, Dropper production, manual smelting, achievement claim and milestone progress survive 20 autosave/reload cycles with full state comparisons. |
| Existing rejected fixtures strengthened | Every fixture using assertRejected now also checks handled recovery, hidden/inert gameplay, exact original export text and blocked save/autosave writes. |
| Browser furnace integration | Actual browser storage/reload restores active runtime processing, waits until completion and does not pay the completed batch again after reload. |

### Determinism and execution

The existing Node VM adapter now provides a controlled clock through now()/advance(ms); callbacks still run only through the existing tick helper. Each independent boot starts at 1700000000000 ms unless supplied a retained clock. The round-trip helper preserves the clock across reloads, calls the real autosave callback, compares LocalStorage with runtime state and compares the complete reloaded state. Random mining rolls are controlled only in tests. The browser smoke suite similarly controls Date.now and interval callbacks. No wall-clock sleeping, second framework or performance benchmark was added.

Run the existing commands from the repository root:

```text
node --check game/game.js
node --check game/ores.js
node --check game/docs/tests/save-versioning.test.cjs
node --check game/docs/tests/browser-smoke.cjs
node --test game/docs/tests/save-versioning.test.cjs
node game/docs/tests/browser-smoke.cjs
```

The browser command needs Playwright and a browser: use the existing TEFI_PLAYWRIGHT_PATH and TEFI_BROWSER_CHANNEL overrides when using an installed Edge (msedge). No dependencies were installed or replaced for this ticket.

**Results: 222 Node tests passed, 0 failed**, including all 217 prior cases and five new behavioural cases. Syntax checks passed. The Edge smoke suite passed all ten reported scenarios with no unexpected console/page errors, including exact recovery download, reset cancellation/confirmation and successful storage retry. The Node suite runs in approximately three seconds locally; the 20-reload sequence takes well under one second.

### Foundation status and limits

V1-010 through V1-015 provide a stable, regression-tested foundation for the currently implemented persistence lifecycle and subsequent V1 development, subject to the documented limits below. This does not certify the entire game or V1 release readiness. New gameplay/schema changes still require their own migration and regression coverage.

Known limits remain normal-gameplay storage write/quota handling, non-atomic cross-tab coordination and non-transactional intermediate writes. Supported recovery storage failures are covered; tests do not claim resilience to process interruption between arbitrary writes. Automated execution is configured by V1-003 below. The fresh XP 0 versus absent legacy XP 100 inconsistency and UI-side stoneValue refresh remain unchanged.

V1-015 was reviewed and accepted. The gameplay roadmap resumes with V1-020 progression review after the automation ticket below.

## Automated execution — V1-003

The root package.json provides the same commands locally and in GitHub Actions. The only direct development dependency is pinned Playwright 1.62.1; package-lock.json records the dependency tree. No gameplay code or test assertions changed.

From the repository root, with Node 24 LTS and npm installed:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npx --no-install playwright install --with-deps --only-shell chromium
npm run test:browser
```

npm test runs the four JavaScript syntax checks followed by the full 222-case Node suite. Individual commands are npm run test:syntax and npm run test:node. Browser installation is a one-time prerequisite per Playwright/browser revision. Linux needs the system dependencies installed by --with-deps. On Windows/macOS, --with-deps may be omitted. The browser tests use a temporary loopback server and controlled clocks/randomness; they do not contact production services.

Local Edge remains supported: set TEFI_BROWSER_CHANNEL=msedge and run npm run test:browser with Edge installed. TEFI_PLAYWRIGHT_PATH remains an optional existing override; ordinary installations resolve the locked local dependency. CI uses neither override and runs Chromium headless shell.

.github/workflows/tests.yml defines **TEFI Tests**, with one **Syntax, Node and Chromium** check on Ubuntu 24.04 / Node 24 LTS. It triggers for pull requests targeting main and pushes to main, including draft PRs. Branch pushes do not separately trigger duplicate PR jobs; a newer run cancels a superseded run for the same PR/ref. No path filters can leave the check indefinitely pending. Jobs have a 15-minute timeout.

Steps separately report dependency installation, syntax checks, Node tests, Chromium installation and browser smoke tests. Nonzero exits fail the job; no assertions are weakened or failures ignored. Actions are pinned to commit SHAs, permissions are contents: read, and checkout does not persist credentials. There are no secrets, deployments, releases, repository writes or automatic merges. No dependency/browser cache is added for this small dependency tree.

Node 24 follows the [Node LTS release schedule](https://nodejs.org/en/about/previous-releases). Chromium installation follows [Playwright's CI guidance](https://playwright.dev/docs/ci) and [headless-shell installation guidance](https://playwright.dev/docs/browsers). Installation needs npm/browser-download network access; test execution itself does not.

The check name **Syntax, Node and Chromium** can be made required in branch protection separately. Branch protection is unchanged. Workflow configuration alone does not prevent merging a failing PR.

Local verification and actual GitHub-hosted results are reported separately on the V1-003 PR. V1-020 — Fresh Save Progression Review is the next gameplay ticket; it is not started here.
