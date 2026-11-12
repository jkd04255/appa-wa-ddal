import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

type Space = "dad" | "daughter";

const routes: Record<Space, readonly [string, string][]> = {
  dad: [
    ["홈", "/dad"],
    ["트렌드", "/dad/trends"],
    ["커뮤니티", "/dad/community"],
    ["서로의 시선", "/dad/perspectives"],
  ],
  daughter: [
    ["홈", "/daughter"],
    ["발견", "/daughter/discover"],
    ["커뮤니티", "/daughter/community"],
    ["밸런스", "/daughter/polls"],
  ],
};

function menuLabel(space: Space) {
  return space === "dad" ? "아빠의 공간 주요 메뉴" : "딸의 공간 주요 메뉴";
}

for (const space of ["dad", "daughter"] as const) {
  test(`${space}: 4 tabs, direct URL, active state, refresh and back`, async ({ page }) => {
    const items = routes[space];
    await page.goto(`/${space}`);
    const nav = page.getByRole("navigation", { name: menuLabel(space) });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");

    for (const [label, href] of items.slice(1)) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
      if (href === "/dad/trends" || href === "/daughter/discover" || href.endsWith("/community") || href.endsWith("/perspectives") || href.endsWith("/polls")) {
        await expect(page.getByRole("main")).toContainText("시연 콘텐츠");
      } else {
        await expect(page.getByRole("main").getByText("준비 중입니다.")).toBeVisible();
      }
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
      await page.reload();
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    }

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${items[2][1]}$`));
    await expect(nav.getByRole("link", { name: items[2][0] })).toHaveAttribute("aria-current", "page");

    for (const [label, href] of items) {
      await page.goto(href);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    }
  });
}

test("space re-selection keeps last-space contract and swaps menu labels", async ({ page }) => {
  await page.goto("/?choose=1");
  await page.getByRole("link", { name: /아빠로 들어가기/ }).click();
  await expect(page).toHaveURL(/\/dad$/);
  await expect(page.getByRole("navigation", { name: menuLabel("dad") }).getByRole("link")).toHaveCount(4);
  await page.getByRole("link", { name: "공간 다시 선택하기" }).click();
  await expect(page).toHaveURL(/\/\?choose=1$/);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await page.getByRole("link", { name: /딸로 들어가기/ }).click();
  await expect(page).toHaveURL(/\/daughter$/);
  await expect(page.getByRole("navigation", { name: menuLabel("daughter") }).getByRole("link")).toHaveCount(4);
  await expect(page.getByRole("navigation", { name: menuLabel("daughter") }).getByRole("link", { name: "발견" })).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/daughter$/);
  expect(await page.evaluate(() => localStorage.getItem("awdd.lastSpace.v1"))).toBe("daughter");
});

test("unknown detail routes 404, without fake articles or community content", async ({ page }) => {
  for (const path of [
    "/dad/community/not-yet-created",
    "/daughter/discover/no-fixture",
    "/dad/trends/not-yet-created",
    "/daughter/perspectives/no-fixture",
    "/daughter/perspectives",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test("mobile 4 tabs stay visible and targets fit screen", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 720 });
    for (const space of ["dad", "daughter"] as const) {
      await page.goto(`/${space}/community`);
      const nav = page.getByRole("navigation", { name: menuLabel(space) });
      await expect(nav.getByRole("link")).toHaveCount(4);
      const metrics = await page.evaluate(() => {
        const nav = document.querySelector(".app-nav");
        const main = document.querySelector("main");
        if (!nav || !main) return null;
        const navBox = nav.getBoundingClientRect();
        const buttons = [...nav.querySelectorAll<HTMLAnchorElement>("a")].map((el) => el.getBoundingClientRect());
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          navBox: { left: navBox.left, right: navBox.right, bottom: navBox.bottom },
          visibleTargets: buttons.every((rect) => rect.width >= 44 && rect.height >= 44),
          navPosition: getComputedStyle(nav).position,
          reserve: getComputedStyle(document.querySelector(".app-shell")!).paddingBottom,
        };
      });
      expect(metrics, `${space}/${width}px nav`).not.toBeNull();
      expect(metrics?.overflow, `${space}/${width}px overflow`).toBe(false);
      expect(metrics?.visibleTargets, `${space}/${width}px targets`).toBe(true);
      expect(metrics?.navPosition).toBe("fixed");
      expect(metrics?.navBox.left).toBeGreaterThanOrEqual(-1);
      expect(metrics?.navBox.right).toBeLessThanOrEqual(width + 1);
      expect(metrics?.navBox.bottom).toBeLessThanOrEqual(721);
      expect(Number.parseFloat(metrics?.reserve ?? "0")).toBeGreaterThanOrEqual(95);
    }
  }
});

test("tablet+ navigation moves into header with four destinations", async ({ page }) => {
  for (const width of [768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/daughter/discover");
    const nav = page.getByRole("navigation", { name: menuLabel("daughter") });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: "발견" })).toHaveAttribute("aria-current", "page");
    expect(await nav.evaluate((el) => getComputedStyle(el).position)).toBe("static");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("keyboard skip link, focus, axe accessibility and read-only network", async ({ page }) => {
  const writeRequests: string[] = [];
  page.on("request", (req) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method())) writeRequests.push(req.method());
  });
  await page.goto("/dad/trends");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문으로 바로가기" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/dad\/trends#main-content$/);
  await expect(page.locator("#main-content")).toBeVisible();
  const nav = page.getByRole("navigation", { name: menuLabel("dad") });
  const current = nav.getByRole("link", { name: "트렌드" });
  await current.focus();
  expect(await current.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const violations = (await new AxeBuilder({ page: axePage })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations;
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  expect(writeRequests).toEqual([]);
});

test("two-hundred-percent font scale remains operable on 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/daughter");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const nav = page.getByRole("navigation", { name: menuLabel("daughter") });
  await expect(nav.getByRole("link")).toHaveCount(4);
  const measurements = await page.evaluate(() => {
    const nav = document.querySelector(".app-nav")!;
    const links = [...nav.querySelectorAll("a")];
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      targets: links.every((x) => x.getBoundingClientRect().height >= 44),
      navHeight: nav.getBoundingClientRect().height,
      reserve: Number.parseFloat(getComputedStyle(document.querySelector(".app-shell")!).paddingBottom),
    };
  });
  expect(measurements.documentWidth).toBeLessThanOrEqual(measurements.viewportWidth);
  expect(measurements.targets).toBe(true);
  expect(measurements.reserve).toBeGreaterThanOrEqual(measurements.navHeight);
});

