import type { Metadata } from "next";
import { AddOnPicker } from "@/components/AddOnPicker";
import { getAddOns } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Checkout cancelled",
  description: "No charge was made.",
  path: "/add-ons/cancel",
  noindex: true,
});

export default async function CancelPage() {
  const addOns = await getAddOns();
  return (
    <section className="container-page py-10 md:py-14">
      <div className="card mb-8 p-6 md:p-8" role="status">
        <h1 className="text-3xl md:text-4xl">No charge was made.</h1>
        <p className="mt-2">Your selections are saved below. You can pay now, or add them at your visit.</p>
      </div>
      <AddOnPicker addOns={addOns} paymentsEnabled={paymentsEnabled()} />
    </section>
  );
}
