# TEFI consolidated development specification

**Everything Factory Incremental**  
**Astra development handoff**  
Compiled 6 October 2026 · Handoff revision 1 · Intended scope V1

## Purpose and document status

This document brings together the original 171 specification questions, the supplied specification sheets, and the owner's subsequent answers in this chat. It provides one current reference for future TEFI development. The 32 question sections retain the original checklist's coverage; the reference sections provide the complete formulas, catalogues, price rules, migration requirements and acceptance checks.

The latest explicit owner decision supersedes earlier conflicting wording. Older alternatives are not active rules. Unchanged proposals were accepted by the owner unless superseded later. Items explicitly described as recommended retain that status; deferred systems do not become implementation requirements merely because a placeholder exists.

**Bible updates remain pending owner approval.** This compilation does not change the repository, game code, tests, Bible or existing saves. It is a development handoff, not evidence that any feature is implemented. Use applicable repository instructions and separately authorized development scope when continuing work.

### Status conventions

- **Defined:** the latest supplied decision or an accepted retained rule.
- **Recommended:** a supplied recommendation awaiting explicit canon approval.
- **Deferred:** intentionally excluded from the current phase.
- **Open:** a remaining definition or interpretation requiring resolution; see Reference K.

The inherited Stardust cost curves and ore catalogue are included so the handoff does not depend on remembering earlier chats. The currently inspected save schema is version 1; the planned new machine schema is version 2. Handoff revision numbers are separate from save, game and Bible versions.

### Units and calculation conventions

- Cash and Stardust are different currencies. Global Cash price rounding does not apply to Stardust costs.
- Cost level L means the level being purchased, starting at 1. An upgrade's effect uses the owned level, starting at 0.
- T is a machine's resulting target tier; k is crafted Pickaxe tier, with Default at k=0.
- Formula probabilities use fractions: 25% = 0.25. Display percentages may be rounded.
- Keep Pickaxe Power and probability weights at full calculation precision. Resource, material and Gem Dust quantities are integers.
- For positive values, round means normal half-up rounding unless an explicit floor or ceil is specified.
- Compute each price independently from its original formula, apply eligible discount, then the specified Cash rounding. Never multiply a previous rounded purchase price.
- V1 maxima: 5 Miners, 3 Polishers, 1 Refiner and 1 permanent placed Furnace; Miner tier 25, Polisher/Refiner tier 10, Furnace tier 20; ore tiers T1–T4.
- The only Stone probability floor is the automated Miner floor of 25%.

## Opening and user interface

Fresh saves start with $0, Factory Level 0, 0 Factory XP and the infinite-durability Default Pickaxe. The first-ever manual mining action guarantees Stone and cannot substitute a crafting material. Subsequent actions use the normal accessible manual pool.

Opening sequence: first Stone → first Starter Furnace sale → Mining Power I → Unlock Miner → buy first Miner → automatic production. Mining Power I is required before the shop unlock, which is separate from buying a Miner. The Starter Furnace is the selling system; no separate direct-sale mechanic is required.

The Furnace, Upgrade Shop, Collection and Statistics are visible from the start. Miner purchase/unlock access appears in the Upgrade Shop with applicable requirements. Achievements are revealed after the first Achievement unlocks; Milestones after the first completed Rebirth. Track milestone progress before reveal. Pickaxes and resources share an inventory screen with appropriate tabs; crafting has its own screen. Raw, Polished and Refined resources use separate tabs.

## 1 Unlock Miner upgrade

- **Exact cash cost:** $100 Cash. This unlock is separate from the $100 purchase of a Tier 1 Miner. Factory Purchase Discount does not reduce the shop unlock fee.

- **Confirm this is the first required Upgrade Shop purchase:** No. The latest opening order is guaranteed first Stone → first Furnace sale → Mining Power I → Unlock Miner → purchase first Miner → automated production.

- **Confirm Mining Power is not required before it:** No. Mining Power I is a required prerequisite for Unlock Miner. Enforce the prerequisite in purchase logic as well as the UI. This supersedes the earlier optional-Mining-Power opening.

## 2 Mining Power

- **Exact effect per level:** +2 raw power units per shop level, equivalent to +0.5 expected resources per manual click. Maximum level is 75.

- **Confirm whether it stays the same effect for all 50 levels:** Yes. The increase is unchanged across all 75 levels. Retained Cash pricing is RawCost(L) = 250 × 1.38^(L−1).

- **Exact Mining Power formula:** TotalMiningPower = 0.25 × (EquippedPickaxePower + 2 × ShopMiningPowerLevel). Award floor(TotalMiningPower), plus one additional base resource with probability equal to its fractional part.

- **Confirm how Shop Mining Power combines with Pickaxe Power:** Add the equipped Pickaxe's full-precision raw power and the shop contribution before multiplying by 0.25. Use one shop Mining Power stat. Mining Duplication is applied afterward to each eligible resource.

## 3 Mining Luck

- **Exact luck increase per level:** +5% of base manual Luck per level; this adds 0.05 to the multiplier, not five percentage points to an ore's drop chance.

- **Exact Shop Mining Luck multiplier formula:** ShopMiningLuck = 1 + 0.05 × Level. Maximum 150 levels gives 8.5×. Raw Cash cost to buy level L = 100 × 1.20^(L−1). The earlier 500-level draft is superseded.

- **Confirm how it combines with Pickaxe Luck:** FinalManualLuck = ShopMiningLuck × EquippedPickaxeLuck. This affects both accessible manual ore-tier selection and within-tier selection. It does not affect automated Miners.

## 4 Pickaxe progression

- **Exact number of Pickaxe tiers:** Eight crafted Pickaxe tiers plus the permanent Default Pickaxe, which is Tier 0.

- **Exact Pickaxe names/order:** Default → Amber → Malachite → Citrine → Aquamarine → Spinel → Emerald → Onyx → Diamond.

- **Exact ore tier unlocked by each Pickaxe:** Default: Stone/T1/T2. Amber: adds T3. Malachite: adds T4. Remaining V1 Pickaxes improve power, Luck and durability without adding a V1 ore tier.

- **Exact crafting recipe for each Pickaxe:** Each crafted Pickaxe requires 32 of its named ore plus its fixed material ingredient. The complete recipes and repair quantities are in Reference A.

- **Confirm whether every Pickaxe requires 32 total ores or 32 of each required ore:** 32 total ores per craft. The adopted recipes each use one named ore, so each requires 32 of that ore.

- **Exact amount of crafting material required:** Amber 8 Wood; Malachite 16 Wood; Citrine 32 Wood; Aquamarine 12 Scrap; Spinel 24 Scrap; Emerald 48 Scrap; Onyx 16 Metal; Diamond 32 Metal. These replace the old 18–48 generic range.

- **Exact source of the separate crafting material:** Manual mining performs one 15% material roll per click, after choosing the resource and base quantity. On success, replace one base resource with one material. Conditional material selection: Wood 60%, Scrap 30%, Metal 10%. Materials cannot be duplicated. The first guaranteed Stone is exempt.

- **Exact Pickaxe Power for each tier:** PickaxePower(k) = 4 × 1.75^k, where k = 0…8. Preserve full precision internally; display may round to two decimals. Reference A lists the exact values.

- **Exact Pickaxe Luck for each tier:** PickaxeLuck(k) = 1 + 2.5k. Default 1×; Amber 3.5×; Malachite 6×; Citrine 8.5×; Aquamarine 11×; Spinel 13.5×; Emerald 16×; Onyx 18.5×; Diamond 21×. It is additive, not repeated ×2.5 scaling.

- **Exact Pickaxe durability for each tier:** Default is infinite. Crafted tier k has base durability 500k. RoundedMax = floor((500k × (1 + 0.05 × DurabilityLevel))/100) × 100. The permanent durability perk has 100 levels. One manual click consumes one hit, regardless of output.

- **What happens when a Pickaxe reaches 0 durability:** The copy remains in inventory, broken with 0 durability. Equip the highest-tier usable owned copy; ties use greatest remaining durability, then most recently manually equipped copy, then oldest inventory ID. Auto-equipping does not update the last-manually-equipped record.

- **Can Pickaxes be repaired:** Only broken Pickaxes can be repaired. Each ingredient costs ceil(OriginalCraftRequirement × 0.95). A repair restores the current upgraded rounded maximum. Partially damaged Pickaxes cannot be repaired.

- **Can multiple Pickaxes be owned:** Yes. Save separate copies with their tier, remaining durability, broken state and equipment history. Only one is equipped.

- **Can old Pickaxes be re-equipped:** Yes, if the owned copy is not broken. Default is the final fallback.

## 5 Manual mining ore availability

- **Exact rule for which ore tiers each Pickaxe can access:** Ore tier r is accessible when r ≤ PickaxeTier + 2; cap at T4 for V1. Set locked weights to 0 before Luck adjustment and normalization.

- **Confirm whether the “Pickaxe 2 tiers before ore tier” rule is final:** Yes. Tier 0 Default reaches T2, crafted Tier 1 reaches T3, and crafted Tier 2 reaches T4.

- **Confirm what the default Pickaxe can mine:** Stone, T1 and T2, except that the first-ever fresh-save click guarantees Stone.

- **Confirm whether Luck can ever bypass Pickaxe ore locks:** No. A locked tier always has zero probability, regardless of Luck.

## 6 Miner V1 maximum tier

- **Exact V1 Miner maximum tier:** Exactly Tier 25 for V1.

- **Current document says approximately 25; needs an exact number:** Tier 25 is a release-specific cap. Tier 26+ belongs to future updates; the architecture must support later expansion.

## 7 Miner base rarity progression

- **Exact Stone/T1/T2/T3/T4 probabilities for every Miner tier:** Use the recovered Miner 1–25 table in Reference B. Those stored balance entries are rounded source values; normalize them into full-precision internal probabilities.

