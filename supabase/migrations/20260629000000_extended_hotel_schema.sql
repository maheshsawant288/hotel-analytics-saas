-- Migration: extended_hotel_schema
-- Created: 2026-06-29
-- Description: Room types, hotel channels, and extended hotel fields for richer onboarding

-- ============================================================
-- EXTEND HOTELS TABLE
-- ============================================================

alter table hotels add column if not exists state text;
alter table hotels add column if not exists property_category text
  check (property_category in ('hotel','resort','boutique','guest_house','heritage'));
alter table hotels add column if not exists check_in_time time default '14:00';
alter table hotels add column if not exists check_out_time time default '11:00';
alter table hotels add column if not exists peak_rooms_saleable int;
alter table hotels add column if not exists gst_number text;
alter table hotels add column if not exists pan_number text;
alter table hotels add column if not exists hotel_phone text;
alter table hotels add column if not exists pincode text;
alter table hotels add column if not exists year_established int;

-- ============================================================
-- ROOM TYPES TABLE
-- ============================================================

create table if not exists room_types (
  id                uuid primary key default gen_random_uuid(),
  hotel_id          uuid not null references hotels(id) on delete cascade,
  name              text not null,
  room_count        int not null check (room_count > 0),
  base_rate         decimal(10,2) not null check (base_rate > 0),
  max_occupancy     int not null default 2 check (max_occupancy > 0),
  bed_configuration text not null check (bed_configuration in ('single','double','twin','multiple')),
  created_at        timestamptz default now(),
  unique (hotel_id, name)
);

alter table room_types enable row level security;

create policy "owners manage own room_types" on room_types
  for all using (
    hotel_id in (select id from hotels where owner_id = auth.uid())
  );

-- ============================================================
-- HOTEL CHANNELS TABLE
-- ============================================================

create table if not exists hotel_channels (
  id              uuid primary key default gen_random_uuid(),
  hotel_id        uuid not null references hotels(id) on delete cascade,
  channel         text not null check (channel in ('direct','booking_com','makemytrip','agoda','goibibo','expedia','walk_in')),
  is_active       boolean not null default true,
  commission_rate decimal(5,2),
  created_at      timestamptz default now(),
  unique (hotel_id, channel)
);

alter table hotel_channels enable row level security;

create policy "owners manage own hotel_channels" on hotel_channels
  for all using (
    hotel_id in (select id from hotels where owner_id = auth.uid())
  );
