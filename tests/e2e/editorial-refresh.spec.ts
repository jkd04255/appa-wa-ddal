import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1280]) {
  test(`G1-14 editorial journey stays usable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?choose=1");
    const choice = page.getByRole("link", { name: /딸의 공간.*딸로 들어가기/ });
    await expect(choice).toBeVisible();
    await expect.poll(() => page.locator(".role-card__photo img").evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)
    )).toBe(true);
    for (const card of await page.locator(".role-card").all()) {
      const title = await card.locator(".role-card__title").boundingBox();
      const photo = await card.locator(".role-card__photo").boundingBox();
      expect(title).not.toBeNull(); expect(photo).not.toBeNull();
      expect(title!.x + title!.width).toBeLessThanOrEqual(photo!.x);
    }
    await page.screenshot({ path: testInfo.outputPath(`landing-${width}.png`), fullPage: true });
    await choice.click();
    await expect(page.getByRole("heading", { name: "관심사", exact: true })).toBeVisible();
    await expect.poll(() => page.locator(".daughter-home__feature img").evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).naturalWidth > 0)
    )).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`daughter-${width}.png`), fullPage: true });
    await page.getByRole("link", { name: "질문·토너먼트 보기", exact: false }).click();
    await expect(page.getByRole("heading", { name: "토너먼트 선택" })).toBeVisible();
    await page.locator(".operator-activity__match-options button").first().click();
    await expect(page.locator(".operator-activity__round")).toHaveText("준결승 2 · 2/3");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`tournament-${width}.png`), fullPage: true });
  });
}
