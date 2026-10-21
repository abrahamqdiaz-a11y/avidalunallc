import type { Metadata } from "next";
import { BRAND_NAME } from "./constants";

/** Per-page metadata with a canonical URL. The root layout supplies metadataBase and the OG image. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: BRAND_NAME, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
