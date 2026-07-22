/**
 * Redegørelsen — den samlede sag om COMMS-fakturaen: hvorfor fakturadatoen
 * 19-12-2025 flytter både moms og skat til 2025, hvad der står i hver
 * momsrubrik i hver periode, og hvad der mangler på årsopgørelsen for 2025.
 *
 * Statisk server-komponent. Tallene er én gang for alle regnet ud fra
 * faktura INV-001, Wise-firmakontoen, Frøs-privatkontoen og årsopgørelsen —
 * de er bevidst hårdkodet, så siden viser præcis det, der blev gennemgået,
 * uafhængigt af hvad der senere importeres i Odins datalag.
 *
 * KURS: 8,618 hele vejen igennem. Den er udledt af årsopgørelsens rubrik 111
 * (193.906 kr. / 22.500 £), så momsens rubrik C og skattens rubrik 111 hviler
 * på samme omregning. Bekræftes med Nationalbankens kurs for 19-12-2025.
 */

type Felt = { navn: string; tal: number; note?: string };
type Periode = {
  id: string;
  navn: string;
  datoer: string;
  frist: string;
  status: "overskredet" | "aaben" | "loebende";
  statusTekst: string;
  tilsvar: number;
  tilsvarTekst: string;
  resume: string;
  felter: Felt[];
};

const kr = (n: number) => n.toLocaleString("da-DK", { maximumFractionDigits: 0 });

const PERIODER: Periode[] = [
  {
    id: "q4-2025",
    navn: "4. kvartal 2025",
    datoer: "1. oktober – 31. december 2025",
    frist: "1. marts 2026",
    status: "overskredet",
    statusTekst: "Frist overskredet",
    tilsvar: 0,
    tilsvarTekst: "Hverken betale eller til gode",
    resume:
      "Her hører hele COMMS-fakturaen hjemme. Momsen går alligevel i nul, fordi salget er uden for dansk moms.",
    felter: [
      { navn: "Salgsmoms", tal: 0, note: "Ydelsessalg til britisk virksomhed — uden for dansk moms." },
      { navn: "Købsmoms", tal: 124, note: "Moms af Cursor og Render i oktober til december." },
      { navn: "Moms af varekøb i udlandet", tal: 0 },
      { navn: "Moms af ydelseskøb i udlandet med omvendt betalingspligt", tal: 124, note: "25 % af 494,60 kr." },
      { navn: "Rubrik A — varer", tal: 0 },
      { navn: "Rubrik A — ydelser", tal: 0, note: "Cursor og Render er amerikanske. USA er ikke EU." },
      { navn: "Rubrik B — varer (begge felter)", tal: 0 },
      { navn: "Rubrik B — ydelser", tal: 0, note: "UK er tredjeland efter Brexit. Må ikke i EU-salg uden moms." },
      { navn: "Rubrik C", tal: 279742, note: "32.460 £ ved kurs 8,618. Faktura INV-001." },
      { navn: "Moms i alt", tal: 0 },
    ],
  },
  {
    id: "q1-2026",
    navn: "1. kvartal 2026",
    datoer: "1. januar – 31. marts 2026",
    frist: "1. juni 2026",
    status: "overskredet",
    statusTekst: "Frist overskredet",
    tilsvar: 0,
    tilsvarTekst: "Hverken betale eller til gode",
    resume:
      "Næsten tomt. De 17.500 £, der landede i februar og marts, er afdrag på decemberfakturaen.",
    felter: [
      { navn: "Salgsmoms", tal: 0 },
      { navn: "Købsmoms", tal: 144, note: "Moms af Cursor og Render." },
      { navn: "Moms af varekøb i udlandet", tal: 0 },
      { navn: "Moms af ydelseskøb i udlandet med omvendt betalingspligt", tal: 144, note: "25 % af 575,15 kr." },
      { navn: "Rubrik A — varer", tal: 0 },
      { navn: "Rubrik A — ydelser", tal: 0 },
      { navn: "Rubrik B — varer (begge felter)", tal: 0 },
      { navn: "Rubrik B — ydelser", tal: 0 },
      { navn: "Rubrik C", tal: 0, note: "Raterne hører til 4. kvartal 2025." },
      { navn: "Moms i alt", tal: 0 },
    ],
  },
  {
    id: "q2-2026",
    navn: "2. kvartal 2026",
    datoer: "1. april – 30. juni 2026",
    frist: "1. september 2026",
    status: "aaben",
    statusTekst: "Ikke indberettet endnu",
    tilsvar: -5,
    tilsvarTekst: "Til gode",
    resume:
      "Også tomt på salgssiden. AI-abonnementerne trækker tilsvaret en anelse i minus.",
    felter: [
      { navn: "Salgsmoms", tal: 0 },
      { navn: "Købsmoms", tal: 720, note: "715 kr. udenlandske abonnementer + 6 kr. dansk moms (HostStack)." },
      { navn: "Moms af varekøb i udlandet", tal: 0 },
      { navn: "Moms af ydelseskøb i udlandet med omvendt betalingspligt", tal: 715, note: "25 % af 2.859,18 kr." },
      { navn: "Rubrik A — varer", tal: 0 },
      { navn: "Rubrik A — ydelser", tal: 1971, note: "Anthropic-abonnementerne i euro — skal bekræftes." },
      { navn: "Rubrik B — varer (begge felter)", tal: 0 },
      { navn: "Rubrik B — ydelser", tal: 0 },
      { navn: "Rubrik C", tal: 0, note: "De sidste rater hører til 4. kvartal 2025." },
      { navn: "Moms i alt", tal: -5 },
    ],
  },
  {
    id: "q3-2026",
    navn: "3. kvartal 2026",
    datoer: "1. juli – 30. september 2026",
    frist: "1. december 2026",
    status: "loebende",
    statusTekst: "Kvartalet er ikke slut — tallene vokser",
    tilsvar: 14905,
    tilsvarTekst: "Forventet at betale",
    resume:
      "Her kommer der moms på: AMU SYD er en dansk kunde. Sæt cirka 15.000 kr. til side nu.",
    felter: [
      { navn: "Salgsmoms", tal: 15000, note: "20 % af AMU SYD-fakturaen på 75.000 kr. — hvis den er inkl. moms." },
      { navn: "Købsmoms", tal: 497, note: "402 kr. udenlandske abonnementer + 95 kr. dansk moms (HostStack)." },
      { navn: "Moms af varekøb i udlandet", tal: 0 },
      { navn: "Moms af ydelseskøb i udlandet med omvendt betalingspligt", tal: 402 },
      { navn: "Rubrik A — varer", tal: 0 },
      { navn: "Rubrik A — ydelser", tal: 1426, note: "Bunny.net er slovensk, altså EU." },
      { navn: "Rubrik B — varer (begge felter)", tal: 0 },
      { navn: "Rubrik B — ydelser", tal: 0 },
      { navn: "Rubrik C", tal: 0, note: "Intet nyt UK-salg siden 8. juni." },
      { navn: "Moms i alt", tal: 14905 },
    ],
  },
];

