import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const userId = '00000000-0000-0000-0000-000000000001';
const email = 'member@example.invalid';
const user = { id: userId, aud: 'authenticated', role: 'authenticated', email, email_confirmed_at: '2026-01-01T00:00:00Z', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
function session() {
  const now = Math.floor(Date.now()/1000);
  const token = `${Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')}.${Buffer.from(JSON.stringify({sub:userId,role:'authenticated',aud:'authenticated',exp:now+3600,iat:now,email})).toString('base64url')}.fixture`;
  return { access_token: token, refresh_token: 'fixture-refresh-token', expires_in: 3600, expires_at: now+3600, token_type: 'bearer', user };
}
async function mock(page: Page, options: { duplicate?: boolean; failLogin?: boolean; zero?: boolean } = {}) {
  const writes: { path: string; body: Record<string, unknown> | null }[] = [];
  let voted = false;
  await page.route('https://auth-fixture.supabase.co/**', async route => {
    const req = route.request(); const url = new URL(req.url());
    const path = url.pathname;
    if (req.method() === 'OPTIONS') { await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers':'*','access-control-allow-methods':'*' } }); return; }
    if (req.method() === 'POST') writes.push({path,body:req.postDataJSON()});
    let result: unknown = {}; let status = 200;
    if (path === '/auth/v1/token') {
      result = options.failLogin ? { error_code: 'invalid_credentials', msg: 'Invalid login credentials' } : session();
      if (options.failLogin) status=400;
    } else if (path === '/auth/v1/user') result=user;
    else if (path === '/auth/v1/signup') result={ ...user, identities: [] };
    else if (path === '/auth/v1/logout') status=204;
    else if (path === '/rest/v1/balance_poll_results') result={id:'travel-plan',question:'친구랑 여행 갈 때, 나는?',left_label:'분 단위 계획파',right_label:'일단 출발 즉흥파',left_votes:options.zero ? 0 : 6+(voted && !options.duplicate?1:0),right_votes:options.zero ? 0 : 4,total_votes:options.zero ? 0 : 10+(voted && !options.duplicate?1:0)};
    else if (path === '/rest/v1/balance_votes' && req.method() === 'POST') {
      voted = true;
      if(options.duplicate) {status=409; result={code:'23505',message:'unique violation'};} else {status=201; result=null;}
    } else if (path === '/rest/v1/balance_votes') result=voted ? {side:'left'} : null;
    else if (path !== '/auth/v1/recover') throw new Error(`Unmocked fixture endpoint: ${path}`);
    await route.fulfill({status,contentType:'application/json',body:status===204?'':JSON.stringify(result),headers:{'access-control-allow-origin':'*'}});
  });
  return writes;
}
async function login(page: Page) {
  await page.goto('/account');
  await page.getByLabel('이메일', {exact:true}).fill(email);
  await page.getByLabel('비밀번호', {exact:true}).fill('Fixture-password-123');
  await page.getByRole('button',{name:'로그인',exact:true}).last().click();
  await expect(page.getByRole('heading',{name:'내 계정'})).toBeVisible();
}

test('email login, one vote, refresh, and logout use the SDK contract', async ({page}) => {
  const writes=await mock(page);
  await login(page);
  await page.getByRole('link',{name:'밸런스 게임으로 돌아가기'}).click();
  await expect(page.locator('.balance-game__footer')).toContainText('10표 참여');
  await page.getByRole('button',{name:/분 단위 계획파/}).click();
  await expect(page.locator('.balance-game__footer')).toContainText('11표 참여');
  await expect(page.getByRole('button',{name:/분 단위 계획파/})).toBeDisabled();
  expect(writes.filter(w=>w.path==='/rest/v1/balance_votes')).toEqual([{path:'/rest/v1/balance_votes',body:{poll_id:'travel-plan',user_id:userId,side:'left'}}]);
  await page.reload();
  await expect(page.locator('.balance-game__footer')).toContainText('투표 완료');
  await page.getByRole('link',{name:'내 계정',exact:true}).click();
  await page.getByRole('button',{name:'로그아웃'}).click();
  await expect(page.getByRole('heading',{name:'내 쪽에 한 표'})).toBeVisible();
});
test('signup confirmation and password mismatch do not claim immediate login', async ({page}) => {
  const writes=await mock(page); await page.goto('/account');
  await page.getByRole('button',{name:'회원가입',exact:true}).click();
  await page.getByLabel('이메일',{exact:true}).fill(email);
  await page.getByLabel('비밀번호',{exact:true}).fill('Fixture-password-123');
  await page.getByLabel('비밀번호 확인',{exact:true}).fill('Different-password-456');
  await page.getByRole('checkbox').check();
  await page.getByRole('button',{name:'이메일로 회원가입'}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('일치하지 않습니다');
  expect(writes).toHaveLength(0);
  await page.getByLabel('비밀번호 확인',{exact:true}).fill('Fixture-password-123');
  await page.getByRole('button',{name:'이메일로 회원가입'}).click();
  await expect(page.getByRole('status')).toContainText('확인 메일');
  await expect(page.getByRole('heading',{name:'내 계정'})).toHaveCount(0);
  expect(writes.filter(w=>w.path==='/auth/v1/signup')).toHaveLength(1);
});
test('login errors do not expose whether an account exists', async ({page}) => {
  await mock(page,{failLogin:true}); await page.goto('/account');
  await page.getByLabel('이메일',{exact:true}).fill(email);
  await page.getByLabel('비밀번호',{exact:true}).fill('wrong');
  await page.getByRole('button',{name:'로그인',exact:true}).last().click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('이메일·비밀번호와 이메일 인증 여부');
});
test('reset request gives the same result without confirming account existence', async ({page}) => {
  const writes=await mock(page); await page.goto('/account');
  await page.getByRole('button',{name:'비밀번호를 잊으셨나요?'}).click();
  await page.getByLabel('이메일',{exact:true}).fill(email);
  await page.getByRole('button',{name:'재설정 메일 받기'}).click();
  await expect(page.getByRole('status')).toContainText('등록된 이메일이면');
  expect(writes.filter(w=>w.path==='/auth/v1/recover')).toHaveLength(1);
});
test('duplicate vote refreshes the authoritative total without optimistic inflation', async ({page}) => {
  const writes=await mock(page,{duplicate:true}); await login(page); await page.goto('/daughter');
  await expect(page.locator('.balance-game__footer')).toContainText('10표 참여');
  await page.getByRole('button',{name:/분 단위 계획파/}).click();
  await expect(page.locator('#balance-game').getByRole('status')).toContainText('이미 참여');
  await expect(page.locator('.balance-game__footer')).toContainText('10표 참여');
  await expect(page.getByRole('button',{name:/분 단위 계획파/})).toBeDisabled();
  expect(writes.filter(w=>w.path==='/rest/v1/balance_votes')).toHaveLength(1);
});
test('zero votes are not displayed as 50% support; account form meets axe rules', async ({page}) => {
  await mock(page,{zero:true}); await page.goto('/daughter');
  await expect(page.locator('#balance-game').getByRole('img')).toHaveAccessibleName(/0%.*0%/);
  await expect(page.locator('.balance-game__footer')).toContainText('아직 0표');
  await page.goto('/account');
  const result=await new AxeBuilder({page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"]}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
});


test('Google handoff uses PKCE and returns only to the account route', async ({page}) => {
  await mock(page);
  let destination: URL | null = null;
  await page.route('https://auth-fixture.supabase.co/auth/v1/authorize**', async route => {
    destination = new URL(route.request().url());
    await route.fulfill({contentType:'text/html',body:'<h1>OAuth fixture handoff</h1>'});
  });
  await page.goto('/account');
  await page.getByRole('button',{name:/Google로 계속하기/}).click();
  await expect(page.getByRole('heading',{name:'OAuth fixture handoff'})).toBeVisible();
  expect(destination!.searchParams.get('provider')).toBe('google');
  expect(destination!.searchParams.get('redirect_to')).toBe('http://127.0.0.1:3418/account/');
  expect(destination!.searchParams.get('code_challenge')).toBeTruthy();
});

test('untrusted callback error content is never echoed', async ({page}) => {
  await mock(page); await page.goto('/account?error=denied&error_description=malicious-private-token');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('로그인 연결을 완료하지 못했습니다');
  await expect(page.locator('body')).not.toContainText('malicious-private-token');
});
