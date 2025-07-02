import { getSupabaseClient } from '../supabase';
import { IPlaylist } from '../../types/IPlaylist';

export const getPlaylists = async (userId: string): Promise<IPlaylist[]> => {
  try {
    const supabase = getSupabaseClient();

    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('id, name, createdAt, user_id')
      .eq('user_id', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error('Error fetching playlists: ' + error.message);
    }

    if (!playlists || playlists.length === 0) {
      return [];
    }

    return playlists;
  } catch (error) {
    throw new Error('Error fetching playlists: ' + (error as Error).message);
  }
};
