# Structure review before implementation

## Website source

Repository: `SY227/customer-segment-studio-flagship-site-v2`, main, read September 4, 2026.
Reported GitHub root tree reference: `0eb1ddc02264f694776e18f488a68adb2269600b`.
Package at the reviewed baseline: 0.3.7.

The connected GitHub tool was used to inspect current repository metadata and its complete recursive tree. The attached v0.3.7 package was used for local programmatic access after comparing it to the current remote source. `package-lock.json` was restored from the remote file. All current top-level file blob hashes and the following complete child-tree hashes matched:

| Subtree | Git tree SHA |
| --- | --- |
| public | 36882f48d6be96e1a18bab783542df8d05dfa57f |
| dist | 36882f48d6be96e1a18bab783542df8d05dfa57f |
| docs | f0ebddb9cb387dbc453b7b870cb6f41365183e17 |
| scripts | 70b520d08c79e1bec6b381454ce3d8e036aa1d66 |
| tests | f92c1c0eb8faf2708be85f6d6c398c29914be3c6 |

## Existing architecture reviewed

- `public/index.html`: hero, original posed character cast, real product screenshot; proof strip; one three-tab product section; two business-value columns; four-step explanation with nine-group tiles; methodology disclosure; final CTA; image dialog.
- `public/styles.css`: warm editorial shell; serif headline; gradient accents; dark product section; responsive breakpoints; character framing; reduced-motion rule.
- `public/app.js`: screenshot tab configuration; image/lightbox updates; scroll reveal. No RFM, upload, customer data store or API.
- `public/assets/characters/portraits`: seven transparent character images, PNG/WebP pairs.
- `public/assets/characters/tiles`: nine posed character images, PNG/WebP pairs, including the enlarged Occasional Buyers.
- `public/assets/screens`: four original product screenshots from the supplied recording, PNG/WebP pairs.
- `build.mjs`: copies public to dist.
- `server.mjs`: local Node HTTP asset server; not a production function.
- `vercel.json`: explicit static dist build; no production server required.
- Existing tests, file checks, source-grounding, screenshot provenance, character mapping and licensing documents were read before editing.

## KayKit resource repository

Repository: `SY227/kaykit-complete-v6-1-assets`.
Top-level tree reference: `971a9d77147bac0b0a41ce514a328d1d20e92213`.

The repository's root catalog includes Adventurers, Block Bits, Board Game Bits, Character Animations, City Builder, Dungeon, Fantasy Weapons, Forest Nature, Furniture, Halloween, Holiday, Medieval Hexagon, Mystery Monthly Series 4/5/6, Platformer, Prototype, RPG Tools, Resource, Restaurant, Skeletons and Space Base packs.

Adventurers 2.0 separates `Animations`, `Assets`, `Characters`, `SOURCE`, `Samples`, and `Textures`. Its models and textures are not interchangeable with the already approved marketing renders. `.gitattributes` routes FBX, GLB, Blender, OBJ, BIN, images and audio through Git LFS; a tiny Git pointer is not a usable asset download.

The root License.txt declares CC0 and permits commercial projects. The existing Adventurers attribution/license is preserved in this package. This review covers the catalog, relevant Adventurers structure, storage convention and licensing; it is not a claim to have downloaded or individually inspected every model in every pack.

## Resource decision

No additional KayKit pack is needed for this website pass. Reusing the corrected 2D renders avoids reintroducing T-poses, character-scale problems, heavy 3D loading, and a separate art direction. `BASELINE_ASSET_HASHES.json` and the automated preservation test enforce that decision.

## New separation of responsibilities

- `story-data.js`: editable, source-mapped marketing identities, campaign copy and contact address.
- `story-logic.js`: small pure helpers for phase timing, campaign allowlisting and email drafting.
- `app.js`: presentation interactions only; no product analytics engine.
- New screenshot crops: same source frame, no retyped numbers or fabricated output.

## Remote state

The GitHub API reported the V2 repository as **public** at the time of this read (`private: false`). This differs from the earlier private-repository intent. No remote permissions, branches, files, or deployments were changed by this deliverable. Verify and repair visibility before publishing any private material.
