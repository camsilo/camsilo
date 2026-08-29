/**
 * Momsopgørelsen — de regler, det koster penge at få galt.
 *
 * Testene er skrevet omkring den konkrete sag, programmet blev bygget til:
 * en faktura udstedt 19. december 2025 til en britisk kunde, betalt i rater
 * hen over foråret 2026. Går periodiseringen galt, havner et kvart million
 * kroner i den forkerte momsperiode og det forkerte indkomstår.
 */
import { describe, expect, it } from "vitest";
import {
  beregnMomsOpgoerelse,
  erEuLand,
  foreslaaFakturaRubrik,
  perioderForAar,
  periodeForDato,
} from "./moms";
import type { Faktura, Transaktion } from "./typer";

const K4_2025 = perioderForAar(2025, "kvartal")[3];
const K1_2026 = perioderForAar(2026, "kvartal")[0];
const K2_2026 = perioderForAar(2026, "kvartal")[1];

function faktura(p: Partial<Faktura> = {}): Faktura {
  return {
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
    ...p,
  };
}

function post(p: Partial<Transaktion> = {}): Transaktion {
  return {
    id: "t1",
    konto: "firma",
    dato: "2026-05-16",
    tekst: "ANTHROPIC",
    beloebOere: -67_923,
    importId: "i1",
    fingeraftryk: "a".repeat(24),
    ts: 0,
    ...p,
  };
}

describe("EU-afgrænsning", () => {
  it("regner ikke Storbritannien for et EU-land", () => {
    // Efter Brexit er UK tredjeland. Salg dertil hører i rubrik C — ikke
    // rubrik B — og må ALDRIG indberettes til "EU-salg uden moms".
    expect(erEuLand("GB")).toBe(false);
  });

  it("kender de EU-lande, der faktisk handles med", () => {
    for (const l of ["DE", "NL", "SI", "SE", "PL"]) {
      expect(erEuLand(l), `${l} skal være EU`).toBe(true);
    }
  });

  it("er ligeglad med store og små bogstaver", () => {
    expect(erEuLand("nl")).toBe(true);
    expect(erEuLand(" NL ")).toBe(true);
  });
});

describe("valg af momsrubrik", () => {
  it("giver dansk moms på danske kunder", () => {
    expect(foreslaaFakturaRubrik("DK")).toBe("salgsmoms");
  });

  it("sender britiske kunder i rubrik C, også med momsnummer", () => {
    expect(foreslaaFakturaRubrik("GB", "GB 208411146")).toBe("rubrikC");
  });

  it("sender EU-virksomheder med momsnummer i rubrik B", () => {
    expect(foreslaaFakturaRubrik("DE", "DE123456789")).toBe("rubrikB");
  });

  it("behandler en EU-kunde UDEN momsnummer som privatkunde", () => {
    // Uden gyldigt momsnummer er der ingen omvendt betalingspligt, og
    // sælgeren hæfter selv for den danske moms.
    expect(foreslaaFakturaRubrik("DE")).toBe("salgsmoms");
  });
});

describe("periodisering efter fakturadato", () => {
  it("lægger fakturaen i 4. kvartal 2025, ikke der hvor pengene kom ind", () => {
    const f = faktura();
    const q4 = beregnMomsOpgoerelse([], K4_2025, [], [f]);
    expect(q4.rubrikCOere).toBe(27_684_485);

    // Betalingerne faldt i 2026 — men momsen hører til 2025.
    for (const p of [K1_2026, K2_2026]) {
      expect(beregnMomsOpgoerelse([], p, [], [f]).rubrikCOere).toBe(0);
    }
  });

  it("holder britisk salg ude af rubrik B", () => {
    const o = beregnMomsOpgoerelse([], K4_2025, [], [faktura()]);
    expect(o.rubrikBYdelserOere).toBe(0);
    expect(o.salgsmomsOere).toBe(0);
  });

  it("markerer perioder uden fakturagrundlag", () => {
    const uden = beregnMomsOpgoerelse([], K4_2025, [], []);
    expect(uden.salgUdenFakturagrundlag).toBe(true);
    const med = beregnMomsOpgoerelse([], K4_2025, [], [faktura()]);
    expect(med.salgUdenFakturagrundlag).toBeUndefined();
  });

  it("tæller ikke salget dobbelt, når både faktura og postering findes", () => {
    // Betalingen ligger i bogen som salgsmoms-postering. Med et
    // fakturagrundlag skal den ignoreres, ellers tælles omsætningen to gange.
    const betaling = post({
      dato: "2025-12-20",
      beloebOere: 27_684_485,
      momsType: "salgsmoms",
      momsOere: 0,
    });
    const o = beregnMomsOpgoerelse([betaling], K4_2025, [], [faktura()]);
    expect(o.omsaetningNettoOere).toBe(27_684_485);
  });
});

