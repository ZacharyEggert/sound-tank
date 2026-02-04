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
const { data } = await reverb.getMyListings({ perPage: 10, state: 'live' });

data.listings.forEach(listing => {
  console.log(`${listing.title}: ${listing.price.display}`);
});
```

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API entities
- ✅ **Automatic Pagination** - Built-in helpers to fetch all results seamlessly
- ✅ **Configuration Management** - Easy setup for currency, locale, and shipping preferences
- ✅ **Comprehensive Coverage** - Listings, orders, and arbitrary endpoint access
- ✅ **HTTP Client Abstraction** - Clean architecture with testable mock implementations
- ✅ **Dual Module Support** - Both CommonJS and ESM builds included
- ✅ **Well Tested** - Extensive unit and integration test coverage
- ✅ **Minimal Dependencies** - Only requires axios

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Methods](#api-methods)
  - [getMyListings](#getmylistingsoptions)
  - [getAllMyListings](#getallmylistingsoptions)
  - [getOneListing](#getonelistingoptions)
  - [getMyOrders](#getmyordersoptions)
  - [getArbitraryEndpoint](#getarbitraryendpointoptions)
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
  locale: 'en',           // optional
  version: '3.0',         // optional
});
```

### Fetch Your Listings

```typescript
const response = await reverb.getMyListings({
  perPage: 25,
  page: 1,
  state: 'live',
  query: 'Gibson Les Paul'
});

console.log(response.data.listings);
```

### Error Handling

```typescript
try {
  const response = await reverb.getMyListings({ state: 'live' });
  console.log(`Found ${response.data.listings.length} listings`);
} catch (error) {
  console.error('Failed to fetch listings:', error.message);
}
```

## Configuration

### Constructor Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | ✅ Yes | - | Your Reverb API key |
| `version` | `string` | No | `'3.0'` | API version to use |
| `rootEndpoint` | `string` | No | `'https://api.reverb.com/api'` | API base URL |
| `displayCurrency` | `string` | No | `'USD'` | Currency for price display |
| `locale` | `string` | No | `'en'` | Language locale (e.g., 'en', 'fr', 'de') |
| `shippingRegion` | `string` | No | `undefined` | Shipping region code (e.g., 'US', 'EU') |

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

### getMyListings(options?)

Fetch a paginated list of your listings.

**Parameters:**
- `perPage?: number` - Items per page
- `page?: number` - Page number (starts at 1)
- `query?: string` - Search query to filter listings
- `state?: string` - Filter by state: `'live'`, `'sold'`, `'draft'`, or `'all'`

**Returns:** `Promise<AxiosResponse<PaginatedReverbResponse<{ listings: Listing[] }>>>`

**Example:**
```typescript
const response = await reverb.getMyListings({
  perPage: 50,
  page: 1,
  state: 'live',
  query: 'Fender Stratocaster'
});

const { listings } = response.data;
console.log(`Page 1: ${listings.length} listings`);
```

---

### getAllMyListings(options?)

Automatically fetches **all** listings across all pages using automatic pagination.

**Parameters:**
- `query?: string` - Search query to filter listings
- `state?: ListingStates` - Filter by state: `ListingStates.LIVE`, `ListingStates.SOLD`, or `ListingStates.DRAFT`

**Returns:** `Promise<AxiosResponse<Listing[]>>`

**Example:**
```typescript
const response = await reverb.getAllMyListings({ state: 'live' });
const allListings = response.data; // All listings from all pages

console.log(`Total listings: ${allListings.length}`);
```

> **Note:** This method automatically handles pagination by fetching all pages sequentially until all results are retrieved.

---

### getOneListing(options)

Fetch a single listing by ID.

**Parameters:**
- `id: string` - Listing ID (required)

**Returns:** `Promise<AxiosResponse<Listing>>`

**Example:**
```typescript
const response = await reverb.getOneListing({ id: '12345' });
const listing = response.data;

console.log(`${listing.title} - ${listing.price.display}`);
console.log(`Condition: ${listing.condition.displayName}`);
```

---

### getMyOrders(options?)

Fetch your orders with pagination.

**Parameters:**
- `page?: number` - Page number (starts at 1)
- `perPage?: number` - Items per page

**Returns:** `Promise<AxiosResponse<PaginatedReverbResponse<{ orders: Order[] }>>>`

**Example:**
```typescript
const response = await reverb.getMyOrders({
  page: 1,
  perPage: 25
});

const { orders } = response.data;
orders.forEach(order => {
  console.log(`Order ${order.order_number}: ${order.status}`);
});
```

---

### getArbitraryEndpoint(options)

Make requests to any Reverb API endpoint not explicitly covered by other methods.

**Parameters:**
- `url: string` - Endpoint URL (absolute or relative to root endpoint)
- `params?: object` - Query parameters

**Returns:** `Promise<AxiosResponse<unknown>>`

**Example:**
```typescript
// Fetch categories
const categories = await reverb.getArbitraryEndpoint({
  url: '/categories/flat'
});

// Fetch listing conditions
const conditions = await reverb.getArbitraryEndpoint({
  url: '/listing_conditions'
});

console.log(categories.data);
```

## TypeScript Usage

Sound Tank is written in TypeScript and provides comprehensive type definitions for the entire Reverb API.

### Importing Types

```typescript
import Reverb, {
  Listing,
  Order,
  Price,
  ListingStates,
  ListingCondition,
  ShippingRate,
  Category,
  ReverbOptions
} from 'sound-tank';
```

### Working with Typed Responses

