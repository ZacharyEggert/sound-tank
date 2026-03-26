---
"sound-tank": minor
---

Add `NegotiationsResource` (`reverb.negotiations.*`)

- `getNegotiations(options)` — fetch active offers grouped by listing (`/my/listings/negotiations`)
- `getNegotiation(offerId)` — fetch a single offer by id (`/my/negotiations/:id`)
- Add `Negotiation`, `NegotiationOffer`, `NegotiationPriceDisplay`, `NegotiationLinks` types to `types.ts`
- Add `ListingWithNegotiations` type (`Listing & { negotiations: Negotiation[] }`)
