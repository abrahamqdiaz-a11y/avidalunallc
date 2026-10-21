import Link from "next/link";
import { CrescentSprig } from "./Icons";

export function FinalCta({
  heading = "Ready when you are.",
  text,
  secondary,
}: {
  heading?: string;
  text?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="band-olive">
      <div className="container-page flex flex-col items-center py-14 text-center md:py-20">
        <CrescentSprig className="size-10" />
        <h2 className="mt-3 text-3xl md:text-5xl">{heading}</h2>
        {text ? <p className="mt-3 text-lg">{text}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary">
            Book your IV
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn border-2 border-cream text-cream hover:bg-cream/10">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
