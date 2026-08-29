/**
 * Skattemotoren og valutaomregningen.
 *
 * To ting skal holde her. Omsætningen skal følge FAKTURADATOEN, ellers havner
 * årets resultat i det forkerte indkomstår. Og kursgevinsten skal holdes UDEN
 * FOR virksomhedens resultat — den er kapitalindkomst og hører i rubrik 39,
 * ikke i overskuddet.
 */
import { describe, expect, it } from "vitest";
import { beregnSkatteOpgoerelse, fradragsbeloebOere } from "./skat";
import {
  KURSGEVINST_BAGATELGRAENSE_OERE,
  kursdifferenceOere,
  skalKursgevinstOplyses,
  tilDkkOere,
} from "./valuta";
import { STANDARD_INDSTILLINGER, type Faktura, type Transaktion } from "./typer";

const INDST = { ...STANDARD_INDSTILLINGER, kommuneskatPct: 25.0, loenAarOere: 0 };

const INV001: Faktura = {
  id: "f1",
  nummer: "INV-001",
  kunde: "COMMS INSTALLATIONS LIMITED",
  land: "GB",
  fakturadato: "2025-12-19",
  valuta: "GBP",
  beloebOere: 3_246_000,
  momsOere: 0,
  kurs: 8.5288,
  dkkOere: 27_684_485,
  momsDkkOere: 0,
  rubrik: "rubrikC",
  ts: 0,
};

function post(p: Partial<Transaktion> = {}): Transaktion {
  return {
    id: "t1",
    konto: "firma",
    dato: "2025-11-03",
    tekst: "RENDER.COM",
    beloebOere: -2_346,
    importId: "i1",
    fingeraftryk: "a".repeat(24),
    ts: 0,
    ...p,
  };
}

describe("omsætning følger fakturadatoen", () => {
  it("lægger hele fakturaen i 2025, selv om pengene kom i 2026", () => {
    const o25 = beregnSkatteOpgoerelse([], 2025, INDST, [INV001], []);
    expect(o25.omsaetningOere).toBe(27_684_485);

    const o26 = beregnSkatteOpgoerelse([], 2026, INDST, [INV001], []);
    expect(o26.omsaetningOere).toBe(0);
  });

  it("holder momsen ude af omsætningen på dansk salg", () => {
    const amu: Faktura = {
      ...INV001,
      id: "f2",
      nummer: "INV-002",
      land: "DK",
      fakturadato: "2026-06-22",
      valuta: "DKK",
      beloebOere: 6_000_000,
      momsOere: 1_500_000,
      kurs: 1,
      dkkOere: 6_000_000,
      momsDkkOere: 1_500_000,
      rubrik: "salgsmoms",
    };
    const o = beregnSkatteOpgoerelse([], 2026, INDST, [amu], []);
    // 60.000 kr., ikke 75.000 — de 15.000 er statens penge.
    expect(o.omsaetningOere).toBe(6_000_000);
  });

  it("siger til, når omsætningen er læst af posteringerne", () => {
    const uden = beregnSkatteOpgoerelse([], 2025, INDST, [], []);
    expect(uden.omsaetningUdenFakturagrundlag).toBe(true);
    const med = beregnSkatteOpgoerelse([], 2025, INDST, [INV001], []);
    expect(med.omsaetningUdenFakturagrundlag).toBeUndefined();
  });
});

describe("kursgevinst", () => {
  it("holdes uden for virksomhedens resultat", () => {
    const kd = [
      {
        id: "k1",
        fakturaId: "f1",
        aar: 2026,
        bogfoertOere: 27_684_485,
        modtagetOere: 27_919_464,
        differenceOere: 234_979,
        ts: 0,
      },
    ];
    const o = beregnSkatteOpgoerelse([], 2026, INDST, [], kd);
    expect(o.kursgevinstOere).toBe(234_979);
    // Gevinsten er kapitalindkomst — den må ikke havne i resultatet.
    expect(o.resultatOere).toBe(0);
  });

  it("henføres til det år, vekslingen skete — ikke faktureringsåret", () => {
    const kd = [
      { id: "k1", fakturaId: "f1", aar: 2026, bogfoertOere: 0, modtagetOere: 0, differenceOere: 234_979, ts: 0 },
    ];
    expect(beregnSkatteOpgoerelse([], 2025, INDST, [INV001], kd).kursgevinstOere).toBe(0);
    expect(beregnSkatteOpgoerelse([], 2026, INDST, [], kd).kursgevinstOere).toBe(234_979);
  });

  it("bruger bagatelgrænsen som tærskel, ikke som bundfradrag", () => {
    // Under grænsen: skal slet ikke oplyses. Over: HELE beløbet skal med.
    expect(skalKursgevinstOplyses(199_999)).toBe(false);
    expect(skalKursgevinstOplyses(KURSGEVINST_BAGATELGRAENSE_OERE)).toBe(false);
    expect(skalKursgevinstOplyses(200_001)).toBe(true);
  });

  it("gælder også for tab", () => {
    expect(skalKursgevinstOplyses(-234_979)).toBe(true);
    expect(skalKursgevinstOplyses(-1_000)).toBe(false);
  });

  it("regner differencen som modtaget minus bogført", () => {
    expect(kursdifferenceOere(27_684_485, 27_919_464)).toBe(234_979);
    expect(kursdifferenceOere(27_919_464, 27_684_485)).toBe(-234_979);
  });
});

