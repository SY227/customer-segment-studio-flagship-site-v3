/* Small, dependency-free presentation helpers, shared by UI and tests. */
window.STUDIO_LOGIC = Object.freeze({
  duration: 6400,
  phaseAt(ms) { return ms < 1800 ? 'orders' : ms < 4200 ? 'groups' : ms < 6400 ? 'move' : 'product'; },
  phaseStart(phase) { return ({ orders: 0, groups: 1800, move: 4200, product: 6400 })[phase] ?? 6400; },
  campaign(search, campaigns) {
    const key = new URLSearchParams(search).get('story');
    return key === 'reveal' || key === 'direct' ? { key, ...campaigns[key] } : { key: 'evergreen', ...campaigns.evergreen };
  },
  brief(values) {
    const clean = (value, max) => String(value || '').replace(/\r/g, '').trim().slice(0, max);
    return ['Hi Simon,', '', 'I would like to discuss a customer segmentation review.', '',
      `Company / website: ${clean(values.company, 120)}`,
      `Priority: ${clean(values.goal, 80)}`,
      `Approximate customer count: ${clean(values.size, 80)}`,
      '', 'Decision / context:', clean(values.context, 800) || 'Happy to discuss.', '',
      'Sent from Customer Segment Studio. No customer records attached.'
    ].join('\n');
  },
  mailto(email, brief) {
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) throw new Error('Invalid review email');
    return `mailto:${email}?subject=${encodeURIComponent('Customer Segment Studio — segmentation review')}&body=${encodeURIComponent(brief)}`;
  }
});
