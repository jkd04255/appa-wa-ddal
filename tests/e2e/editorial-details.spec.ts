import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { sourceDisplay } from "../../src/domain/editorial-detail";

const dad = [
  ["example-favorite-word", "‘최애’라는 말에 담긴 취향"],
  ["example-short-video", "짧은 영상 속 웃음 코드"],
  ["example-playlist", "플레이리스트를 고르는 기준"],
  ["example-snack", "친구와 나누는 간식 이야기"],
  ["example-personal-style", "작은 물건에 담긴 자기표현"],
] as const;

const daughter = [
  ["sample-offbeat-playlist", "최애가 추천한 곡인데… 댓글은 ‘취향 존중’과 ‘이건 별로’로 갈렸다"],
  ["sample-beauty-notes", "사진에선 로즈, 교실 조명 아래선 형광 핑크? 립 색이 뒤집히는 순간"],
  ["sample-cafe-dessert", "바이럴 사진은 완벽했는데 한 입 뒤 반응은 반전? 디저트 기대가 갈리는 순간"],
  ["sample-late-night-vinyl", "최애가 같은데 ‘진짜 팬’ 기준은 왜 다를까? 굿즈 하나로 갈린 댓글"],
  ["sample-fan-rule", "굿즈 안 샀다고 팬 아니야? ‘진짜 팬’ 기준에 댓글이 갈린 이유"],
  ["sample-group-chat", "단톡방에 나만 빠진 약속… ‘실수’라는 말, 믿어도 될까?"],
  ["sample-joke-boundary", "“장난인데 왜 그래?” 웃지 못한 사람은 예민한 걸까?"],
] as const;

test("source status guard refuses unreviewed verified/expired labels", () => {
  expect(sourceDisplay({ kind: "demo" })).toEqual({
    kind: "demo",
    label: "시연 콘텐츠",
    detail: "합성 시연 자료 · 외부 원문 없음",
  });
  for (const kind of ["verified", "expired", "unverified", "unknown", ""]) {
    expect(sourceDisplay({ kind }).kind).toBe("unverified");
    expect(sourceDisplay({ kind }).label).toBe("정보 확인 필요");
  }
});

test("dad trend index uses exactly five synthetic cards and readable headings", async ({ page }) => {
  const response = await page.goto("/dad/trends");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("딸의 취향");
  const cards = page.locator(".editorial-page__tile");
  await expect(cards).toHaveCount(5);
  await expect(cards.locator(".editorial-page__stamp")).toHaveCount(5);
  const hrefs = await cards.getByRole("link", { name: /이야기 읽기/ }).evaluateAll(
    (links) => links.map((a) => (a as HTMLAnchorElement).getAttribute("href")));
  expect(hrefs).toEqual(dad.map(([slug]) => `/dad/trends/${slug}`));
  await expect(page.getByRole("navigation", { name: "아빠의 공간 주요 메뉴" })
    .getByRole("link", { name: "트렌드" })).toHaveAttribute("aria-current", "page");
});

test("daughter discovery filters are URL-driven and visibly selected", async ({ page }) => {
  await page.goto("/daughter/discover");
  await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(7);
  const categories: [string, number, string][] = [
    ["beauty", 1, "사진에선 로즈"],
    ["food", 1, "바이럴 사진"],
    ["culture", 5, "팬덤"],
  ];
  for (const [category, count, text] of categories) {
    await page.getByRole("navigation", { name: "발견 필터" })
      .getByRole("link", { name: category === "beauty" ? "뷰티" : category === "food" ? "먹거리" : "문화·음악" }).click();
    await expect(page).toHaveURL(new RegExp(`\\?category=${category}$`));
    await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(count);
    await expect(page.locator(".editorial-page__tile--daughter").first()).toContainText(text);
    await page.reload();
    await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(count);
  }
  await page.getByRole("navigation", { name: "발견 필터" }).getByRole("link", { name: "전체" }).click();
  await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(4);
  await expect(page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" })
    .getByRole("link", { name: "발견" })).toHaveAttribute("aria-current", "page");
});

test("invalid or repeated categories do not leak data or pretend verified results", async ({ page }) => {
  for (const url of [
    "/daughter/discover?category=unknown",
    "/daughter/discover?category=beauty&category=food",
    "/daughter/discover?category=%20",
  ]) {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("status")).toContainText("확인할 수 없는 카테고리");
    await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(4);
    await expect(page.locator(".editorial-page__stamp")).toHaveCount(4);
  }
});

