import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { erAdmin } from "@/lib/admin-auth";
import { LogoMark } from "@/components/Logo";
import OdinAether from "@/components/admin/OdinAether";
import { adminLogoutAction } from "@/app/admin/actions";
import {
  hentImportLog,
  hentIndberetninger,
  hentIndstillinger,
  hentLaerteRegler,
  hentTransaktioner,
} from "@/lib/regnskab/store";
import {
  beregnMomsOpgoerelse,
  relevantePerioder,
} from "@/lib/regnskab/moms";
import { beregnSkatteOpgoerelse, udgifterPrKategori } from "@/lib/regnskab/skat";
import { beregnFrister, dageTil, idagIso } from "@/lib/regnskab/frister";
import { foreslaaKategori } from "@/lib/regnskab/regler";
import { satserFor } from "@/lib/regnskab/satser";
import { OdinRegnskabOversigt } from "@/components/admin/regnskab/OdinRegnskabOversigt";
import { OdinImport } from "@/components/admin/regnskab/OdinImport";
import { OdinTransaktioner } from "@/components/admin/regnskab/OdinTransaktioner";
import { OdinSpoerger } from "@/components/admin/regnskab/OdinSpoerger";
import { OdinMoms } from "@/components/admin/regnskab/OdinMoms";
import { OdinSkat } from "@/components/admin/regnskab/OdinSkat";
import { OdinFrister } from "@/components/admin/regnskab/OdinFrister";
import { OdinStatistik } from "@/components/admin/regnskab/OdinStatistik";
import { OdinViden } from "@/components/admin/regnskab/OdinViden";
import { OdinRedegoerelse } from "@/components/admin/regnskab/OdinRedegoerelse";
import { OdinOpsaetning } from "@/components/admin/regnskab/OdinOpsaetning";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Odin Regnskab — Camsilo",
  robots: { index: false, follow: false },
};

const DELE = [
  { id: "oversigt", navn: "Oversigt" },
  { id: "odin", navn: "Odin spørger" },
  { id: "firma", navn: "Firma" },
  { id: "privat", navn: "Privat" },
  { id: "statistik", navn: "Statistik" },
  { id: "moms", navn: "Moms" },
  { id: "redegoerelse", navn: "Redegørelse" },
  { id: "skat", navn: "Skat" },
  { id: "frister", navn: "Frister" },
  { id: "import", navn: "Import" },
  { id: "viden", navn: "Viden" },
  { id: "opsaetning", navn: "Opsætning" },
] as const;

type Del = (typeof DELE)[number]["id"];

