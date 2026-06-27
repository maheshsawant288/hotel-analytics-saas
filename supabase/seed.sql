-- Seed data for staging/development only
-- DO NOT run on production
--
-- Usage: paste into Supabase SQL editor on staging project
-- Requires: a user to already exist in auth.users
--           replace the owner_id UUIDs with a real auth user ID

-- Insert a test hotel
insert into hotels (id, owner_id, name, address, city, star_rating, total_rooms)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  '<replace-with-your-auth-user-id>',
  'The Grand Pune',
  '12 MG Road',
  'Pune',
  4,
  50
);

-- Insert rooms
insert into rooms (hotel_id, room_number, room_type, floor, base_rate) values
  ('a1b2c3d4-0000-0000-0000-000000000001', '101', 'Standard', 1, 2500),
  ('a1b2c3d4-0000-0000-0000-000000000001', '102', 'Standard', 1, 2500),
  ('a1b2c3d4-0000-0000-0000-000000000001', '201', 'Deluxe',   2, 3500),
  ('a1b2c3d4-0000-0000-0000-000000000001', '202', 'Deluxe',   2, 3500),
  ('a1b2c3d4-0000-0000-0000-000000000001', '301', 'Suite',    3, 6000);

-- Insert sample bookings
insert into bookings (hotel_id, guest_name, check_in, check_out, status, channel, room_rate, adults, children) values
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Rahul Sharma',   '2026-06-01', '2026-06-03', 'checked_out', 'direct',      2500, 2, 0),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Priya Mehta',    '2026-06-05', '2026-06-07', 'checked_out', 'booking_com', 3500, 1, 1),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Amit Joshi',     '2026-06-10', '2026-06-12', 'checked_out', 'makemytrip',  2500, 2, 0),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Sneha Kulkarni', '2026-06-15', '2026-06-18', 'checked_out', 'direct',      6000, 2, 1),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Vikram Nair',    '2026-06-20', '2026-06-22', 'checked_out', 'agoda',       3500, 2, 0),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Anita Desai',    '2026-06-25', '2026-06-27', 'confirmed',   'goibibo',     2500, 1, 0),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Rohan Patil',    '2026-06-28', '2026-06-30', 'cancelled',   'expedia',     3500, 2, 0);
