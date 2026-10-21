import { fail, ok, readJson } from "@/lib/api";
import { subscribeWithTags } from "@/lib/mailchimp";
import { isRateLimited, looksLikeSpam } from "@/lib/spam";
import { fieldErrors, intakeSchema } from "@/lib/validation";

// Booking intake: validate, spam check, then (only if they opted in) add to Mailchimp
// with the `booking-intake` tag. Mailchimp problems are logged and never block booking.
export async function POST(req: Request) {
  if (isRateLimited(req, "intake")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = intakeSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const data = parsed.data;
  if (looksLikeSpam(data)) return ok();

  if (data.optIn) {
    await subscribeWithTags(
      { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      ["booking-intake"],
    );
  }
  return ok();
}
