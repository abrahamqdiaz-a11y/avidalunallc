# Launch checklist (Abe)

Things the code can't do for us. Tick them off as you go. Items marked *(Step N)* get more detail when that step is built.

## 0. Repo and content
- [ ] Commit the source files to `main`: `/docs/source-content.md`, `/docs/brand/logo.png`, `/docs/brand/current-site-header.png`, `/docs/mockups/*.png`.
- [ ] Confirm which GitHub account owns this repo. It is currently `abrahamqdiaz-a11y/avidalunallc`; the plan is for Shary to own it, with Abe as a collaborator. Transfer it before handoff.

## 1. Sanity
- [ ] Create the Sanity project "Avida Luna" (dataset `production`) in **Shary's** Sanity account, free plan. Invite Abe.
- [ ] Deploy the Studio (hosting choice decided at Checkpoint 1).
- [ ] Add CORS origins: the Netlify preview URL, `https://www.avidaluna.com`, `http://localhost:3000`.
- [ ] Create a read token (Viewer) for `SANITY_API_READ_TOKEN`.
- [ ] Create the webhook to `https://www.avidaluna.com/api/revalidate` with `SANITY_REVALIDATE_SECRET`. *(Step 3)*
- [ ] Import the seed content: `cd studio && npm run seed`. *(Step 3)*

## 2. Netlify
- [ ] Create the Netlify site in **Shary's** account, connected to her GitHub repo. Free plan.
- [ ] Add every environment variable listed below.
- [ ] Check the free plan's current credit allowance (deploys, bandwidth, function calls, form submissions).

## 3. Stripe
- [ ] Shary creates her own Stripe account. Abe adds the **test** keys to Netlify.
- [ ] Create the webhook endpoint `/api/stripe/webhook` for `checkout.session.completed`. *(Step 5)*
- [ ] Turn on Stripe payment email notifications for Shary.
- [ ] After approval, swap in the live keys and the live webhook secret.
- [ ] **If Stripe doesn't approve her account, we switch to another processor (for example Square), whose fees may differ.**
- [ ] Help her set up in-person card payments (in our agreement).

## 4. Mailchimp
- [ ] API key, server prefix, audience ID into Netlify.
- [ ] Tags: `booking-intake`, `event-signup`, `contact-form`, `group-request`, `addon-purchased`.
- [ ] Welcome-email automation on the `booking-intake` tag, with the Hydreight link and the `/add-ons` link. *(Step 4)*

## 5. Form email and contact address
- [ ] Set up the form email service (decided at Checkpoint 1) and `NOTIFY_EMAIL`.
- [ ] Optional later: swap `CONTACT_EMAIL` for a business address (one env var plus Sanity Contact info).

## 6. Hydreight
- [ ] Check that the booking link works: https://booking.hydreight.com/widget-business/an92x
- [ ] Ask Hydreight whether their booking email includes the client's email (needed for the future automation).

## 7. QR codes and short link
- [ ] Her printed QR codes and `bit.ly/Avida-Luna` skip the intake form. Decide: repoint them, or reprint QR codes for `/book` and `/join` (`npm run qr`).

## 8. Domain and launch
- [ ] Transfer the domain from Squarespace to a registrar in Shary's name.
- [ ] Point DNS to Netlify.
- [ ] After launch, check every redirect.

## 9. Handoff (in our agreement)
- [ ] Confirm Shary is owner and admin on every account.
- [ ] Send `HANDOFF.md` and `/docs/how-to-edit.md`.
- [ ] Hold the walkthrough call.
- [ ] Final payment is due after she approves the site and receives the handoff.

## 10. Collect from Shary
- [ ] Photos (starting with `SharyPic.jpg`)
- [ ] Higher-res or vector logo (SVG)
- [ ] Confirmed drip names and prices (do they match Hydreight?)
- [ ] Recovery Ritual contents and duration
- [ ] Service area and travel fee
- [ ] Cancellation and refund policy
- [ ] Visit length
- [ ] The PubMed link for her article
- [ ] Her written approval of `/docs/copy-deck.md`

## Environment variables (Netlify)

| Key | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.avidaluna.com` (preview: the Netlify URL) |
| `HYDREIGHT_BOOKING_URL` | `https://booking.hydreight.com/widget-business/an92x` |
| `CONTACT_EMAIL` | `YourRNShary@gmail.com` |
| `NOTIFY_EMAIL` | Same as `CONTACT_EMAIL` unless changed |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Viewer token |
| `SANITY_REVALIDATE_SECRET` | Long random string, same value in the Sanity webhook |
| `STRIPE_SECRET_KEY` | Test key first |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Only if needed |
| `STRIPE_WEBHOOK_SECRET` | From the Stripe webhook endpoint |
| `MAILCHIMP_API_KEY` | |
| `MAILCHIMP_SERVER_PREFIX` | e.g. `us21` (end of the API key) |
| `MAILCHIMP_AUDIENCE_ID` | |
| `RESEND_API_KEY` | Only if Resend is chosen |
| `HYDREIGHT_HOOK_SECRET` | For the future automation stub |
