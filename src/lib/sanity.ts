import "server-only";
import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2026-10-01";

export const sanityEnabled = Boolean(projectId);

/** Public pages: published content from the Sanity CDN (keeps us inside the free API allowance). */
export const cdnClient: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/** Checkout only: live, uncached reads so the charged price is always the current price. */
export const liveClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;
