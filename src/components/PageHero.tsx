import { CrescentSprig } from "./Icons";

/** Simple page header for inner pages: sage band, heading, intro. */
export function PageHero({
  eyebrow,
  heading,
  intro,
  children,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="band-sage on-sage">
      <div className="container-page py-12 md:py-16">
        <CrescentSprig className="mb-3 size-9" />
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-1 text-4xl md:text-5xl">{heading}</h1>
        {intro ? <p className="prose-width mt-4 text-lg">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
