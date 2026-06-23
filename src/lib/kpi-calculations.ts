import { Booking, Channel } from '@/types';

const COMMISSION_RATES: Record<Channel, number> = {
  booking_com: 0.18,
  makemytrip: 0.20,
  agoda: 0.18,
  goibibo: 0.18,
  expedia: 0.20,
  direct: 0,
  walk_in: 0,
};

export function calculateOccupancyRate(roomsOccupied: number, roomsAvailable: number): number {
  if (roomsAvailable === 0) return 0;
  return (roomsOccupied / roomsAvailable) * 100;
}

export function calculateADR(totalRoomRevenue: number, roomsOccupied: number): number {
  if (roomsOccupied === 0) return 0;
  return totalRoomRevenue / roomsOccupied;
}

export function calculateRevPAR(totalRoomRevenue: number, roomsAvailable: number): number {
  if (roomsAvailable === 0) return 0;
  return totalRoomRevenue / roomsAvailable;
}

export function calculateCancellationRate(cancellations: number, totalBookings: number): number {
  if (totalBookings === 0) return 0;
  return (cancellations / totalBookings) * 100;
}

export function calculateRevenueByChannel(bookings: Booking[]): Record<Channel, number> {
  const revenue: Record<Channel, number> = {
    direct: 0,
    booking_com: 0,
    makemytrip: 0,
    agoda: 0,
    goibibo: 0,
    expedia: 0,
    walk_in: 0,
  };

  for (const booking of bookings) {
    if (booking.status !== 'cancelled' && booking.status !== 'no_show') {
      revenue[booking.channel] += booking.room_rate;
    }
  }

  return revenue;
}

export function calculateNetRevenueAfterCommission(revenue: number, channel: Channel): number {
  const commissionRate = COMMISSION_RATES[channel];
  return revenue * (1 - commissionRate);
}
