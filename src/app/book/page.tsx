import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";
import { PageHero } from "@/components/PageHero";
import { HYDREIGHT_BOOKING_URL } from "@/lib/constants";
import { getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Book In-Home IV Therapy in Lakewood Ranch | Avida Luna",
  description:
    "Book mobile IV therapy at home in Lakewood Ranch, Sarasota or Bradenton. Share your name and email, then pick your drip and time and complete a short screening.",
  path: "/book",
});

export default async function BookPage() {
  const text = await getPageText("book");
  return (
    <div className="booking-page">
      <PageHero eyebrow="Book" heading={text.heading} intro={text.intro} />
      <section className="container-page max-w-2xl py-10 md:py-14">
        <IntakeForm mode="book" hydreightUrl={HYDREIGHT_BOOKING_URL} />
      </section>
    </div>
  );
}