- **Or exact formula used to generate them:** Keep the Stone anchor S exactly. Distribute 1−S among eligible ore columns proportionally, apply the recorded Overall Luck exponents, normalize, then enforce the automated 25% Stone floor. Reference B gives the complete formula.

- **Exact T1 unlock tier:** T1 is available at Miner Tier 1.

- **Exact T2 unlock tier:** T2 is available at Miner Tier 1.

- **Exact T3 unlock tier:** T3 is available at Miner Tier 1.

- **T4 unlock is currently Tier 6 — confirm:** Yes. T4 weight is 0 for Miner Tiers 1–5 and becomes eligible at Tier 6. Overall Luck never bypasses this.

- **Exact tiers where the ×7.5 upgrade-cost milestone occurs:** Tier 6 only in V1. Raw upgrade costs use ×7.5 for that target tier instead of ×4, then return to ×4. Reference B lists the recurrence and full cost table.

## 8 Future Miner ore tiers

- **Rule for introducing T5/T6/etc:** T5+ is deferred. Plan data structures to support ore tiers through at least T10, but do not create their rarity/value/unlock balance before launch. More ores are intended for future updates.

- **How future ore tiers affect Stone/T1/T2/T3/T4 probabilities:** Preserve existing Miner 1–25 balance. New Miner tiers can redistribute the remaining ore budget among old and newly unlocked tiers while Stone remains at least 25%.

- **Whether future ore-tier unlocks always create a ×7.5 cost milestone:** The retained general rule uses ×7.5 on a tier step that introduces a new ore tier, then ×4 afterward. Future unlock tiers and rarity rows remain deferred.

## 9 Stone floor

- **Confirm final Stone minimum is 25%, not 10%:** 25% for automated Miner production only. Manual mining has no artificial Stone floor.

- **Update all tests to use the same Stone floor:** Future tests must use this automated floor consistently, verify normalization, and separately verify that manual probabilities are not clamped to 25%.

## 10 Ore Luck source

- **Confirm whether V1 Ore Luck comes from:** Both permanent Rebirth Ore Luck and cash individual-Miner Ore Luck apply to automated mining. There is no separate cash Upgrade Shop stat named Ore Luck; the shop's Mining Luck affects manual mining.

- **Rebirth progression only,:** RebirthOreLuck = 1 + 0.002 × Level, capped at level 5,000 / 11×. It persists permanently.

- **individual Miner upgrades,:** IndividualMinerOreLuck = 1 + 0.02 × Level, capped at level 50 / 2×. It belongs to one Miner and is removed on resale or Rebirth.

- **or both:** Both automated sources multiply. Manual Shop Mining Luck remains a separate system.

- **If both, exact formula for combining them:** FinalMinerOreLuck = RebirthOreLuck × IndividualMinerOreLuck × InscriptionOreLuck. InscriptionOreLuck remains 1 while Inscriptions are deferred. Owning more Miners does not multiply Luck.

## 11 Miner Ore Luck

- **If individual Miners have their own Ore Luck:** Yes. Each Miner saves and upgrades its own local Ore Luck level independently.

- **How is it upgraded:** Purchase levels on that individual Miner using Cash. The stat starts at level 0 and is not preserved by Machine Tier Preservation.

- **What does it cost:** RawCost(L) = 1,000 × 1.25^(L−1); apply global Cash price rounding. Factory Purchase Discount does not apply. Record the actual payment in that Miner's resale investment.

- **Maximum level:** 50 levels.

- **Effect per level:** +2% local Ore Luck per level: 1 + 0.02L, reaching 2×. It only changes the ore chosen within an already selected tier.

## 12 Miner replacement + Tier Preservation

- **When a Miner is sold and repurchased, does Tier Preservation apply:** Yes. A replacement starts at the applicable preserved tier, while local Ore Luck starts at level 0. Selling removes the old entity; occupied slot access remains available.

- **Does Preservation apply to every machine purchase or only the first purchase after a Rebirth:** Apply Preservation to every newly purchased machine, including replacements. Apply once at creation, not on reload; increasing the perk does not automatically raise existing machines.

## 13 Miner slot purchases

- **Confirm slot prices are final:** Slot 1 free; slot 2 $10,000; slot 3 $1,000,000; slot 4 $10,000,000,000; slot 5 $1,000,000,000,000. Buying a slot makes its Miner purchasable; the Miner purchase is separate.

- **Confirm whether Factory Purchase Discount affects Miner slot prices:** No. Discount covers machine purchases and tiers, not Miner slot unlocks.

- **Confirm whether Miner slots survive Rebirth:** Yes. Purchased slot access persists; owned Miners are removed.

## 14 Polisher purchase behaviour

- **Is the $5,000 price for each of the three Polishers:** No. Slot 1 purchase costs $5,000; slot 2 $100,000; slot 3 $2,000,000, before discount.

- **Or does each additional Polisher have a different purchase price:** Prices are fixed by persistent slot identity. Replacing a Polisher in slot 3 still uses slot 3's price. Slot surcharges do not affect tier upgrades; every Polisher uses the same T2–T10 curve.

- **Confirm whether Polisher ownership survives Rebirth:** No. Rebirth removes Polisher ownership. The slot-specific purchase schedule still applies when rebuilding.

## 15 Refiner purchase cost

- **Exact Refiner unlock price:** $25,000 Cash before applicable Factory Purchase Discount and Cash price rounding.

- **Exact T2–T10 upgrade costs:** T2 $125,000; T3 $1,250,000; T4 $12,500,000; T5 $125,000,000; T6 $1,250,000,000; T7 $12,500,000,000; T8 $125,000,000,000; T9 $1,250,000,000,000; T10 $12,500,000,000,000. These are raw prices.

- **Exact upgrade cost formula:** RawRefinerUpgradeCost(T) = 125,000 × 10^(T−2), for target T2–T10: exactly 2.5× the corresponding Polisher tier upgrade.

- **Confirm whether there are milestone jumps:** No milestone jumps.

## 16 Refiner refined-ore inventory

- **How are Refine 1–15 ores stored:** Maintain ore ID, processing state, Refine Count and value-defining metadata. Refined stacks cannot lose the original pre-Refiner value.

- **Separate inventory stack for every Refine level:** Yes. Distinguish Refine Counts 1–15 and any differing pre-Refiner value cohorts. Raw, Polished and Refined resources have separate inventory tabs.

- **Or one stack with metadata:** Use structured stack records with metadata; do not merge different counts or incompatible values into one undifferentiated quantity.

- **How does the player choose which Refine level to send back through the Refiner:** The player selects ore type and current Refine Count. Polished is count 0; a successful surviving pass returns count n+1. Count 15 cannot enter again. Reserve input when the cycle starts.

- **How does the Furnace choose which Refine level to sell:** Manual selling selects a visible stack. Auto Furnace selects highest final sale value first, using a stable ore-ID/Refine-Count tie break, and reserves input/value for its active batch.

## 17 Refiner value rules

- **Confirm the newer Refine 1–15 formula replaces the older Refiner value section:** Yes. The final Refine 1–15 model in Reference D replaces the earlier compounding and per-pass-current-value model.

- **Confirm Refine 15 is the hard maximum:** Yes. Count 15 is the hard maximum; no further pass is allowed.

- **Confirm refined value always uses the pre-Refiner value rather than compounding:** Yes. RefinedValue(n) = PreRefinerValue × (1 + RefineBonus(n)). The immutable pre-Refiner basis is used for every pass.

## 18 Gem Dust

- **Base Gem Dust awarded on a successful roll:** One base Gem Dust per successful per-ore roll before the Yield multiplier.

- **Can Gem Dust be fractional:** No. Gem Dust is an integer currency. Stardust may separately retain two decimal places.

- **If not, how does +5% Gem Dust Yield handle partial Dust:** For expected Dust y = 1 + 0.05 × YieldLevel, award floor(y) and one additional Dust with probability y−floor(y).

- **Confirm whether probabilistic rounding is used:** Yes. Dust is rolled and awarded before ore destruction; later destruction does not remove gained Dust.

## 19 Machine Inscriptions

- **Which machines can be inscribed:** Deferred for the current phase. No active Inscription purchasing or bonuses are required. All Inscription multipliers are 1.

- **Which stats can be inscribed on Miners:** Deferred planning direction: Ore Luck and output.

- **Which stats can be inscribed on Polishers:** Deferred planning direction: capacity and polished value.

- **Which stats can be inscribed on Refiner:** Deferred planning direction: capacity and Dust yield.

- **Which stats can be inscribed on Furnace:** Deferred planning direction: capacity and sale value.

- **Gem Dust cost per Inscription level:** Deferred; no approved Gem Dust price catalogue.

- **Cost scaling:** Deferred; no approved cost curve.

- **Maximum levels:** Deferred; no approved level limits.

- **Caps:** Deferred. Any future system must respect ore locks, Refine 15, machine counts and established speed/probability caps.

- **Do Inscriptions survive Rebirth:** Deferred ownership plan: permanent slot records would survive Rebirth. Do not implement this merely because the placeholder multiplier exists.

- **Do Inscriptions survive selling a machine:** Deferred ownership plan: slot records would survive resale.

- **Are Inscriptions tied to the individual machine or globally unlocked:** Deferred planning direction: persistent machine slots rather than a global bonus. Exact catalogue/lifecycle remains future work.

## 20 Furnace progression

- **Exact Tier 1–20 capacity progression:** Capacity(T) = 50 × T for T1–T20. T1 50; T5 250; T10 500; T20 1,000. This replaces every previous 25-start, 10+40 and T5=150 draft.

- **Exact sell-value progression per Furnace tier:** FurnaceTierValueMultiplier = 1 + 0.25 × (T−1). T1 1×; T2 1.25×; T5 2×; T10 3.25×; T20 5.75×. Apply Rebirth Furnace Value afterward.

