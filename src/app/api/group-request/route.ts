import { fail, ok, readJson } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import { subscribeWithTags } from "@/lib/mailchimp";
import { notifyEnabled, sendNotification } from "@/lib/notify";
import { isRateLimited, looksLikeSpam } from "@/lib/spam";
import { fieldErrors, groupRequestSchema } from "@/lib/validation";

export async function POST(req: Request) {
  if (isRateLimited(req, "group-request")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = groupRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  if (looksLikeSpam(d)) return ok();
  if (!notifyEnabled()) {
    return fail(503, `Our form isn't connected yet. Please email ${CONTACT_EMAIL} instead.`);
  }

  const sent = await sendNotification({
    subject: `Group event request: ${d.eventType}, ${d.eventDate}`,
    replyTo: d.email,
    text: [
      `New group event request from the website.`,
      ``,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "(not given)"}`,
      `Event date: ${d.eventDate}`,
      `City: ${d.city}`,
      `Group size: ${d.groupSize}`,
      `Event type: ${d.eventType}`,
      `Joined email list: ${d.optIn ? "yes" : "no"}`,
      ``,
      `Note:`,
      d.note || "(none)",
    ].join("\n"),
  });
  if (!sent) return fail(502, `Sorry, that didn't send. Please email ${CONTACT_EMAIL} instead.`);

  if (d.optIn) {
    const [firstName, ...rest] = d.name.split(" ");
    await subscribeWithTags({ email: d.email, firstName, lastName: rest.join(" "), phone: d.phone }, ["group-request"]);
  }
  return ok();
}
