# GAME20 visual verification

The actual `/game/` entry point was checked at 2560×1440, 1920×1080, 1366×768, 1280×720, 1280×600, 768×1024 and 390×844. The screenshots below show two discoveries, four achievements, two milestones and one Factory Level summary produced by one committed deterministic fixture; all nine notices are delivered individually. Entrance animations are settled for capture.

- [Desktop, 1920×1080](1920x1080.webp)
- [Short desktop, 1280×600](1280x600.webp)
- [Mobile, 390×844, full page](390x844.webp)

The notification strip reserves layout space rather than covering gameplay controls. Desktop panels retain internal scrolling; mobile retains ordinary page scrolling. Browser checks include detail navigation, hidden notifications during confirmations, failed-write recovery, exact retry, no load replay, reduced motion, duplicate IDs and overflow. Full regression counts and GitHub Actions results are recorded on the PR.
