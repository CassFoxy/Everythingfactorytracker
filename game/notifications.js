/* GAME20 committed-state presentation adapter; no save writes or rewards. */
(() => {
  "use strict";
  let view = null,
    sequence = 0,
    returnFocus = null,
    critical = false;
  const delivered = new WeakSet(),
    eligibilitySeen = new Set();
  const queue = NotificationModel.createQueue({ onChange: render });
  const privateState = () =>
    typeof save !== "undefined" && save?.developmentProfile === "miner-1";
  function committed(previous, next) {
    if (next?.developmentProfile !== "miner-1" || delivered.has(next)) return;
    delivered.add(next);
    const catalog = {
      ores: ORE_KEYS.map((id) => ({ id, ...developmentOre(id) })),
      achievements: ACHIEVEMENTS,
      milestones: MilestoneModel.levels,
      shop: {
        miningPower: "Mining Power",
        miningLuck: "Mining Luck",
        miningDuplication: "Mining Duplication",
      },
      perks: PermanentPerkModel.definitions,
      pickaxes: [
        "Default",
        "Amber",
        "Malachite",
        "Citrine",
        "Aquamarine",
        "Spinel",
        "Emerald",
        "Onyx",
        "Diamond",
      ],
    };
    const facts = NotificationModel.events(previous, next, catalog).filter(
      (event) => {
        if (event.type !== "rebirthAvailable") return true;
        if (eligibilitySeen.has(next.rebirthCount)) return false;
        eligibilitySeen.add(next.rebirthCount);
        return true;
      },
    );
    const transaction = ++sequence;
    syncVisibility();
    queue.enqueueMany(
      facts.map((event, i) => ({ ...event, id: transaction + ":" + i, presentationToken: { suppressAnimation: document.hidden } })),
    );
  }
  function render(snapshot) {
    if (!view) return;
    const current = snapshot.current;
    view.region.hidden = !current || snapshot.paused;
    if (!current || snapshot.paused) return;
    // Stable buttons preserve focus while a notice changes or is preempted.
    const changed = view.region.dataset.notice !== current.id;
    view.region.dataset.notice = current.id;
    view.region.dataset.type = current.type;
    view.region.dataset.priority = current.priority;
    view.region.dataset.tier = current.tier || "";
    view.title.textContent = current.title;
    view.body.textContent = current.body;
    view.count.textContent = snapshot.waiting.length
      ? "+" + snapshot.waiting.length + " queued"
      : "";
    view.icon.setAttribute("href", "assets/ui/icons.svg#" + current.icon);
    view.open.hidden = !current.route;
    view.open.textContent =
      current.route === "rebirth" ? "Review Rebirth" : "View details";
    view.progress.style.setProperty(
      "--notice-duration",
      current.duration + "ms",
    );
    view.progress.style.animation = "none";
    void view.progress.offsetWidth;
    view.progress.style.animation = "";
    view.progress.style.animationPlayState = snapshot.held
      ? "paused"
      : "running";
    if (changed) {
      view.region.classList.remove("notice-enter");
      void view.region.offsetWidth;
      view.region.classList.add("notice-enter");
      view.live.textContent = current.title + ". " + current.body;
      try { globalThis.TEFIFactoryFeedback?.notice(current,view.region); } catch(error) { console.warn("Celebration unavailable",error); }
    }
  }
  function syncVisibility() {
    if (!view) return;
    const recovery =
      typeof recoveryState !== "undefined" && recoveryState.active;
    if (recovery && !critical) queue.clear();
    critical = !!recovery;
    const blocked =
      recovery ||
      !privateState() ||
      document.hidden ||
      !!pendingDevelopmentWrite ||
      [
        ...document.querySelectorAll(
          '.modal,[role="dialog"],#discoveryPopup,#milestonePopup',
        ),
      ].some((n) => !n.hidden && getComputedStyle(n).display !== "none");
    queue.setPaused(blocked);
  }
  function openDetails() {
    const current = queue.snapshot().current;
    if (!current) return;
    const target = current.route;
    returnFocus = view.open;
    queue.dismiss(current.id);
    const routes = {
      collection: openCollection,
      achievements: openAchievements,
      milestones: openMilestones,
      statistics: openStats,
      pickaxes: openDevelopmentPickaxes,
      perks: openPermanentPerks,
    };
    if (routes[target]) {
      if(target === "achievements"){
        openAchievements(current.recordId);
        syncVisibility();
        return;
      }
      if(target === "collection"){
        openCollection(current.resourceId);
        syncVisibility();
        return;
      }
      routes[target]();
      const dialogs = [
        ...document.querySelectorAll('.modal,[role="dialog"]'),
      ].filter((n) => !n.hidden && getComputedStyle(n).display !== "none");
      dialogs
        .at(-1)
        ?.querySelector('button,[href],input,select,[tabindex="0"]')
        ?.focus();
    } else if (target === "rebirth" || target === "shop") {
      TEFIUI.selectShop(target === "rebirth" ? "stardust" : "mining");
      document
        .getElementById(
          target === "rebirth" ? "rebirthButton" : "buyMiningPower",
        )
        .focus();
      returnFocus = null;
    } else {
      TEFIUI.selectFactory(target);
      document.getElementById("ui-factory-" + target).focus();
      returnFocus = null;
    }
    syncVisibility();
  }
  function start() {
    const region = document.createElement("section");
    region.id = "notificationRegion";
    region.className = "notification-region";
    region.hidden = true;
    region.setAttribute("aria-label", "Progress notifications");
    region.innerHTML =
      '<svg class="notice-icon" viewBox="0 0 32 32" aria-hidden="true"><use></use></svg><div class="notice-copy"><strong id="notificationTitle"></strong><p id="notificationBody"></p><span id="notificationCount"></span></div><div class="notice-actions"><button type="button" id="notificationOpen">View details</button><button type="button" id="notificationDismiss" aria-label="Dismiss notification">Dismiss</button></div><span class="notice-timer" aria-hidden="true"></span>';
    const live = document.createElement("div");
    live.id = "notificationLive";
    live.className = "notice-sr";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    // Keep the live region mounted when the visual card is hidden.
    document.querySelector(".secondary-nav").after(region, live);
    view = {
      region,
      live,
      title: region.querySelector("#notificationTitle"),
      body: region.querySelector("#notificationBody"),
      count: region.querySelector("#notificationCount"),
      icon: region.querySelector("use"),
      open: region.querySelector("#notificationOpen"),
      progress: region.querySelector(".notice-timer"),
    };
    region.querySelector("#notificationDismiss").onclick = () => {
      queue.dismiss();
      if (region.hidden) document.getElementById("mineButton").focus();
    };
    view.open.onclick = openDetails;
    let hovered = false;
    const hold = () =>
      queue.setHeld(hovered || region.contains(document.activeElement));
    region.addEventListener("mouseenter", () => {
      hovered = true;
      hold();
    });
    region.addEventListener("mouseleave", () => {
      hovered = false;
      hold();
    });
    region.addEventListener("focusin", hold);
    region.addEventListener("focusout", () => queueMicrotask(hold));
    const observer = new MutationObserver(() => {
      const wasPaused = queue.snapshot().paused;
      syncVisibility();
      if (wasPaused && !queue.snapshot().paused && returnFocus) {
        const target = returnFocus;
        returnFocus = null;
        (view.region.hidden
          ? document.getElementById("mineButton")
          : target
        ).focus();
      }
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "style", "inert"],
    });
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("pagehide", () => {
      queue.clear();
      observer.disconnect();
    });
    syncVisibility();
    render(queue.snapshot());
  }
  window.TEFINotifications = Object.freeze({
    committed,
    clear: () => queue.clear(),
    snapshot: queue.snapshot,
    dismiss: queue.dismiss,
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
