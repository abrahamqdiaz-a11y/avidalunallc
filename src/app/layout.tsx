import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { StickyBookBar } from "@/components/StickyBookBar";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";
import { allowIndexing } from "@/lib/env";
import { localBusinessSchema } from "@/lib/schema";
import "./globals.css";
import "./site.css";

// Bundled variable font: no external font requests at build time or in the browser.
const manrope = localFont({
  src: "../../public/fonts/manrope-latin-variable.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mobile IV Therapy in Lakewood Ranch, FL | Avida Luna Wellness",
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Nurse-led mobile IV hydration in Lakewood Ranch, FL. Shary Gonzalez, RN, BSN, brings professional IV care to your home, office or event. Se habla español.",
  applicationName: BRAND_NAME,
  robots: allowIndexing ? undefined : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EE",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Header
          phoneTel={settings.phoneTel}
          phoneDisplay={settings.phoneDisplay}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <StickyBookBar />
        <JsonLd data={localBusinessSchema(settings)} />
      </body>
    </html>
  );
}
