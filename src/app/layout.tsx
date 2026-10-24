import type { Metadata, Viewport } from "next";
import { Unbounded, Schibsted_Grotesk, Fragment_Mono } from "next/font/google";
import { Sporing } from "@/components/Sporing";
import { HostStackSporing } from "@/components/HostStackSporing";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PWARegister } from "@/components/PWARegister";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-display",
});

const body = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});

const BESKRIVELSE =
  "Camsilo er et dansk softwarestudie, der designer og bygger webapplikationer, SaaS, fagværktøjer og AI-integration — fra idé til drift i produktion.";

export const metadata: Metadata = {
  metadataBase: new URL("https://camsilo.dk"),
  title: {
    default: "Camsilo — dansk softwarestudie | webapps, SaaS & AI",
    template: "%s · Camsilo",
  },
  description: BESKRIVELSE,
  applicationName: "Camsilo",
  authors: [{ name: "Camsilo", url: "https://camsilo.dk" }],
  creator: "Camsilo",
  publisher: "Camsilo",
  category: "technology",
  keywords: [
    "softwareudvikling",
    "softwarestudie",
    "webudvikling Danmark",
    "webapplikationer",
    "SaaS",
    "AI-integration",
    "fagværktøjer",
    "Next.js udvikling",
    "Camsilo",
  ],
  alternates: { canonical: "/" },
  // PWA / iOS-installation.
  appleWebApp: {
    capable: true,
    title: "Camsilo",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/icon-180.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Camsilo — dansk softwarestudie",
    description:
      "Software, smedet i Norden. Webapplikationer, SaaS, fagværktøjer og AI-integration — fra første idé til drift.",
    url: "https://camsilo.dk",
    siteName: "Camsilo",
    locale: "da_DK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Camsilo — dansk softwarestudie",
    description:
      "Software, smedet i Norden. Webapplikationer, SaaS, fagværktøjer og AI-integration.",
  },
  // Sættes via env på HostStack når Search Console-ejerskab skal bekræftes.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0d0b09",
};

/** Struktureret data (schema.org) — hjælper Google forstå firmaet + CVR. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Camsilo",
  url: "https://camsilo.dk",
  logo: "https://camsilo.dk/icon.svg",
  image: "https://camsilo.dk/opengraph-image",
  email: "kontakt@camsilo.dk",
  description: BESKRIVELSE,
  foundingDate: "2025-10-01",
  founder: { "@type": "Person", name: "Casper Møller Madsen" },
  vatID: "DK45925145",
  taxID: "45925145",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "CVR",
    value: "45925145",
  },
  address: { "@type": "PostalAddress", addressCountry: "DK" },
  areaServed: "DK",
  knowsAbout: [
    "Softwareudvikling",
    "Webapplikationer",
    "SaaS",
    "AI-integration",
    "Fagværktøjer og beregnere",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Webapplikationer & SaaS" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fagværktøjer & beregnere" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI-integration" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Drift & deployment" } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <PWARegister />
        <Sporing />
        <HostStackSporing />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
