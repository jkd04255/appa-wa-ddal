import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1280]) {
  test(`balance hook fits ${width}px and asks guests to log in`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/daughter');
    const photo = page.locator('.daughter-home__story-photo');
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const game = page.locator('#balance-game');
    await expect(game.getByRole('heading', { name: '지금, 어느 쪽?' })).toBeVisible();
    await expect(game.getByText('예시 결과 · 실제 투표 아님')).toBeVisible();
    const bar = game.getByRole('img');
    await expect(bar).toHaveAccessibleName(/62%.*38%/);
    const widths = await page.locator('.balance-game__bar > span').evaluateAll(els => els.map(e => e.getBoundingClientRect().width));
    expect(widths[0] / (widths[0] + widths[1])).toBeCloseTo(.62, 1);
    if (width >= 1020) {
      const school = await page.locator('.daughter-home__feed-section--school').boundingBox();
      const box = await game.boundingBox();
      expect(Math.abs(box!.x - school!.x)).toBeLessThan(2);
      expect(box!.y - (school!.y + school!.height)).toBeLessThan(30);
      expect(box!.y).toBeGreaterThan(school!.y + school!.height);
    }
    await game.getByRole('button', { name: /분 단위 계획파/ }).click();
    await expect(game.getByRole('status')).toContainText('로그인 또는 회원가입');
    await expect(bar).toHaveAccessibleName(/62%.*38%/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`balance-${width}.png`), fullPage: true });
    await game.getByRole('link', { name: '로그인 또는 회원가입' }).click();
    await expect(page.getByRole('heading', { name: '내 쪽에 한 표' })).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인', exact: true }).last()).toBeDisabled();
  });
}

test('unconfigured account is honest, accessible, and sends no personal data', async ({ page }) => {
  const writes: string[] = [];
  page.on('request', r => { if (r.method() === 'POST') writes.push(r.url()); });
  await page.goto('/account');
  await page.getByRole('button', { name: '회원가입', exact: true }).click();
  await expect(page.getByLabel('이메일', { exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: '이메일로 회원가입' })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Google로 계속하기/ })).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('정보가 전송되지 않습니다');
  const result = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"] }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
  expect(writes).toEqual([]);
});
