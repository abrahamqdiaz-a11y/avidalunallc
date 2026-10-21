import "server-only";
import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16 * 1024;

/** Reads a small JSON body. Returns null for anything too large or not JSON. */
export async function readJson(req: Request): Promise<unknown | null> {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const noStore = { "Cache-Control": "no-store" };

export function ok(body: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...body }, { headers: noStore });
}

export function fail(status: number, error: string, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, error, ...(fields ? { fields } : {}) }, { status, headers: noStore });
}
