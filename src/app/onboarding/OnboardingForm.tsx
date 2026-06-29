'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STAR_RATINGS = [1, 2, 3, 4, 5];

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    star_rating: 3,
    total_rooms: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.from('hotels').insert({
      owner_id: userId,
      name: form.name.trim(),
      address: form.address.trim() || null,
      city: form.city.trim(),
      star_rating: form.star_rating,
      total_rooms: parseInt(form.total_rooms),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Hotel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. The Grand Pune"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="e.g. Pune"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Total Rooms <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={9999}
              value={form.total_rooms}
              onChange={(e) => set('total_rooms', e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="e.g. 12 MG Road"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Star Rating
          </label>
          <div className="flex gap-2">
            {STAR_RATINGS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => set('star_rating', star)}
                className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-colors ${
                  form.star_rating === star
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'border-zinc-300 text-zinc-500 hover:border-zinc-400'
                }`}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Setting up…' : 'Set up my hotel →'}
        </button>
      </form>
    </div>
  );
}
