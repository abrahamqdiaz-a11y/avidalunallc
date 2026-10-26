import { NextResponse } from "next/server";
import { cancelFollowUps } from "@/lib/followup";
import { tagIfSubscribed } from "@/lib/mailchimp";
import { stripeClient } from "@/lib/payments/stripe";

// Stripe webhook: confirms add-on payments. Logs only the session id, items and amount.
// Shary's payment emails come from Stripe itself (turn on in Stripe settings).
export async function POST(req: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!stripe || !secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.info("[stripe] add-on payment completed", {
      session: session.id,
      items: session.metadata?.addons ?? "",
      amount: session.amount_total,
      paid: session.payment_status,
    });
    const email = session.customer_details?.email ?? session.customer_email;
    if (session.payment_status === "paid") {
      // They've bought add-ons, so the follow-up email pitching add-ons would be noise.
      await Promise.all([
        cancelFollowUps({ id: session.metadata?.followup, email }),
        email ? tagIfSubscribed(email, "addon-purchased") : null,
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
