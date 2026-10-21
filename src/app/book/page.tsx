import type { Metadata } from "next";
import { IntakeForm } from "@/components/forms/IntakeForm";
import { PageHero } from "@/components/PageHero";
import { HYDREIGHT_BOOKING_URL } from "@/lib/constants";
import { getPageText } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Book Your Mobile IV in Lakewood Ranch",
  description:
    "Book your mobile IV with Shary Gonzalez, RN, BSN. Share your name and email, then choose your drip and time on our secure booking page.",
  path: "/book",
});

export default async function BookPage() {
  const text = await getPageText("book");
  return (
    <>
      <PageHero heading={text.heading} intro={text.intro} />
      <section className="container-page max-w-2xl py-10 md:py-14">
        <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-semibold" aria-label="Booking steps">
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-olive text-cream">1</span>
            Your details <span className="sr-only">(current step)</span>
          </li>
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-sage text-ink">2</span>
            Pick your IV and time
          </li>
          <li>
            <span className="mr-2 inline-grid size-7 place-items-center rounded-full bg-sage text-ink">3</span>
            Shary comes to you
          </li>
        </ol>
        <IntakeForm mode="book" hydreightUrl={HYDREIGHT_BOOKING_URL} />
      </section>
    </>
  );
}
