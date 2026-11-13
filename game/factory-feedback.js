/* GAME25 extends GAME24's transient lifetime controller. No game loop or state writes. */
(() => {
  "use strict";
  const seen = new WeakSet(),
    celebrated = new WeakSet(),
    effects = new Map(),
    motion = matchMedia("(prefers-reduced-motion: reduce)");
  let epoch = 0;
  const $ = (id) => document.getElementById(id);
  function blocked() {
    return (
      document.hidden ||
      !!globalThis.document.querySelector("#gameRoot[inert]") ||
      (typeof recoveryState !== "undefined" && recoveryState.active) ||
      (typeof pendingDevelopmentWrite !== "undefined" &&
        !!pendingDevelopmentWrite) ||
      [...document.querySelectorAll('.modal,[role="dialog"]')].some(
        (n) => !n.hidden && getComputedStyle(n).display !== "none",
      )
    );
  }
  function host(m) {
    if (m.kind === "miner") return $("minerSlot" + m.slot);
    if (m.kind === "polisher")
      return $("polisherAction" + m.slot)?.parentElement;
    return $(m.kind === "furnace" ? "furnaceCard" : "refinerPanel");
  }
  function clear() {
    epoch++;
    for (const b of [...effects.values()]) b.clear();
    effects.clear();
  }
  function pulse(node, fact, priority = 0) {
    if (!node || blocked() || !node.getClientRects().length) return;
    const existing = effects.get(node);
    if (existing) {
      if (existing.priority > priority) return;
      existing.clear();
    }
    if (effects.size >= 4) {
      const weakest = [...effects.entries()].sort(
        (a, b) => a[1].priority - b[1].priority,
      )[0];
      if (weakest[1].priority > priority) return;
      weakest[1].clear();
    }
    let layer, animation;
    const burst = MiningFeedbackModel.createBurst({
      duration: 1100,
      render() {
        layer = document.createElement("span");
        layer.className = "factory-effect";
        layer.dataset.effect = fact.type;
        layer.setAttribute("aria-hidden", "true");
        const text = document.createElement("span");
        text.className = "factory-effect-label";
        text.textContent = fact.label;
        layer.append(text);
        if (!motion.matches) {
          for (let i = 0; i < (priority >= 1 ? 6 : 3); i++) {
            const p = document.createElement("i");
            p.style.setProperty("--spark", i);
            layer.append(p);
          }
          animation = layer.animate(
            [
              { opacity: 0, transform: "translateY(3px)" },
              { opacity: 1, transform: "translateY(0)", offset: 0.15 },
              { opacity: 1, offset: 0.75 },
              { opacity: 0, transform: "translateY(-5px)" },
            ],
            { duration: 1100 },
          );
        }
        node.classList.add("factory-effect-host");
        node.append(layer);
      },
      clearView() {
        animation?.cancel();
        layer?.remove();
        effects.delete(node);
      },
    });
    effects.set(node, { priority, clear: burst.clear });
    burst.push({ tier: 0, rewards: [] });
  }
  function sync(state, now = Date.now()) {
    if (blocked()) {
      clear();
      return;
    }
    const active = new Set();
    if (state?.developmentProfile !== "miner-1") {
      for (const [id, key] of [
        ["legacyDropperOverview", "droppers"],
        ["adderCard", "adders"],
        ["multiplierCard", "multipliers"],
      ]) {
        const node = $(id);
        if (node) {
          active.add(node);
          const status = state[key] > 0 ? "active modifier" : "idle";
          if (node.dataset.production !== status)
            node.dataset.production = status;
        }
      }
    }
    for (const m of FactoryFeedbackModel.machines(state)) {
      const kind = m.id.split(":")[0],
        node = host({ ...m, kind });
      if (!node) continue;
      active.add(node);
      const p = FactoryFeedbackModel.progress(m.cycle, now);
      if (!p) continue;
      if (node.dataset.production !== p.state)
        node.dataset.production = p.state;
      const bar =
        kind === "miner"
          ? $("minerSlotProgress" + m.slot)
          : kind === "polisher"
            ? $("polisherSlotProgress" + m.slot)
            : $(
                kind === "refiner"
                  ? "refinerProgress"
                  : "canonicalFurnaceProgress",
              );
      if (bar) {
        const label =
          p.state +
          (p.remainingMs
            ? " · " + (p.remainingMs / 1000).toFixed(1) + "s remaining"
            : "");
        if (bar.getAttribute("aria-valuetext") !== label)
          bar.setAttribute("aria-valuetext", label);
        if (bar.title !== label) bar.title = label;
        if (kind === "furnace") {
          let status = $("factoryFurnaceTiming");
          if (!status) {
            status = document.createElement("small");
            status.id = "factoryFurnaceTiming";
            bar.after(status);
          }
          const text =
            p.state === "idle"
              ? "Idle"
              : p.state +
                " · " +
                Math.floor(p.percent) +
                "%" +
                (p.remainingMs
                  ? " · " + (p.remainingMs / 1000).toFixed(1) + "s remaining"
                  : "");
          if (status.textContent !== text) status.textContent = text;
        }
      }
    }
    for (const n of document.querySelectorAll("[data-production]"))
      if (!active.has(n)) delete n.dataset.production;
    for (const [node, b] of effects)
      if (
        !node.isConnected ||
        !node.getClientRects().length ||
        (!active.has(node) &&
          node.id !== "notificationRegion" &&
          !node.closest(".progress-block"))
      )
        b.clear();
  }
  function committed(previous, next) {
    if (seen.has(next)) return;
    seen.add(next);
    if (previous?.rebirthCount !== next.rebirthCount) {
      clear();
      return;
    }
    sync(next);
    const facts = FactoryFeedbackModel.events(previous, next);
    const generation = epoch;
    queueMicrotask(() => {
      if (generation !== epoch) return;
      try {
        for (const f of facts) {
          if (
            typeof save !== "undefined" &&
            !FactoryFeedbackModel.machines(save).some((m) => m.id === f.id)
          )
            continue;
          if (f.type === "activation" && f.kind !== "furnace") continue;
          const label =
            f.type === "activation"
              ? "Ignition"
              : f.kind === "furnace"
                ? "Batch delivered · $" +
                  f.cash.toLocaleString("en-US", { maximumFractionDigits: 20 })
                : f.kind === "refiner"
                  ? f.outputs.reduce((n, l) => n + l.amount, 0) +
                    " survived · " +
                    f.destroyed +
                    " destroyed · +" +
                    f.dust +
                    " Dust"
                  : "Output delivered";
          pulse(
            host(f),
            {
              ...f,
              type:
                f.kind === "refiner" && f.destroyed && !f.outputs.length
                  ? "destroyed"
                  : f.type,
              label,
            },
            f.type === "completion" ? 0.5 : 0,
          );
        }
      } catch (error) {
        clear();
        console.warn("Factory effect unavailable", error);
      }
    });
  }
  function notice(current, node) {
    const token = current.presentationToken || current;
    if (
      token.suppressAnimation ||
      celebrated.has(token) ||
      !["achievement", "milestone", "level", "rebirth"].includes(current.type)
    )
      return;
    celebrated.add(token);
    // GAME20 selected a new notice: an older celebration must not suppress it.
    effects.get(node)?.clear();
    pulse(
      current.type === "level"
        ? $("factoryLevel")?.closest(".progress-block")
        : node,
      {
        type: current.type,
        label:
          current.type === "level"
            ? current.title
            : current.type === "rebirth"
              ? "Rebirth complete"
              : "Permanently recorded",
      },
      current.type === "level" ? 1 : current.type === "milestone" ? 2 : 3,
    );
  }
  function start() {
    const observer = new MutationObserver(() => {
      if (blocked()) clear();
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "inert", "style"],
    });
    document.addEventListener("visibilitychange", () => {
      clear();
      if (document.hidden && globalThis.TEFINotifications) {
        const q = TEFINotifications.snapshot();
        for (const n of [q.current, ...q.waiting])
          if (n?.presentationToken) celebrated.add(n.presentationToken);
      }
      if (!document.hidden && typeof save !== "undefined") sync(save);
    });
    motion.addEventListener("change", clear);
    window.addEventListener(
      "pagehide",
      () => {
        clear();
        observer.disconnect();
      },
      { once: true },
    );
  }
  globalThis.TEFIFactoryFeedback = {
    committed,
    sync,
    notice,
    clear,
    snapshot: () => ({
      effects: effects.size,
      particles: document.querySelectorAll(".factory-effect i").length,
    }),
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
