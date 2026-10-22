import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { IvServiceCard } from "@/components/Cards";
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
  const [text, services] = await Promise.all([
    getPageText("services"),
    getServices(),
  ]);
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

      <section
        className="container-page py-12 md:py-16"
        aria-labelledby="iv-heading"
        data-section="iv-services"
      >
        <p className="eyebrow">Core service</p>
        <h2 id="iv-heading" className="mt-2 text-3xl md:text-4xl">
          {s.iv?.heading}
        </h2>
        {s.iv?.text ? (
          <p className="prose-width mt-3 text-muted">{s.iv.text}</p>
        ) : null}
        <div className="iv-grid">
          {drips.map((service) => (
            <IvServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="iv-note">
          <p>
            Every visit begins with a clinical assessment by your registered
            nurse. Eligibility is confirmed through a short health screening on
            Hydreight before any IV is placed, and some services may not be
            right for everyone. Availability depends on your location and
            scheduling.
          </p>
          <p>
            {drips.some((service) => service.todo)
              ? "Starting prices and menu details are pending Shary’s confirmation. "
              : ""}
            Final service selection and pricing are confirmed on Hydreight.
          </p>
        </div>
      </section>

      <section
        id="consultation"
        className="container-page scroll-mt-32 pb-12 md:pb-16"
        aria-labelledby="consult-heading"
      >
        <div className="practice-feature">
          <div>
            <p className="eyebrow mb-4">PERSONAL ATTENTION</p>
            <h2 id="consult-heading" className="text-3xl md:text-4xl">
              {s.consultation?.heading}
            </h2>
          </div>
          <div>
            <p className="prose-width text-muted">{s.consultation?.text}</p>
            <Link href="/book" className="btn btn-outline mt-6">
              Book an appointment
            </Link>
          </div>
        </div>
      </section>

      {vitamins.length ? (
        <section
          className="container-page pb-12 md:pb-16"
          aria-labelledby="vitamin-heading"
        >
          <h2 id="vitamin-heading" className="text-3xl md:text-4xl">
            {s.vitamin?.heading}
          </h2>
          <ul className="vitamin-list">
            {vitamins.map((service) => (
              <li key={service.id}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <Link href="/book">
                  Book an appointment{" "}
                  <ArrowRightIcon className="inline size-4 ml-2" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="container-page pb-12 md:pb-16">
        <div className="practice-feature">
          <div>
            <p className="eyebrow mb-4">CARE, TOGETHER</p>
            <h2>Group & corporate wellness</h2>
          </div>
          <div>
            <p>
              Professional mobile care for your workplace, private group or
              event. Plan the timing and setup directly with Shary.
            </p>
            <Link href="/events" className="btn btn-outline mt-6">
              Plan a group visit <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
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

      <section
        className="container-page py-12 md:py-14"
        aria-labelledby="addons-heading"
      >
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
