import { supabase } from "../supabase";

export const getAlbums = async (): Promise<any> => {
  const { data: albums } = await supabase.from("albums").select(`
        id,
        title,
        createdAt:created_at,
        bucketFolderName:bucket_folder_name,
        cover,
        authors:author_id (
          id,
          name
        )
      `);

  return albums;
};
