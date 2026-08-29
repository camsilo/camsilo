/**
 * Fradragsmålere og årsopgørelsens rubrikker.
 *
 * Det væsentlige her er forskellen på "ikke brugt" og "ved det ikke". Et
 * fradrag, programmet ikke kan se — fagforening, a-kasse, pension —
 * indberettes af andre. Viser måleren nul for dem, ligner det et ubrugt
 * fradrag, man selv kan hente. Det kan man ikke: står feltet tomt på
 * årsopgørelsen, mangler indberetningen, og man skal ringe til dem.
 */
import { describe, expect, it } from "vitest";
import {
  FRADRAGSLOFTER_2026,
  beregnFradragsMaalere,
} from "./fradragslofter";
import {
  AARSRUBRIKKER_2026,
  OVERSETE,
  SKAL_SELV,
  kanRettes,
  rettefristFor,
} from "./aarsopgoerelse";
import type { Transaktion } from "./typer";

function post(p: Partial<Transaktion> = {}): Transaktion {
  return {
    id: "t1",
    konto: "privat",
    dato: "2026-03-01",
    tekst: "Noget",
    beloebOere: -100_000,
    importId: "i1",
    fingeraftryk: "a".repeat(24),
    ts: 0,
    ...p,
  };
}

describe("fradragsmålere", () => {
  it("skelner mellem ubrugt og ukendt", () => {
    const m = beregnFradragsMaalere([], 2026);

    const service = m.find((x) => x.loft.id === "service")!;
    expect(service.brugtOere).toBe(0); // kan ses i bogen — reelt ubrugt
    expect(service.tilbageOere).toBe(1_830_000);

    const fagforening = m.find((x) => x.loft.id === "fagforening")!;
    expect(fagforening.brugtOere).toBe(0);
  });

  it("markerer fradrag uden loft som uden loft", () => {
    const m = beregnFradragsMaalere([], 2026);
    const drift = m.find((x) => x.loft.id === "driftsudgifter")!;
    expect(drift.loft.loftOere).toBeNull();
    expect(drift.tilbageOere).toBeNull();
  });

  it("tæller forbrug fra de rigtige kategorier", () => {
    const t = [
      post({ kategori: "service", beloebOere: -500_000 }),
      post({ id: "t2", kategori: "dagligvarer", beloebOere: -30_000 }),
    ];
    const m = beregnFradragsMaalere(t, 2026);
    const service = m.find((x) => x.loft.id === "service")!;
    expect(service.brugtOere).toBe(500_000);
    expect(service.tilbageOere).toBe(1_830_000 - 500_000);
  });

  it("holder sig inden for året", () => {
    const t = [post({ kategori: "service", dato: "2025-06-01", beloebOere: -500_000 })];
    expect(beregnFradragsMaalere(t, 2026).find((x) => x.loft.id === "service")!.brugtOere).toBe(0);
    expect(beregnFradragsMaalere(t, 2025).find((x) => x.loft.id === "service")!.brugtOere).toBe(500_000);
  });

  it("går ikke i negativ, når loftet er overskredet", () => {
    const t = [post({ kategori: "service", beloebOere: -2_500_000 })];
    const m = beregnFradragsMaalere(t, 2026).find((x) => x.loft.id === "service")!;
    expect(m.tilbageOere).toBe(0);
    expect(m.pct).toBe(100);
    expect(m.potentialeOere).toBe(0);
  });

  it("regner potentialet som resten gange fradragets værdi", () => {
    const m = beregnFradragsMaalere([], 2026).find((x) => x.loft.id === "haandvaerker")!;
    // 9.000 kr. ubrugt × 26 øre pr. krone.
    expect(m.potentialeOere).toBe(Math.round(900_000 * 0.26));
  });

  it("har verificerede lofter for 2026", () => {
    const loft = (id: string) =>
      FRADRAGSLOFTER_2026.find((f) => f.id === id)!.loftOere;
    expect(loft("fagforening")).toBe(700_000); // 7.000 kr.
    expect(loft("smaaanskaffelser")).toBe(3_600_000); // 36.000 kr.
    expect(loft("service")).toBe(1_830_000); // 18.300 kr.
    expect(loft("haandvaerker")).toBe(900_000); // 9.000 kr.
    expect(loft("gaver")).toBe(2_000_000); // 20.000 kr.
    expect(loft("ratepension")).toBe(6_870_000); // 68.700 kr.
    expect(loft("rejse")).toBe(3_440_000); // 34.400 kr.
  });

  it("giver et fradrag i personlig indkomst højere værdi end et ligningsmæssigt", () => {
    const pension = FRADRAGSLOFTER_2026.find((f) => f.id === "ratepension")!;
    const fagforening = FRADRAGSLOFTER_2026.find((f) => f.id === "fagforening")!;
    expect(pension.vaerdiPrKrone).toBeGreaterThan(fagforening.vaerdiPrKrone);
  });
});

describe("årsopgørelsens rubrikker", () => {
  it("har intet gættet rubriknummer", () => {
    for (const r of AARSRUBRIKKER_2026) {
      expect(r.nr, "rubriknummer må ikke være tomt").toBeTruthy();
      expect(r.nr).toMatch(/^\d+$/);
      expect(r.hjemmel, `rubrik ${r.nr} mangler hjemmel`).toBeTruthy();
      expect(r.forklaring.length, `rubrik ${r.nr} mangler forklaring`).toBeGreaterThan(80);
    }
  });

  it("har entydige rubriknumre", () => {
    const numre = AARSRUBRIKKER_2026.map((r) => r.nr);
    expect(new Set(numre).size).toBe(numre.length);
  });

  it("markerer kørselsfradraget som noget man selv skal udfylde", () => {
    // Skattestyrelsen udfylder rubrik 51 aldrig — heller ikke fra
    // forskudsopgørelsen. Det er det mest oversete fradrag i landet.
    const r = AARSRUBRIKKER_2026.find((x) => x.nr === "51")!;
    expect(r.udfylder).toBe("selv");
    expect(r.overset).toBe(true);
  });

  it("markerer fagforening og a-kasse som låste med en indberetter", () => {
    for (const nr of ["50", "52", "55"]) {
      const r = AARSRUBRIKKER_2026.find((x) => x.nr === nr)!;
      expect(r.udfylder, `rubrik ${nr}`).toBe("laast");
      expect(r.indberetter, `rubrik ${nr} mangler indberetter`).toBeTruthy();
    }
  });

  it("peger på både de oversete og dem man selv skal udfylde", () => {
    expect(OVERSETE.length).toBeGreaterThan(3);
    expect(SKAL_SELV.length).toBeGreaterThan(3);
    expect(SKAL_SELV.every((r) => r.udfylder === "selv")).toBe(true);
  });
});

describe("genoptagelsesfrist", () => {
  it("løber til 1. maj i det fjerde år efter indkomståret", () => {
    expect(rettefristFor(2025)).toBe("2029-05-01");
    expect(rettefristFor(2022)).toBe("2026-05-01");
  });

  it("regner 2022 for lukket og 2023 for åben i dag", () => {
    const idag = "2026-08-29";
    expect(kanRettes(2022, idag)).toBe(false);
    expect(kanRettes(2023, idag)).toBe(true);
    expect(kanRettes(2025, idag)).toBe(true);
  });

  it("holder fristen åben på selve fristdagen", () => {
    expect(kanRettes(2022, "2026-05-01")).toBe(true);
    expect(kanRettes(2022, "2026-05-02")).toBe(false);
  });
});
