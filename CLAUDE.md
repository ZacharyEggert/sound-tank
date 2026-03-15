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
- `src/Reverb.ts` — main `Reverb` class; all public API methods live here
- `src/index.ts` — re-exports `Reverb` as default + all named types/config helpers
- `src/types.ts` — all domain types (`Listing`, `Order`, `Price`, `PaginatedReverbResponse<T>`, etc.)

### HTTP layer
`src/http/HttpClient.ts` defines an abstract interface. `AxiosHttpClient` is injected by default; `MockHttpClient` is used in tests. New API methods should depend on this interface — never import axios directly.

### Adding API methods
1. Create `src/methods/<resource>/myMethod.ts` — pure function taking `(config, httpClient, options)`.
2. Export from `src/methods/index.ts`.
3. Add a public wrapper on the `Reverb` class in `src/Reverb.ts`.

### Pagination
`src/utils/pagination.ts` exports `paginateAll()` (auto-fetches all pages) and `createPaginatedResult()`. Use these for any paginated endpoint rather than rolling your own.

### Config
`src/config/ReverbConfig.ts` holds the `ReverbConfig` interface and its factory. `Reverb` class setters (e.g., `locale`, `displayCurrency`) update both `this.config` and `this.headers` together — always do both when mutating config state.

### Path alias
`~/*` resolves to `./src/*` (configured in `tsconfig.json` and `vite.config.mts`).