- **Exact Furnace speed progression per tier:** NormalInterval(T) = 10 × 0.1^((T−1)/19), with a 1-second normal minimum. FinalInterval = max(0.5, NormalInterval × (1−0.01 × RebirthSpeedLevel)). Use the exact interpolation formula.

- **Exact Furnace tier upgrade costs:** T1 is the free placed Starter. T2 costs $100; T3 $1,000; T4–T20 raw cost = 1,000 × 4^(T−3). Apply discount and global Cash rounding.

- **Exact cost scaling:** ×10 from the T2 cost to T3, then ×4 per target tier from T4 onward; no milestone jumps. Automation unlocks at T3; T1–T2 require manual activation.

- **Confirm normal Furnace minimum interval is 1 second:** Yes, 1.0 second before the Rebirth speed perk.

- **Confirm Rebirth Furnace Speed can reduce it to 0.5 seconds:** Yes, the 50-level Rebirth speed perk can reduce the final interval to 0.5 seconds.

- **Confirm Furnace cannot be sold:** Yes. The single placed Furnace cannot be sold.

## 21 Factory Purchase Discount

- **Maximum level:** 10 levels.

- **Stardust starting cost:** Latest recommended curve starts at 250,000 Stardust. It supersedes the earlier 1,000-start/×5 draft, but remains marked recommended pending canon approval.

- **Stardust cost formula:** Latest recommended Cost(L) = 250,000 × 2^(L−1). Effect: payable machine price = raw price × (1−0.05 × DiscountLevel), then apply global Cash rounding.

- **Total cost to max:** 255,750,000 Stardust for the latest recommended curve; level 10 costs 128,000,000.

- **Confirm it affects machine purchase prices:** Yes: Miner, Polisher and Refiner purchases.

- **Confirm it affects machine tier upgrades:** Yes: Miner, Polisher, Refiner and Furnace tier upgrades.

- **Confirm whether it affects Miner slots:** No. Also exclude individual Miner Ore Luck, normal shop purchases, Pickaxe crafting/repairs, materials and Rebirth upgrades.

- **Confirm whether it affects Polisher/Refiner unlock prices:** Yes for Polisher/Refiner machine purchase prices. The separate Unlock Miner shop upgrade is excluded.

## 22 Machine Tier Preservation

- **Exact maximum level for V1:** 25 levels for V1, matching Miner Tier 25, which exceeds Furnace 20 and Polisher/Refiner 10.

- **Exact cost multiplier/curve once V1 maximum machine tier is known:** Cost(L) = round(7,500 × 1.484168297348115^(L−1)), L = 1…25. Individual Stardust costs round to the nearest integer.

- **Confirm target total cost:** Target approximately 300,000,000 Stardust; calculated total 299,999,997. Level 25 costs 97,871,643.

- **Confirm Preservation affects Miner, Polisher, Refiner and Furnace:** Yes. StartingTier = min(MachineMaximumTier, max(1, PreservationLevel)). Individual Miner Ore Luck is excluded; no free preserved tier creates refund investment.

- **Confirm whether Furnace tier is preserved even though Furnace itself is never sold:** Yes. At Rebirth restore the permanent placed Furnace to min(20, max(1, PreservationLevel)). Do not sell or recreate the Furnace.

## 23 Rebirth reset rules

- **Cash:** Reset to $0 after awarding Rebirth Stardust from the pre-reset unspent balance. Reset Cash Earned This Rebirth.

- **Normal ores:** Reset all raw ore and Stone inventory.

- **Polished ores:** Reset Polished ore inventory.

- **Refined ores:** Reset Refined ore inventory and active in-process reservations.

- **Pickaxes:** Keep all crafted copies, equipment records, remaining durability and broken state. Do not repair/refill them through Rebirth.

- **Crafting materials:** Keep Wood, Scrap and Metal.

- **Normal Upgrade Shop upgrades:** Reset Ore Value, Mining Power, Mining Luck, Mining Duplication and Unlock Miner. Permanent Stardust durability upgrades are separate and retained.

- **Miner slots:** Keep all purchased Miner slot unlocks.

- **Miners:** Remove owned Miners and their local Ore Luck; repurchased machines use Preservation.

- **Polishers:** Remove owned Polishers.

- **Refiner:** Remove owned Refiner.

- **Furnace tier:** Furnace remains placed; reset tier unless restored by Machine Tier Preservation.

- **Factory XP:** Never reset Factory XP on Rebirth.

- **Factory Level:** Never reset Factory Level on Rebirth.

- **Gem Dust:** Keep Gem Dust.

- **Inscriptions:** Deferred. Active bonuses remain 1; the proposed permanent slot ownership is not an active V1 feature.

- **Achievements:** Keep unlocked/claimed progress and permanent bonuses. Never re-award a previously claimed one-time reward.

- **Milestones:** Keep unlocked progress and permanent rewards; the first-Rebirth reveal remains unlocked.

- **Collection progress:** Keep all discoveries and collection progress.

- **Statistics:** Reset cycle statistics; retain lifetime counters, personal bests and Rebirth history. Resetting a cycle XP-earned statistic does not reset actual Factory XP.

- **Daily Challenge progress:** Keep active Daily objectives, progress, completion/claim state and scheduled deadline.

- **Weekly Challenge progress:** Keep active Weekly state and deadline; this Rebirth counts toward a matching objective.

- **Rebirth perks:** Keep Rebirth count/history, unspent Stardust and purchased permanent perks.

## 24 Factory XP progression

- **Exact XP requirement formula per Factory Level:** TotalXPRequired(L) = 100 × L². Fresh state is Level 0 / 0 XP. Level 1 requires 100 total XP. FactoryLevel = floor(sqrt(TotalXP/100)); next-level span = 100 × (2L+1).

- **Confirm current milestone schedule:** 250 thresholds: first five 10, 25, 50, 75, 100. For indices 6–250, j=index−5 and threshold = round((100 + 9,900 × (j/245)^1.2)/5) × 5. Reference G lists all 250.

- **Confirm whether Factory Level has a maximum:** No hard Factory Level cap. Level 10,000 is the final current milestone, not a maximum attainable level.

- **Confirm whether Factory XP resets on Rebirth:** No. Factory XP and Factory Level permanently survive Rebirth.

## 25 Daily Challenges

- **Exact number of Daily Challenges available at once:** Three active Daily Challenges.

- **Can players reroll a challenge:** No player rerolls in V1. Correct invalid generated state without duplicate rewards; completed challenges are not immediately replaced.

- **Does a completed but unclaimed challenge disappear at reset:** Yes. At the scheduled reset, unclaimed completed or incomplete challenges expire and the entire set is replaced.

- **Does Stone appear in normal Daily ore challenges:** Stone is excluded from standard ore-specific Daily objectives. A Stone-specific type must be explicitly defined if used.

- **Exact minimum/maximum quantity safeguards:** Minimum quantity 1. Standard resource targets use at most 30 minutes of current sustainable production, with a 60% expected-output safety factor. Exclude resources whose expected output in the chosen window is below 5. Manual fallback is 30 clicks/minute. Whole-item/friendly target rounding remains a technical detail to specify.

- **Confirm Daily rewards use Cash Earned This Rebirth:** Yes. Each Daily awards 0.10 × CashEarnedThisRebirth and (0.50/3) × the current full next-level XP span. The advertised 30% Cash/50% XP applies to the full set at a common progression state. Exclude challenge Cash and resale refunds from the qualifying earnings basis. Calculate each reward at claim; do not multiply challenge XP by the XP perk again.

## 26 Weekly Challenges

- **Exact number of Weekly Challenges available at once:** Seven active Weekly Challenges.

- **Is the 150% reward exactly 150% or a minimum of 150%:** The 150% applies to the seven-challenge set. Each challenge awards (1.50/7) of its claim-time Cash basis and full next-level XP span. Claims at different progression states need not sum to 150% of a single historical value.

- **Exact Stardust reward rules:** After at least one completed Rebirth, exactly one generated Weekly objective has extra Stardust: max(100, floor(CurrentEligibleStardust × 0.10)), in addition to its normal Cash/XP share. No Stardust Gain multiplier. First Rebirth mid-week enables this at the next reset only.

- **Maximum Rebirth-count objective:** Maximum 15. Exclude if estimated cycle time exceeds 240 minutes. Otherwise target = clamp(floor(240/EstimatedMinutesPerRebirth),1,15). Prefer the last 3 valid Rebirth durations; without history estimate 1,000,000 / sustainable non-Challenge Cash per minute. If no reliable rate exists, exclude.

- **Can weekly challenges require Refined ores as well as Polished ores:** Yes. Refined objectives accept any successful surviving pass, resulting count ≥1; exact Refine Counts are not required in V1. Account for Refiner throughput and destruction, then apply the 60% safety factor. One ore surviving several passes can award several progress events.

## 27 Challenge reset timezone

- **Confirm resets use fixed GMT/UTC year-round:** Fixed UTC/GMT year-round: Daily 00:01; Weekly Friday 17:00.

- **Or UK local time including BST:** No BST adjustment. In Europe/London during BST these are Daily 01:01 and Weekly Friday 18:00.

## 28 Achievements

- **Final V1 Achievement list:** Detailed additional V1 entries are deferred. Retain the existing six-entry structure and IDs while awaiting a final catalogue. The requested direction is varied difficulty, approximately 20+ entries per category, with both click-count and resource-count objectives.

- **Exact rewards:** Deferred. Future rewards should match activity and difficulty; for example, a major manual-click achievement can improve resource quantity. Placeholder reward values are not finalized zero rewards.

- **Confirm whether rewards survive Rebirth:** Permanent progress and permanent reward effects persist. One-time cash/XP rewards are claimed once and follow the relevant currency rules afterward.

- **Confirm when the Achievements button becomes visible:** Hidden until the first Achievement unlocks; remains visible thereafter.

## 29 Milestones

