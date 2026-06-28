// Re-export from specific clients — use these instead of this file directly.
// For Server Components / Route Handlers: import { createClient } from '@/lib/supabase/server'
// For Client Components:                  import { createClient } from '@/lib/supabase/client'
export { createClient as createServerClient } from '@/lib/supabase/server';
export { createClient as createBrowserClient } from '@/lib/supabase/client';
