import { getSupabaseClient } from "../supabase";

export const removePlaylist = async (
    playlistId: string,
    userId:string
) => {
  try {
    const supabase = getSupabaseClient();
    await supabase
    .from("playlists")
    .delete()
    .eq("user_id", userId)
    .eq("id", playlistId);

    return { success: true, message: "Playlists removed successfully." };
  } catch (error) {
      throw new Error("There was a problem removing song from playlist. " + error);
  }
};
