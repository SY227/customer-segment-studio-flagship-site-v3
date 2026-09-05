# QA — V3.1.1 Tabbed Commercial Layout

## Completed in this release

- `npm run check` passed.
- 19/19 Node tests passed.
- Static `dist/` build completed.
- 60 required files checked.
- Existing product screenshots and baseline character assets remain byte-for-byte preserved, except the previously approved Dormant VIP correction carried forward from V2.1.2.
- Five top-level content tabs are present and wired for click plus ArrowLeft / ArrowRight / Home / End keyboard navigation.
- Overview retains one commercial hero, the finite Order History → Nine Groups → Next Move visual story, the nine-character segment rail, and the segmentation-review entry.
- See the Field uses the real Dormant VIPs product screen.
- Understand Groups uses the existing same-case product crop and all nine current segment mappings.
- Make the Move uses the existing same-case action crop and keeps recommendations explicitly framed as guidance to test.
- Business Value retains growth, spend, and RFM-method content.
- Review flow prepares an email draft or copies a bounded brief; it does not upload customer data or claim a server submission.
- No external runtime library, API key, embedded app, or new serverless function was introduced.
- Vercel continues to build with `npm run build` and publish `dist/`.

## Browser boundary

The current container policy blocks top-level Chromium navigation, including localhost and file URLs, so a new screenshot-based browser pass could not be executed in this build session. The release therefore claims automated source, behavior-contract, asset-integrity, syntax, and build QA only. The package should still receive a normal Safari/Chrome/iPhone visual check before production promotion.

## Historical note

V2.1.2 fixed the Dormant VIP browser-background issue and integrated existing character art into the Order Ledger story. Those corrected assets are retained in V3.1.1.