- **Final V1 Milestone list:** 250 Factory Level entries using the final spacing formula in section 24 and Reference G. Rewards do not change the threshold schedule.

- **Exact rewards:** Deferred. Desired reward types include cosmetics and substantial permanent factory/value/Stardust/Dust/mining-power boosts. Do not invent or balance those rewards in the current phase.

- **Confirm whether Milestones are permanent:** Yes. Keep earned flags and future permanent effects; do not grant again when revisiting a level.

- **Confirm first Rebirth reveals the system:** Yes. Track qualifying milestone progress before reveal; show the system after the first completed Rebirth.

## 30 Statistics

- **Exact V1 statistics to track:** Use the accepted catalogue in Reference H: cash earnings/spending/refunds, clicks, manual and Miner outputs, normal/Polished/Refined activity, refine attempts/survivors/losses, XP, Dust, Stardust, Rebirths/history, challenges, discoveries, bests and play time.

- **Which statistics reset each Rebirth:** Reset ThisRebirth counters such as earnings/spending/refunds, clicks/outputs, processing/sales, cycle XP earned, cycle Dust earned and cycle time. Keep current objective progress independently.

- **Which statistics are lifetime:** Keep lifetime equivalents, total Stardust earned/spent, completed Rebirths/history, best Cash/Factory Level/machine tiers, collection, challenge completions and lifetime play time.

- **Confirm separate stats for normal, polished and refined ores:** Yes. Distinguish base acquisitions, polished outputs and successful refined passes; materials have separate counters and are not ores. Track clicks separately from awarded quantities.

## 31 Save migration

- **Confirm old Dropper data migrates to Miner:** Yes. Convert each legacy Dropper to an independent Miner, up to 5. Count-only records create Tier 1 Miners in fixed slot order. Migration unlocks enough slots for retained Miners without charging Cash.

- **Confirm old Adder data migrates to Polisher:** Yes. Convert Adders to Polishers, up to 3; assign persistent slots 1–3. Count-only records start at Tier 1.

- **Confirm old Multiplier data migrates to Refiner:** Yes. Any positive valid Multiplier ownership converts to one Refiner. Zero ownership does not create a free Refiner. Compensate overflow separately.

- **Confirm all new saves use only the new names:** Yes. V2 writes canonical new structures/names. Loader accepts legacy names via migration; original bytes remain recoverable if parsing, migration or validation fails.

- **Confirm save version number/migration strategy:** Existing unversioned schema is 0; inspected accepted schema is 1. New instance structures use 2. Load sequentially 0→1→2, validate before normal play, and do not reapply V2 migration on reload. Reference I gives conversion, compensation and open reconstruction details.

## 32 Outdated specification cleanup

- **Remove the old “Mining Power I first upgrade” wording:** Replace with Mining Power I as the first required upgrade; Unlock Miner follows it.

- **Remove the old 10% Stone-floor references:** Replace automated references/tests with 25%. State explicitly that manual mining has no Stone floor.

- **Remove the old Refiner value formula:** Keep only the final pre-Refiner-value Refine 1–15 model.

- **Remove the old “Ore Luck = machine-specific only” wording if Rebirth Ore Luck is final:** Use permanent Rebirth Ore Luck and local cash Miner Ore Luck for automated mining. Manual Mining Luck is a separate Cash Shop stat.

- **Remove the old rule saying no Rebirth perk should exceed 400M total cost, since Factory XP Gain and Stardust Gain now exceed that amount:** Remove the universal 400M maximum-cost policy. Factory XP Gain is 1,000,100,000 Stardust; Stardust Gain is 506,317,500. Keep per-perk curves and any specific target instead.

## Reference A Pickaxe catalogue and manual mining

### Complete recipes and stats

Power values below are the exact stored mathematical values; the UI may show two decimals. Base durability excludes the permanent durability perk. Repair materials are calculated with ceil(recipe × 0.95); every repair also requires 31 of the named ore. Repairs are available only when broken.

| k | Pickaxe | Craft ore | Craft material | Exact raw power | Luck | Base hits | Repair material | Highest V1 ore tier |
|---:|---|---|---|---:|---:|---:|---|---|
| 0 | Default | Free | None | 4 | 1× | Infinite | N/A | T2 |
| 1 | Amber | 32 Amber | 8 Wood | 7 | 3.5× | 500 | 8 Wood | T3 |
| 2 | Malachite | 32 Malachite | 16 Wood | 12.25 | 6× | 1000 | 16 Wood | T4 |
| 3 | Citrine | 32 Citrine | 32 Wood | 21.4375 | 8.5× | 1500 | 31 Wood | T4 |
| 4 | Aquamarine | 32 Aquamarine | 12 Scrap | 37.515625 | 11× | 2000 | 12 Scrap | T4 |
| 5 | Spinel | 32 Spinel | 24 Scrap | 65.65234375 | 13.5× | 2500 | 23 Scrap | T4 |
| 6 | Emerald | 32 Emerald | 48 Scrap | 114.8916015625 | 16× | 3000 | 46 Scrap | T4 |
| 7 | Onyx | 32 Onyx | 16 Metal | 201.060302734375 | 18.5× | 3500 | 16 Metal | T4 |
| 8 | Diamond | 32 Diamond | 32 Metal | 351.85552978515625 | 21× | 4000 | 31 Metal | T4 |

### Permanent durability upgrade

Defined maximum 100 levels, effect +5% of base maximum per level, for a maximum 6× base durability before rounding. StardustCost(L) = round(1,000 × 1.10^(L−1)); total 137,796,124 Stardust.

RawMax = BaseDurability × (1 + 0.05 × DurabilityLevel).  
RoundedMax = floor(RawMax/100) × 100.

RoundedMax is the actual usable maximum. Some early levels have no immediate effect on weaker Pickaxes: Amber's maximum remains 500 at perk levels 1–3 and becomes 600 at level 4.

When a usable copy's maximum increases, add NewRoundedMax−OldRoundedMax to its remaining durability. This preserves damage already taken. A broken copy remains at 0, regardless of the maximum increase. Repair restores its current RoundedMax. Rebirth keeps the perk and all remaining/broken states.

### Material generation and awards

A click rolls one base resource type, then calculates the integer base quantity by probabilistic rounding of TotalMiningPower. Perform one 15% material substitution roll for the click; on success replace exactly one base resource with one material. Conditional material probabilities are Wood 60%, Scrap 30%, Metal 10%, giving overall per-click chances 9%, 4.5% and 1.5%.

After substitution, independently duplicate each remaining mineable resource at the Mining Duplication chance. Do not duplicate materials. One click consumes one durability regardless of ore amount, duplicated copies or material substitution.

Latest recommended material XP before applicable normal gameplay XP modifiers: Wood 5, Scrap 15, Metal 50 per material. These numbers retain their recommended status pending canon approval. Materials count toward Total Resources Gathered and their own counters, not ore-specific counters.

### Manual tier and ore selection

FinalManualLuck = (1 + 0.05 × ShopMiningLuckLevel) × (1 + 2.5k).

Max Shop Mining Luck = 8.5×; Diamond gives 21×, so maximum from these two sources is 178.5×. Mining Luck resets on Rebirth; the crafted Pickaxe remains.

Base manual weights:

| Bucket | Base weight | Manual Luck exponent |
|---|---:|---:|
| Stone | 239,744 | 0.00 |
| T1 | 10,000 | 0.35 |
| T2 | 250 | 0.70 |
| T3 | 5 | 1.05 |
| T4 | 1 | 1.40 |

Set inaccessible bucket weights to 0. Adjust each available weight by FinalManualLuck^exponent, then divide by the sum of available adjusted weights. Do not clamp manual Stone chance.

When all tiers are accessible at 1× Luck, probabilities are Stone 95.8976%, T1 4%, T2 0.1%, T3 0.002%, T4 0.0004%. When tiers are locked, normalization changes the available probabilities.

After choosing a non-Stone tier, lock that tier. Its five ores use BaseOreWeight(i)=0.65^(i−1), with Luck exponent 0.1×(i−1), i=1…5 ordered from cheapest to most expensive. Multiply by FinalManualLuck^exponent, then normalize within that tier. Rebirth Ore Luck and local Miner Ore Luck are not used in manual mining.

Order: select Pickaxe-accessible pool → calculate manual Luck → roll tier → roll ore within the locked tier → resolve Mining Power quantity → perform one material substitution roll → duplicate remaining resources independently → award output and statistics.

## Reference B Miner rarity costs and production

### Stored base balance

The following source table is the accepted recovered balance direction. Treat its Stone column as an anchor and its ore columns as relative weights to resolve small rounding discrepancies. These are not UI-rounded values to use as independent percentages without normalization.

