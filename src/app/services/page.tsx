import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/Cards";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRightIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { WaveDivider } from "@/components/WaveDivider";
import { getPageText, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "IV Hydration and Vitamin Boosts in Lakewood Ranch",
  description:
    "Mobile IV hydration drips and vitamin boosts from a registered nurse who comes to your home, office or event in Lakewood Ranch, FL. Book securely in minutes.",
  path: "/services",
});

export default async function ServicesPage() {
  const [text, services] = await Promise.all([getPageText("services"), getServices()]);
  const s = text.sections;
  const drips = services.filter((x) => x.category === "iv");
  const vitamins = services.filter((x) => x.category === "vitamin");

  return (
    <>
      <PageHero heading={text.heading} intro={text.intro}>
        <Link href="/book" className="btn btn-primary mt-7">
          Book your IV
        </Link>
      </PageHero>
      <WaveDivider from="sage" to="cream" />

      <section className="container-page py-12 md:py-16" aria-labelledby="iv-heading">
        <h2 id="iv-heading" className="text-3xl md:text-4xl">
          {s.iv?.heading}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {drips.map((x) => (
            <ServiceCard key={x.id} service={x} />
          ))}
        </div>
      </section>

      {vitamins.length ? (
        <section className="container-page pb-12 md:pb-16" aria-labelledby="vitamin-heading">
          <h2 id="vitamin-heading" className="text-3xl md:text-4xl">
            {s.vitamin?.heading}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vitamins.map((x) => (
              <ServiceCard key={x.id} service={x} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        id="consultation"
        className="container-page scroll-mt-24 pb-12 md:pb-16"
        aria-labelledby="consult-heading"
      >
        <div className="card p-6 md:p-10">
          <h2 id="consult-heading" className="text-3xl md:text-4xl">
            {s.consultation?.heading}
          </h2>
          <p className="prose-width mt-3">{s.consultation?.text}</p>
          <Link href="/book" className="btn btn-secondary mt-6">
            Book a consultation
          </Link>
        </div>
      </section>

      <WaveDivider from="cream" to="sage" flip />
      <section className="band-sage on-sage" aria-labelledby="addons-heading">
        <div className="container-page flex flex-col gap-4 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div>
            <h2 id="addons-heading" className="text-3xl md:text-4xl">
              {s.addons?.heading}
            </h2>
            <p className="mt-2">{s.addons?.text}</p>
          </div>
          <Link href="/add-ons" className="btn btn-outline">
            See add-ons <ArrowRightIcon />
          </Link>
        </div>
      </section>
      <WaveDivider from="sage" to="cream" />

      <section className="container-page py-12 md:py-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-3xl md:text-4xl">
          {s.how?.heading}
        </h2>
        <div className="mt-6">
          <HowItWorks compact />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
