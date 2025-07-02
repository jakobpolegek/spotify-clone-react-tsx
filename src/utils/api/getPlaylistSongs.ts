import { IPlaylistSong } from '../../types/IPlaylistSong';
import { getSupabaseClient } from '../supabase';
import { ISong } from '../../types/ISong';

export const getPlaylistSongs = async (
  playlistId: string,
  userId: string
): Promise<ISong[]> => {
  try {
    const supabase = getSupabaseClient();

    const { data: playlistEntries, error } = await supabase
      .from('flattened_playlist_songs')
      .select(
        `
        title,
        albumId,
        name,
        albums:albumId (
          cover,
          bucketFolderName
        ),
        authors:authorId (
          id,
          name
        ),
        createdAt
      `
      )
      .eq('playlistId', playlistId)
      .eq('user_id', userId)
      .order('createdAt', { ascending: false })
      .returns<IPlaylistSong[]>();

    if (error) {
      throw new Error('Error fetching playlist songs: ' + error.message);
    }

    if (!playlistEntries || playlistEntries.length === 0) {
      return [];
    }

    const songMap: Record<string, ISong> = {};

    for (const entry of playlistEntries) {
      const key = `${entry.title}_${entry.albumId}`;
      const existingSong = songMap[key];

      if (!existingSong) {
        songMap[key] = {
          title: entry.title,
          albumId: entry.albumId,
          cover: entry.albums.cover,
          bucketFolderName: entry.albums.bucketFolderName,
          name: entry.name,
          authors: [entry.authors],
        };
      } else {
        if (existingSong.authors) {
          const authorExists = existingSong.authors.some(
            (author) => author.id === entry.authors.id
          );

          if (!authorExists) {
            existingSong.authors.push(entry.authors);
          }
        }
      }
    }

    await Promise.all(
      Object.entries(songMap).map(async ([, song]) => {
        const fileName = song.title;
        const filePath = song.bucketFolderName
          ? `${song.bucketFolderName}/${fileName}`
          : fileName;

        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage.from('songs').createSignedUrl(filePath, 18000);

        if (signedUrlError) {
          throw new Error(
            'Error creating signed URL: ' + signedUrlError.message
          );
        }

        song.source = signedUrlData?.signedUrl;
      })
    );
    return Object.values(songMap);
  } catch (error) {
    throw new Error('Error fetching playlist songs: ' + error);
  }
};
