interface KPICardProps {
  title: string;
  value: string;
  sub?: string;
  trend?: number;
}

export default function KPICard({ title, value, sub, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
      {trend !== undefined && (
        <p className={`mt-2 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs last period
        </p>
      )}
    </div>
  );
}
