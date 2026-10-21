import Link from "next/link";
import { CrescentSprig } from "./Icons";

// TODO: replace with Shary's real logo (/docs/brand/logo.png, ideally an SVG from her designer)
// once it's in the repo: put it at /public/brand/logo.png and set LOGO_SRC below.
const LOGO_SRC: string | null = null;

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const textSize = size === "lg" ? "text-2xl" : "text-xl";
  return (
    <Link href="/" className="inline-flex items-center gap-2 no-underline" aria-label="Avida Luna Wellness, home">
      {LOGO_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LOGO_SRC} alt="" width={56} height={56} className="size-14" />
      ) : (
        <>
          <CrescentSprig className="size-9" />
          <span className="flex flex-col leading-none">
            <span className={`font-serif ${textSize} text-olive`}>Avida Luna</span>
            <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.3em] text-olive-dark">WELLNESS</span>
          </span>
        </>
      )}
    </Link>
  );
}
