import "server-only";
import { createHash } from "node:crypto";
import { BRAND_NAME, CONTACT_EMAIL, HYDREIGHT_BOOKING_URL, SITE_URL } from "./constants";

// The one follow-up email sent about an hour after someone gets their booking link.
// Resend holds it as a scheduled email. If they buy add-ons first, the Stripe webhook
// (or "pay at my visit") cancels it. No extra database: the Resend email id rides along
// in Stripe metadata, and the webhook also looks up any scheduled follow-up by address.
// Only the first name and email are used. Never anything medical.

export const FOLLOWUP_SUBJECT = "Your Avida Luna visit, plus a little extra";

/** Resend email ids are UUIDs. Anything else coming back from the browser is ignored. */
export const FOLLOWUP_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Off until a verified sender is set, so nothing goes out from an unverified domain. */
export const followUpEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.FOLLOWUP_FROM);

function delayMinutes(): number {
  const n = Number(process.env.FOLLOWUP_DELAY_MINUTES);
  return Number.isFinite(n) && n >= 1 && n <= 24 * 60 ? n : 60;
}

function resend(path: string, init: RequestInit & { idempotencyKey?: string } = {}) {
  const { idempotencyKey, ...rest } = init;
  // RESEND_API_BASE is for automated tests only.
  const base = process.env.RESEND_API_BASE || "https://api.resend.com";
  return fetch(`${base}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function followUpContent(firstName: string) {
  const addOnsUrl = `${SITE_URL}/add-ons`;
  const optOut = `One-time note because you asked for a booking link at avidaluna.com. Don't want emails from us? Reply "stop".`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `If you haven't picked your time yet, here's your booking link:`,
    HYDREIGHT_BOOKING_URL,
    ``,
    `Already booked? Make it a ritual. Add red light or aromatherapy to your visit:`,
    addOnsUrl,
    `Pay now or at your visit.`,
    ``,
    `See you soon,`,
    `Shary, ${BRAND_NAME}`,
    ``,
    `--`,
    optOut,
  ].join("\n");

  const name = escapeHtml(firstName);
  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${href}" style="display:inline-block;padding:14px 24px;border-radius:6px;font-weight:600;text-decoration:none;font-size:16px;${
      primary ? "background:#4b6246;color:#ffffff;" : "background:#ffffff;color:#29372d;border:1.5px solid #4b6246;"
    }">${label}</a>`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${FOLLOWUP_SUBJECT}</title></head>
<body style="margin:0;padding:0;background:#f6f3ec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ec;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:10px;border-top:3px solid #4b6246;">
<tr><td style="padding:28px 24px;font-family:Georgia,'Times New Roman',serif;color:#29372d;font-size:16px;line-height:1.6;">
<p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;color:#53604f;">AVIDA LUNA WELLNESS</p>
<p style="margin:0 0 16px;font-size:20px;">Hi ${name},</p>
<p style="margin:0 0 14px;">If you haven't picked your time yet, here's your booking link:</p>
<p style="margin:0 0 24px;">${button(HYDREIGHT_BOOKING_URL, "Book your IV", true)}</p>
<p style="margin:0 0 14px;">Already booked? Make it a ritual. Add red light or aromatherapy to your visit. Pay now or at your visit.</p>
<p style="margin:0 0 24px;">${button(addOnsUrl, "See add-ons", false)}</p>
<p style="margin:0;">See you soon,<br>Shary, ${BRAND_NAME}</p>
</td></tr>
</table>
<p style="max-width:520px;margin:16px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b7264;">${escapeHtml(optOut)}</p>
</td></tr>
</table>
</body>
</html>`;

  return { subject: FOLLOWUP_SUBJECT, text, html };
}

/**
 * Schedules the follow-up. Returns the Resend email id, or null when it wasn't scheduled.
 * The idempotency key makes Resend refuse a second follow-up to the same address
 * within 24 hours, across every server instance.
 */
export async function scheduleFollowUp(
  { email, firstName }: { email: string; firstName: string },
  minutes = delayMinutes(),
): Promise<string | null> {
  if (!followUpEnabled()) return null;
  const { subject, text, html } = followUpContent(firstName);
  const key = `followup/${createHash("sha256").update(email.toLowerCase()).digest("hex")}`;
  try {
    const res = await resend("/emails", {
      method: "POST",
      idempotencyKey: key,
      body: JSON.stringify({
        from: process.env.FOLLOWUP_FROM,
        to: [email],
        reply_to: CONTACT_EMAIL,
        subject,
        text,
        html,
        scheduled_at: new Date(Date.now() + minutes * 60_000).toISOString(),
        headers: { "List-Unsubscribe": `<mailto:${CONTACT_EMAIL}?subject=stop>` },
        tags: [{ name: "kind", value: "followup" }],
      }),
    });
    // 409: this address already has a follow-up from the last 24 hours. Nothing to do.
    if (res.status === 409) return null;
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return data?.id && FOLLOWUP_ID_PATTERN.test(data.id) ? data.id : null;
  } catch (error) {
    console.error("[followup] schedule failed:", (error as Error).message);
    return null;
  }
}

type ListedEmail = { id: string; to: string[]; subject: string; last_event: string; created_at: string };

/** Ids of follow-ups to this address that are still waiting to send. Checks recent emails only. */
async function findScheduled(email: string): Promise<string[]> {
  const res = await resend("/emails?limit=100");
  if (!res.ok) throw new Error(`Resend list ${res.status}`);
  const { data = [] } = ((await res.json()) ?? {}) as { data?: ListedEmail[] };
  const target = email.toLowerCase();
  return data
    .filter(
      (e) =>
        e.last_event === "scheduled" &&
        e.subject === FOLLOWUP_SUBJECT &&
        e.to?.some((t) => t.toLowerCase() === target),
    )
    .map((e) => e.id);
}

/**
 * Cancels any follow-up still waiting for this person. Best effort: an email that has
 * already gone out can't be cancelled, and that's fine.
 */
export async function cancelFollowUps({ id, email }: { id?: string | null; email?: string | null }) {
  if (!process.env.RESEND_API_KEY) return;
  const ids = new Set<string>();
  if (id && FOLLOWUP_ID_PATTERN.test(id)) ids.add(id);
  if (email) {
    try {
      for (const found of await findScheduled(email)) ids.add(found);
    } catch (error) {
      console.error("[followup] lookup failed:", (error as Error).message);
    }
  }
  for (const emailId of ids) {
    try {
      const res = await resend(`/emails/${emailId}/cancel`, { method: "POST" });
      console.info("[followup] cancel", { id: emailId, status: res.status });
    } catch (error) {
      console.error("[followup] cancel failed:", (error as Error).message);
    }
  }
}
