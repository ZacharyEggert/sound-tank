# sound-tank

## 2.3.1

### Patch Changes

- 06ac6bf: Bump dev deps; add package.json exports field for ESM/CJS dual publish

## 2.3.0

### Minor Changes

- 33eb5fd: Add CatalogResource, listing image/draft methods, and response caching
  - `reverb.catalog.*` — getCategories, getConditions, getShippingRegions, getCurrencies
  - `reverb.listings.getImages()`, `deletePhoto()`, `reorderPhotos()`
  - `reverb.listings.getDrafts()`, `getAllDrafts()`, `streamAllDrafts()`
  - `ReverbCacheOptions` / `ResponseCache` — optional GET response cache via `new Reverb({ cache: ... })`
  - New types: `ListingImage`, `ReverbShippingRegion`, `ListingCurrency`
  - Bug fixes: `ListingCondition.display_name` (was `displayName`), `ListingShipping.initial_offer_rate` shape, `Listing.published_at` now optional

## 2.2.1

### Patch Changes

- 5c739bf: Docs: update README to reflect current resources and methods

## 2.2.0

### Minor Changes

- 7bdf353: Add `MessagesResource` (`reverb.messages`) with `getMy`, `getById`, `markAsRead`, and `reply` methods.

## 2.1.1

### Patch Changes

- 8563389: Add `throttle` option to `PaginationOptions` (`delayMs`, `everyNPages`) to prevent 429 rate-limit errors on large fetches. `getAllMyListings()` and `streamAllMyListings()` now pause 5s every 5 pages by default.

## 2.1.0

### Minor Changes

- f3a8df0: Add `streamAllMy()` to `ListingsResource` and `streamAllMyListings()` method. Returns an `AsyncGenerator<Listing>` that yields listings one at a time as paginated responses arrive, rather than waiting for all pages to complete.

  Also adds the underlying `paginateStream<T>()` utility in `pagination.ts` for streaming any paginated endpoint.

## 2.0.0

### Major Changes

- ce70040: Resource class architecture (v2.0 breaking change)
  - Add `ListingsResource`, `OrdersResource` classes (`reverb.listings.getMy`, etc.)
  - Remove flat methods from `Reverb` class; rename `getArbitraryEndpoint` -> `_getArbitraryEndpoint`
  - Migrate all methods from axios -> `HttpClient` abstraction
  - Remove dual `(reverb, options)` pattern; all methods now `(client, config, options)`
  - Move `PaginatedReverbResponse` to `types.ts`
  - Remove `getMyRoot`

### Minor Changes

- ce70040: Add `NegotiationsResource` (`reverb.negotiations.*`)
  - `getNegotiations(options)` — fetch active offers grouped by listing (`/my/listings/negotiations`)
  - `getNegotiation(offerId)` — fetch a single offer by id (`/my/negotiations/:id`)
  - Add `Negotiation`, `NegotiationOffer`, `NegotiationPriceDisplay`, `NegotiationLinks` types to `types.ts`
  - Add `ListingWithNegotiations` type (`Listing & { negotiations: Negotiation[] }`)

## 1.3.1

### Patch Changes

- ec5975d: update readme

## 1.3.0

### Minor Changes

- 8abed60: Restructure code and add more comprehensive testing

## 1.2.1

### Patch Changes

- c29611c: move vitest/coverage-v8 to dev deps

## 1.2.0

### Minor Changes

- 13e1148: Add getAllListings, better testing, remove a few bad options that were assumed but aren't respected by Reverb

## 1.1.0

### Minor Changes

- additional typing, expose more methods
