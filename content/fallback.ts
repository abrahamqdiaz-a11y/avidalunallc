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
    name: "Hydration",
    category: "iv",
    description:
      "Our essential IV. Fluids and electrolytes for a quick reset after a hard workout, a late night or a long week.",
    goodFor: "Workouts · Late nights · Long weeks",
    price: 99,
    showPrice: true,
    image: { src: "/services/iv-hydration.webp", alt: "An IV bag on a stand beside a cream lounge chair in a sunny room", width: 1536, height: 1024 },
  },
  {
    id: "service-athlete-recovery",
    name: "Athlete Recovery",
    category: "iv",
    description:
      "Amino acids and B12 with IV fluids, to support muscle recovery and endurance when you train hard.",
    goodFor: "Training · Endurance · Rest days",
    price: 180,
    showPrice: true,
    image: { src: "/services/athlete-recovery-towel.webp", alt: "A man resting on a mat with a towel around his neck and a water bottle after a workout", width: 1190, height: 892 },
  },
  {
    id: "service-energy",
    name: "Energy",
    category: "iv",
    description:
      "A blend of amino acids, vitamins and minerals to support your body\u2019s natural energy, for weeks when you\u2019re running on empty.",
    goodFor: "Busy weeks · Low-energy days",
    price: 180,
    showPrice: true,
    image: { src: "/services/energy.webp", alt: "A woman stretching on a sofa in a bright living room", width: 1448, height: 1086 },
  },
  {
    id: "service-reset",
    name: "Reset",
    category: "iv",
    description:
      "Fluids with essential vitamins and minerals, to rehydrate and help you bounce back after a big night out or a packed weekend.",
    goodFor: "Nights out · Travel · Busy weekends",
    price: 190,
    showPrice: true,
    image: { src: "/services/reset.webp", alt: "A woman relaxing on a sofa with a glass of water in a sunny living room", width: 2000, height: 1242 },
  },
  {
    id: "service-myers",
    name: "Myers",
    category: "iv",
    description:
      "The classic blend of B vitamins, vitamin C, magnesium and calcium, to replenish electrolytes and leave you feeling restored.",
    goodFor: "Overall wellness · Relaxation",
    price: 199,
    showPrice: true,
    optionName: "With chromium",
    optionPrice: 240,
    image: { src: "/services/vitamin-vials.webp", alt: "Vitamin vials labeled Avida Luna on a stone tray", width: 1448, height: 1086 },
  },
  {
    id: "boost-b-complex",
    name: "B-complex",
    category: "boost",
    description: "A blend of B vitamins, added to your drip.",
    price: 35,
    showPrice: true,
    image: null,
  },
  {
    id: "boost-b12",
    name: "Vitamin B12",
    category: "boost",
    description: "Vitamin B12, added to your drip.",
    price: 40,
    showPrice: true,
    image: null,
  },
  {
    id: "boost-glutathione",
    name: "Glutathione",
    category: "boost",
    description: "An antioxidant add-in for your drip.",
    price: 45,
    showPrice: true,
    image: null,
  },
  {
    id: "service-b12",
    name: "Vitamin B12",
    category: "vitamin",
    description: "A quick vitamin B12 shot, given by Shary during your visit.",
    price: 45,
    showPrice: true,
    image: null,
  },
  {
    id: "service-b-complex",
    name: "B-complex",
    category: "vitamin",
    description: "A blend of B vitamins, given as a quick shot.",
    price: 40,
    showPrice: true,
    image: null,
  },
  {
    id: "service-glutathione",
    name: "Glutathione",
    category: "vitamin",
    description: "A quick glutathione shot. Ask Shary if it\u2019s a fit for you.",
    price: 50,
    showPrice: true,
    image: null,
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
    name: "Recovery add-on",
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
    summary:
      "A plain-language look at what a mobile IV visit is and what to expect.",
    body: [
      {
        type: "p",
        text: "A mobile IV visit brings nursing care to your location. Booking starts with your name and email on this website. Service selection, scheduling and confidential health screening happen on Hydreight. Before an IV begins, Shary reviews your screening with you and checks that the service is a good fit. She stays with you throughout the visit.",
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
      "Nurse-led mobile IV hydration, vitamin boosts, personalized consultations, and group and corporate wellness visits. Optional wellness add-ons like red light and aromatherapy can be added to an appointment. Shary comes to your home, office or event.",
  },
  {
    id: "faq-get-started",
    question: "How do I get started?",
    answer:
      "Three steps: request an appointment (share your name and email, then choose a service and time on our secure booking page), complete a health screening and assessment, and Shary comes to you.",
  },
  {
    id: "faq-eligibility",
    question: "Is IV therapy right for me?",
    answer:
      "Not everyone is a good fit for IV therapy, and that's why every appointment starts with a health screening. If anything in your screening or at your visit suggests an IV isn't right for you, Shary will tell you and suggest you speak with your doctor.",
    todo: "Shary to confirm the eligibility wording and any groups she doesn't serve (for example, minors).",
  },
  {
    id: "faq-safety",
    question: "Who places my IV, and how is safety handled?",
    answer:
      "Shary, a registered nurse with more than 17 years of nursing experience, places and monitors every IV herself. She uses sterile, single-use supplies and stays with you for the whole visit.",
    todo: "Shary to confirm the safety details (supplies, monitoring, medical director oversight through Hydreight).",
  },
  {
    id: "faq-during",
    question: "What happens during my appointment?",
    answer:
      "Shary arrives at your location, reviews your screening with you, and checks your vital signs. She then places your IV and stays with you while it runs. Most of the visit is simply time to sit back and rest.",
    todo: "Shary to confirm the visit steps and the typical length.",
  },
  {
    id: "faq-book",
    question: "How do I book?",
    answer:
      "Tap Book and share your name and email. You'll get your booking link right away, then pick your services, a time, and complete your screening and payment on our secure booking page on Hydreight. Optional add-ons come after.",
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
      "Every appointment includes a confidential health screening on Hydreight, our secure booking partner, and Shary reviews it before your IV begins. Your health information stays there, never on this website.",
    todo: "Confirm with Shary exactly what Hydreight asks clients before a visit.",
  },
  {
    id: "faq-addons",
    question: "Can I add red light or aromatherapy?",
    answer:
      "Yes, as optional add-ons to an IV appointment. After you book, choose them on our Add-ons page and pay at your visit or online by card.",
  },
  {
    id: "faq-pay",
    question: "How do I pay?",
    answer:
      "IV services are booked and paid on Hydreight. Add-ons can be paid at your visit (tap to pay or card) or online by card on our Add-ons page.",
  },
  {
    id: "faq-cancel",
    question: "What's your cancellation and refund policy?",
    answer: "Our cancellation and refund policy will be posted here.",
    todo: "Cancellation and refund policy from Shary.",
  },
  {
    id: "faq-groups",
    question: "Do you offer group or corporate visits?",
    answer:
      "Yes. Shary coordinates mobile IV services for private groups, workplaces and special events. Tell us about your event on our Group & corporate page.",
  },
  {
    id: "faq-spanish",
    question: "¿Hablas español?",
    answer:
      "Sí. Shary habla inglés y español. Puedes llamarnos o escribirnos en español.",
  },
];

export const testimonials: Testimonial[] = [];

export const pageText: Record<PageKey, PageText> = {
  home: {
    heading: "Experienced nursing care, brought to you.",
    intro:
      "Personalized IV hydration and wellness services provided by Shary Gonzalez, RN, BSN, in the comfort of your home, office or event.",
    sections: {
      services: { heading: "Care designed around your needs" },
      meet: {
        heading: "Care from someone who knows your name.",
        text: "With more than 17 years of nursing experience, Shary founded Avida Luna to bring professional, personalized wellness services directly to her community.\n\nRather than navigating a large clinic, patients connect directly with the nurse behind the practice. The nurse you speak with is the nurse who comes to your appointment.",
      },
      how: { heading: "Three simple steps" },
      areas: {
        heading: "Where we provide care",
        text: "Shary is based in Lakewood Ranch and comes to homes, offices and event venues nearby. Not sure if you're in the area? Ask when you book.",
      },
      faq: { heading: "Frequently asked" },
      cta: {
        heading: "Ready to book your appointment?",
        text: "Professional care, personally delivered.",
      },
    },
  },
  services: {
    heading: "Care designed around your needs",
    intro:
      "Nurse-led mobile IV drips, vitamin injections, consultations and group visits. Every appointment includes a health screening, and Shary assesses you in person before your IV begins.",
    sections: {
      iv: {
        heading: "Mobile IV Hydration",
        text: "Administered and monitored by Shary, a registered nurse, at your location.",
      },
      consultation: {
        heading: "Personalized consultations",
        text: "Some services are personalized and start with a screening consultation. Talk through your goals, health history and available services directly with your nurse.",
      },
      boost: {
        heading: "Boost your drip",
        text: "Add a vitamin to any IV. Your nurse may suggest other add-ins based on your assessment.",
      },
      vitamin: {
        heading: "Vitamin injections",
        text: "A quick shot, on its own or alongside your IV.",
      },
      addons: {
        heading: "Optional wellness add-ons",
        text: "Red light and aromatherapy can be added to an IV appointment after you book.",
      },
      how: { heading: "How appointments work" },
    },
  },
  addons: {
    heading: "After you book",
    intro:
      "Make it a ritual. Optional extras for an IV appointment you've already booked. Choose them here, then pay at your visit or now by card.",
    sections: {},
  },
  events: {
    heading: "Group & corporate wellness",
    intro:
      "Coordinated mobile IV services for private groups, workplaces and special events. Each guest is screened individually, and Shary manages every IV on site.",
    sections: {
      how: { heading: "How group visits work" },
      upcoming: {
        heading: "Upcoming events",
        text: "No public events right now. Want one for your group? Ask below.",
      },
      form: {
        heading: "Request a group visit",
        text: "Tell us a little about your group and Shary will get back to you.",
      },
    },
  },
  education: {
    heading: "Wellness education",
    intro:
      "Plain-language reading from Shary. General information, not medical advice.",
    sections: {},
  },
  about: {
    heading: "Shary Gonzalez, RN, BSN",
    intro:
      'Shamarith "Shary" Gonzalez is a registered nurse with a BSN, more than 17 years in nursing and 25 years in healthcare. She founded Avida Luna to bring professional, personalized care directly to her community.',
    sections: {
      story: {
        text: "Shary started Avida Luna because she wanted care to feel personal again: one nurse, who knows your name, taking the time to do things properly.\n\nWhen you book with Avida Luna, Shary is the nurse who shows up. Not a call center, and not a rotating staff. She reviews your screening, assesses you in person, places your IV and stays with you for the whole visit, at your home, your office or your event.\n\nShe speaks English and Spanish, so you can talk through your care in whichever language feels better for you.",
      },
      credentials: { heading: "Credentials" },
      mission: { text: "" },
    },
  },
  faq: {
    heading: "Frequently asked questions",
    intro:
      "Eligibility, screening, safety and what to expect at your appointment. Still wondering about something? Get in touch.",
    sections: {},
  },
  contact: {
    heading: "Get in touch",
    intro:
      "Questions about services, group visits or partnerships. Shary will get back to you personally.",
    sections: {},
  },
  book: {
    heading: "Book an appointment",
    intro:
      "Takes 30 seconds and you get your booking link right away. Next, you'll pick your services and a time, then complete a short health screening and payment on our secure booking page.",
    sections: {},
  },
  join: {
    heading: "Join the Avida Luna list",
    intro:
      "Get event news and offers from Shary by email. Unsubscribe anytime.",
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
