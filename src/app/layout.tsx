import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { StickyBookBar } from "@/components/StickyBookBar";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/content";
import { allowIndexing } from "@/lib/env";
import { localBusinessSchema } from "@/lib/schema";
import "./globals.css";

// next/font downloads these at build time and serves them from our own domain,
// so visitors never make a request to Google.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mobile IV Therapy in Lakewood Ranch, FL | Avida Luna Wellness",
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Nurse-led mobile IV hydration and wellness add-ons in Lakewood Ranch, FL. Shary Gonzalez, RN, BSN, comes to your home, office or event. Se habla español.",
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
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <StickyBookBar phoneTel={settings.phoneTel} phoneDisplay={settings.phoneDisplay} />
        <JsonLd data={localBusinessSchema(settings)} />
      </body>
    </html>
  );
}
