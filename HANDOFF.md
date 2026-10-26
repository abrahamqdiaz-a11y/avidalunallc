# Avida Luna Wellness website: handoff

## What this is
The website for **Avida Luna LLC, doing business as Avida Luna Wellness** (avidaluna.com). It covers the brand, a plain overview of services, wellness add-ons, group events, education, the booking-intake step and add-on checkout.

**Medical booking, screening and payment happen on Hydreight**, not on this site. The site never asks for or stores health information.

| Part | Tool |
|---|---|
| Website | Next.js 16 (App Router, TypeScript) + Tailwind 4, hosted on Netlify |
| Content Shary edits | Sanity Studio at `avidaluna.sanity.studio` (code in `/studio`) |
| Add-on payments | Stripe Checkout (hosted page), behind `src/lib/payments` so another processor can replace it |
| Email list | Mailchimp (opted-in contacts only) |
| Form notifications | Resend (contact and group-event forms → Shary's inbox) |
| Booking follow-up | Resend scheduled email, 60 min after /book step 1; cancelled by the Stripe webhook or "Pay at my visit" (`src/lib/followup.ts`) |
| IV booking | Hydreight: https://booking.hydreight.com/widget-business/an92x |

## Accounts and owners

Every account must end up owned by Shary, with Abe as a collaborator until handoff is complete. Free plans only. Plan allowances change often: the numbers below were checked in October 2026 from third-party summaries (the official pages couldn't be loaded from the build environment), so **confirm them on each official page**.

| Service | Used for | Owner | Admin | Plan | Free allowances (verify) |
|---|---|---|---|---|---|
| GitHub | Code | Shary (transfer from `abrahamqdiaz-a11y`) | Abe | Free | Unlimited private repos. https://github.com/pricing |
| Netlify | Hosting, previews | Shary | Abe | Free | ~300 credits/month; a production deploy ≈ 15 credits, bandwidth ≈ 20 credits/GB; sites pause when credits run out. https://www.netlify.com/pricing/ |
| Sanity | Content editor | Shary | Abe | Free | ~1M CDN API requests/month, ~250k uncached API requests/month, 10k documents, 2 datasets, Studio hosting included; hard caps. https://www.sanity.io/pricing |
| Stripe | Add-on payments | Shary | Abe (test keys during build) | Standard (no monthly fee; per-transaction fees) | https://stripe.com/pricing |
| Mailchimp | Email list | Shary | Abe | Free | Reportedly 250 contacts, 500 sends/month, **no automations** (2026). https://mailchimp.com/pricing/marketing/ |
| Resend | Form notifications | Shary (sign up with YourRNShary@gmail.com) | Abe | Free | 3,000 emails/month, 100/day, 1 domain. https://resend.com/pricing |
| Domain registrar | avidaluna.com | Shary | | n/a | Transfer away from Squarespace |
| Hydreight | Medical booking | Shary | | Her existing account | n/a |

## How deploys work
- Every push to a branch with an open pull request builds a **deploy preview** on Netlify (uses credits).
- Merging to `main` builds **production**. Nothing goes live without a merge, and merges need Abe's approval.
- Build settings: `netlify.toml` (Node 24, `npm run build`, the official Next.js runtime).
- Environment variable changes need one redeploy (Netlify → Deploys → Trigger deploy).

## How content updates go live (no rebuild)
1. Shary publishes in Sanity.
2. Sanity's webhook calls `POST /api/revalidate` (signed with `SANITY_REVALIDATE_SECRET`).
3. The site refreshes only that content type's cache tag (`revalidateTag`). The next visitor sees the change, usually within a minute.
4. As a backstop, every page refreshes at most hourly, which is also how past events drop off.

Public pages read from Sanity's CDN (cheap on the free allowance). The only uncached read is in checkout, so prices are always live.

If Sanity isn't configured, the site renders from `/content/fallback.ts`, so builds never break.

## Payments: how the price stays honest
- The browser sends only `[{ id, quantity }]` to `/api/checkout`, never a price.
- The server reads those add-ons live from Sanity, rejects hidden or unknown items, caps quantity at 10, and builds Stripe line items from the server-side prices.
- The webhook `/api/stripe/webhook` verifies Stripe's signature and logs only the session ID, items and amount.
- To switch processors (e.g. Square): implement `AddOnPaymentProvider` in `src/lib/payments/`, and change one line in `src/lib/payments/index.ts`.

## Rotating keys
| Key | Where to rotate | Then |
|---|---|---|
| `SANITY_API_READ_TOKEN` | sanity.io/manage → API → Tokens (create new, delete old) | Update in Netlify, redeploy |
| `SANITY_REVALIDATE_SECRET` | Make a new random string | Update both the Sanity webhook and Netlify, redeploy |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Roll key | Update in Netlify, redeploy |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → endpoint → Roll secret | Update in Netlify, redeploy |
| `MAILCHIMP_API_KEY` | Mailchimp → Profile → Extras → API keys | Update in Netlify, redeploy, delete the old key |
| `RESEND_API_KEY` | Resend → API Keys | Update in Netlify, redeploy, revoke the old key |
| `HYDREIGHT_HOOK_SECRET` | Make a new random string | Update in Netlify and in the (future) Make.com scenario |

Generate a random secret: `openssl rand -hex 32`. Secrets live only in Netlify env vars, never in the repo.

## Future: Hydreight booking automation (stub only)
`POST /api/hooks/hydreight-booking` exists, requires header `x-hook-secret: $HYDREIGHT_HOOK_SECRET`, and returns `501 Not Implemented`.

Intended design (not in scope now): a Make.com scenario reads Hydreight's booking-confirmation email and posts

```json
{ "email": "client@example.com", "firstName": "Ana", "appointmentDate": "2026-11-20" }
```

The route would tag the Mailchimp contact `booked`, which triggers the add-on offer email. No health data is ever sent. First check that Hydreight's booking email includes the client's email.

## Code map
| Path | What |
|---|---|
| `src/app/` | Pages and API routes |
| `src/components/` | Header, footer, cards, forms, add-on picker |
| `src/lib/content.ts` | All content reads (Sanity with fallback) |
| `src/lib/constants.ts` | `CONTACT_EMAIL`, `HYDREIGHT_BOOKING_URL`, phone, legal name |
| `src/lib/validation.ts` | Form schemas (no health fields) |
| `src/lib/payments/` | Payment interface + Stripe |
| `content/fallback.ts` | Fallback content = the approved copy |
| `studio/` | Sanity Studio (schemas, desk menu, compliance warnings, seed) |
| `tests/` | Playwright tests + a local mock of Stripe, Mailchimp and Resend |
| `scripts/` | QR codes, seed builder, screenshots |

## Running checks
```bash
npm run typecheck && npm run lint && npm run build
PW_CHROMIUM_PATH=<path to chromium, optional> npm run test:e2e   # builds with mock keys; no real accounts needed
```
The tests cover booking (including Mailchimp failing), checkout price integrity, cancel/restore, redirects (301), banned health words on every page, a health-field audit of every form, axe accessibility, and keyboard-only booking.

## What needs a developer
- Layout, design or new page types (e.g. town pages for the Local Growth Package).
- Adding or renaming old-URL redirects (`next.config.ts`).
- Changing processors, Mailchimp tags or form fields.
- Building the Hydreight automation.
- Upgrading dependencies (versions are pinned on purpose).

Shary can do everything else in Sanity: see `/docs/how-to-edit.md`.
