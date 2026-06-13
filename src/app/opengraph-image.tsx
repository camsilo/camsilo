import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Camsilo — dansk softwarestudie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brandmærket (skjold + kaunan-rune) som vektor — gengives skarpt i billedet.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 64 64"><path d="M49 14.1 L32 4 L8 18 L8 46 L32 60 L56 46 L56 25" fill="none" stroke="#e9eef4" stroke-width="4.5" stroke-linecap="square" stroke-linejoin="miter"/><path d="M41 19 L23 32 L41 45" fill="none" stroke="#7fe0d4" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;
const LOGO = `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #070a0f 0%, #0b1018 55%, #0d161f 100%)",
          color: "#e9eef4",
          fontFamily: "sans-serif",
        }}
      >
        {/* Topbjælke: logo + ordmærke */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={96} height={96} alt="" />
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 14,
            }}
          >
            CAMSILO
          </span>
        </div>

        {/* Midte: budskab */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04 }}>
            Software,
          </span>
          <span
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.04,
              color: "#7fe0d4",
            }}
          >
            smedet i Norden.
          </span>
        </div>

        {/* Bund: hvad vi laver + domæne */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 27, color: "#93a3b5" }}>
            Dansk softwarestudie · Webapps · SaaS · AI-integration
          </span>
          <span style={{ fontSize: 27, color: "#7fe0d4", letterSpacing: 1 }}>
            camsilo.dk
          </span>
        </div>
      </div>
    ),
    size,
  );
}
