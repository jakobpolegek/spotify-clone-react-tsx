import { getSupabaseClient } from '../supabase';
import { IPlaylistInfo } from '../../types/IPlaylistInfo.ts';

export const getPlaylistInfo = async (
  playlistId: string
): Promise<IPlaylistInfo | null> => {
  const supabase = getSupabaseClient();
  const { data: playlists } = await supabase
    .from('playlists')
    .select(
      `
        id,
        name,
        cover_image_url
      `
    )
    .eq('id', playlistId)
    .single();

  return playlists;
};
