import { getSupabaseClient } from "../supabase";
import { ISong } from "../../types/ISong";

export const addToPlaylist = async ({
  playlistName,
  song,
  userId
}: { playlistName: string, song: ISong, userId: string }) => {
  try {
    const supabase = getSupabaseClient();
    
    if (!song.authors || song.authors.length === 0) {
      throw new Error("Authors array is empty.");
    }

    const existingRecordsPromises = song.authors.map(author =>
      supabase
        .from("playlists")
        .select("*")
        .eq("user_id", userId)
        .eq("name", playlistName)
        .eq("albumId", song.albumId)
        .eq("title", song.title)
        .eq("authorId", author.id)
    );

    const existingRecordsResults = await Promise.all(existingRecordsPromises);
    
    const newAuthors = song.authors.filter((_, index) => {
      const { data } = existingRecordsResults[index];
      return !data || data.length === 0;
    });

    if (newAuthors.length === 0) {
      return {
        success: true,
        message: "All authors already exist for this song in the playlist",
        addedAuthors: 0,
        skippedAuthors: song.authors.length
      };
    }

    const insertData = newAuthors.map(author => ({
      user_id: userId,
      name: playlistName,
      albumId: song.albumId,
      title: song.title,
      authorId: author.id
    }));

    const results = await Promise.all(
      insertData.map(entry => supabase.from("playlists").insert(entry))
    );

    results.forEach(({ error }, index) => {
      if (error) {
        throw new Error(
          `Error inserting record for author ${newAuthors[index].name}: ${error.message}`
        );
      }
    });

    return {
      success: true,
      message: `Added to playlist for ${newAuthors.length} author${newAuthors.length > 1 ? 's' : ''}`,
      addedAuthors: newAuthors.length,
      skippedAuthors: song.authors.length - newAuthors.length
    };

  } catch (error) {
    console.error("Detailed error:", error);
    return {
      success: false,
      message: "There was a problem adding to playlist: " + (error as Error).message,
      addedAuthors: 0,
      skippedAuthors: 0
    };
  }
};