"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

type NotiStatus = "ukendt" | "til" | "fra" | "blokeret" | "ustøttet";

function base64TilUint8(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function AdminPWA() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installeret, setInstalleret] = useState(false);
  const [ios, setIos] = useState(false);
  const [noti, setNoti] = useState<NotiStatus>("ukendt");
  const [travl, setTravl] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      nav.standalone === true;
    setInstalleret(Boolean(standalone));
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalleret(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    (async () => {
      if (
        !("Notification" in window) ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        setNoti("ustøttet");
        return;
      }
      if (Notification.permission === "denied") {
        setNoti("blokeret");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setNoti(sub ? "til" : "fra");
      } catch {
        setNoti("fra");
      }
    })();

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installer() {
    if (!prompt) return;
    await prompt.prompt();
    try {
      await prompt.userChoice;
    } catch {
      /* ignorér */
    }
    setPrompt(null);
  }

  async function slaaTil() {
    setTravl(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setNoti(perm === "denied" ? "blokeret" : "fra");
        return;
      }
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) {
        setNoti("ustøttet");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64TilUint8(key) as BufferSource,
      });
      const r = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setNoti(r.ok ? "til" : "fra");
    } catch {
      setNoti("fra");
    } finally {
      setTravl(false);
    }
  }

  async function slaaFra() {
    setTravl(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      setNoti("fra");
    } catch {
      /* ignorér */
    } finally {
      setTravl(false);
    }
  }

  return (
    <div className="admin-pwa">
      {prompt && !installeret && (
        <button type="button" className="admin-knap admin-knap-primaer" onClick={installer}>
          ⬇ Installér app
        </button>
      )}
      {ios && !installeret && (
        <span className="admin-pwa-note">
          Føj til hjemmeskærm via <strong>Del → Tilføj til hjemmeskærm</strong>
        </span>
      )}

      {noti === "fra" && (
        <button
          type="button"
          className="admin-knap admin-knap-primaer"
          onClick={slaaTil}
          disabled={travl}
        >
          🔔 Slå notifikationer til
        </button>
      )}
      {noti === "til" && (
        <button type="button" className="admin-knap" onClick={slaaFra} disabled={travl}>
          🔔 Notifikationer til — slå fra
        </button>
      )}
      {noti === "blokeret" && (
        <span className="admin-pwa-note">🔕 Notifikationer er blokeret i browserens indstillinger</span>
      )}
    </div>
  );
}
