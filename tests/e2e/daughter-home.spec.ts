import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("daughter home shows a compact fictional feed and keeps topic links inside the menu", async ({ page }) => {
  await page.goto("/daughter");
  await expect(page.getByRole("heading", { level: 1, name: "관심사" })).toBeVisible();
  await expect(page.locator(".daughter-home__feature-grid")).toHaveCount(0);
  await expect(page.locator(".daughter-home__feed-section")).toHaveCount(3);
  await expect(page.locator(".daughter-home__story-card")).toHaveCount(7);
  await expect(page.getByText("최애가 추천한 곡인데… 댓글은 ‘취향 존중’과 ‘이건 별로’로 갈렸다")).toBeVisible();
  await expect(page.getByText("단톡방에 나만 빠진 약속… ‘실수’라는 말, 믿어도 될까?")).toBeVisible();
  const topicMenu = page.locator(".daughter-home__topic-menu");
  await expect(topicMenu).not.toHaveAttribute("open");
  const topics = page.getByRole("navigation", { name: "관심 주제" });
  await expect(topics.getByRole("link")).toHaveCount(0);
  await topicMenu.locator("summary").click();
  await expect(topics.getByRole("link")).toHaveCount(20);
  await expect(topics.getByRole("link", { name: "메이크업" })).toBeVisible();
});

test("headline sections, shop, sample posts and question clearly mark synthetic content", async ({ page }) => {
  await page.goto("/daughter");
  await expect(page.locator(".daughter-home__demo")).toHaveCount(12);
  await expect(page.locator(".daughter-home__shopping-item")).toHaveCount(2);
  await expect(page.locator(".daughter-home__community li")).toHaveCount(2);
  await expect(page.locator(".daughter-home__poll-options span")).toHaveCount(3);
  await expect(page.locator(".daughter-home__feed-section--fandom .daughter-home__section-kicker")).toContainText("팬덤 · 미디어");
  await expect(page.getByRole("main")).toContainText("실제 인물, 사건, 유행, 할인, 사용자 반응과 무관");
  await expect(page.getByRole("main")).not.toContainText("서로의 시선");
  await expect(page.getByRole("main")).not.toContainText("아빠 관점");
  await expect(page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" }).getByRole("link", { name: "밸런스" })).toHaveAttribute("href", "/daughter/polls");
  expect(await page.locator('form, input, textarea, button[type="submit"]').count()).toBe(0);
});

test("topic menu links open the closest available discovery category", async ({ page }) => {
  await page.goto("/daughter");
  const menu = page.locator(".daughter-home__topic-menu");
  await menu.locator("summary").click();
  const nav = page.getByRole("navigation", { name: "관심 주제" });
  await expect(nav.getByRole("link")).toHaveCount(20);
  const hrefs = await nav.getByRole("link").evaluateAll((elements) =>
    elements.map((element) => (element as HTMLAnchorElement).getAttribute("href")));
  expect(hrefs).toContain("/daughter/discover?category=beauty");
  expect(hrefs).toContain("/daughter/discover?category=food");
  expect(hrefs).toContain("/daughter/discover?category=culture");
  await nav.getByRole("link", { name: "메이크업" }).click();
  await expect(page).toHaveURL(/\/daughter\/discover\?category=beauty$/);
  await expect(page.locator(".editorial-page__tile--daughter")).toHaveCount(1);
  await expect(page.locator(".editorial-page__tile--daughter")).toContainText("사진에선 로즈");
  await expect(page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" })
    .getByRole("link", { name: "발견" })).toHaveAttribute("aria-current", "page");
});

test("story and feed links resolve only to known static demo routes", async ({ page }) => {
  await page.goto("/daughter");
  const known = [
    "/daughter/discover", "/daughter/sales",
    "/daughter/community", "/daughter/polls",
    "/daughter/discover/sample-offbeat-playlist",
    "/daughter/discover/sample-beauty-notes",
    "/daughter/discover/sample-cafe-dessert",
    "/daughter/discover/sample-late-night-vinyl",
    "/daughter/discover/sample-fan-rule",
    "/daughter/discover/sample-group-chat",
    "/daughter/discover/sample-joke-boundary",
  ];
  const hrefs = await page.locator(".daughter-home a").evaluateAll((els) =>
    els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""));
  expect(hrefs.every((href) => known.includes(href.split("?")[0]))).toBe(true);
  for (const route of known) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    if (route === "/daughter/discover" || route.startsWith("/daughter/discover/") || route === "/daughter/community" || route === "/daughter/polls") {
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

test("mobile 320, 360, 375, 390, 430px: compact story grids without horizontal overflow", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/daughter");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "overflow at " + width + "px").toBe(true);
    await expect(page.locator(".daughter-home__story-card")).toHaveCount(7);
    const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
  }
});

test("desktop 1024px: two-column feed, compact cards and separated role navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/daughter");
  const cards = await page.locator(".daughter-home__story-card").all();
  const first = await cards[0].boundingBox();
  const second = await cards[1].boundingBox();
  expect(second?.x ?? 0).toBeGreaterThan(first?.x ?? 0);
  expect(Math.abs((second?.y ?? 0) - (first?.y ?? 0))).toBeLessThan(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  expect(await nav.evaluate((n) => getComputedStyle(n).position)).toBe("static");
});

test("200% root font on 320px preserves headings and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/daughter");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "관심사" })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "딸의 공간 주요 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  expect(await page.evaluate(() => {
    const nav = document.querySelector(".app-nav")!;
    const shell = document.querySelector(".app-shell")!;
    return Number.parseFloat(getComputedStyle(shell).paddingBottom) >= nav.getBoundingClientRect().height;
  })).toBe(true);
});

test("keyboard focus, axe WCAG, local assets and no POST or external requests", async ({ page }) => {
  const unsafeRequests: string[] = [];
  page.on("request", (r) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) unsafeRequests.push(r.method() + " " + r.url());
    if (new URL(r.url()).hostname !== "127.0.0.1") unsafeRequests.push("remote: " + r.url());
  });
  await page.goto("/daughter");
  const link = page.locator(".daughter-home__story-link").first();
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const result = await new AxeBuilder({ page: axePage })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  expect(unsafeRequests).toEqual([]);
});
