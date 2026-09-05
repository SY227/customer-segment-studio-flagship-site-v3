# Customer Segment Studio — Flagship Site V3.1.1

V3.1.1 converts the commercial site from a long-scroll story into a tabbed product experience while keeping the existing Customer Segment Studio product screenshots, nine segment mappings, review flow, and static deployment architecture.

## Primary tabs

- Overview
- See the Field
- Understand Groups
- Make the Move
- Business Value

The Overview follows the approved composition: dark top navigation, large two-column hero, living-segment-map story card, nine-segment character rail, and segmentation-review card.

## Run locally

```bash
npm run qa
PORT=3014 npm run dev
```

Then open `http://localhost:3014`.

## Build

```bash
npm run build
```

Vercel serves the static `dist/` directory. No API key, runtime dependency, or serverless function is required for this marketing site.
