import { fail, ok, readJson } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/constants";
import { subscribeWithTags } from "@/lib/mailchimp";
import { notifyEnabled, sendNotification } from "@/lib/notify";
import { isRateLimited, looksLikeSpam } from "@/lib/spam";
import { contactSchema, fieldErrors } from "@/lib/validation";

export async function POST(req: Request) {
  if (isRateLimited(req, "contact")) return fail(429, "Too many tries. Please wait a few minutes.");
  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(400, "Please check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  if (looksLikeSpam(d)) return ok();
  if (!notifyEnabled()) {
    return fail(503, `Our form isn't connected yet. Please email ${CONTACT_EMAIL} instead.`);
  }

  const sent = await sendNotification({
    subject: `Website message: ${d.topic}`,
    replyTo: d.email,
    text: [
      `New message from the website contact form.`,
      ``,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Phone: ${d.phone || "(not given)"}`,
      `Topic: ${d.topic}`,
      `Joined email list: ${d.optIn ? "yes" : "no"}`,
      ``,
      `Message:`,
      d.message,
    ].join("\n"),
  });
  if (!sent) return fail(502, `Sorry, that didn't send. Please email ${CONTACT_EMAIL} instead.`);

  if (d.optIn) {
    const [firstName, ...rest] = d.name.split(" ");
    await subscribeWithTags({ email: d.email, firstName, lastName: rest.join(" "), phone: d.phone }, ["contact-form"]);
  }
  return ok();
}
