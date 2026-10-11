# V1-070E5 — Full-State Polisher Commit Boundary

**Status: documentation contract complete; production integration blocked by the field/consumer dependencies below. Production saveVersion remains 1.**

This contract follows [AGENTS](../AGENTS.md), [Bible Reference C](GAME_BIBLE.md#reference-c-polisher-behavior), [the consolidated specification](TEFI_Consolidated_Development_Specification.md), [V2 sections 2 and 5–9](V2_STATE_CONTRACT.md), [lifecycle sections 5–7a](V1_MACHINE_LIFECYCLE_CONTRACT.md), [approved T1 decisions](T1_TIMING_DECISION_SHEET.md), and [save compatibility](SAVE_VERSIONING.md). PR #33 was verified merged before this work. No runtime guarantees are implemented here.

## 1. Approved semantics and actual implementation

Polishing converts reserved raw ore into Polished stock. It is neither a new acquisition nor a sale. E3 retains one output Lot and one `{type:"polished",resourceId,stage:"polished",refineCount:0,amount}` event in a resolved cycle. Cash, Factory XP and Gem Dust deltas are all zero. E4 validates that result against original inputs and captured context, merges the output through InventoryModel and clears the cycle in a **partial, non-persisted candidate**.

References in this document name actual symbols in [game.js](../game.js) and [ores.js](../ores.js), so they remain useful when line numbers move. There is no `game/ui.js` in the repository: UI rendering, popups and gameplay handlers currently coexist in `game.js`. There is no runtime `polished` event dispatcher, full processing-statistics owner or challenge-state owner. The E3 event is data, not a callback.

The source trace matters: `mineOre` updates acquisition/discovery counters; `produceStone` updates prototype automated Stone counts; `confirmSmelt` and `finishAutoFurnaceCycle` update smelting counters and Cash/XP. None is a Polisher consumer. `checkAchievements` can call `unlockAchievement`, which mutates global state, sets a pending popup and calls `saveGame`. These functions cannot be called during pure candidate preparation.

## 2. Consumer ownership matrix

“Required” means included in the eventual full transaction when that approved subsystem exists. Preservation of a field is distinct from incrementing it.

| Consumer / source | Owned state | Polisher effect and authority | Atomic candidate / implementation status |
|---|---|---|---|
| `InventoryModel.addProcessedLot`; E4 `prepareCommit` | `processedInventory.polished`, `.refined` | Add conserved Polished output; exact historical cohorts only. Bible C; V2 §§6–7. | Required mutation; pure E4 exists, full-state adapter absent. Refined stock retained. |
| E3/E4 cycle validation | `factory.polishers` target `.cycle` | Clear the resolved input/result ownership together with output delivery; no raw refund. V2 §7. | Required mutation; replace only the identified entity in the full collection. |
| `mineOre`, `showDiscoveryPopup`, Collection rendering in `updateUI` | `oreCollection`, `achievementStats.oresDiscovered` | No increment, discovery or popup. Bible 3.16 explicitly separates collection from processed/refined events; V2 §2 retains acquisition meaning. | Preserve; existing acquisition implementation exists. No Polisher discovery adapter authorised. |
| `ACHIEVEMENTS`, `checkAchievements`, `unlockAchievement`, `claimAchievement` | `achievements`; `achievementStats.totalOresMined`, `.oresDiscovered`, `.oresSmelted`; Factory Level trigger | None of six current triggers changes. Bible Decision 28 retains their meanings; additional entries/rewards Deferred. | Preserve; do not sweep unrelated pending achievements while committing polishing. Future expanded catalogue needs its own contract/adapters. |
| `checkFactoryMilestones`, `updateFactoryLevel` | `factoryXP`, `factoryLevel`, `factoryMilestones`, transient `pendingMilestone` | No XP/Level change, therefore no milestone effect. Bible Reference G; zero E3 XP; legacy milestone mapping remains gated. | Preserve; no milestone callback or claim is part of this commit. |
| Future resource/processing statistics, no current producer/fields | Per-ore lifetime and current-Rebirth Polished-output counts | **Applicable and Defined:** increment each by event quantity. Bible Decision 30 / Reference H, also consolidated Statistics catalogue. | Required future consumer; exact serialized field paths/types/default/migration contract absent. V1-150/152 must provide it. Do not overload legacy achievement counters. |
| Future active challenge consumer, no runtime handler/fields | Eligible active Polished objectives and their progress/completion state | **Conditionally applicable and Defined:** qualifying output after objective generation counts, without consuming stock; pre-existing inventory does not count. Bible 3.23 / Reference F challenge progress, consolidated challenge rules. | Required when challenges are supported; V1-157–159 own schema, eligibility/reset integration and adapters. No automatic reward claim. Missing active-state semantics must not be guessed or treated as an empty objective set. |
| `mineOre`, `produceStone`, statistics display in `updateUI` | `totalOres`, `stoneOres`, `tier1Ores`…`tier4Ores`, manual-action `achievementStats.totalOresMined` | No increment. Processing is separate from raw acquisition under Reference H and Decision 28. | Preserve existing fields; no reuse of mining handlers. |
| `mineOre`, `updateUI` | `lastOre`, `lastOreValue` | No update: these are existing mining display fields, not last-processed output. V2 §2 preserves their historical meaning. | Preserve; no invented “last polished” field. |
| `confirmSmelt`, `finishAutoFurnaceCycle`, `addFactoryXP`; E3 deltas | `cash`, `factoryXP`, future `gemDust`; earnings/XP/Dust counters | Zero; polishing is not a sale or an approved XP/Dust award. V2 §7 does not create new reward rates. | Preserve balances and earned counters. No smelting/XP handler. |
| `updateUI`, menu builders, popup functions | DOM and transient popup state | Refresh committed inventory/progress only. Bible 3.21 makes notifications informative, not reward delivery. No mandatory per-batch polishing toast is Defined. | Post-persist presentation only. New processed-inventory UI/notification policy remains its owning UI work, not a saved event consumer. |

The statistics and conditional challenge effects are approved gameplay, **not unresolved whether they should count**. Their missing persistence mappings are technical dependencies. K.1 destroyed-Refiner challenge credit, K.3 challenge precision, expanded achievements and rewards retain their separate statuses. No such gap licenses extra polishing awards.

## 3. Exact known fields and the remaining schema gap

The future coordinator must hold the **entire validated canonical V2 state**, not persist an E4 projection. Its known write set is exactly:

- `processedInventory.polished` (plus independent preservation of `.refined`).
- `factory.polishers[the entity with expected id].cycle = null`.
- Approved Polished-output statistic counters, and eligible active challenge progress once their named contracts supply actual paths. Those paths do not exist in the current V2 contract and are deliberately **not invented here**.

The target entity's exact known fields are `id,slot,tier,selectedOreId,queue,investment,nextCycleSequence,cycle`. Validate the original Cycle's eight fields and CycleResult's five fields using E3/E4; validate one matching event, zero deltas, quantity conservation and bound value/duration. Preserve all other target fields, all other entities and available raw `inventory`; inputs are already owned by the resolved cycle and are not subtracted again.

Full-state preservation includes V2 §2 fields: `saveVersion,cash,gemDust,factoryXP,factoryLevel,inventory,oreCollection,factoryMilestones,achievements,achievementStats,totalOres,stoneOres,tier1Ores,tier2Ores,tier3Ores,tier4Ores,lastOre,lastOreValue,permanentBonuses,cycleBonuses,cosmetics,manual,materials,shop,identity,factory,compatibility`, plus documented retained fields and safe inert extensions under V2 §9. Within `factory`, retain `minerSlots,miners,refiner,furnace` and every non-target Polisher. Preserve both identity counters and every operation counter. These are preservation requirements, not new required fields in today's schema 1; optional completion follows the existing contract.

**Readiness limit:** a complete field-exact production adapter cannot yet be specified for processing statistics/challenges. V1-150/152 must name per-ID lifetime/current-Rebirth counters, validation, reset ownership and migration/default handling. V1-157–159 must name active objective identity, requirements, progress, completion and deadline fields and the ordered reset/commit interaction. V2 explicitly excludes challenge records until that bounded contract exists. A build with no activated challenges must establish that absence through its supported schema/capability contract, never infer it from a missing field in a save that claims support. Full commit integration must not silently omit required statistics. No acknowledgment flags, processed-cycle sets or persistent event queues are needed under the established whole-state single-writer design.

## 4. Prepare, validate, persist, publish

1. The single authoritative writer accepts a transient command containing expected Polisher ID and cycle ID. Read its latest committed full state; never accept a UI snapshot as authority. Reject missing/non-unique ownership, wrong cycle/phase or stale intent.
2. Validate the entire state, including ownership/slot/ID invariants and supported extensions. Extract E4's exact projection, retaining unrelated full-state data separately. E4 is not a whole-save validator.
3. Run E4 validation and preparation against independent data. It verifies stored output against the captured context; do not call E3 resolution, current perks or RNG. Keep the validated original event available transiently for the other pure consumers.
4. Prepare approved processing-statistics and, where applicable, active-challenge updates from that one fact. Each consumer is deterministic, owns explicit fields, rejects unsafe arithmetic and cannot mutate live state, save, notify or invoke another reward path. No inventory scan/backfill or automatic challenge claim.
5. Compose one independent full candidate by replacing only the known write set and approved consumer paths. Do not replace the full save with E4's return value. Preserve safe extensions without prototype pollution; conflicting/unsupported known shapes reject instead of disappearing. Validate full state, changed-field allowlist, conservation, zero reward deltas and consumer consistency.
6. Serialize the complete candidate once, then perform the approved whole-state write to `ef_incremental`. The future V1-050C2 writer owns this boundary. Current `saveGame` writes an already-mutated global and is **not** an implementation of prepare/persist/publish ordering.
7. Only after successful persistence publish that exact candidate as authoritative, release the pending transaction and refresh UI from committed state. Presentation failure cannot undo the commit or trigger a second award. Notifications cannot issue a second save. Do not automatically reserve another cycle here.

T1 accepted-command order applies to upgrades, completion, removal and Rebirth. A new accepted tier upgrade may have changed current tier, but the pending result retains its old bound effects. Resolved Polisher work commits normally before resale is revalidated. Rebirth can clear uncommitted work without payout; stale later callbacks reject. Conflicting operations cannot bypass a pending failed write.

## 5. Failure and replay transitions

| Case | Authoritative state / permitted action | Forbidden behaviour / required test |
|---|---|---|
| Validation failure | Original resolved snapshot unchanged; reject | No cycle clearing, output, consumer progress or save; inject each invalid field. |
| Consumer preparation failure | Discard incomplete proposal; retain original resolved state | No partial inventory/statistics mutation; inject consumer exception and count overflow. |
| Serialization failure | Keep original committed state; retain prepared candidate for diagnosis/controlled exact retry or safe recovery | No write/publication or lossy repair; test serialization error before storage call. |
| Storage write failure | Original resolved snapshot remains authority; retain exact candidate and serialization for controlled retry | Block conflicting mutations; no UI success or new event computation. Fail writes repeatedly then succeed. |
| Same-session retry | Retry identical pending whole-state transaction; publish only after successful write | Do not reread newer perks, rerun resolution or increment counters again. Verify identical serialized payload. |
| Reload from last successful snapshot | Validate before gameplay. Resolved cycle may prepare its original result commit; cleared cycle cannot | Pending memory is not durable. Test both snapshots; preserve corrupt bytes and recovery on invalid load. |
| Stale callback / duplicate command | Revalidate expected owner/cycle/phase against current authoritative state | Cleared or removed owner rejects; two queued commands cannot both credit. Pending retry is coordinator-owned, not a fresh command. |
| Consumer attempts own save | Violation: consumers receive data-only interfaces, not writer/global save access; reject before persistence | No nested/partial write. Test injected saving callback is not accepted as a consumer. |
| Crash after resolved persistence, before commit write | Reload resolved cycle with original output/event; prepare one full commit | No output previously published; no reroll/repricing. |
| Crash after commit write, before UI publication | Reload output/progress plus cleared cycle | No replay even if UI never displayed success. |
| UI refresh/notification failure | Already committed state stays authoritative; presentation can refresh again | Do not resave/reaward to recover a popup. |

This is exactly-once **within one successful full-state transition under one authoritative writer**. Repeating E4 against the original immutable snapshot can reproduce the same proposal. No multi-tab race protection, external tamper resistance, disk durability, rollback prevention or new storage engine is claimed. No persistent receipt is added to manufacture those guarantees.

## 6. Timing and compatibility

Reservation moves input ownership; resolution stores pending output/event facts; commit makes output and approved progress authoritative; UI refresh only presents the successful commit. No progress award occurs at reservation/resolution. T1 permits one saved overdue reservation to resolve and commit, not repeated unattended production; this commit contract neither schedules nor resolves it.

Production remains schema 1. `readVersionedSave`, `migrateSaveData`, `validateSaveData`, `completeValidatedSave` and preserved-byte recovery remain untouched. Existing `autoFurnaceBatch`, timestamps, modes, values and stop-after-current behaviour remain their legacy path; do not reinterpret them as Polisher work. V1-017 migration and V1-018 activation require complete consumers and validators first. Do not replace current saves with partial V2 data or infer historical polishing from legacy Adders/inventory.

The full adapter must implement V2 §9 extension preservation and reserved-namespace collision handling through the approved migration, not overwrite unknown legacy fields. E4 rejects extensions by design; a future adapter must validate and preserve supported extensions outside its projection, and reject conflicts without resetting compatibility data. Historical Lots, investments, claims and collection remain unchanged. Missing required future state must fail/recover, not default away progress. No historical event reconstruction is authorised.

## 7. Dependencies and deterministic acceptance checklist

- V1-150/152: exact processing-counter persistence/validation contract before a full Polisher consumer adapter; no change to legacy achievement-stat meanings.
- V1-157–159: conditional challenge adapter/schema and reset ordering; K.1/K.3 remain scoped gates. Additional achievement/reward catalogues remain Deferred.
- V1-041B: processed-inventory persistence; V1-074A2: full Polisher lifecycle/event adapter; V1-050C2: durable single writer and full-state validation; V1-017/018: migration/activation. None is completed by E5.
- Test reserve → resolve → full commit using captured effects; verify exact output, per-ID lifetime/current-Rebirth processing counts and eligible challenge progress when supported, with no mined/discovered/smelted/XP/Cash/Dust increment.
- Test unrelated machines, queues, identity, raw inventory, claims, bonuses, compatibility and safe unknown extensions survive byte-equivalent value comparison; reject namespace/shape conflicts.
- Test matching/different historical cohorts, later tier/perk changes, unsafe counts and malformed events without publication.
- Test every failure/retry row above, including crash between write and publication, duplicate IDs/commands, expired/reset challenge ordering once its contract exists, and stale callbacks after Rebirth/removal.
- Test consumers have no storage/UI capability; exactly one whole-state write per commit, and notification failure cannot award again.
- Retain existing schema-1 save/recovery/legacy Auto Furnace tests and pure E2/E3/E4 tests. Current passing tests do not certify the future coordinator.

Next bounded task: **define the Polished-output statistics field contract under V1-150/152**, including exact per-ore lifetime/current-Rebirth paths and a pure validated increment candidate. This closes a specific full-state mapping gap without production writes or challenge activation. Do not begin it in E5.
