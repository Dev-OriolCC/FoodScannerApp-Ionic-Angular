-- Scan history per user. Run this once in the Supabase SQL editor.
--
-- Auth comes from Clerk (Supabase third-party auth), so the user ID is the
-- Clerk user ID ("user_...") found in the JWT "sub" claim, not a Supabase auth.users ID.

create table public.scan_history (
    id uuid primary key default gen_random_uuid(),
    user_id text not null default (auth.jwt() ->> 'sub'),

    -- Product info (from Open Food Facts)
    barcode text not null,
    name text not null,
    brand text,
    image_url text,
    is_liquid boolean not null default false,

    -- Nutrients per 100 g (solids) or 100 ml (liquids). Null when unknown.
    kcal double precision,
    sugars double precision,
    saturated_fat double precision,
    sodium_mg double precision,

    has_caffeine boolean not null default false,
    has_sweeteners boolean not null default false,
    has_colorants boolean not null default false,

    -- NOM-051 warnings at scan time, e.g. {sugars,sodium} and {caffeine}
    excess_warnings text[] not null default '{}',
    contains_warnings text[] not null default '{}',

    -- healthy = no warnings, unhealthy = has warnings, unknown = no nutrition data
    health_status text not null check (health_status in ('healthy', 'unhealthy', 'unknown')),

    is_favorite boolean not null default false,
    scanned_at timestamptz not null default now(),
    created_at timestamptz not null default now(),

    -- Scanning the same product again updates its row instead of adding a new one.
    unique (user_id, barcode)
);

create index scan_history_user_scanned_at_idx on public.scan_history (user_id, scanned_at desc);

-- Each user can only see and change their own scans.
alter table public.scan_history enable row level security;

create policy "Users can view their own scans"
    on public.scan_history for select
    to authenticated
    using ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can add their own scans"
    on public.scan_history for insert
    to authenticated
    with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own scans"
    on public.scan_history for update
    to authenticated
    using ((select auth.jwt() ->> 'sub') = user_id)
    with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "Users can delete their own scans"
    on public.scan_history for delete
    to authenticated
    using ((select auth.jwt() ->> 'sub') = user_id);
