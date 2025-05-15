import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "../components/ui/spinner";
import { Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { performSearch } from "../utils/api/searchDatabase";
import { MusicIcon } from "lucide-react";
import { ISearchResult } from "../types/ISearchResult";

const SearchPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<ISearchResult[]>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const debouncedQuery = useDebounce(query, 500);
  const { user } = useUser();
  const abortControllerRef = useRef<AbortController | null>(null);

  if (!user) throw new Error("User not authenticated");

  useEffect(() => {
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
        const results = await performSearch(debouncedQuery, user.id, signal);

        const filteredResults = results.filter((result: ISearchResult) => {
          if (
            result.type === "author" ||
            result.type === "album" ||
            result.type === "storage_song"
          ) {
            return true;
          }

          return result.user_id === user.id;
        });
        setSearchResults(filteredResults);
      } catch (err: any) {
        if (err.name === "AbortError") {
        } else {
          throw new Error("Failed to perform search. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, user.id]);

  const totalResults = searchResults?.length;
  return (
    <div className="p-4 max-w-6xl mx-auto">
      {loading ? (
        <Spinner />
      ) : totalResults && totalResults > 0 ? (
        <div className="space-y-8">
          {searchResults?.length > 0 && (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.map((result: any) => (
                  <Link
                    to={(() => {
                      if (
                        [
                          "album",
                          "song",
                          "liked_song",
                          "playlist_song",
                        ].includes(result.type)
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
                      className="flex bg-slate-700 p-3 rounded hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex-shrink-0 w-16 h-16 mr-3">
                        {(() => {
                          if (
                            [
                              "album",
                              "author",
                              "liked_song",
                              "playlist_song",
                              "storage_song",
                            ].includes(result.type)
                          ) {
                            return (
                              <img
                                src={result.image}
                                alt={result.title}
                                className="w-full h-full object-cover rounded"
                              />
                            );
                          }
                          switch (result.type) {
                            case "playlist":
                              return (
                                <>
                                  {result.image ? (
                                    <img
                                      src={result.image}
                                      alt={result.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <MusicIcon className="text-primary w-full h-full object-cover rounded" />
                                  )}
                                </>
                              );
                            default:
                              return (
                                <MusicIcon className=" text-primary w-full h-full object-cover rounded" />
                              );
                          }
                        })()}
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-xl">
                          {result.title
                            ?.replace(/^[0-9]{2}\s-\s/, "")
                            .replace(/\.mp3$/, "") ||
                            result.name ||
                            result}
                        </h3>
                        <h3 className="font-light text-md text-gray-400">
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
            </section>
          )}
        </div>
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
