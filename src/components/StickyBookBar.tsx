"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pages with their own primary action (booking, checkout, sign-up) hide the bar.
const HIDDEN_ON = ["/book", "/join", "/add-ons"];

export function StickyBookBar() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <>
      {/* Spacer so the bar never covers the end of the page. */}
      <div aria-hidden className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center">
          <Link href="/book" className="btn btn-primary flex-1">
            Book an appointment
          </Link>
        </div>
      </div>
    </>
  );
}
