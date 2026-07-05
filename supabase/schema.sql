-- Run this in Supabase SQL editor: Dashboard → SQL Editor → New query

create extension if not exists "uuid-ossp";

create table if not exists tools (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  slug           text unique not null,
  name_ar        text not null,
  category       text not null check (category in ('writing','image','code','video','audio')),
  description_ar text not null,
  review_ar      text,
  pricing        text not null check (pricing in ('مجاني','مدفوع','freemium')),
  price_from     numeric,
  price_currency text not null default 'USD',
  use_cases      text[] not null default '{}',
  official_url   text not null,
  affiliate_url  text,
  features       jsonb not null default '{"ar":[],"en":[]}',
  is_free_tier   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists exchange_rates (
  currency   text primary key,
  rate       numeric not null,
  updated_at timestamptz not null default now()
);

-- Comparisons: FK on id not slug — avoids FK violations if slug changes
create table if not exists comparisons (
  id         uuid primary key default uuid_generate_v4(),
  tool_a_id  uuid not null references tools(id) on delete cascade,
  tool_b_id  uuid not null references tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tool_a_id, tool_b_id)
);

-- Keep updated_at current
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger tools_updated_at before update on tools
  for each row execute procedure update_updated_at();

-- Seed exchange rates (USD base)
insert into exchange_rates (currency, rate) values
  ('SAR', 3.75),
  ('EGP', 48.50),
  ('AED', 3.67),
  ('MAD', 10.10),
  ('KWD', 0.307),
  ('QAR', 3.64),
  ('BHD', 0.376),
  ('JOD', 0.709)
on conflict (currency) do update set rate = excluded.rate, updated_at = now();
