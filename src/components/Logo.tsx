import Link from "next/link";

// Shary's real logo files live in /public/brand/ (see the README there). next.config.ts
// detects them at build time. Until then, the plain brand name stands in. No mark, no tagline.
const LOGO = process.env.BRAND_LOGO;
const LOGO_HORIZONTAL = process.env.BRAND_LOGO_HORIZONTAL;

export function Logo({ placement = "header" }: { placement?: "header" | "footer" }) {
  const src = placement === "header" ? LOGO_HORIZONTAL || LOGO : LOGO;
  const isWide = placement === "header" && Boolean(LOGO_HORIZONTAL);

  if (src) {
    const img = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Avida Luna Wellness, home"
        className={isWide ? "h-12 w-auto md:h-14" : placement === "header" ? "h-14 w-auto md:h-16" : "h-20 w-auto"}
      />
    );
    return (
      <Link href="/" className="inline-flex items-center no-underline">
        {placement === "footer" ? <span className="rounded-lg bg-cream p-3">{img}</span> : img}
      </Link>
    );
  }

  const tone = placement === "footer" ? "text-cream" : "text-olive";
  return (
    <Link href="/" className="inline-flex flex-col leading-none no-underline">
      <span className={`font-display text-[1.625rem] font-semibold tracking-[-0.01em] md:text-[1.75rem] ${tone}`}>
        Avida Luna
      </span>
      <span className={`mt-1 text-[0.6875rem] font-semibold tracking-[0.32em] ${tone}`}>WELLNESS</span>
      <span className="sr-only"> home</span>
    </Link>
  );
}
