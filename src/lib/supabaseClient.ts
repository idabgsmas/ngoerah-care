import { createBrowserClient } from '@supabase/ssr'

// Browser client yang menyimpan session di cookies (bukan localStorage)
// Ini memungkinkan middleware Next.js membaca session untuk proteksi route
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)