import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { getClerkInstance } from '@clerk/expo'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Auth is handled by Clerk (Supabase third-party auth). Every request sends the
// current Clerk session token, and the RLS policies read the Clerk user ID from it.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    accessToken: async () => (await getClerkInstance().session?.getToken()) ?? null,
})
