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
    <>
      <PageHero eyebrow="Book" heading={text.heading} intro={text.intro} />
      <section className="container-page max-w-2xl py-10 md:py-14">
        <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-semibold" aria-label="Booking steps">
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-md bg-forest text-white">1</span>
            Your details <span className="sr-only">(current step)</span>
          </li>
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-md bg-sage text-ink">2</span>
            Service, time and screening
          </li>
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-md bg-sage text-ink">3</span>
            Your nurse comes to you
          </li>
        </ol>
        <IntakeForm mode="book" hydreightUrl={HYDREIGHT_BOOKING_URL} />
      </section>
    </>
  );
}
