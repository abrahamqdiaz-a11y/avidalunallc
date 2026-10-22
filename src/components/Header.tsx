import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { mainNav } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/85">
      <a
        href="#main"
        className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:h-auto focus:w-auto focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:[clip:auto]"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-3 md:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-2 text-ink no-underline hover:text-forest hover:underline hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/book" className="btn btn-primary hidden min-h-11 px-4 text-[0.9375rem] sm:inline-flex md:px-5">
            Book an appointment
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
