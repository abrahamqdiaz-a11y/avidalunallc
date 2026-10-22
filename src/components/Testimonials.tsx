import type { Testimonial } from "@/lib/types";
import { Todo } from "./Todo";

const showTodos = process.env.NEXT_PUBLIC_HIDE_TODOS !== "1";

/**
 * Only real testimonials with written permission are shown. Until one exists, the section shows
 * empty placeholder cards and a TODO (both disappear when TODOs are hidden for launch).
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length && !showTodos) return null;
  return (
    <section className="container-page pb-14 md:pb-20" aria-labelledby="testimonials-heading">
      <p className="eyebrow">Patient experiences</p>
      <h2 id="testimonials-heading" className="mt-2 text-3xl md:text-4xl">
        What patients say
      </h2>
      {items.length ? (
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <li key={t.id} className="card p-6 md:p-7">
              <figure>
                <blockquote className="text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-[0.9375rem] font-semibold text-olive">{t.firstName}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div aria-hidden className="mt-8 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card space-y-3 p-6">
                <div className="h-3 w-11/12 rounded bg-line" />
                <div className="h-3 w-10/12 rounded bg-line" />
                <div className="h-3 w-7/12 rounded bg-line" />
                <div className="mt-5 h-3 w-1/4 rounded bg-line" />
              </div>
            ))}
          </div>
          <Todo className="mt-5 max-w-2xl">
            Add 2 to 4 real testimonials with written permission (Sanity: Testimonials). Never invent or paraphrase
            reviews.
          </Todo>
        </>
      )}
    </section>
  );
}