const SKAT_NU: [string, string][] = [
  ["Overskud af virksomhed (rubrik 111)", "193.906"],
  ["Pensioner, dagpenge, stipendier (rubrik 16)", "88.024"],
  ["Skattepligtig indkomst", "238.991"],
  ["Beregnet skat", "92.100"],
  ["Indeholdt A-skat", "23.316"],
  ["Din frivillige indbetaling 26-03-2026", "68.785"],
  ["Overskydende skat", "0,68"],
];

const SKAT_RETTET: [string, string][] = [
  ["Overskud af virksomhed (rubrik 111)", "279.742"],
  ["Pensioner, dagpenge, stipendier (rubrik 16)", "88.024"],
  ["Skattepligtig indkomst", "ca. 307.403"],
  ["Beregnet skat", "ca. 127.094"],
  ["Allerede betalt i alt", "92.101"],
  ["Restskat", "ca. 34.993"],
  ["Procenttillæg (efter 1. juli)", "ca. 2.700"],
];

const TJEKLISTE = [
  {
    titel: "Slå momsregistreringen op",
    tekst:
      "TastSelv Erhverv → Profil- og kontaktoplysninger → registreringsforhold. Fra hvilken dato er du momsregistreret, og er du på kvartal? Det afgør, om der findes en periode for 4. kvartal 2025.",
  },
  {
    titel: "Se om 4. kvartal 2025 er indberettet",
    tekst:
      "TastSelv Erhverv → Moms → Momsindberetning → tidligere perioder. Står den som manglende, eller er der lavet en foreløbig fastsættelse?",
  },
  {
    titel: "Indberet de perioder, der mangler",
    tekst:
      "Brug tallene ovenfor, felt for felt. Alle fire perioder til og med 2. kvartal 2026 koster nul kroner i moms. Regn med 800 kr. i gebyr per periode, der er indberettet for sent.",
  },
  {
    titel: "Bekræft valutakursen",
    tekst:
      "Nationalbankens GBP-kurs for 19-12-2025. Jeg har brugt 8,618, udledt af det, Jane selv indberettede. Afviger den, skal både rubrik C og rubrik 111 justeres med samme kurs.",
  },
  {
    titel: "Få en anden revisor til at se på periodiseringen",
    tekst:
      "Ét spørgsmål: faktura udstedt 19. december 2025 for allerede udført arbejde, betalt i rater hen over det følgende år — hvilket indkomstår? Det er en halv times arbejde for en, der kan det.",
  },
  {
    titel: "Ret rubrik 111 for 2025, hvis svaret er ja",
    tekst:
      "Årsopgørelsen for 2025 kan genoptages i tre år. Retter du selv, koster det restskat plus tillæg. Finder Skattestyrelsen det senere, koster det det samme plus flere renter.",
  },
];

