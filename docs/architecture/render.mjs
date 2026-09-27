#!/usr/bin/env node
// Render architecture.html → architecture.png (2x) and architecture.pdf.
//   python3 docs/architecture/build-diagram.py && node docs/architecture/render.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 2000, height: 1360 }, deviceScaleFactor: 2 });
await page.goto(`file://${path.join(here, "architecture.html")}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(here, "architecture.png"), fullPage: true });
await page.pdf({
  path: path.join(here, "architecture.pdf"),
  width: "2000px",
  height: "1360px",
  printBackground: true,
  pageRanges: "1",
});
await browser.close();
console.log("rendered architecture.png + architecture.pdf");
