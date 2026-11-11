import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const slugs = [
  "a-comfortable-distance", "the-pace-of-a-conversation", "different-tastes-together",
] as const;
const titles = ["서로 편안한 대화의 거리", "서로에게 필요한 대화의 속도", "다른 취향을 나누는 방식"];
const spaces = ["dad", "daughter"] as const;

test("public perspective contract contains no raw UGC import, author, vote or sample-size fields", () => {
  const fixture = readFileSync("src/data/fixtures/shared-perspectives.ts", "utf8");
  const model = readFileSync("src/domain/perspective-editorial.ts", "utf8");
  for (const term of [
    /from\s+["'][^"']*community/i,
    /import\s*\([^)]*community/i,
    /DAD_COMMUNITY_POSTS|DAUGHTER_COMMUNITY_POSTS|DAD_COMMUNITY_PREVIEW|DAUGHTER_COMMUNITY\b/,
    /authorId\s*:|originalPostId\s*:|rawQuote\s*:|sampleSize\s*:|pollVote\s*:/,
    /fetch\s*\(|localStorage|sessionStorage|document\.cookie|server action|post\s*\(/i,
  ]) {
    expect(fixture, String(term)).not.toMatch(term);
  }
  expect(model).not.toMatch(/import\s.*community/);
  expect(fixture).toContain("hand-written fictional editorial pairs");
});

for (const space of spaces) {
  test(`${space} perspective index contains three identical synthetic editorial IDs and read links`, async ({ page }) => {
    const response = await page.goto(`/${space}/perspectives`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "서로의 시선" })).toBeVisible();
    await expect(page.locator(".perspectives__card")).toHaveCount(3);
    await expect(page.locator(".perspectives__card .perspectives__stamp")).toHaveCount(3);
    await expect(page.getByRole("main")).toContainText("시연 콘텐츠");
    await expect(page.getByRole("main")).toContainText("실제 아빠·딸의 게시글");
    await expect(page.getByRole("main")).toContainText("응답자 수");
    await expect(page.getByRole("navigation", { name: space === "dad" ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴" })
      .getByRole("link", { name: "서로의 시선" })).toHaveAttribute("aria-current", "page");
    expect(await page.locator(".perspectives__card h3").allTextContents()).toEqual(titles);
    expect(await page.locator(".perspectives__card .perspectives__action").evaluateAll((links) =>
      links.map(a => (a as HTMLAnchorElement).getAttribute("href"))))
      .toEqual(slugs.map(s => `/${space}/perspectives/${s}`));
  });

  test(`${space} all three detail slugs have source and careful fictional paired views`, async ({ page }) => {
    for (let i=0;i<slugs.length;i++) {
      const res = await page.goto(`/${space}/perspectives/${slugs[i]}`);
      expect(res?.status(), slugs[i]).toBe(200);
      await expect(page.getByRole("heading",{level:1,name:titles[i]})).toBeVisible();
      await expect(page.getByRole("heading",{name:"가상의 아빠 관점"})).toBeVisible();
      await expect(page.getByRole("heading",{name:"가상의 딸 관점"})).toBeVisible();
      await expect(page.getByRole("heading",{name:"자료 상태·출처"})).toBeVisible();
      await expect(page.getByRole("main")).toContainText("원문 없음");
      await expect(page.getByRole("main")).toContainText("확인일 해당 없음");
      await expect(page.getByRole("main")).toContainText("합성된 편집 관점");
      await page.getByRole("link",{name:/서로의 시선 목록으로 돌아가기/}).click();
      await expect(page).toHaveURL(new RegExp(`/${space}/perspectives$`));
    }
  });

  test(`${space} invalid or community-like perspective slugs safely 404`,async ({page}) => {
    for(const slug of ["missing-perspective","dad-post-demo-01","daughter-post-demo-01",slugs[0]+"-copy",slugs[0].toUpperCase()]){
      const response=await page.goto(`/${space}/perspectives/${slug}`);
      expect(response?.status(),slug).toBe(404);
    }
  });

  test(`${space} imaginary choice is local, resettable, uncounted and clears on reload`, async ({ page }) => {
    const writes: string[] = [];
    page.on("request", (req) => {
      if (!["GET","HEAD","OPTIONS"].includes(req.method())) writes.push(req.method()+" "+req.url());
      if(new URL(req.url()).hostname!=="127.0.0.1") writes.push("external "+req.url());
    });
    await page.goto(`/${space}/perspectives`);
    await expect(page.getByRole("group",{name:"보기 하나를 선택하여 화면에서만 미리 볼 수 있습니다"})).toBeVisible();
    const radios=page.getByRole("radio");
    await expect(radios).toHaveCount(3);
    await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
    await radios.nth(1).check();
    await expect(radios.nth(1)).toBeChecked();
    const choice=await radios.nth(1).inputValue();
    await expect(page.locator(".perspectives__choice-preview")).toContainText(choice);
    await expect(page.locator(".perspectives__choice-preview")).toContainText("투표 결과가 아닙니다");
    expect(await page.locator("main form, main button[type=submit]").count()).toBe(0);
    expect(writes).toEqual([]);
    expect(await page.evaluate(() => ({
      local:Object.keys(localStorage),session:Object.keys(sessionStorage),cookies:document.cookie,
    }))).toEqual({local:[],session:[],cookies:""});
    await page.reload();
    await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
    await expect(page.getByRole("radio").nth(1)).not.toBeChecked();
    await page.getByRole("radio").first().check();
    await page.getByRole("button",{name:"선택 지우기"}).click();
    await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
  });
}

test("same shared detail ID presents identical editorial words across both spaces", async ({page}) => {
  for(const slug of slugs){
    const result:string[]=[];
    for(const space of spaces){
      await page.goto(`/${space}/perspectives/${slug}`);
      result.push((await page.locator(".perspectives__sides--article").innerText()).trim());
    }
    expect(result[0]).toEqual(result[1]);
  }
});

test("dad operator page uses fixed dad question and shared tournament with no storage", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) writes.push(request.method());
    if (new URL(request.url()).hostname !== "127.0.0.1") writes.push("external request");
  });
  const response = await page.goto("/dad/polls");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "이번 주 질문" })).toBeVisible();
  await expect(page.getByText("가상의 대화 상황이라면 어떤 시작이 편할까요?")).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  const bracket = page.getByRole("region", { name: "쉬는 날의 작은 취향 토너먼트" });
  await expect(bracket).toBeVisible();
  await expect(bracket.getByRole("button")).toHaveText(["집에서 영화 보기", "친구와 카페 가기"]);
  await page.getByRole("link", { name: "아빠 홈으로 돌아가기" }).click();
  await expect(page).toHaveURL(/\/dad$/);
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookies: document.cookie,
  }))).toEqual({ local: [], session: [], cookies: "" });
});

