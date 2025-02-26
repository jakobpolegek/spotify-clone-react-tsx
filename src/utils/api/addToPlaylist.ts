import { getSupabaseClient } from "../supabase";
import { ISong } from "../../types/ISong";

export const addToPlaylist = async ({
    playlistName,
    song,
    userId
}: { playlistName: string, song: ISong, userId: string }) => {
    try {
        const supabase = getSupabaseClient();
        
        const { data: existingSong } = await supabase
            .from("playlists")
            .select("*")
            .eq("user_id", userId)
            .eq("name", playlistName)
            .eq("albumId", song.albumId)
            .eq("title", song.title)
            .maybeSingle();
        
        if (!existingSong) {
            const { error } = await supabase
                .from("playlists")
                .insert({
                    user_id: userId,
                    name: playlistName,
                    albumId: song.albumId,
                    title: song.title
                });
            
            if (error) {
                console.error("Error adding song to playlist:", error);
                return { success: false, message: `Error: ${error.message}` };
            } else {
                return { success: true, message: "Song added to playlist" };
            }
        } else {
            return { success: true, message: "Song already exists in playlist" };
        }
    } catch (error) {
        console.error("Detailed error:", error);
        throw new Error("There was a problem adding to playlist: " + error);
    }
};