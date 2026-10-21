// Local fallback content. The site renders from this when Sanity isn't configured,
// and Sanity's seed file is generated from the same copy (see /docs/copy-deck.md).
//
// Every line here comes from facts in the project brief. Anything we don't know yet
// carries a `todo` note (rendered as a dashed TODO box until NEXT_PUBLIC_HIDE_TODOS=1).

import type {
  AddOn,
  Article,
  EventItem,
  Faq,
  PageKey,
  PageText,
  Service,
  SiteSettings,
  Testimonial,
} from "../src/lib/types";

export const siteSettings: SiteSettings = {
  phoneDisplay: "(941) 348-6972",
  phoneTel: "tel:9413486972",
  email: "YourRNShary@gmail.com",
  serviceArea: "Lakewood Ranch, FL and nearby",
  // TODO: Shary's Instagram and Facebook URLs. Links are hidden until these are set.
  instagram: null,
  facebook: null,
  footerNote:
    "Medical services are booked and screened through our secure booking partner, Hydreight. This website is general information, not medical advice.",
};

export const services: Service[] = [
  {
    id: "service-recovery",
    name: "Recovery",
    category: "iv",
    description:
      "Hydration and a quiet hour to reset after a long week, a hard workout or a busy weekend.",
    price: null,
    showPrice: false,
    image: null,
  },
  {
    id: "service-todo-drips",
    name: "More drips",
    category: "iv",
    description: "The rest of Shary's drip menu will be listed here.",
    price: null,
    showPrice: false,
    image: null,
    todo: "Shary's full drip menu: compliant names, one plain sentence each, and whether prices match Hydreight.",
  },
  {
    id: "service-b12",
    name: "Vitamin B12",
    category: "vitamin",
    description: "A quick vitamin B12 shot, given by Shary during your visit.",
    price: null,
    showPrice: false,
    image: null,
  },
  {
    id: "service-b-complex",
    name: "B-complex",
    category: "vitamin",
    description: "A blend of B vitamins, given as a quick shot or added to your drip.",
    price: null,
    showPrice: false,
    image: null,
    todo: "Confirm with Shary: shot, drip add-in, or both.",
  },
  {
    id: "service-glutathione",
    name: "Glutathione",
    category: "vitamin",
    description: "A popular add-in for wellness visits. Ask Shary if it's a fit for you.",
    price: null,
    showPrice: false,
    image: null,
    todo: "Confirm with Shary that glutathione stays on the public menu, and how it's given.",
  },
];

export const addOns: AddOn[] = [
  {
    id: "addon-red-light",
    name: "Red Light Therapy",
    description: "A relaxing red light session while you rest.",
    durationMinutes: 15,
    price: 29,
    image: null,
  },
  {
    id: "addon-aromatherapy",
    name: "Aromatherapy",
    description: "Calming essential oils during your visit.",
    durationMinutes: 45,
    price: 20,
    image: null,
  },
  {
    id: "addon-recovery-ritual",
    name: "Recovery Ritual",
    description: "A little extra comfort for your visit. Details coming soon.",
    durationMinutes: null,
    price: 39,
    image: null,
    todo: "Recovery Ritual contents, duration and description from Shary.",
  },
];

export const events: EventItem[] = [];

export const articles: Article[] = [
  {
    id: "article-understanding-iv-therapy",
    slug: "understanding-iv-therapy",
    title: "Understanding IV Therapy",
    summary: "A plain-language look at what a mobile IV visit is and what to expect.",
    body: [
      {
        type: "p",
        text: "Shary's article from the current site will be migrated here with light edits.",
      },
    ],
    sources: [],
    image: null,
    publishedAt: "2026-11-01",
    todo: "Migrate the full article text and exact title from the current site, plus the PubMed source URL from Shary.",
  },
];

export const faqs: Faq[] = [
  {
    id: "faq-services",
    question: "What services do you offer?",
    answer:
      "Mobile IV hydration and wellness drips, vitamin boosts, wellness add-ons like red light and aromatherapy, group events, and personalized wellness programs that start with a consultation. Shary comes to your home, office or event.",
  },
  {
    id: "faq-get-started",
    question: "How do I get started?",
    answer:
      "Three steps: share your name and email (about 30 seconds), book your IV on our secure booking page, and Shary comes to you. You can add a wellness ritual after you book.",
  },
  {
    id: "faq-book",
    question: "How do I book?",
    answer:
      "Start on our Book page. After you share your name and email, you'll continue to our secure booking page on Hydreight to choose your drip and time.",
  },
  {
    id: "faq-travel",
    question: "Where do you travel, and is there a travel fee?",
    answer: "Shary is based in Lakewood Ranch, FL and comes to you.",
    todo: "Service area and travel fee from Shary.",
  },
  {
    id: "faq-length",
    question: "How long does a visit take?",
    answer: "Visit length depends on the drip and any add-ons you choose.",
    todo: "Typical visit length from Shary.",
  },
  {
    id: "faq-who",
    question: "Who comes to my appointment?",
    answer: "Shary, a registered nurse, comes to your appointment herself.",
    todo: "Confirm with Shary whether anyone else ever attends appointments.",
  },
  {
    id: "faq-before",
    question: "What happens before my appointment?",
    answer:
      "Booking and health screening happen on Hydreight, our secure booking partner. Your health information stays there, never on this website.",
    todo: "Confirm with Shary exactly what Hydreight asks clients before a visit.",
  },
  {
    id: "faq-addons",
    question: "Can I add red light or aromatherapy?",
    answer:
      "Yes. After you book your IV, add them on our Add-ons page, or ask Shary at your visit and pay by card then.",
  },
  {
    id: "faq-pay",
    question: "How do I pay?",
    answer:
      "IV services are booked and paid on Hydreight. Add-ons can be paid by card online on our Add-ons page, or at your visit.",
  },
  {
    id: "faq-cancel",
    question: "What's your cancellation and refund policy?",
    answer: "Our cancellation and refund policy will be posted here.",
    todo: "Cancellation and refund policy from Shary.",
  },
  {
    id: "faq-groups",
    question: "Do you offer group events?",
    answer:
      "Yes. Birthdays, bridal parties, brunches, team days and pop-ups. Tell us about your event on our Group events page.",
  },
  {
    id: "faq-spanish",
    question: "¿Hablas español?",
    answer: "Sí. Shary habla inglés y español. Puedes llamarnos o escribirnos en español.",
  },
];

