/**
 * Periodevalgene. Fejl her rammer alle tal på skærmen på én gang, fordi
 * intervallet er det, alt andet filtreres på.
 */
import { describe, expect, it } from "vitest";
import {
  FIRMA_START,
  PERIODEVALG,
  antalDage,
  beskrivInterval,
  intervalFor,
} from "./perioder";

const IDAG = "2026-08-29";
const AELDSTE = "2024-12-30";
const FOERSTE_FAKTURA = "2025-12-19";

const i = (id: Parameters<typeof intervalFor>[0]) =>
  intervalFor(id, IDAG, AELDSTE, FOERSTE_FAKTURA);

describe("periodevalg", () => {
  it("slutter altid i dag, undtagen for sidste år", () => {
    for (const v of PERIODEVALG) {
      const r = i(v.id);
      if (v.id === "sidsteaar") expect(r.til).toBe("2025-12-31");
      else expect(r.til, v.id).toBe(IDAG);
    }
  });

  it("starter aldrig efter den slutter", () => {
    for (const v of PERIODEVALG) {
      const r = i(v.id);
      expect(r.fra <= r.til, `${v.id}: ${r.fra} > ${r.til}`).toBe(true);
    }
  });

  it("tæller dagsintervaller inklusivt i begge ender", () => {
    expect(antalDage(i("idag"))).toBe(1);
    expect(antalDage(i("7d"))).toBe(7);
    expect(antalDage(i("30d"))).toBe(30);
    expect(antalDage(i("90d"))).toBe(90);
  });

  it("bruger virksomhedens CVR-startdato", () => {
    expect(FIRMA_START).toBe("2025-10-01");
    expect(i("firmastart").fra).toBe("2025-10-01");
  });

  it("bruger den første fakturas dato, når den kendes", () => {
    expect(i("foerste-faktura").fra).toBe(FOERSTE_FAKTURA);
  });

  it("falder tilbage til firmaets start, når der ingen faktura er", () => {
    expect(intervalFor("foerste-faktura", IDAG, AELDSTE).fra).toBe(FIRMA_START);
  });

  it("går helt tilbage til den ældste postering ved Alt", () => {
    expect(i("alt").fra).toBe(AELDSTE);
  });

  it("skærer kun 12-timers-valget på importtidspunkt", () => {
    expect(i("12t").fraTs).toBeTypeOf("number");
    for (const v of PERIODEVALG.filter((p) => p.id !== "12t")) {
      expect(i(v.id).fraTs, v.id).toBeUndefined();
    }
  });

  it("forklarer 12-timers-valget, så tallet ikke misforstås", () => {
    expect(i("12t").forklaring).toMatch(/klokkeslæt|kommet ind i programmet/);
  });

  it("navngiver årene med det faktiske årstal", () => {
    expect(i("iaar").navn).toContain("2026");
    expect(i("sidsteaar").navn).toContain("2025");
  });

  it("beskriver intervallet læseligt", () => {
    expect(beskrivInterval(i("idag"))).not.toContain("–");
    const alt = beskrivInterval(i("alt"));
    expect(alt).toContain("–");
    expect(alt).toContain("dage");
  });

  it("falder tilbage på et gyldigt valg ved ukendt id", () => {
    const r = intervalFor("noget-vaas" as never, IDAG, AELDSTE);
    expect(r.fra <= r.til).toBe(true);
  });
});
