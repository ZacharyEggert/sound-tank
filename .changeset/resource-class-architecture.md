---
"sound-tank": major
---

Resource class architecture (v2.0 breaking change)

- Add `ListingsResource`, `OrdersResource` classes (`reverb.listings.getMy`, etc.)
- Remove flat methods from `Reverb` class; rename `getArbitraryEndpoint` -> `_getArbitraryEndpoint`
- Migrate all methods from axios -> `HttpClient` abstraction
- Remove dual `(reverb, options)` pattern; all methods now `(client, config, options)`
- Move `PaginatedReverbResponse` to `types.ts`
- Remove `getMyRoot`
