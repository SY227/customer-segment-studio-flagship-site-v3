# Customer Segment Studio flagship website — V2.1.2

**Segmentation made simple. Strategy made visible.**

Website-only update based on the current `SY227/customer-segment-studio-flagship-site-v2` main branch (package 0.3.7). This package has not been pushed to GitHub or deployed to Vercel. The original website and the Customer Segment Studio application are untouched.

## Run

Requires Node.js 20 or newer. No dependencies and no API keys are required.

```bash
npm run qa
PORT=3011 npm run dev
```

Open `http://localhost:3011/`.

- `/?story=reveal` — original system-reveal-style campaign opening.
- `/?story=direct` — direct business opening, with the product screenshot shown immediately.
- `/` — evergreen opening; the short story plays once per browser tab/session when it enters view.

Use the three story step buttons to inspect stills; Pause, Replay and Show product are available. Reduced-motion users get the real screenshot first and can select stills without automatic playback.

## What changed

- A finite 6.4-second illustrated story: an order list → the nine existing characters → a Dormant VIPs next move → the actual product screenshot. It does not process data or impersonate live analytics.
- One consistent product walkthrough: the original Dormant VIPs image, an unedited context crop, and an unedited action crop.
- Short business action identities and an inspectable strategy prompt for the nine existing characters.
- Existing characters connect the revenue and effort-allocation explanations.
- A bottom-of-page segmentation-review request opens an email draft, with a copy/manual-copy fallback. It never sends a message or uploads customer data.
- Accessible keyboard tabs, visible no-JavaScript fallback, reduced-motion behavior, and static deployment safeguards.

## Deliberately preserved

The product screenshots and every character asset except **Dormant VIPs** remain byte-for-byte unchanged from V2.1.0. Dormant VIPs now uses the original warm KayKit Barbarian colors instead of the pale-purple marketing treatment. The story also adds one environment crop from the real living-map game world as the backdrop for the Order Ledger. No new 3D runtime, canvas, iframe, app embed, video, APIs, or tracking service were introduced.

The existing cream/graphite/gradient palette, core headline, section order, product link and Vercel `dist` configuration remain. The seven-character decorative hero cast is retained; the illustrated reveal and the group selector each show all nine.

## Contact configuration

The review recipient is `simon.yam227@gmail.com`, matching the user's supplied contact. Change `reviewEmail` in `public/story-data.js` AND the static mailto fallback/address in `public/index.html` together when changing recipients.

No SMTP, form service, database, cookies, or analytics backend is configured. Form values remain in page memory until a visitor explicitly copies them or opens an email draft. Sending that draft remains the visitor's action. Check real delivery in your own email client before public promotion.

## Deployment boundary

`npm run build` copies `public/` into `dist/`. Production is static. `server.mjs` is only the local preview server. No production `start` script exists. `vercel.json` preserves `framework: null`, `buildCommand: npm run build`, and `outputDirectory: dist`.

Do not recreate or overwrite the original site project. Test this package locally first. Use a preview branch in the existing **V2** repository for the next deployment, not the original repository and not V2 main until reviewed. See `docs/DEPLOY_PREVIEW.md`.

## Checks

- `npm run check`: required files, syntax, secret scan, and Vercel static-output guards.
- `npm test`: 19 source/behavior/data-boundary/asset-preservation tests.
- `npm run qa`: check → tests → build.

`docs/QA_REPORT.md` documents browser checks and the precise test-environment limitation. No production hosting or campaign conversion claims are made.
