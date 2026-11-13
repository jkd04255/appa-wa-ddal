import { PGlite } from '@electric-sql/pglite';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const db = new PGlite();
let checks = 0;
const one = '00000000-0000-0000-0000-000000000001';
const two = '00000000-0000-0000-0000-000000000002';
const unconfirmed = '00000000-0000-0000-0000-000000000003';
const anonymous = '00000000-0000-0000-0000-000000000004';
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users (id uuid primary key, email_confirmed_at timestamptz, is_anonymous boolean default false);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth, public to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
insert into auth.users values ('${one}', now(), false), ('${two}', now(), false), ('${unconfirmed}', null, false), ('${anonymous}', now(), true);`);
await db.exec(await readFile(new URL('../supabase/migrations/20261113151710_account_balance_vote.sql', import.meta.url), 'utf8'));
async function as(role, uid, sql) {
  await db.exec('begin');
  try { await db.exec(`set local role ${role}; select set_config('request.jwt.claim.sub', '${uid}', true);`); const r = await db.query(sql); await db.exec('commit'); return r.rows; }
  catch(e) { await db.exec('rollback'); throw e; }
}
async function denied(name, role, uid, sql) { await assert.rejects(as(role, uid, sql), undefined, name); checks++; }
const vote = (uid, side = 'left', poll = 'travel-plan') => `insert into public.balance_votes(user_id,poll_id,side) values ('${uid}','${poll}','${side}')`;
assert.equal((await as('anon', '', 'select total_votes from public.balance_poll_results'))[0].total_votes, 0); checks++;
await denied('guest writes', 'anon', '', vote(one));
await denied('guest reads private votes', 'anon', '', 'select * from public.balance_votes');
await denied('forged owner', 'authenticated', one, vote(two));
await denied('unconfirmed', 'authenticated', unconfirmed, vote(unconfirmed));
await denied('anonymous auth', 'authenticated', anonymous, vote(anonymous));
await as('authenticated', one, vote(one)); checks++;
await denied('duplicate vote', 'authenticated', one, vote(one, 'right'));
await as('authenticated', one, vote(one) + ' on conflict do nothing'); checks++;
await as('authenticated', two, vote(two, 'right')); checks++;
const totals = await as('anon', '', 'select left_votes,right_votes,total_votes from public.balance_poll_results');
assert.deepEqual(totals, [{left_votes:1,right_votes:1,total_votes:2}]); checks++;
assert.equal((await as('authenticated', one, 'select * from public.balance_votes')).length, 1); checks++;
await denied('change vote', 'authenticated', one, "update public.balance_votes set side='right'");
await denied('delete vote', 'authenticated', one, 'delete from public.balance_votes');
await denied('modify counts', 'authenticated', one, 'update public.balance_poll_totals set left_votes=999');
await denied('forge date', 'authenticated', one, `insert into public.balance_votes(user_id,poll_id,side,created_at) values ('${one}','travel-plan','left',now())`);
await denied('invalid side', 'authenticated', one, vote(one, 'middle'));
await denied('direct trigger RPC', 'authenticated', one, 'select private.count_balance_vote()');
await db.exec("insert into public.balance_polls(id,question,left_label,right_label,published,opens_at,closes_at) values ('closed','closed','a','b',true,now()-interval '2 days',now()-interval '1 day'), ('draft','draft','a','b',false,now(),null)");
await denied('closed poll', 'authenticated', one, vote(one,'left','closed'));
await denied('unpublished poll', 'authenticated', one, vote(one,'left','draft'));
assert.equal((await as('anon', '', 'select * from public.balance_poll_results')).length, 1); checks++;
await db.exec(`delete from auth.users where id='${one}'`);
assert.equal((await as('anon', '', 'select total_votes from public.balance_poll_results'))[0].total_votes, 1); checks++;
await denied('deleted account token', 'authenticated', one, vote(one));
await db.close();
console.log(`Vote database security: ${checks} checks passed (local Postgres/PGlite; hosted Auth not tested).`);
