# Avida Luna Wellness website

Next.js (App Router) + Tailwind, content in Sanity (`/studio`), deployed on Netlify.

```bash
nvm use            # Node 24 LTS (22.12+ works)
npm install
cp .env.example .env.local   # optional: the site runs on fallback content without it
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e`.

See `CHECKLIST.md` (setup tasks) and `HANDOFF.md` (accounts and operations).
