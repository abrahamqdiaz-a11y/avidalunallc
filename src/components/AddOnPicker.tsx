"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatDuration, formatPrice } from "@/lib/format";
import type { AddOn } from "@/lib/types";
import { PhotoSlot } from "./Portrait";
import { atVisitSchema, fieldErrors } from "@/lib/validation";
import { FormError, Honeypot, TextField } from "./forms/fields";
import { HONEYPOT, postJson, readForm, safeSession, session, STORAGE, submitNetlifyForm } from "./forms/submit";
import { CheckIcon, MinusIcon, PlusIcon } from "./Icons";

const MAX = 10;

type Selection = Record<string, number>;

function loadSelection(validIds: Set<string>): Selection {
  try {
    const raw = safeSession()?.getItem(STORAGE.selection);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Selection;
    const out: Selection = {};
    for (const [id, q] of Object.entries(parsed)) {
      if (validIds.has(id) && Number.isInteger(q) && q > 0)
        out[id] = Math.min(MAX, q);
    }
    return out;
  } catch {
    return {};
  }
}

export function AddOnPicker({
  addOns,
  paymentsEnabled,
}: {
  addOns: AddOn[];
  paymentsEnabled: boolean;
}) {
  const [qty, setQty] = useState<Selection>({});
  const [restored, setRestored] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [contact, setContact] = useState({ firstName: "", email: "" });
  const [visitErrors, setVisitErrors] = useState<Record<string, string>>({});
  const [visitError, setVisitError] = useState<string | null>(null);
  const [visitPending, setVisitPending] = useState(false);
  const [visitSent, setVisitSent] = useState(false);

  // Restore the last selection (e.g. after cancelling checkout).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after mount
    setQty(loadSelection(new Set(addOns.map((a) => a.id))));
    setRestored(true);
  }, [addOns]);

  useEffect(() => {
    if (restored)
      safeSession()?.setItem(STORAGE.selection, JSON.stringify(qty));
  }, [qty, restored]);

  const { count, total } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const a of addOns) {
      const q = qty[a.id] ?? 0;
      count += q;
      total += q * a.price;
    }
    return { count, total };
  }, [qty, addOns]);

  function change(id: string, delta: number) {
    setError(null);
    setQty((prev) => {
      const next = Math.max(0, Math.min(MAX, (prev[id] ?? 0) + delta));
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  async function pay() {
    if (count === 0 || pending) return;
    setPending(true);
    setError(null);
    const items = Object.entries(qty).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    const email = session.get(STORAGE.email) ?? "";
    const result = (await postJson("/api/checkout", { items, email })) as
      { ok: true; url?: string } | { ok: false; error: string };
    if (result.ok && "url" in result && result.url) {
      window.location.assign(result.url);
      return;
    }
    setPending(false);
    setError(
      result.ok
        ? "We couldn't start checkout. Please try again."
        : result.error,
    );
  }

  function openAtVisit() {
    if (count === 0) return;
    const session = safeSession();
    setContact({
      firstName: session?.getItem(STORAGE.firstName) ?? "",
      email: session?.getItem(STORAGE.email) ?? "",
    });
    setVisitErrors({});
    setVisitError(null);
    setVisitSent(false);
    dialog.current?.showModal();
  }

  // Sent to Netlify Forms as "add-ons-at-visit", which emails Shary what to bring.
  // Nothing is charged, so the prices here are the ones shown on the page.
  async function sendAtVisit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (visitPending) return;
    const { str } = readForm(e.currentTarget);
    const parsed = atVisitSchema.safeParse({
      items: Object.entries(qty).map(([id, quantity]) => ({ id, quantity })),
      firstName: str("firstName"),
      email: str("email"),
    });
    if (!parsed.success) {
      setVisitErrors(fieldErrors(parsed.error));
      return;
    }
    setVisitErrors({});
    setVisitError(null);
    const chosen = addOns.filter((a) => qty[a.id]);
    setVisitPending(true);
    const sent = await submitNetlifyForm("add-ons-at-visit", {
      firstName: parsed.data.firstName,
      email: parsed.data.email,
      addOns: chosen.map((a) => `${a.name} × ${qty[a.id]}: ${formatPrice(a.price * qty[a.id])}`).join("\n"),
      total: formatPrice(total),
      [HONEYPOT]: str(HONEYPOT),
    });
    setVisitPending(false);
    if (sent) {
      session.set(STORAGE.email, parsed.data.email);
      session.set(STORAGE.firstName, parsed.data.firstName);
      setVisitSent(true);
      setQty({});
    } else {
      setVisitError("Sorry, that didn't send. Please try again, or just tell Shary at your visit.");
    }
  }

  const summaryText = `${count} ${count === 1 ? "add-on" : "add-ons"} · ${formatPrice(total)}`;

  const atVisitButton = (
    <button
      type="button"
      className="btn btn-primary w-full"
      onClick={openAtVisit}
      disabled={count === 0}
      aria-describedby="addon-summary"
    >
      Pay at my visit
    </button>
  );

  const payButton = paymentsEnabled ? (
    <button
      type="button"
      className="btn btn-outline w-full"
      onClick={pay}
      disabled={count === 0 || pending}
      aria-describedby="addon-summary"
    >
      {pending ? "Opening checkout…" : "Pay now by card"}
    </button>
  ) : (
    <p
      className="rounded-xl bg-sage/50 px-4 py-3 text-[0.9375rem]"
      data-testid="payments-off"
    >
      Online payment coming soon. Pay for your add-ons at your visit.
    </p>
  );

  return (
    <div className="addon-layout grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <ul className="addon-list" aria-label="Wellness add-ons">
        {addOns.map((a) => {
          const q = qty[a.id] ?? 0;
          const duration = formatDuration(a.durationMinutes);
          return (
            <li
              key={a.id}
              className="card flex flex-col overflow-hidden"
              data-testid={`addon-${a.id}`}
            >
              {a.image ? (
                <div className="addon-image">
                  <PhotoSlot
                    image={a.image}
                    label={a.name}
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
              ) : null}
              <div className="addon-item-body flex flex-1 flex-col p-5">
                <h2 className="text-2xl">{a.name}</h2>
                <p className="mt-1 text-[0.9375rem] font-semibold">
                  {[duration, formatPrice(a.price)].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 flex-1">{a.description}</p>
                <div
                  className="mt-4 flex items-center gap-3"
                  role="group"
                  aria-label={`${a.name} quantity`}
                >
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-md border-[1.5px] border-olive text-olive-dark disabled:opacity-40"
                    onClick={() => change(a.id, -1)}
                    disabled={q === 0}
                    aria-label={`Remove one ${a.name}`}
                  >
                    <MinusIcon />
                  </button>
                  <output
                    className="w-8 text-center text-lg font-semibold"
                    aria-live="polite"
                    aria-label={`${a.name}: ${q}`}
                  >
                    {q}
                  </output>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-md border-[1.5px] border-olive text-olive-dark disabled:opacity-40"
                    onClick={() => change(a.id, 1)}
                    disabled={q >= MAX}
                    aria-label={`Add one ${a.name}`}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop summary card */}
      <aside
        className="card sticky top-28 hidden p-6 lg:block"
        aria-label="Your add-ons"
      >
        <p className="eyebrow mb-3">YOUR SELECTION</p>
        <h2 className="text-2xl">Your add-ons</h2>
        {count === 0 ? (
          <p className="mt-3">
            Nothing added yet. Choose an optional add-on to see your total.
          </p>
        ) : (
          <ul className="mt-3 space-y-1">
            {addOns
              .filter((a) => qty[a.id])
              .map((a) => (
                <li key={a.id} className="flex justify-between gap-3">
                  <span>
                    {a.name} × {qty[a.id]}
                  </span>
                  <span>{formatPrice(a.price * (qty[a.id] ?? 0))}</span>
                </li>
              ))}
          </ul>
        )}
        <p
          id="addon-summary"
          className="mt-4 border-t border-olive/15 pt-4 font-semibold"
          aria-live="polite"
        >
          {summaryText}
        </p>
        <div className="mt-4 space-y-3">
          {atVisitButton}
          {payButton}
        </div>
        <p className="mt-3 text-[0.9375rem] text-muted">
          At your visit, Shary takes tap-to-pay or card.
        </p>
        <div className="mt-3">
          <FormError message={error} />
        </div>
      </aside>

      {/* Mobile sticky summary bar */}
      <div aria-hidden className="h-24 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-olive/15 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-md">
          {error ? (
            <div className="mb-2">
              <FormError message={error} />
            </div>
          ) : null}
          <p className="mb-2 font-semibold" aria-hidden>
            {summaryText}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">{atVisitButton}</div>
            <div className="flex-1">{payButton}</div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="addon-dialog card p-6 md:p-8"
        aria-labelledby="at-visit-heading"
        data-testid="at-visit-dialog"
      >
        {visitSent ? (
          <div>
            <span className="grid size-12 place-items-center rounded-full bg-sage text-ink">
              <CheckIcon className="size-6" />
            </span>
            <h2 id="at-visit-heading" className="mt-4 text-3xl">
              You&apos;re all set.
            </h2>
            <p className="mt-2">
              Shary will bring your add-ons to your appointment. Pay at your
              visit by tapping your card or phone.
            </p>
            <button
              type="button"
              className="btn btn-primary mt-6 w-full"
              onClick={() => dialog.current?.close()}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={sendAtVisit} noValidate className="space-y-5">
            <div>
              <p className="eyebrow mb-3">PAY AT MY VISIT</p>
              <h2 id="at-visit-heading" className="text-3xl">
                Who should Shary bring these for?
              </h2>
              <p className="mt-2 text-[0.9375rem]">
                {summaryText}. Use the same email you booked with. Nothing is
                charged now.
              </p>
            </div>
            <Honeypot />
            <TextField
              key={`n-${contact.firstName}`}
              name="firstName"
              label="First name"
              required
              autoComplete="given-name"
              defaultValue={contact.firstName}
              error={visitErrors.firstName}
            />
            <TextField
              key={`e-${contact.email}`}
              name="email"
              type="email"
              label="Email"
              required
              autoComplete="email"
              inputMode="email"
              defaultValue={contact.email}
              error={visitErrors.email}
            />
            <FormError message={visitError} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={visitPending}
              >
                {visitPending ? "Sending…" : "Confirm add-ons"}
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => dialog.current?.close()}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
