#!/usr/bin/env node
// Build the submission archive: source, AI configs, docs and the architecture
// diagram — without dependencies, build output or local artefacts.
//
//   npm run package   →   submission/airbnb-clone.zip
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const OUT = "submission/airbnb-clone.zip";
const EXCLUDE = [
  "node_modules/*",
  ".next/*",
  "submission/*",
  "artifacts/*",
  "test-results/*",
  "playwright-report/*",
  "*.tsbuildinfo",
  ".env*",
  ".DS_Store",
];

mkdirSync("submission", { recursive: true });
rmSync(OUT, { force: true });
execFileSync("zip", ["-r", "-q", OUT, ".", "-x", ...EXCLUDE], { stdio: "inherit" });
execFileSync("unzip", ["-l", OUT], { stdio: ["ignore", "ignore", "inherit"] });
console.log(`wrote ${OUT}`);
