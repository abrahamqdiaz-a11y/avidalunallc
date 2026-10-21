export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatDuration(minutes: number | null): string | null {
  return minutes ? `${minutes} min` : null;
}

export function formatEventDate(date: string): string {
  // Dates are plain calendar dates in Florida; noon avoids timezone edge cases.
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(`${date}T12:00:00-05:00`));
}

export function formatTime(time: string | null): string | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

/** "2026-11-20" + "18:30" -> "2026-11-20T18:30:00-05:00" using Florida's offset on that date. */
export function floridaIso(date: string, time: string | null): string {
  if (!time) return date;
  const probe = new Date(`${date}T12:00:00Z`);
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "longOffset" })
      .formatToParts(probe)
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "-05:00";
  return `${date}T${time}:00${offset}`;
}
