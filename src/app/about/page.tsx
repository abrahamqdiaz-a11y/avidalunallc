import type { Metadata } from "next";
import { FinalCta } from "@/components/FinalCta";
import { CheckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Portrait } from "@/components/Portrait";
import { Todo } from "@/components/Todo";
import { credentials, getPageText } from "@/lib/content";
import { profilePageSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Shary Gonzalez, RN, BSN | Mobile IV Nurse, Lakewood Ranch",
  description:
    "Meet Shary Gonzalez, RN, BSN, the registered nurse behind Avida Luna Wellness: 17+ years in nursing, bilingual, bringing mobile IV therapy to Lakewood Ranch.",
  path: "/about",
});

export default async function AboutPage() {
  const text = await getPageText("about");
  const s = text.sections;
  const paragraphs = (s.story?.text ?? "").split(/\n\n+/).filter(Boolean);
  return (
    <>
      <section className="about-profile border-b border-line">
        <div className="container-page grid items-center gap-10 pb-14 pt-10 md:grid-cols-[1.2fr_1fr] md:pb-16 md:pt-16">
          <div>
            <p className="eyebrow">Meet your nurse</p>
            <h1 className="mt-3 text-4xl md:text-[3.25rem]">{text.heading}</h1>
            <p className="mt-2 font-semibold text-olive">
              Mobile IV nurse and founder of Avida Luna Wellness
            </p>
            <p className="prose-width mt-5 text-lg text-muted md:text-xl">
              {text.intro}
            </p>
          </div>
          <Portrait priority />
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
        <div className="prose-width">
          {s.story?.heading ? (
            <h2 className="mb-4 text-3xl">{s.story.heading}</h2>
          ) : null}
          {paragraphs.map((p, i) => (
            <p key={i} className={i ? "mt-4" : ""}>
              {p}
            </p>
          ))}
          <Todo className="mt-6">
            This story is a draft built only from facts on her current site.
            Shary to replace or edit it in her own words (Sanity: Page text →
            About).
          </Todo>
        </div>
        <aside
          className="about-credentials card self-start p-6"
          aria-labelledby="cred-heading"
        >
          <h2 id="cred-heading" className="text-xl">
            {s.credentials?.heading}
          </h2>
          <ul className="mt-4 space-y-2">
            {credentials.map((c) => (
              <li key={c} className="flex gap-2">
                <CheckIcon className="mt-1 size-5 shrink-0 text-olive" /> {c}
              </li>
            ))}
          </ul>
          <Todo className="mt-4">
            Confirm credentials, add her Florida RN license number (verifiable
            on the Florida Board of Nursing lookup) and her areas of nursing
            experience.
          </Todo>
        </aside>
      </section>

      <section className="container-page pb-14 md:pb-20" aria-label="Mission">
        {s.mission?.text ? (
          <blockquote className="prose-width mx-auto text-center font-display text-2xl font-medium text-olive md:text-3xl">
            &ldquo;{s.mission.text}&rdquo;
          </blockquote>
        ) : (
          <Todo className="mx-auto max-w-xl">
            Shary&apos;s mission quote, word for word from her current site.
          </Todo>
        )}
      </section>

      <JsonLd data={profilePageSchema()} />
      <FinalCta
        secondary={{ href: "/contact", label: "Ask Shary a question" }}
      />
    </>
  );
}
