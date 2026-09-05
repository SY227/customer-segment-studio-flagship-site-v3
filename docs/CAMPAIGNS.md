# Evergreen story + replaceable campaign entry

The approved headline stays unchanged. Cultural resonance affects the entry framing and subtle visual treatment, not the product, pricing, calculation, or customer claims.

## Entry modes

- `/`: evergreen. "Your customer list is hiding nine different stories."
- `/?story=reveal`: an original system-reveal-style opening. "Same customer list. A different story underneath."
- `/?story=direct`: direct business opening. "Different customers. The same campaign?" This mode starts with the real product screenshot and leaves the storyboard user-controlled.

Unknown story values fall back to evergreen and are never injected into HTML.

Edit `campaigns` in `public/story-data.js` to change the copy. The reveal illustration, actual product proof, character identities and contact path remain shared.

## What this is not

This build does not claim that a particular anime/game is currently trending with CRM buyers. It does not use any third-party franchise's name, character, dialogue, footage, music or logo. The general reveal rhythm is not equivalent to the recognition of a specific IP.

For an event-linked campaign, verify the actual event and relevant audience attention before distribution. Change only the opening first, and record which link was used. Do not delay the evergreen product story while waiting for a viral moment.

## Measurement boundary

The page emits `studio:engagement` CustomEvents with `action`, `item`, and `campaign`. They contain no form fields/customer records and are NOT sent to any analytics service. Event hooks exist for future wiring only. No traffic dashboard, split-testing framework, or conversion uplift is claimed.

Supported events include `try-studio`, `product-tab`, `group-story`, `story-step`, `story-toggle`, `story-skip`, `product-image`, `review-open`, `review-email-draft`, and `review-copy`.

These versions are qualitative creative options, not a controlled statistical experiment: direct also changes autoplay behavior. Use the same behavior when testing only wording.
