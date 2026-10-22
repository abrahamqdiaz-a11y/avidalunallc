import Link from "next/link";

export function FinalCta({
  heading = "Professional care, personally delivered.",
  text,
  secondary,
}: {
  heading?: string;
  text?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="band-forest on-forest">
      <div className="container-page flex flex-col items-center py-14 text-center md:py-20">
        <h2 className="text-3xl md:text-[2.75rem]">{heading}</h2>
        {text ? <p className="prose-width mt-3 text-lg">{text}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary">
            Book an appointment
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn border-[1.5px] border-canvas text-canvas hover:bg-canvas/10">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
