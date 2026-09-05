import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const required = [
  'public/index.html', 'public/styles.css', 'public/app.js', 'public/story-data.js', 'public/story-logic.js', 'public/assets/segment-studio-mark.svg',
  'public/assets/screens/living-map-growing-buyers.webp', 'public/assets/screens/living-map-growing-buyers.png',
  'public/assets/screens/living-map-dormant-vips.webp', 'public/assets/screens/living-map-dormant-vips.png',
  'public/assets/screens/living-map-occasional-buyers.webp', 'public/assets/screens/living-map-occasional-buyers.png',
  'public/assets/screens/customer-segment-cards.webp', 'public/assets/screens/customer-segment-cards.png',
  'public/assets/story/order-ledger-world.png', 'public/assets/story/order-ledger-world.webp',
  'docs/SOURCE_GROUNDING.md', 'docs/SCREENSHOT_SOURCES.md', 'docs/DESIGN_NOTES.md', 'docs/CHARACTER_SOURCES.md', 'docs/licenses/kaykit-adventurers-license.txt', 'README.md',
  'server.mjs', 'build.mjs', 'vercel.json', 'public/assets/story/dormant-vips-context.png', 'public/assets/story/dormant-vips-context.webp', 'public/assets/story/dormant-vips-action.png', 'public/assets/story/dormant-vips-action.webp'
];

const characterSlugs = ['best-customers','loyal-buyers','new-buyers','at-risk-vips','growing-buyers','occasional-buyers','dormant-vips','light-repeaters','inactive-customers'];
for (const slug of characterSlugs) {
  required.push(`public/assets/characters/tiles/${slug}.webp`, `public/assets/characters/tiles/${slug}.png`);
}
for (const slug of ['best-customers','loyal-buyers','new-buyers','at-risk-vips','growing-buyers','dormant-vips','light-repeaters']) {
  required.push(`public/assets/characters/portraits/${slug}.webp`, `public/assets/characters/portraits/${slug}.png`);
}

for (const file of required) await fs.access(path.join(root, file));

const html = await fs.readFile(path.join(root, 'public/index.html'), 'utf8');
const css = await fs.readFile(path.join(root, 'public/styles.css'), 'utf8');
const js = await fs.readFile(path.join(root, 'public/app.js'), 'utf8');
if (!html.includes('Segmentation made simple.') || !html.includes('Strategy made visible.')) throw new Error('Hero framing is missing.');
if (/site-header|site-nav|header-cta|menu-button/.test(html)) throw new Error('Template-style top navigation remains in the marketing site.');
if (!html.includes('customer-segment-studio.vercel.app')) throw new Error('Live product link is missing.');
if (/github\.com|GitHub|Inspect the source|Review the current source|View GitHub/i.test(html)) throw new Error('Developer/source links remain in the commercial site.');
if (/<iframe|<video|<canvas/i.test(html)) throw new Error('The marketing site must use product screenshots, not an embedded app/video/canvas.');
if (/PlanFox|Segment Command|placeholder|fictional account/i.test(html)) throw new Error('Retired or ungrounded prototype language remains in the site.');
if (!/customer ID/i.test(html) || !/purchase date/i.test(html) || !/transaction value/i.test(html)) throw new Error('Current import contract is not represented in customer-facing language.');
if (!html.includes('Best Customers') || !html.includes('Dormant VIPs') || !html.includes('Inactive Customers')) throw new Error('Current segment set is not represented.');
if (!html.includes('hero-character-cast') || !html.includes('group-character-grid')) throw new Error('Individual character enrichment is missing.');
if (!html.includes('See the field') || !html.includes('Understand the group') || !html.includes('Make the move')) throw new Error('Three-step product experience tabs are missing.');
if (!html.includes('<details class="method-details">')) throw new Error('Compact methodology disclosure is missing.');
if (css.length < 12000 || !css.includes('.hero-product') || !css.includes('.experience-showcase')) throw new Error('Stylesheet appears incomplete.');
if (!js.includes('experienceScreens') || !js.includes('data-lightbox')) throw new Error('Screenshot experience behavior is incomplete.');

for (const file of ['public/app.js', 'public/story-data.js', 'public/story-logic.js', 'server.mjs', 'build.mjs', 'scripts/check.mjs', 'scripts/doctor.mjs']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${file} failed syntax check:\n${result.stderr}`);
}

const forbidden = [/AIzaSy[A-Za-z0-9_-]{20,}/, /GEMINI_API_KEY\s*=\s*[^\s]+/];
for (const file of await walk(root, new Set(['.git', 'dist', 'node_modules']))) {
  if (/\.(png|webp|svg|zip)$/i.test(file)) continue;
  const text = await fs.readFile(file, 'utf8').catch(() => '');
  if (path.basename(file) === 'check.mjs') continue;
  for (const pattern of forbidden) if (pattern.test(text)) throw new Error(`Potential secret found in ${path.relative(root, file)}.`);
}

console.log(`Customer Segment Studio flagship checks passed: ${required.length} required files, source-mapped characters, finite reveal story, same-case product tabs, static review contact, no embedded app, no secrets.`);

async function walk(directory, skip) {
  const out = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, skip)); else out.push(full);
  }
  return out;
}

// Deployment guardrails: Vercel must serve the static dist output, not run server.mjs as a function.
const vercelConfig = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
if (vercelConfig.buildCommand !== 'npm run build') throw new Error('vercel.json must run npm run build');
if (vercelConfig.outputDirectory !== 'dist') throw new Error('vercel.json must publish dist');
const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.start) throw new Error('Do not define a production start script for this static Vercel site');
