---
"sound-tank": minor
---

Add CatalogResource, listing image/draft methods, and response caching

- `reverb.catalog.*` — getCategories, getConditions, getShippingRegions, getCurrencies
- `reverb.listings.getImages()`, `deletePhoto()`, `reorderPhotos()`
- `reverb.listings.getDrafts()`, `getAllDrafts()`, `streamAllDrafts()`
- `ReverbCacheOptions` / `ResponseCache` — optional GET response cache via `new Reverb({ cache: ... })`
- New types: `ListingImage`, `ReverbShippingRegion`, `ListingCurrency`
- Bug fixes: `ListingCondition.display_name` (was `displayName`), `ListingShipping.initial_offer_rate` shape, `Listing.published_at` now optional
