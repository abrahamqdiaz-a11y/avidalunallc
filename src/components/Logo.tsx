import Link from "next/link";
import { CrescentSprig } from "./Icons";

// TODO: replace with Shary's real logo (/docs/brand/logo.png, ideally an SVG from her designer)
// once it's in the repo: put it at /public/brand/logo.png and set LOGO_SRC below.
const LOGO_SRC: string | null = null;

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const textSize = size === "lg" ? "text-[1.75rem]" : "text-[1.5rem] md:text-[1.625rem]";
  return (
    <Link href="/" className="inline-flex items-center gap-2 no-underline">
      {LOGO_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LOGO_SRC} alt="Avida Luna Wellness, home" width={56} height={56} className="size-14" />
      ) : (
        <>
          <CrescentSprig className="size-10" />
          <span className="flex flex-col leading-none">
            <span className={`font-display font-bold tracking-[-0.02em] ${textSize} text-forest`}>Avida Luna</span>
            <span className="mt-1 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted">NURSE-LED IV CARE</span>
          </span>
          <span className="sr-only"> home</span>
        </>
      )}
    </Link>
  );
}
