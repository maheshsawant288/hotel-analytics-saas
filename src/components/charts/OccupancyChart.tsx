'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

interface DataPoint {
  date: string;
  occupancy: number;
}

interface Props {
  data: DataPoint[];
}

export default function OccupancyChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-400 text-sm">
        No occupancy data for this period
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'dd MMM'),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={formatted} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, 'Occupancy']} />
        <Line type="monotone" dataKey="occupancy" stroke="#18181b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
