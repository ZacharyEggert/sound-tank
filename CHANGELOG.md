# sound-tank

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
