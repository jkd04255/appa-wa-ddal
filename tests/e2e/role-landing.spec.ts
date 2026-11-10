import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("first visit shows approved copy and two equal role links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "같은 집, 조금 다른 세상." })).toBeVisible();
  await expect(page.getByText("우리가 몰랐던 서로의 이야기.")).toBeVisible();
  await expect(page.getByRole("link", { name: /아빠로 들어가기/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /딸로 들어가기/ })).toBeVisible();
  await expect(page.getByText(/실제 연령·가족관계나 게시 권한을 인증하지 않습니다/)).toBeVisible();
  expect(await page.locator("nav").count()).toBe(0);
});

test("dad click stores preference and revisiting root returns to dad", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /아빠로 들어가기/ }).click();
  await expect(page).toHaveURL(/\/dad$/);
  await expect(page.getByRole("heading", { name: "아빠의 공간" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("awdd.lastSpace.v1"))).toBe("dad");
  await page.goto("/");
  await expect(page).toHaveURL(/\/dad$/);
});

test("explicit selection shows both links, switches to daughter, and persists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /아빠로 들어가기/ }).click();
  await page.getByRole("link", { name: /공간 다시 선택하기/ }).click();
  await expect(page).toHaveURL(/\/\?choose=1$/);
  await expect(page.getByRole("link", { name: /아빠로 들어가기/ })).toBeVisible();
  await page.getByRole("link", { name: /딸로 들어가기/ }).click();
  await expect(page).toHaveURL(/\/daughter$/);
  await expect(page.getByRole("heading", { name: "딸의 공간" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("awdd.lastSpace.v1"))).toBe("daughter");
  await page.goto("/");
  await expect(page).toHaveURL(/\/daughter$/);
  await page.goto("/?choose=1");
  await expect(page.getByRole("link", { name: /딸로 들어가기/ })).toBeVisible();
});

test("invalid stored value never redirects and is never treated as permission", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("awdd.lastSpace.v1", "admin"));
  await page.goto("/");
  await expect(page.getByRole("link", { name: /아빠로 들어가기/ })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/daughter");
  await expect(page.getByRole("heading", { name: "딸의 공간" })).toBeVisible();
});

test("blocked localStorage permits navigation but no remembered identity", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => { throw new DOMException("Storage blocked", "SecurityError"); },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /아빠로 들어가기/ })).toBeVisible();
  await page.getByRole("link", { name: /아빠로 들어가기/ }).click();
  await expect(page).toHaveURL(/\/dad$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /아빠로 들어가기/ })).toBeVisible();
});

test("no JavaScript still shows usable role anchors", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("link", { name: "아빠로 들어가기" })).toBeVisible();
    await expect(page.getByRole("link", { name: "딸로 들어가기" })).toBeVisible();
    await page.getByRole("link", { name: "딸로 들어가기" }).click();
    await expect(page).toHaveURL(/\/daughter$/);
  } finally {
    await context.close();
  }
});

test("mobile widths have no overflow and 44px card targets", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 720 });
    await page.goto("/?choose=1");
    const cards = page.locator(".role-card");
    await expect(cards).toHaveCount(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`).toBe(true);
    for (const card of await cards.all()) {
      const rect = await card.boundingBox();
      expect(rect?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(rect?.width ?? 0).toBeGreaterThanOrEqual(44);
    }
  }
});

test("keyboard focus, axe accessibility and no write requests", async ({ page }) => {
  const nonGet: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      nonGet.push(`${request.method()} ${request.url()}`);
    }
  });
  await page.goto("/?choose=1");
  const dad = page.getByRole("link", { name: /아빠로 들어가기/ });
  await dad.focus();
  await expect(dad).toBeFocused();
  expect(await dad.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
  expect(nonGet).toEqual([]);
});
