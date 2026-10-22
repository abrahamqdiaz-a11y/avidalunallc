import type { Metadata } from "next";
import Link from "next/link";
import { OfferCard } from "@/components/Cards";
import { FaqList } from "@/components/FaqList";
import { FinalCta } from "@/components/FinalCta";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { Portrait } from "@/components/Portrait";
import { Testimonials } from "@/components/Testimonials";
import { Todo } from "@/components/Todo";
import { getFaqs, getPageText, getSiteSettings, getTestimonials } from "@/lib/content";
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
  { title: "Registered nurse, BSN", text: "Every IV is placed and monitored by Shary herself." },
  { title: "17+ years in nursing", text: "25 years in healthcare, now focused on care in your home." },
  { title: "Screened before every visit", text: "Confidential health screening through our booking partner, Hydreight." },
  { title: "Se habla español", text: "Care and conversation in English or Spanish." },
];

const services = [
  {
    title: "Mobile IV hydration",
    text: "Professional IV hydration administered by an experienced registered nurse, with an individual assessment before your IV begins.",
    href: "/services",
    linkLabel: "Explore IV services",
    primary: true,
  },
  {
    title: "Personalized consultations",
    text: "Discuss your goals, health history and available services directly with your nurse.",
    href: "/services#consultation",
    linkLabel: "Learn more",
  },
  {
    title: "Group & corporate wellness",
    text: "Coordinated mobile IV services for private groups, workplaces and special events.",
    href: "/events",
    linkLabel: "Plan an event",
  },
];

// FAQ ids shown on the home page, in order: eligibility, screening, safety, the visit itself.
const HOME_FAQ_IDS = ["faq-eligibility", "faq-before", "faq-safety", "faq-during", "faq-book"];

export default async function HomePage() {
  const [text, faqs, testimonials, settings] = await Promise.all([
    getPageText("home"),
    getFaqs(),
    getTestimonials(),
    getSiteSettings(),
  ]);
  const s = text.sections;
  const faqPreview = HOME_FAQ_IDS.map((id) => faqs.find((f) => f.id === id)).filter((f) => f !== undefined);
  const meetParagraphs = (s.meet?.text ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <>
      {/* 1. Hero: the nurse is the authority */}
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-12 pb-14 pt-10 md:grid-cols-[1.2fr_1fr] md:pb-20 md:pt-16">
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
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="stat-label order-2">{stat.label}</dt>
                  <dd className="stat-value -order-1">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Portrait image={null} priority />
        </div>
      </section>

      {/* 2. Trust: experience, credentials, service area */}
      <section aria-labelledby="trust-heading" className="band-sage on-sage">
        <div className="container-page py-10 md:py-12">
          <h2 id="trust-heading" className="sr-only">
            Why patients choose Avida Luna
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <li key={item.title} className="flex gap-3">
                <CheckIcon className="mt-1 size-5 shrink-0 text-forest" />
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-[0.9375rem] text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Todo className="mt-6 max-w-xl">
            Shary to confirm each trust item, and add her Florida RN license number so visitors can verify it.
          </Todo>
        </div>
      </section>

      {/* 3. Services: one core service, two supporting ones */}
      <section className="container-page py-14 md:py-20" aria-labelledby="services-heading">
        <p className="eyebrow">Services</p>
        <h2 id="services-heading" className="mt-2 text-3xl md:text-4xl">
          {s.services?.heading}
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_1fr_1fr]">
          {services.map((o) => (
            <OfferCard key={o.title} {...o} />
          ))}
        </div>
        <p className="mt-6 text-muted">
          Optional <Link href="/add-ons">wellness add-ons</Link>, like red light and aromatherapy, can be added to an
          IV appointment.
        </p>
      </section>

      {/* 4. Meet Shary */}
      <section id="meet" className="band-sage on-sage scroll-mt-24" aria-labelledby="meet-heading">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_1.2fr] md:py-20">
          <Portrait image={null} />
          <div>
            <p className="eyebrow">Meet your nurse</p>
            <h2 id="meet-heading" className="mt-2 text-3xl md:text-4xl">
              {s.meet?.heading}
            </h2>
            <p className="mt-3 text-lg font-semibold text-forest">Shary Gonzalez, RN, BSN</p>
            {meetParagraphs.map((p, i) => (
              <p key={i} className="prose-width mt-4">
                {p}
              </p>
            ))}
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-forest">
              Learn more about Shary <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How appointments work */}
      <section className="container-page py-14 md:py-20" aria-labelledby="how-heading">
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

      {/* 7. Areas served */}
      <section className="container-page pb-14 md:pb-20" aria-labelledby="areas-heading">
        <div className="card grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <p className="eyebrow">Areas served</p>
            <h2 id="areas-heading" className="mt-2 text-3xl md:text-4xl">
              {s.areas?.heading}
            </h2>
          </div>
          <div>
            <p>{s.areas?.text}</p>
            <p className="mt-3 font-semibold text-forest">{settings.serviceArea}</p>
            <Todo className="mt-4">
              List the specific communities Shary travels to (only verified ones) and any travel fee.
            </Todo>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="container-page pb-14 md:pb-20" aria-labelledby="faq-heading">
        <p className="eyebrow">Common questions</p>
        <h2 id="faq-heading" className="mt-2 text-3xl md:text-4xl">
          {s.faq?.heading}
        </h2>
        <div className="mt-6">
          <FaqList faqs={faqPreview} />
        </div>
        <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-forest">
          All questions <ArrowRightIcon />
        </Link>
      </section>

      <FinalCta heading={s.cta?.heading} text={s.cta?.text} secondary={{ href: "/contact", label: "Ask Shary a question" }} />
    </>
  );
}
