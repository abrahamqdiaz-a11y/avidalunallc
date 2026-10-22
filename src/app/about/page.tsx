import type { Metadata } from "next";
import { FinalCta } from "@/components/FinalCta";
import { CheckIcon } from "@/components/Icons";
import { Portrait } from "@/components/Portrait";
import { Todo } from "@/components/Todo";
import { credentials, getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "About Shary Gonzalez, RN, BSN",
  description:
    "Meet Shary Gonzalez, RN, BSN: a registered nurse with 17+ years in nursing who founded Avida Luna to bring professional mobile IV care to Lakewood Ranch, FL.",
  path: "/about",
});

export default async function AboutPage() {
  const text = await getPageText("about");
  const s = text.sections;
  const paragraphs = (s.story?.text ?? "").split(/\n\n+/).filter(Boolean);
  return (
    <>
      <section className="band-sage on-sage">
        <div className="container-page grid items-center gap-10 pb-14 pt-10 md:grid-cols-[1.2fr_1fr] md:pb-16 md:pt-16">
          <div>
            <p className="eyebrow">Meet your nurse</p>
            <h1 className="mt-3 text-4xl md:text-[3.25rem]">{text.heading}</h1>
            <p className="mt-2 font-semibold text-forest">Founder and registered nurse, Avida Luna</p>
            <p className="prose-width mt-5 text-lg text-muted md:text-xl">{text.intro}</p>
          </div>
          <Portrait image={null} priority />
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
        <div className="prose-width">
          {paragraphs.map((p, i) => (
            <p key={i} className={i ? "mt-4" : ""}>
              {p}
            </p>
          ))}
          <Todo className="mt-6">
            This story is a draft built only from facts on her current site. Shary to replace or edit it in her own
            words (Sanity: Page text → About).
          </Todo>
        </div>
        <aside className="card self-start p-6" aria-labelledby="cred-heading">
          <h2 id="cred-heading" className="text-xl">
            {s.credentials?.heading}
          </h2>
          <ul className="mt-4 space-y-2">
            {credentials.map((c) => (
              <li key={c} className="flex gap-2">
                <CheckIcon className="mt-1 size-5 shrink-0 text-forest" /> {c}
              </li>
            ))}
          </ul>
          <Todo className="mt-4">
            Confirm credentials, add her Florida RN license number (verifiable on the Florida Board of Nursing lookup)
            and her areas of nursing experience.
          </Todo>
        </aside>
      </section>

      <section className="container-page pb-14 md:pb-20" aria-label="Mission">
        {s.mission?.text ? (
          <blockquote className="prose-width mx-auto text-center font-display text-2xl font-medium text-forest md:text-3xl">
            &ldquo;{s.mission.text}&rdquo;
          </blockquote>
        ) : (
          <Todo className="mx-auto max-w-xl">Shary&apos;s mission quote, word for word from her current site.</Todo>
        )}
      </section>

      <FinalCta secondary={{ href: "/contact", label: "Ask Shary a question" }} />
    </>
  );
}
