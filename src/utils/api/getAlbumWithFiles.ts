import { supabase } from "../supabase";
import { LoaderFunctionArgs } from "react-router-dom";

export const getAlbumWithFiles = async ({
  params: { authorId, albumId },
}: LoaderFunctionArgs): Promise<any> => {
  try {
    const { data: album } = await supabase
      .from("albums")
      .select(
        `
        id,
        created_at,
        title,
        bucket_folder_name,
        authors:author_id (
          id,
          name
        )`
      )
      .eq("id", albumId)
      .eq("author_id", authorId)
      .single();

    if (!album) {
      throw new Error(`Album does not exist.`);
    }

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("songs")
      .list(album.bucket_folder_name, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (storageError) {
      throw storageError;
    }
    const files = storageFiles.filter((item) => item.metadata?.mimetype);

    const coverFile = files.find(
      (file) =>
        file.name.toLowerCase() === "cover.jpg" ||
        file.name.toLowerCase() === "cover.png" ||
        file.name.toLowerCase() === "cover.jpeg"
    );

    let coverUrl = null;
    if (coverFile) {
      const coverPath = album.bucket_folder_name
        ? `${album.bucket_folder_name}/${coverFile.name}`
        : coverFile.name;
      const { data: signedUrlData } = await supabase.storage
        .from("songs")
        .createSignedUrl(coverPath, 18000);
      coverUrl = signedUrlData?.signedUrl;
    }

    const songs = await Promise.all(
      storageFiles
        .filter((item) => item.metadata?.mimetype && item !== coverFile)
        .map(async (file) => {
          const filePath = `${album.bucket_folder_name}/${file.name}`;
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("songs")
              .createSignedUrl(filePath, 18000);
          if (signedUrlError) {
            console.error("Error creating signed URL:", signedUrlError);
          }

          return {
            title: file.name,
            source: signedUrlData?.signedUrl,
          };
        })
    );

    return {
      id: album.id,
      cover: coverUrl,
      created_at: album.created_at,
      title: album.title,
      bucketFolderName: album.bucketFolderName,
      authors: album.authors,
      songs,
    };
  } catch (error) {
    console.error("Error fetching album data:", error);
    throw error;
  }
};
