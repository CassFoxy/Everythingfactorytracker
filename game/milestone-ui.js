/* Presentation only: render validated canonical facts, never award or save. */
(() => {
  "use strict";
  let current = null,
    signature = "",
    filter = "all";
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function render({ earned, level }) {
    const summary = MilestoneModel.summary(earned);
    const nextSignature = JSON.stringify({ earned, level });
    if (signature === nextSignature && current?.root.isConnected) return;
    signature = nextSignature;
    const container = document.getElementById("milestoneItems");
    container.classList.add("canonical-milestones");
    if (!current?.root.isConnected) {
      const root = node("section");
      const heading = node("h3");
      heading.id = "milestoneSummary";
      const status = node("p");
      status.id = "milestoneNext";
      const progress = node("progress");
      progress.id = "milestoneProgress";
      progress.max = MilestoneModel.levels.length;
      progress.setAttribute("aria-labelledby", heading.id);
      const controls = node("div", undefined, "milestone-controls");
      const label = node("label", "Show milestones ");
      const select = node("select");
      select.id = "milestoneFilter";
      for (const [value, text] of [
        ["all", "All 250"],
        ["earned", "Completed"],
        ["next", "Incomplete"],
      ]) {
        const option = node("option", text);
        option.value = value;
        select.append(option);
      }
      select.value = filter;
      label.append(select);
      const jump = node("button", "Go to next milestone");
      jump.type = "button";
      jump.id = "milestoneJump";
      const list = node("div", undefined, "canonical-milestone-list");
      list.id = "canonicalMilestoneList";
      list.setAttribute("role", "list");
      list.setAttribute("aria-label", "Canonical Factory milestones");
      list.tabIndex = 0;
      controls.append(label, jump);
      root.append(heading, progress, status, controls, list);
      container.replaceChildren(root);
      current = {
        root,
        heading,
        status,
        progress,
        select,
        jump,
        list,
        earned,
        level,
      };
      select.addEventListener("change", () => {
        filter = select.value;
        renderList();
      });
      jump.addEventListener("click", () => {
        const next = MilestoneModel.summary(current.earned).next;
        if (next === null) return;
        filter = "next";
        select.value = filter;
        renderList();
        const target = document.getElementById("canonical-milestone-" + next);
        target?.scrollIntoView({ block: "nearest" });
        target?.focus({ preventScroll: true });
      });
    }
    Object.assign(current, { earned, level });
    current.heading.textContent =
      summary.completed + " / 250 Milestones Completed";
    current.progress.value = summary.completed;
    current.status.textContent =
      "Current Factory Level: " +
      level.toLocaleString() +
      " · " +
      (summary.next === null
        ? "All canonical milestones completed."
        : "Next: Factory Level " +
          summary.next.toLocaleString() +
          " · " +
          Math.max(0, summary.next - level).toLocaleString() +
          " levels remaining.");
    current.jump.disabled = summary.next === null;
    renderList();
  }
  function renderList() {
    const scroll = current.list.scrollTop;
    const focusedId = current.list.contains(document.activeElement)
      ? document.activeElement.id
      : null;
    const elements = MilestoneModel.definitions
      .filter(
        ({ level }) =>
          filter === "all" ||
          (filter === "earned"
            ? current.earned[level]
            : !current.earned[level]),
      )
      .map((definition) => {
        const earned = current.earned[definition.level];
        const entry = node(
          "div",
          undefined,
          "milestone-item " +
            (earned ? "milestone-unlocked" : "milestone-locked"),
        );
        entry.id = "canonical-milestone-" + definition.level;
        entry.dataset.milestoneId = definition.id;
        entry.tabIndex = -1;
        entry.setAttribute("role", "listitem");
        const icon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        icon.setAttribute("viewBox", "0 0 32 32");
        icon.setAttribute("aria-hidden", "true");
        const use = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use",
        );
        use.setAttribute(
          "href",
          "assets/ui/icons.svg#" + (earned ? "milestones" : "locked"),
        );
        icon.append(use);
        const text = node("div");
        text.append(
          node("strong", "Factory Level " + definition.level.toLocaleString()),
          node("span", earned ? "Completed" : "Incomplete"),
        );
        entry.append(icon, text);
        return entry;
      });
    current.list.replaceChildren(...elements);
    if (!elements.length)
      current.list.append(node("p", "No milestones match this filter."));
    current.list.scrollTop = scroll;
    if (focusedId)
      (document.getElementById(focusedId) || current.list).focus({
        preventScroll: true,
      });
  }
  const modal = document.getElementById("milestonesModal");
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || getComputedStyle(modal).display === "none")
      return;
    const controls = [
      ...modal.querySelectorAll(
        'button:not(:disabled),select,[tabindex="0"],summary',
      ),
    ].filter((n) => !n.closest("[hidden]"));
    if (event.shiftKey && document.activeElement === controls[0]) {
      event.preventDefault();
      controls.at(-1)?.focus();
    } else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
      event.preventDefault();
      controls[0]?.focus();
    }
  });
  window.MilestoneView = Object.freeze({ render });
})();
