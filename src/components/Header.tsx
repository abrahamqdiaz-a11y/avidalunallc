import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { mainNav } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-olive/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <a
        href="#main"
        className="visually-hidden focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:h-auto focus:w-auto focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:[clip:auto]"
      >
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-3 md:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink no-underline hover:text-olive hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/book" className="btn btn-primary min-h-11 px-4 text-[0.9375rem] md:px-5">
            Book your IV
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
