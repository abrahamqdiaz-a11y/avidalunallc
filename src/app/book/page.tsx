import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";
import { PageHero } from "@/components/PageHero";
import { HYDREIGHT_BOOKING_URL } from "@/lib/constants";
import { getAddOns, getPageText } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Book In-Home IV Therapy in Lakewood Ranch | Avida Luna",
  description:
    "Book mobile IV therapy at home in Lakewood Ranch, Sarasota or Bradenton. Share your name and email, then pick your drip and time and complete a short screening.",
  path: "/book",
});

export default async function BookPage() {
  const [text, addOns] = await Promise.all([getPageText("book"), getAddOns()]);
  return (
    <div className="booking-page">
      <PageHero eyebrow="Book" heading={text.heading} intro={text.intro} />
      {/* Steps 1 and 2 are narrow; step 3 (add-ons) uses the full width. */}
      <section className="container-page py-10 md:py-14">
        <IntakeForm
          mode="book"
          hydreightUrl={HYDREIGHT_BOOKING_URL}
          addOns={addOns}
          paymentsEnabled={paymentsEnabled()}
        />
      </section>
    </div>
  );
}
