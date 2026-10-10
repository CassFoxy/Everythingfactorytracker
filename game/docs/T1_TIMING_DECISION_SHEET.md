# T1-REVIEW — Machine Timing and Value-Binding Decision Sheet

**Review status: COMPLETE. T1 status: OPEN / OWNER APPROVAL REQUIRED.**

This sheet proposes choices, not new gameplay rules. Nothing below labelled **PROPOSED** is canonical or permission to implement it. Production remains saveVersion 1. No runtime, schema, migration or pure-model changes accompany this review.

## Problem and authority

The pure models calculate costs and outcomes, and idle candidate helpers prepare purchases/upgrades. They do not decide whether closed-game time advances work, which effects an active cycle uses, or whether an explicit upgrade reprices unreserved processed inventory. Those decisions must precede affected live integration.

Sources: [AGENTS](../AGENTS.md), [Game Bible References B–E and H](GAME_BIBLE.md), [owner handoff References B–E/H](TEFI_Consolidated_Development_Specification.md), [V2 cycle contract, sections 7–8 and gates](V2_STATE_CONTRACT.md), [lifecycle sections 3–8](V1_MACHINE_LIFECYCLE_CONTRACT.md), [roadmap](../V1_ROADMAP.md), and [pure models/candidates](../ores.js). Defined rules take precedence; Recommended/Open/Deferred material stays in its existing status. Inscriptions and unspecified rewards are not activated here.

## Already approved — no approval requested again

- Idle is `cycle:null`. The only saved cycle phases are `reserved` and `resolved`. Inputs have one owner; queued stock is not still available stock.
- Reservation persists input transfer and timing together. Resolution persists the complete result without paying it. Commit persists rewards/events and clears the cycle together, then publishes success. No UI callback may pay independently.
- Original start and captured duration survive reload. A valid future start timestamp is not silently reset to now. A timestamp alone does not authorize downtime progress.
- Resolved outcomes and historical processed Lot metadata never reroll/reprice on load. Furnace reserved unit sale values remain authoritative. Refiner preserves its original pre-Refiner basis and never compounds previous results.
- Selection/resource-mode/batch-mode changes apply to subsequent work. They do not cancel or change reserved input. Furnace `autoEnabled:false` prevents future automatic starts; it is not cancellation. Tiers 1–2 remain manual even with a true preference; tiers 3–20 are eligible, not guaranteed to run.
- Failed writes retain the previous committed state and exact pending candidate for controlled retry, blocking conflicting operations. No speculative ore, Cash, XP or Dust is published. A crash before a result is persisted may recompute an uncommitted roll; save-scumming prevention is not promised.
- Legacy Auto Furnace may finish its one already-reserved overdue batch with its original values and time. Repeated unattended cycles, backdated new work and unlimited offline simulation are not authorized.
- Resale needs confirmation and one atomic refund/removal. Miner work is removed with ownership without a production refund. Polisher returns queued/active **unprocessed** inputs once, retains already available polished output, and commits an already resolved result before revalidating idle resale. Refiner active resale remains blocked by **R1**. Furnace cannot be sold.
- Central Rebirth clears active/resolved work and inventories without payout; removes sellable machines, retains permanent Furnace identity/preferences/sequence, restores its tier through Preservation, and retains global identity counters. Rebirth is not bulk resale.

## Parameters affected by T1

The formulas are Defined; the **PROPOSED** binding below needs decision 3. “Reserve” means the successful cycle reservation transaction, not selection, queue insertion, a price preview or an uncommitted candidate.

| Machine | Parameters / existing authority | PROPOSED evaluation point and gameplay effect |
|---|---|---|
| Miner | Tier rarity table/access, Overall Luck, local Ore Luck, Rebirth Ore Luck; production interval; one base output | At reserve, bind the tier distribution and within-tier Luck inputs, interval and one-base-output rule. Resolve the specific resource later using those bound inputs. No material input reservation and no duplication/new tier rules. |
| Polisher | Tier, batch capacity, duration, Polisher Value, supplied current ore value | Select quantity and duration at reserve; bind current ore value (already including applicable Ore Value) and Polisher Value then. Produce historical `polishedValue` from that basis on resolution. Existing Polished Lots remain unchanged on load; explicit repricing is decision 4. |
| Refiner | Tier/capacity; Dust chance, Stability/destruction, Dust Yield, Refiner Value; incoming count and pre-Refiner basis | Bind effect levels and quantity at reserve. Preserve incoming historical basis; first pass uses existing polished value. Resolve independent Dust, fractional-yield and destruction outcomes per item using that context, Dust before destruction. Never reuse one batch roll or compound the last bonus. Save the successful new bonus and complete result. |
| Furnace | Tier/capacity/duration, Speed perk, applicable resource value, Furnace Value | At reserve, determine quantity/duration and final unit sale snapshots using applicable values/perks once. Existing explicit duration/unit-value snapshots already remain fixed. T1 must not reinterpret legacy snapshots. |
| Furnace activation | Owned tier, autoEnabled, modes and manual request | Check current permissions/selection before each **new** reservation. An upgrade to T3 supplies eligibility only; it does not alter preference or itself create a cycle. Reserved work is unaffected by preference changes. |

