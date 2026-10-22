import type { Metadata } from "next";
import Link from "next/link";
import { OfferCard } from "@/components/Cards";
import { FaqList } from "@/components/FaqList";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRightIcon } from "@/components/Icons";
import { Portrait } from "@/components/Portrait";
import { Testimonials } from "@/components/Testimonials";
import { Todo } from "@/components/Todo";
import { getFaqs, getPageText, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Mobile IV Therapy in Lakewood Ranch, FL | Avida Luna Wellness",
  description:
    "Nurse-led mobile IV hydration in Lakewood Ranch, FL. Shary Gonzalez, RN, BSN, brings 17+ years of nursing experience to your home, office or event.",
  path: "/",
});

const heroStats = [
  { value: "17+ years", label: "Nursing experience" },
  { value: "RN, BSN", label: "Professional credentials" },
  { value: "Mobile care", label: "At your location" },
];

const trustItems = [
  { title: "Registered Nurse, BSN", text: "Florida registered nurse" },
  { title: "17+ years in nursing", text: "25 years in healthcare" },
  { title: "Lakewood Ranch & nearby", text: "Home, office and event visits" },
  { title: "English & Spanish", text: "Se habla español" },
];

const services = [
  {
    eyebrow: "Core service",
    title: "Mobile IV hydration",
    text: "Professional IV hydration administered by an experienced registered nurse, with an individual assessment before your IV begins.",
    href: "/services",
    linkLabel: "Explore IV services",
    primary: true,
  },
  {
    eyebrow: "By appointment",
    title: "Personalized consultations",
    text: "Discuss your goals, health history and available services directly with your nurse.",
    href: "/services#consultation",
    linkLabel: "Learn more",
  },
  {
    eyebrow: "Groups",
    title: "Group & corporate wellness",
    text: "Coordinated mobile IV services for private groups, workplaces and special events.",
    href: "/events",
    linkLabel: "Plan an event",
  },
];

// FAQ ids shown on the home page, in order: eligibility, screening, the visit itself, booking.
const HOME_FAQ_IDS = ["faq-eligibility", "faq-before", "faq-during", "faq-book"];

export default async function HomePage() {
  const [text, faqs, testimonials] = await Promise.all([getPageText("home"), getFaqs(), getTestimonials()]);
  const s = text.sections;
  const faqPreview = HOME_FAQ_IDS.map((id) => faqs.find((f) => f.id === id)).filter((f) => f !== undefined);
  const meetParagraphs = (s.meet?.text ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <>
      {/* 1. Hero: the nurse is the authority */}
      <section>
        <div className="container-page grid items-center gap-12 pb-14 pt-10 md:grid-cols-[1.15fr_1fr] md:pb-20 md:pt-16">
          <div>
            <p className="eyebrow">Mobile IV therapy · Lakewood Ranch, FL</p>
            <h1 className="mt-4 text-[2.5rem] leading-[1.08] md:text-[3.5rem]">{text.heading}</h1>
            <p className="prose-width mt-5 text-lg text-muted md:text-xl">{text.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn btn-primary">
                Book an appointment <ArrowRightIcon />
              </Link>
              <a href="#meet" className="btn btn-outline">
                Meet your nurse
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="stat-label order-2">{stat.label}</dt>
                  <dd className="stat-value -order-1">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Portrait priority />
        </div>
      </section>

      {/* 2. Trust: credentials, experience, service area, language */}
      <section aria-labelledby="trust-heading" className="border-y border-line bg-paper">
        <div className="container-page py-6 md:py-7">
          <h2 id="trust-heading" className="sr-only">
            Why patients choose Avida Luna
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {trustItems.map((item) => (
              <li key={item.title} className="lg:px-6 lg:first:pl-0">
                <p className="text-[0.9375rem] font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          <Todo className="mt-5 max-w-xl">
            Shary to confirm each item and add her Florida RN license number, linked to the Florida Board of Nursing
            license lookup so visitors can verify it.
          </Todo>
        </div>
      </section>

      {/* 3. Services: one core service, two supporting ones */}
      <section className="container-page py-14 md:py-20" aria-labelledby="services-heading">
        <p className="eyebrow">Services</p>
        <h2 id="services-heading" className="mt-2 text-3xl md:text-4xl">
          {s.services?.heading}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {services.map((o) => (
            <OfferCard key={o.title} {...o} />
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 text-[0.9375rem] md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            <span className="font-semibold text-ink">Optional add-ons</span> are available with an IV appointment: red
            light and aromatherapy.
          </p>
          <Link href="/services" className="inline-flex items-center gap-1.5 font-semibold text-olive">
            View all services <ArrowRightIcon />
          </Link>
        </div>
      </section>

      {/* 4. Meet Shary */}
      <section id="meet" className="band-sage on-sage scroll-mt-24" aria-labelledby="meet-heading">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_1.2fr] md:py-20">
          <Portrait variant="alt" />
          <div>
            <span aria-hidden className="accent-rule mb-4" />
            <p className="eyebrow">Meet your nurse</p>
            <h2 id="meet-heading" className="mt-2 text-3xl md:text-4xl">
              {s.meet?.heading}
            </h2>
            <p className="mt-3 text-lg font-semibold">Shary Gonzalez, RN, BSN</p>
            {meetParagraphs.map((p, i) => (
              <p key={i} className="prose-width mt-4">
                {p}
              </p>
            ))}
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold">
              Learn more about Shary <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How appointments work */}
      <section id="how" className="container-page scroll-mt-24 py-14 md:py-20" aria-labelledby="how-heading">
        <p className="eyebrow">How appointments work</p>
        <h2 id="how-heading" className="mt-2 text-3xl md:text-4xl">
          {s.how?.heading}
        </h2>
        <div className="mt-8">
          <HowItWorks />
        </div>
      </section>

      {/* 6. Patient experiences */}
      <Testimonials items={testimonials} />

      {/* 7 + 8. Areas served and FAQs, side by side on desktop */}
      <div className="container-page grid gap-12 pb-14 md:pb-20 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="areas-heading">
          <p className="eyebrow">Areas served</p>
          <h2 id="areas-heading" className="mt-2 text-3xl">
            {s.areas?.heading}
          </h2>
          <p className="mt-3 text-muted">{s.areas?.text}</p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            <li className="flex justify-between gap-4 py-3">
              <span className="font-semibold">Lakewood Ranch</span>
              <span className="text-muted">Home base</span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span className="font-semibold">Surrounding communities</span>
              <span className="text-muted">Ask when you book</span>
            </li>
          </ul>
          <Todo className="mt-4">
            List the specific communities Shary travels to (only verified ones) and any travel fee.
          </Todo>
        </section>
        <section aria-labelledby="faq-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading" className="mt-2 text-3xl">
            {s.faq?.heading}
          </h2>
          <div className="mt-6">
            <FaqList faqs={faqPreview} />
          </div>
          <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-olive">
            All questions <ArrowRightIcon />
          </Link>
        </section>
      </div>

      <FinalCta heading={s.cta?.heading} text={s.cta?.text} />
    </>
  );
}
