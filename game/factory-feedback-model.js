/* GAME25: read-only committed machine transitions and captured cycle progress. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FactoryFeedbackModel = api;
})(globalThis, () => {
  "use strict";
  function machines(state) {
    const f = state?.factory;
    return f
      ? [
          ...(f.miners || []),
          ...(f.polishers || []),
          f.refiner,
          f.furnace,
        ].filter(Boolean)
      : [];
  }
  function progress(cycle, now) {
    if (!cycle) return { state: "idle", percent: 0, remainingMs: 0 };
    if (
      !Number.isFinite(now) ||
      !Number.isFinite(cycle.startedAtMs) ||
      !Number.isFinite(cycle.durationMs) ||
      cycle.durationMs <= 0
    )
      return null;
    if (cycle.phase === "resolved")
      return { state: "completing", percent: 100, remainingMs: 0 };
    if (cycle.phase !== "reserved") return null;
    const remainingMs = Math.max(0, cycle.startedAtMs + cycle.durationMs - now);
    return {
      state: remainingMs ? "processing" : "awaiting settlement",
      percent: Math.max(
        0,
        Math.min(100, ((now - cycle.startedAtMs) / cycle.durationMs) * 100),
      ),
      remainingMs,
    };
  }
  function events(before, after) {
    if (
      before?.developmentProfile !== "miner-1" ||
      after?.developmentProfile !== "miner-1" ||
      before.rebirthCount !== after.rebirthCount
    )
      return [];
    const prior = new Map(machines(before).map((m) => [m.id, m])),
      facts = [];
    for (const m of machines(after)) {
      const old = prior.get(m.id);
      if (!old) continue;
      const kind = m.id.split(":")[0],
        base = { id: m.id, kind, slot: m.slot };
      if (!old.cycle && m.cycle?.phase === "reserved")
        facts.push({ ...base, type: "activation", cycleId: m.cycle.id });
      if (old.cycle?.phase === "resolved" && !m.cycle) {
        const r = old.cycle.result;
        facts.push({
          ...base,
          type: "completion",
          cycleId: old.cycle.id,
          cash: r.cashDelta || 0,
          xp: r.factoryXPDelta || 0,
          dust: r.gemDustDelta || 0,
          outputs: (r.outputs || []).map((l) => ({ ...l })),
          destroyed: (r.itemOutcomes || []).filter((i) => i.destroyed).length,
        });
      }
    }
    return facts;
  }
  return Object.freeze({ machines, progress, events });
});
