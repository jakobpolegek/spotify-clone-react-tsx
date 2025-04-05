import { getSupabaseClient } from "../supabase";

export const removeCurrentPlaylistCover = async (playlistId: string, userId: string) => {
  const supabase = getSupabaseClient();
  const bucketName = "playlist-covers"; // Set this statically

  try {
    const { data: playlist, error: fetchError } = await supabase
      .from('playlists')
      .select('cover_image_url')
      .eq('id', playlistId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const currentCoverUrl = playlist?.cover_image_url;
    if (!currentCoverUrl) return null; 

    const url = new URL(currentCoverUrl);
    const fullPath = url.pathname.split('/object/public/')[1];
    
    if (!fullPath) {
      throw new Error("Invalid storage URL format");
    }

    const filePath = fullPath.replace(`${bucketName}/`, '');

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) throw deleteError;

    return filePath;

  } catch (error) {
    throw new Error(`Failed to remove cover image: ` + error);
  }
};