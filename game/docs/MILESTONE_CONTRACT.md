# GAME21-FIX — Canonical milestones and supported save interpretation

## Authority and catalogue

[Issue #63](https://github.com/CassFoxy/Everythingfactorytracker/issues/63) is the binding owner policy and supersedes the initial preservation/display interpretation. `MilestoneModel` is the only active catalogue in private and untagged legacy gameplay. Its 250 immutable `milestone:<level>` definitions match Reference G exactly: first 10, 25, 50, 75, 100; last 10,000. There is no parallel 113-threshold schedule. The retired-key predicate exists only to validate older input bytes.

## Compatibility without public V2 activation

Private saves retain `saveVersion:1`, `developmentProfile:"miner-1"` and the strictly validated `milestoneProgress: {catalogue:"reference-g-250", earned:<complete 250-key Boolean map>}`. When the entire record is absent, derive canonical flags in memory from retained XP-derived Factory Level and true old flags that exactly match a canonical threshold. Conflicting, partial or malformed canonical records enter preserved-byte recovery.

The private `factoryMilestones` field may retain validated original flags as inert compatibility data. It is never read by active tracking, counts, UI or notifications after initial canonical interpretation. Unmatched flags cannot create substitute or nearest-threshold completions. They have no historical panel, label, reward, compensation or gameplay meaning.

Untagged legacy saves remain untagged schema 1, retain their existing machines, progression and storage lifecycle, and receive no private or V2 fields. After validating old flags, the loader replaces only the in-memory `factoryMilestones` map with the complete canonical map derived from retained actual Factory XP/Level and exact-match true flags. New legacy tracking, counts, modal entries and popups use only those 250 thresholds. Already canonical maps reload through the same validation. Unmatched keys are omitted on the next normal save. This explicitly approved milestone-only interpretation does not migrate machines, rebalance resources, change Rebirth or activate public V2.

Both paths accept canonical keys and recognised retired keys as Boolean input; unknown or malformed keys enter recovery. Original stored bytes remain untouched on load and available to recovery/export. No opt-in action, load-time storage write or notification replay occurs. Existing unrelated extension and claim data remains untouched, with no inferred reward consumer. The private writer persists the complete candidate before publication and retains exact candidate bytes on failure for controlled Retry.

## Tracking, reveal and notifications

Private XP awards derive Factory Level using the unchanged formula and mark every crossed canonical threshold in the candidate. Earned progress remains permanent. Private access stays hidden before the first completed Rebirth; first reveal never replays old completions. Subsequent Rebirths retain progress, XP/Level and reveal. Legacy mode retains its existing access policy.

GAME20 consumes committed canonical transitions. Simultaneous milestones remain ordered, with batches over eight grouped while retaining every level. Failed writes, unchanged state and reloads generate no accomplishment notifications. The non-browser fallback also uses canonical flags. Legacy popups retain their presentation mechanism but can only name canonical thresholds.

## Interface and verification

The UI is strictly canonical: completed/250, current level, next threshold, remaining levels, filters and Go to next. No unmatched historical section exists. Stable IDs, textual status, labelled progress, keyboard containment/restoration, reduced-motion compatibility and internal scrolling support all seven required viewports.

Tests independently compare all 250 thresholds with Reference G, exercise every boundary and large jumps, exact-match/unmatched flags in both save modes, no load writes, malformed recovery, unrelated retention, repeated Rebirth, simultaneous notifications and exact retry. Chromium checks all seven resolutions, both compatibility modes and absence of historical UI. Full results and refreshed screenshots are recorded on PR #62.

V1-132 rewards, future reward/claim migration and full public V2 remain deferred. No unrelated gameplay changes are authorised.
