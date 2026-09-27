#!/usr/bin/env node
// Screenshot a page at fixed scroll offsets (and, for the clone, its overlay
// states) so it can be diffed against reference captures of the same size.
//
//   node scripts/capture.mjs --url http://localhost:3100 --out artifacts/clone
//   node scripts/capture.mjs --url http://localhost:3100 --out artifacts/clone --states
//
// Options: --width 1440 --height 900 --offsets 0,800,1600  (default: every 800px)
import { mkdir } from "node:fs/promises";
import { parseArgs } from "node:util";
import { chromium } from "playwright";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3100/" },
    out: { type: "string", default: "artifacts/clone" },
    width: { type: "string", default: "1440" },
    height: { type: "string", default: "900" },
    offsets: { type: "string" },
    states: { type: "boolean", default: false },
  },
});

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: Number(args.width), height: Number(args.height) } });
await mkdir(args.out, { recursive: true });

await page.goto(args.url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Walk the page once so lazy images and iframes load before the shots.
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 700) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(150);
}
await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});

const offsets = args.offsets
  ? args.offsets.split(",").map(Number)
  : Array.from({ length: Math.ceil(height / 800) }, (_, i) => i * 800);

for (const [i, y] of offsets.entries()) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${args.out}/page-${String(i).padStart(2, "0")}-${y}.png` });
}

if (args.states) {
  const shot = async (name) => {
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${args.out}/state-${name}.png` });
  };
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Show all photos" }).click();
  await shot("photo-tour");
  await page.getByRole("dialog", { name: "Photo tour" }).getByRole("button", { name: /photo 1 of/ }).first().click();
  await shot("lightbox");
  await page.keyboard.press("ArrowRight");
  await shot("lightbox-next");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  for (const [name, button] of [
    ["description", "Show more about this place"],
    ["amenities", /Show all \d+ amenities/],
    ["reviews", /Show all \d+ reviews/],
  ]) {
    await page.getByRole("button", { name: button }).click();
    await shot(`modal-${name}`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }
}

console.log(`captured ${offsets.length} offsets${args.states ? " + overlay states" : ""} → ${args.out}`);
await browser.close();
