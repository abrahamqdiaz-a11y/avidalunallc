import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { allowIndexing } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/add-ons/success", "/add-ons/cancel"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
