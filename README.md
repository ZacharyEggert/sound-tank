<h1 align="center">
 Sound Tank
</h1>

<p align="center">
 A library to interface with <a href="https://www.reverb.com/" target="_blank">Reverb's</a> API programmatically.
</p>

<p align="center">
 To get started, just run <code>npm install sound-tank</code> in your project's directory, or <code>yarn add sound-tank</code> if you prefer Yarn.
</p>

<h2>
  Example Usage
</h2>

```typescript
import Reverb from 'sound-tank';

const { REVERB_API_KEY } = process.env;

(async () => {
  const reverb = new Reverb({ apiKey: REVERB_API_KEY });

  const response = await reverb.getMyListings({
    perPage: 10,
    page: 1,
    state: 'all',
  });

  const { listings } = response.data;

  listings.forEach((listing) => {
    console.log(listing.title);
  });
})();
```
