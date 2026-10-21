import Link from "next/link";

const steps = [
  {
    title: "Share your name and email",
    text: "It takes about 30 seconds.",
  },
  {
    title: "Book your IV",
    text: "Pick your drip and a time on our secure booking page, powered by Hydreight.",
  },
  {
    title: "Shary comes to you",
    text: "At your home, office or event in the Lakewood Ranch area.",
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
              className="grid size-10 shrink-0 place-items-center rounded-full bg-sage font-serif text-xl text-ink"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-sans text-lg font-semibold text-ink">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-1">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5">
        Optional: <Link href="/add-ons">add a wellness ritual</Link> like red light or aromatherapy after you book.
      </p>
    </div>
  );
}
