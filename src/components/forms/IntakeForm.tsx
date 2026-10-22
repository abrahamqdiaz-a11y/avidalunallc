"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExternalIcon } from "@/components/Icons";
import { NO_MEDICAL_INFO_NOTE } from "@/lib/constants";
import { fieldErrors, intakeSchema, joinSchema } from "@/lib/validation";
import { CheckboxField, FormError, Honeypot, SelectField, TextField } from "./fields";
import { postJson, readForm, safeSession, STORAGE } from "./submit";
import { useStartedAt } from "./useGuard";

type Mode = "book" | "join";

const OPT_IN_LABEL = "Yes, email me Avida Luna news and offers. Unsubscribe anytime.";

/**
 * The intake form used on /book (opt-in optional) and /join (opt-in required).
 * Name, email, optional phone and an opt-in. Nothing else, and no health questions.
 */
export function IntakeForm({
  mode,
  hydreightUrl,
  events = [],
}: {
  mode: Mode;
  hydreightUrl: string;
  events?: { slug: string; title: string }[];
}) {
  const startedAt = useStartedAt();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const { str, bool } = readForm(e.currentTarget);
    const payload = {
      firstName: str("firstName"),
      lastName: str("lastName"),
      email: str("email"),
      phone: str("phone"),
      optIn: bool("optIn"),
      website: str("website"),
      startedAt: startedAt.current,
      ...(mode === "join" ? { eventSlug: str("eventSlug") } : {}),
    };

    const schema = mode === "join" ? joinSchema : intakeSchema;
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});

    if (mode === "book") {
      // Show the booking button right away. The intake request runs in the background;
      // Mailchimp problems are handled on the server and never block booking.
      safeSession()?.setItem(STORAGE.email, parsed.data.email);
      setDone(true);
      void postJson("/api/intake", payload);
      return;
    }

    setPending(true);
    const result = await postJson("/api/join", payload);
    setPending(false);
    if (result.ok) {
      safeSession()?.setItem(STORAGE.email, parsed.data.email);
      setDone(true);
    } else {
      setErrors(result.fields ?? {});
      setFormError(result.error);
    }
  }

  if (done && mode === "book") {
    return (
      <div ref={successRef} tabIndex={-1} className="card p-6 outline-none md:p-8" data-testid="book-success">
        <h2 className="text-3xl">Thank you. Next, choose your service and time.</h2>
        <p className="mt-3">
          Our secure booking page (powered by Hydreight) opens in a new tab. That&apos;s where you pick your service,
          choose a time and complete a short screening.
        </p>
        <a
          href={hydreightUrl}
          target="_blank"
          rel="noopener"
          className="btn btn-primary mt-6 w-full text-lg sm:w-auto"
          data-testid="hydreight-button"
        >
          Continue to secure booking <ExternalIcon />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <p className="mt-4 text-[0.9375rem]">
          If it didn&apos;t open, use this link:{" "}
          <a href={hydreightUrl} target="_blank" rel="noopener" className="break-all">
            {hydreightUrl.replace(/^https:\/\//, "")}
          </a>
        </p>
        <div className="mt-6 border-t border-forest/15 pt-5">
          <p>
            After you book, you can add an optional wellness add-on like red light or aromatherapy.{" "}
            <Link href="/add-ons" className="font-semibold">
              See add-ons
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (done && mode === "join") {
    return (
      <div ref={successRef} tabIndex={-1} className="card p-6 outline-none md:p-8" data-testid="join-success">
        <h2 className="text-3xl">You&apos;re on the list.</h2>
        <p className="mt-3">Thanks for joining. Watch your inbox for event news and offers from Shary.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-primary">
            Book an appointment
          </Link>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-6 md:p-8">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="firstName" label="First name" required autoComplete="given-name" error={errors.firstName} />
        <TextField name="lastName" label="Last name" required autoComplete="family-name" error={errors.lastName} />
      </div>
      <TextField
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="email"
        inputMode="email"
        error={errors.email}
      />
      <TextField
        name="phone"
        type="tel"
        label="Phone"
        autoComplete="tel"
        inputMode="tel"
        maxLength={25}
        error={errors.phone}
      />
      {mode === "join" && events.length ? (
        <SelectField
          name="eventSlug"
          label="Which event?"
          placeholder="Not sure / no event"
          options={events.map((e) => ({ value: e.slug, label: e.title }))}
          error={errors.eventSlug}
        />
      ) : null}
      <CheckboxField
        name="optIn"
        label={mode === "join" ? "Yes, email me Avida Luna event news and offers. Unsubscribe anytime." : OPT_IN_LABEL}
        required={mode === "join"}
        error={errors.optIn}
      />
      <FormError message={formError} />
      <button type="submit" className="btn btn-primary w-full text-lg" disabled={pending}>
        {mode === "book" ? "Continue" : pending ? "Joining…" : "Join the list"}
      </button>
      <p className="text-[0.9375rem] text-[#5a6150]">
        {NO_MEDICAL_INFO_NOTE} Health screening happens privately on our secure booking page. We only email you if
        you tick the box. See our <Link href="/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
