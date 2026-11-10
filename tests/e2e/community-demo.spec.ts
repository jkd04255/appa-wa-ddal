import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const entries = [
  {space: "dad", postIds: ["dad-post-demo-01", "dad-post-demo-02", "dad-post-demo-03"], category:"함께 고민"},
  {space: "daughter", postIds: ["daughter-post-demo-01", "daughter-post-demo-02", "daughter-post-demo-03"], category:"취향 기록"},
] as const;

for (const {space,postIds,category} of entries) {
  test(`${space} community lists exactly 3 clearly synthetic, role-specific posts`, async ({ page }) => {
    const response = await page.goto(`/${space}/community`);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".community-demo__post")).toHaveCount(3);
    await expect(page.locator(".community-demo__post .community-demo__stamp")).toHaveCount(3);
    await expect(page.getByText("샘플 게시글 · 실제 저장되지 않습니다")).toHaveCount(3);
    await expect(page.locator(".community-demo__count")).toContainText("3개");
    await expect(page.getByText(/선택은 신원·연령·작성 권한을 인증하지 않습니다/)).toBeVisible();
    const links = await page.locator(".community-demo__post-link").evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute("href")));
    expect(links).toEqual(postIds.map((id) => `/${space}/community/${id}`));
    await expect(page.getByRole("navigation", { name: space === "dad" ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴" })
      .getByRole("link", {name: "커뮤니티"})).toHaveAttribute("aria-current", "page");
  });

  test(`${space} client-only search, category and title sort leave URL unchanged`, async ({ page }) => {
    await page.goto(`/${space}/community`);
    const search = page.getByRole("searchbox", { name: "샘플 글 검색" });
    const board = page.getByRole("combobox", { name: "주제 선택" });
    const sort = page.getByRole("combobox", { name: "정렬" });
    await board.selectOption({label: category});
    await expect(page.locator(".community-demo__post")).toHaveCount(2);
    await sort.selectOption("title");
    const text = await page.locator(".community-demo__post h3").allTextContents();
    expect(text).toEqual([...text].sort((a,b) => a.localeCompare(b,"ko-KR")));
    await search.fill("이런 샘플은 없습니다");
    await expect(page.getByText("일치하는 샘플 글이 없습니다.")).toBeVisible();
    await expect(page.locator(".community-demo__count")).toContainText("0개");
    expect(new URL(page.url()).search).toBe("");
    await page.getByRole("button", { name: "검색 초기화" }).click();
    await expect(page.locator(".community-demo__post")).toHaveCount(3);
    await search.fill("관심사를 자연스럽게");
    await expect(page.locator(".community-demo__post")).toHaveCount(space === "dad" ? 1 : 0);
    await page.reload();
    await expect(search).toHaveValue("");
    await expect(page.locator(".community-demo__post")).toHaveCount(3);
  });

  test(`${space} sample post detail, comments, route navigation and strict invalid 404`, async ({ page }) => {
    for (const id of postIds) {
      const result = await page.goto(`/${space}/community/${id}`);
      expect(result?.status(), id).toBe(200);
      await expect(page.locator(".community-demo__article h1")).toBeVisible();
      await expect(page.getByText("가상 작성글이며 실제 사용자 사연이 아닙니다.", { exact: false })).toBeVisible();
      await expect(page.locator(".community-demo__comments li")).not.toHaveCount(0);
      const comments = page.locator(".community-demo__comments li");
      await expect(comments.locator(".community-demo__stamp")).toHaveCount(await comments.count());
      await expect(page.getByRole("navigation", { name: space === "dad" ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴" })
        .getByRole("link", {name: "커뮤니티"})).toHaveAttribute("aria-current", "page");
      await page.getByRole("link", { name: /샘플 목록으로 돌아가기/ }).click();
      await expect(page).toHaveURL(new RegExp(`/${space}/community$`));
    }
    expect((await page.goto(`/${space}/community/not-a-sample`))?.status()).toBe(404);
  });

  test(`${space} local draft only previews in-memory and discards on reload`, async ({page}) => {
    const requests: string[] = [];
    page.on("request", (r) => { if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) requests.push(r.method() + " " + r.url()); });
    const res = await page.goto(`/${space}/community/new`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(page.getByText("실제 게시하거나 저장하지 않습니다.", {exact:false})).toBeVisible();
    const preview = page.getByRole("button", {name:"화면에서만 미리보기"});
    await expect(preview).toBeDisabled();
    await page.getByRole("textbox", {name:"제목 (최대 80자)"}).fill("UI 체험용 제목");
    await page.getByRole("textbox", {name:"내용 (최대 500자)"}).fill("이 내용은 서버로 보내지 않는 가상 미리보기입니다.");
    await preview.click();
    await expect(page.locator(".community-demo__draft-preview")).toContainText("UI 체험용 제목");
    await expect(page.locator(".community-demo__draft-preview")).toContainText("게시·저장되지 않았습니다");
    expect(requests).toEqual([]);
    expect(new URL(page.url()).search).toBe("");
    expect(await page.evaluate(() => ({
      keys: Object.keys(localStorage).sort(),
      session: Object.keys(sessionStorage),
      cookies: document.cookie,
    }))).toEqual({keys: [],session: [],cookies:""});
    await page.reload();
    await expect(page.getByRole("textbox", {name:"제목 (최대 80자)"})).toHaveValue("");
    await expect(page.getByRole("textbox", {name:"내용 (최대 500자)"})).toHaveValue("");
    await expect(page.locator(".community-demo__draft-preview")).toHaveCount(0);
    await expect(preview).toBeDisabled();
  });

  test(`${space} unsafe markup is React-escaped, not parsed or executed`, async ({page}) => {
    await page.goto(`/${space}/community/new`);
    await page.getByRole("textbox", {name:"제목 (최대 80자)"}).fill("<img src=x onerror=alert(1)>");
    await page.getByRole("textbox", {name:"내용 (최대 500자)"}).fill("<script>window.evil=true</script>");
    await page.getByRole("button", {name:"화면에서만 미리보기"}).click();
    await expect(page.locator(".community-demo__draft-preview")).toContainText("<script>window.evil=true</script>");
    expect(await page.locator(".community-demo__draft-preview script,.community-demo__draft-preview img").count()).toBe(0);
    expect(await page.evaluate(() => (window as Window & {evil?:boolean}).evil)).toBeUndefined();
    await page.getByRole("button", {name:"전체 지우기"}).click();
    await expect(page.locator(".community-demo__draft-preview")).toHaveCount(0);
  });
}

test("cross-space sample ids stay isolated and static new page beats dynamic id",async({page})=>{
  const wrong = [
    "/dad/community/daughter-post-demo-01",
    "/daughter/community/dad-post-demo-01",
    "/dad/community/dad-post-demo-01-copy",
    "/daughter/community/DAUGHTER-POST-DEMO-01",
  ];
  for(const path of wrong)expect((await page.goto(path))?.status(),path).toBe(404);
  for(const space of ["dad","daughter"]) {
    expect((await page.goto(`/${space}/community/new`))?.status()).toBe(200);
    await expect(page.getByRole("heading",{name:"글쓰기 체험",level:1})).toBeVisible();
  }
});

test("switching spaces discards unsubmitted draft and reveals no old draft",async({page})=>{
  await page.goto("/dad/community/new");
  await page.getByRole("textbox",{name:"제목 (최대 80자)"}).fill("나가면 사라지는 임시 제목");
  await page.getByRole("textbox",{name:"내용 (최대 500자)"}).fill("이 내용은 저장되지 않습니다.");
  await page.getByRole("button",{name:"화면에서만 미리보기"}).click();
  await page.getByRole("link",{name:"공간 다시 선택하기"}).click();
  await expect(page).toHaveURL(/\/\?choose=1$/);
  await page.getByRole("link",{name:/딸로 들어가기/}).click();
  await page.goto("/daughter/community/new");
  await expect(page.getByRole("textbox",{name:"제목 (최대 80자)"})).toHaveValue("");
  await expect(page.getByText("나가면 사라지는 임시 제목")).toHaveCount(0);
  await page.goto("/dad/community/new");
  await expect(page.getByRole("textbox",{name:"제목 (최대 80자)"})).toHaveValue("");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["awdd.lastSpace.v1"]);
});

