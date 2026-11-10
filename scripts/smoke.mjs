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
  const routes = [
    "/dad", "/dad/trends", "/dad/briefing", "/dad/questions", "/dad/talk", "/dad/community", "/dad/perspectives",
    "/daughter", "/daughter/discover", "/daughter/sales", "/daughter/polls", "/daughter/community",
    "/daughter/perspectives", "/?choose=1",
  ];
  for (const path of routes) {
    const res = await fetch(url + path);
    assert.equal(res.status, 200, `Expected 200 for ${path}`);
    const html = await res.text();
    if (path.startsWith("/dad") || path.startsWith("/daughter")) {
      assert.match(html, /aria-label="(?:아빠의 공간|딸의 공간) 주요 메뉴"/);
      assert.match(html, /공간 다시 선택하기/);
    }
  }
  const dadResponse = await fetch(url + "/dad");
  const dadHTML = await dadResponse.text();
  assert.match(dadHTML, /오늘의 딸 트렌드/);
  assert.match(dadHTML, /아빠의 1분 브리핑/);
  assert.match(dadHTML, /시연 콘텐츠/);
  assert.match(dadHTML, /실제 저장되지 않습니다/);
  const daughterResponse = await fetch(url + "/daughter");
  const daughterHTML = await daughterResponse.text();
  assert.match(daughterHTML, /지금 눈여겨볼 이야기/);
  assert.match(daughterHTML, /발견한 장면들/);
  assert.match(daughterHTML, /샘플 게시글/);
  assert.match(daughterHTML, /실제 투표 결과가 아닙니다/);
  assert.match(daughterHTML, /시연 콘텐츠/);
  for (const file of ["headphones-magazine.jpg", "beauty-stilllife.jpg", "cafe-dessert.jpg", "vinyl-night.jpg"]) {
    const image = await fetch(url + "/editorial/" + file);
    assert.equal(image.status, 200, `Expected a self-hosted photograph: ${file}`);
    assert.match(image.headers.get("content-type") ?? "", /image\/jpeg/);
  }
  for (const path of ["/dad/trends/no-fixture", "/daughter/community/no-fixture"]) {
    const res = await fetch(url + path);
    assert.equal(res.status, 404, `Expected 404 for unknown ${path}`);
  }
  console.log("PASS: landing + 13 role routes + choose HTTP 200; both demo homes; 4 local photos; details 404");
} finally {
  server.kill("SIGTERM");
}
