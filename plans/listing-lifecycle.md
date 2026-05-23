# Plan: Listing Lifecycle Methods

> Source: [reverb-api.com/docs/create-listings](https://www.reverb-api.com/docs/create-listings), [updating-your-listing](https://www.reverb-api.com/docs/updating-your-listing), [updating-listing-images](https://www.reverb-api.com/docs/updating-listing-images), [deleting-a-draft-listing-1](https://www.reverb-api.com/docs/deleting-a-draft-listing-1)

## Architectural decisions

- **Methods layer**: one file per operation group in `src/methods/listings/` — pure functions `(HttpClient, ReverbConfig, options) => Promise<HttpResponse<T>>`
- **Resource class**: `ListingsResource` delegates to those functions; no logic lives in the resource itself
- **Types**: new request/response types go in `src/types.ts`; options interfaces stay co-located with their method files
- **Reference data**: `getCategories`, `getConditions`, `getShippingRegions`, `getCurrencies` live on a new `CatalogResource` (`reverb.catalog.*`) — they are not listing-specific and keeping them separate avoids bloating `ListingsResource`
- **Response caching**: `Reverb` constructor accepts optional `cache?: { ttlMs: number }` — when set, GET responses are memoized per URL for `ttlMs` milliseconds. Defaults to no cache (always fresh). Implemented as a thin wrapper inside `HttpClient` or as a cache layer injected into each resource getter.
- **`ListingUpdateBody`**: `type ListingUpdateBody = Partial<ListingPostBody> & { publish?: boolean }` — named alias for discoverability; no duplication since PUT schema mirrors POST
- **Endpoints**:
  - Update/publish: `PUT /api/listings/:id`
  - End live listing: `PUT /api/my/listings/:id/state/end`
  - Delete draft: `DELETE /api/listings/:id`
  - List drafts: `GET /api/my/listings/drafts`
  - List images: `GET /api/listings/:id/images`
  - Delete image: `DELETE /api/listings/:id/images/:imageId`
  - Reorder photos: `PUT /api/listings/:id` with `photo_upload_method: "override_position"`
  - Categories: `GET /api/categories/flat`
  - Conditions: `GET /api/listing_conditions`
  - Shipping regions: `GET /api/shipping/regions`
  - Currencies: `GET /api/currencies/listing`

---

## Phase 1: Update & Publish

**Endpoints**: `PUT /api/listings/:id`

### What to build

A seller can update any field on an existing listing and/or publish a draft in a single call. `listings.update(id, body)` sends a PUT with a partial listing body. `listings.publish(id)` is a named convenience method that calls `update(id, { publish: true })` — making the draft → live transition explicit and discoverable. Both are shipped; `publish()` is also documented as equivalent to `update(id, { publish: true })` so callers who prefer the generic form know it works.

`type ListingUpdateBody = Partial<ListingPostBody> & { publish?: boolean }`. The response type is `Listing` (same as create).

### Acceptance criteria

- [ ] `reverb.listings.update(id, body)` sends `PUT /api/listings/:id` and returns `HttpResponse<Listing>`
- [ ] `reverb.listings.publish(id)` is a named method equivalent to `update(id, { publish: true })`
- [ ] `update(id, { publish: true })` also works directly (both forms are valid and documented)
- [ ] `ListingUpdateBody` exported from `src/index.ts`
- [ ] Unit tests cover: field update, publish via method, publish via update, empty body, unknown id error path
- [ ] Sandbox integration test: update a draft listing's price, then publish it

---

## Phase 2: End & Delete

**Endpoints**: `PUT /api/my/listings/:id/state/end`, `DELETE /api/listings/:id`

### What to build

Two distinct termination paths exist in the API: ending a live listing (keeps it in history with a reason) and deleting a draft (permanent, only works on drafts). `listings.end(id, reason)` and `listings.delete(id)` map to these respectively.

`EndListingReason` is a string union `"not_sold" | "reverb_sale"` exported from `src/types.ts`. `delete()` returns a void/204 response — `HttpResponse<void>`.

### Acceptance criteria

- [ ] `reverb.listings.end(id, reason)` sends `PUT /api/my/listings/:id/state/end` with `{ reason }` body
- [ ] `reverb.listings.delete(id)` sends `DELETE /api/listings/:id`
- [ ] `EndListingReason` type exported from `src/index.ts`
- [ ] Unit tests cover: end with each reason, delete draft, error on deleting live listing
- [ ] Sandbox integration test: create draft → delete it; create draft → publish → end it

---

## Phase 3: Draft Queue

**Endpoint**: `GET /api/my/listings/drafts`

### What to build

Sellers managing bulk inventory need to iterate their draft queue. Three variants mirror the `getMy` family: `getDrafts(options?)` (one page), `getAllDrafts(options?)` (auto-paginate to array, with same 5s/5-page throttle as `getAllMy`), and `streamAllDrafts(options?)` (async generator). All use the existing `paginateAll` / `paginateStream` utils.

The response shape is the same `PaginatedReverbResponse<{ listings: Listing[] }>` already used by `getMy()`, so no new types are needed.

### Acceptance criteria

- [ ] `reverb.listings.getDrafts(options?)` fetches `GET /api/my/listings/drafts` and returns one page
- [ ] `reverb.listings.getAllDrafts(options?)` auto-paginates and returns `Listing[]`
- [ ] `reverb.listings.streamAllDrafts(options?)` yields one `Listing` at a time via async generator
- [ ] Options support `page`, `perPage`
- [ ] Unit tests mirror the `getMyListings` unit test patterns (all three variants)
- [ ] Sandbox integration test: create a draft → confirm it appears in `getDrafts()`

---

## Phase 4: Image Management

**Endpoints**: `GET /api/listings/:id/images`, `DELETE /api/listings/:id/images/:imageId`, `PUT /api/listings/:id` (reorder)

### What to build

Three image operations surface through two endpoints. `listings.getImages(id)` returns full image objects (id + url) rather than just URLs like the existing `getPhotos()` does — the `id` field is required to delete. `listings.deletePhoto(id, imageId)` removes a single image. `listings.reorderPhotos(id, photoUrls)` sends a PUT with `photos` + `photo_upload_method: "override_position"` to set a new photo order.

New type `ListingImage` → `{ id: string; url: string }` added to `src/types.ts`.

### Acceptance criteria

- [ ] `reverb.listings.getImages(id)` returns `HttpResponse<ListingImage[]>`
- [ ] `reverb.listings.deletePhoto(id, imageId)` sends `DELETE /api/listings/:id/images/:imageId`
- [ ] `reverb.listings.reorderPhotos(id, photoUrls)` sends PUT with `photo_upload_method: "override_position"`
- [ ] `ListingImage` exported from `src/index.ts`
- [ ] Unit tests cover: getImages response shape, deletePhoto, reorderPhotos URL construction
- [ ] Sandbox integration test: getImages on an existing listing

---

## Phase 5: Reference Data (CatalogResource)

**Endpoints**: `GET /api/categories/flat`, `GET /api/listing_conditions`, `GET /api/shipping/regions`, `GET /api/currencies/listing`

### What to build

Two concerns are shipped together in this phase: the `CatalogResource` and the response cache option.

**CatalogResource**: Sellers need category UUIDs, condition UUIDs, region codes, and currency codes to build valid `create()` / `update()` payloads. `reverb.catalog.*` exposes four simple GET-with-no-params calls. When `cache` is enabled on the `Reverb` instance these responses are particularly good candidates for caching since they change rarely.

**Cache option**: `ReverbOptions` gains an optional `cache?: { ttlMs: number }`. When set, a `ResponseCache` utility (new, in `src/utils/cache.ts`) intercepts GET responses and memoizes them by URL for `ttlMs` ms. Injected into the HTTP layer as an optional wrapper — `HttpClient` interface is unchanged; the cache wraps it transparently. Default is no cache.

New types: `Category` (already exists — reuse), `ListingCondition` (already exists — reuse), `ShippingRegion → { region_code: string; name?: string }`, `ListingCurrency → { code: string; symbol: string }`, `ReverbCacheOptions → { ttlMs: number }`.

### Acceptance criteria

- [ ] `reverb.catalog.getCategories()` returns `HttpResponse<Category[]>`
- [ ] `reverb.catalog.getConditions()` returns `HttpResponse<ListingCondition[]>`
- [ ] `reverb.catalog.getShippingRegions()` returns `HttpResponse<ShippingRegion[]>`
- [ ] `reverb.catalog.getCurrencies()` returns `HttpResponse<ListingCurrency[]>`
- [ ] `reverb.catalog.getCategories()`, `.getConditions()`, `.getShippingRegions()`, `.getCurrencies()` all return `HttpResponse<T[]>`
- [ ] `CatalogResource` exported from `src/index.ts`; `reverb.catalog` property on `Reverb` class
- [ ] `ShippingRegion`, `ListingCurrency`, `ReverbCacheOptions` exported from `src/index.ts`
- [ ] `new Reverb({ apiKey, cache: { ttlMs: 60_000 } })` caches GET responses for 60s
- [ ] `new Reverb({ apiKey })` (no cache option) always fetches fresh — default behavior unchanged
- [ ] Cache is per `Reverb` instance; no shared global state
- [ ] Unit tests for all four catalog methods + cache hit/miss behavior
- [ ] Sandbox integration test: call all four and assert non-empty arrays

---

## Out of scope (follow-on)

The following endpoints exist in the API but are intentionally deferred:
- Bumps (`/api/listings/:id/bump`, `/api/bump/v2/bids`) — seller promotion tooling
- Direct Offers (`/api/listings/:id/auto_offer`) — automated offer config
- Sales (`/api/sales/*`) — sale/promo management
