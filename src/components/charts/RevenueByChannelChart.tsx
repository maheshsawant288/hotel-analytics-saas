'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Channel } from '@/types';

interface Props {
  data: Record<Channel, number>;
}

const CHANNEL_LABELS: Record<Channel, string> = {
  direct: 'Direct',
  booking_com: 'Booking.com',
  makemytrip: 'MakeMyTrip',
  agoda: 'Agoda',
  goibibo: 'Goibibo',
  expedia: 'Expedia',
  walk_in: 'Walk-in',
};

const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5'];

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function RevenueByChannelChart({ data }: Props) {
  const chartData = (Object.entries(data) as [Channel, number][])
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([channel, revenue], i) => ({
      name: CHANNEL_LABELS[channel],
      revenue,
      color: COLORS[i % COLORS.length],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-400 text-sm">
        No revenue data for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [fmt(Number(v)), 'Revenue']} cursor={{ fill: '#f4f4f5' }} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
