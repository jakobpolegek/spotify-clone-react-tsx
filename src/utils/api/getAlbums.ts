import { supabase } from "../supabase";

export const getAlbums = async (): Promise<any> => {
  const { data: albums } = await supabase.from("albums").select(`
        id,
        title,
        created_at,
        bucket_folder_name,
        cover,
        authors:author_id (
          id,
          name
        )
      `);

  return albums;
};
