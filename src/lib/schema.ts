import { BRAND_NAME, LEGAL_NAME, SITE_URL } from "./constants";
import type { SiteSettings } from "./types";

/** LocalBusiness for a service-area business: no street address, only real facts. */
export function localBusinessSchema(settings: SiteSettings) {
  const sameAs = [settings.instagram, settings.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BRAND_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    telephone: settings.phoneDisplay.replace(/[^\d]/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "+1-$1-$2-$3"),
    email: settings.email,
    image: `${SITE_URL}/opengraph-image`,
    description: "Nurse-led mobile IV hydration and wellness add-ons in Lakewood Ranch, FL.",
    // TODO: confirm the service area with Shary.
    areaServed: { "@type": "City", name: "Lakewood Ranch", containedInPlace: { "@type": "State", name: "Florida" } },
    knowsLanguage: ["en", "es"],
    founder: {
      "@type": "Person",
      name: "Shamarith Gonzalez",
      alternateName: "Shary Gonzalez",
      jobTitle: "Registered Nurse, BSN",
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
