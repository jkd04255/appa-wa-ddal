import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/dad", "/dad/trends", "/dad/community", "/dad/community/new",
  "/dad/perspectives/a-comfortable-distance",
  "/daughter", "/daughter/discover", "/daughter/community/new",
  "/daughter/perspectives", "/daughter/polls",
] as const;

test("skip link transfers actual keyboard focus to main across editorial, community and demo routes", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "본문으로 바로가기" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"#main-content$"));
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main-content");
    const keyboardOnly = await page.locator("#main-content").evaluate((el) => el.getAttribute("tabindex"));
    expect(keyboardOnly).toBe("-1");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest("main#main-content") !== null),route)
      .toBe(true);
  }
});

test("skip link retains native fragment anchor for progressive enhancement", async ({page})=>{
  for(const route of ["/dad/trends","/daughter/community/new"]){
    await page.goto(route);
    const skip=page.getByRole("link",{name:"본문으로 바로가기"});
    await expect(skip).toHaveAttribute("href","#main-content");
    await expect(page.locator("main#main-content")).toHaveCount(1);
    // Native fragment URL remains useful even if its click handler is unavailable.
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1);
  }
});

function luminance(rgb: string) {
  const vals = (rgb.match(/[\d.]+/g) ?? []).slice(0,3).map((n) => Number(n)/255);
  if(vals.length!==3)throw new Error("not a CSS color: "+rgb);
  const [r,g,b]=vals.map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return 0.2126*r+0.7152*g+0.0722*b;
}
function contrast(a:string,b:string){
  const [u,v]=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (u+0.05)/(v+0.05);
}

test("visible community form boundaries meet >=3:1 non-text contrast in both themes", async ({page})=>{
  for(const space of ["dad","daughter"]){
    for(const url of [`/${space}/community`,`/${space}/community/new`]){
      await page.goto(url);
      const fields=page.locator(".community-demo__field input,.community-demo__field select,.community-demo__field textarea");
      expect(await fields.count()).toBeGreaterThanOrEqual(2);
      for(const field of await fields.all()){
        const values=await field.evaluate(el=>({
          border:getComputedStyle(el).borderTopColor,
          background:getComputedStyle(el).backgroundColor,
          width:el.getBoundingClientRect().width,
          height:el.getBoundingClientRect().height
        }));
        expect(contrast(values.border,values.background),url+" border").toBeGreaterThanOrEqual(3);
        expect(values.height,url+" touch target").toBeGreaterThanOrEqual(44);
      }
    }
  }
});

test("main content bottom and four fixed navigation links do not collide at seven viewports",async({page})=>{
  test.setTimeout(120000);
  const sample=[
    "/dad","/dad/trends","/dad/community/new","/dad/perspectives",
    "/daughter","/daughter/discover","/daughter/community","/daughter/polls",
  ];
  for(const width of [320,360,375,390,430,768,1024]){
    await page.setViewportSize({width,height:760});
    for(const route of sample){
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),
        route+" overflow at "+width).toBe(true);
      const nav=page.locator(".app-nav");
      await expect(nav.getByRole("link")).toHaveCount(4);
      const position=await nav.evaluate(el=>getComputedStyle(el).position);
      expect(position).toBe(width<768?"fixed":"static");
      if(width<768){
        await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"}));
        await expect.poll(()=>page.evaluate(()=>Math.round(window.scrollY+window.innerHeight)>=document.documentElement.scrollHeight-2)).toBe(true);
        const m=await page.evaluate(()=>{
          const main=document.querySelector("main#main-content")!;
          const nav=document.querySelector(".app-nav")!;
          return {mainBottom:main.getBoundingClientRect().bottom,navTop:nav.getBoundingClientRect().top};
        });
        expect(m.mainBottom,route+" obscured by fixed navigation at "+width).toBeLessThanOrEqual(m.navTop-1);
      }
    }
  }
});

test("320px and 200% font enlargement remain scrollable and navigable across representative pages", async ({page})=>{
  await page.setViewportSize({width:320,height:740});
  for(const route of routes){
    await page.goto(route);
    await page.evaluate(()=>{document.documentElement.style.fontSize="200%";});
    const m=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      navHeight:document.querySelector(".app-nav")!.getBoundingClientRect().height,
      reserved:parseFloat(getComputedStyle(document.querySelector(".app-shell")!).paddingBottom),
    }));
    expect(m.overflow,route+" zoom overflow").toBe(false);
    expect(m.reserved,route+" bottom nav reserve").toBeGreaterThanOrEqual(m.navHeight);
  }
});

test("contrast fix keeps visible keyboard focus, axe AA and no writes on both community composers",async({page})=>{
  const requests:string[]=[];
  page.on("request",req=>{
    if(!["GET","HEAD","OPTIONS"].includes(req.method()))requests.push(req.method()+" "+req.url());
    if(new URL(req.url()).hostname!=="127.0.0.1")requests.push("external "+req.url());
  });
  for(const space of ["dad","daughter"]){
    await page.goto(`/${space}/community/new`);
    const title=page.getByRole("textbox",{name:"제목 (최대 80자)"});
    await title.focus();
    expect(await title.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe("solid");
    await title.fill("메모리 안의 예시");
    await page.getByRole("textbox",{name:"내용 (최대 500자)"}).fill("테스트 전용 예시 본문");
    await page.getByRole("button",{name:"화면에서만 미리보기"}).click();
    await expect(page.locator(".community-demo__draft-preview")).toContainText("게시·저장되지 않았습니다");
    const axePage=page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
    const report=await new AxeBuilder({page:axePage})
      .withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    expect(report.violations,space+" "+JSON.stringify(report.violations,null,2)).toEqual([]);
    await page.reload();
    await expect(title).toHaveValue("");
    await expect(page.locator(".community-demo__draft-preview")).toHaveCount(0);
  }
  expect(requests).toEqual([]);
});
