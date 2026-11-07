/* GAME22: read-only Collection book. All ownership remains in save.oreCollection. */
(() => {
  "use strict";
  const modal = document.getElementById("collectionModal"),
    root = document.getElementById("collectionBook");
  let signature = "",
    selected = null,
    returnFocus = null,
    current = null;
  const make = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const icon = (id) => {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      u = document.createElementNS(s.namespaceURI, "use");
    s.setAttribute("viewBox", "0 0 32 32");
    s.setAttribute("aria-hidden", "true");
    u.setAttribute("href", "assets/ui/icons.svg#" + id);
    s.append(u);
    return s;
  };
  function render() {
    const facts = CollectionModel.snapshot(ORES, save.oreCollection),
      next = JSON.stringify(facts);
    if (next === signature && current?.isConnected) return;
    signature = next;
    const scroll = root.querySelector(".collection-tiers")?.scrollTop || 0,
      focus = document.activeElement?.id;
    const summary = make(
      "p",
      `Collection Progress: ${facts.discovered} / ${facts.total} — ${facts.percentage}%`,
      "collection-progress-label",
    );
    summary.id = "collectionProgressLabel";
    const progress = make("progress");
    progress.id = "collectionProgress";
    progress.max = facts.total;
    progress.value = facts.discovered;
    progress.setAttribute("aria-labelledby", summary.id);
    const note = make(
      "p",
      "Permanent acquisitions, not spendable inventory. Selling, processing and Rebirth preserve discoveries.",
      "collection-note",
    );
    const layout = make("div", undefined, "collection-layout"),
      tiers = make("div", undefined, "collection-tiers");
    tiers.tabIndex = 0;
    tiers.id = "collectionTierList";
    tiers.setAttribute("aria-label", "Base ore catalogue by tier");
    const detail = make("section", undefined, "collection-detail");
    detail.id = "collectionDetail";
    detail.tabIndex = 0;
    detail.setAttribute("aria-label", "Selected discovered ore details");
    for (const tier of [...new Set(facts.entries.map((e) => e.tier))]) {
      const section = make("section"),
        heading = make("h3", "Tier " + tier),
        grid = make("div", undefined, "collection-entry-grid");
      heading.id = "collection-tier-" + tier;
      section.setAttribute("aria-labelledby", heading.id);
      for (const e of facts.entries.filter((e) => e.tier === tier)) {
        const card = make(
          e.discovered ? "button" : "div",
          undefined,
          "collection-entry " + (e.discovered ? "discovered" : "unknown"),
        );
        card.id = "collection-slot-" + e.slot;
        if (e.discovered) {
          card.type = "button";
          card.dataset.oreId = e.id;
          card.setAttribute("aria-pressed", String(selected === e.id));
          card.setAttribute("aria-controls", "collectionDetail");
          card.append(
            icon(e.icon),
            make("strong", e.name),
            make("span", "Discovered"),
          );
        } else {
          card.append(
            icon("locked"),
            make("strong", "???"),
            make("span", "Undiscovered"),
          );
          card.setAttribute(
            "aria-label",
            "Undiscovered ore · Tier " + tier + " · entry " + e.slot,
          );
        }
        grid.append(card);
      }
      section.append(heading, grid);
      tiers.append(section);
    }
    layout.append(tiers, detail);
    root.replaceChildren(summary, progress, note, layout);
    current = layout;
    tiers.scrollTop = scroll;
    showDetails(facts);
    if (focus && root.contains(document.activeElement) === false)
      document.getElementById(focus)?.focus({ preventScroll: true });
  }
  function showDetails(
    facts = CollectionModel.snapshot(ORES, save.oreCollection),
  ) {
    const target = document.getElementById("collectionDetail"),
      e = facts.entries.find((e) => e.discovered && e.id === selected);
    for (const b of root.querySelectorAll("button[data-ore-id]"))
      b.setAttribute("aria-pressed", String(b.dataset.oreId === e?.id));
    if (!e) {
      selected = null;
      target.replaceChildren(
        icon("collection"),
        make("h3", "Your discovery book"),
        make(
          "p",
          "Select a discovered ore to inspect it. Unknown entries reveal their identity only after acquisition.",
        ),
      );
      return;
    }
    const heading = make("h3", e.name);
    heading.id = "collectionDetailTitle";
    const dl = make("dl");
    for (const [label, value] of [
      ["Ore tier", "Tier " + e.tier],
      ["Base ore value", "$" + e.baseValue.toLocaleString("en-US")],
      [
        "Catalogue rarity (tier reference)",
        "1 in " + e.rarity.toLocaleString("en-US"),
      ],
      ["Cumulative acquired", e.amount.toLocaleString("en-US")],
      ["Discovery status", "Permanently discovered"],
    ])
      dl.append(make("dt", label), make("dd", value));
    target.replaceChildren(
      icon(e.icon),
      heading,
      dl,
      make(
        "p",
        "Catalogue rarity is a reference, not your current drop chance. Actual selection depends on the mining source, access and Luck.",
        "collection-note",
      ),
    );
  }
  function open(id) {
    returnFocus = document.activeElement;
    render();
    modal.style.display = "block";
    const entry =
      typeof id === "string"
        ? [...root.querySelectorAll("button[data-ore-id]")].find(
            (b) => b.dataset.oreId === id,
          )
        : null;
    if (entry) {
      selected = id;
      showDetails();
      entry.scrollIntoView({ block: "nearest" });
      entry.focus({ preventScroll: true });
    } else modal.querySelector(".close-button").focus();
  }
  function close() {
    modal.style.display = "none";
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }
  root.addEventListener("click", (event) => {
    const b = event.target.closest("button[data-ore-id]");
    if (!b) return;
    selected = b.dataset.oreId;
    showDetails();
    document.getElementById("collectionDetail").focus({ preventScroll: true });
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...modal.querySelectorAll('button,[tabindex="0"]')],
      first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.CollectionView = Object.freeze({ render, open, close });
})();
