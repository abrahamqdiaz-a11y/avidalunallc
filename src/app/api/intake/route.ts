import { fail, ok, readJson } from "@/lib/api";
import { scheduleFollowUp } from "@/lib/followup";
import { subscribeWithTags } from "@/lib/mailchimp";
import { isKeyRateLimited, isRateLimited, looksLikeSpam } from "@/lib/spam";
import { fieldErrors, intakeSchema } from "@/lib/validation";

// Booking intake: validate, spam check, then (only if they opted in) add to Mailchimp
// with the `booking-intake` tag, and schedule the one follow-up email (first name and
// email only). Mailchimp or Resend problems are logged and never block booking.
export async function POST(req: Request) {
  if (isRateLimited(req, "intake")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = intakeSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const data = parsed.data;
  if (looksLikeSpam(data)) return ok();
  // One address can't be used to send a pile of emails, whatever IP it comes from.
  // (Resend's idempotency key also allows only one follow-up per address per 24 hours.)
  const emailLimited = isKeyRateLimited(`followup:${data.email}`, 3);

  const [followUpId] = await Promise.all([
    emailLimited ? null : scheduleFollowUp({ email: data.email, firstName: data.firstName }),
    data.optIn
      ? subscribeWithTags(
          { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
          ["booking-intake"],
        )
      : null,
  ]);
  return ok(followUpId ? { followUpId } : {});
}
