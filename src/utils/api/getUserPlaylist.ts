import { getSupabaseClient } from "../supabase";

export const getUserPlaylists = async (userId: string) => {
    try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from("playlists")
            .select()
            .eq("user_id", userId);

        if (error) throw error;

        return {
            success: true,
            data: data || [],
            message: data?.length ? "Playlists found" : "No playlists exist"
        };

    } catch (error) {
        throw new Error("Error fetching playlists: " + error);
    }
};