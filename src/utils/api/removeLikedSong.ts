import { getSupabaseClient } from "../supabase";
import { ISong } from "../../types/ISong";

export const removeLikedSong = async (userId: string, {
    albumId,
    title,
    authors,
  }: ISong) => {
    try {
      const supabase = getSupabaseClient();
      if (!authors || authors.length === 0) {
        throw new Error("Authors array is empty.");
      }
  
      const results = await Promise.all(
        authors.map((author) =>
          supabase
            .from("likedSongs")
            .delete()
            .match({
              user_id: userId,
              albumId: albumId,
              title: title,
              authorId: author.id,
            })
        )
      );
  
      results.forEach(({ error }, index) => {
        if (error) {
          throw new Error(
            `Error removing record for author at index ${index}: ${error.message}`
          );
        }
      });
  
      return { success: true, message: "Liked songs removed successfully." };
    } catch (error) {
        throw new Error("There was a problem removing liked song. " + error);
    }
  };
  