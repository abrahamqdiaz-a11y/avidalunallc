import type { Metadata } from "next";
import Link from "next/link";
import { ArchPhoto } from "@/components/ArchPhoto";
import { AddOnTeaserCard, OfferCard } from "@/components/Cards";
import { FaqList } from "@/components/FaqList";
import { HowItWorks } from "@/components/HowItWorks";
import { FinalCta } from "@/components/FinalCta";
import { ArrowRightIcon } from "@/components/Icons";
import { Testimonials } from "@/components/Testimonials";
import { Todo } from "@/components/Todo";
import { WaveDivider } from "@/components/WaveDivider";
import { getAddOns, getArticles, getFaqs, getPageText, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Mobile IV Therapy in Lakewood Ranch, FL | Avida Luna Wellness",
  description:
    "Wellness that comes to you. IV hydration and wellness add-ons from Shary Gonzalez, RN, BSN, at your home, office or event in Lakewood Ranch, FL.",
  path: "/",
});

const trustItems = [
  "Registered Nurse, BSN",
  "17+ years in nursing",
  "Se habla español",
  "She comes to you",
  "Secure booking through Hydreight",
];

const offers = [
  {
    title: "IV hydration and wellness drips",
    text: "Choose a drip and relax at home, at work or at your event while Shary takes care of the rest.",
    href: "/services",
    linkLabel: "See services",
  },
  {
    title: "Wellness add-ons",
    text: "Add red light or aromatherapy to turn your visit into a calm hour for yourself.",
    href: "/add-ons",
    linkLabel: "See add-ons",
  },
  {
    title: "Group events",
    text: "Hydration and a little self-care for birthdays, bridal parties, team days and pop-ups.",
    href: "/events",
    linkLabel: "Plan a group event",
  },
  {
    title: "Personalized wellness programs",
    text: "Some services start with a consultation, so you can talk through your goals with Shary first.",
    href: "/services#consultation",
    linkLabel: "About consultations",
  },
];

export default async function HomePage() {
  const [text, addOns, articles, faqs, testimonials] = await Promise.all([
    getPageText("home"),
    getAddOns(),
    getArticles(),
    getFaqs(),
    getTestimonials(),
  ]);
  const s = text.sections;
  const latest = articles[0];
  const faqPreview = faqs.filter((f) => !f.todo).slice(0, 4);

  return (
    <>
      {/* 1. Hero */}
      <section className="band-sage on-sage">
        <div className="container-page grid items-center gap-10 pb-16 pt-10 md:grid-cols-[1.15fr_1fr] md:pb-20 md:pt-16">
          <div>
            <p className="eyebrow">Mobile IV and wellness · Lakewood Ranch, FL</p>
            <h1 className="mt-3 text-[2.75rem] leading-[1.05] md:text-6xl">{text.heading}</h1>
            <p className="prose-width mt-5 text-lg md:text-xl">{text.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn btn-primary">
                Book your IV
              </Link>
              <Link href="/services" className="btn btn-outline">
                See services
              </Link>
            </div>
          </div>
          <ArchPhoto
            image={null}
            priority
            caption={
              <>
                <span className="font-semibold">Shary Gonzalez, RN, BSN</span> · Founder
              </>
            }
          />
        </div>
      </section>
      <WaveDivider from="sage" to="cream" />

      {/* 2. Trust strip */}
      <section aria-label="Why Avida Luna" className="container-page -mt-2 pb-4">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-center text-[0.9375rem] font-semibold">
          {trustItems.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
        <Todo className="mx-auto mt-4 max-w-xl">Shary to confirm each trust-strip item.</Todo>
      </section>

      {/* 3. What we offer */}
      <section className="container-page py-14 md:py-20" aria-labelledby="offer-heading">
        <h2 id="offer-heading" className="text-3xl md:text-4xl">
          {s.offer?.heading}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o) => (
            <OfferCard key={o.title} {...o} />
          ))}
        </div>
      </section>

      {/* 4. How it works */}
      <section className="container-page pb-14 md:pb-20" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-3xl md:text-4xl">
          {s.how?.heading}
        </h2>
        <div className="mt-8">
          <HowItWorks />
        </div>
      </section>

      {/* 5. Make it a ritual */}
      <WaveDivider from="cream" to="sage" flip />
      <section className="band-sage on-sage" aria-labelledby="ritual-heading">
        <div className="container-page py-14 md:py-20">
          <h2 id="ritual-heading" className="text-3xl md:text-4xl">
            {s.ritual?.heading}
          </h2>
          <p className="prose-width mt-3">{s.ritual?.text}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((a) => (
              <AddOnTeaserCard key={a.id} addOn={a} />
            ))}
          </div>
        </div>
      </section>
      <WaveDivider from="sage" to="cream" />

      {/* 6. Group events teaser */}
      <section className="container-page py-14 md:py-20" aria-labelledby="events-heading">
        <div className="card grid items-center gap-6 p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <h2 id="events-heading" className="text-3xl md:text-4xl">
              {s.events?.heading}
            </h2>
            <p className="prose-width mt-3">{s.events?.text}</p>
          </div>
          <Link href="/events" className="btn btn-secondary">
            Plan your group event
          </Link>
        </div>
      </section>

      {/* 7. Meet Shary */}
      <section className="container-page pb-14 md:pb-20" aria-labelledby="meet-heading">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <ArchPhoto image={null} />
          <div>
            <p className="eyebrow">Meet your nurse</p>
            <h2 id="meet-heading" className="mt-2 text-3xl md:text-4xl">
              {s.meet?.heading}
            </h2>
            <p className="prose-width mt-4">{s.meet?.text}</p>
            <Link href="/about" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-olive-dark">
              More about Shary <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />

      {/* 8. Wellness Education teaser */}
      {latest ? (
        <section className="container-page pb-14 md:pb-20" aria-labelledby="edu-heading">
          <h2 id="edu-heading" className="text-3xl md:text-4xl">
            {s.education?.heading}
          </h2>
          <article className="card mt-6 p-6 md:p-8">
            <h3 className="text-2xl">
              <Link href={`/wellness-education/${latest.slug}`} className="text-olive no-underline hover:underline">
                {latest.title}
              </Link>
            </h3>
            <p className="prose-width mt-2">{latest.summary}</p>
            <Link href="/wellness-education" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-olive-dark">
              All articles <ArrowRightIcon />
            </Link>
          </article>
        </section>
      ) : null}

      {/* 9. FAQ preview */}
      <section className="container-page pb-14 md:pb-20" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl md:text-4xl">
          {s.faq?.heading}
        </h2>
        <div className="mt-6">
          <FaqList faqs={faqPreview} />
        </div>
        <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-olive-dark">
          All questions <ArrowRightIcon />
        </Link>
      </section>

      {/* 10. Final CTA */}
      <FinalCta heading={s.cta?.heading} text={s.cta?.text} />
    </>
  );
}
