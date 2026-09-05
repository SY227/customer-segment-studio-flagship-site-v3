# QA — V2.1.0

## Completed

- 19 automated Node tests passed.
- 59 required files checked; syntax and embedded-secret guards passed.
- Static `dist/` build completed with original Vercel settings unchanged.
- 41 original character, screenshot and logo assets verified against baseline SHA-256 hashes.
- 40 browser/HTTP assertions passed. See `BROWSER_QA_RESULTS.json`.
- Desktop/mobile layouts rendered at 320, 390, 768, 1024, 1440 and 1920 pixel widths, with no horizontal overflow.
- All displayed images loaded and decoded.
- Automatic reveal completes, Pause freezes it, step buttons select stills, and Show product exits immediately.
- Three product tabs switch the same case's screenshot/crops, including arrow/Home/End keyboard navigation and focus state.
- Character selections update the strategy prompt and pressed state.
- Image lightbox, methodology disclosure, review dialog and Escape/focus restoration checked.
- Email-brief construction and encoding verified. Clipboard-denied fallback exposes selectable text.
- Reduced-motion: no autoplay; manual stills work.
- JavaScript disabled: original product screenshot, content, and mailto contact remain available.
- No browser script exceptions or failing image/script/CSS responses.

## Exact environment boundary

The container's Chromium policy blocks top-level URL navigation. Therefore the original HTML was loaded into an isolated Chromium document with a localhost base URL, while all production JavaScript, CSS and image files were served by the actual local Node server. No application functions or asset-resolution logic were mocked. Separate HTTP checks confirmed status codes and content types from that server.

This is browser-rendered UI and interaction testing plus local HTTP testing, not a claim that a new Vercel deployment was created or end-to-end tested. Real email-client delivery was not tested; the website only prepares the draft. Safari/iOS device testing and real-user conversion results are not claimed.


## V2.1.2 targeted regression

- Dormant VIP portrait and tile are the only baseline character assets intentionally changed.
- All other baseline images remain hash-checked.
- Order Ledger uses one additional static crop from the existing living-map screenshot.
- `npm run qa` passes locally.
