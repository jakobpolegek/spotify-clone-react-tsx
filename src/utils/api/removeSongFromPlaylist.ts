import { ISong } from '../../types/ISong';
import { getSupabaseClient } from '../supabase';

export const removeSongFromPlaylist = async (
  playlistId: string | null,
  song: ISong,
  userId: string
) => {
  try {
    const supabase = getSupabaseClient();
    await supabase
      .from('playlistSongs')
      .delete()
      .eq('user_id', userId)
      .eq('playlistId', playlistId)
      .eq('title', song.title)
      .eq('albumId', song.albumId);

    return { success: true, message: 'Song removed successfully.' };
  } catch (error) {
    throw new Error(
      'There was a problem removing song from playlist. ' + error
    );
  }
};
