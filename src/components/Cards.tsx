import Link from "next/link";
import { formatDuration, formatPrice } from "@/lib/format";
import type { AddOn, Service } from "@/lib/types";
import { PhotoSlot } from "./ArchPhoto";
import { ArrowRightIcon } from "./Icons";
import { Todo } from "./Todo";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card flex flex-col p-5 md:p-6">
      <h3 className="text-2xl">{service.name}</h3>
      <p className="mt-2 flex-1">{service.description}</p>
      {service.showPrice && service.price ? (
        <p className="mt-3 font-semibold">{formatPrice(service.price)}</p>
      ) : null}
      {service.todo ? <Todo className="mt-3">{service.todo}</Todo> : null}
    </article>
  );
}

export function AddOnTeaserCard({ addOn }: { addOn: AddOn }) {
  const duration = formatDuration(addOn.durationMinutes);
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="p-3 pb-0">
        <PhotoSlot image={addOn.image} label={addOn.name} sizes="(min-width: 768px) 320px, 90vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl">{addOn.name}</h3>
        <p className="mt-1 text-[0.9375rem] font-semibold">
          {[duration, formatPrice(addOn.price)].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-2 flex-1">{addOn.description}</p>
        <Link href="/add-ons" className="btn btn-outline mt-4 self-start" aria-label={`Add ${addOn.name}`}>
          Add <ArrowRightIcon />
        </Link>
      </div>
    </article>
  );
}

export function OfferCard({
  title,
  text,
  href,
  linkLabel,
}: {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <article className="card flex flex-col p-5 md:p-6">
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-2 flex-1">{text}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-olive-dark">
        {linkLabel} <ArrowRightIcon />
      </Link>
    </article>
  );
}
