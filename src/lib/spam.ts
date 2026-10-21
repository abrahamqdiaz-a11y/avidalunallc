import "server-only";

// Spam protection with no third-party scripts:
//  1. a honeypot field real people never see or fill,
//  2. a minimum time between opening the form and sending it,
//  3. a per-IP rate limit.
// The rate limit lives in memory, so it's per server instance. That's enough to
// slow down a script hammering one form; it is not a hard global limit.

const MIN_FILL_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Returns true when this IP has sent too many requests to this route recently. */
export function isRateLimited(req: Request, route: string, max = MAX_PER_WINDOW): boolean {
  const key = `${route}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    // Keep memory bounded on a long-lived instance.
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > max;
}

/** True when the submission looks automated. Callers answer "ok" without doing anything. */
export function looksLikeSpam({ website, startedAt }: { website?: string; startedAt: number }): boolean {
  if (website) return true;
  const elapsed = Date.now() - startedAt;
  return !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS || elapsed > 24 * 60 * 60 * 1000;
}
