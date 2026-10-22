"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";
import { mainNav, secondaryNav } from "./nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="grid size-11 place-items-center rounded-full text-olive-dark hover:bg-olive/10"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-cream shadow-[var(--shadow-soft)]"
      >
        <ul className="container-page flex flex-col py-2">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-lg text-ink no-underline"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-base text-muted no-underline"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="py-3">
            <Link href="/book" className="btn btn-primary w-full">
              Book an appointment
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
