import { getSupabaseClient } from '../supabase';

export const updatePlaylistInfo = async (
  playlistId: string,
  updates: {
    name?: string;
    cover_image_url?: string | null;
  }
) => {
  try {
    const supabase = getSupabaseClient();

    const updatesToSend: { name?: string; cover_image_url?: string | null } = {
      name: updates.name,
    };
    if (
      updates.cover_image_url !== null &&
      updates.cover_image_url !== undefined
    ) {
      updatesToSend.cover_image_url = updates.cover_image_url;
    }

    const { error } = await supabase
      .from('playlists')
      .update(updatesToSend)
      .eq('id', playlistId);

    if (error) throw error;

    return true;
  } catch (error) {
    throw new Error('Error updating playlist info: ' + error);
  }
};
