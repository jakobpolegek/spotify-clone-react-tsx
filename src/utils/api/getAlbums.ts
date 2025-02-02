import { supabase } from "../supabase";

export const getAlbums = async (): Promise<any> => {
  const { data: albums } = await supabase.from("albums").select(`
        id,
        title,
        createdAt:created_at,
        bucketFolderName,
        cover,
        authors:author_id (
          id,
          name
        )
      `);

  return albums;
};
