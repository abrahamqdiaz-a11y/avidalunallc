import type { Metadata } from "next";
import { GroupRequestForm } from "@/components/forms/GroupRequestForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Todo } from "@/components/Todo";
import { WaveDivider } from "@/components/WaveDivider";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import { getPageText, getUpcomingEvents, todayInFlorida } from "@/lib/content";
import { floridaIso, formatEventDate, formatTime } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { EventItem } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Group IV and Wellness Events in Lakewood Ranch",
  description:
    "Bring IV hydration and wellness add-ons to your birthday, bridal party, brunch, office or pop-up event in Lakewood Ranch, FL. Request a group event with Shary.",
  path: "/events",
});

const steps = [
  { title: "Send a request", text: "Tell us the date, the city and about how many guests." },
  { title: "Plan with Shary", text: "She'll reach out to talk through timing, setup and what your group would like." },
  { title: "Shary sets up on site", text: "She arrives, sets up and looks after each guest." },
];

const audiences = [
  "Birthdays",
  "Bridal parties and girls' trips",
  "Brunches and private gatherings",
  "Office and team wellness days",
  "Pop-ups at local businesses",
];

function eventSchema(e: EventItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: floridaIso(e.date, e.startTime),
    ...(e.endTime ? { endDate: floridaIso(e.date, e.endTime) } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: e.place, address: e.place },
    description: e.description,
    organizer: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
    ...(e.image ? { image: e.image.src } : {}),
  };
}

export default async function EventsPage() {
  const [text, events] = await Promise.all([getPageText("events"), getUpcomingEvents()]);
  const s = text.sections;

  return (
    <>
      <PageHero heading={text.heading} intro={text.intro}>
        <a href="#request" className="btn btn-primary mt-7">
          Plan your group event
        </a>
      </PageHero>
      <WaveDivider from="sage" to="cream" />

      <section className="container-page py-12 md:py-16" aria-labelledby="who-heading">
        <h2 id="who-heading" className="text-3xl md:text-4xl">
          Who it&apos;s for
        </h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {audiences.map((a) => (
            <li key={a} className="rounded-full bg-paper px-4 py-2 font-medium shadow-[var(--shadow-soft)]">
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-12 md:pb-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-3xl md:text-4xl">
          {s.how?.heading}
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="card flex gap-4 p-5 md:flex-col md:p-6">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-sage font-serif text-xl text-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Todo className="mt-5 max-w-2xl">
          Group pricing or minimums (only if Shary wants them listed), and how each guest books and is screened on
          Hydreight for a group visit.
        </Todo>
      </section>

      <section className="container-page pb-12 md:pb-16" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="text-3xl md:text-4xl">
          {s.upcoming?.heading}
        </h2>
        {events.length === 0 ? (
          <p className="card mt-5 p-6" data-testid="no-events">
            {s.upcoming?.text}
          </p>
        ) : (
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {events.map((e) => (
              <li key={e.id} className="card p-6">
                <p className="eyebrow">
                  <time dateTime={e.date}>{formatEventDate(e.date)}</time>
                  {e.startTime
                    ? ` · ${formatTime(e.startTime)}${e.endTime ? `–${formatTime(e.endTime)}` : ""}`
                    : ""}
                </p>
                <h3 className="mt-2 text-2xl">{e.title}</h3>
                <p className="mt-1 font-semibold">{e.place}</p>
                <p className="mt-2">{e.description}</p>
                {e.link ? (
                  <a href={e.link} className="mt-3 inline-block font-semibold" rel="noopener">
                    Event details
                  </a>
                ) : null}
                <JsonLd data={eventSchema(e)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="request" className="container-page scroll-mt-24 pb-14 md:pb-20" aria-labelledby="request-heading">
        <div className="max-w-2xl">
          <h2 id="request-heading" className="text-3xl md:text-4xl">
            {s.form?.heading}
          </h2>
          <p className="mt-2">{s.form?.text}</p>
          <div className="mt-6">
            <GroupRequestForm minDate={todayInFlorida()} />
          </div>
        </div>
      </section>
    </>
  );
}
