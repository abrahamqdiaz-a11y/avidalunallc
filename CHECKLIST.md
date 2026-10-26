# Launch checklist (Abe)

Things the code can't do for us, in roughly the order to do them. Every service stays on its **free plan**: no paid upgrades or add-ons.

## 0. Repo and content
- [ ] Commit her source files to `main`: `/docs/source-content.md`, `/docs/brand/logo.png`, `/docs/brand/current-site-header.png`, `/docs/mockups/*.png`. Then update the copy deck and fallback content from them.
- [ ] Set `main` as the default branch on GitHub (Settings → General → Default branch).
- [ ] The repo is under `abrahamqdiaz-a11y`. If Shary is meant to own it, transfer it to her GitHub account before handoff and keep Abe as a collaborator.
- [ ] Shary approves `/docs/copy-deck.md` in writing (all medical wording is her responsibility under our agreement), and the "Needs review" list goes to a qualified professional.

## 1. Sanity (her account, free plan)
- [ ] Create the project "Avida Luna", dataset `production`, in **Shary's** Sanity account. Invite Abe as Administrator.
- [ ] Create an API token (Viewer) → `SANITY_API_READ_TOKEN`.
- [ ] Deploy the Studio to `avidaluna.sanity.studio`:
      `cd studio && npm install && SANITY_STUDIO_PROJECT_ID=<id> npx sanity deploy`
- [ ] Import the starting content: `npm run seed:build` (from the repo root), then
      `cd studio && SANITY_STUDIO_PROJECT_ID=<id> npm run seed` (`--replace` overwrites seeded documents with the same IDs).
- [ ] CORS origins (sanity.io/manage → API → CORS): `http://localhost:3000`, the Netlify preview URL, `https://www.avidaluna.com`. No credentials needed for the site; the Studio host is added automatically.
- [ ] Webhook (sanity.io/manage → API → Webhooks):
  - URL `https://www.avidaluna.com/api/revalidate` (add a second one for the preview URL while testing)
  - Dataset `production`, trigger on create, update, delete
  - Filter: `_type in ["service","addon","event","article","faq","pageText","siteSettings","testimonial"]`
  - Projection: `{_type}`
  - Secret: the same long random string as `SANITY_REVALIDATE_SECRET`
  - HTTP method POST, API version `v2025-02-19` or newer
- [ ] Check edits appear on the site in about a minute without a deploy.

## 2. Netlify (her account, free plan)
- [ ] Create the site in **Shary's** Netlify account from her GitHub repo. Build settings come from `netlify.toml`.
- [ ] Add every environment variable from the table below.
- [ ] Free plan: reportedly **300 credits/month; each production deploy costs about 15 credits, bandwidth about 20 credits/GB**, and sites pause if credits run out. Check the current numbers at netlify.com/pricing. Keep deploys rare: content changes go through Sanity, not deploys.
- [ ] Consider turning off automatic deploy previews for every push once review is done (Site configuration → Build & deploy), to save credits.

## 3. Stripe (her account)
- [ ] Shary creates her own Stripe account. Abe adds the **test** keys (`STRIPE_SECRET_KEY`).
- [ ] Webhook endpoint: `https://www.avidaluna.com/api/stripe/webhook`, event `checkout.session.completed` → `STRIPE_WEBHOOK_SECRET`.
- [ ] Test with card `4242 4242 4242 4242` and the Stripe CLI:
      `stripe listen --forward-to localhost:3000/api/stripe/webhook` then `stripe trigger checkout.session.completed`.
- [ ] Turn on Stripe payment email notifications for Shary (Settings → Notifications).
- [ ] After approval, swap in the live keys and the live webhook secret, then redeploy once.
- [ ] **If Stripe doesn't approve her account, we switch to another processor (for example Square), whose fees may differ.** The code is ready for that: implement `AddOnPaymentProvider` in `src/lib/payments/`.
- [ ] Help her set up in-person card payments (in our agreement).

## 4. Mailchimp (her account, free plan)
- [ ] API key → `MAILCHIMP_API_KEY`; server prefix (the part after the dash, e.g. `us21`) → `MAILCHIMP_SERVER_PREFIX`; Audience ID → `MAILCHIMP_AUDIENCE_ID`.
- [ ] Confirm the audience has the default `FNAME`, `LNAME` and `PHONE` merge fields. No others are used.
- [ ] Tags the site applies: `booking-intake`, `event-signup`, `event-<slug>`, `contact-form`, `group-request`, `addon-purchased`.
- [ ] Welcome email on the `booking-intake` tag: **no longer needed.** The site now sends that email itself through Resend (see section 5b). Don't set up both, or opted-in people get two.
  - ⚠️ Mailchimp's free plan reportedly **no longer includes automations** (2026) and is capped at **250 contacts / 500 sends a month**. Check her plan first. If automations aren't available, the alternative is sending that email from the site through Resend (not built yet; ask the developer).
- [ ] Only people who tick the opt-in box are added to Mailchimp.

