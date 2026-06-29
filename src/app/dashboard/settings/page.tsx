import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Settings</h1>
      <p className="text-sm text-zinc-500 mt-1">Account & billing settings — coming soon.</p>
    </div>
  );
}
