import "server-only";
import { createHash } from "node:crypto";

// Mailchimp Marketing API. Only first name, last name and phone are ever sent,
// never anything about health. Errors are logged (without personal data) and
// never block the visitor.

type Contact = { email: string; firstName?: string; lastName?: string; phone?: string };

function config() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX || apiKey?.split("-")[1];
  if (!apiKey || !audienceId || !prefix) return null;
  // MAILCHIMP_API_BASE is for automated tests only.
  const base = process.env.MAILCHIMP_API_BASE || `https://${prefix}.api.mailchimp.com/3.0`;
  return {
    memberUrl: (email: string) =>
      `${base}/lists/${audienceId}/members/${createHash("md5").update(email.toLowerCase()).digest("hex")}`,
    headers: {
      Authorization: `Basic ${Buffer.from(`avidaluna:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  };
}

export const mailchimpEnabled = () => config() !== null;

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Mailchimp ${init.method} ${res.status}`);
  return res;
}

/**
 * Adds or updates a contact who explicitly opted in, then applies tags.
 * Contacts who did not opt in are not sent to Mailchimp at all (see copy deck: decisions).
 */
export async function subscribeWithTags(contact: Contact, tags: string[]): Promise<boolean> {
  const cfg = config();
  if (!cfg) {
    console.warn("[mailchimp] not configured; skipped");
    return false;
  }
  try {
    const mergeFields: Record<string, string> = {};
    if (contact.firstName) mergeFields.FNAME = contact.firstName;
    if (contact.lastName) mergeFields.LNAME = contact.lastName;
    if (contact.phone) mergeFields.PHONE = contact.phone;
    await call(cfg.memberUrl(contact.email), {
      method: "PUT",
      headers: cfg.headers,
      body: JSON.stringify({
        email_address: contact.email,
        status_if_new: "subscribed",
        status: "subscribed",
        merge_fields: mergeFields,
      }),
    });
    await call(`${cfg.memberUrl(contact.email)}/tags`, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify({ tags: tags.map((name) => ({ name, status: "active" })) }),
    });
    return true;
  } catch (error) {
    console.error("[mailchimp] subscribe failed:", (error as Error).message);
    return false;
  }
}

/** Tags an existing subscriber (e.g. `addon-purchased`). Never creates a new contact. */
export async function tagIfSubscribed(email: string, tag: string): Promise<void> {
  const cfg = config();
  if (!cfg) return;
  try {
    const res = await fetch(cfg.memberUrl(email), { headers: cfg.headers, cache: "no-store" });
    if (!res.ok) return;
    const member = (await res.json()) as { status?: string };
    if (member.status !== "subscribed") return;
    await call(`${cfg.memberUrl(email)}/tags`, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify({ tags: [{ name: tag, status: "active" }] }),
    });
  } catch (error) {
    console.error("[mailchimp] tag failed:", (error as Error).message);
  }
}
