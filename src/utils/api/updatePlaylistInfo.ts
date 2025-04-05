import { getSupabaseClient } from "../supabase";

export const updatePlaylistInfo = async (
    playlistId: string,
    updates: {
        name?: string,
        cover_image_url?: string|null
    }
) => {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('playlists')
            .update(updates)
            .eq('id', playlistId);

        if (error) throw error;

        return true;
    } catch (error) {
        throw new Error('Error updating playlist info: ' + error);
    }
};