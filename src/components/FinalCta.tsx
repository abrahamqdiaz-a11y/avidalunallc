import Link from "next/link";

export function FinalCta({
  heading = "Ready to book your appointment?",
  text = "Professional care, personally delivered.",
  secondary,
}: {
  heading?: string;
  text?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="final-cta">
      <div className="container-page band-ink on-ink flex flex-col gap-6 rounded-[var(--radius-card)] px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
        <div>
          <h2 className="text-2xl md:text-3xl">{heading}</h2>
          {text ? <p className="mt-2 text-lg">{text}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary">
            Book an appointment
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="btn border-[1.5px] border-cream text-cream hover:bg-cream/10"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
