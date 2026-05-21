---
"sound-tank": patch
---

Add `throttle` option to `PaginationOptions` (`delayMs`, `everyNPages`) to prevent 429 rate-limit errors on large fetches. `getAllMyListings()` and `streamAllMyListings()` now pause 5s every 5 pages by default.
