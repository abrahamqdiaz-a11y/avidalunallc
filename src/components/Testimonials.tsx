import type { Testimonial } from "@/lib/types";

/** Hidden until at least one visible testimonial with written permission exists in Sanity. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="container-page pb-14 md:pb-20" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="text-3xl md:text-4xl">
        Kind words
      </h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map((t) => (
          <li key={t.id} className="card p-6">
            <figure>
              <blockquote className="font-serif text-xl text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 font-semibold">{t.firstName}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