test("community mobile 320-430px, tablet 768/1024 and 200% zoom avoid overflow",async({page})=>{
  for(const width of [320,360,375,390,430,768,1024]) {
    await page.setViewportSize({width,height:820});
    for(const route of ["/dad/community","/daughter/community","/dad/community/new","/daughter/community/daughter-post-demo-01".replace("daughter/community/daughter","daughter/community/daughter")]) {
      if (route.includes("dad/community/daughter-")) throw new Error("Invalid test case");
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+" "+width).toBe(true);
      const nav=page.getByRole("navigation",{name:route.startsWith("/dad")?"아빠의 공간 주요 메뉴":"딸의 공간 주요 메뉴"});
      await expect(nav.getByRole("link")).toHaveCount(4);
    }
  }
  await page.setViewportSize({width:320,height:740});
  for(const route of ["/dad/community","/daughter/community","/dad/community/new","/daughter/community/new"]) {
    await page.goto(route);
    await page.evaluate(()=>{document.documentElement.style.fontSize="200%";});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+" 200%").toBe(true);
  }
});

test("axe WCAG automatic and keyboard navigation on both lists, details and composers",async({page})=>{
  for(const route of ["/dad/community","/daughter/community","/dad/community/dad-post-demo-01",
    "/daughter/community/daughter-post-demo-01","/dad/community/new","/daughter/community/new"]) {
    await page.goto(route);
    const link=page.locator(".community-demo a").first();
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe("solid");
    const axePage=page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
    const result=await new AxeBuilder({page:axePage})
      .withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    expect(result.violations,route+" "+JSON.stringify(result.violations,null,2)).toEqual([]);
  }
});