```typescript
const response = await reverb.getMyListings();
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

The SDK exports comprehensive TypeScript types including:

**Listing Types:**
- `Listing` - Complete listing data with make, model, price, condition, shipping, etc.
- `ListingState` - Listing status information
- `ListingStates` - Enum for state values (LIVE, SOLD, DRAFT)
- `ListingCondition` - Item condition with UUID and display name
- `ListingShipping` - Shipping information and rates
- `ListingStats` - View and watch counts

**Order Types:**
- `Order` - Complete order information with buyer, seller, shipping, pricing details
- `OrderStatus` - Order status information
- `ShippingAddress` - Complete address information

**Pricing Types:**
- `Price` - Currency-aware price with amount, currency, symbol, and formatted display
- `ShippingRate` - Regional shipping costs

**Other Types:**
- `Category` - Product categorization
- `Link` - HATEOAS navigation links
- `ReverbOptions` - SDK configuration options

## Advanced Features

### Automatic Pagination

The `getAllMyListings` method demonstrates automatic pagination, fetching all results across multiple API pages:

```typescript
// Manually paginate
let page = 1;
let allListings = [];
let response;

do {
  response = await reverb.getMyListings({ page, perPage: 50 });
  allListings = allListings.concat(response.data.listings);
  page++;
} while (response.data.listings.length === 50);

// Or use the built-in helper
const autoResponse = await reverb.getAllMyListings();
const listings = autoResponse.data; // Same result, simpler code
```

### HTTP Client Abstraction

Sound Tank uses an HTTP client abstraction for testability:

```typescript
import { MockHttpClient } from 'sound-tank/http';

// Use mock client for testing
const mockClient = new MockHttpClient();
// Your tests here
```

### Configuration Access

Access the internal configuration and headers:

```typescript
const config = reverb.config;
console.log(config.rootEndpoint);    // 'https://api.reverb.com/api'
console.log(config.displayCurrency); // 'USD'
console.log(config.locale);          // 'en'

const headers = reverb.headers;
console.log(headers['Authorization']);      // 'Bearer your_api_key'
console.log(headers['X-Display-Currency']); // 'USD'
```

## Examples

### Find All Guitars Under $1000

```typescript
const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });

const response = await reverb.getAllMyListings({ query: 'guitar' });
const affordable = response.data.filter(listing =>
  listing.price.amount_cents < 100000 // $1000 = 100,000 cents
);

console.log(`Found ${affordable.length} guitars under $1000`);
affordable.forEach(listing => {
  console.log(`  ${listing.title}: ${listing.price.display}`);
});
```

### Multi-Currency Price Display

```typescript
const reverb = new Reverb({ apiKey: process.env.REVERB_API_KEY });

// Get prices in USD
reverb.displayCurrency = 'USD';
const usdResponse = await reverb.getMyListings({ perPage: 5 });
console.log('USD Prices:');
usdResponse.data.listings.forEach(l =>
  console.log(`  ${l.title}: ${l.price.display}`)
);

// Switch to EUR
reverb.displayCurrency = 'EUR';
const eurResponse = await reverb.getMyListings({ perPage: 5 });
console.log('\nEUR Prices:');
eurResponse.data.listings.forEach(l =>
  console.log(`  ${l.title}: ${l.price.display}`)
);
```

### Export Listings to CSV

```typescript
const response = await reverb.getAllMyListings({ state: 'live' });

const csvHeader = 'ID,Title,Price,Currency,Condition,Year,State\n';
const csvRows = response.data.map(listing =>
  `${listing.id},"${listing.title}",${listing.price.amount},${listing.price.currency},${listing.condition.displayName},${listing.year},${listing.state.slug}`
).join('\n');

const csv = csvHeader + csvRows;
console.log(csv);
// Save to file or send via API
```

### Search and Filter

```typescript
// Search for specific items
const response = await reverb.getMyListings({
  query: 'Les Paul',
  state: 'live',
  perPage: 100
});

// Filter by condition
const excellent = response.data.listings.filter(
  listing => listing.condition.displayName === 'Excellent'
);

// Filter by year
const vintage = response.data.listings.filter(
  listing => parseInt(listing.year) < 1980
);

console.log(`Found ${excellent.length} in excellent condition`);
console.log(`Found ${vintage.length} vintage items`);
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
│   │   ├── AxiosHttpClient.ts    # Axios implementation
│   │   └── MockHttpClient.ts     # Mock for testing
│   ├── methods/
│   │   ├── listings/       # Listing operations
│   │   └── orders/         # Order operations
│   └── utils/              # Helper utilities
├── tests/                  # Test files
├── dist/                   # Build output (git-ignored)
├── package.json
├── tsconfig.json           # TypeScript configuration
├── tsup.config.ts          # Build configuration
└── vite.config.mts         # Test configuration
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Run tests in watch mode during development |
| `yarn test` | Run all tests once |
| `yarn build` | Build production bundles (CJS + ESM + declarations) |
| `yarn lint` | Type-check code with TypeScript compiler |
| `yarn ci` | Run full CI pipeline (install, lint, test, build) |
| `yarn release` | Build and publish to npm (uses changesets) |

### Build System

Sound Tank uses [tsup](https://tsup.egoist.dev/) for building:

- **Dual Output**: CommonJS (`dist/index.js`) and ESM (`dist/index.mjs`)
- **Type Declarations**: Full TypeScript `.d.ts` files
- **Source Maps**: Included for debugging
- **Tree-shaking**: Optimized bundles
- **External Dependencies**: `axios` marked as external (not bundled)

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

# Run tests with coverage report
yarn test --coverage
```

### Test Structure

- **Unit Tests**: Test individual functions in isolation
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

### Code Style

This project uses:
- **TypeScript** strict mode
- **Prettier** for formatting (run automatically)
- **ESLint** for linting
- 2-space indentation
- Single quotes for strings
- Trailing commas

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
