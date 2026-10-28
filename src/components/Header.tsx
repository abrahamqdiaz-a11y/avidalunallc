"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";
import { PhoneIcon } from "./Icons";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { mainNav } from "./nav";

export function Header({
  phoneTel = PHONE_TEL,
  phoneDisplay = PHONE_DISPLAY,
}: {
  phoneTel?: string;
  phoneDisplay?: string;
}) {
  const pathname = usePathname();
  const focused = ["/book", "/join", "/add-ons"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const [condensed, setCondensed] = useState(false);
  useEffect(() => {
    const update = () => setCondensed(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header
      data-focused={focused}
      data-condensed={condensed}
      className="site-header sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85"
    >
      <a
        href="#main"
        className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:h-auto focus:w-auto focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:[clip:auto]"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[4.75rem] items-center justify-between gap-3 md:h-[6.5rem]">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-2 text-ink no-underline hover:text-olive hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={phoneTel}
            className="hidden items-center gap-2 text-[0.9375rem] font-semibold text-ink no-underline hover:text-olive xl:inline-flex"
          >
            <PhoneIcon className="size-4" /> {phoneDisplay}
          </a>
          <Link
            href="/book"
            className="btn btn-primary hidden min-h-11 px-4 text-[0.9375rem] sm:inline-flex md:px-5"
          >
            Book an appointment
          </Link>
          {focused ? (
            <Link href="/services" className="focused-back">
              Back to services
            </Link>
          ) : (
            <MobileMenu />
          )}
        </div>
      </div>
    </header>
  );
}
