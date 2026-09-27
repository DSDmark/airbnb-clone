#!/usr/bin/env node
// Pixel-diff reference screenshots against clone screenshots with the same
// file names. Writes <name>-diff.png (changed pixels) and <name>-blend.png
// (50/50 overlay, best for spotting 1–4px offsets) and prints a table.
//
//   node scripts/visual-diff.mjs --ref reference/screens --clone artifacts/clone --out artifacts/diff
//
// Exits 1 when any pair differs by more than --max (percent, default 2).
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const { values: args } = parseArgs({
  options: {
    ref: { type: "string", default: "reference/screens" },
    clone: { type: "string", default: "artifacts/clone" },
    out: { type: "string", default: "artifacts/diff" },
    max: { type: "string", default: "2" },
  },
});

const crop = (img, w, h) => {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) img.data.copy(out.data, y * w * 4, y * img.width * 4, y * img.width * 4 + w * 4);
  return out;
};

await mkdir(args.out, { recursive: true });
const names = (await readdir(args.ref)).filter((f) => f.endsWith(".png"));
const rows = [];

for (const name of names) {
  let clone;
  try {
    clone = PNG.sync.read(await readFile(path.join(args.clone, name)));
  } catch {
    rows.push({ name, result: "missing in clone" });
    continue;
  }
  const ref = PNG.sync.read(await readFile(path.join(args.ref, name)));
  const w = Math.min(ref.width, clone.width);
  const h = Math.min(ref.height, clone.height);
  const a = crop(ref, w, h);
  const b = crop(clone, w, h);
  const diff = new PNG({ width: w, height: h });
  const changed = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1, alpha: 0.2 });

  const blend = new PNG({ width: w, height: h });
  for (let i = 0; i < a.data.length; i += 4) {
    for (let c = 0; c < 3; c++) blend.data[i + c] = (a.data[i + c] + b.data[i + c]) >> 1;
    blend.data[i + 3] = 255;
  }
  const base = name.replace(/\.png$/, "");
  await writeFile(path.join(args.out, `${base}-diff.png`), PNG.sync.write(diff));
  await writeFile(path.join(args.out, `${base}-blend.png`), PNG.sync.write(blend));
  rows.push({ name, percent: (100 * changed) / (w * h), sizeMismatch: ref.width !== clone.width || ref.height !== clone.height });
}

let failed = false;
for (const row of rows) {
  if (row.result) {
    console.log(`${row.name.padEnd(40)} ${row.result}`);
    continue;
  }
  const over = row.percent > Number(args.max);
  failed ||= over;
  console.log(
    `${row.name.padEnd(40)} ${row.percent.toFixed(2).padStart(6)}% ${over ? "✗" : "✓"}${row.sizeMismatch ? "  (sizes differ — cropped)" : ""}`,
  );
}
process.exit(failed ? 1 : 0);
