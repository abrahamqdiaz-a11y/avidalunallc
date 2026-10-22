import type { Testimonial } from "@/lib/types";
import { Todo } from "./Todo";

/** Only real testimonials with written permission are shown. Until one exists, the section shows a TODO. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) {
    return (
      <section className="container-page pb-14 md:pb-20" aria-label="Patient experiences">
        <Todo className="max-w-2xl">
          Patient experiences: add 2 to 4 real testimonials with written permission (Sanity: Testimonials). The section
          appears once one is published. Never invent or paraphrase reviews.
        </Todo>
      </section>
    );
  }
  return (
    <section className="container-page pb-14 md:pb-20" aria-labelledby="testimonials-heading">
      <p className="eyebrow">Patient experiences</p>
      <h2 id="testimonials-heading" className="mt-2 text-3xl md:text-4xl">
        What patients say
      </h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((t) => (
          <li key={t.id} className="card p-6 md:p-8">
            <figure>
              <blockquote className="text-lg text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-[0.9375rem] font-semibold text-forest">{t.firstName}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
