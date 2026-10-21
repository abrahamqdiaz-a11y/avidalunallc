import type { Faq } from "@/lib/types";
import { PlusIcon } from "./Icons";
import { Todo } from "./Todo";

/** Accessible accordion built on native <details>, so it works without JavaScript. */
export function FaqList({ faqs, headingLevel = "h3" }: { faqs: Faq[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="accordion divide-y divide-olive/15 rounded-[var(--radius-card)] bg-paper shadow-[var(--shadow-soft)]">
      {faqs.map((f) => (
        <details key={f.id} className="group px-5 md:px-6">
          <summary className="flex items-center justify-between gap-4 py-5">
            <H className="font-sans text-lg font-semibold text-ink">{f.question}</H>
            <PlusIcon className="chev size-5 shrink-0 text-olive" />
          </summary>
          <div className="prose-width pb-5">
            <p>{f.answer}</p>
            {f.todo ? <Todo className="mt-3">{f.todo}</Todo> : null}
          </div>
        </details>
      ))}
    </div>
  );
}
