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

test('approved positioning, original light palette and no template navigation', () => {
  assert.match(html, /Segmentation made simple\./);
  assert.match(html, /Strategy made visible\./);
  assert.match(html, /Turn customer data into an interactive strategy map/);
  assert.doesNotMatch(html, /site-header|site-nav|header-cta|menu-button/);
  assert.match(css, /--paper: #f4f1eb/);
  assert.match(css, /padding:\s*clamp\(18px, 2vw, 28px\) 0 76px/);
});

test('hero has one product CTA; review intent only appears at the close', () => {
  const hero = html.slice(html.indexOf('<section class="hero'), html.indexOf('<section aria-label="Current product'));
  assert.equal((hero.match(/href="https:\/\/customer-segment-studio\.vercel\.app\//g) || []).length, 1);
  assert.doesNotMatch(hero, /Request a segmentation review/);
  assert.match(html, /Request a segmentation review/);
});

test('static marketing surface never embeds or modifies the product', () => {
  assert.doesNotMatch(html, /<iframe|<video|<canvas|PlanFox|trusted by|testimonial/i);
  assert.doesNotMatch(html, /github\.com|GitHub|View source/i);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
  assert.match(html, /https:\/\/customer-segment-studio\.vercel\.app\//);
});

test('all baseline assets except the explicitly corrected Dormant VIP artwork are byte-for-byte preserved', async () => {
  const hashes = JSON.parse(await load('docs/BASELINE_ASSET_HASHES.json'));
  const corrected = new Set([
    'public/assets/characters/portraits/dormant-vips.png',
    'public/assets/characters/portraits/dormant-vips.webp',
    'public/assets/characters/tiles/dormant-vips.png',
    'public/assets/characters/tiles/dormant-vips.webp'
  ]);
  assert.ok(Object.keys(hashes).length >= 40);
  for (const [path, expected] of Object.entries(hashes)) {
    if (corrected.has(path)) continue;
    const bytes = await fs.readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expected, path);
  }
});

test('three product tabs are connected to an accessible shared panel', () => {
  assert.equal((html.match(/role="tab"/g) || []).length, 3);
  assert.equal((html.match(/aria-controls="experience-panel"/g) || []).length, 3);
  assert.match(html, /id="experience-panel"[^>]+role="tabpanel"/);
  assert.match(js, /ArrowRight/); assert.match(js, /ArrowLeft/);
  assert.match(js, /Home/); assert.match(js, /End/);
  assert.match(js, /tab\.tabIndex = active \? 0 : -1/);
});

test('tabs use one real screenshot and unedited crops from the same example', () => {
  assert.match(js, /content\.caseStudy\.source/);
  assert.match(js, /assets\/story\/dormant-vips-context/);
  assert.match(js, /assets\/story\/dormant-vips-action/);
  assert.doesNotMatch(js, /living-map-occasional-buyers|living-map-growing-buyers/);
  assert.equal(content.caseStudy.segment, 'Dormant VIPs');
  assert.equal(content.caseStudy.facts.customers, 64);
  assert.equal(content.caseStudy.facts.revenueShare, 13);
  assert.equal(content.caseStudy.facts.historicalRevenue, 161200);
});

test('screen metrics are historical demo evidence, not a promised result', () => {
  assert.match(html, /Demo data/);
  assert.match(html, /Historical contribution, not a revenue forecast/);
  assert.match(js, /not tell us why someone stopped buying or guarantee a return/);
  assert.match(content.caseStudy.limitation, /not a forecast/);
});

test('all nine existing names and character mappings remain', () => {
  assert.deepEqual(Array.from(content.groups, g => g.name), expectedNames);
  assert.equal(new Set(content.groups.map(g => g.id)).size, 9);
  for (const group of content.groups) {
    assert.match(html, new RegExp(`data-group="${group.id}"`));
    assert.match(html, new RegExp(`assets/characters/tiles/${group.id}\\.webp`));
    assert.ok(group.action.length <= 28);
  }
});

test('nine-group interaction is guidance, not simulated customer sentiment', () => {
  assert.match(html, /Strategy prompts, not customer quotes or predicted outcomes/);
  assert.match(js, /textContent = value/);
  assert.doesNotMatch(contentScript, /sentiment|\bS-rank\b|shadow army/i);
});

test('order history uses the existing game world as a visual bridge without changing the product', () => {
  assert.match(html, /order-ledger-world\.webp/);
  assert.match(html, /ORDER LEDGER/);
  assert.match(html, /class="ledger-guide"/);
  assert.match(html, /portraits\/loyal-buyers\.webp/);
  assert.match(css, /\.ledger-scene/);
  assert.match(css, /\.ledger-guide/);
  assert.match(contentScript, /dormant-vips[^\n]+#b88462/);
});

test('visual narrative is explicitly illustrated rather than a live calculation', () => {
  assert.match(html, /Workflow illustration · Not a live analysis/);
  assert.doesNotMatch(html + contentScript, /GROUPS FOUND|STORIES DETECTED|customers detected/i);
  assert.equal((html.match(/class="reveal-person"/g) || []).length, 9);
});

test('finite story phase boundaries end on the genuine product', () => {
  assert.equal(logic.duration, 6400);
  for (const [ms, expected] of [[0,'orders'],[1799,'orders'],[1800,'groups'],[4199,'groups'],[4200,'move'],[6399,'move'],[6400,'product'],[99999,'product']]) assert.equal(logic.phaseAt(ms), expected);
  for (const phase of ['orders','groups','move','product']) assert.equal(logic.phaseAt(logic.phaseStart(phase)), phase);
  assert.equal(logic.phaseStart('unknown'), 6400);
});

test('story can be paused, skipped, replayed and reduced to stills', () => {
  assert.match(html, /data-story-toggle/); assert.match(html, /data-story-skip/);
  assert.match(js, /cancelAnimationFrame/); assert.match(js, /visibilitychange/);
  assert.match(js, /motionQuery\.matches/); assert.match(js, /campaign\.key === 'direct'/);
  assert.match(css, /prefers-reduced-motion/);
});

test('campaign variants are an allowlist, not untrusted copy injection', () => {
  assert.equal(logic.campaign('?story=reveal', content.campaigns).key, 'reveal');
  assert.equal(logic.campaign('?story=direct', content.campaigns).key, 'direct');
  assert.equal(logic.campaign('?story=%3Cscript%3E', content.campaigns).key, 'evergreen');
  assert.equal(logic.campaign('', content.campaigns).key, 'evergreen');
  assert.doesNotMatch(html + contentScript, /Solo Leveling|TFT|Planhat|KARMA|Netmarble/i);
});

test('existing section order and on-demand methodology stay compact', () => {
  const labels = ['THE PRODUCT EXPERIENCE','BUSINESS VALUE','HOW IT WORKS','YOUR CUSTOMER BASE'];
  const positions = labels.map(label => html.indexOf(label));
  assert.ok(positions.every((n,i) => n > 0 && (!i || n > positions[i - 1])));
  assert.match(html, /<details class="method-details">/);
  assert.match(html, /deterministic/);
  assert.match(html, /does not claim churn prediction, causal uplift, LTV, CAC, or profitability/);
});

test('static review contact starts a draft, never pretends to submit', () => {
  assert.match(html, /mailto:simon\.yam227@gmail\.com/);
  assert.match(html, /No customer data needed/);
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

test('no API key, external runtime library or new serverless function', async () => {
  const pkg = JSON.parse(await load('package.json'));
  const config = JSON.parse(await load('vercel.json'));
  assert.equal(pkg.version, '3.0.0');
  assert.equal(pkg.scripts.start, undefined);
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.buildCommand, 'npm run build');
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('baseline rendering remains visible without JavaScript', () => {
  assert.match(html, /data-phase="product"/);
  assert.match(css, /\.reveal \{ opacity: 1; transform: none/);
  assert.match(html, /data-story-controls hidden/);
});
