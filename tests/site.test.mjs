import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import vm from 'node:vm';

const load = path => fs.readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const html = await load('public/index.html');
const css = await load('public/styles.css');
const js = await load('public/app.js');
const contentScript = await load('public/story-data.js');
const logicScript = await load('public/story-logic.js');
const context = vm.createContext({ window: {}, URLSearchParams });
vm.runInContext(contentScript, context);
vm.runInContext(logicScript, context);
const content = context.window.STUDIO_CONTENT;
const logic = context.window.STUDIO_LOGIC;
const expectedNames = ['Best Customers', 'Loyal Buyers', 'New Buyers', 'At-Risk VIPs', 'Growing Buyers', 'Occasional Buyers', 'Dormant VIPs', 'Light Repeaters', 'Inactive Customers'];

test('V3.1 uses the approved tabbed commercial layout and positioning', () => {
  assert.match(html, /Segmentation[\s\S]*made simple\./);
  assert.match(html, /Strategy[\s\S]*made visible\./);
  assert.match(html, /Turn customer data into an interactive strategy map/);
  assert.match(html, /class="topbar"/);
  assert.match(html, /class="primary-tabs"/);
  assert.match(css, /linear-gradient\(110deg, #202732/);
  assert.match(css, /grid-template-columns: minmax\(420px, \.79fr\) minmax\(680px, 1\.21fr\)/);
});

test('five top-level tabs switch five content panels accessibly', () => {
  assert.equal((html.match(/data-page-tab=/g) || []).length, 5);
  assert.equal((html.match(/data-page-panel=/g) || []).length, 5);
  for (const key of ['overview','field','group','move','value']) {
    assert.match(html, new RegExp(`id="tab-${key}"`));
    assert.match(html, new RegExp(`id="panel-${key}"`));
  }
  assert.match(js, /const selectPage/);
  assert.match(js, /ArrowRight/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /Home/);
  assert.match(js, /End/);
  assert.match(js, /tab\.tabIndex = active \? 0 : -1/);
});

test('overview mirrors the approved composition without turning into a long scrolling template', () => {
  const overview = html.slice(html.indexOf('id="panel-overview"'), html.indexOf('id="panel-field"'));
  assert.match(overview, /hero-copy/);
  assert.match(overview, /hero-product-card/);
  assert.match(overview, /segment-rail/);
  assert.match(overview, /review-card/);
  assert.match(overview, /Nine clear groups/);
  assert.match(overview, /Practical next steps/);
  assert.match(overview, /Works with your data/);
});

test('overview keeps one main product CTA and one review conversion entry', () => {
  const overview = html.slice(html.indexOf('id="panel-overview"'), html.indexOf('id="panel-field"'));
  assert.ok((overview.match(/Try Customer Segment Studio/g) || []).length >= 1);
  assert.equal((overview.match(/Request a segmentation review/g) || []).length, 1);
  assert.match(overview, /See it in action/);
});

test('static marketing surface never embeds or modifies the live product', () => {
  assert.doesNotMatch(html, /<iframe|<video|<canvas|trusted by|testimonial/i);
  assert.doesNotMatch(html, /github\.com|GitHub|View source/i);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
  assert.match(html, /https:\/\/customer-segment-studio\.vercel\.app\//);
});

test('baseline product and character assets remain byte-for-byte preserved', async () => {
  const hashes = JSON.parse(await load('docs/BASELINE_ASSET_HASHES.json'));
  const corrected = new Set([
    'public/assets/characters/portraits/dormant-vips.png',
    'public/assets/characters/portraits/dormant-vips.webp',
    'public/assets/characters/tiles/dormant-vips.png',
    'public/assets/characters/tiles/dormant-vips.webp',
    'public/assets/characters/tiles/occasional-buyers.png',
    'public/assets/characters/tiles/occasional-buyers.webp',
    'public/assets/characters/tiles/inactive-customers.png',
    'public/assets/characters/tiles/inactive-customers.webp'
  ]);
  assert.ok(Object.keys(hashes).length >= 40);
  for (const [path, expected] of Object.entries(hashes)) {
    if (corrected.has(path)) continue;
    const bytes = await fs.readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expected, path);
  }
});

test('order history is the opening hero state with game character art supporting the ledger', () => {
  assert.match(html, /data-phase="orders"/);
  assert.match(html, /ORDER LEDGER/);
  assert.match(html, /Customer ID/);
  assert.match(html, /Purchase date/);
  assert.match(html, /Order value/);
  assert.match(html, /order-ledger-world\.webp/);
  assert.match(html, /class="ledger-guide"/);
  assert.match(html, /portraits\/loyal-buyers\.webp/);
  assert.match(html, /Different[\s\S]*customers\.[\s\S]*Different needs\.[\s\S]*Different moves\./);
  assert.match(css, /\.ledger-guide/);
  assert.match(css, /\.story-blackboard/);
});

test('story remains finite, controllable, and explicitly illustrative', () => {
  assert.match(html, /Workflow illustration · Not a live analysis/);
  assert.match(html, /data-story-toggle/);
  assert.match(html, /data-story-skip/);
  assert.equal((html.match(/class="reveal-person"/g) || []).length, 9);
  assert.equal(logic.duration, 6400);
  for (const [ms, expected] of [[0,'orders'],[1799,'orders'],[1800,'groups'],[4199,'groups'],[4200,'move'],[6399,'move'],[6400,'product']]) assert.equal(logic.phaseAt(ms), expected);
  assert.match(js, /cancelAnimationFrame/);
  assert.match(css, /prefers-reduced-motion/);
});

test('See the Field uses the real Dormant VIPs product screen and historical demo framing', () => {
  const field = html.slice(html.indexOf('id="panel-field"'), html.indexOf('id="panel-group"'));
  assert.match(field, /living-map-dormant-vips\.webp/);
  assert.match(field, /64 customers and 13% of historical revenue/);
  assert.match(field, /Historical contribution, not a revenue forecast/);
});

test('Understand Groups preserves all nine names and interactive strategy prompts', () => {
  assert.deepEqual(Array.from(content.groups, g => g.name), expectedNames);
  assert.equal(new Set(content.groups.map(g => g.id)).size, 9);
  const correctedPortraitGroups = new Set([
    'occasional-buyers',
    'inactive-customers'
  ]);

  for (const group of content.groups) {
    assert.match(html, new RegExp(`data-group="${group.id}"`));

    const expectedArt = correctedPortraitGroups.has(group.id)
      ? `assets/characters/portraits/${group.id}-rail.webp`
      : `assets/characters/tiles/${group.id}.webp`;

    assert.ok(
      html.includes(expectedArt),
      `Missing expected character art for ${group.name}`
    );

    assert.ok(group.action.length <= 28);
  }
  assert.match(html, /Strategy prompts, not customer quotes or predicted outcomes/);
  assert.match(js, /data-group-avatar/);
  assert.match(js, /textContent = value/);
});

test('Understand Groups keeps the selected-group experience fully dynamic', () => {
  const group = html.slice(html.indexOf('id="panel-group"'), html.indexOf('id="panel-move"'));

  assert.doesNotMatch(group, /assets\/story\/dormant-vips-context\.webp/);
  assert.match(group, /class="group-insight-card"/);
  assert.match(group, /data-group-avatar/);
  assert.match(group, /data-group-name/);
  assert.match(group, /data-group-action/);
  assert.match(group, /data-group-signal/);
  assert.match(group, /data-group-move/);
  assert.match(group, /class="group-picker"/);
});

test('Make the Move uses the same example and keeps recommendations as testable guidance', () => {
  const move = html.slice(html.indexOf('id="panel-move"'), html.indexOf('id="panel-value"'));
  assert.match(move, /assets\/story\/dormant-vips-action\.webp/);
  assert.match(move, /Test a reason to return/);
  assert.match(move, /starting point for a business decision, not proof that a campaign will work/);
  assert.match(move, /14-day window/);
});

test('Business Value contains the prior growth, spend, and RFM method content', () => {
  const value = html.slice(html.indexOf('id="panel-value"'), html.indexOf('</main>'));
  assert.match(value, /GROW REVENUE/);
  assert.match(value, /SPEND SMARTER/);
  assert.match(value, /HOW IT WORKS/);
  assert.match(value, /Recency, Frequency, and Monetary/);
  assert.match(value, /customer ID, purchase date, and transaction value/i);
});

test('methodology remains compact and does not overclaim', () => {
  assert.match(html, /<details class="method-details">/);
  assert.match(html, /deterministic code/);
  assert.match(html, /does not claim churn prediction, causal uplift, LTV, CAC, or profitability/);
  assert.match(content.caseStudy.limitation, /not a forecast/);
});

test('campaign variants remain an allowlist rather than copy injection', () => {
  assert.equal(logic.campaign('?story=reveal', content.campaigns).key, 'reveal');
  assert.equal(logic.campaign('?story=direct', content.campaigns).key, 'direct');
  assert.equal(logic.campaign('?story=%3Cscript%3E', content.campaigns).key, 'evergreen');
  assert.equal(logic.campaign('', content.campaigns).key, 'evergreen');
  assert.doesNotMatch(html + contentScript, /Solo Leveling|TFT|Planhat|KARMA|Netmarble/i);
});

test('review contact starts a local email draft and never pretends to submit customer data', () => {
  assert.match(html, /mailto:simon\.yam227@gmail\.com/);
  assert.doesNotMatch(html, /type="file"/);
  assert.match(js, /Nothing has been sent/);
  assert.match(js, /Copy the selected brief/);
  assert.doesNotMatch(js, /localStorage|form\.submit\(/);
});

test('email brief is bounded and properly encoded', () => {
  const text = logic.brief({ company: 'ACME & Co\r\nNew line', goal: 'Retention', size: '1,000–10,000', context: 'Question? a=b&cc=bad@example.org\n'+'a'.repeat(1000) });
  const url = logic.mailto(content.reviewEmail, text);
  assert.match(url, /^mailto:simon\.yam227@gmail\.com\?subject=/);
  assert.ok(!url.includes('&cc='));
  assert.ok(!url.includes('\n'));
  assert.ok(text.length < 1400);
  assert.throws(() => logic.mailto('x@example.org?cc=bad', text));
});

test('V3.1 stays static, dependency-free, and Vercel-ready', async () => {
  const pkg = JSON.parse(await load('package.json'));
  const config = JSON.parse(await load('vercel.json'));
  assert.equal(pkg.version, '3.1.1');
  assert.equal(content.version, '3.1.1');
  assert.equal(pkg.scripts.start, undefined);
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.buildCommand, 'npm run build');
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('responsive layout includes desktop, tablet, mobile, and reduced-motion behavior', () => {
  assert.match(css, /@media \(max-width: 1320px\)/);
  assert.match(css, /@media \(max-width: 1080px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 460px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
