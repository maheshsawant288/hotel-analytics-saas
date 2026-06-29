'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Channel, PropertyCategory, BedConfiguration } from '@/types';

interface RoomTypeInput {
  name: string;
  room_count: number;
  base_rate: number;
  max_occupancy: number;
  bed_configuration: BedConfiguration;
}

interface OnboardingInput {
  name: string;
  city: string;
  state: string;
  star_rating: number;
  property_category: PropertyCategory;
  total_rooms: number;
  check_in_time: string;
  check_out_time: string;
  room_types: RoomTypeInput[];
  active_channels: Channel[];
  gst_number?: string;
  pan_number?: string;
  hotel_phone?: string;
  address?: string;
  pincode?: string;
}

export async function createHotelWithDetails(
  input: OnboardingInput
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated. Please sign in again.' };

  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .insert({
      owner_id: user.id,
      name: input.name,
      city: input.city,
      state: input.state,
      star_rating: input.star_rating,
      property_category: input.property_category,
      total_rooms: input.total_rooms,
      check_in_time: input.check_in_time,
      check_out_time: input.check_out_time,
      address: input.address ?? null,
      gst_number: input.gst_number ?? null,
      pan_number: input.pan_number ?? null,
      hotel_phone: input.hotel_phone ?? null,
      pincode: input.pincode ?? null,
    })
    .select('id')
    .single();

  if (hotelError || !hotel) {
    return { error: hotelError?.message ?? 'Failed to create hotel.' };
  }

  const { error: roomTypeError } = await supabase.from('room_types').insert(
    input.room_types.map((rt) => ({ hotel_id: hotel.id, ...rt }))
  );

  if (roomTypeError) {
    return { error: `Room types: ${roomTypeError.message}` };
  }

  const { error: channelError } = await supabase.from('hotel_channels').insert(
    input.active_channels.map((ch) => ({
      hotel_id: hotel.id,
      channel: ch,
      is_active: true,
    }))
  );

  if (channelError) {
    return { error: `Channels: ${channelError.message}` };
  }

  redirect('/dashboard');
}
