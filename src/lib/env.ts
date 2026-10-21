/** Netlify deploy previews and branch deploys must never be indexed. */
export const allowIndexing = process.env.NETLIFY === "true" ? process.env.CONTEXT === "production" : true;
