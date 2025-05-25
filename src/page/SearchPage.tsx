import { useSearchParams } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "../components/ui/spinner";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { MusicIcon } from "lucide-react";
import { ISearchResult } from "../types/ISearchResult";
import { callPerformSearchEdgeFunction } from "../utils/api/callPerformSearch";

const SearchPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const debouncedQuery = useDebounce(query, 1000);
  const { user } = useUser();
  const { getToken } = useAuth();
  const getClerkToken = async () => {
    return await getToken({ template: "supabase" });
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  if (!user) {
    useEffect(() => {
      setLoading(false);
      setSearchResults([]);
    }, []);
  }

  useEffect(() => {
    if (!user || !user.id) {
      if (!user) setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const results = await callPerformSearchEdgeFunction({
          query: debouncedQuery,
          userId: user.id,
          getClerkToken,
          signal,
        });

        if (!signal.aborted) {
          setSearchResults(results);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
        } else {
          if (!signal.aborted) {
            setSearchResults([]);
          }

          throw new Error("Failed to perform search: " + err.message);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, user]);

  const totalResults = searchResults?.length;

  return (
      <div className="bg-slate-800 col-span-7 lg:col-span-9 row-span-11 h-full flex flex-col rounded border-0 p-4 overflow-y-scroll">
        {loading ? (
            <Spinner/>
        ) : totalResults && totalResults > 0 ? (
            <>
              {searchResults?.length > 0 && (
                  <div className="grid col-span-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults?.map((result: any) => (
                        <Link
                            to={(() => {
                              if (
                                  ["album", "song", "liked_song", "playlist_song"].includes(
                                      result.type
                                  )
                              ) {
                                return `/artist/${result.author_id}/albums/${result.routeToUrl}`;
                              }
                              switch (result.type) {
                                case "author":
                                  return `/artist/${result.routeToUrl}`;
                                case "playlist":
                                  return `/playlist/${result.routeToUrl}`;
                                case "storage_song":
                                  const [artistId, albumId] = result.folder.split("-");
                                  return `/artist/${artistId}/albums/${albumId}`;
                                default:
                                  return "/";
                              }
                            })()}
                            key={result.id || result.title || result}
                        >
                          <div
                              key={result.id || result.title || result}
                              className="flex items-center bg-slate-700 p-3 rounded hover:bg-slate-600 transition-colors w-full min-h-[100px] md:h-full"
                          >
                            <div className="flex-shrink-0 w-16 h-16 mr-3">
                              {result.image ? (
                                  <img
                                      src={result.image}
                                      alt={result.title}
                                      className="w-full h-full object-cover rounded"
                                  />
                              ) : (
                                  <MusicIcon className="w-full h-full object-cover rounded text-primary"/>
                              )}
                            </div>
                            <div className="overflow-hidden flex-1">
                              <h1 className="font-medium text-white text-lg break-words">
                                {result.title
                                    ?.replace(/^[0-9]{2}\s-\s/, "")
                                    .replace(/\.mp3$/, "")}
                              </h1>
                              <h3 className="font-light text-sm text-gray-400">
                                {(() => {
                                  switch (result.type) {
                                    case "album":
                                      return `Album`;
                                    case "author":
                                      return `Artist`;
                                    case "playlist":
                                      return `Playlist`;
                                    default:
                                      return "Song";
                                  }
                                })()}
                              </h3>
                            </div>
                          </div>
                        </Link>
                    ))}
                  </div>
              )}
            </>
        ) : query ? (
            <div className="text-center py-10">
              <p className="text-lg">No results found for "{query}".</p>
              <p className="text-gray-400 mt-2">
                Try different keywords or check your spelling.
              </p>
            </div>
        ) : (
            <div className="text-center py-10">
              <p className="text-lg">Enter a search term to see results.</p>
            </div>
        )}
      </div>
  );
};

export default SearchPage;
