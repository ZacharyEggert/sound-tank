---
"sound-tank": minor
---

Add `streamAllMy()` to `ListingsResource` and `streamAllMyListings()` method. Returns an `AsyncGenerator<Listing>` that yields listings one at a time as paginated responses arrive, rather than waiting for all pages to complete.

Also adds the underlying `paginateStream<T>()` utility in `pagination.ts` for streaming any paginated endpoint.
