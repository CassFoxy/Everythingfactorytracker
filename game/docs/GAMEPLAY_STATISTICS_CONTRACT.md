# GAME19 — Private gameplay statistics and accounting

This contract activates only saveVersion 1 / developmentProfile miner-1. It does not certify public V2 migration. Authority: Bible Decision 30 and Reference H, the GAME19 owner-approved observed-history policy, and the existing machine result/commit contracts.

## Ownership and coverage

The exact statistics record contains lifetime, thisRebirth, coverage, bests and rebirthHistory. Each scope retains its established polishedOutput OreCountMap and adds gameplay. The GAME09 pure Polished statistics helper still receives only its exact two-scope projection; its result is merged back without dropping gameplay observations.

Fresh saves initialise independent zero counters. Exact earlier two-scope Polished-only records preserve both maps and receive new zero observations. coverage is {version:1, baselineRebirthCount, startedAtMs, newCounters:"since-game19", polished:"from-start"|"retained-game09", playTime:"policy-gated"}. New counters describe observations since activation, never reconstructed all-time history. Old actual XP, collection, achievement counters, balances and completed Rebirth count retain their original authority. Initialising coverage in memory does not write stored bytes. Unknown, partial or malformed extensions recover with original bytes preserved.

## Counter definitions

All counters have lifetime and current-Rebirth copies. Counts are finite non-negative integer Numbers with reversible-exact additions, without an arbitrary safe-integer cap. Resource maps are complete for their declared IDs; raw maps include Stone and all 20 ores, material maps contain only wood/scrap/metal. Refinement maps have exactly 15 positions indexed by attempted/resulting pass minus one.

- manualClicks counts committed clicks, not quantities. manualBase is remaining base resource after material substitution. manualDuplicates is additional units; manualOutput equals their exact sum. minerOutput is separate. materials counts one actual substitution award.
- refineAttempts/refineSurvived/refineDestroyed are ore/pass Count maps. Attempts equal survivors plus destroyed. gemDustEarned records committed physical Dust, including Dust from destroyed units.
- sales.raw and sales.polished map resource IDs to {amount,cash}; sales.refined maps each ore to 15 such cells. Historical value cohorts remain separate in inventory/results, but aggregate here by ore, stage and Refine Count.
- cashEarned is actual committed Furnace payout. testingCashEarned is its Developer Furnace subset. cashSpent and cashRefunded remain separate. developerCashGranted is explicit testing provenance, excluded from earnings.
- spending has shop, minerSlot, minerPurchase, minerTier, minerLuck, polisherPurchase, polisherTier, refinerPurchase, refinerTier and furnaceTier. refunds has miner/polisher/refiner. cashPurchases, perkPurchases and resales count successful transactions, including one bulk transaction once.
- xpManual, xpMiner and xpFurnace store actual gameplay XP credits after approved effects; they never modify or reconstruct actual permanent factoryXP. Polisher, Refiner, resale and material-specific XP do not gain invented consumers.
- stardustRebirthEarned and stardustPerksSpent are exact source-specific totals. Stardust and Gem Dust balances remain separate gameplay fields.

## Exact currency aggregates

Cash spending across a legitimate Tier 25 history can exceed exact Number sum precision even when each debit is valid. Currency observations therefore use canonical non-negative decimal strings, with no leading zeroes, exponent notation or redundant trailing fractional zeroes. They are accounting totals, not a new spendable currency. Actual Cash/Stardust/payment fields remain unchanged Numbers.

Integer Number facts convert through BigInt to preserve their exact integer value; fractional facts use their canonical JSON decimal spelling. Internal scaled BigInt addition produces exact decimal totals. No BigInt is serialized. Stardust totals permit at most two decimal places. The aggregate representation is bounded to 640 characters; malformed or precision-exhausted facts reject the originating candidate before publication. Currency-source sums must match their totals, and current observations cannot exceed lifetime observations. No Number conversion is used to total accounting currency.

## Commit boundaries

Manual mining records resource, post-substitution base, duplicates, material and actual XP in the same candidate as awards, one click, one durability loss and equipment fallback. Miner resourceAcquired accounting occurs only in output commit. Refiner accounting consumes validated saved events/itemOutcomes only in its Dust/survivor commit. Polished output continues through its existing canonical helper exactly once.

Furnace accounting uses validated reserved input identities, captured unit values and committed payout/XP. Manual, automatic, processed and grandfathered batches share the same adapter. The inherited private Furnace reservation/completion now uses the same candidate writer, preserving its original capacity, historical values and XP; untagged legacy mode is unchanged. Developer earnings are tagged without multiplying sold quantities or XP.

The final transition adapter identifies validated purchase/resale/perk ownership changes and records the actual debit/credit. It never infers historical investment from present levels. Rebirth has a separate branch and never becomes a resale/refund. No event contains an arbitrary destination field path. No accounting runs during preview, reservation or resolution, and UI rendering never grants statistics.

Preparation, accounting validation, full-state serialization and persistence precede publication. Failed writes retain the complete candidate and exact bytes; Retry does not call accounting or physical resolution again. Counter failure rejects the entire gameplay operation. No event replay receipts or per-click event log are introduced.

## Rebirth, history and bests

Rebirth awards enter lifetime Stardust earnings and append {sequence,cashBasis,gainLevel,award,completedAtMs} in the same reset transaction. History retains the latest 100 observed completions; older aggregate totals remain exact. Its retained sequence is contiguous and ends at actual rebirthCount. Prior completed Rebirths have no fabricated entries; coverage.baselineRebirthCount names that boundary. Saved awards are checked against their captured Cash basis and Gain level.

All gameplay current-Rebirth counters reset to independent zero records, alongside the existing complete Polished map reset. Lifetime observations, history and bests persist. Actual XP, Dust, retained inventory/materials/Pickaxes, permanent perks, slots and other permanent assets retain GAME15 rules.

bests contains cash, factoryLevel, minerTier, polisherTier, refinerTier and furnaceTier. These are maxima observed from authoritative states at successful transitions, including testing-funded states, not claims about unknown earlier history. Fresh Furnace begins with observed Tier 1. Sold/reset machines do not erase bests. Collection and achievement history remain their established separate records.

## Explicit gates

No defensible active/idle/hidden-tab time policy is specified; no play time or Rebirth duration is fabricated. Challenge generation, completions, claims, destroyed-ore challenge credit, reward precision and target rounding remain gated. No challenge state, reward callbacks, material XP, Ore Value/Stone change, grid/conveyor metrics, offline simulation or public V2 activation is added.
