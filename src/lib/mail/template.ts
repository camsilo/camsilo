/**
 * Brandet e-mail-skabelon (Camsilo) til udgående mails fra admin.
 *
 * Anti-spam / deliverability: table-baseret + inline styles (e-mail-klienter
 * stripper <style>), web-sikre fonte, max 600px, ÉT hosted logo (ikke base64),
 * lys baggrund + læsbar tekst, og ALTID en plain-text-variant (multipart). SPF/
 * DKIM/DMARC sættes af PostStack på det verificerede domæne.
 */

const LOGO = "https://camsilo.dk/icons/icon-192.png";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ren tekst → afsnit i brand-skabelonen. */
export function byggHtml(tekst: string): string {
  const afsnit = tekst
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;">${esc(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>Camsilo</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ece6da;">
  <tr><td style="background:#0d0b09;padding:22px 30px;">
    <img src="${LOGO}" width="38" height="38" alt="Camsilo" style="vertical-align:middle;border-radius:8px;display:inline-block;">
    <span style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:bold;letter-spacing:5px;color:#f5f0e8;vertical-align:middle;padding-left:12px;">CAMSILO</span>
  </td></tr>
  <tr><td style="height:3px;line-height:3px;font-size:0;background:#f26a1b;">&nbsp;</td></tr>
  <tr><td style="padding:30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1c1a17;">
    ${afsnit}
  </td></tr>
  <tr><td style="padding:18px 30px;background:#faf7f0;border-top:1px solid #efe9dd;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8a8275;">
    <strong style="color:#5a544a;">Camsilo</strong> — dansk softwarestudie<br>
    <a href="https://camsilo.dk" style="color:#b8400a;text-decoration:none;">camsilo.dk</a> &nbsp;·&nbsp; kontakt@camsilo.dk &nbsp;·&nbsp; CVR 45925145
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text-variant (multipart) — vigtig for at undgå spam-filtre. */
export function byggTekst(tekst: string): string {
  return `${tekst.trim()}\n\n—\nCamsilo — dansk softwarestudie\ncamsilo.dk · kontakt@camsilo.dk · CVR 45925145`;
}
