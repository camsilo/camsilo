/**
 * Odins bibliotek — samlingen af kildebelagte guides. Hver guide bor i sin
 * egen datafil i denne mappe og registreres her i den rækkefølge, den skal
 * stå i viden-fanen.
 */
import type { VidenGuide } from "./typer";
import { MOMS_GUIDE } from "./moms";
import { SKAT_GUIDE } from "./skat";
import { FRADRAG_GUIDE } from "./fradrag";
import { FRISTKALENDER_GUIDE } from "./fristkalender";
import { BOGFOERING_GUIDE } from "./bogfoering";
import { VSO_GUIDE } from "./vso";
import { APS_GUIDE } from "./aps";
import { PRIVAT_GUIDE } from "./privat";

export const VIDEN_GUIDES: VidenGuide[] = [
  MOMS_GUIDE,
  SKAT_GUIDE,
  FRADRAG_GUIDE,
  FRISTKALENDER_GUIDE,
  BOGFOERING_GUIDE,
  VSO_GUIDE,
  APS_GUIDE,
  PRIVAT_GUIDE,
];
