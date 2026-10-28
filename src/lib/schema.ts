import { cityAreas, serviceAreas } from "@content/fallback";
import { BRAND_NAME, LEGAL_NAME, SITE_URL } from "./constants";
import type { Faq, Service, SiteSettings } from "./types";

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const FOUNDER_ID = `${SITE_URL}/about#shary`;

// TODO: confirm the service area with Shary (same list as the home page "Areas we serve").
const areaServed = serviceAreas.map((name) => ({
  "@type": "Place",
  name: `${name}, FL`,
}));

function telephone(settings: SiteSettings) {
  return settings.phoneDisplay.replace(/[^\d]/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "+1-$1-$2-$3");
}

export function founderSchema() {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Shary Gonzalez",
    jobTitle: "Registered Nurse, BSN",
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/brand/shary.webp`,
    knowsLanguage: ["en", "es"],
    worksFor: { "@id": BUSINESS_ID },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: "Registered Nurse (RN)" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Bachelor of Science in Nursing (BSN)" },
    ],
  };
}

/**
 * MedicalBusiness (a LocalBusiness subtype) for a service-area business: no street address,
 * only the home-base town, and only real facts. Opening hours are left out until Shary confirms them.
 */
export function localBusinessSchema(settings: SiteSettings) {
  const sameAs = [settings.instagram, settings.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": BUSINESS_ID,
        name: BRAND_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        telephone: telephone(settings),
        email: settings.email,
        image: `${SITE_URL}/opengraph-image`,
        logo: `${SITE_URL}/brand/logo.png`,
        description:
          "Nurse-led mobile IV therapy in Lakewood Ranch, Sarasota and Bradenton, FL: IV hydration drips, vitamin injections and group IV events at your home, office or event.",
        slogan: "Professional care. Personally delivered.",
        address: { "@type": "PostalAddress", addressLocality: "Lakewood Ranch", addressRegion: "FL", addressCountry: "US" },
        areaServed,
        knowsLanguage: ["en", "es"],
        founder: { "@id": FOUNDER_ID },
        ...(sameAs.length ? { sameAs } : {}),
      },
      founderSchema(),
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        inLanguage: "en-US",
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

/** The priced menu as a Service with an offer catalog. Only items with a confirmed, shown price. */
export function servicesSchema(services: Service[]) {
  const priced = services.filter((s) => s.showPrice && s.price !== null && !s.todo);
  const kind = { iv: "IV drip", boost: "IV drip add-in", vitamin: "Vitamin injection", consultation: "Consultation" };
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#service`,
    name: "Mobile IV therapy",
    serviceType: "Mobile IV hydration and vitamin injections",
    description:
      "In-home IV hydration drips, vitamin injections and drip add-ins given by a registered nurse at your home, office or event.",
    provider: { "@id": BUSINESS_ID },
    areaServed: cityAreas.map((c) => ({ "@type": "City", name: `${c.city}, FL` })),
    url: `${SITE_URL}/services`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IV drips and vitamin injections",
      itemListElement: priced.map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "USD",
        itemOffered: { "@type": "Service", name: `${s.name} (${kind[s.category]})`, description: s.description },
      })),
    },
  };
}

/** Group IV events. No prices: group pricing isn't published. */
export function groupEventsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/events#service`,
    name: "Group IV therapy and IV hydration parties",
    serviceType: "Mobile IV hydration for groups and events",
    description:
      "Mobile IV hydration for workplaces, bachelorette and bridal parties, celebrations and community events. Each guest is screened individually and a registered nurse manages every IV on site.",
    provider: { "@id": BUSINESS_ID },
    areaServed: cityAreas.map((c) => ({ "@type": "City", name: `${c.city}, FL` })),
    url: `${SITE_URL}/events`,
  };
}

/** FAQPage from confirmed answers only (anything still marked TODO stays out). */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.todo)
      .map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": FOUNDER_ID },
  };
}
