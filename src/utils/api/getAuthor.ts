import { LoaderFunctionArgs } from "react-router-dom";
import { getSupabaseClient } from "../supabase";

export const getAuthor = async ({
  params: { authorId },
}: LoaderFunctionArgs): Promise<any> => {
  const supabase = getSupabaseClient();
  const { data: albums } = await supabase.from("authors").select(`
        id,
        name,
        description,
        image
      `)
      .eq("id", authorId)
      .single();

  return albums;
};
