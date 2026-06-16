import type { Metadata } from "next";
import Link from "next/link";
import { erAdmin } from "@/lib/admin-auth";
import {
  beregnOversigt,
  PERIODER,
  type Andel,
  type Periode,
} from "@/lib/analytics/aggregate";
import { hentBeskeder } from "@/lib/messages/store";
import {
  hentIndbakke,
  mailAdresser,
  postStackKonfigureret,
  type IndgaaendeMail,
} from "@/lib/poststack";
import { hentMailTilstande } from "@/lib/mail/state";
import { AdminBeskeder } from "@/components/AdminBeskeder";
import { AdminEmail, type AdminMail } from "@/components/AdminEmail";
import { AdminPWA } from "@/components/admin/AdminPWA";
import { LogoMark } from "@/components/Logo";
import OdinAether from "@/components/admin/OdinAether";
import OdinOracle from "@/components/admin/OdinOracle";
import { OdinKpi } from "@/components/admin/OdinKpi";
import OdinFordeling from "@/components/admin/OdinFordeling";
import { OdinTrafikGraf } from "@/components/admin/OdinTrafikGraf";
import { OdinDoegnring } from "@/components/admin/OdinDoegnring";
import { OdinRealtid } from "@/components/admin/OdinRealtid";
import { OdinGauge } from "@/components/admin/OdinGauge";
import { OdinGaStatus } from "@/components/admin/OdinGaStatus";
import { adminLoginAction, adminLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Odin — Camsilo kommandocenter",
  robots: { index: false, follow: false },
};

const fmtTal = new Intl.NumberFormat("da-DK");

function fmtPct(v: number | null): string {
  if (v === null) return "—";
  return `${v.toFixed(1).replace(".", ",")}%`;
}

function fmtSek(v: number | null): string {
  if (v === null) return "—";
  const s = Math.round(v);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function fmtDecimal(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1).replace(".", ",");
}

const SPROG_NAVN: Record<string, string> = {
  da: "Dansk",
  en: "Engelsk",
  de: "Tysk",
  sv: "Svensk",
  no: "Norsk",
  nb: "Norsk",
  nn: "Norsk",
  nl: "Hollandsk",
  fr: "Fransk",
  es: "Spansk",
  it: "Italiensk",
  pt: "Portugisisk",
  pl: "Polsk",
  ru: "Russisk",
  fi: "Finsk",
  is: "Islandsk",
};

function sprogEtiketter(poster: Andel[]): Andel[] {
  return poster.map((p) => ({
    navn: SPROG_NAVN[p.navn] ?? p.navn.toUpperCase(),
    antal: p.antal,
  }));
}

