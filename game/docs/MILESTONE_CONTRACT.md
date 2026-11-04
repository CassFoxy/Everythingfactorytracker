# GAME21 — Canonical milestones and private compatibility

## Catalogue and tracking

`MilestoneModel` is the sole canonical definition source. Its immutable 250 definitions use stable `milestone:<Factory Level>` identities and Reference G's positive `Math.round(RawLevel / 5) * 5` rule. Tests compare every generated threshold against the separately listed Reference G catalogue. First five: 10, 25, 50, 75, 100; final: 10,000. Factory Level itself has no new cap.

Private XP-awarding transactions call `prepareDevelopmentProgress`: derive the existing Factory Level from actual XP, record every reached canonical threshold on the independent candidate, then persist through the existing writer. Earned flags are permanent. No rewards, claims, prices, XP formulas or statistics consumers are added. The old 113-entry generator serves untagged legacy gameplay and historical validation only.

## Owner-approved lossless compatibility policy

The owner explicitly approved retaining every historical flag unchanged, a separate validated canonical record, silent initialisation from actual retained Factory Level plus exact-match earned flags, historical display outside /250 counts, and no reward or initial-load write. This resolves the private GAME21 decision; it is not approval of public V2 migration or a future reward/claim mapping.

Schema remains `saveVersion:1`, `developmentProfile:"miner-1"`.

```js
milestoneProgress: {
  catalogue: "reference-g-250",
  earned: { "10": false, "25": false /* all 250 canonical keys */ }
}
```

Fresh private saves have all 250 flags false. The tagged record requires exactly `catalogue` and `earned`; the map requires all and only canonical keys with Boolean values. A conflicting tag, null, partial record/map, extra key or non-Boolean flag enters preserved-byte recovery; it is never repaired or overwritten.

Supported older private saves with the whole record absent receive a canonical map in memory: mark thresholds at or below the level derived from retained actual XP, then retain any true historical flag whose threshold exactly matches. This recognises current eligibility without inventing historical dates, rewards or claim facts. Loading performs no storage write or notification replay. The next normal durable write persists the full validated state; failed writes preserve the previous bytes and exact candidate for Retry.

`factoryMilestones` remains unchanged historical evidence, including valid partial maps and false flags. Its existing 113-key/Boolean validator remains active. Do not reinterpret or delete historical records. Existing supported claim/bonus data and unrelated extension data remain untouched. The current runtime has no separate milestone reward-claim consumer; old documentation's claimed/unlocked Boolean terminology is not authority to award or rewrite anything.

Only the canonical map drives private tracking, counts and new notifications. Earned nonmatching historical flags are shown as retained historical records after reveal, outside the canonical total. They are never converted to a nearest threshold or used as a second progression schedule.

There are 19 exact matches and 94 nonmatching historical thresholds.

Exact matches: 10, 25, 50, 75, 100, 150, 650, 800, 1500, 2300, 2800, 3600, 4600, 4900, 5200, 6800, 8000, 8800, 10000.

Nonmatching historical thresholds retained separately: 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 750, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2400, 2500, 2600, 2700, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4700, 4800, 5000, 5100, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900.

Untagged legacy saves retain their existing generator, map, UI and popups. They do not acquire the new private record. Unknown unrelated supported extension data is preserved by the existing loader. Public migration and any future reward/claim conversion remain separate decisions.

## Rebirth, notifications and presentation

Milestones are tracked silently before `rebirthCount > 0`. Normal navigation and direct private modal opening remain unavailable before that point. First successfully committed Rebirth reveals the interface, without replaying earlier completions. Later Rebirths retain both maps, reveal, actual XP/Level and supported claim data.

GAME20 consumes the canonical map only after successful publication. Individual completions retain ascending threshold order; batches over eight form a counted group containing every newly earned level and a route to the permanent interface. Factory Level and achievement notices coexist. Failed candidates, unchanged state and high-level reloads produce no milestone accomplishments.

The UI shows completed/250, current level, next incomplete threshold and levels remaining; All/Completed/Incomplete filters and Go to next milestone navigate the full catalogue. Stable entry identities, textual statuses, a labelled native progress element, focus restoration, keyboard containment and internal scrolling support desktop/tablet/mobile. Rendering never changes progression. No speculative reward controls or values are displayed.

## Verification

Table-driven model tests cover all 250 boundaries and exact Reference G agreement. Runtime tests cover all accepted historical IDs, partial maps, extension preservation, malformed records, load without writes, large level jumps, repeated Rebirth, notification grouping, exact retry and legacy separation. Seven browser flows cover reveal, all entries, filtering/jump, modal keyboard navigation, simultaneous notifications, storage failures, historical display and reload. Full results and screenshots are recorded on the implementation PR. V1-132 rewards remain deferred.
