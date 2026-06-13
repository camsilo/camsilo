// Camsilo service worker — MINIMAL og defensiv.
// Mål: gøre sitet installérbart (en fetch-handler kræves), uden NOGENSINDE
// at risikere at vise forældet admin-data eller bryde det live site.
// Strategi:
//   - Navigationer (HTML): network-first → cache-fallback → simpel offline-besked.
//   - Statiske assets (ikoner): cache-first.
//   - Alt under /api/ og alle ikke-GET requests: røres ALDRIG (rent netværk).

const CACHE_NAME = "camsilo-v2";

// Hvad vi forhåndscacher ved install (kun helt statiske ting).
const STATIC_ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-180.png",
];

self.addEventListener("install", (event) => {
  // Tag straks over, så nye versioner aktiveres uden at vente.
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(STATIC_ASSETS);
      } catch (err) {
        // Defensivt: install må aldrig fejle pga. caching.
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Ryd gamle cache-versioner.
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        );
      } catch (err) {
        // Ignorér — oprydning er ikke kritisk.
      }
      await self.clients.claim();
    })(),
  );
});

// ── Push-notifikationer ──────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = {};
  }
  const titel = data.titel || "Camsilo";
  const krop = data.krop || "Ny aktivitet i admin";
  const url = data.url || "/admin";
  event.waitUntil(
    self.registration.showNotification(titel, {
      body: krop,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url },
      tag: "camsilo-admin",
      renotify: true,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    (async () => {
      const alle = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const c of alle) {
        if (c.url.includes("/admin") && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })(),
  );
});

// Hjælper: er dette en anmodning om et statisk ikon?
function erStatiskAsset(url) {
  return url.pathname.startsWith("/icons/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1) Kun GET håndteres. Alt andet (POST/PUT/DELETE …) går urørt videre.
  if (request.method !== "GET") {
    return;
  }

  let url;
  try {
    url = new URL(request.url);
  } catch (err) {
    return; // Kan ikke parse — lad browseren håndtere det.
  }

  // 2) Kun samme origin. Tredjeparts-requests røres ikke.
  if (url.origin !== self.location.origin) {
    return;
  }

  // 3) Alt under /api/ går ALTID rent til netværket (ingen caching).
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // 4) Navigationer (HTML-sider): network-first.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const netværksSvar = await fetch(request);
          // Gem en kopi til offline-fallback (kun ved succes).
          try {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, netværksSvar.clone());
          } catch (err) {
            // Ignorér cache-fejl.
          }
          return netværksSvar;
        } catch (err) {
          // Offline: prøv cache, ellers en simpel offline-besked.
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          return new Response(
            "<!doctype html><html lang=\"da\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Offline</title></head><body style=\"margin:0;background:#0d0b09;color:#f2efe9;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px\"><div><h1 style=\"color:#f26a1b;font-size:20px;margin:0 0 8px\">Offline</h1><p style=\"margin:0;opacity:.8\">Ingen forbindelse. Prøv igen, når du er online.</p></div></body></html>",
            {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            },
          );
        }
      })(),
    );
    return;
  }

  // 5) Statiske assets (ikoner): cache-first.
  if (erStatiskAsset(url)) {
    event.respondWith(
      (async () => {
        try {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          const netværksSvar = await fetch(request);
          try {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, netværksSvar.clone());
          } catch (err) {
            // Ignorér cache-fejl.
          }
          return netværksSvar;
        } catch (err) {
          // Sidste udvej: forsøg netværket direkte.
          return fetch(request);
        }
      })(),
    );
    return;
  }

  // 6) Alt andet (JS/CSS/data): lad netværket håndtere det urørt.
  // (Ingen respondWith → browserens standard-adfærd.)
});
