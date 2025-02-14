import { createClerkSupabaseClient } from "../supabase";

export const getAlbumsFromAuthor = async (authorId:number, session:any): Promise<any> => {
  const supabase = createClerkSupabaseClient(session);
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