Queue ownership alone does not currently define a new effect snapshot. Under the proposal, queued Lots retain their historical metadata, but new cycle effects bind when they move into a cycle. No extra value modifier is applied twice. Any undefined reward formula stays blocked rather than being inferred from a CycleResult field.

## Numbered decisions requiring approval

### 1. Does one pending cycle advance while the game is closed?

**Current:** New Miner/Polisher/Refiner downtime is unspecified. Existing legacy Furnace settlement must remain supported; the modernized Furnace's new-cycle policy should be stated explicitly as part of this choice.

- **A — PROPOSED recommendation:** For new cycles on all four machines, one already persisted reserved cycle uses its original deadline. If overdue on reopening, resolve/commit it once. Start any subsequent eligible work only after reopening, from a new current start time. Unreserved queue entries do not run during absence. This respects completed waiting time without repeated offline farming.
- **B — Alternative:** New work pauses during absence and resumes from the saved remaining duration. Players must spend the processing time in the open game. This requires a defined durable pause/checkpoint mechanism and crash/background-tab policy; close events cannot reliably save remaining time. Legacy Furnace batches still need their separate compatibility behavior.

**Approval needed:** Choose 1A or 1B and confirm it covers all four new machine types. Neither option permits repeated unattended cycles. Such a system would require a separate future design ticket.

**Persistence impact:** A fits original timestamps/durations; B needs an additional approved timing representation and adapter, not resetting `startedAtMs` on reload. Neither changes an old Furnace reservation.

### 2. May a player buy a tier/local upgrade while a machine is working?

**Current:** Idle candidate models reject active work as their bounded scope, not as an approved permanent gameplay rule. Active upgrade behavior is open for Miner, Polisher, Refiner and Furnace.

- **A — PROPOSED recommendation:** Allow an otherwise valid paid tier upgrade (and Miner local Ore Luck upgrade) during work; debit/record it atomically, but apply changed effects only to later reservations. Players can buy immediately; the visible running cycle keeps its original behavior. Global perk purchases likewise cannot rewrite bound work under decision 3A.
- **B — Alternative:** Reject machine tier/local upgrades until idle. Simpler transaction validation, but frequent automation may make purchases awkward; do not invent a pending-upgrade queue to solve that here. Global perk binding still needs decision 3.

Recalculating an active cycle's saved duration, reserved quantity or sale values is **not a compatible alternative** to the existing contract. It would require an explicit contract revision beyond this review; no progress reset or partial reward is proposed.

**Approval needed:** Choose 2A or 2B for each of the four machines (one “all” answer is sufficient). Refiner upgrade permission does not authorize Refiner resale or input disposal.

**Persistence impact:** A requires retained old effect context alongside new owned tier/perks; B avoids active local upgrades but does not eliminate context needs for global changes/reload.

### 3. When do unresolved outcomes bind their effects?

**Current:** Inputs, duration and Furnace sale snapshots are already fixed; immutable processed metadata and resolved results are protected. Binding of the remaining tier/Luck/perk inputs is missing.

- **A — PROPOSED recommendation:** Use reservation-time binding for every parameter listed in the table. Evaluate RNG at resolution with the retained context. The player can predict which upgrades affect the next cycle; reload or later perk purchases cannot change this cycle's effect basis.
- **B — Alternative:** Keep all already captured duration/input/sale/historical values fixed, but evaluate remaining Miner Luck, new Polisher output effects and Refiner chance/yield/bonus effects at resolution. Upgrades can benefit work already started, and completion ordering becomes economically significant. Each exception must be enumerated; it cannot reprice a Furnace snapshot or compound an old Refiner result.

**Approval needed:** Choose 3A or enumerate 3B's machine/parameter exceptions. Recommendation includes queue-to-cycle binding, not queue insertion. Neither choice changes saved resolved outcomes or the existing allowance for recomputing a roll lost before result persistence.

**Persistence impact / technical blocker:** Current Cycle fields are exactly `{id,phase,startedAtMs,durationMs,inputs,saleUnitValues,result}`. They do **not** retain every Miner/Polisher/Refiner effect basis needed by 3A. After approval, a bounded technical contract update must specify how to persist/validate that context and version its interpretation. Do not invent fields here, pre-resolve a result while calling it reserved, or rely on current perks to reconstruct missing historical effects. T1 approval alone is not V2 readiness.

### 4. Can an explicit later upgrade reprice unreserved processed stock?

**Current:** Loading never reprices historical Lots. Whether an explicit upgrade reprices **unreserved** Polished/Refined stock remains open; reserved and resolved values cannot be rewritten.

- **A — PROPOSED recommendation:** Existing Polished/Refined Lot metadata stays fixed after upgrades too. New processing uses the newly applicable approved effects. Furnace multipliers for a future sale may still apply when a new reservation is made; this is not rewriting the stored processing basis.
- **B — Alternative:** Permit explicitly defined upgrade-triggered repricing of unreserved stock only. This can make upgrades improve stockpiles, but needs approved scope, source-basis retention and cohort transformation rules. Existing snapshots alone may not reconstruct the original inputs. No guessed reverse calculation is acceptable.