## 5. Form email (Resend, free plan) and contact address
- [ ] Create the Resend account **with `YourRNShary@gmail.com`** (until a domain is verified, Resend only delivers to the account owner's address). API key → `RESEND_API_KEY`.
- [ ] `NOTIFY_EMAIL` = `YourRNShary@gmail.com` (or leave unset; it defaults to `CONTACT_EMAIL`).
- [ ] Later (optional): verify `avidaluna.com` in Resend after the domain moves, set `RESEND_FROM`, and swap `CONTACT_EMAIL` for a business address (env var + Sanity Contact info).
- [ ] Until `RESEND_API_KEY` is set, the contact and group forms show "Please email … instead."

## 5b. Booking follow-up email (Resend, from avidaluna.com)
About 60 minutes after someone submits step 1 on /book, Resend sends them one email with the Hydreight link and the add-ons link (first name and email only). It's cancelled automatically if they pay for add-ons first (Stripe webhook) or choose "Pay at my visit".
- [ ] Resend → Domains → Add `avidaluna.com`. Add the DNS records Resend shows at the domain's DNS host, exactly as given: an **MX** record and an **SPF TXT** record on the `send` subdomain, and a **DKIM TXT** record (`resend._domainkey`). Wait for "Verified".
- [ ] Recommended: add a **DMARC TXT** record on `_dmarc` if there isn't one yet, e.g. `v=DMARC1; p=none;`.
- [ ] Netlify env: `FOLLOWUP_FROM` = `Shary at Avida Luna <hello@avidaluna.com>` (any address on the verified domain). **Nothing is sent until this is set**, so set it only after the domain is verified.
- [ ] Replies go to `CONTACT_EMAIL`. People opt out by replying "stop": check that inbox.
- [ ] The Stripe webhook (section 3) must be live with `checkout.session.completed`; that's what cancels the email after an add-on purchase.
- [ ] Free plan: 3,000 emails/month, 100/day. One follow-up per booking-link request (at most one per address per 24 hours).
- [ ] Test: set `FOLLOWUP_DELAY_MINUTES=2` on a deploy preview, submit step 1 with your own email, wait. Remove it (default 60) for production.

## 6. Hydreight
- [ ] Check that the booking link works: https://booking.hydreight.com/widget-business/an92x
- [ ] Ask Hydreight whether their booking email includes the client's email (needed for the future automation in `HANDOFF.md`).
- [ ] Ask how group-event guests each book and get screened.

## 7. QR codes and short link
- [ ] Her printed QR codes and `bit.ly/Avida-Luna` skip the intake form. Decide: repoint the bit.ly link to `/book`, and/or reprint QR codes. Files: `public/qr/join.png|svg` and `public/qr/book.png|svg` (regenerate with `npm run qr`).

## 8. Domain and launch
- [ ] Transfer the domain from Squarespace to a registrar in **Shary's** name.
- [ ] Point DNS to Netlify; set `www.avidaluna.com` as the primary domain.
- [ ] Set `NEXT_PUBLIC_HIDE_TODOS=1` only after every TODO is resolved.
- [ ] After launch, check every redirect (`/about-me`, `/cart`, `/wellnesseducation`, `/faq-1`) returns 301, and add any other old URLs (blog posts) to `next.config.ts`.
- [ ] Submit `https://www.avidaluna.com/sitemap.xml` in Google Search Console (her Google account).

## 9. Handoff (in our agreement)
- [ ] Confirm Shary is owner and admin on every account (GitHub, Netlify, Sanity, Stripe, Mailchimp, Resend, domain).
- [ ] Send `HANDOFF.md` and `/docs/how-to-edit.md`.
- [ ] Hold the walkthrough call.
- [ ] Final payment is due after she approves the site and receives the handoff.

## 10. Collect from Shary
- [ ] Her current site text (`source-content.md`), including her About story and mission quote, word for word
- [ ] Photos (starting with `SharyPic.jpg`), and photos for each add-on
- [ ] Higher-res or vector logo (SVG)
- [ ] Instagram and Facebook links
- [ ] Confirmed drip names and prices (do they match Hydreight?), and whether glutathione / B-complex stay listed
- [ ] Recovery Ritual contents and duration
- [ ] Service area and travel fee
- [ ] Cancellation and refund policy
- [ ] Visit length
- [ ] The PubMed link for her article
- [ ] Whether anyone else attends appointments ("our caring team" on the current site)
- [ ] Her written approval of `/docs/copy-deck.md`

## Environment variables (Netlify → Site configuration → Environment variables)

| Key | Value / notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.avidaluna.com` |
| `HYDREIGHT_BOOKING_URL` | `https://booking.hydreight.com/widget-business/an92x` (also the code default) |
| `CONTACT_EMAIL` | `YourRNShary@gmail.com` (also the code default) |
| `NOTIFY_EMAIL` | Same as `CONTACT_EMAIL` unless changed |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Viewer token (used only by checkout for live prices) |
| `SANITY_REVALIDATE_SECRET` | Long random string; same value in the Sanity webhook |
| `STRIPE_SECRET_KEY` | Test key first, live after approval |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Not needed (hosted Checkout). Leave empty. |
| `STRIPE_WEBHOOK_SECRET` | From the Stripe webhook endpoint |
| `MAILCHIMP_API_KEY` | |
| `MAILCHIMP_SERVER_PREFIX` | e.g. `us21` |
| `MAILCHIMP_AUDIENCE_ID` | |
| `RESEND_API_KEY` | Resend is the chosen form email service |
| `FOLLOWUP_FROM` | Sender for the booking follow-up, e.g. `Shary at Avida Luna <hello@avidaluna.com>`. Domain must be verified in Resend. Leave unset to turn the follow-up off. |
| `FOLLOWUP_DELAY_MINUTES` | Optional. Default `60`. Use a small number only for testing. |
| `HYDREIGHT_HOOK_SECRET` | Long random string, for the future automation stub |
| `NEXT_PUBLIC_HIDE_TODOS` | Optional. `1` hides TODO boxes (launch only) |

Env var changes need one redeploy to take effect (Deploys → Trigger deploy).
