#!/usr/bin/env node
// PostToolUse hook: lint the TS/TSX file Claude just edited. On problems, exit 2
// so the ESLint output is fed back to the agent to fix immediately.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const file = input?.tool_input?.file_path;
if (!file || !/\.(ts|tsx)$/.test(file) || file.includes("node_modules")) process.exit(0);

try {
  execFileSync("npx", ["eslint", "--max-warnings=0", file], {
    cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  process.stderr.write(`ESLint found problems in ${file}:\n${error.stdout?.toString() ?? ""}${error.stderr?.toString() ?? ""}`);
  process.exit(2);
}