| Miner | Stone | T1 | T2 | T3 | T4 |
|---:|---:|---:|---:|---:|---:|
| 1 | 95.898% | 4.000% | 0.100% | 0.002% | — |
| 2 | 95.086% | 4.726% | 0.185% | 0.003% | — |
| 3 | 93.439% | 6.177% | 0.378% | 0.006% | — |
| 4 | 91.203% | 8.018% | 0.768% | 0.011% | — |
| 5 | 88.480% | 10.000% | 1.500% | 0.020% | — |
| **6** | 85.344% | 12.722% | 1.908% | 0.025% | **0.0004%** |
| 7 | 81.861% | 15.134% | 2.754% | 0.250% | 0.0011% |
| 8 | 78.096% | 17.538% | 3.799% | 0.565% | 0.0021% |
| 9 | 74.119% | 19.851% | 5.048% | 0.979% | 0.0034% |
| **10** | **70.000%** | **22.000%** | **6.500%** | **1.495%** | **0.0050%** |
| 11 | 65.813% | 22.097% | 8.375% | 3.704% | 0.011% |
| 12 | 61.631% | 21.463% | 10.485% | 6.402% | 0.019% |
| 13 | 57.521% | 20.068% | 12.810% | 9.573% | 0.028% |
| 14 | 53.542% | 17.907% | 15.325% | 13.188% | 0.039% |
| **15** | **49.744%** | **15.000%** | **18.000%** | **17.206%** | **0.050%** |
| 16 | 46.165% | 14.167% | 19.364% | 20.179% | 0.125% |
| 17 | 42.830% | 13.026% | 20.650% | 23.285% | 0.208% |
| 18 | 39.754% | 11.600% | 21.853% | 26.494% | 0.299% |
| 19 | 36.939% | 9.915% | 22.969% | 29.780% | 0.397% |
| **20** | **34.383%** | **8.000%** | **24.000%** | **33.117%** | **0.500%** |
| 21 | 32.075% | 7.169% | 23.498% | 36.482% | 0.776% |
| 22 | **30.000%** | 6.241% | 22.829% | 39.864% | 1.067% |
| 23 | **28.141%** | 5.229% | 22.011% | 43.251% | 1.369% |
| 24 | **26.481%** | 4.145% | 21.062% | 46.631% | 1.680% |
| **25** | **25.000%** | **3.000%** | **20.000%** | **50.000%** | **2.000%** |

### Exact normalization procedure

For the selected Miner tier:

1. Set S = stored Stone percentage / 100.
2. Let v(r) be the listed ore-column value; locked tiers have v=0.
3. BaseOreProbability(r) = (1−S) × v(r) / sum(v).
4. AdjustedStoneWeight = S.
5. AdjustedTierWeight(r) = BaseOreProbability(r) × OverallLuck^e(r).
6. Use e(T1)=0.20, e(T2)=0.40, e(T3)=0.60, e(T4)=0.80.
7. Normalize all weights into probabilities.
8. If Stone would be below 0.25, assign Stone=0.25 and distribute 0.75 among eligible ore tiers proportionally to their adjusted weights.

T4 must remain zero before Miner Tier 6, before and after normalization. Internal probabilities sum to 1. The UI alone may adjust its largest displayed percentage by a rounding remainder so displayed values total 100%; do not change RNG probabilities to fix presentation.

### Automated within tier selection

First choose Stone/T1/T2/T3/T4 with Overall Luck. On a non-Stone outcome, lock the tier.

FinalMinerOreLuck = (1 + 0.002 × RebirthOreLuckLevel) × (1 + 0.02 × LocalMinerOreLuckLevel) × 1.

The final factor is the deferred Inscription placeholder. For the five ores within the chosen tier:

AdjustedOreWeight(i) = 0.65^(i−1) × FinalMinerOreLuck^(0.1×(i−1)).  
ConditionalProbability(i) = AdjustedOreWeight(i) / sum(AdjustedOreWeights).

The base conditional distribution is approximately 39.59% / 25.74% / 16.73% / 10.87% / 7.07%. Each Miner rolls independently; ownership count never acts as a Luck multiplier.

### Cash and speed

Purchase raw price = $100. Raw upgrade into T2 = $400. For each subsequent target tier, multiply the previous unrounded raw upgrade cost by ×4, except target T6 uses ×7.5. Return to ×4 at T7. No other V1 ore-tier milestone exists.

CalculatedTierInterval = max(0.1, 5 × 0.96^(Tier−1)).  
FinalMinerInterval = max(0.1, CalculatedTierInterval × (1−0.01 × RebirthMinerSpeedLevel)).

One normal cycle produces one base resource, subject to future duplication only when the normal tier speed curve has reached its floor. The +1% duplication per subsequent tier, guaranteed copies per whole 100%, and fractional extra-copy roll are retained future architecture; they do not activate within V1's 25 tiers. Rebirth speed does not move that tier-based breakpoint.

Cash investment records include actual purchase, paid tier upgrades and local Ore Luck payments. Resale requires confirmation and refunds floor(0.50 × ActualQualifyingCashInvestment). Free preserved tiers and permanent Stardust upgrades do not create refund investment.


### Miner raw purchase and upgrade table

Normal seconds exclude Rebirth speed. Cash prices are before discount/global rounding. Tier 1 is a purchase; later rows are the cost to upgrade into that target tier.

| Tier | Raw Cash price | Normal seconds |
|---:|---:|---:|
| 1 | $100 | 5.0000 |
| 2 | $400 | 4.8000 |
| 3 | $1,600 | 4.6080 |
| 4 | $6,400 | 4.4237 |
| 5 | $25,600 | 4.2467 |
| 6 | $192,000 | 4.0769 |
| 7 | $768,000 | 3.9138 |
| 8 | $3,072,000 | 3.7572 |
| 9 | $12,288,000 | 3.6069 |
| 10 | $49,152,000 | 3.4627 |
| 11 | $196,608,000 | 3.3242 |
| 12 | $786,432,000 | 3.1912 |
| 13 | $3,145,728,000 | 3.0635 |
| 14 | $12,582,912,000 | 2.9410 |
| 15 | $50,331,648,000 | 2.8234 |
| 16 | $201,326,592,000 | 2.7104 |
| 17 | $805,306,368,000 | 2.6020 |
| 18 | $3,221,225,472,000 | 2.4979 |
| 19 | $12,884,901,888,000 | 2.3980 |
| 20 | $51,539,607,552,000 | 2.3021 |
| 21 | $206,158,430,208,000 | 2.2100 |
| 22 | $824,633,720,832,000 | 2.1216 |
| 23 | $3,298,534,883,328,000 | 2.0367 |
| 24 | $13,194,139,533,312,000 | 1.9553 |
| 25 | $52,776,558,133,248,000 | 1.8771 |

## Reference C Polisher behavior

Three independent slot-based Polishers, each tier 1–10, with separate selected ore, queue, cycle and investment. Only unpolished ores are valid inputs; Stone is invalid. Polished ores cannot be polished again. Multiple Polishers increase throughput, never repeatedly multiply one ore's polished value.

PolishedValue = CurrentOreValue × 1.50 × (1 + 0.0001 × RebirthPolisherValueLevel).

Apply the normal Ore Value modifier before polishing. Normal and Polished inventories remain separate.

CycleTime(T) = 7.5 × 0.799413^(T−1).  
BatchSize(T) = round(1.668101^(T−1)).  
ProcessedAmount = min(BatchSize, available selected unpolished quantity).

Tier 1 is approximately 7.5 seconds / 1 ore; tier 10 approximately 1 second / 100 ores. These inherited interpolation constants are rounded source coefficients; the intended endpoint is T10 at 1 second / 100. A partial batch is allowed; no input means Idle.

RawUpgradeCost(T) = 5,000 × 10^(T−1), for T2–T10. Slot purchase cost is separate: $5,000 / $100,000 / $2,000,000. Apply eligible discount then Cash rounding. Selling removes only that entity, refunds 50% of actual qualifying Cash paid rounded down, and returns queued/unprocessed input once. Already-polished output stays in inventory.

## Reference D Refiner behavior and value

Maximum one Refiner, tier 1–10. Input is Polished or previously Refined ore only. Stone and raw unpolished ore are invalid.

Interval(T) = 15 × 0.2^((T−1)/9).  
Batch(T) = round(1 + 9 × ((T−1)/9)^1.2).  
TierBaseDustChance(T) = 0.02 + (0.08/9) × (T−1).

Thus T1 is 15 seconds / 1 ore / 2% base Dust; T10 is 3 seconds / 10 ores / 10% base Dust.

Let input count be c and the attempted resulting pass number n=c+1. Reject c=15.  
EffectiveBaseDustChance = min(0.25, TierBaseDustChance + 0.005 × RebirthDustChanceLevel).  
FinalDustChance = min(0.95, EffectiveBaseDustChance × 1.25^c).  
BaseDestroyChance = min(0.95, 0.15 × n).  
FinalDestroyChance = clamp(BaseDestroyChance−0.005 × StabilityLevel, 0.05, 0.95).

Roll Dust and award it first; then roll destruction. A destroyed input is removed permanently. A surviving input gains the new count and resulting value, then returns to Refined inventory. Dust remains even if the ore is destroyed. Overall Luck and Ore Luck have no effect on Refiner Dust or destruction.

The owner's principal challenge rule is that each successful surviving pass counts, including repeated passes on the same ore. A final sentence allowing possible progress on a destroyed ore remains under review in Reference K; the clarified survivor-only wording has not been separately ratified.

### Noncompounding value

Store the immutable original PreRefinerValue on the first pass. It includes applicable Polisher value.

StartingRefineBonus = 0.50 + 0.0014 × RebirthRefinerValueLevel.

For n=1…5: RefineBonus(n) = StartingRefineBonus × (5−n)/4.  
For n=6…15: RefineBonus(n) = −0.09 × (n−5).  
RefinedValue(n) = PreRefinerValue × (1 + RefineBonus(n)).

Without the value perk, Refines 1–5 give +50%, +37.5%, +25%, +12.5%, 0%. At perk level 5,000 they give +750%, +562.5%, +375%, +187.5%, 0%. Negative stages remain −9%, −18%, …, −90% regardless of that perk.

Never multiply the previous refined value by the next pass's bonus. Preserve pre-Refiner value metadata when stacking cohorts.

### Gem Dust quantities

Base successful roll awards 1 Dust. ExpectedYield = 1 + 0.05 × GemDustYieldLevel. Award floor(ExpectedYield), with one extra at probability equal to its fractional part. Keep Gem Dust integer and persistent across Rebirth.

Refiner resale refunds 50% of qualifying actual Cash investment, rounded down. Permanent Rebirth perks and future Inscriptions are not refunded.

## Reference E Cash price rounding and Furnace table

### Global Cash pricing

Calculate the original raw formula for the target purchase. Apply Factory Purchase Discount only if eligible, using factor 1−0.05×level. Then choose the rounding band from the resulting discounted amount and round half-up:

