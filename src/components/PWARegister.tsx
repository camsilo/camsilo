"use client";

import { useEffect } from "react";

/**
 * PWARegister — registrerer service worker'en (/sw.js) i browseren.
 * Ingen UI; returnerer null. Kører kun client-side og fejler stille,
 * hvis service workers ikke understøttes.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    try {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Stille: registrering må aldrig påvirke sitet.
      });
    } catch (err) {
      // Ignorér — manglende SW-support må ikke kaste fejl.
    }
  }, []);

  return null;
}

export default PWARegister;
