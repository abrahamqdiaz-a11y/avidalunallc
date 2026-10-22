import "server-only";
import { getAddOnsForCheckout } from "../content";
import { MAX_ADDON_QUANTITY } from "../validation";
import { stripeClient, stripeProvider } from "./stripe";
import type { AddOnPaymentProvider, CheckoutSession, PricedLine } from "./types";

export type { PaidSummary } from "./types";

/** Swap this to change processors. Everything else talks to the interface. */
const provider: AddOnPaymentProvider = stripeProvider;

export const paymentsEnabled = () => stripeClient() !== null;

export class CheckoutError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/**
 * Prices the requested add-ons from Sanity (live read) and opens a hosted checkout.
 * Prices come only from the server, so the price shown and the price charged always match.
 */
export async function createAddOnCheckout(
  items: { id: string; quantity: number }[],
  email: string | undefined,
  urls: { successUrl: string; cancelUrl: string },
): Promise<CheckoutSession> {
  const wanted = new Map<string, number>();
  for (const { id, quantity } of items) {
    if (quantity > 0) wanted.set(id, Math.min(MAX_ADDON_QUANTITY, (wanted.get(id) ?? 0) + quantity));
  }
  if (wanted.size === 0) throw new CheckoutError("Please choose at least one add-on.", 400);

  const addOns = await getAddOnsForCheckout([...wanted.keys()]);
  if (addOns.length !== wanted.size) {
    throw new CheckoutError("Some of these add-ons are no longer available. Please refresh the page.", 409);
  }

  const lines: PricedLine[] = addOns.map((a) => {
    if (!Number.isFinite(a.price) || a.price < 1 || a.price > 1000) {
      throw new CheckoutError("One of these add-ons has no valid price yet.", 409);
    }
    return {
      id: a.id,
      name: a.name,
      description: a.description,
      unitAmountCents: Math.round(a.price * 100),
      quantity: wanted.get(a.id)!,
    };
  });

  return provider.createCheckout(lines, { email: email || undefined, ...urls });
}

export function getPaidSummary(sessionId: string) {
  return provider.getPaidSummary(sessionId);
}
