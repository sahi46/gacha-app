-- ガチャ定義テーブル
create table if not exists gachas (
  id uuid primary key default gen_random_uuid(),
  share_id text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- ガチャアイテムテーブル
create table if not exists gacha_items (
  id uuid primary key default gen_random_uuid(),
  gacha_id uuid references gachas(id) on delete cascade not null,
  name text not null,
  weight integer not null default 10 check (weight > 0),
  color text not null default '#a855f7',
  emoji text not null default '⭐',
  rarity_label text not null default '',
  created_at timestamptz default now()
);

-- インデックス
create index if not exists idx_gachas_share_id on gachas(share_id);
create index if not exists idx_gacha_items_gacha_id on gacha_items(gacha_id);

-- Row Level Security（誰でも読み書きOK、将来ユーザー認証追加時に変更）
alter table gachas enable row level security;
alter table gacha_items enable row level security;

create policy "anyone can read gachas" on gachas for select using (true);
create policy "anyone can insert gachas" on gachas for insert with check (true);

create policy "anyone can read gacha_items" on gacha_items for select using (true);
create policy "anyone can insert gacha_items" on gacha_items for insert with check (true);
