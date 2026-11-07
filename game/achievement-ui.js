/* GAME23: presentation only; claims use the authoritative runtime command. */
(() => {
  "use strict";
  const modal = document.getElementById("achievementsModal"),
    root = document.getElementById("achievementItems");
  let signature = "",
    returnFocus = null;
  const make = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  function render() {
    const facts = Object.entries(ACHIEVEMENTS).map(([id, a]) => ({
      id,
      ...a,
      ...AchievementModel.progress(save, id),
      state: save.achievements[id]?.claimed
        ? "claimed"
        : save.achievements[id]?.unlocked
          ? "unlocked"
          : "locked",
    }));
    const next = JSON.stringify(facts);
    if (next === signature && root.children.length) return;
    signature = next;
    const focus = root.contains(document.activeElement)
        ? document.activeElement.id
        : null,
      scroll = root.scrollTop;
    const note = make(
      "p",
      "Claims record completion only. Achievement rewards remain deferred.",
      "achievement-note",
    );
    const summary = make(
      "p",
      facts.filter((a) => a.state !== "locked").length +
        " / 6 unlocked · " +
        facts.filter((a) => a.state === "claimed").length +
        " claimed",
      "achievement-summary",
    );
    const grid = make("div", undefined, "achievement-grid");
    for (const a of facts) {
      const card = make("section", undefined, "achievement-card " + a.state);
      card.id = "achievement-" + a.id;
      card.tabIndex = 0;
      card.dataset.id = a.id;
      card.setAttribute("aria-labelledby", card.id + "-title");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        use = document.createElementNS(svg.namespaceURI, "use");
      svg.setAttribute("viewBox", "0 0 32 32");
      svg.setAttribute("aria-hidden", "true");
      use.setAttribute(
        "href",
        "assets/ui/icons.svg#" +
          (a.state === "locked" ? "locked" : "achievements"),
      );
      svg.append(use);
      const title = make("h3", a.name);
      title.id = card.id + "-title";
      const status = make(
        "strong",
        a.state[0].toUpperCase() + a.state.slice(1),
        "achievement-state",
      );
      const label = make(
        "p",
        a.current.toLocaleString("en-US") +
          " / " +
          a.target.toLocaleString("en-US") +
          " " +
          a.unit,
        "achievement-progress-label",
      );
      label.id = card.id + "-progress";
      const progress = make("progress");
      progress.max = a.target;
      progress.value = a.current;
      progress.setAttribute("aria-labelledby", label.id);
      card.append(
        svg,
        title,
        make("p", a.description),
        status,
        label,
        progress,
      );
      if (a.state === "unlocked") {
        const b = make("button", "Record claim");
        b.id = "claim-" + a.id;
        b.type = "button";
        b.dataset.claim = a.id;
        b.setAttribute("aria-label", "Record claim: " + a.name);
        card.append(b);
      }
      grid.append(card);
    }
    root.replaceChildren(summary, note, grid);
    root.scrollTop = scroll;
    if (focus) {
      const target =
        document.getElementById(focus) ||
        document.getElementById(focus.replace("claim-", "achievement-"));
      target?.focus({ preventScroll: true });
    }
  }
  function open(id) {
    returnFocus = document.activeElement;
    render();
    modal.style.display = "block";
    const card = Object.hasOwn(ACHIEVEMENTS, id)
      ? document.getElementById("achievement-" + id)
      : null;
    (card || modal.querySelector(".close-button")).focus();
    card?.scrollIntoView({ block: "nearest" });
  }
  function close() {
    modal.style.display = "none";
    if (returnFocus?.isConnected && returnFocus.getClientRects().length)
      returnFocus.focus({ preventScroll: true });
    else document.getElementById("achievementsButton").focus();
    returnFocus = null;
  }
  root.addEventListener("click", (event) => {
    const b = event.target.closest("button[data-claim]");
    if (b) claimAchievement(b.dataset.claim);
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const all = [
        ...modal.querySelectorAll('button:not([disabled]),[tabindex="0"]'),
      ],
      first = all[0],
      last = all.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.AchievementView = Object.freeze({ render, open, close });
})();
