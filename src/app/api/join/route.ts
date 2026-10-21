import { fail, ok, readJson } from "@/lib/api";
import { subscribeWithTags } from "@/lib/mailchimp";
import { isRateLimited, looksLikeSpam } from "@/lib/spam";
import { fieldErrors, joinSchema } from "@/lib/validation";

// Event QR sign-up. Opt-in is required here (it's a newsletter and event list).
export async function POST(req: Request) {
  if (isRateLimited(req, "join")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = joinSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const data = parsed.data;
  if (looksLikeSpam(data)) return ok();

  const tags = ["event-signup", ...(data.eventSlug ? [`event-${data.eventSlug}`] : [])];
  const saved = await subscribeWithTags(
    { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone },
    tags,
  );
  // Joining the list is the whole point of this form, so tell them if it didn't work.
  if (!saved) return fail(503, "We couldn't add you right now. Please try again in a moment.");
  return ok();
}
