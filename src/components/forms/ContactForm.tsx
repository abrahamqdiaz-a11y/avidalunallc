"use client";

import { useEffect, useRef, useState } from "react";
import { contactSchema, contactTopics, fieldErrors } from "@/lib/validation";
import { CheckboxField, FormError, Honeypot, SelectField, TextAreaField, TextField } from "./fields";
import { postJson, readForm } from "./submit";
import { useStartedAt } from "./useGuard";

export function ContactForm() {
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
      topic: str("topic"),
      message: str("message"),
      optIn: bool("optIn"),
      website: str("website"),
      startedAt: startedAt.current,
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setPending(true);
    const result = await postJson("/api/contact", payload);
    setPending(false);
    if (result.ok) setDone(true);
    else {
      setErrors(result.fields ?? {});
      setFormError(result.error);
    }
  }

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="card p-6 outline-none md:p-8" data-testid="contact-success">
        <h2 className="text-3xl">Thank you.</h2>
        <p className="mt-3">Your message is on its way to Shary. She&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-6 md:p-8" aria-label="Contact form">
      <Honeypot />
      <TextField name="name" label="Name" required autoComplete="name" error={errors.name} />
      <TextField name="email" type="email" label="Email" required autoComplete="email" error={errors.email} />
      <TextField name="phone" type="tel" label="Phone" autoComplete="tel" maxLength={25} error={errors.phone} />
      <SelectField
        name="topic"
        label="Topic"
        required
        options={contactTopics.map((t) => ({ value: t, label: t }))}
        error={errors.topic}
      />
      <TextAreaField name="message" label="Your message" required error={errors.message} />
      <CheckboxField
        name="optIn"
        label="Yes, email me Avida Luna news and offers. Unsubscribe anytime."
        error={errors.optIn}
      />
      <FormError message={formError} />
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