test("daughter standalone poll matches home fictional prompt with no results, storage or submit",async({page})=>{
  const requests:string[]=[];
  page.on("request", r=>{ if(!["GET","HEAD","OPTIONS"].includes(r.method()))requests.push(r.method());});
  const res=await page.goto("/daughter/polls");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading",{name:"이번 주 질문",level:1})).toBeVisible();
  await expect(page.getByText("오늘 기분을 표현한다면?")).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await expect(page.getByRole("main")).toContainText("실제 투표·응답 수집·집계");
  await page.getByRole("radio",{name:"음악"}).check();
  await expect(page.locator(".perspectives__choice-preview")).toContainText("음악");
  await expect(page.locator(".perspectives__choice-preview")).toContainText("투표 결과가 아닙니다");
  expect(requests).toEqual([]);
  await page.reload();
  await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
});

test("daughter operator tournament advances fixed brackets and resets without saving responses", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) writes.push(request.method());
    if (new URL(request.url()).hostname !== "127.0.0.1") writes.push("external request");
  });

  await page.goto("/daughter/polls");
  const bracket = page.getByRole("region", { name: "쉬는 날의 작은 취향 토너먼트" });
  await expect(bracket).toBeVisible();
  await expect(bracket.getByRole("button")).toHaveText(["집에서 영화 보기", "친구와 카페 가기"]);
  await bracket.getByRole("button", { name: "친구와 카페 가기" }).click();

  await expect(bracket.getByRole("button")).toHaveText(["산책하며 음악 듣기", "좋아하는 음식 먹기"]);
  await bracket.getByRole("button", { name: "좋아하는 음식 먹기" }).click();

  await expect(bracket.getByRole("button")).toHaveText(["친구와 카페 가기", "좋아하는 음식 먹기"]);
  await bracket.getByRole("button", { name: "좋아하는 음식 먹기" }).click();
  const result = bracket.getByRole("status");
  await expect(result).toContainText("나의 우승 선택: 좋아하는 음식 먹기");
  await expect(result).toContainText("전체 결과나 순위가 아닙니다");

  await expect(page.getByRole("main")).toContainText("저장·집계되지 않습니다");
  expect(await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookies: document.cookie,
  }))).toEqual({ local: [], session: [], cookies: "" });
  expect(writes).toEqual([]);

  await page.reload();
  await expect(bracket.getByRole("button")).toHaveText(["집에서 영화 보기", "친구와 카페 가기"]);
  await expect(bracket).not.toContainText("나의 우승 선택: 좋아하는 음식 먹기");
  await bracket.getByRole("button", { name: "집에서 영화 보기" }).click();
  await bracket.getByRole("button", { name: "산책하며 음악 듣기" }).click();
  await bracket.getByRole("button", { name: "집에서 영화 보기" }).click();
  await bracket.getByRole("button", { name: "처음부터 다시 고르기" }).click();
  await expect(bracket.getByRole("button")).toHaveText(["집에서 영화 보기", "친구와 카페 가기"]);
  expect(writes).toEqual([]);
});

