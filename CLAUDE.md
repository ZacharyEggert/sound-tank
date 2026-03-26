## Commands

Found in `package.json`.

Run a single test file:
```bash
yarn test tests/methods/listings/getListings.test.ts
```

Integration tests require a `REVERB_API_KEY` in `.env`.

## Architecture

**Sound Tank** is a TypeScript SDK for the [Reverb Marketplace API](https://reverb.com).

### Entry points
- `src/Reverb.ts` — main `Reverb` class; exposes resource properties (`listings`, `orders`)
- `src/index.ts` — re-exports `Reverb` as default + all named types/config helpers + resource classes
- `src/types.ts` — all domain types (`Listing`, `Order`, `Price`, `PaginatedReverbResponse<T>`, etc.)

### HTTP layer
`src/http/HttpClient.ts` defines an abstract interface. `AxiosHttpClient` is injected by default; `MockHttpClient` is used in tests. New API methods should depend on this interface — never import axios directly.

### Resources
API surface is organized into resource classes accessed as properties on `Reverb`:
- `src/resources/ListingsResource.ts` — `getMy()`, `getOne()`, `getPhotos()`, `getAllMy()`, `create()`
- `src/resources/OrdersResource.ts` — `getMy()`

Each resource receives `() => HttpClient` and `() => ReverbConfig` getter functions from the `Reverb` constructor. Access via `reverb.listings.*` and `reverb.orders.*`.

### Adding API methods
1. Create `src/methods/<resource>/myMethod.ts` — pure function taking `(config, httpClient, options)`.
2. Export from `src/methods/index.ts`.
3. Add the method to `src/resources/<Resource>Resource.ts` — delegate to the underlying function.
4. If a new resource: add `readonly <resource>: <Resource>Resource` to the `Reverb` class in `src/Reverb.ts` and export the resource class from `src/index.ts`.

### Pagination
`src/utils/pagination.ts` exports `paginateAll()` (auto-fetches all pages) and `createPaginatedResult()`. Use these for any paginated endpoint rather than rolling your own.

### Utils
- `buildQueryString(params)` / `buildUrlWithQuery(base, params)` in `src/utils/queryBuilder.ts` — filters null/undefined params automatically.
- `buildUrl(root, path)` in `src/utils/urlBuilder.ts` — handles absolute URLs and path normalization.

### Logger
`src/utils/logger.ts` exports a singleton `Logger` with all `console` methods (debug, trace, info, warn, error, etc.). Controlled by `SOUNDTANK_LOG_LEVEL` env var (`ERROR | WARN | INFO | DEBUG | TRACE`); silent by default. All new methods and utilities must use `Logger` instead of `console`.

### Config
`src/config/ReverbConfig.ts` holds the `ReverbConfig` interface and its factory. `Reverb` class setters (e.g., `locale`, `displayCurrency`) update both `this.config` and `this.headers` together — always do both when mutating config state.

### Escape hatch
`reverb._getArbitraryEndpoint<T>(url, params?)` — call any Reverb endpoint not yet wrapped by a resource. The `_` prefix signals it is not part of the stable public API but is intentionally supported.

### Path alias
`~/*` resolves to `./src/*` (configured in `tsconfig.json` and `vite.config.mts`).