describe("valutaomregning", () => {
  it("omregner pence til øre med kursen", () => {
    // 32.460,00 £ × 8,5288 = 276.844,85 kr.
    expect(tilDkkOere(3_246_000, 8.5288)).toBe(27_684_485);
  });

  it("afrunder til hele øre, så der ikke opstår brøkører", () => {
    const r = tilDkkOere(333, 8.5288);
    expect(Number.isInteger(r)).toBe(true);
  });

  it("lader DKK stå urørt", () => {
    expect(tilDkkOere(6_000_000, 1)).toBe(6_000_000);
  });
});

describe("fradragsberegning", () => {
  it("lægger den beregnede moms til grundlaget ved omvendt betalingspligt", () => {
    // Fakturaen er netto. Ved fuld fradragsret er momsen neutral, så
    // fradraget er selve fakturabeløbet.
    const t = post({ beloebOere: -100_000, momsType: "omvendt3land", momsOere: 25_000 });
    expect(fradragsbeloebOere(t)).toBe(100_000);
  });

  it("tæller ikke-fradragsberettiget moms med som en reel omkostning", () => {
    const t = post({
      beloebOere: -100_000,
      momsType: "omvendt3land",
      momsOere: 25_000,
      momsFradragPct: 0,
    });
    expect(fradragsbeloebOere(t)).toBe(125_000);
  });

  it("trækker den fradragne moms fra ved dansk køb", () => {
    const t = post({ beloebOere: -125_000, momsType: "koebsmoms", momsOere: 25_000 });
    expect(fradragsbeloebOere(t)).toBe(100_000);
  });

  it("giver intet fradrag for private hævninger", () => {
    const t = post({ beloebOere: -15_075_530, momsType: "udenfor" });
    expect(fradragsbeloebOere(t)).toBe(0);
  });

  it("nedsætter omkostningerne ved en refusion", () => {
    const t = post({ beloebOere: 100_000, momsType: "koebsmoms", momsOere: 20_000 });
    expect(fradragsbeloebOere(t)).toBe(-80_000);
  });

  it("rører ikke privat-bogen", () => {
    const t = post({ konto: "privat", beloebOere: -24_095, momsType: "koebsmoms" });
    expect(fradragsbeloebOere(t)).toBe(0);
  });
});

describe("skatteestimat", () => {
  it("regner AM-bidrag af hele overskuddet", () => {
    const o = beregnSkatteOpgoerelse([], 2025, INDST, [INV001], []);
    expect(o.resultatOere).toBe(27_684_485);
    expect(o.amBidragOere).toBe(Math.round(27_684_485 * 0.08));
  });

  it("estimerer ingen skat ved underskud", () => {
    const udgift = post({ dato: "2026-03-01", beloebOere: -50_000, momsType: "koebsmoms" });
    const o = beregnSkatteOpgoerelse([udgift], 2026, INDST, [], []);
    expect(o.resultatOere).toBeLessThan(0);
    expect(o.estimeretSkatOere).toBe(0);
  });

  it("holder sig inden for en troværdig marginalprocent", () => {
    const o = beregnSkatteOpgoerelse([], 2025, INDST, [INV001], []);
    // Uden løn ved siden af og uden topskat: AM 8 % + ca. 37 % af resten.
    expect(o.marginalPct).toBeGreaterThan(35);
    expect(o.marginalPct).toBeLessThan(50);
  });
});
