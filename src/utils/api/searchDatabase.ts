import { getSupabaseClient } from "../supabase";
import { ISearchResult } from "../../types/ISearchResult";
const supabase = getSupabaseClient();

export const performSearch = async (
  query: string,
  userId: string,
  signal: AbortSignal
): Promise<ISearchResult[]> => {
  if (!query || query.trim() === "") {
    return [];
  }

  try {
    const unifiedSearchResults = await searchUnifiedView(query, userId, signal);
    const storageResults = await searchStorage(query);
    const distinctResults = [...unifiedSearchResults, ...storageResults].filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    );

    return distinctResults;
  } catch (error) {
    throw error;
  }
};

export const searchUnifiedView = async (
  query: string,
  userId: string,
  signal: AbortSignal
) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    console.warn("Search query is empty or invalid.");
    return [];
  }
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Invalid user.");
  }

  try {
    const filters = [
      `type.eq.album`,
      `type.eq.author`,
      `and(type.eq.liked_song,user_id.eq.${userId})`,
      `and(type.eq.playlist_song,user_id.eq.${userId})`,
      `and(type.eq.playlist,user_id.eq.${userId})`,
    ].join(",");

    const { data, error } = await supabase
      .from("unified_search")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .or(filters)
      .abortSignal(signal);

    if (error) {
      if (error.name === "AbortError" || error.message.includes("aborted")) {
      } else {
        throw new Error(
          "Error searching unified_search view (Supabase client error):" +
            error.message
        );
      }

      return [];
    }

    return data || [];
  } catch (catchError: any) {
    if (catchError.name === "AbortError") {
    } else {
      throw new Error("Error searching unified_search:" + catchError.message);
    }
    return [];
  }
};

const searchStorage = async (query: string): Promise<any[]> => {
  let allSongFilesProcessed: any[] = [];

  try {
    const { data: topLevelItems, error: topLevelError } = await supabase.storage
      .from("songs")
      .list("");

    if (topLevelError) {
      if (topLevelError.name === "AbortError") {
      } else {
        throw new Error(
          "Error searching unified_search:" + topLevelError.message
        );
      }
      return [];
    }

    if (!topLevelItems || topLevelItems.length === 0) {
      return [];
    }

    const albumProcessingPromises = topLevelItems.map(async (topItem) => {
      const songsFromThisSource: any[] = [];
      let albumCoverUrl: string | null = null;

      if (topItem.id === null) {
        const albumFolderName = topItem.name;
        const { data: folderContents, error: folderError } =
          await supabase.storage.from("songs").list(albumFolderName);

        if (folderError) {
          if (folderError.name === "AbortError") {
          } else {
            throw new Error(
              "Error searching unified_search:" + folderError.message
            );
          }
          return [];
        }

        if (folderContents && folderContents.length > 0) {
          for (const item of folderContents) {
            if (item.id !== null && item.name.toLowerCase().endsWith(".jpg")) {
              const coverImagePath = `${albumFolderName}/${item.name}`;
              const { data: signedUrlData, error: signedUrlError } =
                await supabase.storage
                  .from("songs")
                  .createSignedUrl(coverImagePath, 60 * 60 * 24);

              if (!signedUrlError && signedUrlData) {
                albumCoverUrl = signedUrlData.signedUrl;
              } else {
                throw new Error(
                  "Error finding cover image for one or more results."
                );
              }
              break;
            }
          }

          for (const item of folderContents) {
            if (item.id !== null && !item.name.toLowerCase().endsWith(".jpg")) {
              const songFilePath = `${albumFolderName}/${item.name}`;
              songsFromThisSource.push({
                supabaseFileObject: item,
                fullPath: songFilePath,
                albumCoverUrl: albumCoverUrl,
              });
            }
          }
        }
      } else {
        if (
          topItem.id !== null &&
          !topItem.name.toLowerCase().endsWith(".jpg")
        ) {
          songsFromThisSource.push({
            supabaseFileObject: topItem,
            fullPath: topItem.name,
            albumCoverUrl: null,
          });
        }
      }
      return songsFromThisSource;
    });

    const resultsBySource = await Promise.all(albumProcessingPromises);
    allSongFilesProcessed = resultsBySource.flat();

    if (allSongFilesProcessed.length === 0) {
      return [];
    }

    const matchingFiles = allSongFilesProcessed
      .filter((song) =>
        song.fullPath.toLowerCase().includes(query.toLowerCase())
      )
      .map((song) => ({
        createdAt: song.supabaseFileObject.created_at,
        title: song.fullPath.split("/").pop(),
        type: "storage_song",
        folder: song.fullPath.split("/").slice(0, -1).join("/"),
        image: song.albumCoverUrl,
      }));
    return matchingFiles;
  } catch (error: any) {
    if (error.name === "AbortError") {
    } else {
      throw new Error("Error searching unified_search:" + error.message);
    }
    return [];
  }
};
