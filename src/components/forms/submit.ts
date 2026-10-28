export type SubmitResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string> };

export async function postJson(url: string, body: unknown): Promise<SubmitResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => null)) as SubmitResult | null;
    if (data && typeof data.ok === "boolean") return data;
    return { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "We couldn't reach the server. Check your connection and try again." };
  }
}

export function readForm(form: HTMLFormElement) {
  const fd = new FormData(form);
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const bool = (k: string) => fd.get(k) === "on";
  return { str, bool };
}

/** Keys for sessionStorage. Never put personal data in URLs. */
export const STORAGE = {
  email: "avidaluna:email",
  firstName: "avidaluna:firstName",
  selection: "avidaluna:addons",
  /** Booking step to restore on refresh: "book" (step 2) or "addons" (step 3). */
  step: "avidaluna:step",
  /** Set when "Book now" was clicked, so coming back to the tab opens step 3. */
  bookClicked: "avidaluna:bookClicked",
  /** Resend id of the scheduled follow-up email, so add-on checkout can cancel it. */
  followUpId: "avidaluna:followUpId",
} as const;

/** sessionStorage reads and writes that never throw (private mode, blocked storage). */
export const session = {
  get(key: string): string | null {
    try {
      return safeSession()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      safeSession()?.setItem(key, value);
    } catch {
      // Storage full or blocked: the in-memory state still works for this visit.
    }
  },
};

export function safeSession() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
