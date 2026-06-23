export type Channel =
  | 'direct'
  | 'booking_com'
  | 'makemytrip'
  | 'agoda'
  | 'goibibo'
  | 'expedia'
  | 'walk_in';

export type BookingStatus =
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  star_rating: number;
  owner_id: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_type: string;
  room_number: string;
  floor: number;
}

export interface Booking {
  id: string;
  hotel_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  channel: Channel;
  room_rate: number;
  adults: number;
  children: number;
}

export interface KPIData {
  date: string;
  occupancy_rate: number;
  adr: number;
  revpar: number;
  total_revenue: number;
  rooms_occupied: number;
  rooms_available: number;
}
