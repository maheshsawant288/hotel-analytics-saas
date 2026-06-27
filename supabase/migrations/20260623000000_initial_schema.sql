-- Migration: initial_schema
-- Created: 2026-06-23
-- Description: Core tables for HotelLens — hotels, rooms, bookings, subscriptions with RLS

-- ============================================================
-- TABLES
-- ============================================================

create table hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text not null,
  address text,
  city text,
  star_rating int check (star_rating between 1 and 5),
  total_rooms int,
  created_at timestamptz default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  room_number text not null,
  room_type text not null,
  floor int,
  base_rate decimal(10,2)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  room_id uuid references rooms(id),
  guest_name text,
  check_in date not null,
  check_out date not null,
  status text check (status in ('confirmed','checked_in','checked_out','cancelled','no_show')),
  channel text check (channel in ('direct','booking_com','makemytrip','agoda','goibibo','expedia','walk_in')),
  room_rate decimal(10,2),
  adults int default 1,
  children int default 0,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  plan text check (plan in ('starter','growth','pro')),
  status text check (status in ('active','cancelled','past_due')),
  razorpay_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table hotels enable row level security;
alter table rooms enable row level security;
alter table bookings enable row level security;
alter table subscriptions enable row level security;

create policy "owners see own hotels" on hotels
  for all using (auth.uid() = owner_id);

create policy "owners see own rooms" on rooms
  for all using (
    hotel_id in (select id from hotels where owner_id = auth.uid())
  );

create policy "owners see own bookings" on bookings
  for all using (
    hotel_id in (select id from hotels where owner_id = auth.uid())
  );

create policy "owners see own subscriptions" on subscriptions
  for all using (auth.uid() = owner_id);
