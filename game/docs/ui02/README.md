# UI02 visual review

- [Before: merged PR #57, fresh save at 1366×768](before.webp)
- [After: illustrated dashboard at 1920×1080](after-desktop.webp)
- [After: stacked mobile dashboard at 390×844](after-mobile.webp)

After screenshots use controlled test funding and five independently reserved Miner cycles. The artwork follows the supplied TEFI primary dashboard's stone/copper palette, illustrated cavern, machine cards, three columns and green progress indicators. No mockup-only machines or fictional balances are implemented.

The browser suite also checks 2560×1440, 1440×900, 1366×768, 1280×720, 1280×600 and 768×1024. Desktop document dimensions stay within the viewport; machine details, inventory and Shop content scroll internally. Mobile/tablet allow document scrolling. Category changes retain existing controls, machine work and saved bytes. Screenshots can be regenerated with `TEFI_UI_SCREENSHOTS` and the focused `TEFI_SMOKE_SCOPE=ui02` browser run.
