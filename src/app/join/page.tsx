import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";
import { PageHero } from "@/components/PageHero";
import { HYDREIGHT_BOOKING_URL } from "@/lib/constants";
import { getPageText, getUpcomingEvents } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Join the Avida Luna List",
  description: "Sign up for Avida Luna Wellness event news and offers by email. Unsubscribe anytime.",
  path: "/join",
});

export default async function JoinPage() {
  const [text, events] = await Promise.all([getPageText("join"), getUpcomingEvents()]);
  return (
    <>
      <PageHero heading={text.heading} intro={text.intro} />
      <section className="container-page max-w-2xl py-10 md:py-14">
        <IntakeForm
          mode="join"
          hydreightUrl={HYDREIGHT_BOOKING_URL}
          events={events.filter((e) => e.slug).map((e) => ({ slug: e.slug, title: e.title }))}
        />
      </section>
    </>
  );
}
