/* UI02 presentation adapter. No saved data or gameplay calculations are changed. */
(() => {
  "use strict";
  const asset = "assets/ui/",
    NS = "http://www.w3.org/2000/svg";
  const resources = [
    "stone",
    "amber",
    "amethyst",
    "malachite",
    "quartz",
    "topaz",
    "aquamarine",
    "citrine",
    "garnet",
    "jade",
    "peridot",
    "emerald",
    "ruby",
    "sapphire",
    "spinel",
    "tourmaline",
    "alexandrite",
    "blackOpal",
    "diamond",
    "onyx",
    "tanzanite",
  ];
  const pickaxeNames = [
    "Default",
    "Amber",
    "Malachite",
    "Citrine",
    "Aquamarine",
    "Spinel",
    "Emerald",
    "Onyx",
    "Diamond",
  ];
  const icons = Object.freeze({
    resources: Object.fromEntries(resources.map((id) => [id, id])),
    currencies: ["cash", "stardust", "gemDust"],
    materials: ["wood", "scrap", "metal"],
    machines: {
      miner: "0% 0%",
      polisher: "100% 0%",
      refiner: "0% 100%",
      furnace: "100% 100%",
    },
    actions: [
      "mine",
      "upgrade",
      "purchase",
      "sell",
      "repair",
      "craft",
      "rebirth",
      "inventory",
      "collection",
      "statistics",
      "achievements",
      "milestones",
      "settings",
    ],
    statuses: [
      "active",
      "idle",
      "processing",
      "locked",
      "unaffordable",
      "max",
      "broken",
    ],
  });
  function el(tag, cls = "", value) {
    const n = document.createElement(tag);
    n.className = cls;
    if (value !== undefined) n.textContent = value;
    return n;
  }
  function icon(id, cls = "") {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("class", "ui-icon " + cls);
    s.setAttribute("viewBox", "0 0 32 32");
    s.setAttribute("aria-hidden", "true");
    const u = document.createElementNS(NS, "use");
    u.setAttribute("href", asset + "icons.svg#" + id);
    s.append(u);
    return s;
  }
  function art(kind, cls = "") {
    const n = el("span", "ui-machine-art " + cls);
    n.style.backgroundPosition = icons.machines[kind];
    n.setAttribute("aria-hidden", "true");
    return n;
  }
  function button(label, fn, id) {
    const b = el("button", "", label);
    b.type = "button";
    if (id) b.id = id;
    b.addEventListener("click", fn);
    return b;
  }
  function text(n, v) {
    if (n.textContent !== String(v)) n.textContent = v;
  }
  const name = (id) =>
    id
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());
  function setup() {
    const $ = (id) => document.getElementById(id),
      root = $("gameRoot");
    if (!root) return;
    const active = () =>
      typeof save !== "undefined" &&
      save &&
      typeof isMinerDevelopment === "function" &&
      isMinerDevelopment();
    document.body.classList.add("tefi-pixel-ui");
    const factory = document.querySelector(".factory-panel"),
      shop = document.querySelector(".shop-panel");
    const groups = {
      factory: {
        miners: ["minerPanel"],
        polishers: ["polisherPanel"],
        refiner: ["refinerPanel"],
        furnace: ["furnaceCard"],
      },
      shop: {
        mining: ["miningPowerCard", "miningLuckCard", "miningDuplicationCard"],
        machines: [
          "uiMachineAccess",
          "dropperCard",
          "adderCard",
          "multiplierCard",
        ],
        stardust: ["rebirthPanel"],
      },
    };
    const selected = { factory: "miners", shop: "mining" },
      tabs = {};
    function select(group, key, focus = false) {
      if (!groups[group][key]) return;
      selected[group] = key;
      for (const [k, ids] of Object.entries(groups[group])) {
        for (const id of ids)
          if ($(id)) $(id).dataset.uiActive = String(k === key);
        const b = tabs[group]?.[k];
        if (b) {
          b.setAttribute("aria-selected", String(k === key));
          b.tabIndex = k === key ? 0 : -1;
          if (focus && k === key) b.focus();
        }
      }
    }
    function tabbar(group, parent, labels) {
      const nav = el("div", "tefi-switcher");
      nav.setAttribute("role", "tablist");
      nav.setAttribute(
        "aria-label",
        group === "factory" ? "Factory categories" : "Shop categories",
      );
      tabs[group] = {};
      for (const [key, label] of Object.entries(labels)) {
        const b = button(
          label,
          () => select(group, key),
          "ui-" + group + "-" + key,
        );
        b.setAttribute("role", "tab");
        b.setAttribute("aria-controls", groups[group][key].join(" "));
        tabs[group][key] = b;
        nav.append(b);
        for (const id of groups[group][key])
          if ($(id)) {
            const n = $(id);
            n.classList.add("ui-category");
            n.dataset.uiGroup = group;
            n.dataset.uiCategory = key;
            n.setAttribute("aria-labelledby", b.id);
          }
      }
      nav.addEventListener("keydown", (e) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const keys = Object.keys(labels),
          i = keys.indexOf(selected[group]),
          next =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? keys.length - 1
                : (i + (e.key === "ArrowRight" ? 1 : -1) + keys.length) %
                  keys.length;
        select(group, keys[next], true);
      });
      parent.querySelector(".section-heading").after(nav);
      select(group, selected[group]);
    }
    const access = el("article", "shop-row");
    access.id = "uiMachineAccess";
    access.append(
      el("h3", "", "Machine access"),
      el(
        "p",
        "",
        "Manage each machine independently. Unlocking Miners does not purchase one.",
      ),
    );
    for (const [key, label] of [
      ["miners", "Miners"],
      ["polishers", "Polishers"],
      ["refiner", "Refiner"],
      ["furnace", "Furnace"],
    ]) {
      const b = button("Manage " + label, () => {
        select("factory", key);
        tabs.factory[key].focus();
      });
      b.prepend(
        art(
          key === "miners" ? "miner" : key === "polishers" ? "polisher" : key,
        ),
      );
      access.append(b);
    }
    shop.querySelector(".section-heading").after(access);
    tabbar("factory", factory, {
      miners: "Miners",
      polishers: "Polishers",
      refiner: "Refiner",
      furnace: "Furnace",
    });
    tabbar("shop", shop, {
      mining: "Mining",
      machines: "Machines",
      stardust: "Stardust",
    });
    const dock = el("div", "ui-furnace-dock"),
      dockText = el("div", "", "Furnace"),
      dockStatus = el("small");
    dockText.append(dockStatus);
    dock.append(
      art("furnace"),
      dockText,
      document.querySelector('#furnaceCard button[onclick="openFurnace()"]'),
    );
    factory.append(dock);
    for (const [parent, last] of [
      [factory, dock],
      [shop, null],
    ]) {
      const scroll = el("div", "ui-panel-scroll");
      for (const child of [...parent.children])
        if (!child.matches(".section-heading,.tefi-switcher,.ui-furnace-dock"))
          scroll.append(child);
      parent.insertBefore(scroll, last);
    }
    document.querySelector(".brand-icon").replaceChildren(icon("logo"));
    $("miningTitle").textContent = "Mining";
    $("factoryTitle").textContent = "Your Factory";
    $("shopTitle").textContent = "Shop & Upgrades";
    const wallet = el("div", "ui-wallet"),
      balances = {};
    document.querySelector(".cash-block").prepend(icon("cash"));
    wallet.append(document.querySelector(".cash-block"));
    for (const [id, label] of [
      ["gemDust", "Gem Dust"],
      ["stardust", "Stardust"],
    ]) {
      const box = el("div", "ui-currency " + id);
      box.append(icon(id), el("span", "", label));
      balances[id] = el("strong", "", "0");
      box.append(balances[id]);
      wallet.append(box);
    }
    document.querySelector(".game-header").append(wallet);
    const nav = document.querySelector(".secondary-nav");
    for (const [label, fn, id] of [
      ["Collection", () => openCollection(), "collection"],
      ["Inventory", () => openInventory(), "inventory"],
      ["Pickaxes", () => openDevelopmentPickaxes(), "craft"],
      [
        "Rebirth",
        () => {
          select("shop", "stardust");
          $("rebirthButton").focus();
        },
        "rebirth",
      ],
    ]) {
      const b = button(label, fn, "ui-nav-" + id);
      b.dataset.uiIcon = id;
      nav.insertBefore(b, nav.querySelector(".dev-tools"));
    }
    const scene = document.querySelector(".mine-scene");
    scene.replaceChildren();
    const pick = icon("pickaxe0", "ui-mine-pick"),
      floats = el("div", "ui-mine-floats");
    scene.append(pick, floats);
    scene.after($("mineButton"));
    $("mineButton").after($("equippedPickaxeSummary"));
    $("materialsSummary").classList.add("ui-material-line");
    $("pickaxesButton").classList.add("ui-quiet-button");
    const recent = el("div", "ui-recent"),
      recentGrid = el("div", "ui-recent-grid");
    recent.append(el("span", "eyebrow", "Available raw stock"), recentGrid);
    document.querySelector(".mining-links").before(recent);
    const lastIcon = icon("stone");
    document.querySelector(".mining-feedback").prepend(lastIcon);
    for (let i = 1; i <= 5; i++)
      $("minerSlot" + i)
        .querySelector("strong")
        .after(art("miner"));
    for (let i = 1; i <= 3; i++)
      $("polisherAction" + i)
        .parentElement.querySelector("strong")
        .after(art("polisher"));
    for (const card of document.querySelectorAll(".miner-slot")) {
      const status = el("span", "ui-slot-state");
      status.append(icon("idle"), el("span"));
      card.append(status);
    }
    $("minerDetailTitle").after(art("miner", "ui-detail-art"));
    $("polisherDetailTitle").after(art("polisher", "ui-detail-art"));
    $("refinerTitle").after(art("refiner", "ui-detail-art"));
    document
      .querySelector("#furnaceCard .machine-heading")
      .prepend(art("furnace", "ui-detail-art"));
    // Reparent original inventory nodes; historical cohorts and runtime IDs stay intact.
    const inventory = document.querySelector("#inventoryModal .modal-content"),
      processed = $("processedInventorySection"),
      raw = el("section", "ui-inventory-scope");
    raw.dataset.uiInventory = "raw";
    for (const child of [...inventory.children])
      if (!child.matches(".close-button,h2,#processedInventorySection"))
        raw.append(child);
    inventory.append(raw);
    for (const stage of ["polished", "refined"]) {
      const section = el("section", "ui-inventory-scope");
      section.dataset.uiInventory = stage;
      const list = $(stage + "InventoryList");
      section.append(list.previousElementSibling, list);
      processed.append(section);
    }
    const extras = {};
    for (const stage of ["materials", "pickaxes"]) {
      const section = el("section", "ui-inventory-scope");
      section.dataset.uiInventory = stage;
      extras[stage] = section;
      inventory.append(section);
    }
    let inventoryStage = "raw";
    const invNav = el("div", "tefi-switcher ui-inventory-tabs");
    invNav.setAttribute("role", "tablist");
    invNav.setAttribute("aria-label", "Inventory stages");
    function selectInventory(stage) {
      inventoryStage = stage;
      inventory.dataset.uiStage = stage;
      for (const n of inventory.querySelectorAll("[data-ui-inventory]"))
        n.hidden = n.dataset.uiInventory !== stage;
      for (const b of invNav.children) {
        b.setAttribute("aria-selected", String(b.dataset.stage === stage));
        b.tabIndex = b.dataset.stage === stage ? 0 : -1;
      }
    }
    for (const stage of [
      "raw",
      "polished",
      "refined",
      "materials",
      "pickaxes",
    ]) {
      const b = button(
        name(stage),
        () => selectInventory(stage),
        "ui-inventory-" + stage,
      );
      b.dataset.stage = stage;
      b.setAttribute("role", "tab");
      invNav.append(b);
    }
    invNav.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const bs = [...invNav.children],
        i = bs.findIndex((b) => b.dataset.stage === inventoryStage),
        b = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length];
      b.click();
      b.focus();
    });
    $("inventoryModalTitle").after(invNav);
    selectInventory("raw");
    for (const id of resources) {
      const count = $("inv" + id[0].toUpperCase() + id.slice(1));
      if (count) {
        count.parentElement.classList.add("ui-resource-row");
        count.parentElement.prepend(icon(id));
      }
      const label = $(id + "Label");
      if (label) label.parentElement.prepend(icon(id));
    }
    const buttonIcons = {
      mineButton: "mine",
      upgradeMiner: "upgrade",
      upgradeMinerOreLuck: "luck",
      upgradePolisher: "upgrade",
      upgradeRefiner: "upgrade",
      upgradeFurnace: "upgrade",
      sellMiner: "sell",
      sellPolisher: "sell",
      sellRefiner: "sell",
      rebirthButton: "rebirth",
      permanentPerksButton: "stardust",
      pickaxesButton: "craft",
      unlockMiner: "locked",
      buyRefiner: "purchase",
    };
    const actionNames = [
      ["Statistics", "statistics"],
      ["Milestones", "milestones"],
      ["Achievements", "achievements"],
      ["Collection", "collection"],
      ["Inventory", "inventory"],
      ["Produce Ore", "mine"],
      ["Open Furnace", "processing"],
      ["Crafting", "craft"],
      ["Dev tools", "settings"],
    ];
    function decorate() {
      for (const n of document.querySelectorAll(
        "button,.secondary-nav summary,h2,h3,h4",
      )) {
        if (n.querySelector(":scope > .ui-icon")) continue;
        let key =
          buttonIcons[n.id] ||
          n.dataset.uiIcon ||
          actionNames.find(([label]) => n.textContent.includes(label))?.[1];
        if (n.closest(".pickaxe-card")) {
          const tier = pickaxeNames.findIndex((label) =>
            n.textContent.startsWith(label),
          );
          if (n.tagName === "H4" && tier >= 0) key = "pickaxe" + tier;
          if (n.id.startsWith("craft-")) key = "craft";
          if (n.id.startsWith("repair-")) key = "repair";
        }
        if (n.matches("#minerPanel>h3")) key = "mine";
        if (n.matches("#polisherPanel>h3")) key = "craft";
        if (n.matches("#refinerPanel>h3")) key = "gemDust";
        if (n.matches(".perk-row h4")) key = "stardust";
        if (n.id === "miningTitle") key = "mine";
        if (n.id === "shopTitle") key = "purchase";
        if (n.tagName === "H3")
          for (const [id, k] of [
            ["miningPowerCard", "pickaxe0"],
            ["miningLuckCard", "luck"],
            ["miningDuplicationCard", "duplication"],
          ])
            if (n.closest("#" + id)) key = k;
        if (key) {
          if (
            n.tagName === "BUTTON" &&
            !n.hasAttribute("aria-label") &&
            !n.querySelector("span") &&
            /[\p{Extended_Pictographic}]/u.test(n.textContent)
          )
            n.setAttribute("aria-label", n.textContent.trim());
          for (const t of [...n.childNodes])
            if (t.nodeType === 3)
              t.textContent = t.textContent
                .replace(/[\p{Extended_Pictographic}\uFE0F\u2726\u25C6]/gu, "")
                .trimStart();
          n.prepend(icon(key));
        }
      }
      for (const list of [
        "polishedInventoryList",
        "refinedInventoryList",
        "polishedFurnaceItems",
        "furnaceItems",
      ])
        for (const row of $(list)?.children || []) {
          if (row.querySelector(".ui-icon")) continue;
          const id = resources.find((id) =>
            row.textContent.toLowerCase().includes(name(id).toLowerCase()),
          );
          if (id) row.prepend(icon(id));
        }
    }
    let clicks = active() ? save.statistics.lifetime.gameplay.manualClicks : 0,
      invSignature = "",
      recentSignature = "";
    function refresh() {
      const dev = active();
      document.body.classList.toggle("ui-legacy", !dev);
      for (const key of ["miners", "polishers", "refiner"])
        tabs.factory[key].hidden = !dev;
      tabs.shop.mining.hidden = !dev;
      tabs.shop.stardust.hidden = !dev;
      access.hidden = !dev;
      if (!dev) {
        select("factory", "furnace");
        select("shop", "machines");
      }
      for (const id of ["ui-nav-craft", "ui-nav-rebirth"]) $(id).hidden = !dev;
      text(balances.gemDust, dev ? save.gemDust.toLocaleString() : "—");
      text(
        balances.stardust,
        dev
          ? save.stardust.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          : "—",
      );
      text(
        dockStatus,
        $("furnaceName").textContent +
          " · Capacity " +
          $("furnaceCapacity").textContent,
      );
      if (dev) {
        const copies = save.manual.pickaxes,
          copy = copies.find((c) => c.id === save.manual.equippedPickaxeId);
        pick
          .querySelector("use")
          .setAttribute(
            "href",
            asset + "icons.svg#pickaxe" + (copy?.tier || 0),
          );
        const found = resources.find((id) =>
          save.lastOre.toLowerCase().includes(name(id).toLowerCase()),
        );
        lastIcon
          .querySelector("use")
          .setAttribute("href", asset + "icons.svg#" + (found || "stone"));
        const n = save.statistics.lifetime.gameplay.manualClicks;
        if (n > clicks) {
          scene.classList.remove("ui-impact");
          void scene.offsetWidth;
          scene.classList.add("ui-impact");
          const f = el("span", "ui-float", save.lastOre);
          f.prepend(icon(found || "stone"));
          if (found && resources.indexOf(found) > 10)
            f.classList.add("ui-rare");
          floats.replaceChildren(f);
          setTimeout(() => f.remove(), 1400);
        }
        clicks = n;
        for (let i = 1; i <= 5; i++) {
          const m = save.factory.miners.find((m) => m.slot === i),
            card = $("minerSlot" + i);
          card.dataset.uiState = m
            ? m.cycle
              ? "active"
              : "idle"
            : save.factory.minerSlots[i - 1]
              ? "vacant"
              : "locked";
          card.querySelector(".ui-machine-art").classList.toggle("ui-dim", !m);
          const state = card.dataset.uiState;
          card
            .querySelector(".ui-slot-state use")
            .setAttribute(
              "href",
              asset + "icons.svg#" + (state === "vacant" ? "purchase" : state),
            );
          text(card.querySelector(".ui-slot-state span"), name(state));
        }
        for (let i = 1; i <= 3; i++) {
          const card = $("polisherAction" + i).parentElement,
            m = save.factory.polishers.find((m) => m.slot === i),
            state = m ? (m.cycle ? "processing" : "idle") : "vacant";
          card
            .querySelector(".ui-slot-state use")
            .setAttribute(
              "href",
              asset + "icons.svg#" + (state === "vacant" ? "purchase" : state),
            );
          text(card.querySelector(".ui-slot-state span"), name(state));
        }
        const stock = resources
            .filter((id) => save.inventory[id] > 0)
            .slice(0, 4)
            .map((id) => [id, save.inventory[id]]),
          sig = JSON.stringify(stock);
        if (sig !== recentSignature) {
          recentSignature = sig;
          recentGrid.replaceChildren();
          for (const [id, amount] of stock) {
            const c = el("div");
            c.append(
              icon(id),
              el("small", "", name(id)),
              el("strong", "", "×" + amount.toLocaleString()),
            );
            recentGrid.append(c);
          }
          if (!stock.length)
            recentGrid.append(
              el("p", "ui-empty", "Your first finds will appear here."),
            );
        }
        const invSig = JSON.stringify([
          save.materials,
          save.manual,
          save.permanentPerks.pickaxeDurability,
        ]);
        if (invSig !== invSignature) {
          invSignature = invSig;
          extras.materials.replaceChildren();
          for (const [id, amount] of Object.entries(save.materials)) {
            const row = el("div", "ui-resource-row");
            row.append(
              icon(id),
              el("strong", "", name(id)),
              el("span", "", amount.toLocaleString()),
            );
            extras.materials.append(row);
          }
          extras.pickaxes.replaceChildren(
            button("Craft, equip or repair", () => openDevelopmentPickaxes()),
          );
          for (const c of [{ id: "pickaxe:default", tier: 0 }, ...copies]) {
            const row = el("div", "ui-resource-row");
            row.append(
              icon("pickaxe" + c.tier),
              el("strong", "", pickaxeNames[c.tier]),
              el(
                "span",
                "",
                c.id +
                  " · " +
                  (c.tier
                    ? c.remainingDurability +
                      " / " +
                      PermanentPerkModel.getDurability(
                        c.tier * 500,
                        save.permanentPerks.pickaxeDurability,
                      ) +
                      (c.remainingDurability ? " durability" : " · Broken")
                    : "Indestructible") +
                  (c.id === save.manual.equippedPickaxeId ? " · Equipped" : ""),
              ),
            );
            extras.pickaxes.append(row);
          }
        }
      }
      decorate();
    }
    // Coalesced DOM observation never reserves work or changes save authority.
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        observer.disconnect();
        refresh();
        observe();
      });
    });
    function observe() {
      observer.observe(root, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["hidden", "disabled", "data-selected"],
      });
    }
    refresh();
    observe();
    $("manualPowerLink").addEventListener("click", () =>
      select("shop", "mining"),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      for (const [id, close] of [
        ["inventoryModal", closeInventory],
        ["collectionModal", closeCollection],
        ["statsModal", closeStats],
        ["achievementsModal", closeAchievements],
        ["milestonesModal", closeMilestones],
      ]) {
        const modal = $(id);
        if (modal && getComputedStyle(modal).display !== "none") {
          close();
          break;
        }
      }
    });
    window.TEFIUI = Object.freeze({
      icons,
      selectFactory: (key) => select("factory", key),
      selectShop: (key) => select("shop", key),
      selectInventory,
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  else setup();
})();
