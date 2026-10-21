import "server-only";
import { NOTIFY_EMAIL } from "./constants";

// Sends form notifications to Shary through Resend's free tier.
// Until a domain is verified in Resend, the sender must be onboarding@resend.dev and
// Resend only delivers to the email that owns the Resend account, so create the
// Resend account with NOTIFY_EMAIL (see CHECKLIST.md).

export const notifyEnabled = () => Boolean(process.env.RESEND_API_KEY);

export async function sendNotification({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  // RESEND_API_BASE is for automated tests only.
  const base = process.env.RESEND_API_BASE || "https://api.resend.com";
  try {
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Avida Luna Website <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return true;
  } catch (error) {
    console.error("[notify] send failed:", (error as Error).message);
    return false;
  }
}
