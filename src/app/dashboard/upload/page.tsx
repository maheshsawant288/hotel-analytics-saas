import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: hotel } = await supabase
    .from('hotels').select('id').eq('owner_id', user.id).single();
  if (!hotel) redirect('/onboarding');

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Upload Data</h1>
      <p className="text-sm text-zinc-500 mt-1">CSV booking upload — coming soon.</p>
    </div>
  );
}
