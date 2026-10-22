import { fail, ok, readJson } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { tagIfSubscribed } from "@/lib/mailchimp";
import { notifyEnabled, sendNotification } from "@/lib/notify";
import { CheckoutError, priceAddOns } from "@/lib/payments";
import { isRateLimited, looksLikeSpam } from "@/lib/spam";
import { atVisitSchema, fieldErrors } from "@/lib/validation";

// "Pay at my visit": tells Shary which add-ons to bring. Prices are looked up on the
// server; nothing is charged here. Only the name, email and add-ons are sent.
export async function POST(req: Request) {
  if (isRateLimited(req, "at-visit")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = atVisitSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  if (looksLikeSpam(d)) return ok();
  if (!notifyEnabled()) {
    return fail(503, `We couldn't save this right now. Just tell Shary at your visit, or email ${CONTACT_EMAIL}.`);
  }

  let lines;
  try {
    lines = await priceAddOns(d.items);
  } catch (error) {
    if (error instanceof CheckoutError) return fail(error.status, error.message);
    throw error;
  }
  const totalCents = lines.reduce((sum, l) => sum + l.unitAmountCents * l.quantity, 0);

  const sent = await sendNotification({
    subject: `Add-ons to bring: ${d.firstName}`,
    replyTo: d.email,
    text: [
      `${d.firstName} chose add-ons to pay for at their visit.`,
      ``,
      `Name: ${d.firstName}`,
      `Email: ${d.email}`,
      ``,
      ...lines.map((l) => `${l.name} × ${l.quantity}: ${formatPrice((l.unitAmountCents * l.quantity) / 100)}`),
      `Total to collect at the visit: ${formatPrice(totalCents / 100)}`,
    ].join("\n"),
  });
  if (!sent) return fail(502, `Sorry, that didn't send. Just tell Shary at your visit, or email ${CONTACT_EMAIL}.`);

  await tagIfSubscribed(d.email, "addon-at-visit");
  return ok();
}