describe("dansk salg", () => {
  it("lægger momsen i salgsmoms og holder den ude af omsætningen", () => {
    const amu = faktura({
      id: "f2",
      nummer: "INV-002",
      kunde: "AMU SYD",
      land: "DK",
      fakturadato: "2026-06-22",
      valuta: "DKK",
      beloebOere: 6_000_000,
      momsOere: 1_500_000,
      kurs: 1,
      dkkOere: 6_000_000,
      momsDkkOere: 1_500_000,
      rubrik: "salgsmoms",
    });
    const o = beregnMomsOpgoerelse([], K2_2026, [], [amu]);
    expect(o.salgsmomsOere).toBe(1_500_000);
    expect(o.omsaetningNettoOere).toBe(6_000_000);
    expect(o.rubrikCOere).toBe(0);
    // Momsen skal betales — den er kundens penge, ikke virksomhedens.
    expect(o.tilsvarOere).toBe(1_500_000);
  });
});

describe("omvendt betalingspligt", () => {
  it("går i nul ved fuld fradragsret", () => {
    const anthropic = post({ momsType: "omvendt3land", momsOere: 16_981 });
    const o = beregnMomsOpgoerelse([anthropic], K2_2026, [], []);
    expect(o.ydelseskoebsmomsOere).toBe(16_981);
    expect(o.koebsmomsOere).toBe(16_981);
    expect(o.tilsvarOere).toBe(0);
  });

  it("holder køb uden for EU ude af rubrik A", () => {
    // Den hyppigste fejl i angivelsen: amerikanske abonnementer skal der
    // regnes moms af, men de må ikke i rubrik A — den er kun for EU-køb.
    const usa = post({ momsType: "omvendt3land", momsOere: 16_981 });
    const eu = post({
      id: "t2",
      tekst: "BUNNYCDN",
      beloebOere: -6_653,
      momsType: "omvendt",
      momsOere: 1_663,
    });
    const o = beregnMomsOpgoerelse([usa, eu], K2_2026, [], []);
    expect(o.rubrikAYdelserOere).toBe(6_653); // kun bunny.net
    expect(o.ydelseskoebsmomsOere).toBe(16_981 + 1_663); // moms af begge
  });

  it("efterlader et skyldigt beløb, når fradragsretten er delvis", () => {
    const halv = post({
      momsType: "omvendt3land",
      momsOere: 10_000,
      momsFradragPct: 50,
    });
    const o = beregnMomsOpgoerelse([halv], K2_2026, [], []);
    expect(o.ydelseskoebsmomsOere).toBe(10_000);
    expect(o.koebsmomsOere).toBe(5_000);
    expect(o.tilsvarOere).toBe(5_000);
  });
});

describe("perioder", () => {
  it("dækker året uden huller eller overlap", () => {
    for (const frekvens of ["maaned", "kvartal", "halvaar"] as const) {
      const p = perioderForAar(2026, frekvens);
      expect(p[0].fra).toBe("2026-01-01");
      expect(p[p.length - 1].til).toBe("2026-12-31");
      for (let i = 1; i < p.length; i++) {
        expect(p[i].fra > p[i - 1].til, `${frekvens}: hul eller overlap`).toBe(true);
      }
    }
  });

  it("placerer en dato i den rigtige periode", () => {
    expect(periodeForDato("2025-12-19", "kvartal").noegle).toBe("2025-K4");
    expect(periodeForDato("2026-06-22", "kvartal").noegle).toBe("2026-K2");
    expect(periodeForDato("2026-06-22", "halvaar").noegle).toBe("2026-H1");
  });
});
