'use client';

import { useEffect, useState } from 'react';
import { subDays, subMonths, format, eachDayOfInterval } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import {
  calculateOccupancyRate,
  calculateADR,
  calculateRevPAR,
  calculateCancellationRate,
  calculateRevenueByChannel,
} from '@/lib/kpi-calculations';
import { Booking, Hotel, Channel } from '@/types';
import KPICard from './KPICard';
import OccupancyChart from '@/components/charts/OccupancyChart';
import RevenueByChannelChart from '@/components/charts/RevenueByChannelChart';

type Range = '30D' | '90D' | '12M';

const RANGES: Range[] = ['30D', '90D', '12M'];

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function getDateRange(range: Range): { from: Date; to: Date } {
  const to = new Date();
  const from =
    range === '30D' ? subDays(to, 30)
    : range === '90D' ? subDays(to, 90)
    : subMonths(to, 12);
  return { from, to };
}

export default function DashboardClient({ userId }: { userId: string }) {
  const [range, setRange] = useState<Range>('30D');
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { from, to } = getDateRange(range);

      const { data: hotels } = await supabase
        .from('hotels')
        .select('*')
        .eq('owner_id', userId)
        .limit(1)
        .single();

      if (!hotels) { setHotel(null); setBookings([]); setLoading(false); return; }
      setHotel(hotels as Hotel);

      const { data: bkgs } = await supabase
        .from('bookings')
        .select('*')
        .eq('hotel_id', hotels.id)
        .gte('check_in', format(from, 'yyyy-MM-dd'))
        .lte('check_in', format(to, 'yyyy-MM-dd'));

      setBookings((bkgs ?? []) as Booking[]);
      setLoading(false);
    }
    load();
  }, [range, userId]);

  const { from, to } = getDateRange(range);
  const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  const totalRooms = hotel?.total_rooms ?? 0;
  const roomsAvailable = totalRooms * days;

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'no_show');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.room_rate ?? 0), 0);
  const roomsOccupied = activeBookings.length;

  const occupancy = calculateOccupancyRate(roomsOccupied, roomsAvailable);
  const adr = calculateADR(totalRevenue, roomsOccupied);
  const revpar = calculateRevPAR(totalRevenue, roomsAvailable);
  const cancellationRate = calculateCancellationRate(
    bookings.filter((b) => b.status === 'cancelled').length,
    bookings.length
  );
  const revenueByChannel = calculateRevenueByChannel(bookings);

  const occupancyTrend = eachDayOfInterval({ start: from, end: to }).map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const occupied = bookings.filter(
      (b) => b.check_in <= dateStr && b.check_out > dateStr &&
             b.status !== 'cancelled' && b.status !== 'no_show'
    ).length;
    return {
      date: dateStr,
      occupancy: totalRooms > 0 ? calculateOccupancyRate(occupied, totalRooms) : 0,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
        Loading…
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-zinc-500 text-sm">No hotel found. Add your hotel to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{hotel.name}</h1>
          <p className="text-sm text-zinc-500">{hotel.city} · {hotel.total_rooms} rooms</p>
        </div>
        <div className="flex gap-1 bg-zinc-100 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Revenue" value={fmt(totalRevenue)} sub={`${days} day period`} />
        <KPICard title="Occupancy Rate" value={`${occupancy.toFixed(1)}%`} sub={`${roomsOccupied} of ${roomsAvailable} room-nights`} />
        <KPICard title="ADR" value={roomsOccupied > 0 ? fmt(adr) : '—'} sub="Avg daily rate" />
        <KPICard title="RevPAR" value={roomsAvailable > 0 ? fmt(revpar) : '—'} sub="Rev per available room" />
        <KPICard title="Cancellation Rate" value={`${cancellationRate.toFixed(1)}%`} sub={`${bookings.filter(b => b.status === 'cancelled').length} of ${bookings.length} bookings`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Occupancy Trend</h2>
          <OccupancyChart data={occupancyTrend} />
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Revenue by Channel</h2>
          <RevenueByChannelChart data={revenueByChannel as Record<Channel, number>} />
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center">
          <p className="text-sm text-zinc-500">No bookings in this period.</p>
          <p className="text-xs text-zinc-400 mt-1">Upload your booking data to see insights.</p>
        </div>
      )}
    </div>
  );
}
