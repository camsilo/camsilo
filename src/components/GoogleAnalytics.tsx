"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics 4 (gtag). Indlæses KUN når NEXT_PUBLIC_GA_ID er sat (G-…),
 * og aldrig på /admin. anonymize_ip slår IP-trunkering til. GA giver dig
 * trafik, kilder/henvisninger og geografi i Google-dashboardet.
 *
 * GDPR: GA4 sætter cookies. Kører siden i EU bør du tilføje et samtykke-banner
 * (Consent Mode v2) — den cookieløse first-party-analytics i /admin kræver
 * derimod ikke samtykke og kan stå som den primære kilde.
 */
export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname();
  if (!gaId || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
