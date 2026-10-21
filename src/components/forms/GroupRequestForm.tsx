"use client";

import { useEffect, useRef, useState } from "react";
import { eventTypes, fieldErrors, groupRequestSchema, groupSizes } from "@/lib/validation";
import { CheckboxField, FormError, Honeypot, SelectField, TextAreaField, TextField } from "./fields";
import { postJson, readForm } from "./submit";
import { useStartedAt } from "./useGuard";

export function GroupRequestForm({ minDate }: { minDate: string }) {
  const startedAt = useStartedAt();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const { str, bool } = readForm(e.currentTarget);
    const payload = {
      name: str("name"),
      email: str("email"),
      phone: str("phone"),
      eventDate: str("eventDate"),
      city: str("city"),
      groupSize: str("groupSize"),
      eventType: str("eventType"),
      note: str("note"),
      optIn: bool("optIn"),
      website: str("website"),
      startedAt: startedAt.current,
    };
    const parsed = groupRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setPending(true);
    const result = await postJson("/api/group-request", payload);
    setPending(false);
    if (result.ok) setDone(true);
    else {
      setErrors(result.fields ?? {});
      setFormError(result.error);
    }
  }

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="card p-6 outline-none md:p-8" data-testid="group-success">
        <h2 className="text-3xl">Request sent.</h2>
        <p className="mt-3">Thank you. Shary will reach out to plan your event.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-6 md:p-8" aria-label="Group event request">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Name" required autoComplete="name" error={errors.name} />
        <TextField name="email" type="email" label="Email" required autoComplete="email" error={errors.email} />
        <TextField name="phone" type="tel" label="Phone" autoComplete="tel" maxLength={25} error={errors.phone} />
        <TextField name="eventDate" type="date" label="Event date" required min={minDate} error={errors.eventDate} />
        <TextField name="city" label="City" required autoComplete="address-level2" maxLength={80} error={errors.city} />
        <SelectField
          name="groupSize"
          label="Approximate group size"
          required
          options={groupSizes.map((s) => ({ value: s, label: `${s} guests` }))}
          error={errors.groupSize}
        />
      </div>
      <SelectField
        name="eventType"
        label="Event type"
        required
        options={eventTypes.map((t) => ({ value: t, label: t }))}
        error={errors.eventType}
      />
      <TextAreaField name="note" label="Anything else about your event?" error={errors.note} />
      <CheckboxField
        name="optIn"
        label="Yes, email me Avida Luna news and offers. Unsubscribe anytime."
        error={errors.optIn}
      />
      <FormError message={formError} />
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
