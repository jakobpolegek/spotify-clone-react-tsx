import { supabase } from "../supabase";

export const getAlbumsFromAuthor = async (authorId:number): Promise<any> => {
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
      `)
      .eq("author_id", authorId);

  return albums;
};