export default async function RegnskabSide({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await erAdmin())) redirect("/admin");

  const sp = await searchParams;
  const oensketDel = (
    DELE.some((d) => d.id === sp.del) ? sp.del : "oversigt"
  ) as Del;

  const [indstillinger, transaktioner, indberetninger, importLog, laerte] =
    await Promise.all([
      hentIndstillinger(),
      hentTransaktioner(),
      hentIndberetninger(),
      hentImportLog(),
      hentLaerteRegler(),
    ]);

  // Før Odins onboarding er svaret, er opsætningen eneste visning.
  const del: Del = indstillinger.onboardingFaerdig ? oensketDel : "opsaetning";

  const idag = idagIso();
  const iAar = Number(idag.slice(0, 4));
  const uafklarede = transaktioner.filter((t) => !t.afklaret && !t.laastAf);
  const frister = beregnFrister(indstillinger, indberetninger, idag);

  return (
    <main className="admin odin">
      <OdinAether />
      <div className="odin-wrap">
        <header className="admin-top">
          <Link
            href="/"
            className="admin-logo-link"
            aria-label="Til forsiden"
            title="Til forsiden"
          >
            <LogoMark size={26} uid="regn" />
          </Link>
          <div>
            <h1>ODIN · REGNSKAB</h1>
            <span className="admin-undertitel">
              {indstillinger.virksomhedsnavn} · bogholder, revisor & vagttårn
            </span>
          </div>
          <div className="admin-top-hoejre">
            <nav className="admin-faner" aria-label="Admin-område">
              <Link href="/admin?vis=kommandocenter">Kommandocenter</Link>
              <Link href="/admin?vis=beskeder">Beskeder</Link>
              <Link href="/admin?vis=email">E-mail</Link>
              <Link href="/admin/regnskab" className="aktiv" aria-current="page">
                Regnskab
                {uafklarede.length > 0 && (
                  <span className="admin-badge">{uafklarede.length}</span>
                )}
              </Link>
            </nav>
            <form action={adminLogoutAction}>
              <button className="admin-knap" type="submit">
                Log ud
              </button>
            </form>
          </div>
        </header>

        {indstillinger.onboardingFaerdig && (
          <nav className="admin-perioder regnskab-nav" aria-label="Regnskabs-del">
            {DELE.map((d) => (
              <Link
                key={d.id}
                href={`/admin/regnskab?del=${d.id}`}
                aria-current={d.id === del ? "page" : undefined}
                className={d.id === del ? "aktiv" : ""}
              >
                {d.navn}
                {d.id === "odin" && uafklarede.length > 0 && (
                  <span className="admin-badge">{uafklarede.length}</span>
                )}
              </Link>
            ))}
          </nav>
        )}

        <div className="odin-stak">
          {del === "oversigt" && (
            <OdinRegnskabOversigt
              indstillinger={indstillinger}
              skat={beregnSkatteOpgoerelse(transaktioner, iAar, indstillinger)}
              moms={relevantePerioder(indstillinger.foersteAar, indstillinger.momsperiode, idag)
                .slice(0, 1)
                .map((p) => beregnMomsOpgoerelse(transaktioner, p, indberetninger))[0] ?? null}
              frister={frister.filter((f) => !f.udfoert && dageTil(f.dato, idag) >= 0).slice(0, 3)}
              idag={idag}
              uafklarede={uafklarede.length}
              antalTransaktioner={transaktioner.length}
              transaktioner={transaktioner.slice(0, 8)}
            />
          )}

          {del === "odin" && (
            <OdinSpoerger
              koe={uafklarede.slice(0, 200).map((t) => ({
                transaktion: t,
                forslag: t.kategori
                  ? null
                  : foreslaaKategori(t.tekst, t.konto, laerte),
              }))}
              iAltUafklarede={uafklarede.length}
            />
          )}

          {(del === "firma" || del === "privat") && (
            <OdinTransaktioner
              konto={del}
              transaktioner={transaktioner.filter((t) => t.konto === del)}
            />
          )}

          {del === "statistik" && (
            <OdinStatistik transaktioner={transaktioner} idag={idag} />
          )}

          {del === "moms" && (
            <OdinMoms
              indstillinger={indstillinger}
              opgoerelser={relevantePerioder(
                indstillinger.foersteAar,
                indstillinger.momsperiode,
                idag,
              ).map((p) => beregnMomsOpgoerelse(transaktioner, p, indberetninger))}
              idag={idag}
            />
          )}

          {del === "redegoerelse" && <OdinRedegoerelse />}

          {del === "skat" && (
            <OdinSkat
              opgoerelse={beregnSkatteOpgoerelse(transaktioner, iAar, indstillinger)}
              sidsteAar={
                iAar > indstillinger.foersteAar
                  ? beregnSkatteOpgoerelse(transaktioner, iAar - 1, indstillinger)
                  : null
              }
              prKategori={udgifterPrKategori(transaktioner, iAar)}
              satser={satserFor(iAar)}
              indstillinger={indstillinger}
            />
          )}

          {del === "frister" && (
            <OdinFrister frister={frister} idag={idag} />
          )}

          {del === "import" && <OdinImport importLog={importLog} />}

          {del === "viden" && <OdinViden />}

          {del === "opsaetning" && (
            <OdinOpsaetning
              indstillinger={indstillinger}
              laerte={laerte}
            />
          )}
        </div>

        <p className="admin-fodnote">
          Odin Regnskab er dit eget overblik — vejledende beregninger, ikke
          autoriseret rådgivning. Facit er altid TastSelv og din årsopgørelse.
          Data ligger lokalt som JSON under <code>DATA_DIR/regnskab</code> på
          din persistente disk og forlader aldrig serveren.
        </p>
      </div>
    </main>
  );
}
