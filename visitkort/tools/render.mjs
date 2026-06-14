// Renderer HTML → PNG (screenshot) + PDF (print-to-pdf) via Chrome headless.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const ROOT = 'F:/claudecode/camsilo/visitkort';
const B = `${ROOT}/build`;
const DSF = 8; // device-scale → ~760 DPI previews
const manifest = JSON.parse(fs.readFileSync(`${B}/manifest.json`, 'utf8'));

const base = [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
  '--disable-lcd-text', '--default-background-color=00000000',
  '--force-color-profile=srgb', '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=4000',
];
const fileURL = (p) => 'file:///' + p.replace(/\\/g, '/');

let ok = 0, fail = 0;
for (const job of manifest) {
  const inUrl = fileURL(`${B}/${job.file}`);
  const out = `${B}/${job.out}`;
  let args;
  if (job.kind === 'png') {
    args = [...base, `--force-device-scale-factor=${DSF}`,
      `--window-size=${job.w},${job.h}`, `--screenshot=${out}`, inUrl];
  } else {
    args = [...base, '--no-pdf-header-footer', `--print-to-pdf=${out}`, inUrl];
  }
  const r = spawnSync(CHROME, args, { encoding: 'utf8', timeout: 60000 });
  const exists = fs.existsSync(out) && fs.statSync(out).size > 0;
  if (exists) { ok++; console.log('OK  ', job.out, (fs.statSync(out).size / 1024).toFixed(0) + 'KB'); }
  else { fail++; console.log('FAIL', job.out, (r.stderr || '').split('\n').slice(0, 3).join(' | ')); }
}
console.log(`\nFærdig: ${ok} ok, ${fail} fail`);
