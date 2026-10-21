import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { getFaqs, getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Mobile IV FAQ",
  description:
    "How booking works, what to expect, payment, add-ons and group events with Avida Luna Wellness, a nurse-led mobile IV service in Lakewood Ranch, FL.",
  path: "/faq",
});

export default async function FaqPage() {
  const [text, faqs] = await Promise.all([getPageText("faq"), getFaqs()]);
  // Only answers Shary has confirmed go into the FAQ schema.
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.todo)
      .map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <>
      <PageHero heading={text.heading} intro={text.intro} />
      <section className="container-page max-w-3xl py-12 md:py-16">
        <FaqList faqs={faqs} headingLevel="h2" />
        <p className="mt-6">
          Didn&apos;t find your answer? <Link href="/contact">Get in touch</Link>.
        </p>
      </section>
      <JsonLd data={schema} />
      <FinalCta />
    </>
  );
}
