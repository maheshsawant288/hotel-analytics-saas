import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: hotel } = await supabase
    .from('hotels')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (hotel) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Welcome to HotelLens</h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Set up your property in a few steps to unlock your analytics dashboard.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
