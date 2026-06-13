import type { Metadata, Viewport } from "next";
import { Unbounded, Schibsted_Grotesk, Fragment_Mono } from "next/font/google";
import { Sporing } from "@/components/Sporing";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://camsilo.dk"),
  title: "Camsilo — dansk softwarestudie",
  description:
    "Camsilo designer og bygger digitale produkter — webapplikationer, fagværktøjer og AI-integration. Software, smedet i Norden.",
  openGraph: {
    title: "Camsilo — dansk softwarestudie",
    description:
      "Software, smedet i Norden. Webapplikationer, fagværktøjer og AI-integration — fra første idé til drift.",
    url: "https://camsilo.dk",
    siteName: "Camsilo",
    locale: "da_DK",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070a0f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <Sporing />
      </body>
    </html>
  );
}
