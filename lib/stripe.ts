import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return stripeInstance;
}

let stripeClientPromise: ReturnType<typeof loadStripe> | null = null;

export function getStripeClient() {
  if (!stripeClientPromise) {
    stripeClientPromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripeClientPromise;
}
