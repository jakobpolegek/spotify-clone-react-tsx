import { ISearchResult } from "../../types/ISearchResult";

const EDGE_FUNCTION_URL = import.meta.env
  .VITE_SUPABASE_PERFORM_SEARCH_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface PerformSearchArgs {
  query: string;
  userId: string;
  getClerkToken: () => Promise<string | null>;
  signal: AbortSignal;
}

export const callPerformSearchEdgeFunction = async ({
  query,
  userId,
  getClerkToken,
  signal,
}: PerformSearchArgs): Promise<ISearchResult[]> => {
  if (!query || query.trim() === "") return [];

  const clerkToken = await getClerkToken();
  if (!clerkToken) {
    throw new Error("User not authenticated. No Clerk token found.");
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${clerkToken}`,
      },
      body: JSON.stringify({ query, userId }),
      signal,
    });

    if (!response.ok) {
      let errorPayload: any = { message: "Unknown error" };
      try {
        errorPayload = await response.json();
      } catch {
        errorPayload = {
          message: response.statusText || `HTTP error ${response.status}`,
        };
      }
      throw new Error(
        errorPayload.error ||
          errorPayload.message ||
          "Failed to perform search."
      );
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      return [];
    }
    throw error;
  }
};
