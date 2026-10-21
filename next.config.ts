import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

// Old Squarespace URLs -> new URLs. 301 (not Next's default 308) so search engines
// treat them as classic permanent moves.
const legacyRedirects: Array<[string, string]> = [
  ["/about-me", "/about"],
  ["/cart", "/add-ons"],
  ["/wellnesseducation", "/wellness-education"],
  ["/wellnesseducation/:slug*", "/wellness-education"],
  ["/faq-1", "/faq"],
  ["/home", "/"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      statusCode: 301 as const,
    }));
  },
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: noindex },
      { source: "/add-ons/success", headers: noindex },
      { source: "/add-ons/cancel", headers: noindex },
    ];
  },
};

export default nextConfig;
