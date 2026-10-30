## GAME19 private broader-statistics adapter

The miner-1 runtime now stores additional validated gameplay observations. It extracts exactly lifetime.polishedOutput and thisRebirth.polishedOutput for this pure helper, then merges those two returned maps into the full candidate. Existing maps are retained on activation, and no duplicate polished event is dispatched. See [the broader field contract](GAMEPLAY_STATISTICS_CONTRACT.md). Earlier future/public-only wording remains a public migration boundary.

# V1-152A1 — Polished-output statistics fields

**GAME15 private activation:** Core Rebirth now owns one atomic reset, retaining lifetime Polished output and zeroing the complete current-Rebirth map. It clears all reserved/resolved work without settlement or restitution and retains permanent Furnace identity/preferences/sequence at Tier 1. [Exact state, hundredths arithmetic and known-absence policy](SAVE_VERSIONING.md#v1-game15--private-core-rebirth-and-stardust). This supersedes historical unimplemented-Rebirth wording only for miner-1, not public V2 or perk purchases.

**GAME09 private-development exception:** The miner-1 profile now activates three canonical Polishers, Tier 1–10, raw/queue reservations, resolution and an atomic processed-inventory plus lifetime/current-Rebirth statistics commit. See [the bounded activation and known-absence policy](SAVE_VERSIONING.md#v1-game09--private-playable-polisher-activation). Earlier pure-only/public-blocked wording below remains the historical/public contract; it does not prohibit this approved private consumer. Active challenges, processed sales, Polisher resale and full public V2 remain unsupported.

**Future technical contract; pure candidates only. Production saveVersion remains 1.**

Authority: [Bible Decision 30 / Reference H](GAME_BIBLE.md#reference-h--statistics-catalogue), [consolidated specification](TEFI_Consolidated_Development_Specification.md), [full-state Polisher commit](POLISHER_FULL_STATE_COMMIT_CONTRACT.md), [V2 state](V2_STATE_CONTRACT.md), [lifecycle](V1_MACHINE_LIFECYCLE_CONTRACT.md) and [save compatibility](SAVE_VERSIONING.md). T1 decisions remain approved. This contract adds no gameplay reward.

## Exact future paths

Repository inspection found no existing canonical `statistics` namespace or `polishedOutput` fields. Reserve these future paths for the statistics owner:

```js
statistics: {
    lifetime: { polishedOutput: OreCountMap },
    thisRebirth: { polishedOutput: OreCountMap }
}
```

`OreCountMap` requires all 20 IDs from `ORE_KEYS`: amber, quartz, topaz, amethyst, malachite, citrine, garnet, peridot, jade, aquamarine, spinel, tourmaline, sapphire, ruby, emerald, onyx, tanzanite, alexandrite, blackOpal, diamond. Stone/materials are excluded. Each count is a finite non-negative integer; no arbitrary safe-integer cap applies. Required fields cannot be coerced, repaired, silently defaulted or omitted on a populated candidate. Each record must be plain data with own enumerable data properties, no accessors, symbols or extra fields.

The pure helper accepts the **statistics value itself**, not `{statistics:...}` or a full save. Its exact projection contains only these two scopes, each containing only `polishedOutput`. Unknown extensions reject. Future broader statistics adapters must extract this projection and merge its result into validated full state while retaining unrelated supported fields; they must not replace the whole future statistics object with a narrow projection. Further statistic names require their own contracts.

## Defaults, resets and compatibility

`createStatistics()` creates independent all-zero maps for a genuinely fresh future statistics model. It is not a migration or missing-data recovery API. Lifetime counts increase by committed output quantity, survive Rebirth/reload and never decrease when stock is sold, consumed or refined. The central Rebirth transaction resets all current-Rebirth Polished-output counts to zero and preserves lifetime counts and unrelated lifetime state. Resale does not reset either scope. This ticket implements no reset transaction.

**Absent-history migration gate remains outstanding.** V1 did not record these counts. Present inventory, Adders, Collection and legacy achievement counters cannot reconstruct lifetime processing history. This contract does not authorise treating unknown history as zero lifetime output. V1-017 and the statistics owner must approve an explicit absent-history baseline/representation policy before migration/activation; no missing populated fields are completed by this helper. Fresh zero defaults are not evidence about legacy history.

`statistics` could already exist as unknown V1 extension data. Under V2 §9, a future approved migration must preserve that original value in `compatibility.legacyV1` before installing a canonical namespace, including archive collision handling; it must never interpret the old unknown value as valid new statistics by name alone. No such adapter is implemented here. Known malformed future statistics reject/recover without clamping or resetting. Existing V1 defaults, validators, migrations and unknown-data preservation are unchanged.

Legacy `achievementStats.totalOresMined` counts manual actions; `oresDiscovered` counts discoveries and `oresSmelted` counts smelts. `totalOres`, tier/Stone counters, Collection, challenge data and compatibility evidence are untouched. No statistics field is written into a production save.

## Pure API and arithmetic

`PolishedOutputStatisticsCandidateModel` exposes `createStatistics()`, `validateStatistics(statistics)`, `validateEvent(event)` and `prepareIncrement(statistics,event)`.

The event is exactly `{type,resourceId,stage,refineCount,amount}` with `type:"polished"`, an existing ore ID, `stage:"polished"`, `refineCount:0`, and finite positive integer quantity. An amount of 25 adds 25 to both selected counters, not one cycle and not 25 mined ores. No input or event is mutated. All returned nested maps are independent; untargeted counts retain their values.

For each scope compute `after = before + amount`. Reject non-finite results and require both `after - before === amount` and `after - amount === before`. No epsilon, truncation, quantity rounding or silent loss. Validate both complete maps before calculation; either failing increment rejects the operation without changing the original.

## Commit provenance and remaining dependencies

This helper validates an input fact, not durable ownership or replay. Repeating it can prepare another increment. A future adapter must validate the resolved cycle/event through E4, compose processed inventory, cycle clearing and these statistics in one independent candidate, then include any applicable challenge consumers and persist/publish once through the single writer. It must not increment at reservation or resolution, infer past events from inventory, or dispatch existing mining/achievement/smelting handlers.

The E5 field-naming gap for Polished-output counters is now specified; its migration and full-state adapter gaps remain. Challenge field mappings and activation remain separate V1-157–159 work. V1-150/152 overall statistics, V1-050C2 durable coordination, V1-041B, V1-074A2 and V1-017/018 remain incomplete.

Next bounded task: compose E4 and this helper into a validated **pure Polisher inventory-and-statistics commit candidate**, preserving the event/provenance and future full-state/challenge limitations. No durable write or activation is implied.
