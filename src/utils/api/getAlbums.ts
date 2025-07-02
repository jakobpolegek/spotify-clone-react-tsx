import { getSupabaseClient } from '../supabase';
import { IAlbum } from '../../types/IAlbum';

export const getAlbums = async (): Promise<IAlbum[]> => {
  const supabase = getSupabaseClient();

  const { data: albums, error } = await supabase
    .from('albums')
    .select(
      `
        id,
        title,
        createdAt:created_at,
        bucketFolderName,
        cover,
        authors:author_id (
          id,
          name
        )
      `
    )
    .returns<IAlbum[]>();

  if (error) {
    console.error('Error fetching albums:', error.message);
    throw new Error('Could not fetch albums.');
  }

  return albums || [];
};
