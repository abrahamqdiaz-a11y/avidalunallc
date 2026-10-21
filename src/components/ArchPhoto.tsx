import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { Todo } from "./Todo";

/** Arched frame for Shary's photo. Shows a neutral placeholder until a real photo exists. */
export function ArchPhoto({
  image,
  priority = false,
  caption,
  sizes = "(min-width: 768px) 380px, 80vw",
}: {
  image: ImageRef;
  priority?: boolean;
  caption?: React.ReactNode;
  sizes?: string;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[16rem] md:max-w-[22rem]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] border-4 border-paper bg-moon shadow-[var(--shadow-soft)]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-moon to-sage p-6 text-center">
            <span className="text-sm font-semibold text-ink">Photo of Shary coming soon</span>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="card absolute -bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 px-4 py-2 text-center text-sm">
          {caption}
        </figcaption>
      ) : null}
      {!image ? <Todo className="mt-12">Shary&apos;s photo (start with SharyPic.jpg from the current site).</Todo> : null}
    </figure>
  );
}

/** Neutral block for a card photo we don't have yet. Never stock photos of patients, needles or IV bags. */
export function PhotoSlot({ image, label, sizes }: { image: ImageRef; label: string; sizes: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-moon/60">
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-moon/70 to-sage/70">
          <span className="sr-only">{label}: photo coming soon</span>
          <svg viewBox="0 0 48 48" className="size-10 text-olive/60" aria-hidden>
            <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}
    </div>
  );
}
