<h1 align="center">🎸 Sound Tank</h1>

<p align="center">
  <strong>TypeScript SDK for the <a href="https://reverb.com">Reverb Marketplace</a> API</strong>
</p>

<p align="center">
  A modern, type-safe interface for buying, selling, and managing musical instruments and gear on Reverb
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sound-tank"><img src="https://img.shields.io/npm/v/sound-tank.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/sound-tank"><img src="https://img.shields.io/npm/dm/sound-tank.svg" alt="npm downloads"></a>
  <a href="https://github.com/ZacharyEggert/sound-tank/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://github.com/ZacharyEggert/sound-tank/actions"><img src="https://github.com/ZacharyEggert/sound-tank/workflows/CI/badge.svg" alt="Build Status"></a>
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue" alt="TypeScript">
</p>

---

## Quick Start

```bash
npm install sound-tank
# or
yarn add sound-tank
# or
pnpm add sound-tank
```

```typescript
import Reverb from 'sound-tank';

const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });
const { data } = await reverb.listings.getMy({ perPage: 10, state: 'live' });

data.listings.forEach((listing) => {
  console.log(`${listing.title}: ${listing.price.display}`);
});
```

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API entities
- ✅ **Automatic Pagination** - Built-in helpers to fetch all results seamlessly
- ✅ **Streaming Pagination** - Async generator to stream results page-by-page
- ✅ **Configuration Management** - Easy setup for currency, locale, and shipping preferences
- ✅ **Comprehensive Coverage** - Listings, orders, negotiations, messages, and arbitrary endpoint access
- ✅ **HTTP Client Abstraction** - Clean architecture with testable mock implementations
- ✅ **Dual Module Support** - Both CommonJS and ESM builds included
- ✅ **Well Tested** - Extensive unit and integration test coverage
- ✅ **Zero Dependencies** - Uses the native `fetch` API; no runtime dependencies

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Methods](#api-methods)
  - [listings](#listings)
  - [orders](#orders)
  - [negotiations](#negotiations)
  - [messages](#messages)
  - [\_getArbitraryEndpoint](#_getarbitraryendpointurl-params)
- [TypeScript Usage](#typescript-usage)
- [Advanced Features](#advanced-features)
- [Examples](#examples)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install via your preferred package manager:

```bash
npm install sound-tank
# or
yarn add sound-tank
# or
pnpm add sound-tank
```

### Getting a Reverb API Key

1. Visit [Reverb API Settings](https://reverb.com/my/api)
2. Generate a new API token
3. Set the appropriate scopes for your use case
4. Store securely in environment variables

```bash
# .env
REVERB_API_KEY=your_api_key_here
```

You can use the provided `.env.example` file as a template:

```bash
cp .env.example .env
# Edit .env and add your REVERB_API_KEY
```

## Getting Started

### Initialize the Client

```typescript
import Reverb from 'sound-tank';

const reverb = new Reverb({
  apiKey: process.env.REVERB_API_KEY,
  displayCurrency: 'USD', // optional
  locale: 'en', // optional
  version: '3.0', // optional
});
```

### Fetch Your Listings

```typescript
const response = await reverb.listings.getMy({
  perPage: 25,
  page: 1,
  state: 'live',
  query: 'Gibson Les Paul',
});

console.log(response.data.listings);
```

### Error Handling

```typescript
try {
  const response = await reverb.listings.getMy({ state: 'live' });
  console.log(`Found ${response.data.listings.length} listings`);
} catch (error) {
  console.error('Failed to fetch listings:', error.message);
}
```

## Configuration

### Constructor Options

| Option            | Type     | Required | Default                        | Description                              |
| ----------------- | -------- | -------- | ------------------------------ | ---------------------------------------- |
| `apiKey`          | `string` | ✅ Yes   | -                              | Your Reverb API key                      |
| `version`         | `string` | No       | `'3.0'`                        | API version to use                       |
| `rootEndpoint`    | `string` | No       | `'https://api.reverb.com/api'` | API base URL                             |
| `displayCurrency` | `string` | No       | `'USD'`                        | Currency for price display               |
| `locale`          | `string` | No       | `'en'`                         | Language locale (e.g., 'en', 'fr', 'de') |
| `shippingRegion`  | `string` | No       | `undefined`                    | Shipping region code (e.g., 'US', 'EU')  |

### Runtime Configuration

You can update configuration after initialization using setters:

```typescript
reverb.displayCurrency = 'EUR';
reverb.locale = 'fr';
reverb.shippingRegion = 'FR';
reverb.version = '3.0';
```

These changes automatically update the internal headers and configuration for subsequent API requests.

## API Methods

### listings

#### listings.getMy(options?)

Fetch a paginated list of your listings.

**Parameters:**

- `perPage?: number` - Items per page
- `page?: number` - Page number (starts at 1)
- `query?: string` - Search query to filter listings
- `state?: string` - Filter by state: `'live'`, `'sold'`, `'draft'`, or `'all'`

```typescript
const response = await reverb.listings.getMy({ perPage: 50, state: 'live' });
const { listings } = response.data;
```

---

#### listings.getAllMy(options?)

Automatically fetches **all** listings across all pages using automatic pagination.

**Parameters:**

- `query?: string` - Search query to filter listings
- `state?: ListingStates` - Filter by state: `ListingStates.LIVE`, `ListingStates.SOLD`, or `ListingStates.DRAFT`

**Returns:** `Promise<HttpResponse<Listing[]>>`

```typescript
const response = await reverb.listings.getAllMy({ state: 'live' });
const allListings = response.data; // All listings from all pages
```

> **Note:** Fetches all pages sequentially, throttling every 5 pages to respect rate limits.

---

#### listings.streamAllMy(options?)

Stream all listings as an async generator — yields one `Listing` at a time without waiting for all pages to load.

**Parameters:** Same as `getAllMy`.

**Returns:** `AsyncGenerator<Listing>`

```typescript
for await (const listing of reverb.listings.streamAllMy({ state: 'live' })) {
  console.log(listing.title);
}
```

---

#### listings.getOne(options)

Fetch a single listing by ID.

**Parameters:**

- `id: string` - Listing ID (required)

**Returns:** `Promise<HttpResponse<Listing>>`

```typescript
const response = await reverb.listings.getOne({ id: '12345' });
console.log(response.data.title);
```

---

#### listings.getPhotos(options)

Fetch full-resolution photo URLs for a listing.

**Parameters:**

- `id: string` - Listing ID (required)

**Returns:** `Promise<string[]>`

```typescript
const photos = await reverb.listings.getPhotos({ id: '12345' });
photos.forEach((url) => console.log(url));
```

---

#### listings.create(body)

Create a new listing.

**Parameters:**

- `body: ListingPostBody` - Listing data (title, make, model, price, condition, etc.)

**Returns:** `Promise<HttpResponse<Listing>>`

```typescript
const response = await reverb.listings.create({
  make: 'Fender',
  model: 'Stratocaster',
  title: 'Fender Stratocaster 1965',
  price: { amount: '1500.00', currency: 'USD' },
  condition: { uuid: 'f7a3f48c-972a-44c6-b01a-1d9dd5ca8879' }, // Excellent
  description: 'Great condition vintage Strat.',
  categories: [{ uuid: '4-electric-guitars' }],
  shipping: { us: { rate: '30.00', currency: 'USD' } },
});
```

---

#### listings.update(id, body)

Update an existing listing.

**Parameters:**

- `id: string` - Listing ID
- `body: ListingUpdateBody` - Fields to update (any subset of listing fields)

**Returns:** `Promise<HttpResponse<Listing>>`

```typescript
await reverb.listings.update('12345', { price: { amount: '1200.00', currency: 'USD' } });
```

---

#### listings.publish(id)

Publish a draft listing (sets `publish: true`).

**Parameters:**

- `id: string` - Listing ID

**Returns:** `Promise<HttpResponse<Listing>>`

```typescript
await reverb.listings.publish('12345');
```

---

#### listings.end(id, reason)

End an active listing.

**Parameters:**

- `id: string` - Listing ID
- `reason: EndListingReason` - Reason for ending (e.g., `'sold_elsewhere'`, `'not_selling'`)

**Returns:** `Promise<HttpResponse<Listing>>`

```typescript
await reverb.listings.end('12345', 'sold_elsewhere');
```

---

#### listings.delete(id)

Permanently delete a listing.

**Parameters:**

- `id: string` - Listing ID

**Returns:** `Promise<HttpResponse<void>>`

```typescript
await reverb.listings.delete('12345');
```

---

### orders

#### orders.getMy(options?)

Fetch your orders with pagination.

**Parameters:**

- `page?: number` - Page number (starts at 1)
- `perPage?: number` - Items per page

```typescript
const response = await reverb.orders.getMy({ page: 1, perPage: 25 });
const { orders } = response.data;
orders.forEach((order) => console.log(`Order ${order.order_number}: ${order.status}`));
```

---

### negotiations

#### negotiations.getNegotiations(options)

Fetch your active offers/negotiations.

**Parameters:**

- `page?: number`
- `perPage?: number`
- `status?: 'active' | 'active_for_seller' | 'all'`
- `negotiation_type?: 'standard' | 'auto_push_offer'`

**Returns:** `Promise<HttpResponse<PaginatedReverbResponse<{ listings: ListingWithNegotiations[] }>>>`

```typescript
const response = await reverb.negotiations.getNegotiations({ status: 'active' });
const { listings } = response.data;
listings.forEach((l) => console.log(`${l.title}: ${l.negotiations.length} offers`));
```

---

#### negotiations.getNegotiation(offerId)

Fetch a single offer by ID.

**Parameters:**

- `offerId: string` - Offer ID

**Returns:** `Promise<HttpResponse<Negotiation>>`

```typescript
const response = await reverb.negotiations.getNegotiation('offer-id-here');
console.log(response.data);
```

---

### messages

#### messages.getMy(options?)

Fetch your conversations (messages).

**Parameters:**

- `unread_only?: boolean` - Filter to unread conversations only

```typescript
const response = await reverb.messages.getMy({ unread_only: true });
```

---

#### messages.getById(messageId)

Fetch a single conversation by ID.

**Parameters:**

- `messageId: number` - Conversation ID

```typescript
const response = await reverb.messages.getById(12345);
```

---

#### messages.markAsRead(messageId)

Mark a conversation as read.

**Parameters:**

- `messageId: number` - Conversation ID

```typescript
await reverb.messages.markAsRead(12345);
```

---

#### messages.reply(messageId, replyBody)

Reply to a conversation.

**Parameters:**

- `messageId: number` - Conversation ID
- `replyBody: string` - Message text

```typescript
await reverb.messages.reply(12345, 'Thanks for your offer!');
```

---

### \_getArbitraryEndpoint(url, params?)

Escape hatch to call any Reverb endpoint not yet wrapped by a resource. The `_` prefix indicates this is not part of the stable public API but is intentionally supported.

**Parameters:**

- `url: string` - Endpoint URL (absolute or relative to root endpoint)
- `params?: object` - Query parameters

```typescript
const categories = await reverb._getArbitraryEndpoint('/categories/flat');
const conditions = await reverb._getArbitraryEndpoint('/listing_conditions');
```

## TypeScript Usage

Sound Tank is written in TypeScript and provides comprehensive type definitions for the entire Reverb API.

### Importing Types

```typescript
import Reverb, {
  Listing,
  Order,
  Negotiation,
  ListingWithNegotiations,
  Price,
  ListingStates,
  ListingCondition,
  ListingPostBody,
  ListingUpdateBody,
  EndListingReason,
  ShippingRate,
  Category,
  ReverbOptions,
} from 'sound-tank';
```

### Working with Typed Responses

```typescript
const response = await reverb.listings.getMy();
const listings: Listing[] = response.data.listings;

listings.forEach((listing: Listing) => {
  const price: Price = listing.price;
  const condition: ListingCondition = listing.condition;

  console.log(`${listing.title}`);
  console.log(`  Price: ${price.display} (${price.currency})`);
  console.log(`  Condition: ${condition.displayName}`);
  console.log(`  Year: ${listing.year}`);
});
```

### Available Types

**Listing Types:**

- `Listing` - Complete listing data with make, model, price, condition, shipping, etc.
- `ListingState` - Listing status information
- `ListingStates` - Enum for state values (LIVE, SOLD, DRAFT)
- `ListingCondition` - Item condition with UUID and display name
- `ListingShipping` - Shipping information and rates
- `ListingStats` - View and watch counts
- `ListingPostBody` - Body for creating a listing
- `ListingUpdateBody` - Body for updating a listing
- `EndListingReason` - Valid reasons for ending a listing

**Order Types:**

- `Order` - Complete order information with buyer, seller, shipping, pricing details
- `OrderStatus` - Order status information
- `ShippingAddress` - Complete address information

**Negotiation Types:**

- `Negotiation` - Individual offer/negotiation details
- `ListingWithNegotiations` - Listing with attached negotiations array

**Pricing Types:**

- `Price` - Currency-aware price with amount, currency, symbol, and formatted display
- `ShippingRate` - Regional shipping costs

**Other Types:**

- `Category` - Product categorization
- `Link` - HATEOAS navigation links
- `PaginatedReverbResponse<T>` - Paginated API response wrapper
- `ReverbOptions` - SDK configuration options

## Advanced Features

### Automatic Pagination

```typescript
// Manually paginate
let page = 1;
let allListings = [];
let response;

do {
  response = await reverb.listings.getMy({ page, perPage: 50 });
  allListings = allListings.concat(response.data.listings);
  page++;
} while (response.data.listings.length === 50);

// Or use the built-in helper
const autoResponse = await reverb.listings.getAllMy();
const listings = autoResponse.data; // Same result, simpler code
```

### Streaming Pagination

Stream results without waiting for all pages to complete:

```typescript
let count = 0;
for await (const listing of reverb.listings.streamAllMy({ state: 'live' })) {
  count++;
  console.log(`[${count}] ${listing.title}`);
}
```

### HTTP Client Abstraction

Sound Tank uses a `fetch`-based HTTP client with an interface that can be swapped for testing:

```typescript
import { MockHttpClient } from 'sound-tank/http';

// Use mock client for testing
const mockClient = new MockHttpClient();
```

### Configuration Access

```typescript
const config = reverb.config;
console.log(config.rootEndpoint); // 'https://api.reverb.com/api'
console.log(config.displayCurrency); // 'USD'
console.log(config.locale); // 'en'

const headers = reverb.headers;
console.log(headers['Authorization']); // 'Bearer your_api_key'
console.log(headers['X-Display-Currency']); // 'USD'
```

## Examples

### Find All Guitars Under $1000

```typescript
const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });

const response = await reverb.listings.getAllMy({ query: 'guitar' });
const affordable = response.data.filter(
  (listing) => listing.price.amount_cents < 100000, // $1000 = 100,000 cents
);

console.log(`Found ${affordable.length} guitars under $1000`);
```

### Multi-Currency Price Display

```typescript
reverb.displayCurrency = 'USD';
const usdResponse = await reverb.listings.getMy({ perPage: 5 });

reverb.displayCurrency = 'EUR';
const eurResponse = await reverb.listings.getMy({ perPage: 5 });
```

### Export Listings to CSV

```typescript
const response = await reverb.listings.getAllMy({ state: 'live' });

const csvHeader = 'ID,Title,Price,Currency,Condition,Year,State\n';
const csvRows = response.data
  .map(
    (listing) =>
      `${listing.id},"${listing.title}",${listing.price.amount},${listing.price.currency},${listing.condition.displayName},${listing.year},${listing.state.slug}`,
  )
  .join('\n');

console.log(csvHeader + csvRows);
```

### Respond to All Unread Messages

```typescript
const response = await reverb.messages.getMy({ unread_only: true });

for (const conversation of response.data.conversations) {
  await reverb.messages.reply(conversation.id, 'Thanks for reaching out!');
  await reverb.messages.markAsRead(conversation.id);
}
```

### Review Active Offers

```typescript
const response = await reverb.negotiations.getNegotiations({ status: 'active_for_seller' });

for (const listing of response.data.listings) {
  console.log(`${listing.title}: ${listing.negotiations.length} pending offer(s)`);
}
```

## Development

### Prerequisites

- **Node.js** 18 or higher
- **Yarn** package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/ZacharyEggert/sound-tank.git
cd sound-tank

# Install dependencies
yarn install

# Copy environment template
cp .env.example .env
# Edit .env and add your REVERB_API_KEY
```

### Project Structure

```
sound-tank/
├── src/
│   ├── Reverb.ts           # Main SDK class
│   ├── index.ts            # Entry point
│   ├── types.ts            # TypeScript type definitions
│   ├── config/
│   │   └── ReverbConfig.ts # Configuration management
│   ├── http/
│   │   ├── HttpClient.ts         # HTTP client interface
│   │   ├── FetchHttpClient.ts    # Native fetch implementation
│   │   └── MockHttpClient.ts     # Mock for testing
│   ├── methods/
│   │   ├── listings/       # getListings, postListing, updateListing, endListing
│   │   ├── orders/         # getOrders
│   │   ├── negotiations/   # getNegotiations
│   │   └── messages/       # getMessages, postMessages
│   ├── resources/
│   │   ├── ListingsResource.ts      # getMy, getOne, getPhotos, getAllMy, streamAllMy, create, update, publish, end, delete
│   │   ├── OrdersResource.ts        # getMy
│   │   ├── NegotiationsResource.ts  # getNegotiations, getNegotiation
│   │   └── MessagesResource.ts      # getMy, getById, markAsRead, reply
│   └── utils/              # pagination, urlBuilder, queryBuilder, logger
├── tests/                  # Test files
├── dist/                   # Build output (git-ignored)
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vite.config.mts
```

### Debugging

Set `SOUNDTANK_LOG_LEVEL` to enable SDK logging:

```bash
SOUNDTANK_LOG_LEVEL=DEBUG yarn dev
```

Valid values: `ERROR | WARN | INFO | DEBUG | TRACE`. Silent by default.

### Available Scripts

| Command        | Description                                         |
| -------------- | --------------------------------------------------- |
| `yarn dev`     | Run tests in watch mode during development          |
| `yarn test`    | Run all tests once                                  |
| `yarn build`   | Build production bundles (CJS + ESM + declarations) |
| `yarn lint`    | Type-check code with TypeScript compiler            |
| `yarn ci`      | Run full CI pipeline (install, lint, test, build)   |
| `yarn release` | Build and publish to npm (uses changesets)          |

### Build System

Sound Tank uses [tsup](https://tsup.egoist.dev/) for building:

- **Dual Output**: CommonJS (`dist/index.js`) and ESM (`dist/index.mjs`)
- **Type Declarations**: Full TypeScript `.d.ts` files
- **Source Maps**: Included for debugging
- **Tree-shaking**: Optimized bundles

Build outputs:

```
dist/
├── index.js        # CommonJS
├── index.mjs       # ES Modules
├── index.d.ts      # TypeScript declarations
└── *.map           # Source maps
```

## Testing

Sound Tank uses [Vitest](https://vitest.dev/) for testing with comprehensive coverage.

### Run Tests

```bash
# Run all tests once
yarn test

# Run tests in watch mode (for development)
yarn dev

# Run a single test file
yarn test tests/methods/listings/getListings.test.ts
```

### Test Structure

- **Unit Tests**: Test individual functions in isolation using `MockHttpClient`
- **Integration Tests**: Test real API interactions (require `REVERB_API_KEY` in `.env`)

### Writing Tests

Integration tests require a valid API key:

```typescript
import { config } from 'dotenv';
config(); // Load .env

const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });

// Your tests here
```

Tests are located in the `tests/` directory and mirror the `src/` structure.

## Contributing

Contributions are welcome! Here's how to get started:

### Process

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes with clear, focused commits
5. **Test** thoroughly: `yarn test`
6. **Lint** your code: `yarn lint`
7. **Commit** with descriptive messages
8. **Push** to your fork: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Guidelines

- Write **TypeScript** with strict types
- Add **tests** for new features
- Update **documentation** as needed
- Follow **existing code style** (Prettier configured)
- Ensure all **tests pass** (`yarn test`)
- Keep commits **atomic** and well-described
- Run **full CI** locally before pushing: `yarn ci`

### Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# After making changes, create a changeset
npx changeset

# Follow prompts to describe your changes
# Commit the generated changeset file
```

### Release Process

Releases are automated via GitHub Actions:

1. Create and commit a changeset for your changes
2. Push to `main` branch (after PR approval)
3. Changesets GitHub Action creates a "Version Packages" PR
4. Review and merge the Version Packages PR
5. Package automatically publishes to npm with provenance

The project uses **OIDC trusted publishing** for npm, so no `NPM_TOKEN` is needed.

## Links & Resources

- **npm Package**: [sound-tank on npm](https://www.npmjs.com/package/sound-tank)
- **GitHub Repository**: [ZacharyEggert/sound-tank](https://github.com/ZacharyEggert/sound-tank)
- **Report Issues**: [GitHub Issues](https://github.com/ZacharyEggert/sound-tank/issues)
- **Reverb API Docs**: [reverb.com/page/api](https://reverb.com/page/api)
- **Reverb Marketplace**: [reverb.com](https://reverb.com)

## License

MIT © [Zachary Eggert](https://github.com/ZacharyEggert)

See [LICENSE](./LICENSE) for details.

---

<p align="center">
  Made with ♥ by <a href="https://github.com/ZacharyEggert">Zachary Eggert</a>
</p>

<p align="center">
  <a href="https://github.com/ZacharyEggert/sound-tank/issues">Report Bug</a>
  ·
  <a href="https://github.com/ZacharyEggert/sound-tank/issues">Request Feature</a>
  ·
  <a href="https://reverb.com">Reverb.com</a>
</p>
