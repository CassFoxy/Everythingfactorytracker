# GAME21-FIX browser review

Actual `/game/` screenshots after hidden milestone tracking, first Rebirth and additional committed progression to Factory Level 200 (10 canonical milestones). The existing modal keeps the full catalogue internally scrollable; the Go to next control reaches Level 215.

- [2560x1440](2560x1440.webp)
- [1920x1080](1920x1080.webp)
- [1366x768](1366x768.webp)
- [1280x720](1280x720.webp)
- [1280x600](1280x600.webp)
- [768x1024](768x1024.webp)
- [390x844](390x844.webp)

All seven flows verify the complete 250-entry list, filters, next milestone, keyboard focus containment/restoration, notification suppression while the modal is open, exact failed-write retry, second Rebirth and reload. The mobile flow additionally loads private and untagged legacy saves with exact-match and unmatched flags, verifies canonical-only counts and no historical panel, and confirms stored bytes remain unchanged on load. Reduced motion, duplicate IDs, overflow and console errors are checked.

Catalogue and approved private compatibility policy: [Milestone contract](../MILESTONE_CONTRACT.md). Full local and GitHub Actions results are recorded on the implementation PR. No milestone rewards are activated.
