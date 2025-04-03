import { getSupabaseClient } from "../supabase";

export const getPlaylistInfo = async (playlistId: string): Promise<any> => {
  const supabase = getSupabaseClient();
  const { data: albums } = await supabase.from("playlists").select(`
        id,
        name,
        cover_image_url
      `)
      .eq("id", playlistId)
      .single();

  return albums;
};
