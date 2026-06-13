import type { Metadata } from "next";
import Link from "next/link";
import { erAdmin } from "@/lib/admin-auth";
import { beregnOversigt, PERIODER, type Periode } from "@/lib/analytics/aggregate";
import { AdminGraf } from "@/components/AdminGraf";
import { LogoMark } from "@/components/Logo";
import { adminLoginAction, adminLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Camsilo Admin",
  robots: { index: false, follow: false },
};

function LoginSide({ fejl }: { fejl?: string }) {
  return (
    <main className="admin-login">
      <div className="admin-login-maerke">
        <LogoMark size={44} />
      </div>
      <h1>CAMSILO ADMIN</h1>
      <p className="admin-login-note">camsilo.dk · analytics</p>
      <form action={adminLoginAction}>
        <input
          className="admin-felt"
          type="password"
          name="kode"
          placeholder="Adgangskode"
          autoFocus
          required
        />
        <button className="admin-knap admin-knap-primaer" type="submit">
          Log ind
        </button>
      </form>
      {fejl === "kode" && <p className="admin-fejl">Forkert adgangskode.</p>}
    </main>
  );
}

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

function Delta({
  vaerdi,
  opAdvarer = false,
}: {
  vaerdi: number | null;
  /** for afvisningsrate er en STIGNING dårligt nyt */
  opAdvarer?: boolean;
}) {
  if (vaerdi === null) return <span className="kpi-delta kpi-neutral">·</span>;
  const op = vaerdi >= 0;
  const godt = opAdvarer ? !op : op;
  return (
    <span className={`kpi-delta ${godt ? "kpi-god" : "kpi-daarlig"}`}>
      {op ? "↑" : "↓"} {Math.abs(vaerdi).toFixed(1).replace(".", ",")}%
    </span>
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

  const valgt: Periode = (["24h", "7d", "30d", "90d"] as const).includes(
    sp.periode as Periode,
  )
    ? (sp.periode as Periode)
    : "7d";

  const o = await beregnOversigt(valgt);

  return (
    <main className="admin">
      <header className="admin-top">
        <LogoMark size={26} />
        <div>
          <h1>CAMSILO ADMIN</h1>
          <span className="admin-undertitel">camsilo.dk — forside</span>
        </div>
        <div className="admin-top-hoejre">
          <span className="admin-online">
            <span className="admin-online-prik" aria-hidden="true" />
            {o.onlineNu} online
          </span>
          <nav className="admin-perioder" aria-label="Periode">
            {PERIODER.map((p) => (
              <Link
                key={p.id}
                href={`/admin?periode=${p.id}`}
                className={p.id === valgt ? "aktiv" : ""}
              >
                {p.label}
              </Link>
            ))}
          </nav>
          <form action={adminLogoutAction}>
            <button className="admin-knap" type="submit">
              Log ud
            </button>
          </form>
        </div>
      </header>

      <section className="kpi-net">
        <div className="kpi-kort">
          <p className="kpi-navn">Sidevisninger</p>
          <p className="kpi-tal">
            {o.visninger} <Delta vaerdi={o.visningerDelta} />
          </p>
        </div>
        <div className="kpi-kort">
          <p className="kpi-navn">Unikke besøgende</p>
          <p className="kpi-tal">
            {o.unikke} <Delta vaerdi={o.unikkeDelta} />
          </p>
        </div>
        <div className="kpi-kort">
          <p className="kpi-navn">Afvisningsrate</p>
          <p className="kpi-tal">
            {fmtPct(o.afvisningsrate)}{" "}
            <Delta vaerdi={o.afvisningsrateDelta} opAdvarer />
          </p>
        </div>
        <div className="kpi-kort">
          <p className="kpi-navn">Gns. besøgstid</p>
          <p className="kpi-tal">
            {fmtSek(o.gnsBesoegSek)} <Delta vaerdi={o.gnsBesoegDelta} />
          </p>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-hoved">
          <h2>
            Sidevisninger <span className="admin-utc">(UTC)</span>
          </h2>
          <div className="graf-forklaring">
            <span>
              <i className="prik prik-blaa" /> Sidevisninger
            </span>
            <span>
              <i className="prik prik-is" /> Unikke
            </span>
          </div>
        </div>
        <AdminGraf serie={o.serie} />
      </section>

      <section className="admin-net">
        <div className="admin-panel">
          <h2>Mest besøgte sider</h2>
          <TopListe poster={o.topStier} tomTekst="Ingen sidevisninger endnu." />
        </div>
        <div className="admin-panel">
          <h2>Henvisninger</h2>
          <TopListe
            poster={o.topHenvisninger}
            tomTekst="Ingen eksterne henvisninger endnu."
          />
        </div>
        <div className="admin-panel">
          <h2>Lande</h2>
          <TopListe
            poster={o.topLande}
            tomTekst="Ingen geo-data — hosten beriger ikke med landekode."
          />
        </div>
        <div className="admin-panel">
          <h2>Sprog</h2>
          <TopListe poster={o.topSprog} tomTekst="Ingen data endnu." />
        </div>
      </section>

      <p className="admin-fodnote">
        First-party analytics — cookieløs, ingen IP-lagring. Land udledes af
        hostens geo-header ved kanten, ikke af en gemt IP. Data ligger som
        NDJSON under <code>DATA_DIR</code> (flygtigt indtil en persistent disk
        tilkøbes).
      </p>
    </main>
  );
}

function TopListe({
  poster,
  tomTekst,
}: {
  poster: { navn: string; antal: number }[];
  tomTekst: string;
}) {
  if (poster.length === 0) return <p className="admin-tom">{tomTekst}</p>;
  const maks = Math.max(...poster.map((p) => p.antal));
  return (
    <ol className="top-liste">
      {poster.map((p) => (
        <li key={p.navn}>
          <span className="top-bjaelke" style={{ width: `${(p.antal / maks) * 100}%` }} />
          <span className="top-navn">{p.navn}</span>
          <span className="top-antal">{p.antal}</span>
        </li>
      ))}
    </ol>
  );
}
