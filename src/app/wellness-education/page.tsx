import type { Metadata } from "next";
import Link from "next/link";
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

export default async function EducationPage() {
  const [text, articles] = await Promise.all([getPageText("education"), getArticles()]);
  return (
    <>
      <PageHero heading={text.heading} intro={text.intro} />
      <section className="container-page py-12 md:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.id} className="card p-6 md:p-8">
              <article>
                <h2 className="text-2xl md:text-3xl">
                  <Link href={`/wellness-education/${a.slug}`} className="text-forest no-underline hover:underline">
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-2">{a.summary}</p>
                {a.todo ? <Todo className="mt-3">{a.todo}</Todo> : null}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
