import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ActiveSessionResource, SessionResource } from '@clerk/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let currentSession: ActiveSessionResource | null = null;
let supabaseClient: SupabaseClient | null = null;

export const setCurrentSession = (
  session: ActiveSessionResource | null | undefined
) => {
  currentSession = session ?? null;
};

export const getCurrentSession = () => {
  return currentSession;
};

export function isSessionActive(
  session: SessionResource | null | undefined
): session is ActiveSessionResource {
  return session?.status === 'active';
}

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await currentSession?.getToken({
            template: 'supabase',
          });

          const headers = new Headers(options?.headers);
          if (clerkToken) {
            headers.set('Authorization', `Bearer ${clerkToken}`);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    });
  }

  return supabaseClient;
};
