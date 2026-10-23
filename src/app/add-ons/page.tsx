import type { Metadata } from "next";
import Link from "next/link";
import { AddOnPicker } from "@/components/AddOnPicker";
import { PageHero } from "@/components/PageHero";
import { Todo } from "@/components/Todo";
import { getAddOns, getPageText } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Red Light & Aromatherapy IV Add-ons | Avida Luna Wellness",
  description:
    "Add red light therapy or aromatherapy to your mobile IV appointment in Lakewood Ranch or Sarasota. Optional extras after you book. Pay online or at your visit.",
  path: "/add-ons",
});

export default async function AddOnsPage() {
  const [text, addOns] = await Promise.all([
    getPageText("addons"),
    getAddOns(),
  ]);
  const todos = addOns.filter((a) => a.todo);
  return (
    <>
      <PageHero
        eyebrow="After you book"
        heading={text.heading}
        intro={text.intro}
      >
        <p className="mt-3 text-[0.9375rem]">
          Haven&apos;t booked yet?{" "}
          <Link href="/book">Book an appointment first</Link>.
        </p>
      </PageHero>
      <section className="container-page py-10 md:py-14">
        <AddOnPicker addOns={addOns} paymentsEnabled={paymentsEnabled()} />
        {todos.map((a) => (
          <Todo key={a.id} className="mt-6 max-w-2xl">
            {a.todo}
          </Todo>
        ))}
      </section>
    </>
  );
}
