import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";
import { PageHero } from "@/components/PageHero";
import { HYDREIGHT_BOOKING_URL } from "@/lib/constants";
import { getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Book a Mobile IV Appointment in Lakewood Ranch",
  description:
    "Book an appointment with Shary Gonzalez, RN, BSN. Share your name and email, then choose your service and time and complete a short health screening.",
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
