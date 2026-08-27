/**
 * Aflæsning af et bilag — foto eller PDF af en kvittering eller faktura.
 *
 * Tanken er, at bogføringen skal koste så lidt som muligt: tag et billede med
 * telefonen, og lad modellen læse leverandør, dato, beløb og moms ud af det.
 * Du retter kun det, den ikke kunne læse.
 *
 * Aflæsningen bruger et STRICT værktøj frem for at bede om JSON i prosa. Det
 * garanterer, at svaret validerer mod skemaet, så der aldrig skal gættes på
 * halvt parset tekst. Felter, der ikke kan læses, kommer tilbage som null og
 * vises som "kunne ikke læses" — modellen er udtrykkeligt instrueret i aldrig
 * at gætte et beløb.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { Bilag } from "./typer";

export type Aflaesning = NonNullable<Bilag["aflaest"]>;

/** Understøttede billedformater i Messages API'et. */
const BILLEDTYPER = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function kanAflaeses(mediaType: string): boolean {
  return BILLEDTYPER.has(mediaType) || mediaType === "application/pdf";
}

const VEJLEDNING = `Du læser et dansk bilag: en kvittering, en faktura eller en kontoudskrift.

Aflæs felterne og kald værktøjet "bilag_aflaest" med det, du kan læse.

Regler:
- Gæt ALDRIG et beløb, en dato eller et momsbeløb. Kan du ikke læse det tydeligt, så sæt feltet til null og skriv hvad der var ulæseligt i "usikkert".
- Beløb angives i hele enheder med decimaler, fx 1234.56 — ikke som tekst, uden valutategn og uden tusindtalsseparator.
- Står der både et beløb inklusive moms og et momsbeløb, sæt "beloeb" til totalen inklusive moms og "moms" til momsbeløbet.
- Danske kvitteringer skriver ofte momsen som "heraf moms" eller "moms 25%".
- "erhvervsmaessigt" vurderes ud fra, om købet hører til en enkeltmands softwarevirksomhed: hosting, servere, domæner, udviklerværktøjer, AI-abonnementer, computerudstyr, faglitteratur og kontorartikler er erhvervsmæssige. Dagligvarer, restaurantbesøg, tøj, tobak og benzin til privatkørsel er private. Er du i tvivl, sæt null frem for at gætte.
- Skriv begrundelsen på dansk i én sætning.`;

const SKEMA = {
  type: "object" as const,
  properties: {
    leverandoer: {
      type: ["string", "null"],
      description: "Firmaets navn som det står på bilaget",
    },
    dato: {
      type: ["string", "null"],
      description: "Bilagets dato som ÅÅÅÅ-MM-DD",
    },
    beloeb: {
      type: ["number", "null"],
      description: "Samlet beløb inklusive moms",
    },
    moms: {
      type: ["number", "null"],
      description: "Momsbeløbet, hvis det fremgår. Ellers null.",
    },
    valuta: {
      type: ["string", "null"],
      description: "Valutakode, fx DKK, EUR, USD, GBP",
    },
    fakturanummer: { type: ["string", "null"] },
    cvr_eller_vat: {
      type: ["string", "null"],
      description: "Sælgerens CVR- eller momsnummer",
    },
    kategori: {
      type: ["string", "null"],
      enum: [
        "hosting",
        "software-abonnement",
        "ai-api",
        "domaene",
        "hardware",
        "kontor",
        "transport",
        "forsikring",
        "gebyr",
        "faglitteratur",
        "dagligvarer",
        "restaurant",
        "andet",
        null,
      ],
    },
    erhvervsmaessigt: {
      type: ["boolean", "null"],
      description: "true hvis købet hører til virksomheden, false hvis privat, null hvis i tvivl",
    },
    begrundelse: {
      type: ["string", "null"],
      description: "Én sætning på dansk om hvorfor kategorien er valgt",
    },
    usikkert: {
      type: "array",
      items: { type: "string" },
      description: "Felter der ikke kunne læses tydeligt",
    },
  },
  required: [
    "leverandoer",
    "dato",
    "beloeb",
    "moms",
    "valuta",
    "fakturanummer",
    "cvr_eller_vat",
    "kategori",
    "erhvervsmaessigt",
    "begrundelse",
    "usikkert",
  ],
  additionalProperties: false,
};

/** Beløb i hele enheder → øre, uden flydende komma-drift. */
function tilOere(v: number | null | undefined): number | undefined {
  if (v === null || v === undefined || !Number.isFinite(v)) return undefined;
  return Math.round(v * 100);
}

/**
 * Læs et bilag. Kaster aldrig — fejl kommer tilbage i `fejl`, så uploaden
 * lykkes uanset hvad, og felterne kan udfyldes i hånden.
 */
export async function aflaesBilag(
  bytes: Buffer,
  mediaType: string,
): Promise<Aflaesning> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      fejl:
        "Der er ingen ANTHROPIC_API_KEY sat, så bilaget blev ikke aflæst automatisk. Udfyld felterne selv.",
    };
  }
  if (!kanAflaeses(mediaType)) {
    return { fejl: `Filtypen ${mediaType} kan ikke aflæses automatisk.` };
  }

  try {
    const client = new Anthropic();
    const data = bytes.toString("base64");

    const svar = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4000,
      tools: [
        {
          name: "bilag_aflaest",
          description: "Aflever det, du kunne læse af bilaget.",
          strict: true,
          input_schema: SKEMA,
        },
      ],
      tool_choice: { type: "tool", name: "bilag_aflaest" },
      messages: [
        {
          role: "user",
          content: [
            mediaType === "application/pdf"
              ? {
                  type: "document" as const,
                  source: {
                    type: "base64" as const,
                    media_type: "application/pdf" as const,
                    data,
                  },
                }
              : {
                  type: "image" as const,
                  source: {
                    type: "base64" as const,
                    media_type: mediaType as
                      | "image/jpeg"
                      | "image/png"
                      | "image/gif"
                      | "image/webp",
                    data,
                  },
                },
            { type: "text" as const, text: VEJLEDNING },
          ],
        },
      ],
    });

    // Safety-klassifikatoren kan afvise; stop_reason tjekkes før content læses.
    if (svar.stop_reason === "refusal") {
      return { fejl: "Bilaget kunne ikke behandles. Udfyld felterne selv." };
    }

    const kald = svar.content.find((b) => b.type === "tool_use");
    if (!kald || kald.type !== "tool_use") {
      return { fejl: "Bilaget kunne ikke aflæses. Udfyld felterne selv." };
    }

    const r = kald.input as Record<string, unknown>;
    const str = (k: string) =>
      typeof r[k] === "string" && r[k] ? (r[k] as string) : undefined;
    const num = (k: string) =>
      typeof r[k] === "number" ? (r[k] as number) : null;

    return {
      leverandoer: str("leverandoer"),
      dato: str("dato"),
      beloebOere: tilOere(num("beloeb")),
      momsOere: tilOere(num("moms")),
      valuta: str("valuta") ?? "DKK",
      fakturanummer: str("fakturanummer"),
      cvrEllerVat: str("cvr_eller_vat"),
      forslagKategori: str("kategori"),
      erhvervsmaessigt:
        typeof r.erhvervsmaessigt === "boolean" ? r.erhvervsmaessigt : null,
      begrundelse: str("begrundelse"),
      usikkert: Array.isArray(r.usikkert) ? (r.usikkert as string[]) : [],
    };
  } catch (err) {
    return {
      fejl:
        "Bilaget kunne ikke aflæses: " +
        (err instanceof Error ? err.message : "ukendt fejl") +
        ". Udfyld felterne selv.",
    };
  }
}
