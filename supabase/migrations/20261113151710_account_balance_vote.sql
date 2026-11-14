-- Server-owned totals. No reward balances or furniture writes are exposed.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.balance_polls (
  id text primary key check (length(id) between 1 and 80),
  question text not null check (length(question) between 1 and 140),
  left_label text not null check (length(left_label) between 1 and 40),
  right_label text not null check (length(right_label) between 1 and 40),
  published boolean not null default false,
  opens_at timestamptz not null default now(),
  closes_at timestamptz,
  check (closes_at is null or closes_at > opens_at)
);
create table public.balance_poll_totals (
  poll_id text primary key references public.balance_polls(id) on delete cascade,
  left_votes bigint not null default 0 check (left_votes >= 0),
  right_votes bigint not null default 0 check (right_votes >= 0)
);
create table public.balance_votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  poll_id text not null references public.balance_polls(id) on delete cascade,
  side text not null check (side in ('left', 'right')),
  created_at timestamptz not null default now(),
  primary key (user_id, poll_id)
);
create index balance_votes_poll_id_idx on public.balance_votes(poll_id);
alter table public.balance_polls enable row level security;
alter table public.balance_poll_totals enable row level security;
alter table public.balance_votes enable row level security;
revoke all on public.balance_polls, public.balance_poll_totals, public.balance_votes from public, anon, authenticated;
grant select on public.balance_polls, public.balance_poll_totals to anon, authenticated;
grant select on public.balance_votes to authenticated;
grant insert (user_id, poll_id, side) on public.balance_votes to authenticated;

create policy published_polls on public.balance_polls for select to anon, authenticated
using (published and opens_at <= now());
create policy published_totals on public.balance_poll_totals for select to anon, authenticated
using (exists (select 1 from public.balance_polls p where p.id = poll_id));
create policy own_vote_read on public.balance_votes for select to authenticated
using ((select auth.uid()) = user_id);
create policy own_vote_insert on public.balance_votes for insert to authenticated
with check ((select auth.uid()) = user_id);

-- Trigger-only privileged code: no client may call it as an RPC.
create function private.record_balance_vote() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or new.user_id <> auth.uid() or not exists (
    select 1 from auth.users u where u.id = auth.uid()
    and u.email_confirmed_at is not null and not coalesce(u.is_anonymous, false)
  ) then raise exception 'A verified member is required' using errcode = '42501'; end if;
  perform 1 from public.balance_polls p where p.id = new.poll_id and p.published
    and p.opens_at <= now() and (p.closes_at is null or p.closes_at > now()) for share;
  if not found then raise exception 'Poll is not open' using errcode = '42501'; end if;
  new.created_at := now();
  return new;
end;
$$;
revoke all on function private.record_balance_vote() from public, anon, authenticated;
create trigger validate_balance_vote before insert on public.balance_votes
for each row execute function private.record_balance_vote();

-- AFTER INSERT prevents ON CONFLICT DO NOTHING from inflating counts.
-- DELETE handles administrative erasure / auth.users cascades consistently.
create function private.count_balance_vote() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.balance_poll_totals (poll_id, left_votes, right_votes)
    values (new.poll_id, (new.side = 'left')::int, (new.side = 'right')::int)
    on conflict (poll_id) do update set
      left_votes = public.balance_poll_totals.left_votes + excluded.left_votes,
      right_votes = public.balance_poll_totals.right_votes + excluded.right_votes;
    return new;
  end if;
  update public.balance_poll_totals set
    left_votes = left_votes - (old.side = 'left')::int,
    right_votes = right_votes - (old.side = 'right')::int where poll_id = old.poll_id;
  return old;
end;
$$;
revoke all on function private.count_balance_vote() from public, anon, authenticated;
create trigger count_balance_vote after insert or delete on public.balance_votes
for each row execute function private.count_balance_vote();

create view public.balance_poll_results with (security_invoker = true) as
select p.id, p.question, p.left_label, p.right_label,
  coalesce(t.left_votes, 0) as left_votes, coalesce(t.right_votes, 0) as right_votes,
  coalesce(t.left_votes, 0) + coalesce(t.right_votes, 0) as total_votes
from public.balance_polls p left join public.balance_poll_totals t on t.poll_id = p.id
where p.published and p.opens_at <= now() and (p.closes_at is null or p.closes_at > now());
revoke all on public.balance_poll_results from public, anon, authenticated;
grant select on public.balance_poll_results to anon, authenticated;

-- Editorial seed only. Counts are zero; browser-only examples never enter this DB.
insert into public.balance_polls(id, question, left_label, right_label, published)
values ('travel-plan', '친구랑 여행 갈 때, 나는?', '분 단위 계획파', '일단 출발 즉흥파', true);
