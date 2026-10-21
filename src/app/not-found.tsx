import Link from "next/link";
import { CrescentSprig } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-20 text-center">
      <CrescentSprig className="size-12" />
      <h1 className="mt-4 text-4xl md:text-5xl">We couldn&apos;t find that page.</h1>
      <p className="mt-3">It may have moved when we refreshed the website.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Go to home
        </Link>
        <Link href="/services" className="btn btn-outline">
          See services
        </Link>
      </div>
    </section>
  );
}
