export type ImageRef = {
  /** Sanity image asset reference, or a local /public path. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
} | null;

export type ServiceCategory = "iv" | "boost" | "vitamin" | "consultation";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  /** Short "Good for" line on drip cards, e.g. "Training · Recovery days". */
  goodFor?: string | null;
  price: number | null;
  showPrice: boolean;
  /** One upgrade shown on the same card, e.g. Myers "With chromium" at $240. */
  optionName?: string | null;
  optionPrice?: number | null;
  image: ImageRef;
  todo?: string;
};

export type AddOn = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number | null;
  price: number;
  image: ImageRef;
  todo?: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string | null; // HH:mm
  endTime: string | null;
  place: string;
  description: string;
  link: string | null;
  image: ImageRef;
};

export type RichBlock =
  | { type: "h2" | "h3" | "p"; text: string; links?: { text: string; href: string }[] }
  | { type: "ul" | "ol"; items: string[] };

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: RichBlock[];
  sources: { title: string; url: string }[];
  image: ImageRef;
  publishedAt: string; // YYYY-MM-DD
  todo?: string;
};

export type Faq = { id: string; question: string; answer: string; todo?: string };

export type Testimonial = { id: string; quote: string; firstName: string };

export type SiteSettings = {
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  serviceArea: string;
  instagram: string | null;
  facebook: string | null;
  footerNote: string;
};

export type PageSection = { heading?: string; text?: string };
export type PageText = { heading: string; intro: string; sections: Record<string, PageSection> };

export type PageKey =
  | "home"
  | "services"
  | "addons"
  | "events"
  | "education"
  | "about"
  | "faq"
  | "contact"
  | "book"
  | "join";
