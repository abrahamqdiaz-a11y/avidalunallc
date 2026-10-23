import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_LINE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice | Avida Luna Wellness",
  description:
    "What the Avida Luna Wellness website collects, why, and how to ask us to delete it.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const { email } = await getSiteSettings();
  return (
    <article className="reading-page container-page py-12 md:py-16">
      <div className="prose-width mx-auto space-y-4">
        <p className="legal-review-note rounded-lg border-2 border-dashed border-[#8a6d1f] bg-[#fff8e1] px-3 py-2 text-sm text-[#4a3b10]">
          <strong>Draft, needs review by a lawyer.</strong> Not final.
        </p>
        <h1 className="text-4xl md:text-5xl">Privacy notice</h1>
        <p>
          This website is run by {LEGAL_LINE} (&ldquo;we&rdquo;), Lakewood
          Ranch, Florida. Questions: <a href={`mailto:${email}`}>{email}</a>.
        </p>

        <h2 className="pt-4 text-2xl">What our forms collect</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Your name and email address.</li>
          <li>Your phone number, only if you choose to give it.</li>
          <li>Whether you ticked the box to get our emails.</li>
          <li>
            On the contact and group event forms: the topic, your message, and
            for events the date, city, group size and event type.
          </li>
          <li>
            For add-on payments: the appointment date you enter at checkout, and
            your payment, handled by Stripe.
          </li>
        </ul>

        <h2 className="pt-4 text-2xl">No health information</h2>
        <p>
          This website does not ask for or store health information: no
          symptoms, conditions, medications or health history. Please don&apos;t
          include medical information in any message. Medical booking and
          screening happen on Hydreight, our secure, HIPAA-compliant booking
          partner, which has its own privacy policy.
        </p>

        <h2 className="pt-4 text-2xl">Who processes it</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Netlify hosts this website.</li>
          <li>Mailchimp stores email-list contacts, only if you opted in.</li>
          <li>Stripe processes add-on payments.</li>
          <li>
            Resend delivers contact and group event form messages to us by
            email.
          </li>
          <li>
            Sanity stores the website&apos;s text and photos (not your form
            details).
          </li>
        </ul>
        <p>
          We don&apos;t use advertising pixels, session recording or analytics
          on this website.
        </p>

        <h2 className="pt-4 text-2xl">Unsubscribe or delete your details</h2>
        <p>
          Every email has an unsubscribe link. To ask us to delete your details,
          email <a href={`mailto:${email}`}>{email}</a>.
        </p>

        <h2 className="pt-4 text-2xl">More</h2>
        <p>
          See also our <Link href="/terms">terms</Link>.
        </p>
      </div>
    </article>
  );
}
