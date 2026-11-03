# TEFI illustrated dashboard assets

Original UI02 artwork, served locally without a CDN or font dependency.

- `icons.svg`: crisp 32×32 SVG symbols for all 21 raw resources, nine Pickaxes, three materials, currencies, actions and machine states. `icons.json` lists the symbol IDs; `compact-ui.js` owns the presentation mapping.
- `mine.webp`: original generated cavern illustration, exported as WebP.
- `machines.webp`: original generated transparent 2×2 machine atlas: Miner / Polisher / Refiner / Furnace. CSS uses quadrant positions; ownership, tier and status remain live HTML labels.

Illustration direction: dark charcoal stone, copper machinery, warm lantern light, crisp detailed pixel-art styling, no lettering. Cavern prompt requested timber braces, a central rock face and amber/purple/cyan deposits. Machine prompt requested a drill-and-belt Miner, wheel Polisher, violet-chamber Refiner and glowing stone Furnace, isolated in four equal atlas quadrants. Images were created with OpenAI image generation for this ticket; SVG artwork was authored locally. Decorative deposits do not add resources or gameplay.

The presentation adapter retains existing control nodes and IDs. Factory/Shop tabs hide inactive categories without stopping production or replacing machine state. Inventory tabs reparent the original cohort lists. Mining feedback observes committed manual-click counts; it does not award, reserve, persist or reroll anything. Reduced-motion mode disables decorative animation.

Desktop shells above 1100 CSS pixels fit the viewport with internal scrolling. Tablet/mobile use document scrolling. Gameplay, models, save format, legacy authority and transaction code are unchanged. Browser coverage exercises real tab navigation, keyboard controls, all requested viewports, failed-write feedback and existing gameplay regressions.
