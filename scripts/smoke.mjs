import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 3419;
const url = `http://127.0.0.1:${port}/`;
let output = "";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => { output += chunk; });
}

try {
  let response;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js start exited ${server.exitCode}: ${output}`);
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      break;
    } catch { await delay(150); }
  }
  assert.ok(response, `No HTTP response from ${url}. Logs: ${output}`);
  assert.equal(response.status, 200, `Expected root 200. Logs: ${output}`);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/, "HTML lang=ko is required");
  assert.match(html, /개발 환경 준비 중/, "Minimal G1-01 placeholder text was not rendered");
  assert.doesNotMatch(html, /아빠로 들어가기|딸로 들어가기/, "G1-02 role selection must not be implemented early");
  console.log("PASS: root HTTP 200, Korean HTML, placeholder only; no role UI");
} finally {
  server.kill("SIGTERM");
}
