import { beforeAll, describe, expect, it } from 'vitest';
import Reverb from '../../src';
import { config } from 'dotenv';
import { Listing } from '../../src/types';
import { promises as fs, mkdirSync, readdirSync, rmSync } from 'fs';
import path from 'path';

describe('Traverse and Pull Photos Integration', {}, () => {
  let reverb: Reverb;
  let listing: Listing;
  const tempDir = './tests/integration/temp_photos';

  beforeAll(() => {
    // Setup code before all tests run

    config(); // Load environment variables from .env file

    reverb = new Reverb({
      apiKey: process.env.REVERB_API_KEY || '',
    }); // Initialize Reverb client with API key

    mkdirSync(tempDir, { recursive: true }); // Create temporary directory for photos

    return () => {
      // Teardown code after all tests run
      // Clean up temporary directory if needed
      rmSync(tempDir, { recursive: true, force: true });
    };
  });
  it('should be able to find my shop', async () => {
    const response = await reverb.getArbitraryEndpoint({
      url: '/shop/',
    });

    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data.slug).toBe('diabloguitars');
  });

  it('should be able to get a list of recent listings and select one', async () => {
    const response = await reverb.getMyListings({
      page: 1,
      perPage: 2,
      state: 'live',
    });

    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.listings)).toBe(true);
    expect(response.data.listings.length).toBeGreaterThan(0);
    listing = response.data.listings[0];
  });

  it('should be able to pull a detailed version of the listing', async () => {
    const response = await reverb.getOneListing({ id: listing.id.toString() });
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();

    listing = response.data;
  });

  it('should be able to download photos from a listing', async ({}) => {
    expect(listing.photos.length).toBeGreaterThan(0);

    for (const photo of listing.photos) {
      const photoUrl = photo._links.large_crop.href;
      const res = await fetch(photoUrl);
      expect(res.ok).toBe(true);

      const photoBuffer = new Uint8Array(await res.arrayBuffer());
      const filePath = path.join(
        tempDir,
        `photo_${listing.id}_${photoUrl.split('/').pop()}`,
      );
      await fs.writeFile(filePath, photoBuffer);
    }

    const files = readdirSync(tempDir);
    expect(files.length).toBe(listing.photos.length);
  });
});
