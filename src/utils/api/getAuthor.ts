import { LoaderFunctionArgs } from "react-router-dom";
import { supabase } from "../supabase";

export const getAuthor = async ({
  params: { artistId },
}: LoaderFunctionArgs): Promise<any> => {
  const { data: albums } = await supabase.from("authors").select(`
        id,
        name,
        description
      `)
      .eq("id", artistId)
      .single();

  return albums;
};
