"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDuration, formatPrice } from "@/lib/format";
import type { AddOn } from "@/lib/types";
import { PhotoSlot } from "./Portrait";
import { FormError } from "./forms/fields";
import { postJson, safeSession, STORAGE } from "./forms/submit";
import { MinusIcon, PlusIcon } from "./Icons";

const MAX = 10;

type Selection = Record<string, number>;

function loadSelection(validIds: Set<string>): Selection {
  try {
    const raw = safeSession()?.getItem(STORAGE.selection);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Selection;
    const out: Selection = {};
    for (const [id, q] of Object.entries(parsed)) {
      if (validIds.has(id) && Number.isInteger(q) && q > 0) out[id] = Math.min(MAX, q);
    }
    return out;
  } catch {
    return {};
  }
}

export function AddOnPicker({ addOns, paymentsEnabled }: { addOns: AddOn[]; paymentsEnabled: boolean }) {
  const [qty, setQty] = useState<Selection>({});
  const [restored, setRestored] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore the last selection (e.g. after cancelling checkout).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after mount
    setQty(loadSelection(new Set(addOns.map((a) => a.id))));
    setRestored(true);
  }, [addOns]);

  useEffect(() => {
    if (restored) safeSession()?.setItem(STORAGE.selection, JSON.stringify(qty));
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
    const items = Object.entries(qty).map(([id, quantity]) => ({ id, quantity }));
    const email = safeSession()?.getItem(STORAGE.email) ?? "";
    const result = (await postJson("/api/checkout", { items, email })) as
      | { ok: true; url?: string }
      | { ok: false; error: string };
    if (result.ok && "url" in result && result.url) {
      window.location.assign(result.url);
      return;
    }
    setPending(false);
    setError(result.ok ? "We couldn't start checkout. Please try again." : result.error);
  }

  const summaryText = `${count} ${count === 1 ? "add-on" : "add-ons"} · ${formatPrice(total)}`;

  const payButton = paymentsEnabled ? (
    <button
      type="button"
      className="btn btn-primary w-full"
      onClick={pay}
      disabled={count === 0 || pending}
      aria-describedby="addon-summary"
    >
      {pending ? "Opening checkout…" : "Pay now"}
    </button>
  ) : (
    <p className="rounded-xl bg-sage/50 px-4 py-3 text-[0.9375rem]" data-testid="payments-off">
      Online payment coming soon. Add your add-ons at your visit.
    </p>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <ul className="grid gap-5 sm:grid-cols-2" aria-label="Wellness add-ons">
        {addOns.map((a) => {
          const q = qty[a.id] ?? 0;
          const duration = formatDuration(a.durationMinutes);
          return (
            <li key={a.id} className="card flex flex-col overflow-hidden" data-testid={`addon-${a.id}`}>
              <div className="p-3 pb-0">
                <PhotoSlot image={a.image} label={a.name} sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-2xl">{a.name}</h2>
                <p className="mt-1 text-[0.9375rem] font-semibold">
                  {[duration, formatPrice(a.price)].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 flex-1">{a.description}</p>
                <div className="mt-4 flex items-center gap-3" role="group" aria-label={`${a.name} quantity`}>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-md border-[1.5px] border-olive text-olive-dark disabled:opacity-40"
                    onClick={() => change(a.id, -1)}
                    disabled={q === 0}
                    aria-label={`Remove one ${a.name}`}
                  >
                    <MinusIcon />
                  </button>
                  <output className="w-8 text-center text-lg font-semibold" aria-live="polite" aria-label={`${a.name}: ${q}`}>
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
      <aside className="card sticky top-28 hidden p-6 lg:block" aria-label="Your add-ons">
        <h2 className="text-2xl">Your add-ons</h2>
        {count === 0 ? (
          <p className="mt-3">Nothing added yet.</p>
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
        <p id="addon-summary" className="mt-4 border-t border-olive/15 pt-4 font-semibold" aria-live="polite">
          {summaryText}
        </p>
        <div className="mt-4">{payButton}</div>
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
          <div className="flex items-center gap-3">
            <p className="shrink-0 font-semibold" aria-hidden>
              {summaryText}
            </p>
            <div className="flex-1">{payButton}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
