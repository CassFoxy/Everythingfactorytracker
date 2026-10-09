# V1-016 — V2 state and compatibility contract

**Contract revision:** 1, 2026-10-07. **Production saveVersion: 1.** This is a technical design for a future adjacent migration, not an activated schema or an implementation result.

Follow [AGENTS.md](../AGENTS.md), the synchronized [Game Bible](GAME_BIBLE.md), its [owner handoff](TEFI_Consolidated_Development_Specification.md), and [SAVE_VERSIONING.md](SAVE_VERSIONING.md). References A–L below mean the handoff/Bible references. Gameplay **Defined**, **Recommended**, **Open / DESIGN REQUIRED**, and **Deferred** retain their meanings. Field names and record layouts here are technical choices; they do not settle an Open gameplay rule. The [decision gates](#decision-gates) are part of this contract.

The [V1-070 Independent Machine Lifecycle Contract](V1_MACHINE_LIFECYCLE_CONTRACT.md) binds these existing fields to future purchase/upgrade, reservation/result, resale and Rebirth transactions, maps the implemented pure models, and identifies blocked transitions. It adds no serialized fields or production behavior; this document remains the V2 field authority. V1-070 completion does not resolve the decision gates or activate V2.

## 1. Scope and schema boundary

V2 replaces aggregate machine ownership with individual entities and represents the Defined opening/manual state, Pickaxe copies, materials and processed resources needed by those entities. It retains the accepted validation/default/recovery pipeline. It does not define grid coordinates, conveyors, mutations, offline production, settings, Inscriptions or challenge records. Those systems need their own bounded contracts when implemented; a V2 shape must not be expanded silently after activation.

The source of truth for current V1 remains its implementation and SAVE_VERSIONING.md. In particular, V1-021A now creates $0 / XP 0 / Level 0, derives Level from XP and retains the missing-legacy-XP fallback of 100. This ticket changes none of that.

### Type and default notation

- `Count`: finite non-negative integer. Retain existing large-number compatibility; do not impose a new safe-integer cap on player quantities or XP. Non-finite values and arithmetic overflow are invalid; never clamp/reset them into progress.
- `Cash`: finite non-negative number. Preserve legitimate fractional legacy Cash; payable purchase prices use Reference E rounding, not a new money representation.
- `Sequence`: non-negative **safe** integer, for identity/operation ordering only. Allocation must fail explicitly before overflow; it must never wrap or reuse an ID.
- `Timestamp`: integer Unix milliseconds, 0…8,640,000,000,000,000, as in V1. Future timestamps are not corruption merely because a local clock moved backward.
- Resource IDs are the existing 20 ore IDs plus `stone` only where expressly allowed. Material IDs are exactly `wood`, `scrap`, `metal`. JSON objects/arrays have their stated types; no coercion, explicit null-as-missing, inherited properties or executable data.
- **F** means the fresh-save constructor supplies the value; it is not permission to insert that value into a damaged populated save. **R** means required on a stored V2 candidate. **O** means absence is explicitly defaultable. New structural groups marked R must be synthesized by migration; silently defaulting away an absent machine group would erase ownership.
- Every canonical writer emits the completed form. A default constructor creates independent arrays/maps for each save and entity. Validation precedes optional completion and runtime startup.

## 2. Top-level field ownership

This is a bounded extension of V1, not a whole-player regrouping. Unmentioned established V1 fields retain their current types, defaults and validation. The specific retired aliases listed in section 10 no longer drive V2 gameplay.

| Canonical field | Presence, type and fresh value | Authority / owner / lifetime |
|---|---|---|
| `saveVersion` | R; literal 2 in a future V2 candidate | Persistence discriminator; never default a claimed V2 object to V1 |
| `cash` | R Cash; F 0 | Economy balance; preserve on load, reset to 0 on Rebirth after its payout |
| `gemDust` | R Count; F 0 | Refiner currency balance; persistent through Rebirth/resale, separate from Cash and from future spending/earning statistics |
| `factoryXP` | R Count; F 0 | Authoritative permanent progression; never reset on Rebirth |
| `factoryLevel` | O Count; default derived from XP | Compatibility cache retained from V1; recompute after validation and before serialization, never award/remove XP to reconcile it |
| `inventory` | R raw resource count map; F all existing IDs 0 | Available raw Stone/ore; excluded from any reservation; reset on Rebirth |
| `oreCollection` | Existing V1 optional/default rules | Permanent cumulative ore acquisitions/discoveries; not consumed inventory; no Stone/material entries |
| `factoryMilestones` | Existing Boolean map, subject to catalogue transition gate | Permanent earned flags. Keep existing catalogue until the separately approved 250-threshold migration is implementable; no inferred new claims |
| `achievements`, `achievementStats` | Existing V1 optional/default rules | Retain IDs, unlocked/claimed states, Boolean compatibility and historical counter meanings; no new reward catalogue |
| `totalOres`, `stoneOres`, `tier1Ores`…`tier4Ores`, `lastOre`, `lastOreValue` | Existing V1 optional/default rules | Preserve historical counters/display data; do not reconstruct missing acquisition events from inventory |
| `permanentBonuses`, `cycleBonuses`, `cosmetics` | Existing V1 shapes/defaults retained as compatibility data | Do not reinterpret an old numeric bonus as a new perk level. Existing values and cosmetic IDs survive; alias conflicts/effect adapters are gated below |
| `manual` | R record; section 3 | First-action lifecycle and persistent Pickaxe state |
| `materials` | R `{wood: Count, scrap: Count, metal: Count}`; F zeros | Crafting owner; preserved through Rebirth; not machine investment or ore Collection |
| `shop` | R record; section 3 | Normal Cash upgrades and separate Miner access; reset on Rebirth |
| `processedInventory` | R `{polished: Lot[], refined: Lot[]}`; F empty arrays | Available processed cohorts; reset on Rebirth; no duplicate reservation ownership |
| `identity` | R record; section 4 | Permanent allocation counters; not reset on resale/Rebirth |
| `factory` | R record; sections 5–7 | Access, entity ownership and work state; lifetimes differ per child |
| `compatibility` | R `{legacyV1: object, conversion: null or ConversionReceipt}`; F empty object/null | Non-gameplay evidence and completed migration receipt; permanent, not a second source of balance/ownership |
| Other top-level data | Preserve subject to section 9 | Inert until its own recognized contract exists; never executed or consumed by guesswork |

`FactoryLevel = floor(sqrt(factoryXP / 100))`, total threshold `100L²`, full span `100(2L+1)`. Current capacity, speed, price, Luck, resale total, ownership counts, UI progress, equipped Pickaxe power/Luck/max durability and broken status are derived. Timer handles, DOM state, open modals and scheduler objects are never persisted.

The existing bonus/cosmetic containers are retained to avoid losing supported V1 data. New writers do not introduce legacy machine aliases for new features. Existing unknown compatibility keys, including historical names, are evidence, not canonical machine names.

### Permanent-perk integration boundary

This contract does **not** add an empty Rebirth/challenge subsystem to ship with the machine transition. Until a permanent-perk consumer exists, new-system formulas use their Defined unowned level (0), and deferred Inscription multipliers remain 1. When implemented, actual owned levels/currencies require their own validated, migrated persistence additions. Do not treat archived V1 bonuses as those purchases. This document still specifies how those future Defined effects affect owned tiers, investments, durability and resets; it does not fabricate ownership now. Existing nonzero bonus effects that would otherwise be lost are a compatibility gate, not a reason to force level 0 over them.

## 3. Opening, manual inventory and Shop

### Minimal fresh V2 candidate

Illustration of all new required groups after a future activation gate, **not a file to import into today's game**. Empty raw map and omitted established optional V1 fields are completed from their documented defaults; a canonical writer emits the completed maps. The example owns no purchased machines and asserts no first action has occurred.

```json
{
  "saveVersion": 2,
  "cash": 0,
  "gemDust": 0,
  "factoryXP": 0,
  "factoryLevel": 0,
  "inventory": {},
  "manual": {
    "firstActionCompleted": false,
    "equippedPickaxeId": "pickaxe:default",
    "pickaxes": []
  },
  "materials": { "wood": 0, "scrap": 0, "metal": 0 },
  "shop": {
    "oreValue": 0,
    "miningPower": 0,
    "miningLuck": 0,
    "miningDuplication": 0,
    "minerUnlocked": false
  },
  "processedInventory": { "polished": [], "refined": [] },
  "identity": { "nextEntitySequence": 1, "nextManualEquipSequence": 1 },
  "factory": {
    "minerSlots": [true, false, false, false, false],
    "miners": [],
    "polishers": [],
    "refiner": null,
    "furnace": {
      "id": "furnace:permanent",
      "tier": 1,
      "autoEnabled": true,
      "resourceMode": "oresStone",
      "batchMode": "available",
      "selection": null,
      "queue": [],
      "nextCycleSequence": 1,
      "cycle": null
    }
  },
  "compatibility": { "legacyV1": {}, "conversion": null }
}
```

| Field | Presence / type / F | Rules, ownership and lifecycle |
|---|---|---|
| `manual.firstActionCompleted` | R Boolean; F false | Explicit once-ever manual-action state. The first eligible action and its Stone award commit together, then true forever, including Rebirth. Never infer false from an empty inventory/zero XP |
| `manual.equippedPickaxeId` | R ID; F `pickaxe:default` | Must name Default or a usable owned crafted copy. Preserve through reload/Rebirth; deterministic break fallback per Reference A |
| `manual.pickaxes` | R `PickaxeCopy[]`; F [] | Crafted copies only. Default is unconditionally owned and cannot be deleted, broken or sold. It is represented by the reserved ID, not an Infinity JSON number |
| `shop.oreValue` | R Count; F 0; no approved level cap | Normal upgrade level; reset on Rebirth. Stone effect remains Open; do not infer it from this field |
| `shop.miningPower` | R integer 0…75; F 0 | Reset on Rebirth; not Pickaxe power |
| `shop.miningLuck` | R integer 0…150; F 0 | Manual Luck only; reset on Rebirth |
| `shop.miningDuplication` | R integer 0…100; F 0 | Reset on Rebirth; material awards never duplicate |
| `shop.minerUnlocked` | R Boolean; F false | Separate $100 access purchase, not ownership. Purchasing requires Mining Power I; reset on Rebirth. Migration can explicitly grandfather access for retained legacy Miners without pretending Mining Power was bought |

`PickaxeCopy` has exactly these recognized fields (all R):

| Field | Type / initialization | Validation and lifetime |
|---|---|---|
| `id` | Allocated `pickaxe:<sequence>` | Unique; immutable; retained through repair/Rebirth |
| `tier` | Integer 1…8, chosen crafted recipe | Required; do not infer a copy from a resource stack |
| `remainingDurability` | Count, initialized to current rounded maximum | Between 0 and `floor(500*tier*(1+0.05*DurabilityLevel)/100)*100`; 0 means broken. Preserve actual damage across Rebirth |
| `lastManualEquipOrder` | Sequence; 0 if never manually equipped | On a manual equip, consume `identity.nextManualEquipSequence`; auto-equip never updates it |

Broken status is derived from remaining durability, not independently persisted. Default's power 4, Luck 1 and infinite durability are derived from its reserved identity. The deterministic replacement order is highest usable tier → greatest remaining durability → greatest manual-equip order → lowest numeric ID sequence, then Default. Repairs are broken-only and atomic with recipe consumption; a durability-perk increase changes usable copies by the difference in rounded maxima and leaves broken copies at 0. No new repair or equip rules are added here.

No refundable investment is recorded for Pickaxes, materials, Shop upgrades or access slots. Cash machine resale must not include these costs.

### First-action legacy boundary

- Raw storage absent means genuinely fresh: F false is correct. A recognized earlier explicit first-action Boolean carries forward verbatim.
- A validated positive `achievementStats.totalOresMined` in the known current V1 implementation proves at least one past manual action (the historical name counts clicks). It may establish true; it must not generate resources, XP, achievements or statistics during conversion.
- Zero/missing legacy click statistics, XP, inventory and Collection do not reliably prove the first action never happened. An old save may predate counters or have consumed everything. Whether such saves get the guarantee or are grandfathered past it is **OPEN M1**, not a technical default approved here.
- For an unresolved legacy input, do not write an invented Boolean or fabricate a “first sale” record. Leave original bytes unchanged and keep the owning rollout/migration gated. First sale, Mining Power and Miner unlock are not a reason to add tutorial/completion flags in this contract.

## 4. Deterministic identity

`identity` has R positive safe integers `nextEntitySequence` and `nextManualEquipSequence`, both F 1. One save-local entity sequence covers crafted Pickaxes and purchased Miners/Polishers/Refiner. IDs are ASCII `<kind>:<base10 sequence>` without leading zeros; kinds are `pickaxe`, `miner`, `polisher`, `refiner`. Parse numeric sequences for ordering, never lexicographic string order. IDs need only be unique within the save, not across players.

Default uses `pickaxe:default`; the permanent Furnace uses `furnace:permanent`. These reserved IDs consume no counter. Slots use integer indices, not entity IDs.

A successful purchase/craft allocates the current sequence and increments it in the same candidate snapshot as payment/ingredients and ownership. Failed transactions do not advance it. Resale/Rebirth never rewind it. Validate uniqueness across all collections and that each next counter exceeds all relevant currently recorded IDs/orders. A supplied counter below an existing record is invalid, not repaired. Removing older entities does not permit their IDs to be reused. There is no random or wall-clock ID generation; this policy translates directly to Luau.

Migration uses a private counter, never the live allocator: retained Miners in slot order 1…5, then Polishers 1…3, then Refiner, then recognized compatible crafted Pickaxes in source numeric creation order. Preserve already compatible canonical IDs and both valid next counters from an approved additive manual extension; reserve their sequences first, then allocate new IDs in the stated order starting at the retained next counter (or 1 when none exists), above every retained sequence. Never lower a valid next counter merely because some older copies were removed. Sort compatible source machine records by compatible tier descending, recorded investment descending, oldest recognized source ID ascending before assigning retained slots. Preserve source IDs in the archived source if canonical reidentification is needed. An unrecognized source-ID ordering needs an explicit adapter; do not use object enumeration or randomness. Same source + same approved adapter + same policy revision must yield byte-equivalent ordered candidate data and IDs.

Each entity has R `nextCycleSequence` (positive safe integer, F 1) and `cycle` (R null or Cycle, F null). Allocate operation ID `<entityId>/cycle:<sequence>` and increment on reservation commit, not on every timer tick. Queue entries use the entity's same sequence namespace with `/queue:<sequence>` and have no separate free-running global timer identity. Removing an entity permanently ends all operations bearing its ID.

## 5. Slots and machine ownership

`factory` has these R children:

| Field | Fresh / valid form | Meaning and lifetime |
|---|---|---|
| `minerSlots` | `[true,false,false,false,false]`, exactly five Booleans | Slot 1 must be true. Persistent purchased access survives resale/Rebirth; no machine is implied. Do not impose an undocumented sequential slot-buying gate |
| `miners` | [] of Miner; length 0…5 | Owned entities, one per distinct unlocked `slot`; removed on resale/Rebirth |
| `polishers` | [] of Polisher; length 0…3 | Owned entities, distinct fixed slots 1…3. Slot price is based on identity, never array position or current owned count |
| `refiner` | null or Refiner | Zero or one owned entity; removed on resale/Rebirth |
| `furnace` | Exactly one Furnace record | Permanent identity. Never null, sold, or recreated on Rebirth |

Polisher slots 1…3 and Refiner slot 1 are fixed catalogue identities, not purchasable access balances. No extra Polisher unlock-charge field is invented. Buying a Polisher in slot 3 pays that slot's machine price each time. Losing ownership does not renumber remaining entities. Miner access alone never starts production.

Every owned machine here is an individual simulation object. This contract does **not** equate ownership with a grid tile or invent an unplaced-machine warehouse. The permanent Furnace's logical placement is Defined; its coordinates are not. Grid placement/rotation/occupancy fields and when placement activates production belong to the approved future grid contract. Do not add speculative `placed: true`, coordinates or routing fields now.

### Entity fields

Every record uses the common ID/cycle fields in section 4. A purchase tier is `min(type cap,max(1,PreservationLevel))`, once at creation; reload and later perk purchases never retier an existing entity. Stored tiers are authoritative owned progress, not recalculated from paid investment.

| Kind / field | Presence, type, creation | Resale / Rebirth / migration |
|---|---|---|
| Miner `id`, `slot` | R ID and integer 1…5 | Remove entity on resale/Rebirth, retain access; migration assigns deterministically |
| Miner `tier` | R integer 1…25 | Remove with entity; compatible legacy tiers mapped/clamped by migration only |
| Miner `oreLuckLevel` | R integer 0…50; F/new purchase 0 | Local, removed on resale/Rebirth, not preserved by tier perk; synthesize 0 only where no compatible prior stat exists |
| Miner `investment` | R Investment | Qualifying purchase, tier and local Ore Luck payments only |
| Miner `cycle` | R null or input-free Cycle | Independent duration/roll resolution per entity. No fabricated historic production cycle for a count-only save |
| Polisher `id`, `slot`, `tier` | R ID, integer 1…3, integer 1…10 | Entity removed, slot identity stable; count-only migration creates Tier 1 |
| Polisher `selectedOreId` | R null or existing ore ID; F null | Input selector only, not owned inventory; no Stone |
| Polisher `queue` | R `QueuedInput[]`; F [] | Raw ore removed from available inventory while owned by this queue; resale returns queued/unprocessed input exactly once |
| Polisher `investment`, `cycle` | R Investment / null or Cycle | Resale refunds investment, preserves already-polished output; active unprocessed inputs return once. Rebirth clears inputs without sale payout |
| Refiner `id`, `tier` | R ID, integer 1…10 | Singleton; removed on resale/Rebirth |
| Refiner `selection` | R null or Lot key without `amount`; F null | Selector fields identify a compatible processed cohort, not a reservation. Ore only, polished count 0 or refined count 1…14; metadata rules below; absent selected inventory is allowed |
| Refiner `investment`, `cycle` | R Investment / null or Cycle | Inputs reserved at cycle start. Active-input-on-resale is OPEN R1; this contract does not return/destroy/complete them by assumption |
| Furnace `id`, `tier` | R reserved ID, integer 1…20; F Tier 1 | Keep identity, restore tier by Preservation at Rebirth; no resale investment field |
| Furnace `autoEnabled` | R Boolean; F true (existing preference) | Permission preference, not authority to auto-run Tier 1/2; those require manual activation. Rebirth retains preference |
| Furnace `resourceMode` | R enum `stoneOnly` / `oresOnly` / `oresStone`; F `oresStone` | Existing preference/eligibility filter; not a new processed-resource exclusion rule |
| Furnace `batchMode` | R enum `available` / `full`; F `available` | Preserve existing preference, with new capacity only after modernization consumer exists |
| Furnace `selection` | R null or Lot key without `amount`; F null | Manual stack choice; not consumed until confirmed/reserved. Survives reload as preference; clear unavailable selection on Rebirth |
| Furnace `queue` | R `QueuedInput[]`; F [] | Explicit pending owned inputs if a supported queue action exists. Do not turn an open modal/selection into a reservation |
| Furnace `nextCycleSequence`, `cycle` | R as section 4 | Clear queued/active work on Rebirth, retain next sequence/identity; preserve compatible V1 active batch snapshots |

New-machine queue UI, input selection and timer rules must use the corresponding Defined behavior; these fields do not authorize conveyor mechanics or new batch modes. Selection changes affect future work, not ownership of an already reserved lot. ID, slot, tier, local level, ledger, queue and cycle are validated independently for each entity; no shared mutable defaults.

## 6. Lots, queues and refundable investment

### Lot

All recognized fields are R: `{resourceId, stage, refineCount, amount, polishedValue, preRefinerValue, refineBonus}`.

| Stage | Resource / count | Value metadata |
|---|---|---|
| `raw` | Stone or ore; count 0; positive Count amount | All three value metadata fields null; raw value derived from approved catalogue/effects |
| `polished` | Ore only; count 0; positive Count amount | `polishedValue`: finite non-negative value from the approved Polisher producer; `preRefinerValue:null`, `refineBonus:null` |
| `refined` | Ore only; count 1…15; positive Count amount | `polishedValue:null`; immutable `preRefinerValue` and finite applied `refineBonus` from Reference D; resulting value is derived as basis × (1+bonus), never previous refined value × next bonus |

`preRefinerValue` is first captured from the applicable polished input value on its first pass and is carried unchanged into every later pass. Cohorts with different value-defining metadata are never merged. `refineBonus` records the applicable historical successful-pass result so a reload does not revalue a saved result using a different owned perk level. `polishedValue` preserves a producer's value snapshot; whether an explicit later upgrade reprices an unreserved processed stack, and which perk basis applies to an uncompleted process, must be settled at gate T1. Mere loading never reprices it. This contract does not prematurely capture a pre-Refiner basis before the first pass.

Polished/refined arrays contain only their corresponding stage. Raw available amounts continue in `inventory`; raw lots are used only for queued/reserved inputs. Zero-amount lots are not emitted. Compatible lots may combine by exact resource/stage/count/value metadata, never by rounded display value. No new resource/ore-tier IDs or mutation metadata are accepted automatically.

`QueuedInput` is R `{id, lot}`. `id` is the owning entity's queue ID from section 4; `lot` is a Lot. Moving to a queue decrements available stock in the same candidate snapshot; starting a cycle transfers queue ownership into the cycle without a second decrement. Queue insertion and direct cycle reservation are alternative paths, not two owners of the same items. No Refiner pre-reservation queue is introduced: its selection reserves directly at cycle start, as Defined.

### Investment

R `{entries: Payment[]}`. Each Payment is R `{kind, targetLevel, cashPaid, basis}`:

- `kind`: `purchase`, `tier`, or (Miner only) `oreLuck`.
- `targetLevel`: null for purchase; integer 2…machine cap for tier; integer 1…50 for local Ore Luck. One purchase entry and at most one entry for each paid target level. A migrated retained machine has no above-cap payment entries.
- `cashPaid`: Cash, the actual discounted/rounded debit for normal play. Retain valid recorded legacy amounts; do not reprice old actual payments.
- `basis`: `actual` or `legacyEquivalentV1`. The latter is migration-only, using a frozen approved reconstruction policy and receipt. Runtime purchases cannot choose it.

A purchased entity must contain its purchase entry, including a legitimately zero recorded payment; do not default missing investment to zero. Free/preserved tiers have no payment entry. Tier can exceed paid tier entries because Preservation is free. No slot-access, Unlock Miner, materials, Pickaxe, permanent Stardust, Furnace or deferred Inscription cost enters this ledger.

Refund is derived: `floor(0.5 * sum(entries.cashPaid))`, once, in the transaction that removes the entity. No separate persisted refund amount, total, current catalogue revaluation or retained sold-entity balance. Append a payment only after a successful purchase/upgrade, atomically with Cash and the owned level. A failed or cancelled purchase changes none of them. Recorded investment and counters use finite arithmetic; overflow is an error, never infinite Cash.

Legacy aggregate investment without compatible per-target detail can determine a full-entity refund, but cannot prove the lost above-cap portion. Do not allocate that total across tiers by guesswork; K.2 blocks that partial reconstruction. A receipt retains evidence for removed/compensated entries and the surviving ledger contains only retained investment.

## 7. Persisted cycles and exactly-once resolution

The common record is technical ownership/commit structure, not a generic factory simulator implementation. Runtime callbacks are rebuilt only after migration, validation and completion succeed.

| Cycle field | Presence/type | Authority and validation |
|---|---|---|
| `id` | R entity cycle ID | Unique active operation; sequence below owner's `nextCycleSequence`; identifies exactly one owner |
| `phase` | R `reserved` or `resolved` | No separate processing Boolean can contradict it; null cycle means idle |
| `startedAtMs` | R Timestamp | Original start, retained on reload; never reset to “now” to silently repair data |
| `durationMs` | R finite number >0 | Captured applicable cycle duration, not repeatedly recalculated after reload; preserve V1 batch duration 10,000 ms |
| `inputs` | R Lot[] | Already removed from available inventory/queue; empty only for Miner; enforce each machine's input restrictions |
| `saleUnitValues` | R null, or Cash[] for Furnace | Same order/length as Furnace inputs; exact reserved values, including historical batch values; total must remain finite |
| `result` | R null or CycleResult | Null while reserved; required while resolved. Previously resolved RNG/outcomes cannot reroll on retry |

`CycleResult` is R `{outputs: Lot[], cashDelta: Cash, factoryXPDelta: Count, gemDustDelta: Count, events: Event[]}`. It is an unapplied result, not a second inventory/balance. Zero deltas are explicit for inapplicable awards. An Event is R `{type, resourceId, stage, refineCount, amount}`; fields irrelevant to its type are null, `amount` is a positive Count. Recognized types are `resourceAcquired`, `polished`, `refineAttempt`, `refineSurvived`, `refineDestroyed`, `smelted`; validate source/resource/stage/count against the inputs/results. These facts feed only approved existing statistics/discovery/achievement handlers. Do not serialize arbitrary destination field paths or executable effects. Refiner challenge credit remains gated even when a destruction fact exists.

The result must be reproducible from reserved input and the originating system's approved award calculations/rolls. This record defines **where** an already Defined XP/Cash/Dust award is stored, not a new processor XP rate. Unsupported/unapproved rewards must not be invented just to populate a result. Output events are not new raw acquisitions unless generated by a Miner. Refiner rolls are independently evaluated per input; Dust precedes destruction and persists in the result even for destroyed ore. Enforce Refine 15, stage restrictions, quantity conservation and finite total payout. Validate resolved results before exposing any credits. Do not trust an arbitrary saved cash delta inconsistent with a reserved Furnace payout.

### Transaction protocol for a future implementation

1. **Reserve:** prepare a private next-state snapshot; move available/queued inputs to the named cycle, assign its sequence/start/duration, and persist that complete snapshot. An already reserved input is not available to another machine.
2. **Resolve:** once the approved timing policy says this existing cycle is due, compute its outcome once; persist `phase:resolved` and its result with balances still unchanged. A retry reuses that result. Do not share one machine's rolls/result/cycle object with another.
3. **Commit:** from a resolved cycle, form one snapshot containing all outputs, balances, XP, collection/stat/claim effects and `cycle:null`. Persist the entire snapshot before publishing it as committed runtime state. Event consumers in this transaction must not perform intermediate saves. The result is applied once, never as an additional payout on load.
4. **Schedule:** callback carries entity ID + cycle ID; a stale/duplicate callback whose current cycle differs does nothing. Rebuild one scheduler owner per live entity only after load success; timers/handles never enter JSON. No scheduling while recovery is active.

If writing fails, retain the previous committed snapshot and the prepared candidate for explicit retry, block that operation from spending/crediting again, and report the failure. Never clear the source reservation, publish speculative Cash, reset the save or retry with fresh rolls. This is a **future V2 implementation requirement**, not a claim that current V1 handles all quota/interrupted-write cases. It reuses the proven reservation/payout principles while requiring transaction-boundary integration in V1-018.

Crash boundaries are explicit: before reserve persistence, input is still available in the last save; after reserve, it exists only in the cycle; after resolved persistence, reuse that result; after commit, the cycle is absent and cannot pay again. A crash before a result is persisted may recompute an uncommitted roll; no persisted result may reroll. This does not promise tamper resistance or atomic coordination between competing browser tabs. Certification is for one authoritative runtime writer and whole-save snapshots; stale-writer rollback/cross-tab transactions remain a separate limitation.

### Timing boundary

The existing Auto Furnace restores its original timestamp and may settle its one already-reserved overdue batch. Preserve that behavior and its saved values. Do not simulate missed repeated cycles, backdate newly started work, or generate offline Miner output from elapsed wall time.

For new Miner/Polisher/Refiner work, stored start/duration identify work, but whether downtime advances that single cycle, and how an in-flight upgrade/perk change binds its duration/value/roll parameters, are not fully stated by the handoff. **Gate T1:** approve those lifecycle semantics before activating affected cycles. A timestamp layout is not approval of offline progression. The serialization/ownership/resolved-result machinery can be implemented and tested with controlled clocks before that decision; it cannot silently choose wall-clock catch-up or pause-on-close as gameplay.

## 8. Rebirth, resale and retained state

Use Reference H's central reset matrix, not independently resetting fields from each UI. The following table binds the structures above; it does not implement Rebirth.

| Structure | Rebirth | Resale |
|---|---|---|
| Cash, normal Shop and Miner unlock | Reset; compute Defined Stardust payout from pre-reset Cash first | Debit/credit only the approved machine transaction |
| Raw/processed inventories, queues, active cycles/results | Clear without payout; no resurrected reservation | Miner entity work removed with ownership; exact active-cycle timing boundary T1 applies. Polisher queued/unprocessed inputs return once. Refiner active inputs gated R1. Furnace cannot be sold |
| Miners / local Ore Luck / ledgers | Remove | Remove sold entity and ledger after one refund |
| Polisher / Refiner ownership | Remove; fixed slot identities remain available in catalogue | Remove only sold instance; never renumber other slots |
| Miner slot Booleans | Retain | Retain |
| Furnace identity/preferences/sequence | Retain; clear selection referring to cleared stock | Not sellable |
| Furnace tier | `min(20,max(1,PreservationLevel))` | Not sellable |
| Actual Factory XP / derived Level | Retain | Retain |
| Pickaxes, damage/equip order, materials, first-action flag | Retain; no implicit repair or first-action replay | Unaffected by machine resale |
| Global identity counters, compatibility receipt/evidence | Retain | Retain |
| Achievements/claims, milestone earned flags, Collection | Retain | Retain |
| Lifetime statistics and permanent effects/currencies | Retain | No Stardust/permanent-perk refund |
| `gemDust` | Retain | Retain, including Dust already awarded before an ore's destruction |
| Explicit current-Rebirth event counters | Reset by their eventual owning statistics contract | Refunds separate from qualifying earned Cash |
| Active Daily/Weekly state, once implemented | Retain until scheduled UTC reset | No invented challenge credit; K.1 remains Open |

Do not reinterpret old flat lifetime counters as new cycle counters. Do not add empty challenge/Inscription/rebirth-history placeholders merely to populate this table. Each later persistent subsystem must have a validated additive contract or adjacent migration before it writes data.

## 9. Validation, defaults and unknown data

The future pipeline is read raw bytes → parse → identify version → adjacent migrations → validate V2 → complete only documented O defaults → derive compatibility caches → initialize runtime. Validation is not a repair/rebalance pass.

- Missing R groups/fields, explicit wrong types/nulls, invalid resource IDs, malformed queues/results, duplicate IDs/slots, an entity in a locked Miner slot, impossible current tier/local level or non-finite sums reject the candidate. Never clamp a current V2 tier; clamping is the narrowly defined V1→V2 conversion rule.
- Fresh defaults are not migration reconstruction. Required ledgers, first-action flags, ownership and reservations cannot be fabricated from empty defaults. Fresh constructors and migration constructors are separate entry paths into the same validator.
- Retained V1 optional count-map entries default to zero; Boolean flags/defaults follow their established policy. Factory Level is the explicitly derived cache. A missing V2 Factory XP is not treated as a new legacy fallback: only the V1 compatibility boundary applies the established 100 before conversion.
- Validate equipped references, Pickaxe durability, sequence bounds, cycle-owner prefixes, queue uniqueness and input/result stage compatibility. Validate meaningful conservation within transactions; do not infer historic global production totals to reject legitimate saved inventory.
- Preserve unknown top-level JSON values recursively and safely, including inert keys, under the established copy policy. Never spread them into live prototypes or treat them as capabilities. Known indexed maps still reject unknown resource/milestone IDs. Unknown record properties are retained as inert extension data unless they conflict with a required invariant; unknown type-discriminator values reject rather than pretending to be a known entity/cycle.
- New reserved namespace colliding with an existing unknown V1 field is not overwritten. Preserve it in `compatibility.legacyV1` under its original key before installing the canonical new group. That archive is copied safely and never consumed by gameplay. If the archive itself already exists as unknown source data, nest its original value as a source key; do not merge away collisions.
- Claiming schema 2 with active legacy machine aliases as additional authorities is invalid. Retired V1 data is preserved in the archive, not silently consumed a second time. Future versions are rejected without downgrade.
- Migration/validation failure preserves the **exact original raw LocalStorage value**, blocks normal gameplay/autosave, and uses the existing categorized recovery UI: raw export, retry, explicit-confirmed reset. No automatic compensation, deletion, guessed repair or fresh fallback on rejection. Loading a successful migration also does not immediately rewrite storage; ordinary successful save later persists it.

## 10. Exact adjacent migration responsibilities

Unversioned/V0 → **existing unchanged 0→1 version-tag migration** → future **1→2 structural migration** → V2 validation/default completion. Do not migrate each historical version directly to the latest.

The 1→2 function operates on a deep copy, never live state/storage. It must validate the recognized V1 input contract before interpretation, then apply the existing legacy optional defaults/Boolean achievement completion within that compatibility adapter. This source check is additional protection, not a substitute for final V2 validation. It retains existing Cash/XP; deriving the Level is not compensation.

| Source | Conversion responsibility |
|---|---|
| `droppers` count | Retain ≤5 Tier 1 Miner entities in slot order; enough Miner access flags true free of charges; local Ore Luck 0; unlock access if ownership retained; do not invent paid Mining Power |
| `adders` count | Retain ≤3 Tier 1 Polisher entities in fixed slots 1…3; selected ore null, empty queue, idle when no recognized prior processing record exists |
| `multipliers` count | 0 → null; positive → one Tier 1 Refiner; remaining ownership compensation uses approved policy, never extra entities |
| Compatible individual records, if a documented adapter exists | Rank tier / investment / oldest source ID, retain strongest up to cap, preserve recognized local upgrades and processing metadata; reconstruct before clamping. Current inspected V1 writes counts, not these records. No current unrecognized field is duck-typed as a machine array |
| `furnaceTier` | Current known indices 0/1/2 map to canonical tiers 1/2/3 (Starter/Basic/Auto identities); no charge or refund for this index translation. Other formats need explicit adapter, not `+1` guessing |
| `autoFurnaceEnabled`, `autoFurnaceMode`, `autoFurnaceBatchMode` | Map to canonical Furnace preferences; no reset to fresh mode over an explicit stored value |
| `autoFurnaceBatch`, `autoFurnaceStartTime` | Empty batch → idle. Otherwise convert each known raw input to a reserved Lot, copy exact unit sale values/start time, retain 10,000 ms duration, stable cycle ID and original amounts. Never subtract inventory again or reprice using new Furnace tier. Preserve historical display metadata as inert reservation extras |
| `inventory`, `oreCollection`, achievements, stats, bonuses, cosmetics | Retain supported values, source semantics and compatibility extras; do not equate Collection with currently owned inventory |
| `factoryXP`, `factoryLevel` | Retain completed source XP (including 100 only if V1 XP was absent), derive Level; fresh V2 still starts at 0 |
| New `gemDust` balance | Initialize 0 only for known V1 without a recognized balance; preserve a compatible documented balance if one exists. An unrecognized same-name extension is a collision, not permission to silently replace player currency |
| First-action/Pickaxe/manual additive extension | Carry validated known extension exactly; otherwise synthesize free Default ownership/equipment and zero absent new stats/materials, subject to M1 for unknown first-action history. No free crafted copies or invented historical actions |
| Legacy milestone map | Preserve old earned data. Do not combine the separate 250-threshold change with machine conversion unless owner-approved mapping and both catalogues' tests exist; gate P1 |

Do not infer 10,000 ms for an unknown processing format. V1 source validator already accepts some noncanonical historical batch snapshots; preserve valid reserved values rather than testing them against new dynamic prices or discarding inputs above a newly lower capacity. Such legacy-reserved batches may finish once, then new batches obey V2 capacity. Fixture coverage must include the existing full/mixed/timestamp cases.

Move consumed source machine counters, `furnaceTier`, `autoFurnaceEnabled`, `autoFurnaceMode`, `autoFurnaceBatchMode`, `autoFurnaceBatch`, `autoFurnaceStartTime` and `stoneValue` into `compatibility.legacyV1`; do not write active old-name ownership alongside `factory`. `stoneValue` was an Adder-derived cache, not a new ore balance. Its already reserved value remains authoritative for that historical sale. Cosmetic and bonus legacy keys retained in compatibility containers are not automatically renamed into new effect levels. Unknown top-level fields not colliding with canonical groups remain top-level unchanged; a similar name prefix is not a recognized alias.

### Compensation receipt and idempotence

`ConversionReceipt` fields are all R: `{fromVersion:1, toVersion:2, policyId, entries: CompensationEntry[]}`. `policyId` is the registered immutable identifier of the **owner-approved** reconstruction schedule used by the future migrator; this ticket assigns no missing schedule or price. Each entry is `{sourceKey, reason, cashAmount}`, where `sourceKey` is the stable original record ID or count-source ordinal, `reason` is `overflow`, `aboveCap`, or `unsupported`, and `cashAmount` is the approved finite non-negative amount. Enforce unique source/reason and no overlapping above-cap/full-removal credit. The receipt is evidence; it is never replayed as a credit instruction.

Use actual compatible payment records where available. Otherwise reconstruction uses approved current undiscounted equivalent purchase/tier prices with the global Cash rounding applicable to those purchases and no Discount. Normal play never uses reconstruction. Reconstruct old investment **before** clamping; removed overflow receives 50% full investment, retained above-cap entities receive 50% lost portion and keep only their retained ledger. Unsupported progression follows the Defined 100% recorded-investment/approved-equivalent policy. Exact missing above-cap/slot-equivalent values remain K.2 decisions, not extrapolated price curves. Preserve the Defined compensation fraction as Cash; do not substitute normal-resale rounding for a different migration rule.

Build adjusted Cash, retained entities/ledgers, archived source, receipt and final `saveVersion:2` in one private candidate; validate everything before making it live. If any required compensation amount is unresolved or the sum is invalid, abort conversion without applying even the known partial refunds. Missing path or future version fails safely. Repeated conversion from the same still-V1 source computes the same candidate; after a successful save to V2 the registry does not run 1→2 again. Repeated loading before first autosave does not add to an already adjusted in-memory balance: it always starts from the same unmodified source bytes.

## 11. Incremental development before V2 activation

Production remains schema 1 until the full gate below. Do not write a `saveVersion:2` prototype behind a UI toggle or a schema-1 object whose old known fields secretly contain new shapes.

### Compatible additive manual envelope

A future bounded ticket may register **one** optional schema-1 top-level `manualProgress` envelope: `{revision:1, firstActionCompleted?:Boolean, equippedPickaxeId?:ID, pickaxes?:PickaxeCopy[], materials?:MaterialMap, identity?:Identity}`. Question marks are specification notation, not JSON. Each introduced member uses the same types/semantics above. An owning ticket must add its recognized validation/completion/round-trip tests before writing that member. Unknown properties retain the established inert-data policy. No production envelope is added by V1-016.

The envelope permits additive fields while leaving all existing required V1 fields and resource maps valid. It is a technical feature-revision discriminator, not a new saveVersion or a workaround for incompatible shapes. Revision 1 can introduce its documented optional members incrementally; future incompatible envelope changes require an explicit migration before writes. No reader may treat an unknown envelope revision as fresh/default: reject non-destructively. If an old unknown top-level `manualProgress` value already occupies the name, preserve it and reject the conflicting rollout pending a recognized adapter; never overwrite it. Before V2, this is the sole persisted owner of these new manual values. V2 migration moves them into canonical groups and archives the source, never duplicates authoritative copies.

Conditional requirements: any crafted-copy state requires its equipment reference and both identity counters together; they cannot default to 1 over populated copies/history. Missing copy/equipment members may mean only the unconditionally owned Default before that subsystem has been introduced. Missing material map can mean no implemented material system, not permission to erase an explicit map. An absent first-action field remains legacy-unrecorded and follows M1, never implicitly false. The owning additive ticket must register these conditions before writes; unknown-field preservation alone is not validation support.

Unmodified older clients preserve unknown JSON but do **not** update these new fields while playing; that is not semantic downgrade safety. An additive rollout must therefore document that returning to an older game build is unsupported, and cannot claim cross-version concurrent-tab safety. V1→V2 itself must not depend on such older clients having tracked new events. Current schema-1 recovery still preserves unknown data.

| Ticket / portion | Safe before V2? | Boundary and required dependency |
|---|---|---|
| V1-026 Default Pickaxe/manual access | **Yes, bounded Default-only portion** | Derive unconditional Default ownership/equipment when no crafted-copy system exists; implement accessible manual pool using Defined rules. No copy arrays, first-action history inference, crafting/material awards or V2 needed |
| V1-021B first-ever Stone | **After M1 approval** | Add explicit envelope flag and validate it; distinguish raw-absent fresh from legacy unknown. Commit flag and award together. Do not infer from XP/inventory or hide ambiguous legacy rollout behind a fresh default |
| V1-041 inventory contract | **Design/pure tests yes** | Keep raw schema-1 map as integer counts. Schema-1 optional envelope materials/crafted copies can be added later by an authorized owning ticket; no mutation of `inventory[id]` into objects |
| V1-027 crafted copies/equipment | **Additive path available, consumer first** | Envelope copies, equip reference and identity/material records introduced together with their validators and all save/repair/equip consumers. Persist no Infinity. No inactive unknown array as a substitute for a working consumer |
| V1-028 material generation | **Shape can be additive; awards gated** | Material map schema is Defined; material XP values remain Recommended. Do not adopt recommended XP or invent zero awards to claim full completion |
| V1-023 Starter sale | **Transaction tests/refactoring yes; partial rollout limited** | Retain raw-map reservations and exact existing sale/reload semantics. Any new timed Tier-1 operation needs a registered compatible record/consumer before writing it. Do not reinterpret an existing V1 active Auto Furnace batch under new timing/prices. Full modernization of the known tier table cannot use new indices/shapes in V1 silently; coordinate with V2 consumers |
| Normal Shop additions | **Only after an explicit additive contract** | Pure price/prerequisite logic can be tested. This manual envelope does not authorize undocumented Shop/perk fields; define/validate their owning additive contract or await V2 |
| Instance machines / processed inventory / retired aliases | **No production writes before V2** | Build functions/fixtures and dormant consumers separately, with no live schema-2 writes or partial count-to-entity conversion. Changing known field meanings requires adjacent 1→2 migration |

Before V2, a fresh/manual development ticket must not reset existing machine counts or silently erase old-mode inventory to simplify integration. Technical work that cannot be exposed compatibly stays non-writing until activation; this is not permission to ship an unusable dormant save format.

## 12. Activation gate for V1-018

All conditions must pass together; the roadmap number is not permission to skip dependencies:

1. Canonical structures, required/optional/default rules and enabled subsystem scope are frozen and linked from the Bible; no unresolved gameplay decision is hidden behind a default.
2. All runtime consumers for migrated ownership/data work: manual state, IDs/slots/ledgers, Miners, Polishers, Refiner, processed inventory and permanent modernized Furnace. Every positive legacy ownership count has a functional destination. No “convert now, implement that machine later.”
3. V1-017's adjacent 1→2 conversion exists and all destructive reconstruction/compensation required for supported legacy inputs is approved (K.2); first-action M1 and any retained-effect/cycle gates for those inputs are resolved. Original source formats/record adapters are explicitly recognized.
4. V2 validator, canonical fresh/completion constructors and runtime serialization boundary are implemented. Known maps are strict; safe unknown data and collisions are preserved. Current 0→1 behavior is unchanged.
5. Unversioned/V0/V1/V2 fixtures cover fresh/populated/partial optional data, invalid values, missing R structures, oversized historical batches, old Cash/XP, Boolean achievements, retained claims/Collection/statistics, zero ownership, caps, slot identity and unknown namespaces.
6. Deterministic source IDs/ranking/conversion and retries are verified; reconstruction precedes clamping; compensation never credits twice, and current V2 bypasses migration. Recovery preserves exact source bytes on every rejected path.
7. Active and resolved operations reload correctly, original reservations/timestamps/prices persist, state is isolated by owner, stale callbacks cannot pay, failed writes do not publish credits and no automatic offline catch-up is introduced. Simulate all section-7 commit boundaries.
8. Repeated normal saves/reloads and resale/reset paths preserve approved lifetimes. Any new first-action flag is exactly once; existing legacy policy is explicit. No raw alias remains a second machine/bonus authority.
9. Syntax, established Node regression suite and browser smoke suite pass locally and in CI; add focused new-schema fixtures using the same harness. A branch integration playthrough consumes every schema feature before release.
10. Only then switch the production constant/writer to 2 in the activation ticket. Do not perform that switch in V1-016 or merely to demonstrate migration code.

The technical contract/fixtures may be developed before these gates pass. V1-016 documentation completion is not V1-017 migration readiness, V1-018 activation readiness, or certification of future gameplay.

## Decision gates

| Gate | Unresolved question | What must wait |
|---|---|---|
| K.2 | Approved equivalent schedule/compensation for unsupported legacy tiers, overflow slots and missing investment history | Affected 1→2 compensation and release of complete supported migration. No extrapolation, free reset or partial refund |
| M1 | Treat legacy saves with no reliable manual-action history as pending first guarantee or already past it? | First-action backfill and V1-021B production rollout; fresh false and proven-history true are unambiguous |
| P1 | Map retained legacy Milestone earned/claim data onto new thresholds without losing/re-awarding progress | The 250-threshold change; can remain separate from V2 if old map/catalogue are retained together |
| R1 | Return, finish, discard or otherwise handle active Refiner inputs when selling? | Active Refiner resale; no choice is made here. Inactive resale accounting is Defined |
| T1 | New-machine single-cycle downtime semantics; in-flight tier/perk evaluation and whether explicit upgrades reprice unreserved processed stock | Activation of affected asynchronous/value consumers; preserve existing Auto Furnace behavior and saved results independently |
| B1 | How to map any nonzero legacy bonus/effect or conflicting cosmetic alias that has no equivalent Defined meaning? | Only affected conversion/effect adapters; preserve values, do not silently treat old bonuses as purchased perk levels |
| K.4 | Does Ore Value affect Stone? | Relevant new value calculation/snapshot producer, not the ability to retain a historical sale value |
| K.5 | Does an independent Rebirth Furnace Capacity perk exist? | That perk's state/price/effect. Do not add it or its placeholder fields |
| K.1 / K.3 | Destroyed-ore challenge progress; integer targets and Cash/XP precision | Challenge consumers/records; not the ability to record physical destruction events |

Material XP and Discount-perk price remain **Recommended**. Inscriptions, T5+ ores, Miner tiers above 25, extra Achievement catalogue/rewards and detailed Milestone rewards remain **Deferred**. Slot permanence does not authorize Inscription fields. These gates must be resolved by the owner where gameplay is involved, not by a persistence adapter.

## Contract verification checklist

This document supplies field/type/default/lifetime tables, identity allocation, ownership and investment records, common reservation commit boundaries, exact known-source mappings, incremental schema-1 limits and the activation gate. No prototype JSON here is a production fixture and no future acceptance check is claimed to pass. Review gates explicitly rather than calling a blocked gameplay rule “implemented.” The next bounded implementation candidate is **V1-026, Default Pickaxe/manual-access portion only**; it needs no invented legacy first-action history or V2 activation.