test("simulated response vanishes after role re-selection; only prior UX key persists",async({page})=>{
  await page.goto("/?choose=1");
  await page.getByRole("link",{name:/아빠로 들어가기/}).click();
  await page.goto("/dad/perspectives");
  await page.getByRole("radio").first().check();
  await expect(page.locator(".perspectives__choice-preview")).toBeVisible();
  await page.getByRole("link",{name:"공간 다시 선택하기"}).click();
  await expect(page).toHaveURL(/\?choose=1$/);
  await page.getByRole("link",{name:/딸로 들어가기/}).click();
  await page.goto("/daughter/perspectives");
  await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
  await page.goto("/dad/perspectives");
  await expect(page.locator(".perspectives__choice-preview")).toHaveCount(0);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["awdd.lastSpace.v1"]);
});

test("320–1024px list/detail/choice layouts, and 320px 200% text, do not overflow",async({page})=>{
  const routes=[
    "/dad/perspectives","/dad/perspectives/a-comfortable-distance",
    "/daughter/perspectives","/daughter/perspectives/the-pace-of-a-conversation","/daughter/polls",
  ];
  for(const width of [320,360,375,390,430,768,1024]){
    await page.setViewportSize({width,height:790});
    for(const route of routes){
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+" "+width).toBe(true);
      await expect(page.getByRole("main")).toBeVisible();
    }
  }
  await page.setViewportSize({width:320,height:740});
  for(const route of routes){
    await page.goto(route);
    await page.evaluate(()=>{document.documentElement.style.fontSize="200%";});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+" zoom").toBe(true);
    const nav=page.locator(".app-nav");
    await expect(nav.getByRole("link")).toHaveCount(4);
  }
});

test("axe WCAG automatic, keyboard and explicit status on both lists, both details and poll",async({page})=>{
  for(const route of [
    "/dad/perspectives","/daughter/perspectives",
    "/dad/perspectives/a-comfortable-distance",
    "/daughter/perspectives/a-comfortable-distance","/daughter/polls",
  ]){
    await page.goto(route);
    const link=page.locator(".perspectives a").first();
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe("solid");
    const axePage=page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
    const result=await new AxeBuilder({page:axePage})
      .withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    expect(result.violations,route+" "+JSON.stringify(result.violations,null,2)).toEqual([]);
  }
});
