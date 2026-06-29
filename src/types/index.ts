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

export type SubscriptionPlan = 'starter' | 'growth' | 'pro';

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';

export type PropertyCategory = 'hotel' | 'resort' | 'boutique' | 'guest_house' | 'heritage';

export type BedConfiguration = 'single' | 'double' | 'twin' | 'multiple';

export interface Hotel {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  star_rating: number | null;
  total_rooms: number | null;
  property_category: PropertyCategory | null;
  check_in_time: string | null;
  check_out_time: string | null;
  peak_rooms_saleable: number | null;
  gst_number: string | null;
  pan_number: string | null;
  hotel_phone: string | null;
  pincode: string | null;
  year_established: number | null;
  created_at: string;
}

export interface RoomType {
  id: string;
  hotel_id: string;
  name: string;
  room_count: number;
  base_rate: number;
  max_occupancy: number;
  bed_configuration: BedConfiguration;
  created_at: string;
}

export interface HotelChannel {
  id: string;
  hotel_id: string;
  channel: Channel;
  is_active: boolean;
  commission_rate: number | null;
  created_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  room_type: string;
  floor: number | null;
  base_rate: number | null;
}

export interface Booking {
  id: string;
  hotel_id: string;
  room_id: string | null;
  guest_name: string | null;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  channel: Channel;
  room_rate: number;
  adults: number;
  children: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  owner_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  razorpay_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
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
