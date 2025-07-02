import { ISearchResult } from '../../types/ISearchResult';
import { IPerformSearchArgs } from '../../types/IPerformSearchArgs';

const EDGE_FUNCTION_URL = import.meta.env
  .VITE_SUPABASE_PERFORM_SEARCH_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const callPerformSearchEdgeFunction = async ({
  query,
  userId,
  getClerkToken,
  signal,
}: IPerformSearchArgs): Promise<ISearchResult[]> => {
  if (!query?.trim()) return [];

  const clerkToken = await getClerkToken();
  if (!clerkToken) {
    throw new Error('User not authenticated.');
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${clerkToken}`,
      },
      body: JSON.stringify({ query, userId }),
      signal,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.error || data.message || `Request failed: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return [];
    }
    throw error;
  }
};
