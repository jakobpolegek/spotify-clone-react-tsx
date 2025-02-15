import { LoaderFunctionArgs } from "react-router-dom";
import { getSupabaseClient } from "../supabase";

export const getAlbumWithFiles = async ({
  params: { albumId },
}: LoaderFunctionArgs): Promise<any> => {
  try {
    const supabase = getSupabaseClient();
    const { data: initialAlbum } = await supabase
      .from("albums")
      .select(
        `
        id,
        createdAt:created_at,
        title,
        bucketFolderName
        `
      )
      .eq("id", albumId)
      .single();

    if (!initialAlbum) {
      throw new Error(`Album does not exist.`);
    }

    const { data: albumWithAuthors } = await supabase
      .from("albums")
      .select(
        `
        id,
        createdAt:created_at,
        title,
        bucketFolderName,
        authors:author_id (
          id,
          name
        )`
      )
      .eq("bucketFolderName", initialAlbum.bucketFolderName);

    if (!albumWithAuthors || albumWithAuthors.length === 0) {
      throw new Error(`Album data could not be retrieved.`);
    }

    const authors = albumWithAuthors.map((album) => album.authors);

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("songs")
      .list(initialAlbum.bucketFolderName, {
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
      const coverPath = initialAlbum.bucketFolderName
        ? `${initialAlbum.bucketFolderName}/${coverFile.name}`
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
          const filePath = `${initialAlbum.bucketFolderName}/${file.name}`;
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("songs")
              .createSignedUrl(filePath, 18000);
          if (signedUrlError) {
            throw new Error("Error creating signed URL: " + signedUrlError);
          }

          return {
            title: file.name,
            source: signedUrlData?.signedUrl,
          };
        })
    );

    return {
      id: albumId,
      cover: coverUrl,
      createdAt: initialAlbum.createdAt,
      title: initialAlbum.title,
      bucketFolderName: initialAlbum.bucketFolderName,
      authors: authors,
      songs,
    };
  } catch (error) {
    throw new Error("Error fetching album data: " + error);
  }
};
