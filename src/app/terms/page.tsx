import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_LINE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use | Avida Luna Wellness",
  description:
    "Terms for using the Avida Luna Wellness website and buying wellness add-ons.",
  path: "/terms",
});

export default async function TermsPage() {
  const { email } = await getSiteSettings();
  return (
    <article className="reading-page container-page py-12 md:py-16">
      <div className="prose-width mx-auto space-y-4">
        <p className="legal-review-note rounded-lg border-2 border-dashed border-[#8a6d1f] bg-[#fff8e1] px-3 py-2 text-sm text-[#4a3b10]">
          <strong>Draft, needs review by a lawyer.</strong> Not final.
        </p>
        <h1 className="text-4xl md:text-5xl">Terms of use</h1>
        <p>This website is run by {LEGAL_LINE}, Lakewood Ranch, Florida.</p>

        <h2 className="pt-4 text-2xl">
          General information, not medical advice
        </h2>
        <p>
          Everything on this website is general information. It is not medical
          advice and doesn&apos;t replace a conversation with your own
          healthcare provider.
        </p>

        <h2 className="pt-4 text-2xl">Medical services</h2>
        <p>
          IV and other medical services are booked, screened and paid on
          Hydreight, our booking partner, under its own terms. A visit happens
          only if you are cleared through that screening.
        </p>

        <h2 className="pt-4 text-2xl">Wellness add-ons</h2>
        <p>
          Add-ons bought on this website are non-medical extras for an
          appointment you have booked. Prices are shown in US dollars at
          checkout. Cancellation and refund terms: TODO from Shary.
        </p>

        <h2 className="pt-4 text-2xl">Contact</h2>
        <p>
          Questions: <a href={`mailto:${email}`}>{email}</a>. See also our{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>
      </div>
    </article>
  );
}
