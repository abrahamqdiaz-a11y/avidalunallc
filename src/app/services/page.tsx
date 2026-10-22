import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/Cards";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRightIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getPageText, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Nurse-Led Mobile IV Hydration in Lakewood Ranch",
  description:
    "Mobile IV hydration, consultations and group visits from Shary Gonzalez, RN, BSN, at your home, office or event in Lakewood Ranch, FL. Screened before every visit.",
  path: "/services",
});

export default async function ServicesPage() {
  const [text, services] = await Promise.all([getPageText("services"), getServices()]);
  const s = text.sections;
  const drips = services.filter((x) => x.category === "iv");
  const vitamins = services.filter((x) => x.category === "vitamin");

  return (
    <>
      <PageHero eyebrow="Services" heading={text.heading} intro={text.intro}>
        <Link href="/book" className="btn btn-primary mt-7">
          Book an appointment
        </Link>
      </PageHero>

      <section className="container-page py-12 md:py-16" aria-labelledby="iv-heading">
        <p className="eyebrow">Core service</p>
        <h2 id="iv-heading" className="mt-2 text-3xl md:text-4xl">
          {s.iv?.heading}
        </h2>
        {s.iv?.text ? <p className="prose-width mt-3 text-muted">{s.iv.text}</p> : null}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {drips.map((x) => (
            <ServiceCard key={x.id} service={x} />
          ))}
        </div>
      </section>

      <section
        id="consultation"
        className="container-page scroll-mt-24 pb-12 md:pb-16"
        aria-labelledby="consult-heading"
      >
        <div className="card p-6 md:p-10">
          <h2 id="consult-heading" className="text-3xl md:text-4xl">
            {s.consultation?.heading}
          </h2>
          <p className="prose-width mt-3 text-muted">{s.consultation?.text}</p>
          <Link href="/book" className="btn btn-outline mt-6">
            Book a consultation
          </Link>
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

      <section className="band-sage on-sage" aria-labelledby="how-heading">
        <div className="container-page py-12 md:py-16">
          <h2 id="how-heading" className="text-3xl md:text-4xl">
            {s.how?.heading}
          </h2>
          <div className="mt-6">
            <HowItWorks compact />
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-14" aria-labelledby="addons-heading">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="addons-heading" className="text-2xl">
              {s.addons?.heading}
            </h2>
            <p className="mt-2 text-muted">{s.addons?.text}</p>
          </div>
          <Link href="/add-ons" className="btn btn-outline">
            See add-ons <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