| Discounted amount | Rounding step |
|---|---:|
| Below $1,000 | $1 |
| $1,000 to below $1,000,000 | $10 |
| $1,000,000 to below $1,000,000,000 | $1,000 |
| $1,000,000,000 and above | $1,000,000 |

ActualPaid = step × floor(DiscountedRaw/step + 0.5).

Local Miner Ore Luck follows these Cash rounding bands but receives no Factory Purchase Discount. Do not use its old floor formula as the payable price. Resale uses actual payments, not a recomputed theoretical price. Stardust perks use their own integer rounding rules.

### Furnace

Capacity(T)=50T. TierValue(T)=1+0.25(T−1). NormalInterval(T)=max(1,10×0.1^((T−1)/19)). FinalInterval=max(0.5,NormalInterval×(1−0.01×RebirthFurnaceSpeedLevel)).

FinalSaleValue = current resource's applicable raw/Polished/Refined value × TierValue × RebirthFurnaceValueMultiplier. The resource value includes the applicable Ore Value modifier; do not apply a modifier twice. Future Achievement/Milestone effects remain deferred until their exact stacking order is defined.

The table lists raw prices before discount/rounding and interval display approximations. T1 is free and placed permanently.

| Tier | Capacity | Tier value | Normal seconds | Raw upgrade Cash |
|---:|---:|---:|---:|---:|
| 1 | 50 | 1.00× | 10.0000 | Free starter |
| 2 | 100 | 1.25× | 8.8587 | $100 |
| 3 | 150 | 1.50× | 7.8476 | $1,000 |
| 4 | 200 | 1.75× | 6.9519 | $4,000 |
| 5 | 250 | 2.00× | 6.1585 | $16,000 |
| 6 | 300 | 2.25× | 5.4556 | $64,000 |
| 7 | 350 | 2.50× | 4.8329 | $256,000 |
| 8 | 400 | 2.75× | 4.2813 | $1,024,000 |
| 9 | 450 | 3.00× | 3.7927 | $4,096,000 |
| 10 | 500 | 3.25× | 3.3598 | $16,384,000 |
| 11 | 550 | 3.50× | 2.9764 | $65,536,000 |
| 12 | 600 | 3.75× | 2.6367 | $262,144,000 |
| 13 | 650 | 4.00× | 2.3357 | $1,048,576,000 |
| 14 | 700 | 4.25× | 2.0691 | $4,194,304,000 |
| 15 | 750 | 4.50× | 1.8330 | $16,777,216,000 |
| 16 | 800 | 4.75× | 1.6238 | $67,108,864,000 |
| 17 | 850 | 5.00× | 1.4384 | $268,435,456,000 |
| 18 | 900 | 5.25× | 1.2743 | $1,073,741,824,000 |
| 19 | 950 | 5.50× | 1.1288 | $4,294,967,296,000 |
| 20 | 1000 | 5.75× | 1.0000 | $17,179,869,184,000 |

T1–T2 require manual activation. T3+ automatically processes valid queued resources when available. Capacity limits each processing cycle. Auto selection uses highest final sale value first and a stable tie break. Persist active reservations and cycle state so reload does not duplicate inputs or payouts.

## Reference F Factory XP and challenges

### Factory XP and earnings

Factory XP is permanent. Total threshold for L is 100L²; L=0 begins at 0 XP. Derive Level from total XP. Full next-level span is 100(2L+1), not the remaining XP to its threshold.

The normal gameplay XP perk multiplies base gameplay XP by 1+0.0004×level, capped at 5×. Do not multiply the percentage-based challenge XP reward again. Excess challenge XP carries through level-ups.

CashEarnedThisRebirth records qualifying earned Cash and survives spending but resets on Rebirth. Exclude challenge payouts and resale refunds from the challenge-reward basis. Current unspent Cash, not this earnings statistic, is the actual Rebirth payout basis.

### Generation and progress

Generate 3 Daily and 7 Weekly objectives at fixed reset boundaries. Requirements are fixed at generation; reward values remain dynamic until claim. Identical objectives, including the same ore/state/action with different target quantities, cannot appear twice within one set. Different resources or genuinely different actions can share a system.

Use only current owned machines, upgrades and accessible systems, never assumed future purchases. All unlocked low-tier ores remain in the eligible pool. Standard Daily ore objectives exclude Stone. Polished/Refined objectives require the corresponding ore access and processing capability.

Use current sustainable automatic output for standard objectives. Daily effort is 10–30 minutes, with a maximum 30-minute resource target. Weekly individual resource targets must be achievable in approximately four hours or less. Explicit manual objectives and fallback for players without automation use 1 click every 2 seconds (30/minute), adjusted for current Pickaxe, Luck, power, duplication and accessible pool.

ResourceTarget = ExpectedOutputDuringTargetWindow × 0.60. Exclude an ore if expected quantity during the window is below 5. This margin makes ordinary completion more likely but never guarantees RNG outcomes. Whole-item target rounding is noted in Reference K.

For Polished output, account for acquisition supply and Polisher throughput. For Refined output, account for input supply, Refiner throughput and survival probability. ExpectedSuccessfulOutput = effective processing input rate × survival probability. Apply the 60% factor afterward.

Progress records activity after generation, not pre-existing inventory. Progress does not consume resources. Manual and automated acquisition both count for normal collection unless the objective says manual-only. Polished progress counts qualifying outputs. Refined progress follows the surviving-pass rule discussed above. Completed objectives stay in the set; do not replace them immediately.

### Daily and Weekly claim formulas

At each claim, snapshot all applicable bases before awarding any payout:

DailyCash = 0.30/3 × CashEarnedThisRebirth = 0.10 × basis.  
DailyXP = 0.50/3 × FullNextLevelXPSpan.

WeeklyCash = 1.50/7 × CashEarnedThisRebirth.  
WeeklyXP = 1.50/7 × FullNextLevelXPSpan.

Use exact fractions internally, not the rounded display percentages. At a common progression state, a complete set represents its advertised totals. If bases change between claims, the awarded totals need not equal those percentages of a single historical snapshot. Cash/XP reward fractional precision still requires the existing currency policy or explicit definition in Reference K.

Cash received from a challenge does not increase the qualifying challenge earnings basis. A Rebirth can therefore reset the basis for a later claim without resetting the objective itself.

### Weekly Rebirth targets

Prefer the average of the last 3 valid completed Rebirth durations; if fewer exist, use all available. Without history, estimate minutes = 1,000,000 / sustainable non-Challenge CashPerMinute. This quotient is already in minutes.

Exclude Rebirth objectives when the rate is unreliable/nonpositive or the estimated cycle exceeds 240 minutes. Otherwise target=min(15,max(1,floor(240/EstimatedMinutesPerRebirth))). Track completed Rebirth events while the objective is active.

### Weekly Stardust

If the player has already completed at least 1 Rebirth when the set is generated, designate exactly 1 of the 7 Weekly challenges as the Stardust objective. It receives normal Weekly Cash and XP shares plus extra Stardust:

WeeklyStardust = max(100, floor(CurrentEligibleStardust×0.10)).

Do not multiply it by Stardust Gain. It rounds down to whole Stardust before the 100 minimum. First Rebirth mid-week does not alter existing objectives; eligibility takes effect at the next reset.

With one such reward there is no same-cycle reward chaining. If multiple are introduced later, exclude earlier Weekly Stardust awards in that cycle from later eligible balance calculations.

### Reset times

Daily: 00:01 UTC every day. Weekly: Friday 17:00 UTC. These are fixed GMT/UTC times, not Europe/London wall-clock times adjusted for BST. Replace the entire set on reset; all unclaimed objectives expire, even when completed. Rebirth does not refresh or remove challenge state.

## Reference G Milestones and deferred rewards

Milestones 1–5 are Factory Levels 10,25,50,75,100. For indices 6–250 use j=index−5:

RawLevel=100+9,900×(j/245)^1.2.  
MilestoneLevel=round(RawLevel/5)×5.

This yields 250 unique increasing thresholds, ends at 10,000 and has later rounded gaps of 15–50. Rounding may make individual adjacent gaps fluctuate slightly; the overall spacing trend increases.

Complete threshold catalogue, grouped in index order:

- Entries 1–25: 10, 25, 50, 75, 100, 115, 130, 150, 170, 195, 215, 240, 265, 290, 315, 340, 365, 390, 420, 445, 475, 505, 530, 560, 590.
- Entries 26–50: 620, 650, 680, 710, 740, 770, 800, 835, 865, 895, 930, 960, 995, 1025, 1060, 1090, 1125, 1160, 1190, 1225, 1260, 1295, 1325, 1360, 1395.
- Entries 51–75: 1430, 1465, 1500, 1535, 1570, 1605, 1640, 1675, 1715, 1750, 1785, 1820, 1855, 1895, 1930, 1965, 2005, 2040, 2075, 2115, 2150, 2190, 2225, 2265, 2300.
- Entries 76–100: 2340, 2375, 2415, 2455, 2490, 2530, 2570, 2605, 2645, 2685, 2725, 2760, 2800, 2840, 2880, 2920, 2960, 2995, 3035, 3075, 3115, 3155, 3195, 3235, 3275.
- Entries 101–125: 3315, 3355, 3395, 3435, 3480, 3520, 3560, 3600, 3640, 3680, 3720, 3765, 3805, 3845, 3885, 3930, 3970, 4010, 4055, 4095, 4135, 4180, 4220, 4260, 4305.
- Entries 126–150: 4345, 4390, 4430, 4475, 4515, 4555, 4600, 4640, 4685, 4730, 4770, 4815, 4855, 4900, 4940, 4985, 5030, 5070, 5115, 5160, 5200, 5245, 5290, 5330, 5375.
- Entries 151–175: 5420, 5465, 5505, 5550, 5595, 5640, 5685, 5725, 5770, 5815, 5860, 5905, 5950, 5995, 6035, 6080, 6125, 6170, 6215, 6260, 6305, 6350, 6395, 6440, 6485.
- Entries 176–200: 6530, 6575, 6620, 6665, 6710, 6755, 6800, 6845, 6895, 6940, 6985, 7030, 7075, 7120, 7165, 7215, 7260, 7305, 7350, 7395, 7445, 7490, 7535, 7580, 7630.
- Entries 201–225: 7675, 7720, 7765, 7815, 7860, 7905, 7955, 8000, 8045, 8095, 8140, 8185, 8235, 8280, 8330, 8375, 8420, 8470, 8515, 8565, 8610, 8660, 8705, 8755, 8800.
- Entries 226–250: 8850, 8895, 8945, 8990, 9040, 9085, 9135, 9180, 9230, 9275, 9325, 9375, 9420, 9470, 9515, 9565, 9615, 9660, 9710, 9760, 9805, 9855, 9905, 9950, 10000.

