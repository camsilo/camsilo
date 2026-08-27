/**
 * Udlevering af et bilag — billedet eller PDF'en bag en kvittering.
 *
 * Ruten ligger under /admin, og adgangen tjekkes på hver eneste forespørgsel.
 * Bilagsfilerne indeholder fakturaer, kontonumre og beløb, så de må aldrig
 * kunne hentes uden en gyldig admin-session — heller ikke af nogen, der har
 * gættet et bilag-id.
 */
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { erAdmin } from "@/lib/admin-auth";
import { bilagSti, hentBilag } from "@/lib/regnskab/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await erAdmin())) {
    return new NextResponse("Ingen adgang", { status: 401 });
  }

  const { id } = await ctx.params;
  const alle = await hentBilag();
  const bilag = alle.find((b) => b.id === id);
  if (!bilag) {
    return new NextResponse("Bilaget findes ikke", { status: 404 });
  }

  try {
    const bytes = await readFile(bilagSti(bilag.gemtSom));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "content-type": bilag.mediaType,
        // Bilag er persondata — hverken browser eller mellemled må gemme dem.
        "cache-control": "private, no-store",
        "content-disposition": `inline; filename="${encodeURIComponent(
          bilag.originaltNavn,
        )}"`,
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Filen kunne ikke læses", { status: 410 });
  }
}
