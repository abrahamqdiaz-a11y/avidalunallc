export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/events", label: "Group & corporate" },
  { href: "/about", label: "About Shary" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

/** Secondary pages: reachable from the mobile menu and footer, kept out of the main bar. */
export const secondaryNav = [
  { href: "/add-ons", label: "Wellness add-ons" },
  { href: "/wellness-education", label: "Wellness education" },
] as const;
