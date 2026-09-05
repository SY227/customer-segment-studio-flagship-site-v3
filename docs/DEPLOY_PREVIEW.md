# Safe handoff: preview only, original production untouched

The package is a local artifact, not an already-pushed commit or deployment. It contains no .git or .vercel metadata. Do not reuse the original website project.

## Check the private-repository requirement

The connected API reported the V2 repository as PUBLIC during this task. Verify:

```bash
gh repo view SY227/customer-segment-studio-flagship-site-v2 --json nameWithOwner,visibility
```

To restore the previously requested private setting (a deliberate remote visibility change):

```bash
gh repo edit SY227/customer-segment-studio-flagship-site-v2 --visibility private --accept-visibility-change-consequences
gh repo view SY227/customer-segment-studio-flagship-site-v2 --json visibility --jq '.visibility'
```

These commands concern V2 only. They do not alter the original repository or deploy a website.

## Recommended deployment sequence after local approval

1. In your existing V2 working copy, confirm `git remote -v` points to `SY227/customer-segment-studio-flagship-site-v2`, never the original repository.
2. Ensure the worktree is clean, then create a new branch, e.g. `website/nine-stories-v2-1`.
3. Copy this package's application files into that V2 branch, preserving `.git` and `.vercel`. Do not copy local environment files or another project's metadata.
4. Run `npm run qa` and review the diff. The 41 baseline assets must remain unchanged.
5. Push the preview branch only. If the existing V2 Vercel Git integration is connected, inspect its preview deployment. Do not deploy with `--prod` until approved.
6. Check `.vercel/project.json` or the Vercel dashboard to confirm the linked project is the V2 project. Preserve the existing `vercel.json` static settings.

A private GitHub repository and a publicly accessible commercial website are separate settings. Also review Vercel preview deployment protection before sending a preview to testers.
