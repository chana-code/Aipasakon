-- ============================================================
-- AI ภาษาคน — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension (already enabled by default in Supabase)
-- create extension if not exists "uuid-ossp";

-- -------------------------------------------------------
-- user_bookmarks
-- -------------------------------------------------------
create table if not exists public.user_bookmarks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  chapter_slug text not null,
  created_at   timestamptz not null default now(),

  unique (user_id, chapter_slug)
);

-- Index for fast user lookups
create index if not exists user_bookmarks_user_id_idx
  on public.user_bookmarks (user_id);

-- Enable Row Level Security
alter table public.user_bookmarks enable row level security;

-- RLS policies: users can only see and modify their own rows
create policy "Users can view own bookmarks"
  on public.user_bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.user_bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.user_bookmarks for delete
  using (auth.uid() = user_id);


-- -------------------------------------------------------
-- user_completions
-- -------------------------------------------------------
create table if not exists public.user_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  chapter_slug text not null,
  completed_at timestamptz not null default now(),

  unique (user_id, chapter_slug)
);

-- Index for fast user lookups
create index if not exists user_completions_user_id_idx
  on public.user_completions (user_id);

-- Enable Row Level Security
alter table public.user_completions enable row level security;

-- RLS policies
create policy "Users can view own completions"
  on public.user_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.user_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own completions"
  on public.user_completions for update
  using (auth.uid() = user_id);

create policy "Users can delete own completions"
  on public.user_completions for delete
  using (auth.uid() = user_id);
