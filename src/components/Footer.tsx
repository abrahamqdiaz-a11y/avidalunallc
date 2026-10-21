import Link from "next/link";
import { LEGAL_LINE } from "@/lib/constants";
import type { SiteSettings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon } from "./Icons";
import { Logo } from "./Logo";
import { Todo } from "./Todo";
import { WaveDivider } from "./WaveDivider";

const pageLinks = [
  { href: "/services", label: "Services" },
  { href: "/add-ons", label: "Add-ons" },
  { href: "/events", label: "Group events" },
  { href: "/wellness-education", label: "Wellness Education" },
  { href: "/about", label: "About Shary" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book your IV" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto">
      <WaveDivider from="cream" to="sage" />
      <div className="band-sage on-sage">
        <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-4 max-w-sm">
              Nurse-led mobile IV hydration and wellness add-ons in Lakewood Ranch, FL.
            </p>
            <p className="mt-2 font-semibold">Se habla español.</p>
          </div>

          <div>
            <h2 className="font-sans text-base font-semibold text-ink">Get in touch</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={settings.phoneTel} className="inline-flex items-center gap-2">
                  <PhoneIcon /> {settings.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 break-all">
                  <MailIcon /> {settings.email}
                </a>
              </li>
              {settings.instagram ? (
                <li>
                  <a href={settings.instagram} className="inline-flex items-center gap-2" rel="noopener">
                    <InstagramIcon /> Instagram
                  </a>
                </li>
              ) : null}
              {settings.facebook ? (
                <li>
                  <a href={settings.facebook} className="inline-flex items-center gap-2" rel="noopener">
                    <FacebookIcon /> Facebook
                  </a>
                </li>
              ) : null}
              <li>{settings.serviceArea}</li>
            </ul>
            {!settings.instagram || !settings.facebook ? (
              <Todo className="mt-3">Instagram and Facebook links (Sanity: Contact info).</Todo>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <h2 className="font-sans text-base font-semibold text-ink">Pages</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="container-page border-t border-ink/15 py-6 text-[0.9375rem]">
          <p className="prose-width">{settings.footerNote}</p>
          <Todo className="mt-2">Shary to confirm the footer note wording.</Todo>
          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} {LEGAL_LINE}. Lakewood Ranch, FL.
            </p>
            <p className="flex gap-4">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
