"use client";

/**
 * Bilagspanelet — kvitteringsindbakken.
 *
 * Formålet er, at bogføringen skal koste så få klik som muligt: tag et billede
 * med telefonen, træk det ind, eller indsæt et skærmbillede med Ctrl+V. Bilaget
 * læses automatisk, og du retter kun det, der ikke kunne læses.
 *
 * Uden bilag er der hverken skattefradrag eller momsfradrag — så det her er
 * ikke bureaukrati, det er penge.
 */
import { useRef, useState } from "react";
import type { Bilag } from "@/lib/regnskab/typer";
import { kr } from "@/lib/regnskab/typer";
import {
  opdaterBilagAction,
  sletBilagAction,
  uploadBilagAction,
} from "@/app/admin/regnskab/actions";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});
const pænDato = (iso: string) => fmtDato.format(new Date(`${iso}T12:00:00Z`));

function Maerke({ b }: { b: Bilag }) {
  const a = b.aflaest;
  if (!a || a.fejl) return <span className="regnskab-bilag-maerke usikker">Ikke aflæst</span>;
  if (a.erhvervsmaessigt === true)
    return <span className="regnskab-bilag-maerke erhverv">Erhverv</span>;
  if (a.erhvervsmaessigt === false)
    return <span className="regnskab-bilag-maerke privat">Privat</span>;
  return <span className="regnskab-bilag-maerke usikker">Usikker</span>;
}

export function OdinBilag({ bilag }: { bilag: Bilag[] }) {
  const [travlt, setTravlt] = useState(0);
  const [fejl, setFejl] = useState("");
  const [over, setOver] = useState(false);
  const filValg = useRef<HTMLInputElement>(null);

  async function send(filer: FileList | File[]) {
    setFejl("");
    for (const f of Array.from(filer)) {
      setTravlt((n) => n + 1);
      const fd = new FormData();
      fd.set("fil", f);
      const svar = await uploadBilagAction(fd);
      setTravlt((n) => n - 1);
      if (!svar.ok) setFejl(svar.fejl);
    }
  }

  const ikkeGodkendte = bilag.filter((b) => !b.godkendt).length;

  return (
    <section
      className="hud-panel"
      onPaste={(e) => {
        // Skærmbillede fra udklipsholderen — den hurtigste vej ind.
        const billeder: File[] = [];
        for (const item of Array.from(e.clipboardData.items)) {
          if (item.type.startsWith("image/")) {
            const f = item.getAsFile();
            if (f) billeder.push(new File([f], "skaermbillede.png", { type: f.type }));
          }
        }
        if (billeder.length) {
          e.preventDefault();
          void send(billeder);
        }
      }}
    >
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">ᛗ</span> Bilag
        </span>
        <span className="hud-meta">
          {bilag.length} stk.
          {ikkeGodkendte > 0 && ` · ${ikkeGodkendte} ikke gennemgået`}
        </span>
      </div>

      <p className="regnskab-orakel">
        Uden bilag er der hverken skattefradrag eller momsfradrag. Et billede er
        nok — papiret må gerne smides ud bagefter. Fotografér kvitteringer fra
        kortterminaler med det samme; termopapir falmer på et halvt år.
      </p>

      <div
        className={`regnskab-slip${over ? " over" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => filValg.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            filValg.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (e.dataTransfer.files.length) void send(e.dataTransfer.files);
        }}
      >
        <span className="regnskab-slip-ikon">ᛝ</span>
        <span className="regnskab-slip-titel">
          {travlt > 0
            ? `Læser ${travlt} ${travlt === 1 ? "bilag" : "bilag"} …`
            : "Træk en kvittering herind"}
        </span>
        <span className="regnskab-slip-under">
          eller tryk for at vælge en fil · tag et billede med telefonen · indsæt
          et skærmbillede med Ctrl+V
        </span>
      </div>
      <input
        ref={filValg}
        type="file"
        accept="image/*,application/pdf"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void send(e.target.files);
          e.target.value = "";
        }}
      />

      {fejl && (
        <div className="regnskab-advarsel">
          <p>{fejl}</p>
        </div>
      )}

      {bilag.length === 0 ? (
        <p className="regnskab-orakel">
          Der er ingen bilag endnu. Læg det første ind foroven.
        </p>
      ) : (
        <ul className="regnskab-bilagsliste">
          {bilag.map((b) => {
            const a = b.aflaest ?? {};
            const erBillede = b.mediaType.startsWith("image/");
            return (
              <li key={b.id} className="regnskab-bilag">
                <a
                  href={`/admin/regnskab/bilag/${b.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="regnskab-bilag-billede"
                >
                  {erBillede ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/admin/regnskab/bilag/${b.id}`} alt={b.originaltNavn} />
                  ) : (
                    <span className="regnskab-bilag-pdf">PDF</span>
                  )}
                </a>

                <div className="regnskab-bilag-info">
                  <div className="regnskab-bilag-hoved">
                    <strong>{a.leverandoer ?? b.originaltNavn}</strong>
                    <Maerke b={b} />
                  </div>

                  {a.fejl ? (
                    <p className="regnskab-bilag-fejl">{a.fejl}</p>
                  ) : (
                    <dl className="regnskab-bilag-felter">
                      {a.dato && (
                        <>
                          <dt>Dato</dt>
                          <dd>{pænDato(a.dato)}</dd>
                        </>
                      )}
                      {a.beloebOere !== undefined && (
                        <>
                          <dt>Beløb</dt>
                          <dd>
                            {kr(a.beloebOere)}
                            {a.valuta && a.valuta !== "DKK" && ` ${a.valuta}`}
                          </dd>
                        </>
                      )}
                      {a.momsOere !== undefined && (
                        <>
                          <dt>Heraf moms</dt>
                          <dd>{kr(a.momsOere)}</dd>
                        </>
                      )}
                      {a.fakturanummer && (
                        <>
                          <dt>Fakturanr.</dt>
                          <dd>{a.fakturanummer}</dd>
                        </>
                      )}
                      {a.cvrEllerVat && (
                        <>
                          <dt>CVR / moms</dt>
                          <dd>{a.cvrEllerVat}</dd>
                        </>
                      )}
                      {a.forslagKategori && (
                        <>
                          <dt>Kategori</dt>
                          <dd>{a.forslagKategori}</dd>
                        </>
                      )}
                    </dl>
                  )}

                  {a.begrundelse && (
                    <p className="regnskab-bilag-note">{a.begrundelse}</p>
                  )}
                  {a.usikkert && a.usikkert.length > 0 && (
                    <p className="regnskab-bilag-usikker">
                      Kunne ikke læses tydeligt: {a.usikkert.join(", ")}
                    </p>
                  )}

                  <p className="regnskab-bilag-spor">
                    Lagt ind {pænDato(new Date(b.ts).toISOString().slice(0, 10))} ·{" "}
                    {(b.stoerrelse / 1024).toFixed(0)} kB · fingeraftryk{" "}
                    {b.fingeraftryk.slice(0, 12)}…
                  </p>

                  <div className="regnskab-frist-handling">
                    <button
                      type="button"
                      className="regnskab-miniknap"
                      onClick={() =>
                        void opdaterBilagAction(b.id, { godkendt: !b.godkendt })
                      }
                    >
                      {b.godkendt ? "Gennemgået ✓" : "Markér gennemgået"}
                    </button>
                    <button
                      type="button"
                      className="regnskab-miniknap"
                      onClick={() => {
                        if (!confirm("Slet bilaget? Det kan ikke fortrydes.")) return;
                        void sletBilagAction(b.id);
                      }}
                    >
                      Slet
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