Track earned flags permanently, including before UI reveal after first Rebirth. Keep milestone progress through Rebirth. Detailed reward types, amounts and balancing are deferred. Desired direction is substantial permanent boosts and cosmetics; there is no approved +75% reward assigned to a particular threshold.

Existing Achievement IDs and current triggers are retained as implementation history:

| ID | Name | Current trigger | Reward status |
|---|---|---|---|
| firstSwing | First Swing | totalOresMined ≥1 | Deferred placeholder |
| stoneMiner | Ore Miner | totalOresMined ≥100 | Deferred placeholder |
| dedicatedMiner | Dedicated Miner | totalOresMined ≥1,000 | Deferred placeholder |
| firstDiscovery | Shiny | oresDiscovered ≥1 | Deferred placeholder |
| firstSmelt | First Smelt | oresSmelted ≥1 | Deferred placeholder |
| factoryOwner | Factory Owner | Factory Level ≥10 | Deferred placeholder |

The current totalOresMined implementation increments per manual action. The owner's final direction calls for both click-count and actual-resource-count Achievement categories; additional entries and their rewards remain deferred rather than silently changing old IDs' meanings.

## Reference H Statistics catalogue and Rebirth reset matrix

### Statistics

Keep current balances separate from lifetime and cycle event counters. Rebirth must not reset true Factory XP merely because a cycle XP-earned counter is reset.

| Record | Lifetime | Current Rebirth | Required distinction |
|---|---|---|---|
| Furnace sale Cash earned | Yes | Yes | Qualifying reward basis excludes challenge payouts and refunds |
| Cash spent | Yes | Yes | Record actual payable discounted/rounded cost |
| Resale refunds | Yes | Yes | Separate from qualifying earnings |
| Manual clicks | Yes | Yes | One action, irrespective of output |
| Manual normal output | Yes | Yes | Per resource ID and tier; include duplicates |
| Miner output | Yes | Yes | Per resource ID/tier and source; include duplicates |
| Wood Scrap Metal obtained | Yes | Yes where cycle counters are shown | Separate materials; not ore counts |
| Polished output | Yes | Yes | Per ore ID |
| Refinement attempts | Yes | Yes | Per ore/pass count |
| Refinement survivors and losses | Yes | Yes | Distinguish outputs from destruction |
| Raw Polished Refined sales | Yes | Yes | Quantity and revenue; preserve Refine Count breakdown |
| XP earned | Yes | Yes | Gameplay and challenge sources separate from actual permanent Factory XP |
| Gem Dust earned and spent | Yes | Cycle earnings | Separate persistent balance |
| Stardust earned and spent | Yes | Source-specific history | Separate Rebirth and Weekly sources |
| Rebirth count and history | Yes | Current duration | Record cash payout basis, time and reward |
| Challenge completions and claims | Yes | Active reset-cycle state | Daily and Weekly separate |
| Highest Cash Level and machine tiers | Yes | Optional cycle views | Lifetime bests survive |
| Collection discoveries | Yes | No reset | Resource ID; materials are not ore discoveries |
| Play time | Yes | Current cycle | Do not invent offline simulation |

Total Resources Gathered includes materials. Ore-specific counters exclude materials. Repeated surviving refinement is processed output, not acquisition of a new raw ore. Keep normal, Polished and Refined counters distinct.

### Rebirth payout

Eligibility: current unspent Cash ≥ $1,000,000.  
BaseStardust=10+5×log2(max(1,CurrentCash/1,000,000)).  
StardustGainMultiplier=1+4×StardustGainLevel/7,500.  
AwardStardust=roundToTwoDecimals(BaseStardust×StardustGainMultiplier).

Calculate before resetting Cash. Previously spent Cash is excluded. Stardust Gain affects Rebirth payout only, not Weekly Stardust. Stardust can have two decimal places; Gem Dust remains integer.

| System | On Rebirth |
|---|---|
| Cash and Cash Earned This Rebirth | Reset |
| Raw ore and Stone | Reset |
| Polished and Refined ore | Reset |
| Active processing inputs/reservations | Clear with reset inventories; no duplicate payout |
| Ore Value Mining Power Mining Luck Mining Duplication and Unlock Miner | Reset |
| Owned Miners Polishers Refiner | Remove |
| Local Miner Ore Luck | Remove with Miner |
| Furnace entity | Keep placed |
| Furnace tier | Reset/restored by Preservation |
| Actual Factory XP and Level | Keep permanently |
| Pickaxe copies durability broken state and equipment history | Keep |
| Pickaxe Durability perk | Keep |
| Wood Scrap Metal | Keep |
| Miner slot access | Keep |
| Stardust and purchased Rebirth perks | Keep |
| Gem Dust | Keep |
| Achievement claim states and permanent effects | Keep |
| Milestone flags and reveal state | Keep |
| Collection and lifetime statistics | Keep |
| Current Rebirth counters | Reset |
| Daily and Weekly objective state | Keep until scheduled reset |
| Inscriptions | Deferred; multipliers 1 |

Machine Tier Preservation starts purchases at min(machine cap,max(1,perk level)); restore Furnace by the same rule at reset. Apply at creation/reset, never repeatedly on load. Do not automatically tier-up existing purchased machines when the perk increases. Local Ore Luck is never preserved.

## Reference I Save version 2 migration

The inspected persistence foundation uses saveVersion 1, accepts unversioned legacy 0 through sequential migration, validates loaded state, preserves rejected raw data and offers recovery. Keep that foundation. New instance structures use schema 2, independent of game/Bible document versions.

Load: parse → identify version → migrate each required step → validate V2 → apply defined defaults → start gameplay. Unsupported future versions must not be downgraded or overwritten. Write canonical machine names and instance records. Once migrated, V2 reload never reapplies migration or compensation.

### Entity conversion

- Each Dropper becomes one Miner, up to 5.
- Each Adder becomes one Polisher, up to 3.
- Positive Multiplier ownership becomes one Refiner.
- If individual records exist, rank strongest by compatible tier, then recorded investment, then oldest ID.
- Count-only saves create Tier 1 entities in deterministic slot order; new stats with no equivalent begin at level 0.
- Clamp compatible tiers to the new machine cap. Local Ore Luck begins at 0 unless a compatible prior record explicitly exists.
- Assign Polishers to slots 1–3. Retain only occupied ownership for the converted count.
- Unlock enough Miner slots for retained Miners, maximum 5, free of migration Cash charges.
- Generate stable deterministic IDs for count-only records so a failed/retried migration does not change compensation decisions.

### Investment and compensation

Use recorded compatible investment where available. When absent, the supplied policy reconstructs using current undiscounted equivalent purchase and tier prices, without Factory Purchase Discount. This is a migration exception to normal gameplay's actual-paid investment rule.

For removed overflow machines: refund 50% of their reconstructed full investment. For a retained machine whose old tier exceeds the new cap, reconstruct before clamping; compensate 50% of the lost above-cap portion, and keep only retained-tier investment as its future resale basis. Do not credit both full lost investment and retained investment as refunds.

Unsupported progression receives 100% of recorded Cash investment; without historical information use an approved closest current equivalent cost. Compensation is Cash only, never Stardust. Exact equivalent prices above current tier/slot limits remain open in Reference K; do not invent high-value overflow compensation.

Retain total Factory XP; derive its appropriate Level using 100L² if old level/XP are inconsistent. Rebirth gameplay never resets either. Preserve lifetime statistics, collection, claims and supported unknown data through the existing validation/recovery policy.

## Reference J Upgrade and resource catalogues

### Normal Cash Shop

These are retained costs unless explicitly superseded. Apply global Cash price rounding to purchases. Factory Purchase Discount does not apply to these shop stats.

| Upgrade | Raw Cash cost to buy L | Effect at owned L | Maximum | Rebirth |
|---|---|---|---|---|
| Ore Value | 25 × 1.12^(L−1) | BaseOreValue × (1+0.05L) | Unlimited | Reset |
| Mining Power | 250 × 1.38^(L−1) | +2 raw power per level | 75 | Reset |
| Mining Luck | 100 × 1.20^(L−1) | 1+0.05L manual multiplier | 150 | Reset |
| Mining Duplication | 250 × 1.27^(L−1) | 0.005L independent chance per eligible resource | 100 levels 50% | Reset |
| Unlock Miner | $100 | Access after Mining Power I; separate Miner purchase | One per cycle | Reset |

Ore Value applies to ore values before processing. Whether Stone receives that same global modifier is not explicitly resolved; see Reference K. No separate Cash Shop Ore Luck is added.

### Permanent Stardust perks

Effects use owned level; costs use the level being purchased. round in this table is whole Stardust unless stated otherwise. Each perk persists through Rebirth.