function LoginSide({ fejl }: { fejl?: string }) {
  return (
    <main className="admin odin">
      <OdinAether />
      <div className="odin-wrap">
        <div className="admin-login">
          <div className="admin-login-portal">
            <LogoMark size={48} uid="login" glow bg="#0c0a08" />
          </div>
          <h1>ᚨ ODIN ᚨ</h1>
          <p className="admin-login-note">camsilo.dk · kommandocenter</p>
          <form action={adminLoginAction}>
            <input
              className="admin-felt"
              type="text"
              name="brugernavn"
              placeholder="Brugernavn"
              aria-label="Brugernavn"
              autoComplete="username"
              autoFocus
              required
            />
            <input
              className="admin-felt"
              type="password"
              name="kode"
              placeholder="Adgangskode"
              aria-label="Adgangskode"
              autoComplete="current-password"
              required
            />
            <button className="admin-knap admin-knap-primaer" type="submit">
              Træd ind i Valhal
            </button>
          </form>
          {fejl === "kode" && (
            <p className="admin-fejl">Forkert brugernavn eller adgangskode.</p>
          )}
          {fejl === "rate" && (
            <p className="admin-fejl">
              For mange forsøg. Vent et øjeblik, og prøv igen.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default async function AdminSide({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  if (!(await erAdmin())) {
    return <LoginSide fejl={typeof sp.fejl === "string" ? sp.fejl : undefined} />;
  }

  const vis =
    sp.vis === "beskeder"
      ? "beskeder"
      : sp.vis === "email"
        ? "email"
        : "kommandocenter";

  // Korrupt besked-lager kaster (skånsom degradering frem for at vælte /admin).
  let beskeder: Awaited<ReturnType<typeof hentBeskeder>> = [];
  let beskedFejl = false;
  try {
    beskeder = await hentBeskeder();
  } catch {
    beskedFejl = true;
  }
  const nye = beskeder.filter((b) => !b.laest && !b.arkiveret).length;

  // E-mail (PostStack) — hentes kun på e-mail-fanen
  const mailKonfig = postStackKonfigureret();
  const adresser = mailAdresser();
  let mails: AdminMail[] = [];
  let mailFejl: string | undefined;
  if (vis === "email" && mailKonfig) {
    try {
      const [raa, tilstande] = await Promise.all([
        hentIndbakke(),
        hentMailTilstande(),
      ]);
      mails = raa
        .filter((m) => !tilstande[m.id]?.slettet)
        .map((m) => ({
          ...m,
          laest: Boolean(tilstande[m.id]?.laest),
          arkiveret: Boolean(tilstande[m.id]?.arkiveret),
        }));
    } catch {
      mailFejl = "Kunne ikke hente indbakken fra PostStack lige nu.";
    }
  }

  const valgt: Periode = (["24h", "7d", "30d", "90d"] as const).includes(
    sp.periode as Periode,
  )
    ? (sp.periode as Periode)
    : "7d";
  const periodeLabel =
    PERIODER.find((p) => p.id === valgt)?.label ?? valgt;

  const o = vis === "kommandocenter" ? await beregnOversigt(valgt) : null;

  return (
    <main className="admin odin">
      <OdinAether />
      <div className="odin-wrap">
        {/* ── Topbjælke ──────────────────────────────────────────── */}
        <header className="admin-top">
          <Link href="/" className="admin-logo-link" aria-label="Til forsiden" title="Til forsiden">
            <LogoMark size={26} uid="adm" />
          </Link>
          <div>
            <h1>ODIN</h1>
            <span className="admin-undertitel">camsilo.dk · kommandocenter</span>
          </div>
          <div className="admin-top-hoejre">
            <nav className="admin-faner" aria-label="Visning">
              <Link
                href="/admin?vis=kommandocenter"
                aria-current={vis === "kommandocenter" ? "page" : undefined}
                className={vis === "kommandocenter" ? "aktiv" : ""}
              >
                Kommandocenter
              </Link>
              <Link
                href="/admin?vis=beskeder"
                aria-current={vis === "beskeder" ? "page" : undefined}
                className={vis === "beskeder" ? "aktiv" : ""}
              >
                Beskeder
                {nye > 0 && <span className="admin-badge">{nye}</span>}
              </Link>
              <Link
                href="/admin?vis=email"
                aria-current={vis === "email" ? "page" : undefined}
                className={vis === "email" ? "aktiv" : ""}
              >
                E-mail
              </Link>
            </nav>
            {vis === "kommandocenter" && (
              <nav className="admin-perioder" aria-label="Periode">
                {PERIODER.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin?vis=kommandocenter&periode=${p.id}`}
                    aria-current={p.id === valgt ? "page" : undefined}
                    className={p.id === valgt ? "aktiv" : ""}
                  >
                    {p.label}
                  </Link>
                ))}
              </nav>
            )}
            <AdminPWA />
            <form action={adminLogoutAction}>
              <button className="admin-knap" type="submit">
                Log ud
              </button>
            </form>
          </div>
        </header>

        {/* ── BESKEDER ───────────────────────────────────────────── */}
        {vis === "beskeder" &&
          (beskedFejl ? (
            <section className="hud-panel">
              <div className="hud-head">
                <span className="hud-label">
                  <span className="hud-rune">ᛒ</span> Beskeder
                </span>
              </div>
              <p className="admin-fejl">
                Kunne ikke læse beskeds-lageret — filen kan være korrupt. Den er{" "}
                <strong>bevaret og ikke overskrevet</strong>. Tjek{" "}
                <code>DATA_DIR/messages/messages.json</code>.
              </p>
            </section>
          ) : (
            <AdminBeskeder beskeder={beskeder} adresser={adresser} />
          ))}

        {/* ── E-MAIL (PostStack) ─────────────────────────────────── */}
        {vis === "email" && (
          <AdminEmail
            mails={mails}
            konfigureret={mailKonfig}
            fejl={mailFejl}
            adresser={adresser}
          />
        )}

        {/* ── KOMMANDOCENTER ─────────────────────────────────────── */}
        {vis === "kommandocenter" && o && (
          <div className="odin-stak">
            <OdinOracle
              onlineNu={o.onlineNu}
              unikke={o.unikke}
              visninger={o.visninger}
              periodeLabel={periodeLabel}
              gnsBesoegSek={o.gnsBesoegSek}
            />

            {/* KPI-stribe */}
            <div className="odin-kpis">
              <OdinKpi
                rune="ᚠ"
                label="Sidevisninger"
                value={fmtTal.format(o.visninger)}
                delta={o.visningerDelta}
              />
              <OdinKpi
                rune="ᛗ"
                label="Unikke gæster"
                value={fmtTal.format(o.unikke)}
                delta={o.unikkeDelta}
              />
              <OdinKpi
                rune="ᛁ"
                label="Afvisningsrate"
                value={fmtPct(o.afvisningsrate)}
                delta={o.afvisningsrateDelta}
                opAdvarer
              />
              <OdinKpi
                rune="ᚦ"
                label="Gns. besøgstid"
                value={fmtSek(o.gnsBesoegSek)}
                delta={o.gnsBesoegDelta}
              />
              <OdinKpi
                rune="ᛟ"
                label="Sider / besøg"
                value={fmtDecimal(o.sidesPerSession)}
              />
            </div>

            {/* Trafik + engagement */}
            <div className="odin-grid">
              <div className="col-8">
                <section className="hud-panel" style={{ height: "100%" }}>
                  <div className="hud-head">
                    <span className="hud-label">
                      <span className="hud-rune">ᛉ</span> Trafik over tid
                    </span>
                    <span className="hud-meta odin-legende">
                      <i className="odin-prik odin-prik-ember" /> Syner
                      <i className="odin-prik odin-prik-seid" /> Unikke · UTC
                    </span>
                  </div>
                  <OdinTrafikGraf serie={o.serie} />
                </section>
              </div>
              <div className="col-4">
                <OdinGauge
                  rune="ᛜ"
                  label="Engagement"
                  procent={o.engagementProcent}
                  farve="seid"
                  undertekst="ikke-afviste besøg"
                />
              </div>
            </div>

            {/* Døgnrytme + realtid + måling */}
            <div className="odin-grid">
              <div className="col-4">
                <section className="hud-panel" style={{ height: "100%" }}>
                  <div className="hud-head">
                    <span className="hud-label">
                      <span className="hud-rune">ᛃ</span> Døgnrytme
                    </span>
                    <span className="hud-meta">UTC</span>
                  </div>
                  <OdinDoegnring timer={o.timer} />
                </section>
              </div>
              <div className="col-4">
                <OdinRealtid realtid={o.realtid} onlineNu={o.onlineNu} />
              </div>
              <div className="col-4">
                <OdinGaStatus gaKonfigureret={o.gaKonfigureret} />
              </div>
            </div>

            {/* Sider + henvisninger */}
            <div className="odin-grid">
              <div className="col-6">
                <OdinFordeling
                  rune="ᛈ"
                  label="Mest besøgte sider"
                  poster={o.topStier}
                  tom="Ingen sidevisninger endnu."
                />
              </div>
              <div className="col-6">
                <OdinFordeling
                  rune="ᚱ"
                  label="Henvisninger"
                  poster={o.topHenvisninger}
                  tom="Ingen eksterne henvisninger endnu."
                />
              </div>
            </div>

            {/* Enheder + browsere + OS */}
            <div className="odin-grid">
              <div className="col-4">
                <OdinFordeling
                  rune="ᛞ"
                  label="Enheder"
                  poster={o.enheder}
                  tom="Ingen enhedsdata endnu."
                  visTotalAndel
                />
              </div>
              <div className="col-4">
                <OdinFordeling
                  rune="ᚹ"
                  label="Browsere"
                  poster={o.browsere}
                  tom="Ingen browserdata endnu."
                  visTotalAndel
                />
              </div>
              <div className="col-4">
                <OdinFordeling
                  rune="ᚺ"
                  label="Styresystemer"
                  poster={o.styresystemer}
                  tom="Ingen OS-data endnu."
                  visTotalAndel
                />
              </div>
            </div>

            {/* Ind- + udgangssider */}
            <div className="odin-grid">
              <div className="col-6">
                <OdinFordeling
                  rune="ᚷ"
                  label="Indgangssider"
                  poster={o.indgangssider}
                  tom="Ingen data endnu."
                />
              </div>
              <div className="col-6">
                <OdinFordeling
                  rune="ᛇ"
                  label="Udgangssider"
                  poster={o.udgangssider}
                  tom="Ingen data endnu."
                />
              </div>
            </div>

            {/* Lande + sprog */}
            <div className="odin-grid">
              <div className="col-6">
                <OdinFordeling
                  rune="ᛏ"
                  label="Lande"
                  poster={o.topLande}
                  tom="Ingen geo-data — hosten beriger ikke med landekode."
                />
              </div>
              <div className="col-6">
                <OdinFordeling
                  rune="ᛚ"
                  label="Sprog"
                  poster={sprogEtiketter(o.topSprog)}
                  tom="Ingen sprogdata endnu."
                />
              </div>
            </div>

            <p className="admin-fodnote">
              Førstepartsmåling — cookieløs, ingen IP-lagring. Enhed/browser/OS
              udledes af User-Agent på serveren; land af hostens geo-header.
              Data ligger som NDJSON under <code>DATA_DIR</code> (nu på persistent
              disk).
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
