# Architecture

sound-tank uses a **resource class** pattern (Stripe-style). The `Reverb` class exposes typed resource namespaces; each resource delegates to pure functions that depend only on `HttpClient` and `ReverbConfig`.

---

## Directory Layout

```
src/
  Reverb.ts               — main client class; wires resources
  index.ts                — public entry point; re-exports all types
  types.ts                — all domain types (Listing, Order, PaginatedReverbResponse, etc.)
  config/
    ReverbConfig.ts       — ReverbConfig interface + createReverbConfig factory
  http/
    HttpClient.ts         — abstract HttpClient interface
    AxiosHttpClient.ts    — production implementation (injected by default)
    MockHttpClient.ts     — test implementation
    types.ts              — HttpResponse, HttpRequestConfig, HttpError
    index.ts              — barrel export
  resources/
    ListingsResource.ts   — class: getMy, getOne, getAllMy, create
    OrdersResource.ts     — class: getMy
  methods/
    listings/
      getListings.ts      — pure functions: getMyListings, getAllMyListings, getOneListing
      postListing.ts      — pure function: postListing
    orders/
      getOrders.ts        — pure function: getMyOrders
    index.ts              — barrel export + getArbitraryEndpoint
  utils/
    urlBuilder.ts         — buildUrl(baseUrl, path)
    queryBuilder.ts       — buildQueryString, buildUrlWithQuery
    pagination.ts         — paginateAll, createPaginatedResult
    index.ts              — barrel export
```

---

## Consumer API

```ts
const reverb = new Reverb({ apiKey: '...' });

// Listings
await reverb.listings.getMy({ page: 1, perPage: 10, query: 'gibson' });
await reverb.listings.getOne({ id: '40000' });
await reverb.listings.getAllMy({ query: 'fender', state: ListingStates.LIVE });
await reverb.listings.create(body);

// Orders
await reverb.orders.getMy({ page: 1 });

// Escape hatch for unlisted endpoints
await reverb._getArbitraryEndpoint('/my/shop');
await reverb._getArbitraryEndpoint('https://absolute.url.com/path');
```

---

## Adding a New API Method

### 1. Create the pure function

`src/methods/<resource>/myMethod.ts`

```ts
import { HttpClient, HttpResponse } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { buildUrl, buildUrlWithQuery } from '~/utils';
import { SomeType } from '~/types';

export interface MyMethodOptions {
  page?: number;
}

export const myMethod = async (
  client: HttpClient,
  config: ReverbConfig,
  options: MyMethodOptions,
): Promise<HttpResponse<SomeType>> => {
  const url = buildUrlWithQuery(buildUrl(config.rootEndpoint, '/my/path'), { page: options.page });
  return client.get<SomeType>(url, { headers: config.headers });
};
```

Rules:
- Never import `axios` directly — always use the `HttpClient` interface
- Use `buildUrl` + `buildUrlWithQuery` for URL construction
- Use `paginateAll` + `createPaginatedResult` for paginated endpoints

### 2. Export from `src/methods/index.ts`

```ts
export * from './myResource/myMethod';
```

### 3. Add to the resource class

`src/resources/MyResource.ts`

```ts
import { HttpClient } from '~/http';
import { ReverbConfig } from '~/config/ReverbConfig';
import { myMethod, MyMethodOptions } from '~/methods/myResource/myMethod';

export class MyResource {
  constructor(
    private getClient: () => HttpClient,
    private getConfig: () => ReverbConfig,
  ) {}

  doThing(options: MyMethodOptions = {}) {
    return myMethod(this.getClient(), this.getConfig(), options);
  }
}
```

### 4. Wire the resource into `Reverb.ts`

```ts
import { MyResource } from './resources/MyResource';

// In class body:
readonly myResource: MyResource;

// In constructor (after _updateConfig()):
this.myResource = new MyResource(() => this._httpClient, () => this._config);
```

### 5. Export from `src/index.ts`

```ts
export * from './resources/MyResource';
```

---

## Config Mutation Safety

Resource classes receive getter functions — `() => this._httpClient` and `() => this._config` — rather than snapshot values. This means `reverb.locale = 'fr'` (which calls `_updateConfig()` and reassigns `this._config`) is automatically picked up by all resources on the next call. No re-instantiation needed.

---

## HTTP Layer

All method functions accept `HttpClient` (abstract interface). The `Reverb` class injects `AxiosHttpClient` by default. Tests inject `MockHttpClient`.

Never import `axios` in method or resource files.

---

## Testing

Unit tests use `MockHttpClient` directly with the pure functions:

```ts
const client = new MockHttpClient();
const config = { rootEndpoint: 'https://api.reverb.com/api', ... };
client.onGet((url) => url.includes('/my/listings'), createMockResponse(mockData));
const response = await getMyListings(client, config, {});
```

Integration tests use a real `Reverb` instance with a `REVERB_API_KEY` in `.env`.

Run a single test file:
```bash
yarn test tests/methods/listings/getListings.unit.test.ts
```
