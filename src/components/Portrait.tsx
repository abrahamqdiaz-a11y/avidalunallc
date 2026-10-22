import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { Todo } from "./Todo";

// Shary's photos from /public/brand/ (detected in next.config.ts). A Sanity image passed in wins.
const PORTRAITS = {
  main: process.env.BRAND_PORTRAIT,
  alt: process.env.BRAND_PORTRAIT_ALT || process.env.BRAND_PORTRAIT,
};
const PORTRAIT_ALT = "Shary Gonzalez, RN, BSN, founder of Avida Luna Wellness";

/** Clean, unframed portrait of Shary. Shows a neutral placeholder until a professional photo exists. */
export function Portrait({
  image: imageProp = null,
  variant = "main",
  priority = false,
  caption,
  sizes = "(min-width: 768px) 420px, 90vw",
}: {
  image?: ImageRef;
  variant?: keyof typeof PORTRAITS;
  priority?: boolean;
  caption?: React.ReactNode;
  sizes?: string;
}) {
  const fileSrc = PORTRAITS[variant];
  const image = imageProp ?? (fileSrc ? { src: fileSrc, alt: PORTRAIT_ALT } : null);
  return (
    <figure className="mx-auto w-full max-w-[22rem] md:max-w-[26rem]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-sage">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-cream to-line p-6 text-center">
            <span className="text-sm font-semibold text-ink">Professional portrait of Shary coming soon</span>
          </div>
        )}
      </div>
      {caption ? <figcaption className="mt-3 text-[0.9375rem] text-muted">{caption}</figcaption> : null}
      {!image ? (
        <Todo className="mt-4">
          New professional portrait of Shary: well lit, clinical or neutral interior, high resolution. No interface
          overlays on the photo.
        </Todo>
      ) : null}
    </figure>
  );
}

/** Neutral block for a card photo we don't have yet. Never stock photos of patients, needles or IV bags. */
export function PhotoSlot({ image, label, sizes }: { image: ImageRef; label: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[0.5rem] bg-sage ${image ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cream to-line">
          <span className="sr-only">{label}: photo coming soon</span>
          <svg viewBox="0 0 48 48" className="size-10 text-olive/40" aria-hidden>
            <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}
    </div>
  );
}