test("all 12 exact slugs return unique and honestly sourced detail pages", async ({ page }) => {
  for (const [space, entries] of [
    ["/dad/trends", dad],
    ["/daughter/discover", daughter],
  ] as const) {
    for (const [slug, title] of entries) {
      const response = await page.goto(`${space}/${slug}`);
      expect(response?.status(), `${space}/${slug}`).toBe(200);
      await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
      const main = page.getByRole("main");
      await expect(main).toContainText("시연 콘텐츠");
      await expect(main).toContainText("합성 시연 자료 · 외부 원문 없음");
      await expect(main).toContainText("출처·확인 날짜: 해당 없음");
      await expect(main.getByRole("heading", { name: "자료 상태" })).toBeVisible();
      await expect(main.getByRole("heading", {
        name: space.startsWith("/dad") ? /알아두면 좋은 점|나만의 발견 팁/ : /관련 정보/,
      })).toBeVisible();
      await expect(main.getByRole("link", { name: /목록으로 돌아가기/ })).toBeVisible();
      const nav = page.getByRole("navigation", {
        name: space.startsWith("/dad") ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴",
      });
      await expect(nav.getByRole("link", { name: space.startsWith("/dad") ? "트렌드" : "발견" }))
        .toHaveAttribute("aria-current", "page");
    }
  }
});

test("invalid slugs, lookalikes, cross-space and missing sales details return 404", async ({ page }) => {
  const invalid = [
    "/dad/trends/EXAMPLE-FAVORITE-WORD",
    "/dad/trends/example-favorite-word-extra",
    "/dad/trends/sample-beauty-notes",
    "/dad/trends/not-a-fixture",
    "/daughter/discover/example-snack",
    "/daughter/discover/sample-beauty-notes-extra",
    "/daughter/discover/no-fixture",
    "/daughter/sales/any-unverified-sale",
  ];
  for (const path of invalid) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test("existing home links open corresponding detail and allow returning to listing", async ({ page }) => {
  await page.goto("/dad");
  await page.locator(".dad-home__hero-link").click();
  await expect(page).toHaveURL(/\/dad\/trends\/example-favorite-word$/);
  await page.getByRole("link", { name: /트렌드 목록으로 돌아가기/ }).click();
  await expect(page).toHaveURL(/\/dad\/trends$/);
  await page.getByRole("link", { name: "이야기 읽기" }).nth(2).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("플레이리스트");

  await page.goto("/daughter");
  await page.locator(".daughter-home__story-link").first().click();
  await expect(page).toHaveURL(/\/daughter\/discover\/sample-offbeat-playlist$/);
  await page.getByRole("link", { name: /목록으로 돌아가기/ }).click();
  await expect(page).toHaveURL(/\/daughter\/discover\?category=culture$/);
  await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(5);
  await page.goBack();
  await expect(page).toHaveURL(/\/daughter\/discover\/sample-offbeat-playlist$/);
});

test("daughter detail uses self-hosted photo with text-only context and alt", async ({ page }) => {
  await page.goto("/daughter/discover/sample-beauty-notes");
  const image = page.locator(".editorial-page__article-photo img");
  await expect(image).toHaveCount(1);
  await expect.poll(async () => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(image).toHaveAttribute("alt", /립스틱과 과일/);
  await expect(page.locator(".editorial-page__article-photo figcaption")).toContainText("실제 게시물·상품 이미지가 아닙니다");
  await expect(page.getByRole("main")).toContainText("실제 콘텐츠의 출처가 아닙니다");
});

test("responsive list and details fit 320 to 1024px, including zoomed font", async ({ page }) => {
  const paths = [
    "/dad/trends",
    "/dad/trends/example-favorite-word",
    "/daughter/discover",
    "/daughter/discover/sample-beauty-notes",
  ];
  for (const width of [320, 360, 375, 390, 430, 768, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of paths) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} overflow at ${width}`).toBe(true);
      await expect(page.getByRole("main")).toBeVisible();
    }
  }
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of paths) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} zoom overflow`).toBe(true);
    const nav = page.locator(".app-nav");
    await expect(nav.getByRole("link")).toHaveCount(4);
  }
});

test("two lists and two details meet axe AA, keyboard and read-only no-external rules", async ({ page }) => {
  const violations: string[] = [];
  page.on("request", (r) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) violations.push(r.method() + " " + r.url());
    if (new URL(r.url()).hostname !== "127.0.0.1") violations.push("external " + r.url());
  });
  const paths = [
    "/dad/trends",
    "/dad/trends/example-favorite-word",
    "/daughter/discover",
    "/daughter/discover/sample-offbeat-playlist",
  ];
  for (const path of paths) {
    await page.goto(path);
    const link = page.locator(".editorial-page a").first();
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
    const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
    const outcome = await new AxeBuilder({ page: axePage })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(outcome.violations, path + ": " + JSON.stringify(outcome.violations, null, 2)).toEqual([]);
  }
  expect(violations).toEqual([]);
});

