import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { IvServiceCard } from "@/components/Cards";
import { ArrowRightIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { getAddOns, getPageText, getServices } from "@/lib/content";
import { formatDuration, formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Service } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Nurse-Led Mobile IV Hydration in Lakewood Ranch",
  description:
    "Mobile IV drips, vitamin injections, consultations and group visits from Shary Gonzalez, RN, BSN, at your home, office or event in Lakewood Ranch, FL. Screened before every visit.",
  path: "/services",
});

export default async function ServicesPage() {
  const [text, services, addOns] = await Promise.all([
    getPageText("services"),
    getServices(),
    getAddOns(),
  ]);
  const s = text.sections;
  const drips = services.filter((x) => x.category === "iv");
  const boosts = services.filter((x) => x.category === "boost");
  const vitamins = services.filter((x) => x.category === "vitamin");
  const extras = addOns.filter((a) => !a.todo);
  const jumpLinks = [
    { href: "#iv-drips", label: "IV drips", show: drips.length > 0 },
    { href: "#boosts", label: "Drip add-ins", show: boosts.length > 0 },
    { href: "#injections", label: "Injections", show: vitamins.length > 0 },
    { href: "#consultation", label: "Consultations", show: true },
    { href: "#add-ons", label: "Wellness add-ons", show: true },
    { href: "#groups", label: "Groups", show: true },
  ].filter((l) => l.show);

  return (
    <>
      <PageHero eyebrow="Services" heading={text.heading} intro={text.intro}>
        <Link href="/book" className="btn btn-primary mt-7">
          Book an appointment
        </Link>
        <nav aria-label="On this page" className="service-jump">
          {jumpLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section
        id="iv-drips"
        className="container-page scroll-mt-32 py-12 md:py-16"
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

      {boosts.length ? (
        <section
          id="boosts"
          className="container-page scroll-mt-32 pb-12 md:pb-16"
          aria-labelledby="boost-heading"
        >
          <div className="price-panel">
            <div>
              <p className="eyebrow">Add to any IV</p>
              <h2 id="boost-heading" className="mt-2 text-3xl md:text-4xl">
                {s.boost?.heading}
              </h2>
              {s.boost?.text ? (
                <p className="mt-3 text-muted">{s.boost.text}</p>
              ) : null}
            </div>
            <PriceList items={boosts} />
          </div>
        </section>
      ) : null}

      {vitamins.length ? (
        <section
          id="injections"
          className="container-page scroll-mt-32 pb-12 md:pb-16"
          aria-labelledby="vitamin-heading"
        >
          <div className="price-panel">
            <div>
              <p className="eyebrow">Quick visits</p>
              <h2 id="vitamin-heading" className="mt-2 text-3xl md:text-4xl">
                {s.vitamin?.heading}
              </h2>
              {s.vitamin?.text ? (
                <p className="mt-3 text-muted">{s.vitamin.text}</p>
              ) : null}
              <Link href="/book" className="btn btn-outline mt-6">
                Book an injection <ArrowRightIcon />
              </Link>
            </div>
            <PriceList items={vitamins} />
          </div>
        </section>
      ) : null}

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


      <section
        id="add-ons"
        className="container-page scroll-mt-32 pb-12 md:pb-16"
        aria-labelledby="addons-heading"
      >
        <div className="price-panel">
          <div>
            <p className="eyebrow">A little extra</p>
            <h2 id="addons-heading" className="mt-2 text-3xl md:text-4xl">
              {s.addons?.heading}
            </h2>
            <p className="mt-3 text-muted">{s.addons?.text}</p>
            <Link href="/add-ons" className="btn btn-outline mt-6">
              See add-ons <ArrowRightIcon />
            </Link>
          </div>
          {extras.length ? (
            <ul className="price-list">
              {extras.map((a) => (
                <li key={a.id}>
                  <div>
                    <h3>{a.name}</h3>
                    <p>{a.description}</p>
                  </div>
                  <p className="price-list-price">
                    {formatPrice(a.price)}
                    {a.durationMinutes ? (
                      <small>{formatDuration(a.durationMinutes)}</small>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section id="groups" className="container-page scroll-mt-32 pb-12 md:pb-16">
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


      <FinalCta />
    </>
  );
}

/** Compact name / description / price rows for drip add-ins and injections. */
function PriceList({ items }: { items: Service[] }) {
  return (
    <ul className="price-list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
          {item.showPrice && item.price !== null ? (
            <p className="price-list-price">{formatPrice(item.price)}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
