-- Life Replay Supabase schema
-- 現段階はログインなしの匿名ID方式です。
-- anonymousPlayerId は localStorage に保存されるため、厳密な本人性や改ざん耐性はありません。
-- 本番運用では Supabase Auth の user_id へ移行し、player_id を auth.uid() に紐づける想定です。

create extension if not exists pgcrypto;

create table if not exists players (
  id text primary key,
  display_name text,
  created_at timestamptz default now(),
  last_played_at timestamptz default now()
);

create table if not exists play_runs (
  id uuid primary key default gen_random_uuid(),
  player_id text not null,
  run_number integer,
  final_type text,
  ending_title text,
  final_stats jsonb,
  choices_log jsonb,
  routes jsonb,
  cards_earned jsonb,
  started_at timestamptz default now(),
  finished_at timestamptz default now()
);

create table if not exists card_catalog (
  id text primary key,
  name text not null,
  category text,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')),
  description text,
  unlock_hint text,
  unlock_condition_hidden boolean default false,
  sort_order integer default 0
);

create table if not exists collected_cards (
  player_id text not null,
  card_id text not null references card_catalog(id),
  first_run_id uuid,
  first_collected_at timestamptz default now(),
  collect_count integer default 1,
  primary key (player_id, card_id)
);

alter table players enable row level security;
alter table play_runs enable row level security;
alter table card_catalog enable row level security;
alter table collected_cards enable row level security;

-- 匿名ID方式のため、anon key からの読み書きを許可します。
-- 厳密なユーザー分離はできません。本番では Supabase Auth を導入し、
-- auth.uid() と player_id を照合する policy に置き換えてください。
drop policy if exists "anon can read players" on players;
drop policy if exists "anon can write players" on players;
drop policy if exists "anon can update players" on players;
drop policy if exists "anon can read play runs" on play_runs;
drop policy if exists "anon can write play runs" on play_runs;
drop policy if exists "anon can read card catalog" on card_catalog;
drop policy if exists "anon can write card catalog" on card_catalog;
drop policy if exists "anon can update card catalog" on card_catalog;
drop policy if exists "anon can read collected cards" on collected_cards;
drop policy if exists "anon can write collected cards" on collected_cards;
drop policy if exists "anon can update collected cards" on collected_cards;

create policy "anon can read players" on players for select to anon using (true);
create policy "anon can write players" on players for insert to anon with check (true);
create policy "anon can update players" on players for update to anon using (true) with check (true);

create policy "anon can read play runs" on play_runs for select to anon using (true);
create policy "anon can write play runs" on play_runs for insert to anon with check (true);

create policy "anon can read card catalog" on card_catalog for select to anon using (true);
create policy "anon can write card catalog" on card_catalog for insert to anon with check (true);
create policy "anon can update card catalog" on card_catalog for update to anon using (true) with check (true);

create policy "anon can read collected cards" on collected_cards for select to anon using (true);
create policy "anon can write collected cards" on collected_cards for insert to anon with check (true);
create policy "anon can update collected cards" on collected_cards for update to anon using (true) with check (true);
