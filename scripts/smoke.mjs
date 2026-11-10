import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 3419;
const url = `http://127.0.0.1:${port}`;
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
    if (server.exitCode !== null) throw new Error(`Next start exited ${server.exitCode}: ${output}`);
    try { response = await fetch(url + "/", { signal: AbortSignal.timeout(2000) }); break; }
    catch { await delay(150); }
  }
  assert.ok(response, `No HTTP response from ${url}. Logs: ${output}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ko"/);
  assert.match(html, /아빠와 딸/);
  assert.match(html, /아빠로 들어가기/);  // no-JS fallback
  assert.match(html, /딸로 들어가기/);
  for (const path of ["/dad", "/daughter", "/?choose=1"]) {
    const res = await fetch(url + path);
    assert.equal(res.status, 200, `Expected 200 for ${path}`);
  }
  console.log("PASS: root, both spaces and explicit choice HTTP 200, lang=ko and no-JS fallback");
} finally {
  server.kill("SIGTERM");
}
