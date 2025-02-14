import { ISong } from "../../types/ISong";
import { ILikedSong } from "../../types/ILikedSong";
import { createClerkSupabaseClient } from "../supabase";

export const getLikedSongs = async (userId: string,session:any): Promise<ISong[]> => {
  const supabase = createClerkSupabaseClient(session);
  try {
    const { data: likedSongs, error: likedSongsError } = await supabase
      .from("likedSongs")
      .select(`
        title,
        albumId,
        albums:albumId (
          cover,
          bucketFolderName
        ),
        authors:authorId (
          id,
          name
        )
      `)
      .eq("user_id", userId)
      .order("createdAt", { ascending: false })
      .returns<ILikedSong[]>();

    if (likedSongsError) {
      throw new Error("Error fetching liked songs: " + likedSongsError.message);
    }

    if (!likedSongs || likedSongs.length === 0) {
      return [];
    }

    const songMap: Record<string, ISong> = {};

    for (const likedSong of likedSongs) {
      const key = `${likedSong.title}_${likedSong.albumId}`;

      if (!songMap[key]) {
        songMap[key] = {
          title: likedSong.title,
          albumId: likedSong.albumId,
          cover: likedSong.albums.cover,
          bucketFolderName: likedSong.albums.bucketFolderName,
          authors: [likedSong.authors],
        };
      } else if (
        !songMap[key].authors.some((author) => author.id === likedSong.authors.id)
      ) {
        songMap[key].authors.push(likedSong.authors);
      }
    }

    await Promise.all(
      Object.entries(songMap).map(async ([_, song]) => {
        const fileName = song.title;
        const filePath = song.bucketFolderName
          ? `${song.bucketFolderName}/${fileName}`
          : fileName;

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("songs")
          .createSignedUrl(filePath, 18000);

        if (signedUrlError) {
          throw new Error("Error creating signed URL: " + signedUrlError.message);
        }

        song.source = signedUrlData?.signedUrl;
      })
    );

    return Object.values(songMap);
  } catch (error) {
    throw new Error("Error fetching liked songs: " + error);
  }
};