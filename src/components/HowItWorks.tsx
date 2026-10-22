import Link from "next/link";
import { Todo } from "./Todo";

const steps = [
  {
    label: "Request",
    title: "Request an appointment",
    text: "Share your name and email, then choose your service and a time on our secure booking page, powered by Hydreight.",
  },
  {
    label: "Assessment",
    title: "Health screening and assessment",
    text: "You complete a confidential health screening when you book. Before your IV starts, Shary reviews it with you and checks that IV hydration is a good fit.",
  },
  {
    label: "Visit",
    title: "Your nurse comes to you",
    text: "Shary arrives at your home, office or event in the Lakewood Ranch area and stays with you for the whole visit.",
  },
];

export function HowItWorks({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <ol className={`grid gap-4 ${compact ? "md:grid-cols-3" : "md:grid-cols-3 md:gap-6"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="card flex gap-4 p-5 md:flex-col md:p-6">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-md bg-forest font-display text-lg font-semibold text-white"
            >
              {i + 1}
            </span>
            <div>
              <p aria-hidden className="eyebrow">
                {s.label}
              </p>
              <h3 className="mt-1 text-lg">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-1 text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Todo className="mt-5 max-w-2xl">
        Shary to confirm the assessment step wording: what Hydreight screens for and what she checks in person before
        starting an IV.
      </Todo>
      {compact ? null : (
        <p className="mt-5 text-muted">
          Optional <Link href="/add-ons">wellness add-ons</Link>, like red light or aromatherapy, can be added after you
          book.
        </p>
      )}
    </div>
  );
}
