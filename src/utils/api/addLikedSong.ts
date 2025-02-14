import { createClerkSupabaseClient } from "../supabase";
import { ISong } from "../../types/ISong";

export const addLikedSong = async ({
  albumId,
  title,
  authors,
}: ISong, session:any) => {
  const supabase = createClerkSupabaseClient(session);

  try {
    if (!authors || authors.length === 0) {
      throw new Error("Authors array is empty.");
    }

    const existingRecordsPromises = authors.map(author =>
      supabase
        .from("likedSongs")
        .select("user_id, albumId, title, authorId")
        .eq("albumId", albumId)
        .eq("title", title)
        .eq("authorId", author.id)
    );

    const existingRecordsResults = await Promise.all(existingRecordsPromises);
    console.log(existingRecordsResults);
    const newAuthors = authors.filter((_, index) => {
      const { data } = existingRecordsResults[index];
      return !data || data.length === 0;
    });

    if (newAuthors.length === 0) {
      return {
        success: false,
        message: "All records already exist for this song and these authors."
      };
    }

    const insertData = newAuthors.map((author) => ({
      albumId,
      title,
      authorId: author.id,
    }));

    const results = await Promise.all(
      insertData.map((entry) => supabase.from("likedSongs").insert(entry))
    );

    results.forEach(({ error }, index) => {
      if (error) {
        throw new Error(
          `Error inserting record for author at index ${index}: ${error.message}`
        );
      }
    });

    return {
      success: true,
      message: `Liked song${newAuthors.length > 1 ? 's' : ''} added successfully.`,
      addedAuthors: newAuthors.length,
      skippedAuthors: authors.length - newAuthors.length
    };
  } catch (error) {
    throw new Error("There was a problem adding liked song. " + error);
  }
};