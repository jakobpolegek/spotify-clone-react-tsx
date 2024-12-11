import { supabase } from "../supabase";
import { LoaderFunctionArgs } from "react-router-dom";

export const getAlbum = async ({
  params: { authorId, albumId },
}: LoaderFunctionArgs): Promise<any> => {
  const { data: album } = await supabase
    .from("albums")
    .select(
      `
        id,created_at,title,cover,
        authors:author_id (
            id,
            name
        ),
        songs!album_id(
            id,
            authors:author_id (
              id,
              name
            ),
            title,
            length,
            source
        )`
    )
    .eq("id", albumId)
    .eq("author_id", authorId)
    .single();

  if (!album) {
    throw new Error(`Album does not exist.`);
  }

  return album;
};
