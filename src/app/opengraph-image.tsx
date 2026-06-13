import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Camsilo — dansk softwarestudie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brandmærket — det flettede vikinge-C (glødende jern + egetræ) som vektor.
// Solide farver + mørk "casing" mellem båndene, så over/under-vævningen læses
// rent også i satori (next/og), der ikke gengiver gradienter pålideligt.
const OAK = `M44.92 45.38L44.15 45.39L43.39 45.37L42.65 45.32L41.94 45.26L41.25 45.18L40.59 45.09L39.97 45.01L39.38 44.93L38.82 44.86L38.29 44.81L37.78 44.78L37.31 44.79L36.86 44.82L36.43 44.89L36.02 44.99L35.62 45.14L35.23 45.32L34.84 45.55L34.45 45.82L34.05 46.12L33.64 46.46L33.22 46.83L32.77 47.23L32.31 47.66L31.81 48.10L31.29 48.55L30.74 49.01L30.16 49.46L29.54 49.91L28.90 50.34L28.22 50.75L27.52 51.12L26.80 51.46L26.05 51.76L25.29 52.01L24.52 52.20L23.74 52.33L22.96 52.40L22.19 52.41L21.42 52.35L20.68 52.21L19.96 52.01L19.27 51.74L18.61 51.40L18.00 51.00L17.43 50.53L16.91 50.00L16.45 49.42L16.04 48.79L15.69 48.12L15.41 47.41L15.18 46.67L15.02 45.90L14.92 45.12L14.87 44.32L14.88 43.52L14.95 42.72L15.06 41.93L15.21 41.15L15.40 40.39L15.62 39.64L15.86 38.93L16.13 38.23L16.40 37.57L16.68 36.94L16.95 36.34L17.22 35.77L17.47 35.22L17.70 34.71L17.90 34.22L18.08 33.75L18.22 33.29L18.32 32.85L18.38 32.42L18.40 32.00L18.38 31.58L18.32 31.15L18.22 30.71L18.08 30.25L17.90 29.78L17.70 29.29L17.47 28.78L17.22 28.23L16.95 27.66L16.68 27.06L16.40 26.43L16.13 25.77L15.86 25.07L15.62 24.36L15.40 23.61L15.21 22.85L15.06 22.07L14.95 21.28L14.88 20.48L14.87 19.68L14.92 18.88L15.02 18.10L15.18 17.33L15.41 16.59L15.69 15.88L16.04 15.21L16.45 14.58L16.91 14.00L17.43 13.47L18.00 13.00L18.61 12.60L19.27 12.26L19.96 11.99L20.68 11.79L21.42 11.65L22.19 11.59L22.96 11.60L23.74 11.67L24.52 11.80L25.29 11.99L26.05 12.24L26.80 12.54L27.52 12.88L28.22 13.25L28.90 13.66L29.54 14.09L30.16 14.54L30.74 14.99L31.29 15.45L31.81 15.90L32.31 16.34L32.77 16.77L33.22 17.17L33.64 17.54L34.05 17.88L34.45 18.18L34.84 18.45L35.23 18.68L35.62 18.86L36.02 19.01L36.43 19.11L36.86 19.18L37.31 19.21L37.78 19.22L38.29 19.19L38.82 19.14L39.38 19.07L39.97 18.99L40.59 18.91L41.25 18.82L41.94 18.74L42.65 18.68L43.39 18.63L44.15 18.61L44.92 18.62`;
const EMBER = `M44.92 45.38L44.85 46.16L44.74 46.95L44.58 47.74L44.38 48.51L44.12 49.27L43.82 50.01L43.46 50.71L43.06 51.38L42.60 52.01L42.10 52.59L41.55 53.11L40.96 53.57L40.33 53.96L39.67 54.29L38.98 54.54L38.27 54.72L37.53 54.83L36.79 54.86L36.04 54.81L35.30 54.69L34.56 54.50L33.83 54.24L33.11 53.92L32.42 53.53L31.75 53.10L31.12 52.61L30.51 52.09L29.94 51.53L29.40 50.95L28.90 50.34L28.43 49.72L28.00 49.10L27.60 48.48L27.23 47.86L26.88 47.27L26.56 46.69L26.26 46.13L25.97 45.61L25.69 45.12L25.42 44.66L25.14 44.24L24.86 43.86L24.57 43.52L24.26 43.22L23.93 42.95L23.58 42.71L23.19 42.51L22.78 42.33L22.33 42.17L21.85 42.03L21.33 41.90L20.78 41.78L20.20 41.66L19.58 41.54L18.93 41.40L18.26 41.25L17.56 41.08L16.85 40.88L16.13 40.65L15.40 40.39L14.67 40.09L13.95 39.75L13.25 39.36L12.57 38.94L11.92 38.47L11.30 37.97L10.73 37.42L10.21 36.83L9.75 36.21L9.35 35.56L9.01 34.88L8.75 34.18L8.55 33.46L8.44 32.73L8.40 32.00L8.44 31.27L8.55 30.54L8.75 29.82L9.01 29.12L9.35 28.44L9.75 27.79L10.21 27.17L10.73 26.58L11.30 26.03L11.92 25.53L12.57 25.06L13.25 24.64L13.95 24.25L14.67 23.91L15.40 23.61L16.13 23.35L16.85 23.12L17.56 22.92L18.26 22.75L18.93 22.60L19.58 22.46L20.20 22.34L20.78 22.22L21.33 22.10L21.85 21.97L22.33 21.83L22.78 21.67L23.19 21.49L23.58 21.29L23.93 21.05L24.26 20.78L24.57 20.48L24.86 20.14L25.14 19.76L25.42 19.34L25.69 18.88L25.97 18.39L26.26 17.87L26.56 17.31L26.88 16.73L27.23 16.14L27.60 15.52L28.00 14.90L28.43 14.28L28.90 13.66L29.40 13.05L29.94 12.47L30.51 11.91L31.12 11.39L31.75 10.90L32.42 10.47L33.11 10.08L33.83 9.76L34.56 9.50L35.30 9.31L36.04 9.19L36.79 9.14L37.53 9.17L38.27 9.28L38.98 9.46L39.67 9.71L40.33 10.04L40.96 10.43L41.55 10.89L42.10 11.41L42.60 11.99L43.06 12.62L43.46 13.29L43.82 13.99L44.12 14.73L44.38 15.49L44.58 16.26L44.74 17.05L44.85 17.84L44.92 18.62`;
const FLIP1 = `M34.05 46.12L33.64 46.46L33.22 46.83L32.77 47.23L32.31 47.66L31.81 48.10L31.29 48.55L30.74 49.01L30.16 49.46L29.54 49.91L28.90 50.34L28.22 50.75L27.52 51.12L26.80 51.46L26.05 51.76L25.29 52.01L24.52 52.20L23.74 52.33L22.96 52.40L22.19 52.41L21.42 52.35`;
const FLIP2 = `M17.90 29.78L17.70 29.29L17.47 28.78L17.22 28.23L16.95 27.66L16.68 27.06L16.40 26.43L16.13 25.77L15.86 25.07L15.62 24.36L15.40 23.61L15.21 22.85L15.06 22.07L14.95 21.28L14.88 20.48L14.87 19.68L14.92 18.88L15.02 18.10L15.18 17.33L15.41 16.59L15.69 15.88`;
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 64 64"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${OAK}" stroke="#0d0b09" stroke-width="8.9"/><path d="${OAK}" stroke="#b07a42" stroke-width="5.3"/><path d="${EMBER}" stroke="#0d0b09" stroke-width="8.9"/><path d="${EMBER}" stroke="#f26a1b" stroke-width="5.3"/><path d="${FLIP1}" stroke="#0d0b09" stroke-width="8.9"/><path d="${FLIP1}" stroke="#b07a42" stroke-width="5.3"/><path d="${FLIP2}" stroke="#0d0b09" stroke-width="8.9"/><path d="${FLIP2}" stroke="#b07a42" stroke-width="5.3"/></g><circle cx="44.92" cy="45.38" r="4.0" fill="#0d0b09"/><circle cx="44.92" cy="45.38" r="3.5" fill="#ff8a44"/><circle cx="44.92" cy="18.62" r="4.0" fill="#0d0b09"/><circle cx="44.92" cy="18.62" r="3.5" fill="#ff8a44"/></svg>`;
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
            "linear-gradient(135deg, #0d0b09 0%, #16110c 55%, #1d1207 100%)",
          color: "#f5f0e8",
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
              color: "#f26a1b",
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
          <span style={{ fontSize: 27, color: "#b8aa99" }}>
            Dansk softwarestudie · Webapps · SaaS · AI-integration
          </span>
          <span style={{ fontSize: 27, color: "#f26a1b", letterSpacing: 1 }}>
            camsilo.dk
          </span>
        </div>
      </div>
    ),
    size,
  );
}
