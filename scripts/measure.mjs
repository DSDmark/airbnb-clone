#!/usr/bin/env node
// Dump a style census (boxes, fonts, colours, shadows, transitions) for a page
// — the clone, or any page you are allowed to automate — so layouts can be
// compared numerically instead of by eye.
//
//   node scripts/measure.mjs --url http://localhost:3100 --out artifacts/census-clone.json [--root main]
import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { chromium } from "playwright";
import { census } from "./lib/census.mjs";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3100/" },
    out: { type: "string", default: "artifacts/census.json" },
    root: { type: "string", default: "body" },
    width: { type: "string", default: "1440" },
  },
});

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: Number(args.width), height: 900 } });
await page.goto(args.url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const data = await page.evaluate(`(${census.toString()})(${JSON.stringify(args.root)})`);
await writeFile(args.out, JSON.stringify(data, null, 2));
console.log(`${data.text.length} text runs, ${data.controls.length} controls, ${data.images.length} images → ${args.out}`);
await browser.close();
