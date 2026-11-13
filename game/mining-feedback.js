/* GAME24: local cosmetic feedback. No RNG, save writes, rewards or game loop. */
(() => {
  "use strict";
  let layer = null,
    pick = null,
    scene = null,
    animations = [],
    observer = null,
    latestFact = null;
  const seen = new WeakSet(),
    motion = matchMedia("(prefers-reduced-motion: reduce)");
  const burst = MiningFeedbackModel.createBurst({ render, clearView });
  function clearView() {
    for (const a of animations) a.cancel();
    animations = [];
    layer?.replaceChildren();
    if (pick) pick.style.visibility = "";
    if (layer) delete layer.dataset.tier;
  }
  function clear() {
    burst.clear();
  }
  function animate(node, frames, options) {
    if (motion.matches || !node.animate) return;
    const a = node.animate(frames, options);
    animations.push(a);
    a.finished.then(
      () => {
        if (node.classList.contains("mining-swing")) {
          node.remove();
          pick.style.visibility = "";
        }
        animations = animations.filter((x) => x !== a);
      },
      () => {},
    );
  }
  function render(fact) {
    latestFact = fact;
    if (!layer || document.hidden) return;
    clearView();
    layer.dataset.tier = String(fact.tier);
    const card = document.createElement("div");
    card.className = "ui-float mining-rewards";
    card.dataset.awards = String(fact.rewards.length);
    card.title = "Committed awards in this mining burst";
    for (const r of fact.rewards) {
      const row = document.createElement("span");
      row.className = "mining-reward";
      row.dataset.resource = r.id;
      row.dataset.amount = r.amount;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        use = document.createElementNS(svg.namespaceURI, "use");
      svg.setAttribute("viewBox", "0 0 32 32");
      use.setAttribute("href", "assets/ui/icons.svg#" + r.id);
      svg.append(use);
      const text = document.createElement("span");
      text.textContent =
        "+" + BigInt(r.amount).toLocaleString("en-US") + " " + r.name;
      row.append(svg, text);
      card.append(row);
    }
    layer.append(card);
    if (motion.matches) return;
    const swing = pick.cloneNode(true);
    swing.classList.add("mining-swing");
    swing
      .querySelector("use")
      .setAttribute("href", "assets/ui/icons.svg#pickaxe" + fact.pickaxeTier);
    swing.style.visibility = "visible";
    pick.style.visibility = "hidden";
    layer.append(swing);
    animate(
      swing,
      [
        { transform: "rotate(-32deg)" },
        { transform: "rotate(26deg) translateY(5px)", offset: 0.42 },
        { transform: "rotate(-15deg)" },
      ],
      { duration: 260, easing: "ease-out" },
    );
    animate(
      card,
      [
        { opacity: 0, transform: "translateY(7px)" },
        { opacity: 1, transform: "translateY(0)", offset: 0.12 },
        { opacity: 1, transform: "translateY(-6px)", offset: 0.8 },
        { opacity: 0, transform: "translateY(-15px)" },
      ],
      { duration: 1300, fill: "forwards", easing: "ease-out" },
    );
    const impact = document.createElement("i");
    impact.className = "mining-impact";
    layer.append(impact);
    const count = 2 + fact.tier * 2;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      p.className = "mining-particle";
      p.style.setProperty(
        "--dx",
        (i % 2 ? -1 : 1) * (10 + Math.floor(i / 2) * 9) + "px",
      );
      p.style.setProperty("--dy", -16 - (i % 3) * 12 + "px");
      layer.append(p);
    }
  }
  function committed(before, after) {
    if (seen.has(after)) return;
    seen.add(after);
    if (before.rebirthCount !== after.rebirthCount) {
      clear();
      return;
    }
    const fact = MiningFeedbackModel.event(before, after, ORES);
    if (!fact || document.hidden) return;
    burst.push(fact);
  }
  function start() {
    scene = document.querySelector(".mine-scene");
    pick = scene?.querySelector(".ui-mine-pick");
    layer = scene?.querySelector(".ui-mine-floats");
    if (!layer || !pick) return;
    layer.classList.add("mining-effects");
    layer.setAttribute("aria-hidden", "true");
    observer = new MutationObserver(() => {
      if (
        recoveryState.active ||
        pendingDevelopmentWrite ||
        document.getElementById("gameRoot").hidden
      )
        clear();
    });
    for (const id of ["gameRoot", "saveRecovery", "developmentWriteRecovery"])
      observer.observe(document.getElementById(id), {
        attributes: true,
        attributeFilter: ["hidden", "inert"],
      });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
  window.addEventListener("pagehide", () => {
    clear();
    observer?.disconnect();
  });
  motion.addEventListener("change", () => {
    if (latestFact && burst.snapshot().rewards.length) render(latestFact);
    else clear();
  });
  window.TEFIMiningFeedback = Object.freeze({
    committed,
    clear,
    snapshot: () => ({
      ...burst.snapshot(),
      activeAnimations: animations.length,
    }),
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
