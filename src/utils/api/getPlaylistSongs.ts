import { IPlaylistSong } from "../../types/IPlaylistSong";
import { getSupabaseClient } from "../supabase";
import { ISong } from "../../types/ISong";

export const getPlaylistSongs = async (userId: string, playlistName: string): Promise<ISong[]> => {
  try {
    const supabase = getSupabaseClient();
    
    const { data: playlistEntries, error } = await supabase
      .from("playlists")
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
        ),
        createdAt
      `)
      .eq("user_id", userId)
      .eq("name", playlistName)
      .order("createdAt", { ascending: false })
      .returns<IPlaylistSong[]>();

    if (error) {
      throw new Error("Error fetching playlist songs: " + error.message);
    }

    if (!playlistEntries || playlistEntries.length === 0) {
      return [];
    }

    const songMap: Record<string, ISong> = {};

    for (const entry of playlistEntries) {
      const key = `${entry.title}_${entry.albumId}`;
      
      if (!songMap[key]) {
        songMap[key] = {
          title: entry.title,
          albumId: entry.albumId,
          cover: entry.albums.cover,
          bucketFolderName: entry.albums.bucketFolderName,
          authors: [entry.authors]
        };
      } else {
        const authorExists = songMap[key].authors.some(
          author => author.id === entry.authors.id
        );
        
        if (!authorExists) {
          songMap[key].authors.push(entry.authors);
        }
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
    throw new Error("Error fetching playlist songs: " + error);
  }
};