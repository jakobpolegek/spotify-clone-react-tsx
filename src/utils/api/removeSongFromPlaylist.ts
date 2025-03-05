import { getSupabaseClient } from "../supabase";

export const removeSongFromPlaylist = async (userId: string, playlistName: string, title:string) => {
  try {
    const supabase = getSupabaseClient();
    await supabase
    .from("playlists")
    .delete()
    .match({
      user_id: userId,
      name:playlistName,
      title: title,
    })

    return { success: true, message: "Song removed successfully." };
  } catch (error) {
      throw new Error("There was a problem removing song from playlist. " + error);
  }
};