| Perk | Maximum | Effect or cap | Stardust cost to buy L | Total to max |
|---|---:|---|---|---:|
| Overall Luck | 5,000 | 1+0.002L automated tier Luck max 11× | L | 12,502,500 |
| Ore Luck | 5,000 | 1+0.002L automated within-tier Luck max 11× | L | 12,502,500 |
| Furnace Value | 5,000 | 1+0.001L max 6× sale multiplier | L | 12,502,500 |
| Polisher Value | 5,000 | 1+0.0001L max 1.5× extra polished multiplier | L | 12,502,500 |
| Refiner Value | 5,000 | Starting bonus 0.50+0.0014L max +750% at Refine 1 | L | 12,502,500 |
| Machine Tier Preservation | 25 | Starting tier capped by machine max | round(7,500 × 1.484168297348115^(L−1)) | 299,999,997 |
| Refiner Dust Chance | 30 | +0.005L base chance max effective base 25% | 2L | 930 |
| Gem Dust Yield | 50 | 1+0.05L max 3.5× expected yield | round(50 × 1.3368^(L−1)) | 298,482,964 |
| Refiner Stability | 180 | −0.005L destruction max −0.90 with 5% floor | 5+sum(ceil(i/10),i=2…L) | 107,025 |
| Factory XP Gain | 10,000 | 1+0.0004L max 5× gameplay XP | 20L | 1,000,100,000 |
| Stardust Gain | 7,500 | 1+4L/7,500 max 5× Rebirth payout only | 18L | 506,317,500 |
| Miner Speed | 50 | Interval factor 1−0.01L with 0.1s floor | round(100,000 × 1.121118909^(L−1)) | 250,000,002 |
| Furnace Speed | 50 | Interval factor 1−0.01L with 0.5s floor | round(100,000 × 1.121118909^(L−1)) | 250,000,002 |
| Pickaxe Durability | 100 | 1+0.05L base maximum then floor to 100 | round(1,000 × 1.10^(L−1)) | 137,796,124 |
| Factory Purchase Discount | 10 | 5 percentage points per level max 50% | Recommended 250,000 × 2^(L−1) | Recommended 255,750,000 |

For Stability level 1 the sum is empty, so price=5. These numeric totals use each specified individual-level rounding, not rounded headline estimates. There is no universal 400M maximum-cost rule.

Freeze Preservation prices by version. Future tier additions may require a new cost schedule, but do not silently reprice already purchased levels.

An independent Rebirth Furnace Capacity perk was mentioned in an early specification, but no final curve/cap/price is defined here. It is not included as an invented active perk; confirmation is recorded in Reference K.

### V1 ore catalogue

The retained ore values and XP are from the reference catalogue. Position 1–5 orders within-tier weights from cheapest to most expensive. Tier rarity in this catalogue is a manual base tier-hit rarity, not the chance of each individual ore and not a Miner progression row.

| Resource | Tier | Position | Base Cash value | Base resource XP |
|---|---|---:|---:|---:|
| Stone | Common | N/A | $1 | 1 |
| Amber | T1 | 1 | $10 | 5 |
| Quartz | T1 | 2 | $20 | 5 |
| Topaz | T1 | 3 | $30 | 5 |
| Amethyst | T1 | 4 | $40 | 5 |
| Malachite | T1 | 5 | $50 | 5 |
| Citrine | T2 | 1 | $250 | 25 |
| Garnet | T2 | 2 | $500 | 25 |
| Peridot | T2 | 3 | $750 | 25 |
| Jade | T2 | 4 | $900 | 25 |
| Aquamarine | T2 | 5 | $1,000 | 25 |
| Spinel | T3 | 1 | $5,000 | 100 |
| Tourmaline | T3 | 2 | $10,000 | 100 |
| Sapphire | T3 | 3 | $15,000 | 100 |
| Ruby | T3 | 4 | $20,000 | 100 |
| Emerald | T3 | 5 | $25,000 | 100 |
| Onyx | T4 | 1 | $50,000 | 1000 |
| Tanzanite | T4 | 2 | $75,000 | 1000 |
| Alexandrite | T4 | 3 | $100,000 | 1000 |
| Black Opal | T4 | 4 | $150,000 | 1000 |
| Diamond | T4 | 5 | $250,000 | 1000 |

Collection discoveries persist independently of consumable inventory. The inherited prototype's collection catalogue contains the 20 ores; Stone/material statistics do not automatically create new ore-collection entries.

## Reference K Open recommended and deferred decisions

### Open definitions

1. **Destroyed-ore challenge wording:** The principal rule is successful surviving passes only. The supplied exception about an already-completed destruction event could imply an additional path to progress. The last review recommended: count a pass only when its ore survives; a destruction event awards no progress. That final editorial clarification has not been explicitly accepted separately.
2. **Legacy reconstruction beyond current caps:** Specify the approved legacy-equivalent purchase and upgrade schedule for unsupported old tiers and overflow Polisher slots. Current tables end at the new caps; compensation cannot be invented from unavailable prices.
3. **Whole-item challenge targets and claim precision:** Target quantities must be integers, but the exact friendly-rounding procedure is not supplied. Cash/XP claim fractions likewise need the existing currency precision policy or an explicit rule; use exact fractions to calculate, not truncated display percentages.
4. **Stone and Ore Value:** Earlier wording says Ore Value affects ores. It does not explicitly decide whether the Stone resource receives that modifier.
5. **Rebirth Furnace Capacity:** An early mention exists without a final perk definition. Confirm whether it remains required or is superseded by the 50×tier capacity progression.

These entries isolate unresolved definitions rather than silently creating new game balance. They do not prevent work on separately authorized systems whose behavior is fully defined.

### Recommended values pending canon approval

- Material Factory XP: Wood 5, Scrap 15, Metal 50.
- Factory Purchase Discount price curve: 250,000 × 2^(L−1), total 255,750,000 Stardust.

### Deferred systems

- Machine Inscriptions and all active effects/costs/caps; placeholders remain 1×.
- New ore tiers T5–T10 and their values/rarities/unlock rows.
- Miner tiers above 25 and future machine types requiring absent systems.
- Additional Achievement entries and detailed reward balancing.
- Milestone reward types, amounts and balancing.

The threshold structure and existing Achievement infrastructure are not deferred merely because their rewards are.

## Reference L Acceptance checks for future development

These consolidate the original progression tests with the later owner decisions. This handoff does not claim that tests have run or passed.

1. Fresh state has $0, Level 0 / 0 XP, Default Pickaxe and one free Miner slot.
2. First manual click produces Stone with no material substitution; later clicks use accessible manual weights.
3. First Furnace sale grants Cash and removes the sold resources once.
4. Unlock Miner requires Mining Power I; buying the unlock and buying the Miner are separate transactions.
5. Miner ownership begins automation; each entity's tier, Ore Luck, interval, investment and state are independent.
6. Miner limits/slot prices and persistent purchased access are enforced; T4 cannot appear before Miner 6 even with extreme Luck.
7. Automated probability rows total 1 and Stone remains ≥0.25; manual probabilities have no artificial Stone floor.
8. Shop/manual, automated Overall Luck and automated Ore Luck affect only their stated rolls.
9. Mining Power fractional output is unbiased; material chance is once per click and materials cannot duplicate.
10. Power retains precision through ×1.75 tiers; Pickaxe Luck uses additive 2.5 per crafted tier.
11. One click consumes one durability; break/equip tie rules are deterministic.
12. Durability uses floored hundred-unit maxima; upgrades preserve damage on usable copies and never revive broken copies.
13. Repairs are broken-only, use ceil(95% recipe), and restore the current maximum; require all ingredients atomically.
14. Polisher rejects Stone/repolishing, processes partial batches and uses slot prices independently of tier upgrade costs.
15. Refiner input/count/value/roll order, Dust retention on destruction, 15-pass cap and integer expected Dust yield are respected.
16. Furnace capacity/value/exponential speed and manual/automatic tier gates use the final formulas.
17. All purchases calculate from original formulas; discount precedes eligible Cash rounding; local Ore Luck gets no discount.
18. Resale refunds half actual qualifying Cash paid, rounded down; preserved tiers and permanent perks do not create refundable Cash.
19. Rebirth computes Stardust before resetting Cash, preserves actual XP/Level/Pickaxes/materials/slots and applies the reset matrix.
20. Daily and Weekly sets use 3/7 counts, exact per-set reward fractions, claim-time snapshots and no payout inflation of qualifying earnings.
21. Challenge generation uses current capabilities, 30-click manual fallback, safety margin, no duplicate objectives and Refiner survival-adjusted output.
22. Scheduled resets expire all unclaimed objectives; Rebirth itself retains objective state.
23. Weekly Stardust has exactly one eligible extra-reward objective, requires a previous Rebirth at generation, floors reward with 100 minimum, and receives no Stardust Gain multiplier.
24. All 250 Milestones are unique and increasing, final threshold 10,000; claims and earned flags remain permanent.
25. V0/V1 migration to V2 preserves supported progress, applies deterministic conversion/compensation once and never re-runs on V2 reload.
26. Active reservations, cycles and payouts save/reload without loss, double production, duplicate timers or cross-machine state contamination.
27. Invalid/unsupported saves preserve original data for recovery rather than starting a fresh save silently.
28. A complete opening-to-upgrade-to-save/reload scenario follows the final progression order.

## Source and authority record

Compiled from the original pasted 171-question checklist; the earlier attached TEFI Spec question sheet; TEFI Cost Scaling Advice, Connect Astra To Game and TEFI Development; the user's Confirmedspecsheet.txt; and every subsequent answer and resolution in this chat through the latest clarification message.

The local development Bible/reference code supplied inherited ore data, current Achievement IDs and persistence version 1. Its older Dropper/Adder/Multiplier behavior, initial XP baseline, obsolete Furnace prices, prior milestone count and all-ores-at-start language do not override the owner's newer decisions.

After the owner approves Bible synchronization, replace old conflicting formulas rather than keeping both versions active. Update relevant acceptance tests and increment the working specification version appropriately. This compilation itself leaves the Bible and code unchanged.
