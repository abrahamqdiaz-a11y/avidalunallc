import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { Todo } from "@/components/Todo";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import { getArticle, getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { RichBlock } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/wellness-education/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/wellness-education/${slug}`,
  });
}

function Block({ block }: { block: RichBlock }) {
  if ("items" in block) {
    const List = block.type;
    return (
      <List
        className={`my-4 space-y-1 pl-6 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}
      >
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </List>
    );
  }
  if (block.type === "h2")
    return <h2 className="mt-10 text-3xl">{block.text}</h2>;
  if (block.type === "h3")
    return <h3 className="mt-8 text-2xl">{block.text}</h3>;
  return (
    <p className="my-4">
      {block.text}
      {block.links?.map((l) => (
        <span key={l.href}>
          {" "}
          <a href={l.href} rel="noopener">
            ({l.text})
          </a>
        </span>
      ))}
    </p>
  );
}

export default async function ArticlePage({
  params,
}: PageProps<"/wellness-education/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    ...(!article.todo ? { datePublished: article.publishedAt } : {}),
    author: { "@type": "Person", name: "Shary Gonzalez, RN, BSN" },
    publisher: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/wellness-education/${article.slug}`,
    ...(article.image ? { image: article.image.src } : {}),
  };

  return (
    <>
      <article className="reading-page container-page py-12 md:py-16">
        <div className="prose-width mx-auto">
          <p className="eyebrow">
            <Link href="/wellness-education" className="no-underline">
              Wellness education
            </Link>
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl">{article.title}</h1>
          <p className="mt-3 text-lg">{article.summary}</p>
          <p
            className="mt-4 rounded-xl bg-sage/50 px-4 py-3 text-[0.9375rem]"
            role="note"
          >
            General information, not medical advice. For questions about your
            own health, talk with your healthcare provider.
          </p>
          {article.todo ? <Todo className="mt-6">{article.todo}</Todo> : null}
          <div className="mt-6">
            {article.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
          <section
            className="mt-10 border-t border-olive/15 pt-6"
            aria-labelledby="sources-heading"
          >
            <h2 id="sources-heading" className="text-lg text-ink">
              Sources
            </h2>
            {article.sources.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {article.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Further reading will be added after Shary’s review.
              </p>
            )}
          </section>
        </div>
        <JsonLd data={schema} />
      </article>
      <FinalCta />
    </>
  );
}
