/** True only on the live production site (Netlify's production context, or a non-Netlify prod build). */
export const isProductionSite =
  process.env.NETLIFY === "true" ? process.env.CONTEXT === "production" : process.env.NODE_ENV === "production";

/** Netlify deploy previews and branch deploys must never be indexed. */
export const allowIndexing = process.env.NETLIFY === "true" ? process.env.CONTEXT === "production" : true;
