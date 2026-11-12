# GAME24 — Mining Animations and Visual Feedback

## Scope and integration

The private `miner-1` profile receives scene-local cosmetic effects after successful publication. The prior UI02 refresh/counter watcher is removed; it parsed `lastOre`, replaced simultaneous presentation and managed separate expiry callbacks. The new adapter observes committed manual statistics, never temporary UI text or current inventory. Existing legacy gameplay and GAME20–GAME23 remain unchanged.

A successful click swings the Pickaxe that performed it, including its final durability hit. Both swing and impact follow persistence, so unavailable, invalid and failed actions show no false success. Two to ten deterministic fragments and a short impact accent scale from Stone through Tier 4. Resource icons and `+amount Name` labels include actual duplicates and materials. Material-only clicks show only the material. Consecutive clicks within 1.3 seconds combine exact same-resource totals in a single floating card; distinct identities remain separate.

## Presentation API

- `MiningFeedbackModel.event(previous, next, ORES)` returns null for unchanged/manual-free, legacy or Rebirth transitions. Otherwise it returns `{kind: "manual", pickaxeTier, tier, rewards: [{id, name, tier, amount}]}`. `amount` is an exact decimal string calculated with internal BigInt from committed manual-output/material counters. Nothing is serialized into gameplay state.
- `MiningFeedbackModel.createBurst({schedule, cancel, render, clearView, duration})` provides `push`, `clear`, and a read-only `snapshot`. Timer injection makes generation-safe expiry deterministic in tests. The canonical event vocabulary bounds the resource map to Stone, twenty ores and three materials. One timer replaces previous expiry, stale callbacks cannot clear newer effects, and rendering failures clean transient state.
- `TEFIMiningFeedback.committed(previous, next)` is called inside the runtime's existing publish boundary with an isolated presentation-error handler. A WeakSet prevents duplicate delivery of the same published candidate. Failed writes never invoke it; exact Retry invokes it once after persistence. Reload establishes state without replay.
- `TEFIMiningFeedback.clear()` removes transient DOM, cancels active Web Animations and expiry, and restores the static Pickaxe. `snapshot()` is read-only diagnostic evidence for tests.

The generic lifetime controller can be reused for future validated cosmetic facts. Future machine/Furnace/celebration consumers are not activated here. This is not another gameplay loop or important-notification queue.

## Safety, accessibility and performance

No RNG is consumed by cosmetic code. The only runtime change is a guarded post-publication callback; resource formulas, timing, awards, durability, statistics and persistence are unchanged. No saved schema fields or new dependencies.

Effects stay clipped to the existing mine illustration, have no focusable elements, use `pointer-events: none` and `aria-hidden=true`. Existing last-find text, inventory and GAME20 live announcements remain authoritative; no duplicate live region is added. The mining button remains outside the effect surface. Reduced motion suppresses swing, impact, particles and glow while keeping the exact static award text. Changing that preference refreshes active presentation without erasing newly committed facts.

Repeated mining uses one reward card, at most 24 canonical identity rows, ten particles, one impact and one transient Pickaxe. There are at most two tracked Web Animations and one expiry timer. Effects expire after 1.3 seconds of inactivity; a sustained burst combines quantities rather than accumulating nodes/timers. Recovery/reset, hidden tabs, page exit and Rebirth clear obsolete effects. No offline animation backlog.

## Verification

Nine new deterministic Node cases cover every ore/tier, materials, simultaneous facts, no RNG or state mutation, exact large sums, stale expiry, bounded burst keys, cleanup, failed writes/exact Retry and presentation-error isolation. Focused Chromium flows cover seven viewports plus touch input and a full-motion stress/recovery flow. Full syntax/Node/Chromium results and final CI are recorded in the implementation PR.

The full browser suite retains GAME20 queues, GAME21 milestones, GAME22 Collection, GAME23 achievements, legacy mode and all machine/Pickaxe/save regressions. The animation flows verify mouse/keyboard/touch, exact displayed quantities, durability, all rarity tiers, reduced-motion changes, 60–80 rapid clicks, one timer/card, particle/animation caps, expiry, hidden tabs, page exit, recovery, no replay, viewport fit and browser errors.

## Genuine Chromium visual evidence

Screenshots use actual `/game/` transactions and the browser compositor, with animations paused at 100 ms for repeatable inspection. These are not mockups. Stone and Tier 4 screenshots were inspected at all seven sizes. The three-frame desktop sequence samples 40, 180 and 700 ms of the same committed rare award.

| Viewport | Ordinary Stone | Tier 4 |
|---|---|---|
| 2560 × 1440 | [Stone](stone-2560x1440.webp) | [Rare](rare-2560x1440.webp) |
| 1920 × 1080 | [Stone](stone-1920x1080.webp) | [Rare](rare-1920x1080.webp) |
| 1366 × 768 | [Stone](stone-1366x768.webp) | [Rare](rare-1366x768.webp) |
| 1280 × 720 | [Stone](stone-1280x720.webp) | [Rare](rare-1280x720.webp) |
| 1280 × 600 | [Stone](stone-1280x600.webp) | [Rare](rare-1280x600.webp) |
| 768 × 1024 | [Stone](stone-768x1024.webp) | [Rare](rare-768x1024.webp) |
| 390 × 844 | [Stone](stone-390x844.webp) | [Rare](rare-390x844.webp) |

Sequence: [40 ms](frame-40.webp) → [180 ms](frame-180.webp) → [700 ms](frame-700.webp).

## Deferred

Audio, machine/Furnace animation consumers, new progression celebrations, world/grid rendering, public V2 migration and Roblox conversion. No new resources, rewards, odds, cooldowns or gameplay effects.
