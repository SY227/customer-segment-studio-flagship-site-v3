# Source grounding

This website is grounded in the current public repository at:

- https://github.com/SY227/Customer-Segment-Studio
- Live product: https://customer-segment-studio.vercel.app/

## Product structure reviewed

The current source was reviewed across:

- `app/page.tsx`
- `app/api/segment-analysis/route.ts`
- `src/lib/deterministicSegmentAnalysis.ts`
- `src/data/segmentGuildData.ts`
- `src/components/HeaderActionsClient.tsx`
- `src/components/SegmentGuildCanvas.tsx`
- `src/components/SegmentCardAvatar.tsx`
- `app/globals.css`
- `docs/ASSETS.md`

## Claims used on the site

### File input

The current interface accepts CSV, XLS, and XLSX. The documented minimum fields are:

- `customer_uid`
- `purchase_date`
- `total`

### Deterministic hard metrics

The deterministic engine:

1. aggregates rows by customer,
2. finds the latest purchase date in the dataset,
3. calculates recency days, order count, and total spend,
4. scores those distributions,
5. assigns one of nine customer groups,
6. recalculates total revenue, customer count, and revenue share.

### Nine current groups

- Best Customers
- Loyal Buyers
- New Buyers
- At-Risk VIPs
- Growing Buyers
- Occasional Buyers
- Dormant VIPs
- Light Repeaters
- Inactive Customers

### Strategic guidance

The source defines each group with:

- best channel
- KPI
- objective
- action preview
- messaging angle
- sample tactic
- interpretation
- time horizon
- offer intensity
- speech bubble

### Optional AI boundary

When a Gemini API key is configured, the current API may refine only the soft guidance fields from segment-level hard metrics. The prompt explicitly prevents changes to customer count, revenue share, total revenue, segment revenue, source label, or segment labels.

### Visual experience

The living map uses Three.js, real GLB character assets, real FBX room/prop assets, an orthographic camera, lighting, fog, and fallback roaming motion. The current selected group rotates automatically unless the user chooses to keep one group selected.

## Deliberately excluded claims

The website does not claim:

- churn prediction
- causal revenue lift
- CAC, LTV, or profitability calculation
- cost-to-serve calculation
- CRM integration
- customer-level AI scoring
- benchmark performance
- production data governance beyond what the current source supports
