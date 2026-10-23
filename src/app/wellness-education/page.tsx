import type { Metadata } from "next";
import Link from "next/link";
import { ExternalIcon } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { Todo } from "@/components/Todo";
import { getArticles, getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Wellness Education",
  description:
    "Plain-language reading on IV hydration and wellness from Shary Gonzalez, RN, BSN. General information, not medical advice.",
  path: "/wellness-education",
});

// Outside reading Shary recommends. Each card opens the source in a new tab.
const resources = [
  {
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12182718/",
    title: "Read the research",
    summary:
      "A peer-reviewed article on PubMed Central, the free research library of the U.S. National Library of Medicine.",
    source: "PubMed Central",
  },
];

export default async function EducationPage() {
  const [text, articles] = await Promise.all([
    getPageText("education"),
    getArticles(),
  ]);
  return (
    <>
      <PageHero heading={text.heading} intro={text.intro} />
      <section className="container-page py-12 md:py-16">
        <ul className="resource-list">
          {articles.map((a) => (
            <li key={a.id} className="card p-6 md:p-8">
              <article>
                <h2 className="text-2xl md:text-3xl">
                  <Link
                    href={`/wellness-education/${a.slug}`}
                    className="text-olive no-underline hover:underline"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-2">{a.summary}</p>
                <p className="eyebrow mt-6">
                  <Link href={`/wellness-education/${a.slug}`}>
                    Read the overview →
                  </Link>
                </p>
                {a.todo ? <Todo className="mt-3">{a.todo}</Todo> : null}
              </article>
            </li>
          ))}
          {resources.map((r) => (
            <li key={r.href} className="card relative p-6 md:p-8">
              <article>
                <h2 className="text-2xl md:text-3xl">
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-olive no-underline after:absolute after:inset-0 hover:underline"
                  >
                    {r.title}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </h2>
                <p className="mt-2">{r.summary}</p>
                <p className="eyebrow mt-6 inline-flex items-center gap-2">
                  Read on {r.source} <ExternalIcon />
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
