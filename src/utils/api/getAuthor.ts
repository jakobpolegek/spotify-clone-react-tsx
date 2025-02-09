import { LoaderFunctionArgs } from "react-router-dom";
import { supabase } from "../supabase";

export const getAuthor = async ({
  params: { authorId },
}: LoaderFunctionArgs): Promise<any> => {
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