**Approval needed:** Choose 4A or supply the affected upgrades/stages and intended repricing rule for a separate specification. Recommendation avoids retroactive stack changes. K.4 (Ore Value on Stone) remains outside this choice.

### 5. Which action wins when completion and removal meet?

**Current:** A single writer serializes transactions, stale callbacks are harmless, and failures block conflicting actions. Polisher resolved-before-resale, Refiner R1 and central Rebirth clearing are already Defined. The priority between a merely due cycle and a newly requested removal needs an explicit player-visible rule.

- **A — PROPOSED recommendation:** Use accepted coordinator-command order with no backdated priority from the deadline. If resolution/commit runs first, its ordinary result applies first. If an eligible Miner/Polisher sale runs first against reserved work, use its Defined removal/return rules, with no extra production/partial-progress reward. For an already resolved Miner, finish the normal result commit before revalidating resale (matching the existing Polisher rule). Rebirth uses its Defined clear-without-payout behavior against whatever has not committed when its command is accepted.
- **B — Alternative:** Before accepting an ordinary Miner/Polisher sale, settle any due work and commit resolved results, then revalidate the sale. This gives due work priority and can delay sale on a write failure. Rebirth still must not force settlement contrary to its clear-without-payout rule. Refiner active resale remains R1-blocked in either option.

**Approval needed:** Choose 5A or 5B, including the proposed resolved-Miner commit-before-resale rule. No extra refund, cancellation reward or Refiner disposal policy is authorized.

**Technical implication:** Serialize upgrades the same way. With 2A/3A, upgrade-before-resolution changes ownership but not that cycle's basis; resolution-before-upgrade preserves its saved result. A subsequent reservation observes upgrades only after their successful commit. Failed writes stop the ordering until safely resolved.

## Interruption and reload review

These are contract requirements, not claims of implemented V2 guarantees.

| Interruption / race | Required result or outstanding choice |
|---|---|
| Close before reservation is persisted | Last save still owns available/queued input; no reward or consumed operation ID from the failed candidate. |
| Close during reserved cycle | Restore exactly that reservation. Decision 1 determines elapsed progress; decision 3 determines retained effect context. No duplicate input subtraction. |
| Close after resolved persistence, before reward commit | Reuse exact saved result; commit once with cycle cleared. No RNG or repricing. |
| Close after successful reward commit | Cycle is absent; rewards already exist. Stale callback does nothing. |
| Valid future start timestamp | Keep it; no “repair to now.” Under 1A, do not finish before its original deadline; bound display progress. Invalid timestamps follow validation/recovery, not reward guessing. |
| Overdue work | Legacy Furnace finishes its single saved batch as before. New work awaits decision 1; never execute a backlog of repeated cycles. |
| Persistence write fails | Keep exact pending candidate in-session; no speculative reward or second debit. Block conflicting writes; retry unchanged. After crash use the last durable snapshot, with the already documented pre-result-roll limitation. |
| Upgrade just before/after completion | Serialize and revalidate ownership/phase; use decisions 2–3, never partially update Cash/tier/cycle. |
| Removal/Rebirth vs completion | Use decision 5 plus Defined machine-specific return/reset rules. Old callbacks cannot revive a removed machine or cleared cycle. |

Within the approved single-writer whole-save boundary, exclusive ownership and atomic reward-plus-clear commits prevent duplicate ore, Cash, XP and Dust. This is a design invariant to test, **not** a present guarantee for unimplemented consumers, competing tabs, disk failures or rollback/tampering. A failed write cannot publish a reward. Existing schema-1 storage limitations are not repaired by this document.

## Compatibility and implementation readiness

Legacy Furnace migration must retain raw input quantities, exact original unit values, original start and 10,000 ms duration; never subtract inputs twice or apply new capacities/prices to old work. Modernized new cycles follow an approved T1 policy only after their consumer/migration gates pass. No change to production saveVersion or current legacy handlers is proposed here.

- [ ] Owner records choices for decisions 1–5; recommendations remain PROPOSED until then.
- [ ] Update final lifecycle/state contracts to those choices, including durable effect context and any pause representation, without conflicting cycle phases.
- [ ] Specify validators/adapters for supported old reservations; never guess absent historic context.
- [ ] Test each reserve/resolve/commit failure boundary, future/overdue times, independent per-item Refiner rolls, retry, preferences, upgrades and removal races with controlled clocks.
- [ ] Implement durable single-writer coordination before publishing candidate rewards or payments as live facts.
- [ ] Keep R1, K.1, K.2, K.4, K.5, grid and other applicable activation gates separately tracked; T1 approval does not resolve them.
- [ ] Complete affected consumers and V1-017/V1-018 activation prerequisites before production V2 writes.

**Exact requested response:** “Approve T1 decisions 1A, 2A for all four machines, 3A, 4A and 5A,” or specify replacements by number and machine/parameter. This requests approval of gameplay direction; the follow-up technical contract still needs verification before implementation. Stop after review; no live integration begins from this sheet alone.
