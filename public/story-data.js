/* Presentation content only. Nothing in this file changes the live product or calculates RFM. */
window.STUDIO_CONTENT = Object.freeze({
  version: '3.1.1',
  reviewEmail: 'simon.yam227@gmail.com',
  productUrl: 'https://customer-segment-studio.vercel.app/',
  campaigns: {
    evergreen: { eyebrow: 'INTERACTIVE CUSTOMER SEGMENTATION', hook: 'Your customer list is hiding nine different stories.' },
    reveal: { eyebrow: 'SEE WHAT YOUR CUSTOMER LIST IS HIDING', hook: 'Same customer list. A different story underneath.' },
    direct: { eyebrow: 'CUSTOMER STRATEGY, WITHOUT THE GUESSWORK', hook: 'Different customers. The same campaign?' }
  },
  groups: [
    { id: 'best-customers', name: 'Best Customers', action: 'Protect value', color: '#d9b66c', signal: 'Active repeat customers with strong historical contribution.', move: 'Test recognition, early access, or loyalty benefits before increasing discounts.' },
    { id: 'loyal-buyers', name: 'Loyal Buyers', action: 'Sustain loyalty', color: '#75d8b4', signal: 'Customers with a consistent history of repeat purchasing.', move: 'Make reordering easy and test a relevant cross-sell instead of a generic promotion.' },
    { id: 'new-buyers', name: 'New Buyers', action: 'Guide the next purchase', color: '#7bc0ff', signal: 'Recent, low-frequency buyers need a different follow-up from dormant customers.', move: 'Test a relevant post-purchase follow-up and track the next purchase.' },
    { id: 'at-risk-vips', name: 'At-Risk VIPs', action: 'Review the slowdown', color: '#ff9a7a', signal: 'Historically valuable customers whose recent purchase activity is weaker.', move: 'Review the purchase gap and test a relevant reason to return before deeper incentives.' },
    { id: 'growing-buyers', name: 'Growing Buyers', action: 'Build momentum', color: '#c7b47c', signal: 'Repeat buyers who may benefit from a more relevant next offer.', move: 'Test a follow-up based on purchase history, then measure repeat purchasing.' },
    { id: 'occasional-buyers', name: 'Occasional Buyers', action: 'Find the right occasion', color: '#c484ff', signal: 'Infrequent buyers should not automatically receive more frequent campaigns.', move: 'Test timing and relevance through a lower-cost channel before increasing spend.' },
    { id: 'dormant-vips', name: 'Dormant VIPs', action: 'Test a win-back', color: '#b88462', signal: 'Past value is substantial. Recent purchasing has gone quiet.', move: 'Use a strong comeback reason before spending more to reactivate.' },
    { id: 'light-repeaters', name: 'Light Repeaters', action: 'Build the repeat habit', color: '#87d7ff', signal: 'Customers who have repeated before but currently show weak momentum.', move: 'Test a simple, low-cost reorder prompt rather than assuming strong loyalty.' },
    { id: 'inactive-customers', name: 'Inactive Customers', action: 'Keep outreach selective', color: '#a8b6d1', signal: 'Long-inactive customers with little recent purchase signal.', move: 'Test light-touch outreach and evaluate response before allocating more effort.' }
  ],
  caseStudy: {
    segment: 'Dormant VIPs',
    source: 'assets/screens/living-map-dormant-vips',
    dataLabel: 'Same product example · Demo data',
    facts: { customers: 64, revenueShare: 13, historicalRevenue: 161200, currency: 'USD' },
    limitation: 'The screen labels this “Revenue at stake.” It represents historical revenue in the demo, not a forecast or a promised recovery.'
  }
});
