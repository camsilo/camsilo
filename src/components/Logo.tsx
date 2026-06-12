/**
 * Camsilo-mærket: kaunan-runen ᚲ (lyden K/C — Camsilos "C") sat i et åbent,
 * kantet skjold. Runen læses samtidig som en vinkelparentes `<` — viking og
 * software i ét tegn. Kun rette linjer: runer blev ristet, ikke tegnet.
 */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="logo-mark"
    >
      {/* Skjold: sekskant med åbning i øverste højre kant */}
      <path
        d="M49 14.1 L32 4 L8 18 L8 46 L32 60 L56 46 L56 25"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="logo-shield"
      />
      {/* Kaunan-runen ᚲ — "C" og kodevinkel på én gang */}
      <path
        d="M41 19 L23 32 L41 45"
        stroke="var(--ice)"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="logo-rune"
      />
    </svg>
  );
}

export function LogoLockup({ size = 30 }: { size?: number }) {
  return (
    <span className="logo-lockup">
      <LogoMark size={size} />
      <span className="logo-word">CAMSILO</span>
    </span>
  );
}
