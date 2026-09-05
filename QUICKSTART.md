# Local preview — V2.1.2

1. Extract the ZIP into a NEW folder. Do not copy over an existing production working directory.
2. Open Terminal in that new folder.
3. Run:

```bash
npm run qa
PORT=3011 npm run dev
```

Open `http://localhost:3011/`.
Campaign opening: `http://localhost:3011/?story=reveal`.
Direct opening: `http://localhost:3011/?story=direct`.

No API key or npm install is needed. Node.js 20+ is required.
If port 3011 is in use, choose another free port with `PORT=3012 npm run dev`.
Press Control+C to stop this preview; do not terminate unrelated processes.

This command does NOT push, link a Vercel project, or alter either existing production site.
