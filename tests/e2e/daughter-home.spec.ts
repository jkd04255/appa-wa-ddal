import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("daughter home renders polished magazine masthead, photo cover and 3 discovery images", async ({ page }) => {
  await page.goto("/daughter");
  await expect(page.getByRole("heading", { level: 1, name: /딸의 공간/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "지금 눈여겨볼 이야기" })).toBeVisible();
  await expect(page.locator(".daughter-home__feature-grid")).toHaveCount(1);
  await expect(page.locator(".daughter-home__discovery-card")).toHaveCount(3);
  await expect(page.locator(".daughter-home__photo img")).toHaveCount(4);
  await expect.poll(async () => page.locator(".daughter-home__photo img").evaluateAll(
    (imgs) => imgs.filter((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0).length
  )).toBe(4);
  expect(await page.locator(".daughter-home__photo img").evaluateAll(
    (imgs) => imgs.every((img) => !!(img as HTMLImageElement).alt)
  )).toBe(true);
  await expect(page.locator(".daughter-home__photo")).toHaveCount(4);
  await expect(page.getByText("광고가 아닌 시연 콘텐츠")).toHaveCount(1);
});

test("all editorial cards, demo shopping, community, poll and perspective show honest labels", async ({ page }) => {
  await page.goto("/daughter");
  await expect(page.locator(".daughter-home__demo")).toHaveCount(10);
  await expect(page.locator(".daughter-home__shopping-item")).toHaveCount(2);
  await expect(page.locator(".daughter-home__community li")).toHaveCount(2);
  await expect(page.locator(".daughter-home__community .daughter-home__demo")).toHaveCount(2);
  await expect(page.locator(".daughter-home__poll-options span")).toHaveCount(3);
  await expect(page.locator(".daughter-home__perspectives")).toHaveCount(1);
  await expect(page.getByText(/실시간 할인·구매 안내가 아닙니다/)).toBeVisible();
  await expect(page.getByText(/실제 인기·할인·응답 결과나 사용자 게시물이 아닙니다/)).toBeVisible();
  expect(await page.locator('form, input, textarea, button[type="submit"]').count()).toBe(0);
});

test("category chips link to filtered discovered stories", async ({ page }) => {
  await page.goto("/daughter");
  const nav = page.getByRole("navigation", { name: "관심사 카테고리" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  const hrefs = await nav.getByRole("link").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLAnchorElement).getAttribute("href")));
  expect(hrefs).toEqual([
    "/daughter/discover?category=beauty",
    "/daughter/discover?category=food",
    "/daughter/discover?category=culture",
    "/daughter/discover",
  ]);
  await nav.getByRole("link", { name: /뷰티/ }).click();
  await expect(page).toHaveURL(/\/daughter\/discover\?category=beauty$/);
  await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(1);
  await expect(page.locator(".editorial-page__tile--daughter")).toContainText("화장대 위, 취향을 기록하는 방법");
  await expect(page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" })
    .getByRole("link", { name: "발견" })).toHaveAttribute("aria-current", "page");
});

test("daughter CTA routes include readable details, placeholders and role isolation", async ({ page }) => {
  await page.goto("/daughter");
  await expect(page.getByRole("link", { name: "질문·토너먼트 보기" })).toHaveAttribute("href", "/daughter/polls");
  const known = [
    "/daughter/discover", "/daughter/sales",
    "/daughter/community", "/daughter/polls", "/daughter/perspectives",
    "/daughter/discover/sample-offbeat-playlist",
    "/daughter/discover/sample-beauty-notes",
    "/daughter/discover/sample-cafe-dessert",
    "/daughter/discover/sample-late-night-vinyl",
  ];
  const hrefs = await page.locator(".daughter-home a").evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""));
  expect(hrefs.every((href) => known.includes(href.split("?")[0]))).toBe(true);
  for (const route of known) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    if (route === "/daughter/discover" || route.startsWith("/daughter/discover/") || route === "/daughter/community" || route === "/daughter/polls" || route === "/daughter/perspectives") {
      await expect(page.getByRole("main")).toContainText("시연 콘텐츠");
    } else {
      await expect(page.getByRole("main")).toContainText("준비 중입니다.");
    }
  }
  expect((await page.goto("/daughter/discover/not-in-catalog"))?.status()).toBe(404);
  await page.goto("/dad");
  await expect(page.locator(".dad-home__hero")).toHaveCount(1);
  await expect(page.locator(".dad-home__trend-row")).toHaveCount(4);
  expect(await page.locator(".daughter-home").count()).toBe(0);
});

test("mobile 320, 360, 375, 390, 430px: 4:5 cover above title without horizontal scrolling", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/daughter");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`).toBe(true);
    const photo = await page.locator(".daughter-home__feature .daughter-home__photo").boundingBox();
    const copy = await page.locator(".daughter-home__feature-copy").boundingBox();
    expect(photo?.y ?? 0).toBeLessThan(copy?.y ?? 0);
    const aspect = (photo?.width ?? 0) / (photo?.height ?? 1);
    expect(aspect).toBeGreaterThan(0.78);
    expect(aspect).toBeLessThan(0.82);
    const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
  }
});

test("desktop 1024px: photo-text split, intentionally staggered photo cards and top 4 tabs", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/daughter");
  const photo = await page.locator(".daughter-home__feature .daughter-home__photo").boundingBox();
  const copy = await page.locator(".daughter-home__feature-copy").boundingBox();
  expect(photo?.x ?? 0).toBeLessThan(copy?.x ?? 0);
  const items = await page.locator(".daughter-home__discovery-card").all();
  const first = await items[0].boundingBox();
  const second = await items[1].boundingBox();
  expect(second?.y ?? 0).toBeGreaterThan(first?.y ?? 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  expect(await nav.evaluate((n) => getComputedStyle(n).position)).toBe("static");
});

test("200% root font on 320px preserves navigation and readable layout", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/daughter");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: /딸의 공간/ })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  expect(await page.evaluate(() => {
    const nav = document.querySelector(".app-nav")!;
    const shell = document.querySelector(".app-shell")!;
    return Number.parseFloat(getComputedStyle(shell).paddingBottom) >= nav.getBoundingClientRect().height;
  })).toBe(true);
});

test("keyboard focus, axe WCAG, local self-hosted images and no POST/external requests", async ({ page }) => {
  const unsafeRequests: string[] = [];
  page.on("request", (r) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) unsafeRequests.push(`${r.method()} ${r.url()}`);
    if (new URL(r.url()).hostname !== "127.0.0.1") unsafeRequests.push(`remote: ${r.url()}`);
  });
  await page.goto("/daughter");
  const link = page.locator(".daughter-home__feature-copy .daughter-home__arrow-link");
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const result = await new AxeBuilder({ page: axePage })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  expect(unsafeRequests).toEqual([]);
});
