# GAME25 — Factory feedback

This is a cosmetic extension of GAME24, with no schema, RNG, reward, scheduler or economy changes. GAME24 was merged at `2f9ca68d79e9d3b29ce348c4312657e9f386b823`; its post-merge Tests run 43370018122 and Pages run 43370017914 succeeded before this branch was created.

## API and authority

- `FactoryFeedbackModel.events(previous, next)` reads published private-profile transitions. Idle → reserved produces activation; resolved → cleared with the same machine still owned produces delivery. Reservation expiry, resolution alone, resale removal and Rebirth do not imply delivery. Payouts, survivor Lots and destruction facts come from the saved result, never current prices.
- `FactoryFeedbackModel.progress(cycle, now)` reports idle, processing, awaiting settlement or completing. It clamps the displayed percentage using captured start/duration. Reaching 100% does not settle anything. Converted historical Furnace batches retain their captured 10-second duration.
- `TEFIFactoryFeedback.committed(previous, next)` runs behind the existing publish boundary and isolates cosmetic failures. A microtask lets successful manual confirmation close before ignition; an epoch invalidates obsolete work after cleanup. Removed identities are checked again before rendering.
- `sync(state, now)` uses UI02's existing coalesced refresh, not a new interval. It adds static activity treatments and accessible remaining-time descriptions to existing progress bars. Furnace timing is also visible text. Reload displays current progress without historical effects.
- `notice(notice, region)` decorates GAME20's actual displayed achievement, milestone, level or Rebirth notice. GAME20 still owns priority, grouping, reveal gates and delivery. A transient object token survives queue snapshot copies; a WeakSet prevents repeat celebration after preemption without an accumulating history. No duplicate live announcements or reward claims are added.
- `clear()` cancels effects; `snapshot()` exposes bounded DOM counts for tests.

## Lifetime and accessibility

GAME24's `MiningFeedbackModel.createBurst` supplies cancellation and generation-safe expiry. At most four factory/progression overlays, four expiry timers and 24 particles exist; repeated production replaces the same host's short burst. Higher-priority celebrations displace ordinary effects. Mining retains its existing independent ten-particle cap. Effects expire after 1.1 seconds and never change focus or pointer handling.

Hidden tabs, modal/recovery precedence, navigation away from a host, machine removal, Rebirth and page exit clear obsolete effects. No hidden-tab animation backlog is replayed. Reduced motion removes particles and moving Web Animations while retaining progress/status and static committed-result labels. GAME20 remains the accessible persistent-record navigation path.

## Supported boundaries

Canonical Miners, Polishers, Refiner and Furnace have authoritative cycles and committed-result feedback. Refiner destruction-only results use a distinct muted-purple treatment and report saved Dust even when there are no survivors. Legacy Dropper ownership and Adder/Multiplier modifiers receive only static active/idle treatment. They do not have the private durable publication boundary, so no invented per-machine production pulse or timing is generated. Existing inherited Furnace progress remains unchanged until explicit modernisation. Audio, conveyors, world-resource movement, rewards and public V2 remain deferred.

## Verification

The consolidated suite includes table-driven transition/progress tests, existing gameplay/save regressions and Chromium tests of committed activation, partial progress, resolution without awards, failed writes, exact Retry, reload, real machine output, destruction/Dust, survival, concealed milestones, multiple progression events, deduplication, stress and cleanup. Seven viewport sizes: 2560×1440, 1920×1080, 1366×768, 1280×720, 1280×600, 768×1024, 390×844.

Suite counts and genuine screenshots/frame sequences are recorded below. Screenshots are browser captures of `/game/`, using controlled clock/RNG fixtures; they are not illustrations. No visual completion asserts a gameplay award before persistence.

## Review evidence

The suite now contains 23 JavaScript syntax checks, 611 Node tests (15 added here), and 162 Chromium scenarios (nine added here). Consult the implementation PR's final checks for the completed run results. Focused GAME25 runs passed all seven sizes and the machine/progression/cleanup scenarios. The sustained-production fixture completes 40 Miner cycles without exceeding four factory overlays or 24 particles; modal/recovery/page-exit cleanup leaves zero effects. These are deterministic boundedness checks, not a claim of a multi-day benchmark.

| Viewport | Mid-processing and remaining time | Committed completion |
|---|---|---|
| 2560×1440 | [Processing](processing-2560x1440.webp) | [Completion](completion-2560x1440.webp) |
| 1920×1080 | [Processing](processing-1920x1080.webp) | [Completion](completion-1920x1080.webp) |
| 1366×768 | [Processing](processing-1366x768.webp) | [Completion](completion-1366x768.webp) |
| 1280×720 | [Processing](processing-1280x720.webp) | [Completion](completion-1280x720.webp) |
| 1280×600 | [Processing](processing-1280x600.webp) | [Completion](completion-1280x600.webp) |
| 768×1024 | [Processing](processing-768x1024.webp) | [Completion](completion-768x1024.webp) |
| 390×844 | [Processing](processing-390x844.webp) | [Completion](completion-390x844.webp) |

Additional genuine captures: [Miner](miner.webp), [Polisher](polisher.webp), [Refiner destruction/Dust](refiner-destruction.webp), [Refiner survivor](refiner-survivor.webp), [achievement](achievement.webp), [grouped milestones](milestone.webp), [Factory Level](level.webp). Browser animation frames at [100 ms](frame-100.webp), [450 ms](frame-450.webp) and [850 ms](frame-850.webp) use paused Web Animations at those offsets; gameplay timing is not altered by the renderer.

Review findings: desktop document height stays within the viewport; short screens use the existing internal Factory scroll to reach processing controls. Tablet/mobile retain their existing layout and ordinary scrolling. Completion labels remain above action controls; overlays are pointer-transparent. No duplicate IDs, horizontal overflow or browser errors were observed in the focused checks. Reduced motion retains static labels and progress with no moving factory particles. Screenshots were saved at native viewport resolution and converted to WebP for repository size.