function Talraekke({ navn, tal, note }: Felt) {
  const total = navn === "Moms i alt";
  return (
    <div className={`regnskab-rubrik${total ? " regnskab-rubrik-total" : ""}`}>
      <span className="regnskab-rubrik-navn">{navn}</span>
      <span className="regnskab-rubrik-tal">{kr(tal)} kr.</span>
      {note && <span className="hud-meta">{note}</span>}
    </div>
  );
}

export function OdinRedegoerelse() {
  return (
    <>
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛥ</span> Redegørelse
          </span>
          <span className="hud-meta">Opgjort 22. juli 2026</span>
        </div>
        <p className="regnskab-orakel">
          Hele sagen om COMMS-fakturaen samlet ét sted: hvorfor fakturadatoen
          flytter både moms og skat til 2025, hvad der skal stå i hver
          momsrubrik i hver periode, og hvad der mangler på årsopgørelsen.
          Læs den roligt igennem — der er intet af det her, der ikke kan rettes.
        </p>
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">Sagen kort</span>
        </div>
        <p className="regnskab-viden-tekst">
          Du fakturerede COMMS INSTALLATIONS LIMITED i Sheffield{" "}
          <strong>32.460 £</strong> for 541 timers webudvikling. Fakturaen
          INV-001 er udstedt <strong>19. december 2025</strong> med forfald
          en uge senere. Kunden betalte i fem rater fra februar til juni 2026.
        </p>
        <p className="regnskab-viden-tekst">
          Alt afhænger af den ene dato. Både moms og skat følger{" "}
          <strong>fakturadatoen</strong>, ikke hvornår pengene kom ind. Du havde
          erhvervet endelig ret til hele beløbet i 2025, og en afdragsordning
          udskyder ikke beskatningen. Derfor hører hele beløbet til 2025 — ikke
          fordelt over 2025, 2026 og 2027.
        </p>
        <p className="regnskab-odin-note">
          ᚱ Fakturaen er sat rigtigt op: dit CVR-nummer, kundens britiske
          momsnummer GB 208411146 og teksten &bdquo;Reverse Charge — Customer is
          liable for VAT&ldquo;. Der er ikke noget galt med den. Den er bare
          bogført i det forkerte år.
        </p>
        <p className="regnskab-viden-tekst">
          Storbritannien er uden for EU efter Brexit. Salg af ydelser til en
          britisk virksomhed er derfor uden dansk moms og hører i{" "}
          <strong>rubrik C</strong> — ikke i rubrik B, og det må ikke
          indberettes til systemet &bdquo;EU-salg uden moms&ldquo;.
        </p>
      </section>

      {PERIODER.map((p) => (
        <section key={p.id} className="hud-panel">
          <div className="hud-head">
            <span className="hud-label">{p.navn}</span>
            <span className="hud-meta">
              {p.datoer} · frist {p.frist}
            </span>
          </div>
          <p
            className={
              p.status === "overskredet"
                ? "regnskab-advarsel"
                : "regnskab-odin-note"
            }
          >
            {p.status === "overskredet" ? "⚠ " : "ᚱ "}
            {p.statusTekst} — {p.resume}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              flexWrap: "wrap",
              margin: "4px 0 14px",
            }}
          >
            <span className="hud-readout hud-readout-xl">
              {p.tilsvar < 0 ? "−" : ""}
              {kr(Math.abs(p.tilsvar))}
            </span>
            <span className="hud-unit">kr. · {p.tilsvarTekst}</span>
          </div>
          <div className="regnskab-rubrikker">
            {p.felter.map((f) => (
              <Talraekke key={f.navn} {...f} />
            ))}
          </div>
        </section>
      ))}

      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛏ</span> Skatten for 2025
          </span>
          <span className="hud-meta">Årsopgørelse nr. 1, 30-03-2026</span>
        </div>
        <p className="regnskab-viden-tekst">
          Årsopgørelsen rammer nul på 68 øre:{" "}
          <em>&bdquo;Du skal hverken betale mere eller have penge tilbage.&ldquo;</em>{" "}
          Det er ikke tilfældigt — din frivillige indbetaling på 69.377 kr. den
          26. marts blev sat til at ramme præcis det tal. Af dem gik 68.785 kr.
          til skatten og 592 kr. til dag-til-dag-rente.
        </p>
        <p className="regnskab-viden-tekst">
          Problemet er grundlaget. Rubrik 111 lyder på{" "}
          <strong>193.906 kr.</strong> Divideret med de tre første rater på
          22.500 £ giver det kurs 8,618. De to sidste rater — 9.960 £ — er ikke
          med. Ved samme kurs skulle hele fakturaen have været{" "}
          <strong>279.742 kr.</strong> Der mangler{" "}
          <strong>85.836 kr.</strong>
        </p>

        <div className="regnskab-viden-tabelwrap">
          <table className="regnskab-viden-tabel">
            <thead>
              <tr>
                <th>Som den står nu</th>
                <th>Kr.</th>
              </tr>
            </thead>
            <tbody>
              {SKAT_NU.map(([n, v]) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="regnskab-viden-tabelwrap">
          <table className="regnskab-viden-tabel">
            <thead>
              <tr>
                <th>Hvis hele fakturaen lægges ind</th>
                <th>Kr.</th>
              </tr>
            </thead>
            <tbody>
              {SKAT_RETTET.map(([n, v]) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="regnskab-viden-tekst">
          Det bliver altså cirka <strong>37.700 kr.</strong> at betale i alt.
          Jane kom selv frem til, at der mangler 32-33.000 kr. — hun er ikke i
          tvivl om beløbet. Uenigheden handler udelukkende om,{" "}
          <em>hvilket år</em> det hører til.
        </p>
        <p className="regnskab-odin-note">
          ᚱ Det her er en periodefejl, ikke unddragelse. Indkomsten er oplyst —
          den står bare i det forkerte år. Derfor er det billigere at rette nu
          end at vente.
        </p>
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">Sådan kommer du videre</span>
          <span className="hud-meta">{TJEKLISTE.length} trin</span>
        </div>
        <ol className="regnskab-viden-trin">
          {TJEKLISTE.map((t) => (
            <li key={t.titel}>
              <strong>{t.titel}</strong>
              <span>{t.tekst}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">Løse ender</span>
        </div>
        <ul className="regnskab-viden-liste">
          <li>
            <strong>Er AMU SYD-fakturaen på 75.000 kr. inklusive moms?</strong>{" "}
            Er den, er salgsmomsen 15.000 kr., og du har tjent 60.000. Skulle
            momsen have været lagt oveni, mangler du at fakturere 18.750 kr. —
            og så skal der sendes en efterfaktura hurtigt.
          </li>
          <li>
            <strong>Udsteder Anthropic fra Irland eller USA?</strong> Euro-betaling
            peger på Irland, altså EU, og så skal beløbet i rubrik A. Det ændrer
            ikke, hvad du skal betale — kun oplysningsfeltet.
          </li>
          <li>
            <strong>Regning fra Jane på de 2.200 kr.</strong> Betalt via MobilePay
            16. og 25. marts. Revisorhonorar er en fradragsberettiget
            driftsudgift, så bed om regningen — den er penge værd for dig.
          </li>
          <li>
            <strong>26.511 kr. under inddrivelse</strong> hos Gældsstyrelsen
            (Haderslev Kommune, opgjort 5. december 2025). Får du moms eller skat
            til gode, modregnes det automatisk, før noget udbetales.
          </li>
          <li>
            <strong>Kommer der mere fra COMMS?</strong> Betalingerne stoppede
            efter 8. juni, og fakturaen er fuldt betalt. Nyt arbejde skal
            faktureres for sig.
          </li>
        </ul>
      </section>

      <p className="admin-fodnote">
        Grundlag: faktura INV-001, årsopgørelse 2025 (nr. 1, 30-03-2026), Wise
        firmakonto, Frøs privatkonto og kvitteringer. Alle beløb er afrundet til
        hele kroner pr. felt, som momsblanketten kræver. Kurs 8,618 er brugt
        hele vejen, så rubrik C og rubrik 111 hviler på samme omregning. Det her
        er en arbejdsopgørelse — ikke autoriseret rådgivning.
      </p>
    </>
  );
}
