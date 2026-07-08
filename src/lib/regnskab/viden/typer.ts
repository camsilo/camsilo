/**
 * Typer for Odins viden-base — de kildebelagte guides om moms, skat, fradrag,
 * ApS-omdannelse m.m. Indholdet ligger som strukturerede TS-datafiler i denne
 * mappe (én pr. guide) og er skrevet ud fra kildekritisk research; hver
 * guide bærer sine kilder og sin opdateringsdato.
 */

export type Kilde = { titel: string; url: string };

export type VidenBlok =
  | { type: "tekst"; tekst: string }
  | { type: "liste"; punkter: string[] }
  | {
      /** Nummereret klik-for-klik-guide (skat.dk/virk.dk-navigation). */
      type: "trin";
      trin: { titel: string; tekst: string }[];
    }
  | { type: "tabel"; kolonner: string[]; raekker: string[][] }
  | {
      /** Vigtigt forbehold — noget der kan koste penge at misforstå. */
      type: "advarsel";
      tekst: string;
    }
  | {
      /** Odins råd — et godt greb eller en genvej. */
      type: "tip";
      tekst: string;
    };

export type VidenAfsnit = {
  id: string;
  overskrift: string;
  blokke: VidenBlok[];
  kilder?: Kilde[];
};

export type VidenGuide = {
  id: string;
  titel: string;
  /** Elder Futhark-rune til panelhovedet. */
  rune: string;
  emoji: string;
  /** Odins korte introduktion til emnet. */
  intro: string;
  /** Hvornår indholdet sidst er efterprøvet mod kilderne (ISO-dato). */
  opdateret: string;
  afsnit: VidenAfsnit[];
};