export const testimonials: Testimonial[] = [];

export const pageText: Record<PageKey, PageText> = {
  home: {
    heading: "Wellness that comes to you.",
    intro:
      "IV hydration and wellness add-ons from Shary Gonzalez, RN, BSN, at your home, office or next event in Lakewood Ranch.",
    sections: {
      offer: { heading: "What we offer" },
      how: { heading: "Simple from start to finish." },
      ritual: {
        heading: "Make it a ritual.",
        text: "Add a little extra calm to your visit. Book your IV first, then add a ritual.",
      },
      events: {
        heading: "Bring wellness to your group.",
        text: "Birthdays, bridal parties, brunches, team days and pop-ups. Shary brings hydration and a little self-care to your guests.",
      },
      meet: {
        heading: "Hi, I'm Shary.",
        text: "I'm a registered nurse and a mom of two. I started Avida Luna after my own wellness journey, because I wanted care to feel personal again. When you book, I'm the nurse who comes to you.",
      },
      education: { heading: "Wellness education" },
      faq: { heading: "Questions, answered" },
      cta: { heading: "Ready when you are.", text: "Book in a few minutes. Shary comes to you." },
    },
  },
  services: {
    heading: "Services",
    intro:
      "Every visit starts with a quick, secure booking. Pick your drip, choose a time, and Shary comes to you.",
    sections: {
      iv: { heading: "IV drips" },
      vitamin: { heading: "Vitamin boosts" },
      consultation: {
        heading: "Personalized wellness programs",
        text: "Some services are personalized and start with a screening consultation. Book a consultation to talk through your goals.",
      },
      addons: {
        heading: "Make it a ritual.",
        text: "Add red light or aromatherapy after you book your IV.",
      },
      how: { heading: "How booking works" },
    },
  },
  addons: {
    heading: "Make it a ritual.",
    intro:
      "Already booked your IV? Add your rituals here. You can also add them at your visit and pay by card then.",
    sections: {},
  },
  events: {
    heading: "Bring wellness to your group.",
    intro:
      "Birthdays, bridal parties and girls' trips, brunches, office and team wellness days, and pop-ups at local businesses. Shary brings IV hydration and wellness add-ons to your group.",
    sections: {
      how: { heading: "How group events work" },
      upcoming: {
        heading: "Upcoming events",
        text: "No public events right now. Want one for your group? Ask below.",
      },
      form: {
        heading: "Plan your group event",
        text: "Tell us a little about your event and Shary will get back to you.",
      },
    },
  },
  education: {
    heading: "Wellness education",
    intro: "Plain-language reading from Shary. General information, not medical advice.",
    sections: {},
  },
  about: {
    heading: "Hi, I'm Shary.",
    intro:
      "I'm Shamarith Gonzalez, Shary for short. I'm a registered nurse with a BSN, more than 17 years in nursing and 25 years in healthcare.",
    sections: {
      story: {
        text: "I'm also a mom of two. Avida Luna grew out of my own wellness journey. I wanted a calmer, more personal kind of care, and I wanted to bring it to other people too.\n\nWhen you book with Avida Luna, I'm the nurse who shows up. Not a call center, and not a busy IV bar. I come to your home, your office or your event, and I take the time to make the visit easy.\n\nHablo español, so we can talk in English or Spanish, whichever feels better for you.",
      },
      credentials: { heading: "Credentials" },
      mission: { text: "" },
    },
  },
  faq: {
    heading: "Frequently asked questions",
    intro: "Short answers to common questions. Still wondering about something? Get in touch.",
    sections: {},
  },
  contact: {
    heading: "Get in touch",
    intro: "Questions, group events or partnerships. Shary will get back to you.",
    sections: {},
  },
  book: {
    heading: "Book your IV",
    intro: "Takes 30 seconds. Next, you'll pick your IV and time on our secure booking page.",
    sections: {},
  },
  join: {
    heading: "Join the Avida Luna list",
    intro: "Get event news and offers from Shary by email. Unsubscribe anytime.",
    sections: {},
  },
};

/** Credentials as listed on her current site. TODO: confirm each with Shary. */
export const credentials = [
  "Registered Nurse (RN)",
  "Bachelor of Science in Nursing (BSN)",
  "17+ years in nursing",
  "25 years in healthcare",
  "Bilingual: English and Spanish",
];
