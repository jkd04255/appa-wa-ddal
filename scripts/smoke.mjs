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
    "/dad", "/dad/trends", "/dad/briefing", "/dad/questions", "/dad/talk", "/dad/polls", "/dad/community", "/dad/perspectives",
    "/daughter", "/daughter/discover", "/daughter/sales", "/daughter/polls", "/daughter/community",
    "/?choose=1",
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
  assert.match(daughterHTML, /관심사/);
  assert.match(daughterHTML, /관심 주제/);
  assert.match(daughterHTML, /주제 둘러보기/);
  assert.match(daughterHTML, /daughter-home__topic-count">20/);
  assert.match(daughterHTML, /샘플 게시글/);
  assert.match(daughterHTML, /결과 저장 안 됨/);
  assert.match(daughterHTML, /가상 편집 피드/);
  for (const file of ["headphones-magazine.jpg", "beauty-stilllife.jpg", "cafe-dessert.jpg", "vinyl-night.jpg"]) {
    const image = await fetch(url + "/editorial/" + file);
    assert.equal(image.status, 200, `Expected a self-hosted photograph: ${file}`);
    assert.match(image.headers.get("content-type") ?? "", /image\/jpeg/);
  }
  // G1-06: all twelve exact fixture slugs resolve to safe read-only detail pages.
  const detailRoutes = [
    "/dad/trends/example-favorite-word", "/dad/trends/example-short-video",
    "/dad/trends/example-playlist", "/dad/trends/example-snack", "/dad/trends/example-personal-style",
    "/daughter/discover/sample-offbeat-playlist", "/daughter/discover/sample-beauty-notes",
    "/daughter/discover/sample-cafe-dessert", "/daughter/discover/sample-late-night-vinyl",
    "/daughter/discover/sample-fan-rule", "/daughter/discover/sample-group-chat",
    "/daughter/discover/sample-joke-boundary",
  ];
  for (const path of detailRoutes) {
    const detail = await fetch(url + path);
    assert.equal(detail.status, 200, `Expected 200 for demo detail ${path}`);
    const body = await detail.text();
    assert.match(body, /시연 콘텐츠/);
    assert.match(body, /합성 시연 자료/);
    assert.match(body, /출처/);
  }
  const filtered = await fetch(url + "/daughter/discover?category=beauty");
  assert.equal(filtered.status, 200);
  const filteredHTML = await filtered.text();
  assert.match(filteredHTML, /필터에선 쿨핑크/);
  assert.doesNotMatch(filteredHTML, /40분 줄 서서 샀는데/);
  const unknownCategory = await fetch(url + "/daughter/discover?category=not-a-category");
  assert.equal(unknownCategory.status, 200);
  assert.match(await unknownCategory.text(), /확인할 수 없는 카테고리/);
  const invalidDetailPaths = [
    "/dad/trends/not-a-fixture", "/dad/trends/sample-beauty-notes",
    "/daughter/discover/not-a-fixture", "/daughter/discover/example-snack",
    "/daughter/sales/not-verified", "/daughter/perspectives",
    "/daughter/perspectives/a-comfortable-distance",
  ];
  for (const path of invalidDetailPaths) {
    const response = await fetch(url + path);
    assert.equal(response.status, 404, `Expected 404 for unknown ${path}`);
  }

  // G1-07: role-separated sample communities; read-only posts and non-submitting drafts.
  const communityRoutes = [
    "/dad/community", "/daughter/community",
    "/dad/community/new", "/daughter/community/new",
    "/dad/community/dad-post-demo-01", "/dad/community/dad-post-demo-02", "/dad/community/dad-post-demo-03",
    "/daughter/community/daughter-post-demo-01",
    "/daughter/community/daughter-post-demo-02",
    "/daughter/community/daughter-post-demo-03",
  ];
  for (const path of communityRoutes) {
    const response = await fetch(url + path);
    assert.equal(response.status, 200, `Expected community demo HTTP 200: ${path}`);
    const body = await response.text();
    if (path.endsWith("/new")) {
      assert.match(body, /글쓰기 체험/);
      assert.match(body, /실제 게시하거나 저장하지 않습니다/);
      assert.doesNotMatch(body, /<form\b/);
    } else {
      assert.match(body, /샘플 게시글/);
    }
  }
  for (const path of [
    "/dad/community/daughter-post-demo-01",
    "/daughter/community/dad-post-demo-01",
    "/dad/community/not-fixture",
    "/daughter/community/not-fixture",
  ]) {
    const response = await fetch(url + path);
    assert.equal(response.status, 404, `Expected sample detail 404 for ${path}`);
  }
  // G1-08: both spaces use exactly the same three independent synthetic editorial IDs.
  const perspectiveSlugs = [
    "a-comfortable-distance", "the-pace-of-a-conversation", "different-tastes-together",
  ];
  for (const space of ["dad"]) {
    const list = await fetch(url + `/${space}/perspectives`);
    assert.equal(list.status, 200, `Expected 200 for ${space} fictional perspective list`);
    const html = await list.text();
    assert.match(html, /서로의 시선/);
    assert.match(html, /시연 콘텐츠/);
    assert.match(html, /가상 질문/);
    assert.doesNotMatch(html, /dad-post-demo-0[123]|daughter-post-demo-0[123]/);
    assert.doesNotMatch(html, /<form\\b/);
    for (const slug of perspectiveSlugs) {
      const res = await fetch(url + `/${space}/perspectives/${slug}`);
      assert.equal(res.status, 200, `Expected fictional perspective detail ${space}/${slug}`);
      const body = await res.text();
      assert.match(body, /가상의 아빠 관점/);
      assert.match(body, /가상의 딸 관점/);
      assert.match(body, /원문 없음/);
      assert.doesNotMatch(body, /dad-post-demo-0[123]|daughter-post-demo-0[123]/);
    }
    for (const invalid of ["not-a-perspective", "dad-post-demo-01", "daughter-post-demo-01"]) {
      const res = await fetch(url + `/${space}/perspectives/${invalid}`);
      assert.equal(res.status, 404, `Expected 404 for invalid ${space} editorial slug`);
    }
  }
  const dadPoll = await fetch(url + "/dad/polls");
  assert.equal(dadPoll.status, 200);
  const dadPollHtml = await dadPoll.text();
  assert.match(dadPollHtml, /가상의 대화 상황이라면 어떤 시작이 편할까요/);
  assert.match(dadPollHtml, /쉬는 날의 작은 취향 토너먼트/);
  assert.match(dadPollHtml, /응답·결과·집계를 저장하거나 제공하지 않습니다/);
  assert.doesNotMatch(dadPollHtml, /<form\b/);

  const demoPoll = await fetch(url + "/daughter/polls");
  assert.equal(demoPoll.status, 200);
  const pollHtml = await demoPoll.text();
  assert.match(pollHtml, /주말에 할 콘텐츠를 고른다면/);
  assert.match(pollHtml, /실제 투표/);
  assert.doesNotMatch(pollHtml, /<form\\b/);
  for (const path of ["/dad/trends/no-fixture", "/daughter/community/no-fixture"]) {
    const res = await fetch(url + path);
    assert.equal(res.status, 404, `Expected 404 for unknown ${path}`);
  }
  console.log("PASS: two homes, 9 editorial details, 2 sample communities, 6 sample posts, 2 memory-only composers, dad perspective list, 3 shared editorials, 2 fake poll routes, strict 404");
} finally {
  server.kill("SIGTERM");
}

