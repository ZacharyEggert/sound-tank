import { beforeAll, describe, expect, it } from "vitest";
import Reverb from "../../src";
import { SANDBOX_KEY, createSandboxClient } from "./helpers";
import { ListingStates } from "~/types";

describe.skipIf(!SANDBOX_KEY)("Sandbox: Listings", () => {
  let reverb: Reverb;

  beforeAll(() => {
    reverb = createSandboxClient();
  });

  it("should fetch first page of my listings", async () => {
    const response = await reverb.listings.getMy({ page: 1, perPage: 5 });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.listings)).toBe(true);
  });

  it("should fetch a single listing by id", async () => {
    const page = await reverb.listings.getMy({ page: 1, perPage: 1 });
    const listings = page.data.listings;

    if (listings.length === 0) {
      console.warn("No listings found in sandbox — skipping getOne assertion");
      return;
    }

    const id = listings[0].id.toString();
    const response = await reverb.listings.getOne({ id });

    expect(response.status).toBe(200);
    expect(response.data.id.toString()).toBe(id);
  });

  it("should return photo urls from getPhotos", async () => {
    const page = await reverb.listings.getMy({ page: 1, perPage: 1 });
    const listings = page.data.listings;

    if (listings.length === 0) {
      console.warn("No listings found in sandbox — skipping getPhotos assertion");
      return;
    }

    const id = listings[0].id.toString();
    const photos = await reverb.listings.getPhotos({ id });

    expect(Array.isArray(photos)).toBe(true);
  });

  it("should stream all listings without error", async () => {
    const all: unknown[] = [];

    for await (const listing of reverb.listings.streamAllMy({ state: ListingStates.ALL })) {
      all.push(listing);
      if (all.length >= 10) break; // guard against large sandboxes
    }

    expect(all.length).toBeGreaterThanOrEqual(0);
  });
});
