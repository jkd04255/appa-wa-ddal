import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("dad home has exactly one featured and four synthetic supporting trends", async ({ page }) => {
  await page.goto("/dad");
  await expect(page.getByRole("heading", { level: 1, name: "아빠의 공간" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "오늘의 딸 트렌드" })).toBeVisible();
  await expect(page.locator(".dad-home__hero")).toHaveCount(1);
  await expect(page.locator(".dad-home__trend-row")).toHaveCount(4);
  await expect(page.locator(".dad-home__hero .dad-home__demo")).toHaveText("시연 콘텐츠");
  await expect(page.locator(".dad-home__trend-row .dad-home__demo")).toHaveCount(4);
  await expect(page.locator('.dad-home__art[role="img"]')).toHaveCount(5);
  await expect(page.getByText(/실제 SNS 최신 동향, 게시글, 설문 결과가 아닙니다/)).toBeVisible();
  const headlines = await page.locator(".dad-home__trend-copy h3").allTextContents();
  expect(new Set(headlines).size).toBe(4);
});

test("briefing, demo community, prompts and perspectives are explicitly synthetic", async ({ page }) => {
  await page.goto("/dad");
  await expect(page.locator(".dad-home__brief-row")).toHaveCount(3);
  await expect(page.locator(".dad-home__community-list li")).toHaveCount(2);
  await expect(page.locator(".dad-home__prompt")).toHaveCount(2);
  await expect(page.locator(".dad-home__perspective")).toHaveCount(1);
  await expect(page.locator(".dad-home__demo")).toHaveCount(13);
  await expect(page.getByText("샘플 게시글 · 실제 저장되지 않습니다")).toHaveCount(2);
  await expect(page.locator(".dad-home__perspective")).toContainText("아빠의 관점");
  await expect(page.locator(".dad-home__perspective")).toContainText("딸의 관점");
  expect(await page.locator('form, input, textarea, button[type="submit"]').count()).toBe(0);
});

test("dad home CTA routes include readable sample details, placeholders and unknown 404", async ({ page }) => {
  const paths = [
    "/dad/trends", "/dad/briefing", "/dad/community",
    "/dad/questions", "/dad/talk", "/dad/perspectives",
    "/dad/trends/example-favorite-word", "/dad/trends/example-short-video",
    "/dad/trends/example-playlist", "/dad/trends/example-snack", "/dad/trends/example-personal-style",
  ];
  await page.goto("/dad");
  const destinations = await page.locator(".dad-home a").evaluateAll(
    (elements) => elements.map((a) => (a as HTMLAnchorElement).getAttribute("href"))
  );
  for (const path of paths) expect(destinations).toContain(path);
  expect(destinations.every((target) => !!target && paths.includes(target))).toBe(true);
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    if (path === "/dad/trends" || path.startsWith("/dad/trends/") || path === "/dad/community") {
      await expect(page.getByRole("main")).toContainText("시연 콘텐츠");
    } else {
      await expect(page.getByRole("main")).toContainText("준비 중입니다.");
    }
    const nav = page.getByRole("navigation", { name: "아빠의 공간 주요 메뉴" });
    await expect(nav.getByRole("link")).toHaveCount(4);
  }
  const unknown = await page.goto("/dad/trends/not-a-fixture");
  expect(unknown?.status()).toBe(404);
});

test("320-430px mobile hero and supporting cards fit alongside fixed 4-tab nav", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 720 });
    await page.goto("/dad");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`).toBe(true);
    const hero = await page.locator(".dad-home__hero").boundingBox();
    const art = await page.locator(".dad-home__art--hero").boundingBox();
    const copy = await page.locator(".dad-home__hero-copy").boundingBox();
    expect(hero?.width ?? 0).toBeGreaterThan(260);
    expect(art?.y ?? 0).toBeLessThan(copy?.y ?? 0);
    const nav = page.getByRole("navigation", { name: "아빠의 공간 주요 메뉴" });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
    expect(await nav.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
  }
});

test("dad desktop hero remains intact and daughter home is separately themed", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/dad");
  const artwork = await page.locator(".dad-home__art--hero").boundingBox();
  const copy = await page.locator(".dad-home__hero-copy").boundingBox();
  expect(artwork?.x ?? 0).toBeLessThan(copy?.x ?? 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/daughter");
  await expect(page.getByRole("heading", { name: "딸의 공간" })).toBeVisible();
  expect(await page.locator(".dad-home").count()).toBe(0);
  await expect(page.locator(".daughter-home")).toHaveCount(1);
  await expect(page.locator(".daughter-home__feature-grid")).toHaveCount(1);
});

test("dad home links are keyboard operable, axe clean and read-only", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      writes.push(`${request.method()}: ${request.url()}`);
    }
  });
  await page.goto("/dad");
  const link = page.locator(".dad-home__hero-link");
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const result = await new AxeBuilder({ page: axePage })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  expect(writes).toEqual([]);
});

test("200% root font scale keeps dad content and bottom menu usable at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/dad");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("heading", { name: "아빠의 공간" })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "아빠의 공간 주요 메뉴" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  expect(await page.evaluate(() => {
    const nav = document.querySelector(".app-nav")!;
    const shell = document.querySelector(".app-shell")!;
    return Number.parseFloat(getComputedStyle(shell).paddingBottom) >= nav.getBoundingClientRect().height;
  })).toBe(true);
});
